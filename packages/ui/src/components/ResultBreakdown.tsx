import clsx from 'clsx';

interface SectionScore {
  code: string;
  label: string;
  score: number;
}

interface ResultBreakdownProps {
  sections: SectionScore[];
  overall: number;
}

const bands: Record<string, string> = {
  elite: 'Calibration positive, reliability high',
  proficient: 'Meets Authority reliability metric',
  emerging: 'Requires observation and re-test',
  flagged: 'Suspicion threshold exceeded',
};

export function ResultBreakdown({ sections, overall }: ResultBreakdownProps) {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-authority-100 text-sm">Overall Score {Math.round(overall * 100)}%</p>
        <p className="text-xs text-slate-300">Band: {scoreToBand(overall)}</p>
      </header>
      <ul className="space-y-3">
        {sections.map((section) => (
          <li
            key={section.code}
            className={clsx(
              'border-authority-500/30 flex items-center justify-between rounded border bg-slate-900/40 px-4 py-3',
              section.score < 0.5 && 'border-red-500/50',
            )}
          >
            <span className="text-sm font-medium text-white">
              {section.code} — {section.label}
            </span>
            <span className="text-authority-100 font-mono text-sm">
              {Math.round(section.score * 100)}%
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-400">
        {bands[scoreToBand(overall).toLowerCase()] ?? bands.emerging}
      </p>
    </section>
  );
}

export function scoreToBand(score: number): 'Elite' | 'Proficient' | 'Emerging' | 'Flagged' {
  if (score >= 0.85) return 'Elite';
  if (score >= 0.7) return 'Proficient';
  if (score >= 0.5) return 'Emerging';
  return 'Flagged';
}
