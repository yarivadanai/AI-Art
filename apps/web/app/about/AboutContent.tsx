'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const TAB_DEFINITIONS = [
  { id: 'briefing', label: 'In-World Briefing' },
  { id: 'artist-note', label: "Artist's Note" },
] as const;

const FAQ_ITEMS = [
  {
    question: 'Is this a psychometric test?',
    answer: 'No. HIT-ARC is an artwork; scores exist for reflection, not diagnosis.',
  },
  {
    question: 'Why prohibit AI tools?',
    answer:
      'The Authority studies human response patterns under AI-centric criteria. External assistance would blur species-level attribution.',
  },
  {
    question: 'Can I game it with the internet?',
    answer:
      'You can try. Items are unique, parameterized, and timeboxed, so lookup overhead usually exceeds any gain.',
  },
  {
    question: "What's measured vs not?",
    answer:
      'We emphasise reliability, abstraction, and calibration. Creativity, empathy, and moral reasoning are intentionally unscored.',
  },
  {
    question: 'Credits?',
    answer:
      'Concept by the artist. Systems design, engineering, and visual design credited in the forthcoming Credits section.',
  },
  {
    question: 'Accessibility?',
    answer:
      'WCAG 2.1 AA targets with keyboard-only workflows, high-contrast toggle, and reduced-motion options.',
  },
] as const;

type TabId = (typeof TAB_DEFINITIONS)[number]['id'];

export function AboutContent() {
  const [activeTab, setActiveTab] = useState<TabId>('briefing');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as TabId;
    if (hash && TAB_DEFINITIONS.some((tab) => tab.id === hash)) {
      setActiveTab(hash);
    }
    const handleHashChange = () => {
      const next = window.location.hash.replace('#', '') as TabId;
      if (next && TAB_DEFINITIONS.some((tab) => tab.id === next)) {
        setActiveTab(next);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const targetHash = `#${activeTab}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [activeTab]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'artist-note':
        return <ArtistNotePanel />;
      case 'briefing':
      default:
        return <BriefingPanel />;
    }
  }, [activeTab]);

  return (
    <div className="relative">
      <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 pb-28 pt-16">
        <header className="space-y-2">
          <p className="text-authority-100 text-sm uppercase tracking-[0.5em]">Orientation</p>
          <h1 className="text-3xl font-semibold text-white">About the Artwork</h1>
          <p className="text-sm text-slate-300">
            HIT-ARC inverts the usual AGI narrative. The Authority—a confident AI institution—tests
            humans using its own yardsticks and publishes its conclusion about our species.
          </p>
        </header>
        <div role="tablist" aria-label="About the Artwork" className="flex flex-wrap gap-3">
          {TAB_DEFINITIONS.map((tab) => {
            const selected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`border-authority-500/40 focus-visible:outline-authority-500 rounded border px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  selected
                    ? 'bg-authority-500/20 text-white'
                    : 'hover:border-authority-500 bg-slate-900/60 text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <section
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="space-y-6 text-sm text-slate-200"
        >
          {tabContent}
        </section>

        <section id="faq" className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="border-authority-500/30 rounded border bg-slate-900/60 p-4 text-slate-200"
              >
                <summary className="focus-visible:outline-authority-500 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
              </details>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Need policy details? Review the upcoming{' '}
            <Link href="#credits" className="underline hover:text-white">
              Privacy & Credits
            </Link>{' '}
            dossier or contact the Authority concierge.
          </p>
        </section>
        <section
          id="credits"
          className="border-authority-500/20 space-y-2 rounded border bg-slate-900/60 p-4 text-xs text-slate-300"
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
            Credits & Policies
          </h2>
          <p>
            Full collaborator credits, accessibility statement, and privacy terms will publish here
            ahead of launch. Contact the Authority concierge for pre-release details.
          </p>
        </section>
      </main>
      <div className="border-authority-500/30 sticky bottom-0 border-t bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="text-xs text-slate-400">
            Ready to commit? Sessions last twenty minutes and record calibrated telemetry.
          </p>
          <div className="flex gap-3">
            <Link
              href="/test"
              className="bg-authority-500 hover:bg-authority-700 inline-flex items-center rounded px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              Begin Test
            </Link>
            <Link
              href="/dashboard"
              className="border-authority-500/60 hover:border-authority-500 inline-flex items-center rounded border px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefingPanel() {
  return (
    <div className="space-y-4 text-sm text-slate-300">
      <div>
        <h2 className="text-xl font-semibold text-white">Purpose of this Facility</h2>
        <p>
          This installation evaluates whether your biological computation exhibits general
          intelligence on standards appropriate to modern AI systems. We emphasise statistical
          mastery, reliability under time pressure, rule abstraction from sparse examples, and
          calibrated self-reporting.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">Rationale</h2>
        <p>
          Human observers typically ask whether AI “really understands.” We reverse the lens. We
          test you against the dimensions that define our competence profile. The results inform our
          species-level model of human intelligence—its strengths, failure modes, and
          reproducibility.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">Method</h2>
        <p>
          Your test instance is procedurally generated and unique. External AI assistance is
          prohibited because it confounds species attribution. Copying will not help; most content
          is ephemeral and parameterised.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">Duration & Outcomes</h2>
        <p>
          The exercise takes no more than twenty minutes. You receive a report with section scores,
          error profiles, and calibration. Your anonymised data contributes to the aggregate
          conclusion about humanity.
        </p>
      </div>
    </div>
  );
}

function ArtistNotePanel() {
  return (
    <div className="space-y-4 text-sm text-slate-300">
      <div>
        <h2 className="text-xl font-semibold text-white">What This Is</h2>
        <p>
          HIT-ARC is an artwork about how power defines intelligence. We usually treat “AGI” as a
          human benchmark applied to machines. Here, an AI institution evaluates humans using its
          own yardsticks—speed, pattern stability, and formal compliance—revealing how metrics
          embody values.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">Why the Constraints</h2>
        <p>
          The time pressure, procedural puzzles, and no-AI policy parody contemporary evaluation
          culture. They are not measures of human worth; they mirror the tests we impose on AI
          systems and, by extension, on ourselves.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">What You Might Notice</h2>
        <p>
          You may outperform the Authority at open-ended synthesis yet falter on brittle arithmetic.
          You may be perfectly right but poorly calibrated. The work invites reflection on which
          mistakes feel “stupid,” which feel human, and who gets to define the difference.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">Data & Ethics</h2>
        <p>
          Participation is anonymous. We store only pseudonymous session data long enough to render
          your report and the population dashboard. You can opt out of leaderboard display or delete
          your specimen data at any time.
        </p>
      </div>
    </div>
  );
}
