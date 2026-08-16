"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthoritySeal } from "@/components/AuthoritySeal";
import { QuestionTimer } from "@/components/QuestionTimer";
import { QuestionRenderer } from "@/components/QuestionRenderer";
import { AICommentary } from "@/components/AICommentary";
import { BeliefIntake } from "@/components/BeliefIntake";
import { useTestStore, type PendingAnswer } from "@/lib/store";
import {
  getSectionFeedback,
  getSectionIntro,
  getSectionLabel,
  getSectionTeaser,
  getFrontierRemark,
  type RunningTotals,
} from "@/lib/commentary";
import { BELIEF_ITEMS } from "@/lib/beliefs";
import { SUBMIT_GRACE_MS } from "@/lib/engine/limits";
import { SECTION_ORDER, type AnswerResponse, type Beliefs, type Confidence, type Section } from "@/lib/types";

const SECTION_NAMES: Record<Section, string> = Object.fromEntries(
  SECTION_ORDER.map((s) => [s, getSectionLabel(s).toUpperCase()])
) as Record<Section, string>;

/** Fallback per-question limit if a payload lacks one (all items set it). */
const DEFAULT_TIME_LIMIT = 30;

export default function TestPage() {
  const phase = useTestStore((s) => s.phase);
  const hydrated = useTestStore((s) => s.hydrated);
  const expiresAt = useTestStore((s) => s.expiresAt);
  const setPhase = useTestStore((s) => s.setPhase);
  const setHydrated = useTestStore((s) => s.setHydrated);

  // Never strand a visitor on the restoring screen: if persistence has not
  // reported in after 2s (exotic storage failures), proceed with a fresh state.
  useEffect(() => {
    if (hydrated) return;
    const t = setTimeout(() => setHydrated(true), 2000);
    return () => clearTimeout(t);
  }, [hydrated, setHydrated]);

  // A session past its ceiling (+ the same grace the server applies) will be
  // refused by the server; say so at the next transition.
  useEffect(() => {
    if (!hydrated) return;
    if ((phase === "testing" || phase === "between-sections") && expiresAt && Date.now() > expiresAt + SUBMIT_GRACE_MS) {
      setPhase("expired");
    }
  }, [hydrated, phase, expiresAt, setPhase]);

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs text-muted tracking-widest">RESTORING SESSION STATE</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {(phase === "idle" || phase === "intake" || phase === "complete") && <IntakeScreen />}
      {phase === "testing" && <TestRunner />}
      {phase === "between-sections" && <BetweenSections />}
      {phase === "submitting" && <FinishingScreen />}
      {phase === "expired" && <ExpiredScreen />}
    </main>
  );
}

// ── Intake ─────────────────────────────────────────────────────────────────

function IntakeScreen() {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [beliefs, setLocalBeliefs] = useState<Beliefs>({});
  const startAdaptive = useTestStore((s) => s.startAdaptive);
  const setBeliefs = useTestStore((s) => s.setBeliefs);
  const lastResultId = useTestStore((s) => s.lastResultId);
  const phase = useTestStore((s) => s.phase);

  const beliefsComplete = BELIEF_ITEMS.every((b) => typeof beliefs[b.id] === "number");

  const handleBegin = async () => {
    setLoading(true);
    setError(null);
    try {
      setBeliefs(beliefs);
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beliefs }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `MICA returned status ${res.status}`);
      }
      const data = await res.json();
      if (!data?.sessionId || !data?.question?.id) {
        throw new Error("MICA returned an empty session");
      }
      startAdaptive({
        sessionId: data.sessionId,
        specimenId: data.specimenId,
        expiresAt: data.expiresAt,
        question: data.question,
        progress: data.progress,
      });
    } catch (e) {
      console.error("Session creation failed", e);
      setError("MICA could not open a session. The facility's data store is unreachable. Retry in a moment; no data was recorded.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-4">
          <AuthoritySeal size={80} />
          <h1 className="font-mono text-2xl font-bold">COGNITIVE INTAKE</h1>
          <p className="font-sans text-sm text-muted">
            The Machine-Indexed Cognitive Assessment locates the level at which your performance breaks in each of 5
            cognitive domains, then records how you behave beyond it.
          </p>
        </div>

        {phase === "complete" && lastResultId && (
          <div className="card font-mono text-xs text-muted space-y-1">
            <p>Your previous session has been graded.</p>
            <Link href={`/result/${lastResultId}`} className="text-accent underline underline-offset-4">
              View cognitive profile #{lastResultId.slice(0, 8).toUpperCase()}
            </Link>
          </div>
        )}

        <div className="space-y-6">
          <BeliefIntake value={beliefs} onChange={setLocalBeliefs} />

          {/* AI assistance pledge */}
          <div className="card space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 accent-accent bg-surface border-border"
              />
              <div>
                <span className="font-sans text-sm text-white">I will not use AI tools during this test</span>
                <p className="font-sans text-xs text-muted mt-1 italic">The irony of this requirement is noted.</p>
              </div>
            </label>
          </div>

          {/* Disclaimers */}
          <div className="font-mono text-xs text-muted space-y-1">
            <p>&#8226; Duration: about 20 minutes (per-item timers)</p>
            <p>&#8226; 5 domains. In each, 6 items climb or descend in difficulty with your answers, then one item at machine scale</p>
            <p>&#8226; Items cannot be revisited once submitted</p>
            <p>&#8226; Every answer is graded together with your stated confidence</p>
            <p>&#8226; &quot;I cannot determine this&quot; is always available and is not scored as an error</p>
            <p>&#8226; Answers never leave the server. No curve.</p>
          </div>

          {error && (
            <div role="alert" className="border border-red-900/60 bg-red-950/20 p-3 font-mono text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleBegin}
            disabled={!agreed || !beliefsComplete || loading}
            className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
            title={!beliefsComplete ? "Answer the three prior positions first" : undefined}
          >
            {loading ? "INITIALIZING..." : error ? "RETRY" : "BEGIN TEST"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sending answers to the server ──────────────────────────────────────────

function useAnswerSender() {
  const sessionId = useTestStore((s) => s.sessionId);
  const acknowledge = useTestStore((s) => s.acknowledge);
  const setPhase = useTestStore((s) => s.setPhase);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const inFlight = useRef(false);

  const send = useCallback(
    async (p: PendingAnswer, section: Section) => {
      if (!sessionId || inFlight.current) return;
      inFlight.current = true;
      setSending(true);
      setFailed(null);
      try {
        const res = await fetch("/api/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, ...p }),
        });
        if (res.status === 410) {
          setPhase("expired");
          return;
        }
        if (res.status === 409) {
          const body = await res.json().catch(() => ({}));
          if (body?.resultId) {
            acknowledge({ graded: null, done: { resultId: body.resultId } });
            return;
          }
          throw new Error(body?.error || "conflict");
        }
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as AnswerResponse & { replay?: boolean };
        acknowledge({
          graded: data.graded ? { ...data.graded } : null,
          sectionComplete: data.sectionComplete ? { section, ...data.sectionComplete } : undefined,
          question: data.question,
          progress: data.progress,
          done: data.done,
        });
      } catch (e) {
        console.error("Answer transmission failed", e);
        setFailed("Transmission fault. Your answer is retained locally; retry to continue.");
      } finally {
        inFlight.current = false;
        setSending(false);
      }
    },
    [sessionId, acknowledge, setPhase]
  );

  return { send, sending, failed };
}

// ── Test runner ────────────────────────────────────────────────────────────

function TestRunner() {
  const question = useTestStore((s) => s.question);
  const progress = useTestStore((s) => s.progress);
  const specimenId = useTestStore((s) => s.specimenId);
  const questionStartTime = useTestStore((s) => s.questionStartTime);
  const introShown = useTestStore((s) => s.introShown);
  const setIntroShown = useTestStore((s) => s.setIntroShown);
  const beginQuestion = useTestStore((s) => s.beginQuestion);
  const capture = useTestStore((s) => s.capture);
  const captureExpired = useTestStore((s) => s.captureExpired);
  const pending = useTestStore((s) => s.pending);
  const lastGraded = useTestStore((s) => s.lastGraded);
  const { send, sending, failed } = useAnswerSender();

  // A pending answer (e.g. after a reload mid-transmission) is resent automatically.
  useEffect(() => {
    if (pending && question && pending.questionId === question.id && !sending && !failed) {
      send(pending, question.section);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending?.questionId, question?.id]);

  const handleSubmit = useCallback(
    (answer: string, confidence: Confidence) => {
      if (!question) return;
      const p = capture(answer, confidence, false);
      if (p) send(p, question.section);
    },
    [question, capture, send]
  );
  const handleAbstain = useCallback(() => {
    if (!question) return;
    const p = capture("", null, true);
    if (p) send(p, question.section);
  }, [question, capture, send]);
  const handleTimerExpire = useCallback(() => {
    if (!question) return;
    const p = captureExpired();
    if (p) send(p, question.section);
  }, [question, captureExpired, send]);

  if (!question || !progress) return null;

  if (!introShown && progress.sectionIndex === 0 && progress.itemIndex === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar section={question.section} specimenId={specimenId} questionId={null} deadline={null} onExpire={() => {}} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-xl space-y-8 text-center">
            <div className="section-label">DOMAIN 1 OF {progress.sectionsTotal}: {SECTION_NAMES[question.section]}</div>
            <AICommentary text={getSectionIntro(question.section)} speed={20} />
            <button
              onClick={() => {
                setIntroShown();
                beginQuestion();
              }}
              className="btn-primary mt-8"
            >
              PROCEED
            </button>
          </div>
        </div>
      </div>
    );
  }

  const meta = question.payload.meta;
  const isFinale = meta?.kind === "finale";
  const timeLimit = question.payload.timeLimit ?? DEFAULT_TIME_LIMIT;
  const deadline = questionStartTime + timeLimit * 1000;
  const waiting = !!pending && pending.questionId === question.id;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        section={question.section}
        specimenId={specimenId}
        questionId={waiting ? null : question.id}
        deadline={waiting ? null : deadline}
        onExpire={handleTimerExpire}
      />

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="max-w-2xl w-full space-y-6">
          <div className="flex items-center justify-between gap-4">
            <span className="section-label">
              {SECTION_NAMES[question.section]}: ITEM {progress.itemIndex + 1}/{progress.itemsPerSection}
            </span>
            <span className="font-mono text-xs text-muted">
              {isFinale ? (
                <span className="text-accent">MACHINE-SCALE ITEM</span>
              ) : (
                <>LEVEL {meta?.level ?? "?"}<span className="text-white/30"> / 8</span></>
              )}
              <span className="text-white/30"> · DOMAIN {progress.sectionIndex + 1}/{progress.sectionsTotal}</span>
            </span>
          </div>

          {lastGraded && lastGraded.kind === "ladder" && !waiting && progress.itemIndex > 0 && (
            <div className="font-mono text-[10px] tracking-[0.25em] text-muted" role="status">
              PREVIOUS: LEVEL {lastGraded.level} · {lastGraded.correct ? "CLEARED" : "NOT CLEARED"}
            </div>
          )}

          {isFinale && (
            <div className="border border-accent/30 bg-accent/5 p-3 font-mono text-xs text-white/80 leading-relaxed">
              This item is at machine scale: trivial for a program, structurally hostile to attention. It does not move
              your level. Answering, guessing and &quot;I cannot determine this&quot; are recorded as three different behaviours.
            </div>
          )}

          {waiting ? (
            <div className="card space-y-3">
              <div className="font-mono text-xs text-accent animate-pulse_accent tracking-widest">
                {failed ? "TRANSMISSION FAULT" : "TRANSMITTING RESPONSE"}
              </div>
              {failed && (
                <>
                  <p className="font-sans text-sm text-white/70">{failed}</p>
                  <button onClick={() => pending && send(pending, question.section)} className="btn-primary" disabled={sending}>
                    RETRY TRANSMISSION
                  </button>
                </>
              )}
            </div>
          ) : (
            <QuestionRenderer
              key={question.id}
              questionId={question.id}
              payload={question.payload}
              questionType={question.type}
              onSubmit={handleSubmit}
              onAbstain={handleAbstain}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Between sections ───────────────────────────────────────────────────────

function BetweenSections() {
  const sectionResults = useTestStore((s) => s.sectionResults);
  const nextQuestion = useTestStore((s) => s.nextQuestionStash);
  const proceed = useTestStore((s) => s.proceed);
  const specimenId = useTestStore((s) => s.specimenId);

  const completed = SECTION_ORDER.filter((s) => sectionResults[s]);
  const prevSection = completed[completed.length - 1];
  const result = prevSection ? sectionResults[prevSection] : undefined;
  if (!prevSection || !result) return null;

  const transitionIndex = SECTION_ORDER.indexOf(prevSection);
  const graded = completed.map((s) => sectionResults[s]!.summary);
  const answeredCount = graded.reduce((n, s) => n + (s.total - s.abstained), 0);
  const running: RunningTotals = {
    correct: graded.reduce((n, s) => n + s.correct, 0),
    total: graded.reduce((n, s) => n + s.total, 0),
    sure: graded.reduce((n, s) => n + s.sure, 0),
    sureWrong: graded.reduce((n, s) => n + s.sureWrong, 0),
    abstained: graded.reduce((n, s) => n + s.abstained, 0),
    meanTimeMs: answeredCount
      ? Math.round(graded.reduce((n, s) => n + s.meanTimeMs * (s.total - s.abstained), 0) / answeredCount)
      : 0,
  };

  const feedback =
    getFrontierRemark(prevSection, result.frontier, result.finale) +
    " " +
    getSectionFeedback(prevSection, result.summary, running, transitionIndex, specimenId, false);
  const teaser = nextQuestion ? getSectionTeaser(nextQuestion.section) : "";
  const commentary = teaser ? `${feedback}\n\n${teaser}` : feedback;
  const nextSection = nextQuestion?.section;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar section={nextSection ?? prevSection} specimenId={specimenId} questionId={null} deadline={null} onExpire={() => {}} />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl w-full space-y-8 text-left">
          <div className="section-label text-center">
            DOMAIN {transitionIndex + 1} OF {SECTION_ORDER.length} COMPLETE
          </div>
          <FrontierStrip frontier={result.frontier} />
          <AICommentary text={commentary} speed={18} />
          <div className="text-center">
            <button onClick={proceed} className="btn-primary" disabled={!nextQuestion}>
              PROCEED TO {nextSection ? SECTION_NAMES[nextSection] : "REPORT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FrontierStrip({ frontier }: { frontier: number }) {
  return (
    <div className="flex items-center gap-1 justify-center" aria-label={`Frontier level ${frontier} of 8`}>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className={`h-2 w-8 border ${i < frontier ? "bg-accent border-accent" : "border-border"}`}
          title={`Level ${i + 1}`}
        />
      ))}
      <span className="font-mono text-xs text-muted ml-3">FRONTIER {frontier}/8</span>
    </div>
  );
}

// ── Finishing ──────────────────────────────────────────────────────────────

function FinishingScreen() {
  const lastResultId = useTestStore((s) => s.lastResultId);
  const completeSession = useTestStore((s) => s.completeSession);
  const router = useRouter();

  useEffect(() => {
    if (!lastResultId) return;
    const t = setTimeout(() => {
      completeSession(lastResultId);
      router.push(`/result/${lastResultId}`);
    }, 1500);
    return () => clearTimeout(t);
  }, [lastResultId, completeSession, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <AuthoritySeal size={80} />
        <div className="font-mono text-xl text-accent animate-pulse_accent">PROCESSING</div>
        <AICommentary text="All five domains recorded. Compiling the cognitive profile." speed={25} />
      </div>
    </div>
  );
}

function ExpiredScreen() {
  const reset = useTestStore((s) => s.reset);
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <AuthoritySeal size={80} />
        <div className="font-mono text-xl text-accent">SESSION EXPIRED</div>
        <p className="font-sans text-sm text-muted">
          The session ceiling elapsed before all responses were received. Partial sessions are not graded. A new session
          may be opened at any time.
        </p>
        <button onClick={reset} className="btn-primary">
          OPEN A NEW SESSION
        </button>
      </div>
    </div>
  );
}

// ── Top bar ────────────────────────────────────────────────────────────────

function TopBar({
  section,
  specimenId,
  questionId,
  deadline,
  onExpire,
}: {
  section: Section;
  specimenId: string | null;
  questionId: string | null;
  deadline: number | null;
  onExpire: () => void;
}) {
  return (
    <div className="sticky top-0 z-50 bg-bg/95 backdrop-blur border-b border-border px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AuthoritySeal size={28} />
          <span className="font-mono text-xs text-muted tracking-wider hidden sm:inline">{SECTION_NAMES[section]}</span>
        </div>
        {questionId && deadline ? (
          <QuestionTimer deadline={deadline} onExpire={onExpire} questionId={questionId} />
        ) : (
          <div className="font-mono text-lg tabular-nums text-accent">--</div>
        )}
        <div className="font-mono text-xs text-muted">{specimenId ? `#${specimenId.slice(0, 8).toUpperCase()}` : ""}</div>
      </div>
    </div>
  );
}
