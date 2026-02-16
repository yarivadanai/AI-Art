"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AuthoritySeal } from "@/components/AuthoritySeal";
import { RadarChart } from "@/components/RadarChart";
import { AICommentary } from "@/components/AICommentary";
import { getBaselineNote } from "@/lib/commentary";
import type { ResultResponse, Section } from "@/lib/types";

const SECTION_LABELS: Record<string, string> = {
  "cognitive-stack": "Cognitive Stack Overflow",
  isomorphism: "Abstract Isomorphism",
  "expert-trap": "Expert's Trap",
  math: "Mathematical Computation",
  coding: "Code Comprehension",
  perception: "Visual Perception & Recall",
  memory: "Working Memory & Processing",
};

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AuthoritySeal size={80} />
          <p className="font-mono text-accent animate-pulse_accent">
            RETRIEVING SPECIMEN REPORT...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-mono text-muted">Specimen report not found.</p>
          <Link href="/" className="btn-secondary">
            RETURN
          </Link>
        </div>
      </div>
    );
  }

  const overallPct = Math.round(result.overall * 100);

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <AuthoritySeal size={100} />
          <h1 className="font-mono text-3xl font-bold">SPECIMEN REPORT</h1>
          <p className="font-mono text-sm text-muted">
            ID: #{String(params.id).slice(0, 12).toUpperCase()}
          </p>
        </div>

        {/* Overall Score */}
        <div className="card text-center space-y-4">
          <div className="section-label">OVERALL ASSESSMENT</div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-6xl font-mono font-bold text-accent">
              {overallPct}%
            </div>
            <div className="text-left">
              <div
                className={`font-mono text-2xl font-bold ${BAND_COLORS[result.verdictBand] || "text-white"}`}
              >
                {result.verdict}
              </div>
              <div className="font-mono text-xs text-muted">
                BAND {result.verdictBand}
              </div>
            </div>
          </div>
          <div className="max-w-xl mx-auto pt-4">
            <AICommentary
              text={
                result.commentary?.overall ||
                "Assessment complete."
              }
              speed={20}
            />
          </div>
        </div>

        {/* Radar Chart */}
        <div className="card">
          <div className="section-label mb-4 text-center">
            COGNITIVE PROFILE
          </div>
          {result.sectionScores && (
            <RadarChart scores={result.sectionScores} />
          )}
        </div>

        {/* Section Breakdowns */}
        <div className="space-y-6">
          <div className="section-label">SECTION ANALYSIS</div>
          {result.sectionScores && Object.entries(result.sectionScores).map(([section, score]) => (
            <div key={section} className="card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold">
                  {SECTION_LABELS[section] || section}
                </h3>
                <span className="font-mono text-lg text-accent">
                  {Math.round((score as number) * 100)}%
                </span>
              </div>

              {/* Score bar */}
              <div className="w-full bg-border h-2">
                <div
                  className="bg-accent h-2 transition-all duration-1000"
                  style={{ width: `${(score as number) * 100}%` }}
                />
              </div>

              {/* Commentary */}
              {result.commentary?.[section] && (
                <p className="font-mono text-xs text-muted leading-relaxed">
                  &gt; {result.commentary[section]}
                </p>
              )}

              {/* AI Baseline note */}
              <p className="font-mono text-xs text-white/20 leading-relaxed">
                &gt; {getBaselineNote(section as Section)}
              </p>

              {/* Question results */}
              <div className="space-y-2 pt-2">
                {result.questionResults
                  ?.filter((qr) => qr.section === section)
                  .map((qr) => (
                    <div
                      key={qr.questionId}
                      className="flex items-start gap-3 text-xs"
                    >
                      <span
                        className={`font-mono shrink-0 ${qr.correct ? "text-green-500" : "text-red-500"}`}
                      >
                        {qr.correct ? "[✓]" : "[✗]"}
                      </span>
                      <span className="text-white/60 font-sans">
                        {qr.payload.prompt.length > 100
                          ? qr.payload.prompt.slice(0, 100) + "..."
                          : qr.payload.prompt}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/dashboard" className="btn-primary text-center">
            VIEW HUMANITY DASHBOARD
          </Link>
          <Link href="/test" className="btn-secondary text-center">
            RETAKE TEST
          </Link>
          <Link href="/about" className="btn-secondary text-center">
            ABOUT THIS STUDY
          </Link>
        </div>
      </div>
    </main>
  );
}
