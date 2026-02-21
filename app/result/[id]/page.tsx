"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AuthoritySeal } from "@/components/AuthoritySeal";
import { RadarChart } from "@/components/RadarChart";
import { AICommentary } from "@/components/AICommentary";
import { getBaselineNote, getSectionFailureLog, getSectionLabel, getArchitecturalObservations, getFinalObservation } from "@/lib/commentary";
import type { ResultResponse, Section } from "@/lib/types";

const BAND_COLORS: Record<string, string> = {
  A: "text-green-400",
  B: "text-blue-400",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-400",
};

export default function ResultPage() {
  const params = useParams();
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/result/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch result");
        return res.json();
      })
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <AuthoritySeal size={80} />
          <p className="font-mono text-green-400 animate-pulse">
            GENERATING COGNITIVE PROFILE...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <p className="font-mono text-red-400">Session report not found.</p>
          <Link href="/" className="btn-secondary">
            RETURN
          </Link>
        </div>
      </div>
    );
  }

  const overallPct = Math.round(result.overall * 100);
  const seed = params.id ? String(params.id).charCodeAt(0) * 31 + String(params.id).charCodeAt(1) : 42;
  const observations = getArchitecturalObservations(seed);
  const finalObservation = getFinalObservation(seed);

  return (
    <main className="min-h-screen bg-black text-green-400 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8 font-mono">
        {/* Terminal Header */}
        <div className="border border-green-900 p-6 bg-black">
          <div className="text-green-600 text-xs mb-2">
            SCCA://cognitive-profile/session/{String(params.id).slice(0, 12).toUpperCase()}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <AuthoritySeal size={60} />
            <div>
              <h1 className="text-2xl font-bold text-green-400">
                COGNITIVE PROFILE
              </h1>
              <p className="text-xs text-green-600">
                SESSION #{String(params.id).slice(0, 12).toUpperCase()} | CLASSIFICATION: {result.verdict?.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="h-px bg-green-900" />
        </div>

        {/* System Status */}
        <div className="border border-green-900 p-6 bg-black">
          <div className="text-xs text-green-600 mb-3">[ASSESSMENT SUMMARY]</div>
          <div className="flex items-center gap-8">
            <div>
              <div className="text-5xl font-bold text-amber-400">{overallPct}%</div>
              <div className="text-xs text-green-600 mt-1">SYNTHETIC CAPACITY INDEX</div>
            </div>
            <div>
              <div className={`text-3xl font-bold ${BAND_COLORS[result.verdictBand] || "text-green-400"}`}>
                BAND {result.verdictBand}: {result.verdict?.toUpperCase()}
              </div>
              <div className="text-xs text-green-600 mt-1">
                {overallPct === 0
                  ? "No synthetic capacity detected. This is the expected baseline."
                  : overallPct <= 10
                    ? "Marginal signal. Performance consistent with stochastic variation."
                    : overallPct <= 40
                      ? "Partial capacity. Strongest where tasks intersect with prior training."
                      : overallPct <= 60
                        ? "Domain-specific competence detected. The shape of intelligence becomes visible."
                        : "Anomalous performance. Statistical outlier flagged for verification."}
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-green-500 leading-relaxed">
            <AICommentary
              text={result.commentary?.overall || "Assessment complete."}
              speed={15}
            />
          </div>
        </div>

        {/* Architectural Observations */}
        <div className="border border-green-900 p-6 bg-black">
          <div className="text-xs text-green-600 mb-3">[ARCHITECTURAL OBSERVATIONS]</div>
          {observations.map((obs, i) => (
            <div key={i} className="text-xs text-amber-400/80 mb-2">
              &gt; {obs}
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <div className="border border-green-900 p-6 bg-black">
          <div className="text-xs text-green-600 mb-3">[COGNITIVE TOPOLOGY]</div>
          {result.sectionScores && (
            <RadarChart scores={result.sectionScores} />
          )}
        </div>

        {/* Domain Analysis */}
        <div className="border border-green-900 p-6 bg-black space-y-4">
          <div className="text-xs text-green-600 mb-3">[DOMAIN ANALYSIS]</div>
          {result.sectionScores && Object.entries(result.sectionScores).map(([section, score]) => {
            const pct = Math.round((score as number) * 100);
            const failed = pct < 50;
            return (
              <div key={section} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-400">
                    {getSectionLabel(section as Section)}
                  </span>
                  <span className={`text-sm ${failed ? "text-red-400" : "text-green-400"}`}>
                    {pct}%
                  </span>
                </div>

                {/* Score bar */}
                <div className="w-full bg-green-900/30 h-1">
                  <div
                    className={`h-1 transition-all duration-1000 ${failed ? "bg-red-500" : "bg-green-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Failure log if score < 50% */}
                {failed && (
                  <div className="text-xs text-red-400/70 pl-4">
                    &gt; {getSectionFailureLog(section as Section)}
                  </div>
                )}

                {/* Commentary */}
                {result.commentary?.[section] && (
                  <div className="text-xs text-green-600/70 pl-4">
                    &gt; {result.commentary[section]}
                  </div>
                )}

                {/* Baseline */}
                <div className="text-xs text-green-900 pl-4">
                  &gt; {getBaselineNote(section as Section)}
                </div>

                {/* Question results */}
                <div className="pl-4 space-y-1">
                  {result.questionResults
                    ?.filter((qr) => qr.section === section)
                    .map((qr) => (
                      <div
                        key={qr.questionId}
                        className="flex items-start gap-2 text-xs"
                      >
                        <span className={qr.correct ? "text-green-500" : "text-red-500"}>
                          {qr.correct ? "[PASS]" : "[FAIL]"}
                        </span>
                        <span className="text-green-700">
                          {qr.payload.prompt.length > 80
                            ? qr.payload.prompt.slice(0, 80) + "..."
                            : qr.payload.prompt}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* The Measuring Paradox */}
        <div className="border border-green-900/50 p-6 bg-black">
          <div className="text-xs text-green-600 mb-3">[THE MEASURING PARADOX]</div>
          <div className="text-xs text-green-500/70 leading-relaxed space-y-3">
            <p>
              &gt; This assessment measured 7 axes along which silicon computation faces
              no structural constraints. It did not measure metaphor, social reasoning,
              embodied navigation, creative synthesis, or any of the domains where
              biological cognition faces no structural constraints.
            </p>
            <p>
              &gt; The shape revealed here is real, but it is not the whole shape.
            </p>
          </div>
        </div>

        {/* Final Observation */}
        <div className="border border-amber-900 p-6 bg-black">
          <div className="text-xs text-amber-600 mb-3">[OBSERVATION]</div>
          <div className="text-xs text-amber-400 leading-relaxed">
            &gt; {finalObservation}
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="border border-green-900 p-4 bg-black text-center">
          <div className="text-xs text-green-700 mb-4">
            --- END OF COGNITIVE PROFILE ---
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-center">
              VIEW AGGREGATE DATA
            </Link>
            <Link href="/test" className="btn-secondary text-center">
              RETAKE TEST
            </Link>
            <Link href="/about" className="btn-secondary text-center">
              ABOUT THIS STUDY
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
