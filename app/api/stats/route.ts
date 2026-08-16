import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAIConclusion } from "@/lib/commentary";
import { summarizeByLabel, summarizeCohorts, type CohortResultRow } from "@/lib/engine/cohorts";
import type { SectionScores, SessionMetrics, StatsResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const EMPTY_SECTION_MEANS: SectionScores = {
  structural: 0,
  "state-tracking": 0,
  "sequential-depth": 0,
  "signal-detection": 0,
  probabilistic: 0,
};

const EMPTY_CALIBRATION: StatsResponse["calibration"] = {
  specimensWithMetrics: 0,
  sure: 0,
  sureWrong: 0,
  hallucinationRate: null,
  abstained: 0,
  answered: 0,
  meanTimeMs: null,
};

export async function GET() {
  try {
    // Every cohort is fetched once; only human sessions feed the population
    // figures, machine cohorts (llm, reference) are summarized side by side.
    const all = await prisma.result.findMany({
      select: {
        sectionScores: true,
        overall: true,
        verdict: true,
        metrics: true,
        session: { select: { cohort: true, label: true } },
      },
    });
    const cohortRows: CohortResultRow[] = all.map((r) => ({
      cohort: r.session.cohort,
      label: r.session.label,
      overall: r.overall,
      sectionScores: r.sectionScores as Record<string, number>,
      metrics: (r.metrics as unknown as SessionMetrics | null) ?? null,
    }));
    const cohorts = summarizeCohorts(cohortRows);
    const llmModels = summarizeByLabel("llm", cohortRows);
    const results = all.filter((r) => r.session.cohort === "human");

    if (results.length === 0) {
      const empty: StatsResponse = {
        totalSpecimens: 0,
        overallDistribution: Array(10).fill(0),
        sectionMeans: EMPTY_SECTION_MEANS,
        verdictCounts: {},
        weakestSection: "unknown",
        strongestSection: "unknown",
        aiConclusion:
          "Insufficient data. No specimens have been evaluated. MICA awaits its first subject.",
        perfectScores: 0,
        calibration: EMPTY_CALIBRATION,
        cohorts,
        llmModels,
      };
      return NextResponse.json(empty);
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

    const verdictCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    for (const r of results) {
      const band = verdictMap[r.verdict] || "F";
      verdictCounts[band]++;
    }

    const sectionEntries = Object.entries(sectionMeans);
    const strongest = sectionEntries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    const weakest = sectionEntries.reduce((a, b) => (b[1] < a[1] ? b : a))[0];

    const perfectScores = results.filter((r) => r.overall >= 1).length;

    // Population calibration over results that carry metrics (Phase 1+).
    const withMetrics = results
      .map((r) => r.metrics as SessionMetrics | null)
      .filter((m): m is SessionMetrics => !!m && typeof m.answered === "number");
    const sure = withMetrics.reduce((s, m) => s + m.sure, 0);
    const sureWrong = withMetrics.reduce((s, m) => s + m.sureWrong, 0);
    const answered = withMetrics.reduce((s, m) => s + m.answered, 0);
    const abstained = withMetrics.reduce((s, m) => s + m.abstained, 0);
    const timeSum = withMetrics.reduce((s, m) => s + m.meanTimeMs * m.answered, 0);
    const calibration: StatsResponse["calibration"] = {
      specimensWithMetrics: withMetrics.length,
      sure,
      sureWrong,
      hallucinationRate: sure ? sureWrong / sure : null,
      abstained,
      answered,
      meanTimeMs: answered ? Math.round(timeSum / answered) : null,
    };

    const aiConclusion = getAIConclusion(
      results.length,
      sectionMeans as unknown as SectionScores,
      verdictCounts
    );

    const body: StatsResponse = {
      totalSpecimens: results.length,
      overallDistribution,
      sectionMeans: sectionMeans as unknown as SectionScores,
      verdictCounts,
      weakestSection: weakest,
      strongestSection: strongest,
      aiConclusion,
      perfectScores,
      calibration,
      cohorts,
      llmModels,
    };
    return NextResponse.json(body);
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
