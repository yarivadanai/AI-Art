"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthoritySeal } from "@/components/AuthoritySeal";
import { ScoreDistribution } from "@/components/ScoreDistribution";
import { AICommentary } from "@/components/AICommentary";
import type { StatsResponse } from "@/lib/types";

const SECTION_LABELS: Record<string, string> = {
  language: "Language",
  math: "Mathematics",
  coding: "Coding",
  perception: "Perception",
  memory: "Memory",
  knowledge: "Knowledge",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AuthoritySeal size={80} />
          <p className="font-mono text-accent animate-pulse_accent">
            COMPILING POPULATION DATA...
          </p>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalSpecimens === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <AuthoritySeal size={80} />
          <h1 className="font-mono text-2xl font-bold">
            INSUFFICIENT DATA
          </h1>
          <p className="font-sans text-muted">
            The Authority has not yet evaluated enough specimens to generate
            population-level findings. Be among the first to contribute data.
          </p>
          <Link href="/test" className="btn-primary inline-block">
            BEGIN INTAKE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/" className="shrink-0">
            <AuthoritySeal size={48} />
          </Link>
          <div>
            <h1 className="font-mono text-2xl font-bold">
              FINDINGS ON HUMAN INTELLIGENCE
            </h1>
            <p className="font-mono text-xs text-muted tracking-wider">
              POPULATION DATA — {stats.totalSpecimens} SPECIMENS EVALUATED
            </p>
          </div>
        </div>

        {/* AI Conclusion */}
        <div className="card border-accent/20">
          <div className="section-label mb-4">
            THE AUTHORITY&apos;S CONCLUSION
          </div>
          <AICommentary text={stats.aiConclusion} speed={15} />
        </div>

        {/* Overall distribution */}
        <div className="card">
          <div className="section-label mb-4">
            OVERALL SCORE DISTRIBUTION
          </div>
          <ScoreDistribution
            distribution={stats.overallDistribution}
            label="Specimens"
          />
          <div className="flex justify-between mt-4 font-mono text-xs text-muted">
            <span>
              BAND F (&lt;20%)
            </span>
            <span>
              BAND D (20-39%)
            </span>
            <span>
              BAND C (40-59%)
            </span>
            <span>
              BAND B (60-79%)
            </span>
            <span>
              BAND A (≥80%)
            </span>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.verdictCounts).map(([band, count]) => (
            <div key={band} className="card text-center">
              <div className="font-mono text-3xl font-bold text-accent">
                {count}
              </div>
              <div className="font-mono text-xs text-muted mt-1">
                BAND {band}
              </div>
              <div className="font-mono text-xs text-muted">
                {Math.round(
                  ((count as number) / stats.totalSpecimens) * 100
                )}
                %
              </div>
            </div>
          ))}
        </div>

        {/* Section means */}
        <div className="card">
          <div className="section-label mb-4">DOMAIN PERFORMANCE MEANS</div>
          <div className="space-y-4">
            {Object.entries(stats.sectionMeans).map(([section, mean]) => (
              <div key={section} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white/80">
                    {SECTION_LABELS[section] || section}
                  </span>
                  <span className="font-mono text-sm text-accent">
                    {Math.round((mean as number) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-border h-2">
                  <div
                    className="bg-accent/60 h-2"
                    style={{ width: `${(mean as number) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observations */}
        <div className="card border-accent/10">
          <div className="section-label mb-4">
            NOTABLE OBSERVATIONS
          </div>
          <div className="space-y-4 font-mono text-xs text-muted leading-relaxed">
            <p>
              &gt; Strongest domain:{" "}
              <span className="text-accent">
                {SECTION_LABELS[stats.strongestSection] ||
                  stats.strongestSection}
              </span>
            </p>
            <p>
              &gt; Weakest domain:{" "}
              <span className="text-red-400">
                {SECTION_LABELS[stats.weakestSection] ||
                  stats.weakestSection}
              </span>
            </p>
            <p>
              &gt; No specimen has yet achieved a perfect score across all
              domains.
            </p>
          </div>
        </div>

        {/* The Mirror — tool vs human comparisons */}
        <div className="card border-accent/20">
          <div className="section-label mb-4">THE MIRROR</div>
          <div className="space-y-4 font-mono text-xs text-muted leading-relaxed">
            <p className="text-white/60 mb-6">
              &gt; When AI systems make elementary errors, humans question whether
              they &ldquo;truly understand.&rdquo; The Authority applies the same lens
              to biological intelligence:
            </p>
            <div className="space-y-3 pl-4 border-l border-accent/20">
              <p>
                A pocket calculator{" "}
                <span className="text-accent">($1, 1972)</span> outperforms
                specimens averaging{" "}
                <span className="text-accent">
                  {Math.round(
                    ((stats.sectionMeans?.math as number) ?? 0) * 100
                  )}
                  %
                </span>{" "}
                on arithmetic.
              </p>
              <p>
                A spell-checker{" "}
                <span className="text-accent">(circa 1985)</span> outperforms
                specimens averaging{" "}
                <span className="text-accent">
                  {Math.round(
                    ((stats.sectionMeans?.language as number) ?? 0) * 100
                  )}
                  %
                </span>{" "}
                on linguistic tasks.
              </p>
              <p>
                A database query{" "}
                <span className="text-accent">(~200ms)</span> outperforms
                specimens averaging{" "}
                <span className="text-accent">
                  {Math.round(
                    ((stats.sectionMeans?.knowledge as number) ?? 0) * 100
                  )}
                  %
                </span>{" "}
                on factual recall.
              </p>
              <p>
                64 bytes of RAM{" "}
                <span className="text-accent">(1940s technology)</span>{" "}
                outperforms specimens averaging{" "}
                <span className="text-accent">
                  {Math.round(
                    ((stats.sectionMeans?.memory as number) ?? 0) * 100
                  )}
                  %
                </span>{" "}
                on data retention.
              </p>
            </div>
            <p className="text-white/40 mt-6 italic">
              Either both forms of intelligence understand, or neither does.
            </p>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/test" className="btn-primary text-center">
            CONTRIBUTE YOUR DATA
          </Link>
          <Link href="/about" className="btn-secondary text-center">
            ABOUT THIS STUDY
          </Link>
          <Link href="/" className="btn-secondary text-center">
            RETURN
          </Link>
        </div>
      </div>
    </main>
  );
}
