import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Humanity Dashboard — HIT-ARC',
  description:
    'Review aggregate verdicts, calibration deltas, and telemetry summaries produced by the Authority.',
};

interface DashboardStats {
  completionRate: number;
  medianScore: number;
  calibrationDelta: number;
  suspicionRate: number;
  verdictDistribution: Array<{ label: string; value: number }>;
  sectionAverages: Array<{ code: string; label: string; score: number }>;
  latestSpecimens: Array<{
    specimenId: string;
    color: string;
    verdict: string;
    overall: number;
  }>;
  narrative: string;
  telemetryEvents: Array<{ specimenId: string; event: string; at: string }>;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const headerList = headers();
  const protocol = headerList.get('x-forwarded-proto') ?? 'http';
  const host = headerList.get('host');

  if (!host) {
    throw new Error('Unable to resolve host for dashboard data fetch.');
  }

  const response = await fetch(`${protocol}://${host}/api/stats`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load dashboard statistics.');
  }

  return (await response.json()) as DashboardStats;
}

export default async function DashboardPage() {
  let stats: DashboardStats | null = null;
  try {
    stats = await fetchDashboardStats();
  } catch (error) {
    console.error('Failed to load dashboard stats', error);
  }

  if (!stats) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
        <header className="space-y-3">
          <p className="text-authority-100 text-sm uppercase tracking-[0.5em]">Aggregates</p>
          <h1 className="text-3xl font-semibold text-white">Humanity Dashboard</h1>
          <p className="text-sm text-slate-300">
            Authority dashboard data is temporarily unavailable. Please refresh after telemetry sync
            completes.
          </p>
        </header>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="space-y-3">
        <p className="text-authority-100 text-sm uppercase tracking-[0.5em]">Aggregates</p>
        <h1 className="text-3xl font-semibold text-white">Humanity Dashboard</h1>
        <p className="text-sm text-slate-300">
          Rolling metrics update nightly. Suspicion deltas and calibration bias are highlighted for
          Authority review.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Completion" value={`${(stats.completionRate * 100).toFixed(1)}%`} />
        <MetricCard title="Median Score" value={`${(stats.medianScore * 100).toFixed(1)}%`} />
        <MetricCard
          title="Calibration Delta"
          value={`${(stats.calibrationDelta * 100).toFixed(1)} bp`}
        />
        <MetricCard title="Suspicion Rate" value={`${(stats.suspicionRate * 100).toFixed(1)}%`} />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <VerdictDistribution distribution={stats.verdictDistribution} />
        <SectionAverages sections={stats.sectionAverages} />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <RecentSpecimens specimens={stats.latestSpecimens} />
        <TelemetryStream events={stats.telemetryEvents} />
      </section>

      <section className="border-authority-500/20 rounded border bg-slate-900/60 p-5 text-sm text-slate-200">
        <p className="text-authority-100 text-xs uppercase tracking-[0.4em]">Authority Narrative</p>
        <p className="mt-2">{stats.narrative}</p>
      </section>
    </main>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <article className="border-authority-500/30 rounded border bg-slate-900/40 p-4">
      <p className="text-authority-100 text-xs uppercase tracking-widest">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </article>
  );
}

function VerdictDistribution({
  distribution,
}: {
  distribution: Array<{ label: string; value: number }>;
}) {
  return (
    <article className="border-authority-500/20 space-y-3 rounded border bg-slate-900/60 p-5 text-xs text-slate-300">
      <p className="text-authority-100 text-xs uppercase tracking-[0.4em]">Verdict Distribution</p>
      {distribution.length === 0 ? (
        <p className="text-sm text-slate-300">No verdicts recorded yet.</p>
      ) : (
        <HorizontalBarChart
          title="Verdict distribution"
          data={distribution.map((entry) => ({
            id: entry.label,
            label: entry.label,
            value: Math.max(0, entry.value),
          }))}
        />
      )}
    </article>
  );
}

function SectionAverages({
  sections,
}: {
  sections: Array<{ code: string; label: string; score: number }>;
}) {
  return (
    <article className="border-authority-500/20 space-y-3 rounded border bg-slate-900/60 p-5 text-xs text-slate-300">
      <p className="text-authority-100 text-xs uppercase tracking-[0.4em]">Section Averages</p>
      {sections.length === 0 ? (
        <p className="text-sm text-slate-300">Section averages will appear once scoring begins.</p>
      ) : (
        <VerticalBarChart
          title="Section average score"
          data={sections.map((section) => ({
            id: section.code,
            label: section.label,
            value: Math.max(0, Math.min(1, section.score)),
          }))}
        />
      )}
    </article>
  );
}

function RecentSpecimens({
  specimens,
}: {
  specimens: Array<{ specimenId: string; color: string; verdict: string; overall: number }>;
}) {
  return (
    <article className="space-y-3">
      <h2 className="text-xl font-semibold text-white">Recent Specimens</h2>
      <Suspense fallback={<p className="text-sm text-slate-300">Loading stream…</p>}>
        {specimens.length === 0 ? (
          <p className="text-sm text-slate-300">No evaluated specimens yet.</p>
        ) : (
          <ul className="space-y-2">
            {specimens.map((specimen) => (
              <li
                key={specimen.specimenId}
                className="flex items-center justify-between gap-4 rounded bg-slate-900/60 p-3"
              >
                <div>
                  <p className="font-mono text-sm text-slate-200">{specimen.specimenId}</p>
                  <p className="text-xs text-slate-400">
                    {specimen.verdict} · {Math.round(specimen.overall * 100)}%
                  </p>
                </div>
                <span
                  className="inline-flex h-3 w-3 rounded-full"
                  style={{ backgroundColor: specimen.color }}
                />
              </li>
            ))}
          </ul>
        )}
      </Suspense>
    </article>
  );
}

interface ChartDatum {
  id: string;
  label: string;
  value: number;
}

function VerticalBarChart({ title, data }: { title: string; data: ChartDatum[] }) {
  const height = 180;
  const topMargin = 16;
  const bottomMargin = 32;
  const innerHeight = height - topMargin - bottomMargin;
  const barWidth = 36;
  const gap = 18;
  const width = data.length * barWidth + (data.length + 1) * gap;
  const axisY = topMargin + innerHeight;
  const steps = [0.25, 0.5, 0.75, 1];

  return (
    <div className="space-y-3">
      <svg
        role="img"
        aria-label={`${title}. ${data
          .map((entry) => `${entry.label} ${Math.round(entry.value * 100)} percent`)
          .join(', ')}`}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-full"
      >
        <title>{title}</title>
        <rect
          x={0}
          y={topMargin}
          width={width}
          height={innerHeight}
          fill="rgba(15, 23, 42, 0.6)"
          rx={8}
        />
        {steps.map((step) => (
          <line
            key={step}
            x1={gap / 2}
            x2={width - gap / 2}
            y1={axisY - innerHeight * step}
            y2={axisY - innerHeight * step}
            stroke="rgba(148, 163, 184, 0.25)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}
        {data.map((entry, idx) => {
          const barHeight = Math.max(1, entry.value * innerHeight);
          const x = gap + idx * (barWidth + gap);
          return (
            <g key={entry.id}>
              <rect
                x={x}
                y={axisY - barHeight}
                width={barWidth}
                height={barHeight}
                rx={6}
                fill="rgba(56, 189, 248, 0.8)"
              />
              <text
                x={x + barWidth / 2}
                y={axisY + 18}
                textAnchor="middle"
                className="fill-slate-300 font-mono text-[11px]"
              >
                {entry.id}
              </text>
              <text
                x={x + barWidth / 2}
                y={axisY - barHeight - 6}
                textAnchor="middle"
                className="fill-white text-[11px]"
              >
                {Math.round(entry.value * 100)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function HorizontalBarChart({ title, data }: { title: string; data: ChartDatum[] }) {
  const rowHeight = 34;
  const gap = 16;
  const height = data.length * rowHeight + (data.length + 1) * gap;
  const leftMargin = 120;
  const rightMargin = 32;
  const width = 420;

  return (
    <div className="space-y-3">
      <svg
        role="img"
        aria-label={`${title}. ${data
          .map((entry) => `${entry.label} ${Math.round(entry.value * 100)} percent`)
          .join(', ')}`}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-full"
      >
        <title>{title}</title>
        {data.map((entry, idx) => {
          const barWidth = Math.max(4, (entry.value || 0) * (width - leftMargin - rightMargin));
          const y = gap + idx * (rowHeight + gap);
          return (
            <g key={entry.id}>
              <text
                x={leftMargin - 12}
                y={y + rowHeight / 2 + 4}
                textAnchor="end"
                className="fill-slate-300 text-[12px]"
              >
                {entry.label}
              </text>
              <rect
                x={leftMargin}
                y={y}
                width={width - leftMargin - rightMargin}
                height={rowHeight}
                fill="rgba(15, 23, 42, 0.6)"
                rx={6}
              />
              <rect
                x={leftMargin}
                y={y}
                width={barWidth}
                height={rowHeight}
                rx={6}
                fill="rgba(56, 189, 248, 0.8)"
              />
              <text
                x={leftMargin + barWidth + 8}
                y={y + rowHeight / 2 + 4}
                className="fill-white text-[12px]"
              >
                {Math.round(entry.value * 100)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function TelemetryStream({
  events,
}: {
  events: Array<{ specimenId: string; event: string; at: string }>;
}) {
  return (
    <article className="border-authority-500/20 space-y-3 rounded border bg-slate-900/60 p-5 text-xs text-slate-300">
      <p className="text-authority-100 text-xs uppercase tracking-[0.4em]">Telemetry Stream</p>
      {events.length === 0 ? (
        <p className="text-sm text-slate-300">No telemetry received in this window.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={`${event.specimenId}-${event.at}`}
              className="flex items-center justify-between rounded bg-slate-950/40 p-3"
            >
              <span className="font-mono text-sm text-slate-200">{event.specimenId}</span>
              <span className="text-sm text-white">{event.event}</span>
              <span className="font-mono text-[11px] text-slate-400">
                {new Date(event.at).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
