"use client";

import { useEffect, type FormEvent } from "react";
import type { QuestionPayload } from "@/lib/types";
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
  onSubmit: (answer: string) => void;
}

/**
 * Renders one question. The in-progress answer lives in the store as `draft`
 * (not local state) so that a timer expiry or a page reload can still submit
 * what the visitor had typed. Wrapped in a <form> so Enter submits.
 */
export function QuestionRenderer({
  questionId,
  payload,
  questionType,
  onSubmit,
}: QuestionRendererProps) {
  // The store clears `draft` on every question transition (startSession,
  // nextQuestion, beginQuestion), so nothing to reset here; a reload keeps it.
  const answer = useTestStore((s) => s.draft);
  const setDraft = useTestStore((s) => s.setDraft);

  const canSubmit = answer !== "";

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    onSubmit(answer);
  };

  // Multiple choice has no text field to catch Enter, so listen globally.
  const isMC = payload.inputType === "multiple-choice";
  useEffect(() => {
    if (!isMC) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && canSubmit) {
        e.preventDefault();
        onSubmit(answer);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMC, canSubmit, answer, onSubmit, questionId]);

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

  const submitRow = (
    <div className="flex items-center justify-between gap-4 pt-4">
      <span className="font-mono text-[10px] text-muted tracking-wider hidden sm:inline">
        {payload.inputType === "multiple-choice" ? "PRESS A-H TO SELECT, ENTER TO SUBMIT" : "ENTER TO SUBMIT"}
      </span>
      <button
        type="submit"
        disabled={!canSubmit}
        className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed ml-auto"
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

  // Seed-based data display
  if (payload.clientSeed != null) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
        {prompt}
        <SeedDataDisplay clientSeed={payload.clientSeed} questionType={questionType} />
        <div>{input}</div>
        {submitRow}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      {payload.dataPayload && <DataPayloadDisplay data={payload.dataPayload} />}
      {prompt}
      <div>{input}</div>
      {submitRow}
    </form>
  );
}
