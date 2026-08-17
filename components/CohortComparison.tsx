"use client";

import { REPORT_COPY } from "@/lib/commentary";
import type { CohortId, CohortSummary } from "@/lib/types";

interface CohortComparisonProps {
  cohorts: Record<CohortId, CohortSummary>;
  llmModels: CohortSummary[];
}

const pct = (v: number | null) => (v == null ? "n/a" : `${Math.round(v * 100)}%`);
const secs = (ms: number | null) => (ms == null ? "n/a" : ms < 1000 ? `${(ms / 1000).toFixed(3)}s` : `${(ms / 1000).toFixed(1)}s`);

const GRID = "sm:grid-cols-[170px_1fr_52px_60px_84px_64px_64px]";

function Row({ name, note, s, indent = false }: { name: string; note?: string; s: CohortSummary; indent?: boolean }) {
  const empty = s.n === 0;
  const width = empty ? 0 : Math.max(1, Math.round((s.meanOverall ?? 0) * 100));
  const cell = "font-mono text-xs";
  return (
    <div className={`grid grid-cols-2 ${GRID} gap-x-4 gap-y-1 items-center ${indent ? "pl-4" : ""}`}>
      <div className={`${cell} col-span-2 sm:col-span-1`}>
        <div className={indent ? "text-white/70" : "text-white"}>{name}</div>
        {note && <div className="text-[10px] text-muted">{note}</div>}
      </div>
      <div className="col-span-2 sm:col-span-1 flex h-3 bg-border/60 w-full" role="img" aria-label={empty ? "pending" : `mean score ${pct(s.meanOverall)}`}>
        <div className="h-3 bg-accent" style={{ width: `${width}%` }} />
      </div>
      <div className={`${cell} text-white/60`}>{empty ? "pending" : `n=${s.n}`}</div>
      <div className={`${cell} text-accent`}>
        <span className="sm:hidden text-muted">SCORE </span>
        {empty ? "" : pct(s.meanOverall)}
      </div>
      <div className={cell}>
        <span className="sm:hidden text-muted">SURE+WRONG </span>
        {empty ? "" : pct(s.hallucinationRate)}
      </div>
      <div className={cell}>
        <span className="sm:hidden text-muted">ABSTAIN </span>
        {empty ? "" : pct(s.abstentionRate)}
      </div>
      <div className={cell}>
        <span className="sm:hidden text-muted">TIME </span>
        {empty ? "" : secs(s.meanTimeMs)}
      </div>
    </div>
  );
}

/**
 * The dashboard's three-cohort chart: humans, language models (one row per
 * model), and the reference solver, on the same instrument. Rates pool the
 * underlying counts; the bar is the mean overall score.
 */
export function CohortComparison({ cohorts, llmModels }: CohortComparisonProps) {
  const machinesSeated = cohorts.llm.n + cohorts.reference.n > 0;
  return (
    <div className="card border-accent/20">
      <div className="section-label mb-2">{REPORT_COPY.cohortsTitle}</div>
      <p className="font-sans text-sm text-white/70 leading-relaxed mb-6">{REPORT_COPY.cohortsBlurb}</p>

      <div className={`hidden sm:grid ${GRID} gap-x-4 font-mono text-[10px] text-muted tracking-wider mb-2`}>
        <div>SUBJECT</div>
        <div>MEAN SCORE</div>
        <div />
        <div>SCORE</div>
        <div>SURE+WRONG</div>
        <div>ABSTAIN</div>
        <div>PER ITEM</div>
      </div>

      <div className="space-y-4">
        <Row name={REPORT_COPY.cohortHuman} s={cohorts.human} note="in a browser, against the clock" />
        <div className="space-y-2">
          <Row name={REPORT_COPY.cohortLlm} s={cohorts.llm} note="through the API, no tools" />
          {llmModels.map((m) => (
            <Row key={m.labels.join("|")} name={m.labels[0] ?? "model"} s={m} indent />
          ))}
        </div>
        <Row name={REPORT_COPY.cohortReference} s={cohorts.reference} note={REPORT_COPY.cohortReferenceNote} />
      </div>

      {!machinesSeated && <p className="font-mono text-xs text-muted mt-6">{REPORT_COPY.cohortsPending}</p>}
      {machinesSeated && (
        <p className="font-mono text-[10px] text-muted mt-6 tracking-wider leading-relaxed">
          SCORE = MEAN OF HIGHEST LEVEL CLEARED / 8 ACROSS THE FIVE DOMAINS · SURE+WRONG = P(WRONG | MARKED SURE) · ABSTAIN = SHARE OF ITEMS MET WITH &quot;I CANNOT DETERMINE THIS&quot; · PER ITEM = MEAN TIME ON ANSWERED ITEMS
        </p>
      )}
    </div>
  );
}
