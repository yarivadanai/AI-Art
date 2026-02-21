"use client";

import { useState, useCallback, useEffect } from "react";
import type { QuestionPayload } from "@/lib/types";
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

export function QuestionRenderer({
  questionId,
  payload,
  questionType,
  onSubmit,
}: QuestionRendererProps) {
  const [answer, setAnswer] = useState<string>("");

  useEffect(() => {
    setAnswer("");
  }, [questionId]);

  const handleSubmit = () => {
    onSubmit(answer);
  };

  const canSubmit = () => {
    return answer !== "" && answer !== undefined;
  };

  // Seed-based data display
  if (payload.clientSeed != null) {
    return (
      <div className="space-y-6 animate-fadeIn">
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
        <SeedDataDisplay clientSeed={payload.clientSeed} questionType={questionType} />
        <div>
          {payload.inputType === "numeric" && (
            <NumericInput value={answer} onChange={(v) => setAnswer(v)} />
          )}
          {payload.inputType === "text" && (
            <TextInput value={answer} onChange={(v) => setAnswer(v)} monospace={false} />
          )}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            SUBMIT & CONTINUE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Data payload display (Section 4: Micro-Pattern) */}
      {payload.dataPayload && (
        <DataPayloadDisplay data={payload.dataPayload} />
      )}

      {/* Question prompt */}
      <div className="space-y-3">
        <p className="font-sans text-lg text-white leading-relaxed whitespace-pre-wrap">
          {payload.prompt}
        </p>

        {/* Code/math display block */}
        {payload.display && (
          <pre className="p-4 bg-[#0d0d0d] border border-border font-mono text-sm text-white/90 overflow-x-auto leading-relaxed">
            <code>{payload.display}</code>
          </pre>
        )}
      </div>

      {/* Input area */}
      <div>
        {payload.inputType === "multiple-choice" && payload.options && (
          <MultipleChoice
            options={payload.options}
            selected={answer ? parseInt(answer) : undefined}
            onSelect={(idx) => setAnswer(String(idx))}
          />
        )}

        {payload.inputType === "numeric" && (
          <NumericInput
            value={answer}
            onChange={(v) => setAnswer(v)}
          />
        )}

        {payload.inputType === "text" && (
          <TextInput
            value={answer}
            onChange={(v) => setAnswer(v)}
            monospace={false}
          />
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          SUBMIT & CONTINUE
        </button>
      </div>
    </div>
  );
}
