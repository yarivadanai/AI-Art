import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/db";
import { REPORT_COPY, describeSpecimen } from "@/lib/commentary";
import { computeTopology, ladderMarks, polygonPath, topologyInputFromResult, type MarkRow } from "@/lib/topology";
import type { QuestionPayload, Section, SessionMetrics } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACCENT = "#4a9eff";
const RED = "#f87171";
const BG = "#0a0a0a";
const FONT = "JetBrains Mono";

// The report's monospace face, bundled with the route so the image is typeset
// like the page (next/og only ships Noto Sans). Read once per instance; the
// process.cwd() join is what Next's file tracing follows into the function
// bundle (next.config also lists the folder explicitly).
const FONT_DIR = join(process.cwd(), "app", "api", "og", "_fonts");
let fontsPromise: Promise<{ name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[]> | null = null;
function fonts() {
  fontsPromise ??= Promise.all([readFile(join(FONT_DIR, "JetBrainsMono-Regular.ttf")), readFile(join(FONT_DIR, "JetBrainsMono-Bold.ttf"))]).then(
    ([regular, bold]) => [
      { name: FONT, data: toArrayBuffer(regular), weight: 400 as const, style: "normal" as const },
      { name: FONT, data: toArrayBuffer(bold), weight: 700 as const, style: "normal" as const },
    ]
  );
  return fontsPromise;
}
function toArrayBuffer(b: Buffer): ArrayBuffer {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
}

const NO_STORE = { "cache-control": "no-store" };

function placeholder(text: string, status: number) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: BG, color: "#666", fontSize: 28 }}>
        {text}
      </div>
    ),
    { width: 1200, height: 630, status, headers: NO_STORE }
  );
}

/**
 * GET /api/og/:resultId - 1200x630 share image: the specimen's topology on the
 * left, classification and frontiers on the right. Same geometry and the same
 * description as the report's specimen card and the page metadata. Never
 * includes answers. Misses are 404 and uncacheable so a stale placeholder is
 * never pinned at a CDN.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  let result;
  let rows: MarkRow[] = [];
  try {
    result = await prisma.result.findUnique({ where: { id: params.id } });
    if (result) {
      const responses = await prisma.response.findMany({
        where: { sessionId: result.sessionId },
        include: { question: { select: { section: true, payload: true } } },
      });
      rows = responses.map((r) => ({
        section: r.question.section as Section,
        kind: (r.question.payload as unknown as QuestionPayload).meta?.kind ?? null,
        correct: r.correct,
        confidence: r.confidence,
        abstained: r.abstained,
      }));
    }
  } catch (e) {
    console.error("og image: lookup failed", { id: params.id, error: e });
    return placeholder("MICA: profile unavailable", 500);
  }
  if (!result) return placeholder("MICA: profile not found", 404);

  const metrics = (result.metrics as unknown as SessionMetrics | null) ?? null;
  const scores = result.sectionScores as Record<string, number>;
  const input = topologyInputFromResult(scores, metrics, ladderMarks(rows));
  const size = 520;
  const g = computeTopology(input, size);
  const d = describeSpecimen({ sessionId: result.sessionId, overall: result.overall, sectionScores: scores, metrics });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: BG,
          color: "#ffffff",
          fontFamily: FONT,
          padding: 40,
        }}
      >
        {/* Figure */}
        <div style={{ display: "flex", width: size, height: size, alignItems: "center", justifyContent: "center", marginTop: 15 }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {g.ringRadii.map((r, i) => (
              <circle
                key={i}
                cx={g.cx}
                cy={g.cy}
                r={r}
                fill="none"
                stroke={i === g.ringRadii.length - 1 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.08)"}
                strokeWidth={i === g.ringRadii.length - 1 ? 1.5 : 1}
                strokeDasharray={i === g.ringRadii.length - 1 ? "6 6" : undefined}
              />
            ))}
            {g.axes.map((a, i) => (
              <line key={i} x1={g.cx} y1={g.cy} x2={a.outer.x} y2={a.outer.y} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            ))}
            <path d={polygonPath(g.polygon)} fill={ACCENT} fillOpacity={0.18} stroke={ACCENT} strokeWidth={3} />
            {g.axes.map((a, i) => (
              <circle key={`v${i}`} cx={a.frontier.x} cy={a.frontier.y} r={5} fill={ACCENT} />
            ))}
            {g.axes.flatMap((a, i) => a.errorDots.map((p, k) => <circle key={`e${i}-${k}`} cx={p.x} cy={p.y} r={3.5} fill={RED} />))}
            {g.axes.flatMap((a, i) =>
              a.abstainRings.map((p, k) => <circle key={`a${i}-${k}`} cx={p.x} cy={p.y} r={3.5} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={1.5} />)
            )}
            {g.axes.flatMap((a, i) => a.latencyTicks.map((p, k) => <circle key={`t${i}-${k}`} cx={p.x} cy={p.y} r={1.8} fill="rgba(255,255,255,0.5)" />))}
            {g.axes.map((a, i) =>
              a.finale === "correct" ? (
                <circle key={`f${i}`} cx={a.outer.x} cy={a.outer.y} r={6} fill={ACCENT} />
              ) : a.finale === "wrong" ? (
                <circle key={`f${i}`} cx={a.outer.x} cy={a.outer.y} r={6} fill={RED} />
              ) : a.finale === "abstained" ? (
                <circle key={`f${i}`} cx={a.outer.x} cy={a.outer.y} r={6} fill={BG} stroke="rgba(255,255,255,0.85)" strokeWidth={2} />
              ) : null
            )}
          </svg>
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, marginLeft: 30, paddingTop: 10, paddingBottom: 10 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 18, letterSpacing: 6, color: "#666" }}>{REPORT_COPY.ogHeader}</div>
            <div style={{ fontSize: 34, marginTop: 10, fontWeight: 700 }}>{`SPECIMEN #${d.specimen}`}</div>
            <div style={{ fontSize: 26, marginTop: 6, color: d.band === "F" ? RED : ACCENT }}>{`BAND ${d.band}: ${d.label.toUpperCase()}`}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {d.rows.map((r) => (
              <div key={r.section} style={{ display: "flex", alignItems: "center", fontSize: 20 }}>
                <div style={{ width: 130, color: "#cccccc" }}>{r.short.toUpperCase()}</div>
                <div style={{ display: "flex", width: 260, height: 10, background: "#1e1e1e" }}>
                  <div style={{ display: "flex", width: Math.round(260 * r.frac), height: 10, background: ACCENT }} />
                </div>
                <div style={{ marginLeft: 16, color: "#ffffff" }}>{r.value}</div>
              </div>
            ))}
            <div style={{ fontSize: 15, color: "#666", marginTop: 4 }}>{d.adaptive ? REPORT_COPY.ogScaleAdaptive : REPORT_COPY.ogScaleFixed}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, color: "#ffffff" }}>{REPORT_COPY.tagline}</div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 6, letterSpacing: 1 }}>{REPORT_COPY.subtitle}</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: await fonts() }
  );
}
