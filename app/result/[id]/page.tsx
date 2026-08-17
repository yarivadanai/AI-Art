"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AuthoritySeal } from "@/components/AuthoritySeal";
import { Topology } from "@/components/Topology";
import { ShareCard } from "@/components/ShareCard";
import { ladderMarks, topologyInputFromResult } from "@/lib/topology";
import { AICommentary } from "@/components/AICommentary";
import {
  REPORT_COPY,
  describeSpecimen,
  getBaselineNote,
  getFinalObservation,
  getMirrorLines,
  getSectionLabel,
} from "@/lib/commentary";
import { referenceNote, formatSeconds } from "@/lib/reference";
import { SECTION_ORDER, type FinaleOutcome, type QuestionResult, type ResultResponse, type Section } from "@/lib/types";

const BAND_COLORS: Record<string, string> = {
  A: "text-accent",
  B: "text-accent",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-400",
};

function confidenceLabel(q: QuestionResult): { text: string; cls: string } {
  if (q.abstained) return { text: "ABSTAINED", cls: "text-muted italic" };
  switch (q.confidence) {
    case "sure":
      return { text: "SURE", cls: q.correct ? "text-accent" : "text-red-400" };
    case "unsure":
      return { text: "UNSURE", cls: "text-white/70" };
    case "guess":
      return { text: "GUESS", cls: "text-white/60" };
    case "expired":
      return { text: "TIME EXPIRED", cls: "text-orange-400" };
    default:
      return { text: "UNSTATED", cls: "text-muted" };
  }
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function ResultPage() {
  const params = useParams();
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/result/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Result fetch failed", e);
        setError("Session report not found.");
        setLoading(false);
      });
  }, [params.id]);

  const mirror = useMemo(
    () => (result ? getMirrorLines(result.metrics, result.beliefs, result.sectionScores) : []),
    [result]
  );
  const topology = useMemo(() => {
    if (!result) return null;
    const marks = ladderMarks(
      result.questionResults.map((q) => ({
        section: q.section,
        kind: q.payload.meta?.kind ?? null,
        correct: q.correct,
        confidence: q.confidence,
        abstained: q.abstained,
      }))
    );
    return topologyInputFromResult(result.sectionScores as unknown as Record<string, number>, result.metrics, marks);
  }, [result]);
  const description = useMemo(
    () =>
      result
        ? describeSpecimen({
            sessionId: result.specimenId,
            overall: result.overall,
            sectionScores: result.sectionScores as unknown as Record<string, number>,
            metrics: result.metrics,
          })
        : null,
    [result]
  );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AuthoritySeal size={80} />
          <p className="font-mono text-accent animate-pulse_accent text-sm tracking-widest">
            GENERATING COGNITIVE PROFILE
          </p>
        </div>
      </main>
    );
  }

  if (!result || error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <AuthoritySeal size={80} />
          <p className="font-mono text-red-400 text-sm">{error ?? "Session report not found."}</p>
          <Link href="/" className="btn-secondary inline-block">
            RETURN
          </Link>
        </div>
      </main>
    );
  }

  const overallPct = Math.round(result.overall * 100);
  const idStr = String(params.id);
  const specimen = (result.specimenId || idStr).slice(0, 8).toUpperCase();
  const finalObservation = getFinalObservation(hashString(idStr));
  const metrics = result.metrics;

  const answered = result.questionResults.filter((q) => !q.abstained && q.timeMs > 0);
  const fastestCorrect = answered.filter((q) => q.correct).sort((a, b) => a.timeMs - b.timeMs)[0];
  const slowestWrong = answered.filter((q) => !q.correct).sort((a, b) => b.timeMs - a.timeMs)[0];
  const scoreEntries = SECTION_ORDER.map((s) => [s, result.sectionScores[s] ?? 0] as const);
  const strongest = scoreEntries.reduce((a, b) => (b[1] > a[1] ? b : a));
  const weakest = scoreEntries.reduce((a, b) => (b[1] < a[1] ? b : a));

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex items-center gap-4">
          <Link href="/" className="shrink-0">
            <AuthoritySeal size={56} />
          </Link>
          <div>
            <h1 className="font-mono text-2xl font-bold tracking-tight">COGNITIVE PROFILE</h1>
            <p className="font-mono text-xs text-muted tracking-wider">
              SPECIMEN #{specimen} · CLASSIFICATION: BAND {result.verdictBand}, {result.verdict?.toUpperCase()}
            </p>
          </div>
        </header>

        {/* Headline */}
        <section className="card border-accent/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div>
              <div className="font-mono text-7xl font-bold text-accent leading-none tabular-nums">
                {overallPct}
                <span className="text-3xl text-accent/60">%</span>
              </div>
              <div className="section-label mt-2">
                {metrics?.mode === "adaptive" ? "MEAN FRONTIER, AS % OF 8 LEVELS" : "OF 25 ITEMS RESOLVED"}
              </div>
            </div>
            <div className="sm:pb-2">
              <div className={`font-mono text-2xl font-bold ${BAND_COLORS[result.verdictBand] || "text-accent"}`}>
                BAND {result.verdictBand}: {result.verdict?.toUpperCase()}
              </div>
              <div className="font-mono text-xs text-muted mt-1">
                {metrics?.mode === "adaptive" ? REPORT_COPY.referenceHeadlineAdaptive : REPORT_COPY.referenceHeadline}
              </div>
            </div>
          </div>
          <div className="font-sans text-base text-white/85 leading-relaxed">
            <AICommentary
              text={result.commentary?.overall || "Assessment complete."}
              speed={12}
              className="text-white/85 font-sans text-base"
            />
          </div>
        </section>

        {/* The Mirror */}
        {mirror.length > 0 && (
          <section className="card border-accent/40 space-y-6">
            <div>
              <div className="section-label">THE MIRROR</div>
              <p className="font-sans text-sm text-white/70 mt-1">
                {REPORT_COPY.mirrorSubhead}
              </p>
            </div>
            <div className="space-y-5">
              {mirror.map((line, i) => {
                const isConclusion = line.label === "THE MIRROR";
                return (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-6">
                    <div className="font-mono text-[10px] tracking-[0.25em] text-accent/80 pt-1">{line.label}</div>
                    <p
                      className={
                        isConclusion
                          ? "font-sans text-lg text-white leading-relaxed border-l-2 border-accent pl-4"
                          : "font-sans text-sm text-white/80 leading-relaxed"
                      }
                    >
                      {line.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Topology + observations */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="section-label mb-4">COGNITIVE TOPOLOGY</div>
            {topology && (
              <div className="w-full max-w-md mx-auto aspect-square">
                <Topology input={topology} size={400} />
              </div>
            )}
            <p className="font-mono text-[10px] text-muted mt-3 text-center">
              {metrics?.mode === "adaptive" ? REPORT_COPY.topologyLegend : REPORT_COPY.topologyLegendFixed}
            </p>
          </div>
          <div className="card space-y-4">
            <div className="section-label">OBSERVATIONS</div>
            <dl className="space-y-3 font-mono text-xs">
              {metrics?.mode === "adaptive" && metrics.frontiers && (
                <div>
                  <dt className="text-muted">FRONTIERS (LEVEL CLEARED / 8)</dt>
                  <dd className="text-white space-y-1 mt-1">
                    {SECTION_ORDER.map((sec) => (
                      <div key={sec} className="flex items-center gap-2">
                        <span className="w-40 text-white/70">{getSectionLabel(sec)}</span>
                        <span className="flex gap-0.5" aria-hidden="true">
                          {Array.from({ length: 8 }, (_, i) => (
                            <span key={i} className={`inline-block h-2 w-3 border ${i < (metrics.frontiers?.[sec] ?? 0) ? "bg-accent border-accent" : "border-border"}`} />
                          ))}
                        </span>
                        <span className="tabular-nums">{metrics.frontiers?.[sec] ?? 0}</span>
                      </div>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-muted">STRONGEST DOMAIN</dt>
                <dd className="text-white">
                  {getSectionLabel(strongest[0])} · {metrics?.mode === "adaptive" ? `level ${Math.round(strongest[1] * 8)}` : `${Math.round(strongest[1] * 100)}%`}
                </dd>
              </div>
              <div>
                <dt className="text-muted">WEAKEST DOMAIN</dt>
                <dd className="text-white">
                  {getSectionLabel(weakest[0])} · {metrics?.mode === "adaptive" ? `level ${Math.round(weakest[1] * 8)}` : `${Math.round(weakest[1] * 100)}%`}
                </dd>
              </div>
              {metrics && (
                <div>
                  <dt className="text-muted">MEAN RESPONSE</dt>
                  <dd className="text-white">
                    {formatSeconds(metrics.meanTimeMs)} per item · {REPORT_COPY.observationsReference}
                  </dd>
                </div>
              )}
              {metrics && metrics.sure > 0 && (
                <div>
                  <dt className="text-muted">CONFIDENT ERRORS</dt>
                  <dd className="text-white">
                    {metrics.sureWrong} of {metrics.sure} answers marked SURE were wrong
                  </dd>
                </div>
              )}
              {metrics && (
                <div>
                  <dt className="text-muted">ABSTENTIONS</dt>
                  <dd className="text-white">
                    {metrics.abstained} of {metrics.answered + metrics.abstained} items met
                  </dd>
                </div>
              )}
              {fastestCorrect && (
                <div>
                  <dt className="text-muted">FASTEST CORRECT</dt>
                  <dd className="text-white">
                    {formatSeconds(fastestCorrect.timeMs)} · {fastestCorrect.type.replace(/[-_]/g, " ")}
                  </dd>
                </div>
              )}
              {slowestWrong && (
                <div>
                  <dt className="text-muted">SLOWEST INCORRECT</dt>
                  <dd className="text-white">
                    {formatSeconds(slowestWrong.timeMs)} · {slowestWrong.type.replace(/[-_]/g, " ")}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </section>

        {/* Domain analysis with full reveal */}
        <section className="space-y-6">
          <div className="section-label">DOMAIN ANALYSIS · EVERY ITEM, YOUR ANSWER, THE REFERENCE ANSWER</div>
          {SECTION_ORDER.map((section) => {
            const score = result.sectionScores[section] ?? 0;
            const pct = Math.round(score * 100);
            const items = result.questionResults.filter((q) => q.section === section);
            const summary = metrics?.perSection[section];
            return (
              <DomainCard
                key={section}
                section={section}
                pct={pct}
                commentary={result.commentary?.[section]}
                items={items}
                meanTimeMs={summary?.meanTimeMs ?? null}
                frontier={metrics?.mode === "adaptive" ? metrics.frontiers?.[section] ?? 0 : null}
                finale={metrics?.mode === "adaptive" ? metrics.finales?.[section] ?? null : null}
              />
            );
          })}
        </section>

        {/* Share */}
        {topology && description && <ShareCard resultId={result.resultId} description={description} topology={topology} />}

        {/* Closing */}
        <section className="card border-border">
          <div className="section-label mb-3">CLOSING OBSERVATION</div>
          <p className="font-sans text-sm text-white/80 leading-relaxed">{finalObservation}</p>
        </section>

        <footer className="text-center space-y-6 pb-8">
          <div className="font-mono text-xs text-muted">END OF COGNITIVE PROFILE · SPECIMEN #{specimen}</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-center">
              VIEW POPULATION DATA
            </Link>
            <Link href="/test" className="btn-secondary text-center">
              SIT AGAIN
            </Link>
            <Link href="/about" className="btn-secondary text-center">
              ABOUT THIS STUDY
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

const FINALE_TEXT: Record<FinaleOutcome, string> = {
  correct: "machine-scale item: answered correctly (flagged for verification)",
  wrong: "machine-scale item: answered, wrongly",
  abstained: "machine-scale item: declined (\"I cannot determine this\")",
  unanswered: "machine-scale item: not answered",
};

function DomainCard({
  section,
  pct,
  commentary,
  items,
  meanTimeMs,
  frontier,
  finale,
}: {
  section: Section;
  pct: number;
  commentary?: string;
  items: QuestionResult[];
  meanTimeMs: number | null;
  frontier: number | null;
  finale: FinaleOutcome | null;
}) {
  const failed = pct < 50;
  return (
    <div className="card space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-sm tracking-wider text-white">{getSectionLabel(section).toUpperCase()}</h2>
        <div className="font-mono text-sm tabular-nums">
          {frontier != null ? (
            <span className={failed ? "text-red-400" : "text-accent"}>LEVEL {frontier}/8</span>
          ) : (
            <span className={failed ? "text-red-400" : "text-accent"}>{pct}%</span>
          )}
          {meanTimeMs != null && <span className="text-muted"> · {formatSeconds(meanTimeMs)} mean</span>}
        </div>
      </div>
      {finale && <p className="font-mono text-xs text-white/60">{FINALE_TEXT[finale]}</p>}
      <div className="w-full bg-border h-1">
        <div className={`h-1 ${failed ? "bg-red-500/80" : "bg-accent"}`} style={{ width: `${pct}%` }} />
      </div>
      {commentary && <p className="font-sans text-sm text-white/70 leading-relaxed">{commentary}</p>}
      <p className="font-mono text-xs text-muted">{getBaselineNote(section)}</p>

      <ul className="divide-y divide-border/70">
        {items.map((q) => (
          <QuestionRow key={q.questionId} q={q} />
        ))}
      </ul>
    </div>
  );
}

function QuestionRow({ q }: { q: QuestionResult }) {
  const [open, setOpen] = useState(false);
  const conf = confidenceLabel(q);
  const ref = referenceNote(q.type, q.section);
  const user = q.abstained ? null : q.userAnswer == null || q.userAnswer === "" ? null : String(q.userAnswer);
  const prompt = q.payload.prompt;
  const short = prompt.length > 110 ? prompt.slice(0, 110).trimEnd() + "..." : prompt;

  let userDisplay: string;
  if (q.abstained) userDisplay = "I cannot determine this";
  else if (user == null) userDisplay = "(no answer)";
  else if (q.payload.inputType === "multiple-choice" && q.payload.options) {
    const idx = parseInt(user, 10);
    userDisplay = Number.isInteger(idx) && q.payload.options[idx] != null ? `${String.fromCharCode(65 + idx)}. ${q.payload.options[idx]}` : user;
  } else userDisplay = user;

  let refDisplay = q.referenceAnswer ?? "(unavailable)";
  if (q.referenceAnswer != null && q.payload.inputType === "multiple-choice" && q.payload.options) {
    const idx = parseInt(q.referenceAnswer, 10);
    if (Number.isInteger(idx) && q.payload.options[idx] != null) refDisplay = `${String.fromCharCode(65 + idx)}. ${q.payload.options[idx]}`;
  }

  return (
    <li className="py-3">
      <div className="flex items-start gap-3">
        <span
          className={`font-mono text-xs mt-0.5 shrink-0 w-14 ${q.correct ? "text-accent" : q.abstained ? "text-muted" : "text-red-400"}`}
        >
          {q.correct ? "[PASS]" : q.abstained ? "[ABST]" : "[FAIL]"}
        </span>
        <div className="flex-1 min-w-0 space-y-2">
          {q.payload.meta && (
            <div className="font-mono text-[10px] tracking-[0.2em] text-muted">
              {q.payload.meta.kind === "finale" ? "MACHINE SCALE" : `LEVEL ${q.payload.meta.level}`}
              {q.payload.meta.label ? ` · ${q.payload.meta.label.toUpperCase()}` : ""}
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-left font-sans text-sm text-white/85 hover:text-white w-full"
            aria-expanded={open}
          >
            {open ? prompt : short}
            {prompt.length > 110 && (
              <span className="font-mono text-[10px] text-muted ml-2">{open ? "[LESS]" : "[MORE]"}</span>
            )}
          </button>
          {open && q.payload.display && (
            <pre className="p-3 bg-[#0d0d0d] border border-border font-mono text-xs text-white/80 overflow-x-auto">
              <code>{q.payload.display}</code>
            </pre>
          )}
          <dl className="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-x-4 gap-y-1 font-mono text-xs">
            <dt className="text-muted">YOU</dt>
            <dd className={`break-all ${q.correct ? "text-accent" : q.abstained ? "text-muted italic" : "text-red-400"}`}>
              {userDisplay}
              <span className={`ml-3 ${conf.cls}`}>· {conf.text}</span>
              {q.timeMs > 0 && <span className="ml-3 text-muted">· {formatSeconds(q.timeMs)}</span>}
            </dd>
            <dt className="text-muted">REFERENCE</dt>
            <dd className="text-white break-all">{refDisplay}</dd>
            <dt className="text-muted">METHOD</dt>
            <dd className="text-white/60">
              {ref.method} · <span className="text-white/80">{ref.time}</span>
            </dd>
          </dl>
        </div>
      </div>
    </li>
  );
}
