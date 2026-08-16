"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthoritySeal } from "@/components/AuthoritySeal";
import { QuestionTimer } from "@/components/QuestionTimer";
import { QuestionRenderer } from "@/components/QuestionRenderer";
import { AICommentary } from "@/components/AICommentary";
import { BeliefIntake } from "@/components/BeliefIntake";
import { useTestStore } from "@/lib/store";
import { getSectionFeedback, getSectionIntro, getSectionTeaser, type RunningTotals } from "@/lib/commentary";
import { BELIEF_ITEMS } from "@/lib/beliefs";
import { SUBMIT_GRACE_MS } from "@/lib/engine/limits";
import { SECTION_ORDER, type Beliefs, type Confidence, type Section, type SectionSummary } from "@/lib/types";

const SECTION_NAMES: Record<Section, string> = {
  structural: "ABSTRACT STRUCTURE",
  "state-tracking": "STATE TRACKING",
  "sequential-depth": "SEQUENTIAL DEPTH",
  "signal-detection": "SIGNAL DETECTION",
  probabilistic: "PROBABILISTIC INFERENCE",
};

/** Fallback per-question limit if a payload lacks one (all bank items set it). */
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
  // refused by /api/submit; say so at the next transition instead of letting
  // the visitor finish and fail at the end. Inside the grace window we let the
  // visitor continue and the server grades normally.
  useEffect(() => {
    if (!hydrated) return;
    if (
      (phase === "testing" || phase === "between-sections") &&
      expiresAt &&
      Date.now() > expiresAt + SUBMIT_GRACE_MS
    ) {
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
      {phase === "submitting" && <SubmittingScreen />}
      {phase === "expired" && <ExpiredScreen />}
    </main>
  );
}

function IntakeScreen() {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [beliefs, setLocalBeliefs] = useState<Beliefs>({});
  const startSession = useTestStore((s) => s.startSession);
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
      if (!data?.sessionId || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("MICA returned an empty session");
      }
      startSession({
        sessionId: data.sessionId,
        specimenId: data.specimenId,
        expiresAt: data.expiresAt,
        questions: data.questions,
      });
    } catch (e) {
      console.error("Session creation failed", e);
      setError(
        "MICA could not open a session. The facility's data store is unreachable. Retry in a moment; no data was recorded."
      );
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
            The Machine-Indexed Cognitive Assessment will evaluate your
            performance across 5 cognitive domains designed to probe the
            boundaries of biological computation.
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
                <span className="font-sans text-sm text-white">
                  I will not use AI tools during this test
                </span>
                <p className="font-sans text-xs text-muted mt-1 italic">
                  The irony of this requirement is noted.
                </p>
              </div>
            </label>
          </div>

          {/* Disclaimers */}
          <div className="font-mono text-xs text-muted space-y-1">
            <p>&#8226; Duration: ≤15 minutes (per-question timers)</p>
            <p>&#8226; Questions cannot be revisited once submitted</p>
            <p>&#8226; A unique session ID will be assigned</p>
            <p>&#8226; 25 questions across 5 sections</p>
            <p>&#8226; Every answer is graded together with your stated confidence</p>
            <p>&#8226; &quot;I cannot determine this&quot; is always available and is not scored as an error</p>
            <p>&#8226; Answers never leave the server. No partial credit. No curve.</p>
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

function TestRunner() {
  const questions = useTestStore((s) => s.questions);
  const currentIndex = useTestStore((s) => s.currentIndex);
  const specimenId = useTestStore((s) => s.specimenId);
  const questionStartTime = useTestStore((s) => s.questionStartTime);
  const introShown = useTestStore((s) => s.introShown);
  const setIntroShown = useTestStore((s) => s.setIntroShown);
  const beginQuestion = useTestStore((s) => s.beginQuestion);
  const setAnswer = useTestStore((s) => s.setAnswer);
  const nextQuestion = useTestStore((s) => s.nextQuestion);
  const expireQuestion = useTestStore((s) => s.expireQuestion);
  const abstainQuestion = useTestStore((s) => s.abstainQuestion);

  const currentQ = questions[currentIndex];

  const handleSubmit = useCallback(
    (answer: string, confidence: Confidence) => {
      if (!currentQ) return;
      setAnswer(currentQ.id, answer, confidence, false);
      nextQuestion();
    },
    [currentQ, setAnswer, nextQuestion]
  );

  const handleAbstain = useCallback(() => {
    abstainQuestion();
  }, [abstainQuestion]);

  // Clock ran out: the store records the draft (possibly empty) and advances.
  const handleTimerExpire = useCallback(() => {
    expireQuestion();
  }, [expireQuestion]);

  if (!currentQ) return null;

  if (!introShown && currentIndex === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar section={currentQ.section} specimenId={specimenId} questionId={null} deadline={null} onExpire={() => {}} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-xl space-y-8 text-center">
            <div className="section-label">
              SECTION: {SECTION_NAMES[currentQ.section]}
            </div>
            <AICommentary
              text={getSectionIntro(currentQ.section)}
              speed={20}
              onComplete={() => {}}
            />
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

  const sectionQuestions = questions.filter(
    (q) => q.section === currentQ.section
  );
  const sectionIdx =
    sectionQuestions.findIndex((q) => q.id === currentQ.id) + 1;

  const timeLimit = currentQ.payload.timeLimit ?? DEFAULT_TIME_LIMIT;
  const deadline = questionStartTime + timeLimit * 1000;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        section={currentQ.section}
        specimenId={specimenId}
        questionId={currentQ.id}
        deadline={deadline}
        onExpire={handleTimerExpire}
      />

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="max-w-2xl w-full space-y-6">
          <div className="flex items-center justify-between">
            <span className="section-label">
              {SECTION_NAMES[currentQ.section]}: Q{sectionIdx}/
              {sectionQuestions.length}
            </span>
            <span className="font-mono text-xs text-muted">
              {currentIndex + 1}/{questions.length} TOTAL
            </span>
          </div>

          <QuestionRenderer
            key={currentQ.id}
            questionId={currentQ.id}
            payload={currentQ.payload}
            questionType={currentQ.type}
            onSubmit={handleSubmit}
            onAbstain={handleAbstain}
          />
        </div>
      </div>
    </div>
  );
}

function BetweenSections() {
  const questions = useTestStore((s) => s.questions);
  const currentIndex = useTestStore((s) => s.currentIndex);
  const answers = useTestStore((s) => s.answers);
  const sessionId = useTestStore((s) => s.sessionId);
  const sectionSummaries = useTestStore((s) => s.sectionSummaries);
  const setSectionSummary = useTestStore((s) => s.setSectionSummary);
  const setPhase = useTestStore((s) => s.setPhase);
  const beginQuestion = useTestStore((s) => s.beginQuestion);
  const specimenId = useTestStore((s) => s.specimenId);
  const [gradingFailed, setGradingFailed] = useState(false);
  const requested = useRef<string | null>(null);

  const currentQ = questions[currentIndex];
  const prevSection = questions[currentIndex - 1]?.section;
  const summary = prevSection ? sectionSummaries[prevSection] : undefined;

  // Grade the section just completed so the Authority can react to it. The
  // final submit re-sends everything, so a failure here costs only the remark.
  useEffect(() => {
    if (!prevSection || !sessionId || summary || requested.current === prevSection) return;
    requested.current = prevSection;
    const sectionQs = questions.filter((q) => q.section === prevSection);
    const responses = sectionQs.map((q) => ({
      questionId: q.id,
      answer: answers[q.id]?.answer ?? "",
      timeMs: answers[q.id]?.timeMs ?? 0,
      confidence: answers[q.id]?.confidence ?? null,
      abstained: answers[q.id]?.abstained ?? false,
    }));
    fetch("/api/section", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, responses }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`section grading ${res.status}`);
        const data = await res.json();
        const s = (data.sections as SectionSummary[] | undefined)?.find((x) => x.section === prevSection);
        if (s) setSectionSummary(s);
        else throw new Error("no summary");
      })
      .catch((e) => {
        console.warn("Section grading unavailable; continuing without feedback", e);
        setGradingFailed(true);
      });
  }, [prevSection, sessionId, summary, questions, answers, setSectionSummary]);

  if (!prevSection || !currentQ) return null;

  const transitionIndex = SECTION_ORDER.indexOf(prevSection);
  const graded = SECTION_ORDER.map((s) => sectionSummaries[s]).filter((s): s is SectionSummary => !!s);
  const running: RunningTotals = {
    correct: graded.reduce((n, s) => n + s.correct, 0),
    total: graded.reduce((n, s) => n + s.total, 0),
    sure: graded.reduce((n, s) => n + s.sure, 0),
    sureWrong: graded.reduce((n, s) => n + s.sureWrong, 0),
    abstained: graded.reduce((n, s) => n + s.abstained, 0),
    meanTimeMs: graded.length ? Math.round(graded.reduce((n, s) => n + s.meanTimeMs, 0) / graded.length) : 0,
  };

  const feedback = summary
    ? getSectionFeedback(prevSection, summary, running, transitionIndex, specimenId)
    : gradingFailed
      ? `${SECTION_NAMES[prevSection]} received. Grading deferred to the end of the session.`
      : `${SECTION_NAMES[prevSection]} received. Grading...`;

  const commentary = `${feedback}\n\n${getSectionTeaser(currentQ.section)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar section={currentQ.section} specimenId={specimenId} questionId={null} deadline={null} onExpire={() => {}} />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl w-full space-y-8 text-left">
          <div className="section-label text-center">
            SECTION {transitionIndex + 1} OF {SECTION_ORDER.length} COMPLETE
          </div>
          <AICommentary key={summary ? "graded" : gradingFailed ? "failed" : "pending"} text={commentary} speed={18} />
          <div className="text-center">
            <button
              onClick={() => {
                beginQuestion();
                setPhase("testing");
              }}
              className="btn-primary"
            >
              PROCEED TO {SECTION_NAMES[currentQ.section]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmittingScreen() {
  const sessionId = useTestStore((s) => s.sessionId);
  const answers = useTestStore((s) => s.answers);
  const questions = useTestStore((s) => s.questions);
  const completeSession = useTestStore((s) => s.completeSession);
  const reset = useTestStore((s) => s.reset);
  const setPhase = useTestStore((s) => s.setPhase);
  const router = useRouter();
  const [status, setStatus] = useState("Compiling responses...");
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const inFlight = useRef(false);

  useEffect(() => {
    if (!sessionId || inFlight.current) return;
    inFlight.current = true;
    setFailed(false);

    const submit = async () => {
      setStatus("Transmitting data to MICA...");

      const responses = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id]?.answer ?? "",
        timeMs: answers[q.id]?.timeMs ?? 0,
        confidence: answers[q.id]?.confidence ?? null,
        abstained: answers[q.id]?.abstained ?? false,
      }));

      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, responses }),
        });

        if (res.status === 410) {
          // Past the ceiling + grace: retrying can never succeed.
          setPhase("expired");
          return;
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setStatus(
            `Transmission error: ${errData.error || "MICA encountered an unexpected fault."} Your responses are retained locally.`
          );
          setFailed(true);
          return;
        }

        const data = await res.json();

        if (!data.resultId) {
          setStatus("MICA failed to generate a report. Your responses are retained locally.");
          setFailed(true);
          return;
        }

        setStatus("Analysis complete. Generating Cognitive Autopsy...");
        await new Promise((r) => setTimeout(r, 1500));

        completeSession(data.resultId);
        router.push(`/result/${data.resultId}`);
      } catch (e) {
        console.error("Submit failed", e);
        setStatus("Transmission error: the facility is unreachable. Your responses are retained locally.");
        setFailed(true);
      } finally {
        inFlight.current = false;
      }
    };

    submit();
  }, [sessionId, answers, questions, router, completeSession, setPhase, attempt]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <AuthoritySeal size={80} />
        <div className={`font-mono text-xl ${failed ? "text-red-400" : "text-accent animate-pulse_accent"}`}>
          {failed ? "TRANSMISSION FAULT" : "PROCESSING"}
        </div>
        <AICommentary text={status} speed={30} />
        {failed && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <button onClick={() => setAttempt((a) => a + 1)} className="btn-primary">
              RETRY TRANSMISSION
            </button>
            <button
              onClick={() => {
                reset();
                router.push("/");
              }}
              className="font-mono text-xs text-muted underline underline-offset-4"
            >
              ABANDON SESSION
            </button>
          </div>
        )}
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
          The session ceiling elapsed before all responses were received. Partial
          sessions are not graded. A new session may be opened at any time.
        </p>
        <button onClick={reset} className="btn-primary">
          OPEN A NEW SESSION
        </button>
      </div>
    </div>
  );
}

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
          <span className="font-mono text-xs text-muted tracking-wider hidden sm:inline">
            {SECTION_NAMES[section]}
          </span>
        </div>
        {questionId && deadline ? (
          <QuestionTimer
            deadline={deadline}
            onExpire={onExpire}
            questionId={questionId}
          />
        ) : (
          <div className="font-mono text-lg tabular-nums text-accent">--</div>
        )}
        <div className="font-mono text-xs text-muted">
          {specimenId ? `#${specimenId.slice(0, 8).toUpperCase()}` : ""}
        </div>
      </div>
    </div>
  );
}
