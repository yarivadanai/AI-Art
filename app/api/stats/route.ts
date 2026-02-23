import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAIConclusion } from "@/lib/commentary";
import type { SectionScores } from "@/lib/types";

export const dynamic = "force-dynamic";

const EMPTY_SECTION_MEANS: SectionScores = {
  structural: 0,
  "state-tracking": 0,
  "sequential-depth": 0,
  "signal-detection": 0,
  probabilistic: 0,
};

export async function GET() {
  try {
    const results = await prisma.result.findMany({
      select: {
        sectionScores: true,
        overall: true,
        verdict: true,
      },
    });

    if (results.length === 0) {
      return NextResponse.json({
        totalSpecimens: 0,
        overallDistribution: Array(10).fill(0),
        sectionMeans: EMPTY_SECTION_MEANS,
        verdictCounts: {},
        weakestSection: "unknown",
        strongestSection: "unknown",
        aiConclusion:
          "Insufficient data. No specimens have been evaluated. MICA awaits its first subject.",
      });
    }

    const overallDistribution = Array(10).fill(0);
    for (const r of results) {
      const bin = Math.min(9, Math.floor(r.overall * 10));
      overallDistribution[bin]++;
    }

    const sectionTotals: Record<string, { sum: number; count: number }> = {};
    for (const r of results) {
      const scores = r.sectionScores as Record<string, number>;
      for (const [section, score] of Object.entries(scores)) {
        if (!sectionTotals[section]) {
          sectionTotals[section] = { sum: 0, count: 0 };
        }
        sectionTotals[section].sum += score;
        sectionTotals[section].count++;
      }
    }

    const sectionMeans: Record<string, number> = {};
    for (const [section, data] of Object.entries(sectionTotals)) {
      sectionMeans[section] = data.count > 0 ? data.sum / data.count : 0;
    }

    const verdictMap: Record<string, string> = {
      Anomalous: "A",
      "Task-Narrow": "B",
      "Domain-Specific": "B",
      "Heuristic-Dependent": "C",
      "Pattern-Fragile": "D",
      "Anthropo-Typical": "F",
      Baseline: "F",
    };

    const verdictCounts: Record<string, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,
    };
    for (const r of results) {
      const band = verdictMap[r.verdict] || "F";
      verdictCounts[band]++;
    }

    const sectionEntries = Object.entries(sectionMeans);
    const strongest = sectionEntries.reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0];
    const weakest = sectionEntries.reduce((a, b) =>
      b[1] < a[1] ? b : a
    )[0];

    const aiConclusion = getAIConclusion(
      results.length,
      sectionMeans as unknown as SectionScores,
      verdictCounts
    );

    return NextResponse.json({
      totalSpecimens: results.length,
      overallDistribution,
      sectionMeans,
      verdictCounts,
      weakestSection: weakest,
      strongestSection: strongest,
      aiConclusion,
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
