import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ResultBreakdown } from '@hit-arc/ui';

interface SectionResultRecord {
  code: string;
  label: string;
  score: number;
  details: {
    overall: number;
    items: Array<{ itemId: string; correctness: number; feedback?: string }>;
  };
}

interface ResultRecordResponse {
  specimenId: string;
  completedAt: string;
  sections: SectionResultRecord[];
}

interface ResultPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  return {
    title: `Specimen ${params.id} — HIT-ARC Results`,
  };
}

async function fetchResult(id: string): Promise<ResultRecordResponse | null> {
  if (!id) {
    return null;
  }

  const headerList = headers();
  const protocol = headerList.get('x-forwarded-proto') ?? 'http';
  const host = headerList.get('host');

  if (!host) {
    return null;
  }

  const base = `${protocol}://${host}`;
  const response = await fetch(`${base}/api/result/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to load specimen result.');
  }

  return (await response.json()) as ResultRecordResponse;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const record = await fetchResult(params.id);
  if (!record) {
    notFound();
  }

  const sectionSummaries = record.sections.map((section) => ({
    code: section.code,
    label: section.label,
    score: section.score,
  }));
  const overallScore =
    sectionSummaries.length === 0
      ? 0
      : sectionSummaries.reduce((sum, entry) => sum + entry.score, 0) / sectionSummaries.length;
  const verdict = deriveVerdict(overallScore);
  const sectionComments = record.sections.map((section) => ({
    code: section.code,
    label: section.label,
    comment: describeSection(section),
  }));

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="space-y-2">
        <p className="text-authority-100 text-xs uppercase tracking-[0.4em]">Specimen Record</p>
        <h1 className="text-3xl font-semibold text-white">Outcome for {record.specimenId}</h1>
        <p className="text-sm text-slate-300">
          Overall verdict <strong className="text-white">{verdict.label}</strong> (
          {Math.round(overallScore * 100)}%) — {verdict.detail}. Completed{' '}
          {new Date(record.completedAt).toLocaleString()}.
        </p>
      </header>
      <section className="border-authority-500/20 space-y-3 rounded border bg-slate-900/50 p-5 text-sm text-slate-200">
        <p className="text-authority-100 text-xs uppercase tracking-[0.4em]">
          Authority Commentary
        </p>
        <p>{verdict.commentary}</p>
      </section>
      <Suspense fallback={<p className="text-sm text-slate-300">Rendering breakdown…</p>}>
        <ResultBreakdown sections={sectionSummaries} overall={overallScore} />
      </Suspense>
      <section className="space-y-5">
        {record.sections.map((section) => (
          <article
            key={section.code}
            className="border-authority-500/20 space-y-3 rounded border bg-slate-900/50 p-5"
          >
            <header className="flex items-center justify-between">
              <div>
                <p className="text-authority-100 text-xs uppercase tracking-[0.4em]">
                  Section {section.code}
                </p>
                <p className="text-sm text-slate-200">{section.label}</p>
              </div>
              <span className="text-sm text-slate-200">{Math.round(section.score * 100)}%</span>
            </header>
            {Array.isArray(section.details?.items) && section.details.items.length > 0 && (
              <div className="space-y-2">
                {section.details.items.map((item) => (
                  <div
                    key={item.itemId}
                    className="border-authority-500/20 rounded border p-3 text-sm text-slate-200"
                  >
                    <p className="text-authority-100 font-mono text-xs">Item {item.itemId}</p>
                    <p>
                      Score: <strong>{Math.round(item.correctness * 100)}%</strong>
                    </p>
                    {item.feedback && <p className="text-xs text-slate-400">{item.feedback}</p>}
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-400">
              {sectionComments.find((entry) => entry.code === section.code)?.comment}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}

function deriveVerdict(score: number) {
  if (score >= 0.85) {
    return {
      label: 'AI-Adequate',
      detail: 'exceeds Authority thresholds',
      commentary: 'Specimen demonstrates machine-grade reliability with minimal calibration drift.',
    };
  }
  if (score >= 0.7) {
    return {
      label: 'Task-Narrow',
      detail: 'consistent but exhibits section-specific weaknesses',
      commentary:
        'Strong performance overall, yet targeted retraining is recommended in the weakest section to meet Authority parity.',
    };
  }
  if (score >= 0.5) {
    return {
      label: 'Heuristic-Local',
      detail: 'reliable only under familiar patterns',
      commentary:
        'Behaviour suggests heuristic memorisation; Authority advises remedial calibration before re-evaluation.',
    };
  }
  return {
    label: 'Anthropo-Idiosyncratic',
    detail: 'fails machine-grade expectations',
    commentary:
      'Specimen falls below Authority thresholds; observations logged for archival study of human-specific error patterns.',
  };
}

function describeSection(section: SectionResultRecord): string {
  const scorePercent = Math.round(section.score * 100);
  if (section.code === 'A') {
    return scorePercent >= 80
      ? 'Language mastery acceptable; Authority detected compliant micro-writing throughput.'
      : 'Language section showed gaps in either grammar selection or constrained writing tokens.';
  }
  if (section.code === 'B') {
    return scorePercent >= 80
      ? 'Arithmetic reliability within tolerance. Carry-handling observed as stable.'
      : 'Arithmetic slips detected—exact decimal precision requires reinforcement.';
  }
  if (section.code === 'C') {
    return scorePercent >= 80
      ? 'Abstraction tasks resolved; transformation inference aligned with Authority heuristics.'
      : 'Grid reasoning inconsistent—encourage additional rule induction drills.';
  }
  if (section.code === 'D') {
    return scorePercent >= 80
      ? 'Perception recall sufficient under timed conditions.'
      : 'Perception telemetry missed key anomalies; recommend attention calibration.';
  }
  if (section.code === 'E') {
    return scorePercent >= 80
      ? 'Scientific reasoning passes dimensional and causal heuristics.'
      : 'Science section indicates misunderstandings in units or causal inference.';
  }
  if (section.code === 'F') {
    return scorePercent >= 80
      ? 'Generative constraints obeyed; Authority tone approximated.'
      : 'Generative output violated required tokens or coherence thresholds.';
  }
  return 'Section commentary unavailable.';
}
