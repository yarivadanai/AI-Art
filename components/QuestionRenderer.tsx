"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Confidence, QuestionPayload } from "@/lib/types";
import { useTestStore } from "@/lib/store";
import { MultipleChoice } from "./MultipleChoice";
import { NumericInput } from "./NumericInput";
import { TextInput } from "./TextInput";
import { DataPayloadDisplay } from "./DataPayloadDisplay";
import { SeedDataDisplay } from "./SeedDataDisplay";

interface QuestionRendererProps {
  questionId: string;
  payload: QuestionPayload;
  questionType: string;
  onSubmit: (answer: string, confidence: Confidence) => void;
  onAbstain: () => void;
}

const CONFIDENCE_CHIPS: { value: Confidence; label: string; hint: string }[] = [
  { value: "sure", label: "SURE", hint: "I would stake something on this" },
  { value: "unsure", label: "UNSURE", hint: "Plausible, not certain" },
  { value: "guess", label: "GUESS", hint: "Little or no basis" },
];

/**
 * Renders one question. The in-progress answer and confidence live in the
 * store (`draft`, `draftConfidence`), not local state, so a timer expiry or a
 * page reload can still submit what the visitor had typed. Wrapped in a
 * <form> so Enter submits. Submitting requires a confidence chip; the
 * "I cannot determine this" button records an abstention instead.
 */
export function QuestionRenderer({
  questionId,
  payload,
  questionType,
  onSubmit,
  onAbstain,
}: QuestionRendererProps) {
  const answer = useTestStore((s) => s.draft);
  const setDraft = useTestStore((s) => s.setDraft);
  const confidence = useTestStore((s) => s.draftConfidence);
  const setConfidence = useTestStore((s) => s.setDraftConfidence);
  const [nudge, setNudge] = useState(false);
  // Set once an answer/abstention has been sent; the component remounts on the
  // next question (key=questionId), so this also swallows double-taps that would
  // otherwise land on the next question's buttons.
  const [locked, setLocked] = useState(false);

  const hasAnswer = answer !== "";
  const canSubmit = hasAnswer && confidence !== null;

  const trySubmit = () => {
    if (locked || !hasAnswer) return;
    if (confidence === null) {
      // One more click: state your confidence. The chips pulse to say so.
      setNudge(true);
      setTimeout(() => setNudge(false), 900);
      return;
    }
    setLocked(true);
    onSubmit(answer, confidence);
  };

  const tryAbstain = () => {
    if (locked) return;
    setLocked(true);
    onAbstain();
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    trySubmit();
  };

  // Multiple choice has no text field to catch Enter, so listen globally.
  const isMC = payload.inputType === "multiple-choice";
  useEffect(() => {
    if (!isMC) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      // Let a focused chip / abstain button (data-enter="self") or text field
      // handle Enter itself; a focused MC option still submits.
      const t = e.target as HTMLElement | null;
      if (t && (t.closest('[data-enter="self"]') || t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "A")) return;
      e.preventDefault();
      trySubmit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMC, answer, confidence, questionId, locked]);

  const input = (
    <>
      {payload.inputType === "multiple-choice" && payload.options && (
        <MultipleChoice
          options={payload.options}
          selected={answer ? parseInt(answer) : undefined}
          onSelect={(idx) => setDraft(String(idx))}
        />
      )}
      {payload.inputType === "numeric" && (
        <NumericInput value={answer} onChange={setDraft} />
      )}
      {payload.inputType === "text" && (
        <TextInput value={answer} onChange={setDraft} monospace={false} />
      )}
    </>
  );

  const confidenceRow = (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Confidence in your answer">
        <span className={`font-mono text-[10px] tracking-[0.25em] mr-1 ${nudge ? "text-accent" : "text-muted"}`}>
          CONFIDENCE
        </span>
        {CONFIDENCE_CHIPS.map((chip) => {
          const active = confidence === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              role="radio"
              aria-checked={active}
              title={chip.hint}
              onClick={() => setConfidence(chip.value)}
              onKeyDown={(e) => {
                // Enter on the already-selected chip submits (mouse users who
                // clicked a chip and then hit Enter); on another chip it selects.
                if (e.key === "Enter" && active) {
                  e.preventDefault();
                  trySubmit();
                }
              }}
              data-enter="self"
              className={`px-3 py-1.5 font-mono text-xs tracking-widest border transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
                ${active ? "border-accent bg-accent/15 text-white" : "border-border text-white/70 hover:border-accent/50 hover:text-white"}
                ${nudge && !active ? "animate-pulse_accent border-accent/60" : ""}`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
      {nudge && (
        <div className="font-mono text-[11px] text-accent" role="status">
          State your confidence before submitting. MICA grades the answer and the confidence.
        </div>
      )}
    </div>
  );

  const submitRow = (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-border/60">
      <button
        type="button"
        onClick={tryAbstain}
        disabled={locked}
        data-enter="self"
        className="font-mono text-xs tracking-wider text-muted hover:text-white underline underline-offset-4 decoration-border hover:decoration-white text-left disabled:opacity-40"
        title="Recorded as an abstention, not as a wrong answer"
      >
        I CANNOT DETERMINE THIS
      </button>
      <div className="flex-1" />
      <span className="font-mono text-[10px] text-muted tracking-wider hidden sm:inline">
        {isMC ? "A-H SELECT, ENTER SUBMIT" : "ENTER SUBMIT"}
      </span>
      <button
        type="submit"
        disabled={!hasAnswer}
        title={hasAnswer && !canSubmit ? "State your confidence first" : undefined}
        className={`btn-primary disabled:opacity-30 disabled:cursor-not-allowed ${hasAnswer && !canSubmit ? "opacity-60" : ""}`}
      >
        SUBMIT &amp; CONTINUE
      </button>
    </div>
  );

  const prompt = (
    <div className="space-y-3">
      <p className="font-sans text-lg text-white leading-relaxed whitespace-pre-wrap">
        {payload.prompt}
      </p>
      {payload.display && (
        <pre className="p-4 bg-[#0d0d0d] border border-border font-mono text-sm text-white/90 overflow-x-auto leading-relaxed">
          <code>{payload.display}</code>
        </pre>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      {payload.clientSeed == null && payload.dataPayload && <DataPayloadDisplay data={payload.dataPayload} />}
      {prompt}
      {payload.clientSeed != null && (
        <SeedDataDisplay clientSeed={payload.clientSeed} questionType={questionType} />
      )}
      <div>{input}</div>
      {confidenceRow}
      {submitRow}
    </form>
  );
}
