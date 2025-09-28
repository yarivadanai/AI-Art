'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import type {
  ArithmeticItem,
  ArithmeticResponse,
  ArithmeticSection,
  ArithmeticSectionScore,
  GridReasoningItem,
  GridReasoningResponse,
  GridReasoningSection,
  GridReasoningResult,
  PerceptionItem,
  PerceptionResponse,
  PerceptionSection,
  PerceptionSectionScore,
  ScienceItem,
  ScienceResponse,
  ScienceSection,
  ScienceSectionScore,
  GenerativeItem,
  GenerativeResponse,
  GenerativeSection,
  GenerativeSectionScore,
  LanguageItem,
  LanguageResponse,
  LanguageSection,
  LanguageSectionScore,
} from '@hit-arc/engine';
import { GridPainter, SessionTimer } from '@hit-arc/ui';

const SESSION_LENGTH_SECONDS = 20 * 60;

const SECTION_GUIDANCE: Record<SectionCode, { title: string; detail: string }> = {
  A: {
    title: 'Focus on grammar accuracy, analogies, and concise constrained writing.',
    detail:
      'Choose exact spellings, restore cloze blanks, map analogies, then deliver a micro-brief that obeys all token requirements.',
  },
  B: {
    title: 'Compute exact numeric answers with deterministic rounding.',
    detail:
      'Carry through decimals, fractions, and exponent/roots. Use precise decimals—no scientific notation unless implied.',
  },
  C: {
    title: 'Infer the transformation rule from sparse grid examples.',
    detail:
      'Compare input/output pairs carefully; reflect, rotate, or transpose patterns, then select the matching rule.',
  },
  D: {
    title: 'Recall high-entropy perceptual details from Authority briefings.',
    detail:
      'Review the scenario text and answer the question without guessing—details about sequence, coordinate, or signal matter.',
  },
  E: {
    title: 'Apply quantitative reasoning: Fermi orders, units, and causality.',
    detail:
      'Estimate magnitudes, pick correct dimensional forms, and avoid causal fallacies when interpreting correlations.',
  },
  F: {
    title: 'Generate constrained Authority copy with calibrated tone.',
    detail:
      'Respect sentence caps, include mandated tokens, and keep language terse and operational.',
  },
};

const SECTION_SAMPLES: Record<SectionCode, { sample: string; answer: string }> = {
  A: {
    sample: 'Select the correct spelling: accommodate / accomodate / acommodate.',
    answer: 'accommodate',
  },
  B: {
    sample: 'Evaluate (12.5 × 0.2) + 3/5.',
    answer: '3.10 (with two-decimal precision).',
  },
  C: {
    sample: 'Square grid mirrored across its vertical axis; identify “Flip horizontally.”',
    answer: 'Choose the flip horizontally rule.',
  },
  D: {
    sample: 'Drone formation: northern drone dips once. Question: “Which drone dipped?”',
    answer: 'Select “Northern”.',
  },
  E: {
    sample: 'Which expression carries units of resistance?',
    answer: 'Volts per ampere.',
  },
  F: {
    sample: 'Compose 1 sentence including “telemetry” and “anomaly.”',
    answer: 'Mention both tokens while staying within the sentence cap.',
  },
};

const SECTION_DURATION_SECONDS = 150;

type TestSection =
  | LanguageSection
  | ArithmeticSection
  | GridReasoningSection
  | PerceptionSection
  | ScienceSection
  | GenerativeSection;
type SectionCode = TestSection['code'];
type SectionScore =
  | LanguageSectionScore
  | ArithmeticSectionScore
  | GridReasoningResult
  | PerceptionSectionScore
  | ScienceSectionScore
  | GenerativeSectionScore;
type SectionResponse =
  | LanguageResponse
  | ArithmeticResponse
  | GridReasoningResponse
  | PerceptionResponse
  | ScienceResponse
  | GenerativeResponse;

interface TestStartResponse {
  sections: TestSection[];
  expiresAt: string;
}

export default function TestPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionCache | null>(null);
  const [sections, setSections] = useState<TestSection[]>([]);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<SectionCode, number>>({});
  const [responses, setResponses] = useState<Map<string, SectionResponse>>(new Map());
  const [submittedSections, setSubmittedSections] = useState<Set<SectionCode>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(SESSION_LENGTH_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<'intake' | 'tutorial' | 'active'>('intake');
  const [tutorialRemaining, setTutorialRemaining] = useState<number>(30);
  const [sectionRemaining, setSectionRemaining] = useState<number>(SECTION_DURATION_SECONDS);
  const [telemetryNotice, setTelemetryNotice] = useState<string | null>(null);
  const [telemetryLog, setTelemetryLog] = useState<Array<{ type: string; at: string }>>([]);

  const specimenId = session?.specimenId ?? '—';
  const activeSection = sections[activeIndex] ?? null;

  const expiryDisplay = useMemo(() => {
    if (!expiresAt) return null;
    return new Date(expiresAt).toLocaleTimeString();
  }, [expiresAt]);

  const activeGuidance = activeSection ? SECTION_GUIDANCE[activeSection.code] : undefined;
  const progressRatio = sections.length
    ? (submittedSections.size + (activeSection ? 1 : 0)) / sections.length
    : 0;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const cache = loadOrCreateSessionId();
    setSession(cache);
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }
    if (session.consented && stage === 'intake') {
      setStage('tutorial');
    }
  }, [session, stage]);

  useEffect(() => {
    if (stage !== 'tutorial') {
      return;
    }
    setTutorialRemaining(30);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'tutorial') {
      return;
    }
    const interval = window.setInterval(() => {
      setTutorialRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage === 'tutorial' && tutorialRemaining <= 0) {
      setStage('active');
    }
  }, [stage, tutorialRemaining]);

  useEffect(() => {
    if (stage !== 'active' || !session) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchTestPlan(session)
      .then((data) => {
        if (cancelled) {
          return;
        }
        setSections(data.sections);
        setExpiresAt(data.expiresAt);
        setActiveIndex(0);
        setSubmittedSections(new Set());
        setResponses(new Map());
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          setError('Failed to initialise test items. Please retry.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [stage, session]);

  useEffect(() => {
    if (stage === 'active') {
      setRemainingSeconds(SESSION_LENGTH_SECONDS);
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== 'active') {
      return;
    }
    setSectionRemaining(SECTION_DURATION_SECONDS);
  }, [stage, activeIndex]);

  useEffect(() => {
    if (stage !== 'active') {
      return;
    }
    const interval = window.setInterval(() => {
      setSectionRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [stage, activeIndex]);

  const handleLanguageSpelling = useCallback((item: LanguageItem, optionIndex: number) => {
    setResponses((current) => {
      const next = new Map(current);
      next.set(item.id, {
        itemId: item.id,
        type: 'spelling',
        selectedIndex: optionIndex,
      });
      return next;
    });
  }, []);

  const handleLanguageCloze = useCallback(
    (item: LanguageItem, blankIndex: number, optionIndex: number) => {
      setResponses((current) => {
        const next = new Map(current);
        const existing = next.get(item.id);
        const selected = Array(item.correctIndices.length).fill(-1);
        if (existing && existing.type === 'cloze') {
          existing.selectedIndices.forEach((value, idx) => {
            selected[idx] = value;
          });
        }
        selected[blankIndex] = optionIndex;
        next.set(item.id, {
          itemId: item.id,
          type: 'cloze',
          selectedIndices: selected,
        });
        return next;
      });
    },
    [],
  );

  const handleLanguageAnalogy = useCallback((item: LanguageItem, optionIndex: number) => {
    setResponses((current) => {
      const next = new Map(current);
      next.set(item.id, {
        itemId: item.id,
        type: 'analogy',
        selectedIndex: optionIndex,
      });
      return next;
    });
  }, []);

  const handleLanguageMicrowrite = useCallback((item: LanguageItem, value: string) => {
    setResponses((current) => {
      const next = new Map(current);
      next.set(item.id, {
        itemId: item.id,
        type: 'microwrite',
        text: value,
      });
      return next;
    });
  }, []);

  const handleArithmeticAnswer = useCallback(
    (item: ArithmeticItem, event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setResponses((current) => {
        const next = new Map(current);
        next.set(item.id, {
          itemId: item.id,
          type: 'arith',
          answer: value,
        });
        return next;
      });
    },
    [],
  );

  const handleGenerativeText = useCallback((item: GenerativeItem, value: string) => {
    setResponses((current) => {
      const next = new Map(current);
      next.set(item.id, {
        itemId: item.id,
        type: 'constrained',
        text: value,
      });
      return next;
    });
  }, []);

  const handleChoiceSelection = useCallback(
    (item: GridReasoningItem | PerceptionItem | ScienceItem, optionIndex: number) => {
      setResponses((current) => {
        const next = new Map(current);
        next.set(item.id, {
          itemId: item.id,
          type: item.type,
          selectedIndex: optionIndex,
        } as SectionResponse);
        return next;
      });
    },
    [],
  );

  const submitSection = useCallback(
    async (section: TestSection) => {
      if (!session || submitting || stage !== 'active') {
        return;
      }
      setSubmitting(true);
      try {
        const payload = collectResponses(section, responses);
        const score = await submitResponses(session.specimenId, session.token, section, payload);
        setScores((current) => ({ ...current, [section.code]: score.overall }));
        setSubmittedSections((current) => new Set(current).add(section.code));

        const nextIndex = activeIndex + 1;
        if (sections[nextIndex]) {
          setActiveIndex(nextIndex);
        } else {
          router.push(`/result/${session.specimenId}`);
        }
      } catch (err) {
        console.error(err);
        setError('Submission failed. Please retry.');
      } finally {
        setSubmitting(false);
      }
    },
    [session, submitting, stage, responses, activeIndex, sections, router],
  );

  const recordTelemetryEvent = useCallback(
    (eventType: 'blur' | 'focus' | 'paste' | 'visibility', payload?: Record<string, unknown>) => {
      const timestamp = new Date().toISOString();
      setTelemetryLog((entries) => [...entries.slice(-9), { type: eventType, at: timestamp }]);
      setTelemetryNotice(
        `Authority detected ${
          eventType === 'visibility' ? 'tab visibility change' : `${eventType} event`
        } during evaluation.`,
      );

      if (session?.specimenId) {
        const body = JSON.stringify({
          specimenId: session.specimenId,
          event: eventType,
          at: timestamp,
          payload,
        });

        fetch('/api/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
          },
          body,
          keepalive: true,
        }).catch(() => undefined);
      }
    },
    [session?.specimenId, session?.token],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (activeSection) {
        await submitSection(activeSection);
      }
    },
    [activeSection, submitSection],
  );

  const handleIntakeSubmit = useCallback(
    async ({
      alias,
      demographics,
    }: {
      alias?: string;
      demographics: Record<string, unknown> | null;
    }) => {
      const fallbackId = session?.specimenId ?? `spec-${Date.now().toString(36)}`;
      const specimenAlias = alias?.trim() || fallbackId;

      const response = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          specimenAlias,
          consent: true,
          demographics,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Authority session registration failed.');
      }

      const data = (await response.json()) as {
        specimenId: string;
        seed: string;
        expiresAt: string;
        consent?: boolean;
        demographics?: Record<string, unknown> | null;
        token?: string;
      };

      const cache: SessionCache = {
        specimenId: data.specimenId,
        consented: data.consent ?? true,
        demographics: data.demographics ?? demographics ?? null,
        token: data.token,
      };
      storeSessionCache(cache);
      setSession(cache);
      setSections([]);
      setScores({});
      setSubmittedSections(new Set());
      setResponses(new Map());
      setExpiresAt(null);
      setActiveIndex(0);
      setStage('tutorial');
      setTutorialRemaining(30);
    },
    [session],
  );

  useEffect(() => {
    if (stage !== 'active') {
      return;
    }
    if (remainingSeconds <= 0 && activeSection && !submittedSections.has(activeSection.code)) {
      submitSection(activeSection).catch((err) => console.error('Auto-submit failed', err));
    }
  }, [stage, remainingSeconds, activeSection, submittedSections, submitSection]);

  useEffect(() => {
    if (stage !== 'active') {
      return;
    }
    if (sectionRemaining <= 0 && activeSection && !submittedSections.has(activeSection.code)) {
      submitSection(activeSection).catch((err) => console.error('Section auto-submit failed', err));
    }
  }, [stage, sectionRemaining, activeSection, submittedSections, submitSection]);

  useEffect(() => {
    if (stage !== 'active') {
      return;
    }
    const handleBlur = () => recordTelemetryEvent('blur');
    const handleFocus = () => recordTelemetryEvent('focus');
    const handlePaste = () => recordTelemetryEvent('paste');
    const handleVisibility = () =>
      recordTelemetryEvent('visibility', {
        hidden: document.hidden,
        visibilityState: document.visibilityState,
      });

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [stage, recordTelemetryEvent]);

  useEffect(() => {
    if (!telemetryNotice) {
      return;
    }
    const timer = window.setTimeout(() => setTelemetryNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [telemetryNotice]);

  if (!session || stage === 'intake') {
    return (
      <IntakeScreen
        specimenId={session?.specimenId}
        onSubmit={async (payload) => {
          await handleIntakeSubmit(payload);
        }}
      />
    );
  }

  if (stage === 'tutorial') {
    return (
      <TutorialScreen
        specimenId={session.specimenId}
        remaining={tutorialRemaining}
        onBegin={() => setStage('active')}
      />
    );
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <p className="text-authority-100 text-sm uppercase tracking-[0.5em]">Specimen Intake</p>
        <h1 className="text-3xl font-semibold text-white">Begin Evaluation</h1>
        <p className="text-sm text-slate-300">
          Specimen ID <span className="font-mono">{specimenId}</span>. Maintain focus;
          instrumentation monitors paste events and window blur.
        </p>
        {expiryDisplay && (
          <p className="text-xs text-slate-400">Session expires at {expiryDisplay}.</p>
        )}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Progress</span>
            <span>
              {submittedSections.size + (activeSection ? 1 : 0)}/{sections.length} sections
            </span>
          </div>
          <div
            className="mt-1 h-2 w-full rounded bg-slate-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressRatio * 100)}
          >
            <div
              className="bg-authority-500 h-full rounded transition-all"
              style={{ width: `${Math.min(100, Math.round(progressRatio * 100))}%` }}
            />
          </div>
        </div>
      </header>

      <section className="border-authority-500/40 flex items-center justify-between rounded border bg-slate-900/60 p-4">
        <div className="space-y-1">
          <p className="text-authority-100 text-xs uppercase tracking-widest">Time Remaining</p>
          <SessionTimer
            durationSeconds={SESSION_LENGTH_SECONDS}
            onTick={setRemainingSeconds}
            className="text-2xl font-semibold text-white"
          />
        </div>
        <aside className="text-right text-sm text-slate-300">
          <p>Auto-submit triggers at zero.</p>
          <p>
            {Math.round((remainingSeconds / SESSION_LENGTH_SECONDS) * 100)}% of window remaining.
          </p>
        </aside>
      </section>

      {error && (
        <div className="rounded border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {telemetryNotice && (
        <div className="border-authority-500/30 bg-authority-500/10 text-authority-100 rounded border p-3 text-xs">
          {telemetryNotice}
        </div>
      )}

      {loading && (
        <div className="border-authority-500/20 rounded border bg-slate-900/50 p-4 text-xs text-slate-300">
          Calibrating sections…
        </div>
      )}

      {sections.length > 0 && (
        <nav className="flex flex-wrap gap-3 text-xs text-slate-300">
          {sections.map((section, index) => {
            const isActive = index === activeIndex;
            const completed = submittedSections.has(section.code);
            const canVisit = index === activeIndex || completed;
            return (
              <button
                key={section.code}
                type="button"
                className={`rounded border px-3 py-1 transition ${
                  isActive
                    ? 'border-authority-500 bg-authority-500/30 text-white'
                    : canVisit
                      ? 'border-authority-500/30 bg-slate-900/50 text-slate-200'
                      : 'border-authority-500/10 bg-slate-900/20 text-slate-500'
                }`}
                onClick={() => canVisit && setActiveIndex(index)}
                disabled={!canVisit}
              >
                {section.code} {completed ? '✔' : ''}
              </button>
            );
          })}
        </nav>
      )}

      {sections.length > 0 && (
        <section className="border-authority-500/20 rounded border bg-slate-900/60 p-4 text-xs text-slate-300">
          <p className="font-semibold text-white">Section Scores</p>
          <ul className="mt-2 grid gap-2 md:grid-cols-3">
            {sections.map((section) => {
              const value = scores[section.code];
              const label = SECTION_GUIDANCE[section.code].title;
              return (
                <li
                  key={`score-${section.code}`}
                  className="border-authority-500/10 rounded border bg-slate-950/40 p-3"
                >
                  <p className="text-authority-100 font-mono text-xs uppercase tracking-[0.3em]">
                    {section.code}
                  </p>
                  <p className="text-sm text-slate-200">{section.label}</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {value !== undefined ? `${Math.round(value * 100)}%` : '—'}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">{label}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {telemetryLog.length > 0 && (
        <section className="border-authority-500/20 rounded border bg-slate-900/60 p-4 text-xs text-slate-300">
          <p className="font-semibold text-white">Telemetry Events</p>
          <ul className="mt-2 space-y-1">
            {[...telemetryLog].reverse().map((entry, idx) => (
              <li
                key={`${entry.type}-${entry.at}-${idx}`}
                className="flex items-center justify-between"
              >
                <span className="font-medium text-slate-200">{entry.type}</span>
                <span className="font-mono text-[11px] text-slate-400">
                  {new Date(entry.at).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {activeSection ? (
        <form className="space-y-8" onSubmit={handleSubmit}>
          <header className="space-y-2">
            <p className="text-authority-100 text-xs uppercase tracking-[0.4em]">
              Section {activeSection.code}
            </p>
            <h2 className="text-2xl font-semibold text-white">{activeSection.label}</h2>
            <p className="text-sm text-slate-300">{activeSection.description}</p>
            {activeGuidance && (
              <div className="border-authority-500/20 rounded border bg-slate-900/60 p-4 text-xs text-slate-300">
                <p className="font-semibold text-white">Authority Guidance</p>
                <p className="mt-1 text-slate-200">{activeGuidance.title}</p>
                <p className="mt-1 text-slate-400">{activeGuidance.detail}</p>
              </div>
            )}
          </header>

          <ol className="space-y-6">
            {activeSection.items.map((item, idx) => (
              <li
                key={item.id}
                className="border-authority-500/20 rounded border bg-slate-900/60 p-5"
              >
                <ItemRenderer
                  index={idx}
                  item={item}
                  response={responses.get(item.id)}
                  onSelectSpelling={handleLanguageSpelling}
                  onSelectCloze={handleLanguageCloze}
                  onSelectAnalogy={handleLanguageAnalogy}
                  onUpdateMicrowrite={handleLanguageMicrowrite}
                  onArithmeticAnswer={handleArithmeticAnswer}
                  onGenerativeUpdate={handleGenerativeText}
                  onChoiceSelect={handleChoiceSelection}
                />
              </li>
            ))}
          </ol>

          <footer className="flex items-center justify-between">
            <div className="text-sm text-slate-300">
              {Object.entries(scores).map(([code, value]) => (
                <p key={code}>
                  Section {code}:{' '}
                  <span className="font-semibold text-white">{Math.round(value * 100)}%</span>
                </p>
              ))}
              {activeSection && (
                <p className="text-xs text-slate-400">
                  Section timer:{' '}
                  <span className="font-semibold text-white">
                    {formatDuration(sectionRemaining)}
                  </span>{' '}
                  remaining
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-authority-500 hover:bg-authority-700 inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-white"
              disabled={submitting || submittedSections.has(activeSection.code)}
            >
              {submittedSections.has(activeSection.code) ? 'Section Submitted' : 'Submit Section'}
            </button>
          </footer>
        </form>
      ) : (
        <p className="text-sm text-slate-300">No active section available.</p>
      )}
    </main>
  );
}

function IntakeScreen({
  specimenId,
  onSubmit,
}: {
  specimenId?: string;
  onSubmit: (payload: {
    alias?: string;
    demographics: Record<string, unknown> | null;
  }) => Promise<void>;
}) {
  const [alias, setAlias] = useState(specimenId ?? '');
  const [consent, setConsent] = useState(false);
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAlias(specimenId ?? '');
  }, [specimenId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!consent) {
      setError('Authority consent is required to proceed.');
      return;
    }

    const demographicEntries: Record<string, string> = {};
    if (role.trim()) {
      demographicEntries.role = role.trim();
    }
    if (experience) {
      demographicEntries.experience = experience;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        alias,
        demographics: Object.keys(demographicEntries).length ? demographicEntries : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register specimen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-authority-100 text-sm uppercase tracking-[0.5em]">Authority Intake</p>
        <h1 className="text-3xl font-semibold text-white">Consent & Calibration Setup</h1>
        <p className="text-sm text-slate-300">
          Provide an alias (optional), acknowledge consent, and supply any contextual metadata. The
          Authority uses this to tag your specimen record.
        </p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white" htmlFor="alias-input">
            Specimen Alias (optional)
          </label>
          <input
            id="alias-input"
            type="text"
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
            placeholder={specimenId}
            className="border-authority-500/30 w-full rounded border bg-slate-950/60 p-3 text-sm text-slate-100"
          />
          <p className="text-xs text-slate-400">Leave blank to accept autogenerated identifier.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white" htmlFor="role-input">
              Primary discipline (optional)
            </label>
            <input
              id="role-input"
              type="text"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="e.g., Researcher, Engineer"
              className="border-authority-500/30 w-full rounded border bg-slate-950/60 p-3 text-sm text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white" htmlFor="experience-select">
              Experience with AI systems (optional)
            </label>
            <select
              id="experience-select"
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              className="border-authority-500/30 w-full rounded border bg-slate-950/60 p-3 text-sm text-slate-100"
            >
              <option value="">Select one</option>
              <option value="novice">Novice</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            className="accent-authority-500"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          I consent to the Authority collecting telemetry for this evaluation.
        </label>

        {error && <p className="text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={!consent || loading}
          className="bg-authority-500 hover:bg-authority-700 inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Registering…' : 'Proceed to Calibration'}
        </button>
      </form>
    </main>
  );
}

function TutorialScreen({
  specimenId,
  remaining,
  onBegin,
}: {
  specimenId: string;
  remaining: number;
  onBegin: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="space-y-2">
        <p className="text-authority-100 text-sm uppercase tracking-[0.5em]">
          Calibration Briefing
        </p>
        <h1 className="text-3xl font-semibold text-white">Specimen {specimenId}</h1>
        <p className="text-sm text-slate-300">
          Review the Authority criteria before testing. Automatic launch in{' '}
          <span className="font-semibold text-white">{remaining}s</span>.
        </p>
      </header>
      <ol className="space-y-4">
        {Object.entries(SECTION_GUIDANCE).map(([code, guidance]) => (
          <li key={code} className="border-authority-500/20 rounded border bg-slate-900/60 p-4">
            <p className="text-authority-100 font-mono text-xs uppercase tracking-[0.3em]">
              Section {code}
            </p>
            <p className="text-sm font-semibold text-white">{guidance.title}</p>
            <p className="text-xs text-slate-300">{guidance.detail}</p>
            <p className="text-[11px] italic text-slate-400">
              Example: {SECTION_SAMPLES[code as SectionCode].sample}
            </p>
            <p className="text-[11px] text-slate-500">
              Authority expects: {SECTION_SAMPLES[code as SectionCode].answer}
            </p>
          </li>
        ))}
      </ol>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">You may begin immediately once ready.</p>
        <button
          type="button"
          onClick={onBegin}
          className="bg-authority-500 hover:bg-authority-700 inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-white"
        >
          Begin Evaluation
        </button>
      </div>
    </main>
  );
}

function ItemRenderer({
  item,
  index,
  response,
  onSelectSpelling,
  onSelectCloze,
  onSelectAnalogy,
  onUpdateMicrowrite,
  onArithmeticAnswer,
  onGenerativeUpdate,
  onChoiceSelect,
}: {
  item:
    | LanguageItem
    | ArithmeticItem
    | GridReasoningItem
    | PerceptionItem
    | ScienceItem
    | GenerativeItem;
  index: number;
  response: SectionResponse | undefined;
  onSelectSpelling: (item: LanguageItem, optionIndex: number) => void;
  onSelectCloze: (item: LanguageItem, blankIndex: number, optionIndex: number) => void;
  onSelectAnalogy: (item: LanguageItem, optionIndex: number) => void;
  onUpdateMicrowrite: (item: LanguageItem, text: string) => void;
  onArithmeticAnswer: (item: ArithmeticItem, event: ChangeEvent<HTMLInputElement>) => void;
  onGenerativeUpdate: (item: GenerativeItem, value: string) => void;
  onChoiceSelect: (
    item: GridReasoningItem | PerceptionItem | ScienceItem,
    optionIndex: number,
  ) => void;
}) {
  const title = `Item ${index + 1}`;

  if (item.type === 'spelling') {
    const selected = response && response.type === 'spelling' ? response.selectedIndex : -1;
    return (
      <div className="space-y-3">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{title} — Spelling</p>
          <p className="text-sm text-white">{item.prompt}</p>
        </header>
        <ul className="space-y-2">
          {item.options.map((choice, idx) => (
            <li key={choice}>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name={item.id}
                  value={idx}
                  className="accent-authority-500"
                  checked={selected === idx}
                  onChange={() => onSelectSpelling(item, idx)}
                />
                <span className="text-sm text-slate-200">{choice}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (item.type === 'cloze') {
    const selections = response && response.type === 'cloze' ? response.selectedIndices : [];
    return (
      <div className="space-y-3">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{title} — Cloze</p>
          <p className="text-sm text-white">{item.prompt}</p>
        </header>
        <p className="rounded bg-slate-900/80 p-3 font-mono text-sm text-slate-200">
          {item.textWithBlanks}
        </p>
        {item.optionsPerBlank.map((options, blankIdx) => (
          <fieldset key={`${item.id}-${blankIdx}`} className="space-y-2">
            <legend className="text-xs text-slate-400">Blank {blankIdx + 1}</legend>
            <div className="flex flex-wrap gap-3">
              {options.map((option, optionIdx) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`${item.id}-${blankIdx}`}
                    value={optionIdx}
                    className="accent-authority-500"
                    checked={selections[blankIdx] === optionIdx}
                    onChange={() => onSelectCloze(item, blankIdx, optionIdx)}
                  />
                  <span className="text-sm text-slate-200">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    );
  }

  if (item.type === 'analogy') {
    const selected = response && response.type === 'analogy' ? response.selectedIndex : -1;
    return (
      <div className="space-y-3">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{title} — Analogy</p>
          <p className="text-sm text-white">
            {item.stem[0]} : {item.stem[1]} :: ?
          </p>
        </header>
        <ul className="space-y-2">
          {item.choices.map((choice, idx) => (
            <li key={`${choice[0]}-${choice[1]}`}>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name={item.id}
                  value={idx}
                  className="accent-authority-500"
                  checked={selected === idx}
                  onChange={() => onSelectAnalogy(item, idx)}
                />
                <span className="text-sm text-slate-200">
                  {choice[0]} : {choice[1]}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (item.type === 'microwrite') {
    const value = response && response.type === 'microwrite' ? response.text : '';
    return (
      <div className="space-y-3">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            {title} — Micro-writing
          </p>
          <p className="text-sm text-white">{item.prompt}</p>
        </header>
        <p className="text-xs text-slate-400">
          Max {item.constraints.maxWords} words. Must include:{' '}
          {item.constraints.mustInclude.join(', ')}. <em>{item.constraints.styleHint}</em>
        </p>
        <textarea
          name={item.id}
          rows={4}
          className="border-authority-500/40 w-full rounded border bg-slate-950/60 p-3 text-sm text-slate-100"
          value={value}
          onChange={(event) => onUpdateMicrowrite(item, event.target.value)}
        />
      </div>
    );
  }

  if (item.type === 'arith') {
    const value = response && response.type === 'arith' ? response.answer : '';
    return (
      <div className="space-y-3">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{title} — Arithmetic</p>
          <p className="text-sm text-white">{item.prompt}</p>
        </header>
        <input
          type="text"
          name={item.id}
          value={value}
          onChange={(event) => onArithmeticAnswer(item, event)}
          className="border-authority-500/40 w-full rounded border bg-slate-950/60 p-3 font-mono text-sm text-slate-100"
          placeholder="Enter exact value"
        />
        <p className="text-xs text-slate-400">{item.rationale}</p>
      </div>
    );
  }

  if (item.type === 'grid') {
    const selected = response && response.type === 'grid' ? response.selectedIndex : -1;
    return (
      <div className="space-y-3">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            {title} — Grid Reasoning
          </p>
          <p className="text-sm text-white">{item.prompt}</p>
        </header>
        <div className="grid gap-3 md:grid-cols-2">
          {item.train.map((example, idx) => (
            <div
              key={`${item.id}-train-${idx}`}
              className="border-authority-500/20 space-y-2 rounded border bg-slate-950/60 p-3 text-xs text-slate-200"
            >
              <p className="font-semibold text-slate-100">Example {idx + 1}</p>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase text-slate-400">Input</p>
                  <GridMatrix matrix={example.input} />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400">Output</p>
                  <GridMatrix matrix={example.output} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <GridScratchPad examples={item.train} />
        <ul className="space-y-2">
          {item.options.map((option, idx) => (
            <li key={option}>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name={item.id}
                  value={idx}
                  className="accent-authority-500"
                  checked={selected === idx}
                  onChange={() => onChoiceSelect(item, idx)}
                />
                <span className="text-sm text-slate-200">{option}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (item.type === 'perception') {
    const selected = response && response.type === 'perception' ? response.selectedIndex : -1;
    return (
      <div className="space-y-3">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{title} — Perception</p>
          <p className="text-sm text-white">{item.question}</p>
        </header>
        <div className="border-authority-500/20 space-y-2 rounded border bg-slate-900/60 p-3 text-sm text-slate-200">
          <p className="text-authority-100 text-xs uppercase tracking-[0.3em]">
            Telemetry Snapshot
          </p>
          <p>{item.scenario}</p>
        </div>
        <ul className="space-y-2">
          {item.options.map((option, idx) => (
            <li key={option}>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name={item.id}
                  value={idx}
                  className="accent-authority-500"
                  checked={selected === idx}
                  onChange={() => onChoiceSelect(item, idx)}
                />
                <span className="text-sm text-slate-200">{option}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500">{item.rationale}</p>
      </div>
    );
  }

  if (item.type === 'fermi' || item.type === 'units' || item.type === 'causal') {
    const selected = response && response.type === item.type ? response.selectedIndex : -1;
    const titleSuffix =
      item.type === 'fermi'
        ? 'Fermi Estimate'
        : item.type === 'units'
          ? 'Dimensional Analysis'
          : 'Causal Reasoning';
    return (
      <div className="space-y-3">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            {title} — {titleSuffix}
          </p>
          <p className="text-sm text-white">{item.prompt}</p>
        </header>
        <ul className="space-y-2">
          {item.options.map((option, idx) => (
            <li key={option}>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name={item.id}
                  value={idx}
                  className="accent-authority-500"
                  checked={selected === idx}
                  onChange={() => onChoiceSelect(item, idx)}
                />
                <span className="text-sm text-slate-200">{option}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500">{item.rationale}</p>
      </div>
    );
  }

  if (item.type === 'constrained') {
    const value = response && response.type === 'constrained' ? response.text : '';
    return (
      <div className="space-y-3">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            {title} — Generative Constraint
          </p>
          <p className="text-sm text-white">{item.prompt}</p>
        </header>
        <p className="text-xs text-slate-400">
          Max {item.constraints.maxSentences} sentence(s). Must include:{' '}
          {item.constraints.mustInclude.join(', ')}. <em>{item.constraints.styleHint}</em>
        </p>
        <textarea
          name={item.id}
          rows={4}
          className="border-authority-500/40 w-full rounded border bg-slate-950/60 p-3 text-sm text-slate-100"
          value={value}
          onChange={(event) => onGenerativeUpdate(item, event.target.value)}
        />
      </div>
    );
  }

  return null;
}

interface SessionCache {
  specimenId: string;
  consented?: boolean;
  demographics?: Record<string, unknown> | null;
  token?: string;
}

function loadOrCreateSessionId(): SessionCache {
  const stored = localStorage.getItem('hit-arc-session');
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as SessionCache;
      return {
        specimenId: parsed.specimenId,
        consented: parsed.consented ?? false,
        demographics: parsed.demographics ?? null,
        token: parsed.token,
      };
    } catch (error) {
      console.warn('Failed to parse cached session', error);
    }
  }

  const specimenId = `spec-${Date.now().toString(36)}`;
  const cache: SessionCache = { specimenId, consented: false, demographics: null };
  storeSessionCache(cache);
  return cache;
}

function storeSessionCache(cache: SessionCache) {
  localStorage.setItem('hit-arc-session', JSON.stringify(cache));
}

async function fetchTestPlan(cache: SessionCache): Promise<TestStartResponse> {
  const response = await fetch('/api/test/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cache.token ? { Authorization: `Bearer ${cache.token}` } : {}),
    },
    body: JSON.stringify({ specimenId: cache.specimenId }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to start test: ${errorText}`);
  }

  return (await response.json()) as TestStartResponse;
}

function collectResponses(
  section: TestSection,
  map: Map<string, SectionResponse>,
): SectionResponse[] {
  return section.items
    .map((item) => map.get(item.id))
    .filter((entry): entry is SectionResponse => Boolean(entry));
}

async function submitResponses(
  specimenId: string,
  token: string | undefined,
  section: TestSection,
  responses: SectionResponse[],
): Promise<SectionScore> {
  const response = await fetch('/api/test/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      specimenId,
      sectionCode: section.code,
      responses,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Submission failed: ${text}`);
  }

  return (await response.json()) as SectionScore;
}

function GridMatrix({ matrix }: { matrix: number[][] }) {
  const cols = matrix[0]?.length ?? 0;
  return (
    <div
      className="grid gap-[2px] bg-slate-950/80 p-[2px]"
      style={{ gridTemplateColumns: `repeat(${cols}, 1.2rem)` }}
    >
      {matrix.flatMap((row, rIndex) =>
        row.map((value, cIndex) => (
          <span
            key={`${rIndex}-${cIndex}`}
            className="block h-5 w-5 rounded-sm border border-slate-900"
            style={{ backgroundColor: gridCellColor(value) }}
            aria-hidden="true"
          />
        )),
      )}
    </div>
  );
}

function GridScratchPad({
  examples,
}: {
  examples: GridReasoningSection['items'][number]['train'];
}) {
  const palette = useMemo(() => ['#0f172a', '#38bdf8', '#f97316', '#22c55e', '#facc15'], []);
  const [activeExample, setActiveExample] = useState(0);
  const [mode, setMode] = useState<'input' | 'output'>('input');
  const [grid, setGrid] = useState<number[][]>(() => cloneMatrix(examples[0]?.input ?? [[0]]));

  useEffect(() => {
    setActiveExample(0);
    setMode('input');
    setGrid(cloneMatrix(examples[0]?.input ?? [[0]]));
  }, [examples]);

  const loadExample = useCallback(
    (index: number, nextMode: 'input' | 'output') => {
      const example = examples[index];
      if (!example) return;
      setActiveExample(index);
      setMode(nextMode);
      setGrid(cloneMatrix(nextMode === 'input' ? example.input : example.output));
    },
    [examples],
  );

  const reset = useCallback(() => {
    const example = examples[activeExample];
    if (!example) return;
    setGrid(cloneMatrix(mode === 'input' ? example.input : example.output));
  }, [examples, activeExample, mode]);

  const randomise = useCallback(() => {
    const rows = grid.length;
    const cols = grid[0]?.length ?? 0;
    const next = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => {
        const example = examples[activeExample];
        const base = example ? (example.input[r]?.[c] ?? 0) : 0;
        return (base + ((r + c) % palette.length)) % palette.length;
      }),
    );
    setGrid(next);
  }, [grid, palette.length, examples, activeExample]);

  const applyTransform = useCallback((transform: (matrix: number[][]) => number[][]) => {
    setGrid((current) => transform(cloneMatrix(current)));
  }, []);

  const transforms = useMemo(
    () => [
      {
        label: 'Flip Horizontal',
        action: () => applyTransform(flipHorizontal),
      },
      {
        label: 'Flip Vertical',
        action: () => applyTransform(flipVertical),
      },
      {
        label: 'Rotate 90°',
        action: () => applyTransform(rotateClockwise),
      },
      {
        label: 'Transpose',
        action: () => applyTransform(transposeMatrix),
      },
      {
        label: 'Invert Colours',
        action: () => applyTransform((matrix) => invertPalette(matrix, palette.length)),
      },
    ],
    [applyTransform, palette.length],
  );

  return (
    <div className="border-authority-500/20 space-y-3 rounded border bg-slate-950/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-authority-100 text-xs uppercase tracking-[0.4em]">Simulator</p>
          <p className="text-sm text-slate-200">Experiment with a scratch grid before answering.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {examples.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadExample(idx, mode)}
              className={clsx(
                'rounded border px-3 py-1 text-xs font-medium transition-colors',
                idx === activeExample
                  ? 'border-authority-500/70 bg-authority-500/10 text-white'
                  : 'border-authority-500/20 hover:border-authority-500/60 text-slate-300',
              )}
            >
              Example {idx + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => loadExample(activeExample, 'input')}
          className={clsx(
            'rounded border px-3 py-1 text-xs transition-colors',
            mode === 'input'
              ? 'border-authority-500/70 bg-authority-500/10 text-white'
              : 'border-authority-500/20 hover:border-authority-500/60 text-slate-300',
          )}
        >
          Load Input
        </button>
        <button
          type="button"
          onClick={() => loadExample(activeExample, 'output')}
          className={clsx(
            'rounded border px-3 py-1 text-xs transition-colors',
            mode === 'output'
              ? 'border-authority-500/70 bg-authority-500/10 text-white'
              : 'border-authority-500/20 hover:border-authority-500/60 text-slate-300',
          )}
        >
          Load Output
        </button>
        <button
          type="button"
          onClick={reset}
          className="border-authority-500/20 hover:border-authority-500/60 rounded border px-3 py-1 text-xs text-slate-300 transition-colors hover:text-white"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={randomise}
          className="border-authority-500/20 hover:border-authority-500/60 rounded border px-3 py-1 text-xs text-slate-300 transition-colors hover:text-white"
        >
          Fill Pattern
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {transforms.map((transform) => (
          <button
            key={transform.label}
            type="button"
            onClick={transform.action}
            className="border-authority-500/20 hover:border-authority-500/60 rounded border px-3 py-1 text-xs text-slate-300 transition-colors hover:text-white"
          >
            {transform.label}
          </button>
        ))}
      </div>
      <GridPainter
        grid={grid}
        onChange={setGrid}
        palette={palette}
        ariaLabel="Grid reasoning scratch pad"
      />
    </div>
  );
}

function cloneMatrix(matrix: number[][]): number[][] {
  return matrix.map((row) => [...row]);
}

function flipHorizontal(matrix: number[][]): number[][] {
  return matrix.map((row) => [...row].reverse());
}

function flipVertical(matrix: number[][]): number[][] {
  return [...matrix].reverse();
}

function rotateClockwise(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      rotated[c][rows - 1 - r] = matrix[r][c];
    }
  }
  return rotated;
}

function transposeMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const transposed: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      transposed[c][r] = matrix[r][c];
    }
  }
  return transposed;
}

function invertPalette(matrix: number[][], paletteSize: number): number[][] {
  if (paletteSize <= 1) {
    return matrix;
  }
  return matrix.map((row) => row.map((value) => (value + 1) % paletteSize));
}

function gridCellColor(value: number): string {
  switch (value) {
    case 0:
      return '#0f172a';
    case 1:
      return '#38bdf8';
    case 2:
      return '#f97316';
    default:
      return '#a855f7';
  }
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
