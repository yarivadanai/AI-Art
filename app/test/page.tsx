"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthoritySeal } from "@/components/AuthoritySeal";
import { GlobalTimer } from "@/components/GlobalTimer";
import { QuestionRenderer } from "@/components/QuestionRenderer";
import { AICommentary } from "@/components/AICommentary";
import { useTestStore } from "@/lib/store";
import { getSectionIntro, getSectionCommentary } from "@/lib/commentary";
import type { Section } from "@/lib/types";

const SECTION_NAMES: Record<Section, string> = {
  language: "LANGUAGE",
  math: "MATHEMATICS",
  coding: "CODE COMPREHENSION",
  perception: "VISUAL PERCEPTION",
  memory: "MEMORY & PROCESSING",
  knowledge: "GENERAL KNOWLEDGE",
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
  const [includesCoding, setIncludesCoding] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const startSession = useTestStore((s) => s.startSession);

  const handleBegin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ includesCoding }),
      });
      const data = await res.json();
      startSession({
        sessionId: data.sessionId,
        specimenId: data.specimenId,
        expiresAt: data.expiresAt,
        questions: data.questions,
        includesCoding,
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
          <h1 className="font-mono text-2xl font-bold">SPECIMEN INTAKE</h1>
          <p className="font-sans text-sm text-muted">
            The following evaluation will test your cognitive capabilities
            across multiple domains. Please configure your session.
          </p>
        </div>

        <div className="space-y-6">
          {/* Coding toggle */}
          <div className="card space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includesCoding}
                onChange={(e) => setIncludesCoding(e.target.checked)}
                className="w-4 h-4 accent-accent bg-surface border-border"
              />
              <div>
                <span className="font-sans text-sm text-white">
                  I have programming experience
                </span>
                <p className="font-sans text-xs text-muted mt-1">
                  Enables the Code Comprehension section (4 additional
                  questions)
                </p>
              </div>
            </label>
          </div>

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
            <p>• Duration: ≤18 minutes (enforced by global timer)</p>
            <p>• Questions cannot be revisited once submitted</p>
            <p>• A unique specimen ID will be assigned</p>
            <p>
              •{" "}
              {includesCoding
                ? "~27 questions across 6 sections"
                : "~22 questions across 5 sections"}
            </p>
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

  // Show section intro only for the very first section
  // (subsequent sections show intro via BetweenSections)
  useEffect(() => {
    if (currentIndex === 0) {
      setShowIntro(true);
    }
  }, [currentIndex]);

  const handleSubmit = useCallback(
    (answer: string | number | string[]) => {
      if (!currentQ) return;
      setAnswer(currentQ.id, answer);
      nextQuestion();
    },
    [currentQ, setAnswer, nextQuestion]
  );

  if (!currentQ) return null;

  // Section intro — only for the very first section
  if (showIntro && currentIndex === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar section={currentQ.section} specimenId={specimenId} />
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

  // Count questions in current section
  const sectionQuestions = questions.filter(
    (q) => q.section === currentQ.section
  );
  const sectionIdx =
    sectionQuestions.findIndex((q) => q.id === currentQ.id) + 1;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar section={currentQ.section} specimenId={specimenId} />

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="max-w-2xl w-full space-y-6">
          {/* Question counter */}
          <div className="flex items-center justify-between">
            <span className="section-label">
              {SECTION_NAMES[currentQ.section]} — Q{sectionIdx}/
              {sectionQuestions.length}
            </span>
            <span className="font-mono text-xs text-muted">
              {currentIndex + 1}/{questions.length} TOTAL
            </span>
          </div>

          {/* Question */}
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

  // Figure out the previous section
  const currentQ = questions[currentIndex];
  const prevSection = questions[currentIndex - 1]?.section;

  if (!prevSection || !currentQ) return null;

  // Count correct in previous section (we don't know correct answers client-side,
  // so we show a generic transition)
  const prevSectionQs = questions.filter((q) => q.section === prevSection);
  const answeredCount = prevSectionQs.filter((q) => answers[q.id]).length;

  const commentary = `Section complete. ${answeredCount} of ${prevSectionQs.length} questions received responses. Proceeding to next evaluation domain.`;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar section={currentQ.section} specimenId={specimenId} />
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
      setStatus("Transmitting data to the Authority...");

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
            `Transmission error: ${errData.error || "The Authority encountered an unexpected fault. Please try again."}`
          );
          return;
        }

        const data = await res.json();

        if (!data.resultId) {
          setStatus("The Authority failed to generate a report. Please try again.");
          return;
        }

        setStatus("Analysis complete. Generating report...");
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
}: {
  section: Section;
  specimenId: string | null;
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
        <GlobalTimer />
        <div className="font-mono text-xs text-muted">
          {specimenId ? `#${specimenId.slice(0, 8).toUpperCase()}` : ""}
        </div>
      </div>
    </div>
  );
}
