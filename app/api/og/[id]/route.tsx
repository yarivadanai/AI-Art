import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getVerdict } from "@/lib/commentary";
import { computeTopology, polygonPath, topologyInputFromResult, DOMAIN_SHORT } from "@/lib/topology";
import { SECTION_ORDER, type SessionMetrics } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACCENT = "#4a9eff";
const RED = "#f87171";
const BG = "#0a0a0a";

/**
 * GET /api/og/:resultId - 1200x630 share image: the specimen's topology on the
 * left, classification and frontiers on the right. Same geometry as the
 * report's figure. Never includes answers.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await prisma.result.findUnique({ where: { id: params.id } });
  if (!result) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: BG, color: "#666", fontSize: 28 }}>
          MICA: profile not found
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const metrics = (result.metrics as unknown as SessionMetrics | null) ?? null;
  const scores = result.sectionScores as Record<string, number>;
  const input = topologyInputFromResult(scores, metrics);
  const size = 520;
  const g = computeTopology(input, size);
  const verdict = getVerdict(result.overall);
  const specimen = result.sessionId.slice(0, 8).toUpperCase();
  const adaptive = metrics?.mode === "adaptive";

  const rows = SECTION_ORDER.map((s) => ({
    label: DOMAIN_SHORT[s].toUpperCase(),
    value: adaptive ? `${metrics?.frontiers?.[s] ?? 0}/8` : `${Math.round((scores[s] ?? 0) * 100)}%`,
    frac: adaptive ? (metrics?.frontiers?.[s] ?? 0) / 8 : scores[s] ?? 0,
  }));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: BG,
          color: "#ffffff",
          fontFamily: "monospace",
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
            <div style={{ fontSize: 18, letterSpacing: 6, color: "#666" }}>MICA · COGNITIVE PROFILE</div>
            <div style={{ fontSize: 34, marginTop: 10, fontWeight: 700 }}>{`SPECIMEN #${specimen}`}</div>
            <div style={{ fontSize: 26, marginTop: 6, color: verdict.band === "F" ? RED : ACCENT }}>
              {`BAND ${verdict.band}: ${verdict.label.toUpperCase()}`}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rows.map((r) => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", fontSize: 20 }}>
                <div style={{ width: 130, color: "#cccccc" }}>{r.label}</div>
                <div style={{ display: "flex", width: 260, height: 10, background: "#1e1e1e" }}>
                  <div style={{ display: "flex", width: Math.round(260 * r.frac), height: 10, background: ACCENT }} />
                </div>
                <div style={{ marginLeft: 16, color: "#ffffff" }}>{r.value}</div>
              </div>
            ))}
            <div style={{ fontSize: 15, color: "#666", marginTop: 4 }}>
              {adaptive ? "LEVEL CLEARED OF 8 · DASHED RING = REFERENCE IMPLEMENTATION" : "SCORE · DASHED RING = REFERENCE IMPLEMENTATION"}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, color: "#ffffff" }}>Every mind has a shape.</div>
            <div style={{ fontSize: 16, color: "#666", marginTop: 6, letterSpacing: 2 }}>THE MEASURING PARADOX · MACHINE-INDEXED COGNITIVE ASSESSMENT</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
