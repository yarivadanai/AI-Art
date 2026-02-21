"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthoritySeal } from "@/components/AuthoritySeal";
import { QuestionTimer } from "@/components/QuestionTimer";
import { QuestionRenderer } from "@/components/QuestionRenderer";
import { AICommentary } from "@/components/AICommentary";
import { useTestStore } from "@/lib/store";
import { getSectionIntro } from "@/lib/commentary";
import type { Section } from "@/lib/types";

const SECTION_NAMES: Record<Section, string> = {
  structural: "ABSTRACT STRUCTURE",
  "state-tracking": "STATE TRACKING",
  "sequential-depth": "SEQUENTIAL DEPTH",
  "signal-detection": "SIGNAL DETECTION",
  probabilistic: "PROBABILISTIC INFERENCE",
};

export default function TestPage() {
  const phase = useTestStore((s) => s.phase);

  return (
    <main className="min-h-screen">
      {phase === "idle" && <IntakeScreen />}
      {phase === "intake" && <IntakeScreen />}
      {phase === "testing" && <TestRunner />}
      {phase === "between-sections" && <BetweenSections />}
      {phase === "submitting" && <SubmittingScreen />}
    </main>
  );
}

function IntakeScreen() {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const startSession = useTestStore((s) => s.startSession);

  const handleBegin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      startSession({
        sessionId: data.sessionId,
        specimenId: data.specimenId,
        expiresAt: data.expiresAt,
        questions: data.questions,
      });
    } catch {
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
            The Synthetic Cognitive Capacity Assessment will evaluate your
            performance across 5 cognitive domains designed to probe the
            boundaries of biological computation.
          </p>
        </div>

        <div className="space-y-6">
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
            <p>&#8226; Duration: ≤20 minutes (per-question timers)</p>
            <p>&#8226; Questions cannot be revisited once submitted</p>
            <p>&#8226; A unique session ID will be assigned</p>
            <p>&#8226; 25 questions across 5 sections</p>
            <p>&#8226; SHA-256 hash-based grading. No partial credit. No curve.</p>
          </div>

          <button
            onClick={handleBegin}
            disabled={!agreed || loading}
            className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? "INITIALIZING..." : "BEGIN TEST"}
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
  const setAnswer = useTestStore((s) => s.setAnswer);
  const nextQuestion = useTestStore((s) => s.nextQuestion);
  const [showIntro, setShowIntro] = useState(true);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (currentIndex === 0) {
      setShowIntro(true);
    }
  }, [currentIndex]);

  const handleSubmit = useCallback(
    (answer: string) => {
      if (!currentQ) return;
      setAnswer(currentQ.id, answer);
      nextQuestion();
    },
    [currentQ, setAnswer, nextQuestion]
  );

  const handleTimerExpire = useCallback(() => {
    if (!currentQ) return;
    // Auto-submit current answer (or blank) on expiry
    const store = useTestStore.getState();
    const existing = store.answers[currentQ.id];
    if (!existing) {
      setAnswer(currentQ.id, "");
    }
    nextQuestion();
  }, [currentQ, setAnswer, nextQuestion]);

  if (!currentQ) return null;

  if (showIntro && currentIndex === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar section={currentQ.section} specimenId={specimenId} questionId={null} timeLimit={null} onExpire={() => {}} />
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
              onClick={() => setShowIntro(false)}
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

  const timeLimit = currentQ.payload.timeLimit ?? 20;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        section={currentQ.section}
        specimenId={specimenId}
        questionId={currentQ.id}
        timeLimit={timeLimit}
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
            questionId={currentQ.id}
            payload={currentQ.payload}
            questionType={currentQ.type}
            onSubmit={handleSubmit}
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
  const setPhase = useTestStore((s) => s.setPhase);
  const specimenId = useTestStore((s) => s.specimenId);

  const currentQ = questions[currentIndex];
  const prevSection = questions[currentIndex - 1]?.section;

  if (!prevSection || !currentQ) return null;

  const prevSectionQs = questions.filter((q) => q.section === prevSection);
  const answeredCount = prevSectionQs.filter((q) => answers[q.id]).length;

  const commentary = `Section complete. ${answeredCount} of ${prevSectionQs.length} questions received responses. Proceeding to next evaluation domain.`;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar section={currentQ.section} specimenId={specimenId} questionId={null} timeLimit={null} onExpire={() => {}} />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl space-y-8 text-center">
          <div className="section-label">SECTION TRANSITION</div>
          <AICommentary text={commentary} speed={25} />
          <div className="pt-4">
            <div className="section-label mb-4">
              NEXT: {SECTION_NAMES[currentQ.section]}
            </div>
            <AICommentary
              text={getSectionIntro(currentQ.section)}
              speed={20}
            />
          </div>
          <button onClick={() => setPhase("testing")} className="btn-primary">
            PROCEED
          </button>
        </div>
      </div>
    </div>
  );
}

function SubmittingScreen() {
  const sessionId = useTestStore((s) => s.sessionId);
  const answers = useTestStore((s) => s.answers);
  const questions = useTestStore((s) => s.questions);
  const router = useRouter();
  const [status, setStatus] = useState("Compiling responses...");

  useEffect(() => {
    if (!sessionId) return;

    const submit = async () => {
      setStatus("Transmitting data to the SCCA...");

      const responses = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id]?.answer ?? "",
        timeMs: answers[q.id]?.timeMs ?? 0,
      }));

      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, responses }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setStatus(
            `Transmission error: ${errData.error || "The SCCA encountered an unexpected fault. Please try again."}`
          );
          return;
        }

        const data = await res.json();

        if (!data.resultId) {
          setStatus("The SCCA failed to generate a report. Please try again.");
          return;
        }

        setStatus("Analysis complete. Generating Cognitive Autopsy...");
        await new Promise((r) => setTimeout(r, 1500));

        router.push(`/result/${data.resultId}`);
      } catch {
        setStatus("Transmission error. Please try again.");
      }
    };

    submit();
  }, [sessionId, answers, questions, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <AuthoritySeal size={80} />
        <div className="font-mono text-xl text-accent animate-pulse_accent">
          PROCESSING
        </div>
        <AICommentary text={status} speed={30} />
      </div>
    </div>
  );
}

function TopBar({
  section,
  specimenId,
  questionId,
  timeLimit,
  onExpire,
}: {
  section: Section;
  specimenId: string | null;
  questionId: string | null;
  timeLimit: number | null;
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
        {questionId && timeLimit ? (
          <QuestionTimer
            timeLimit={timeLimit}
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
