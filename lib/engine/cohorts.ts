import { SECTION_ORDER, type CohortId, type CohortSummary, type Section, type SessionMetrics } from "@/lib/types";

/** The slice of a stored Result (plus its session's cohort/label) the dashboard aggregates. */
export interface CohortResultRow {
  cohort: string;
  label: string | null;
  overall: number;
  sectionScores: Record<string, number>;
  metrics: SessionMetrics | null;
}

export const COHORT_IDS: CohortId[] = ["human", "llm", "reference"];

export function isCohortId(v: string): v is CohortId {
  return (COHORT_IDS as string[]).includes(v);
}

function hasMetrics(m: SessionMetrics | null): m is SessionMetrics {
  return !!m && typeof m.answered === "number";
}

/**
 * Aggregate one cohort. Means are per specimen (each session weighs the same);
 * hallucination and abstention rates pool the underlying counts, matching the
 * population calibration card. Frontier means only cover adaptive sessions.
 */
export function summarizeCohort(cohort: CohortId, rows: CohortResultRow[]): CohortSummary {
  const n = rows.length;
  const withMetrics = rows.map((r) => r.metrics).filter(hasMetrics);
  const sure = withMetrics.reduce((s, m) => s + m.sure, 0);
  const sureWrong = withMetrics.reduce((s, m) => s + m.sureWrong, 0);
  const answered = withMetrics.reduce((s, m) => s + m.answered, 0);
  const abstained = withMetrics.reduce((s, m) => s + m.abstained, 0);
  const timeSum = withMetrics.reduce((s, m) => s + m.meanTimeMs * m.answered, 0);

  const adaptive = withMetrics.filter((m) => m.mode === "adaptive" && m.frontiers);
  const meanFrontiers = {} as Record<Section, number>;
  for (const s of SECTION_ORDER) {
    meanFrontiers[s] = adaptive.length ? adaptive.reduce((acc, m) => acc + (m.frontiers?.[s] ?? 0), 0) / adaptive.length : 0;
  }

  const labels = Array.from(new Set(rows.map((r) => r.label).filter((l): l is string => !!l))).sort();

  return {
    cohort,
    n,
    labels,
    meanOverall: n ? rows.reduce((s, r) => s + r.overall, 0) / n : null,
    meanFrontiers: adaptive.length ? meanFrontiers : null,
    hallucinationRate: sure ? sureWrong / sure : null,
    abstentionRate: answered + abstained ? abstained / (answered + abstained) : null,
    meanTimeMs: answered ? Math.round(timeSum / answered) : null,
    sure,
    sureWrong,
    answered,
    abstained,
  };
}

/** Group results by cohort id (unknown cohort values are ignored) and summarize each. */
export function summarizeCohorts(rows: CohortResultRow[]): Record<CohortId, CohortSummary> {
  const out = {} as Record<CohortId, CohortSummary>;
  for (const id of COHORT_IDS) {
    out[id] = summarizeCohort(
      id,
      rows.filter((r) => r.cohort === id)
    );
  }
  return out;
}

/** Per-label breakdown inside a cohort (one row per model for the llm cohort). */
export function summarizeByLabel(cohort: CohortId, rows: CohortResultRow[]): CohortSummary[] {
  const byLabel = new Map<string, CohortResultRow[]>();
  for (const r of rows) {
    if (r.cohort !== cohort) continue;
    const key = r.label ?? "unlabelled";
    byLabel.set(key, [...(byLabel.get(key) ?? []), r]);
  }
  return Array.from(byLabel.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, group]) => summarizeCohort(cohort, group));
}
