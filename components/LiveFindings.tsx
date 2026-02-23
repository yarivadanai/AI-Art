"use client";

import { useEffect, useState } from "react";
import type { StatsResponse } from "@/lib/types";

const SECTION_LABELS: Record<string, string> = {
  structural: "Abstract Structure",
  "state-tracking": "State Tracking",
  "sequential-depth": "Sequential Depth",
  "signal-detection": "Signal Detection",
  probabilistic: "Probabilistic Inference",
};

export function LiveFindings() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-border/50 rounded w-1/2 mb-3" />
            <div className="h-8 bg-border/50 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats || stats.totalSpecimens === 0) {
    return (
      <div className="card border-accent/10">
        <p className="font-mono text-sm text-muted">
          Research in progress. Data will appear here as participants complete
          the assessment.
        </p>
      </div>
    );
  }

  const meanPct = Math.round(
    (Object.values(stats.sectionMeans).reduce((a, b) => a + b, 0) /
      Object.values(stats.sectionMeans).length) *
      100
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">
        <p className="section-label mb-2">Population Mean</p>
        <p className="font-mono text-3xl font-bold">{meanPct}%</p>
        <p className="font-sans text-xs text-white/40 mt-1">
          across {stats.totalSpecimens} participant
          {stats.totalSpecimens !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="card">
        <p className="section-label mb-2">Strongest Domain</p>
        <p className="font-mono text-lg font-semibold">
          {SECTION_LABELS[stats.strongestSection] || stats.strongestSection}
        </p>
        <p className="font-sans text-xs text-white/40 mt-1">
          highest population accuracy
        </p>
      </div>
      <div className="card">
        <p className="section-label mb-2">Weakest Domain</p>
        <p className="font-mono text-lg font-semibold">
          {SECTION_LABELS[stats.weakestSection] || stats.weakestSection}
        </p>
        <p className="font-sans text-xs text-white/40 mt-1">
          most consistent constraint
        </p>
      </div>
    </div>
  );
}
