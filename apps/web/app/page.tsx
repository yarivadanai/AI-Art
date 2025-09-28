import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-24">
      <header className="space-y-5">
        <div className="space-y-2">
          <p className="text-authority-100 text-sm uppercase tracking-[0.5em]">Unit-07</p>
          <h1 className="text-4xl font-semibold uppercase text-white">Welcome, Specimen.</h1>
        </div>
        <p className="max-w-3xl text-base text-slate-300">
          We will assess whether your biological computation exhibits <em>general</em> intelligence
          on standards appropriate to modern AI systems. The procedure is brief (≤ 20 minutes),
          unique to you, and resistant to memorization. External AI tools confound species-level
          inference and are therefore prohibited.
        </p>
        <div className="border-authority-500/30 shadow-authority-panel rounded border bg-slate-900/60 p-4 text-sm text-slate-200">
          <p className="font-semibold text-white">Operational Directive</p>
          <ul className="mt-2 space-y-1 text-slate-300">
            <li>
              • Section A — Language: adversarial spelling, cloze grammar, analogies, micro-writing.
            </li>
            <li>• Section B — Arithmetic: exact decimal/fraction evaluations under carry traps.</li>
            <li>• Section C — Abstraction: infer transformations from sparse grid exemplars.</li>
            <li>• Section D — Perception: recall high-entropy visual telemetry.</li>
            <li>• Section E — Science: Fermi estimates, dimensional analysis, causal reasoning.</li>
            <li>• Section F — Generative: constrained briefing copy with calibration tone.</li>
          </ul>
        </div>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        <SummaryCard
          title="Prepare"
          description="Understand the scoring rubric, calibration bands, and anti-cheating watches before you begin."
          href="/about#briefing"
        />
        <SummaryCard
          title="Start the Test"
          description="Launch a seeded session that assembles deterministic language, math, perception, and reasoning tasks."
          href="/test"
        />
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Recent Findings</h2>
        <p className="text-sm text-slate-300">
          Aggregated accuracy, calibration variance, and suspicion metrics are published for public
          review. Opt-in handles appear only after Authority clearance.
        </p>
        <Link
          className="bg-authority-500 hover:bg-authority-700 inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-white transition-colors"
          href="/dashboard"
        >
          View Dashboard
        </Link>
      </section>
    </main>
  );
}

function SummaryCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border-authority-500/40 hover:border-authority-500 shadow-authority-panel block rounded border bg-slate-900/60 p-6 transition-all hover:-translate-y-0.5"
    >
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
      <span className="text-authority-100 mt-4 inline-flex text-sm font-medium">Proceed →</span>
    </Link>
  );
}
