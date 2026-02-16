"use client";

import { useState, useCallback, useEffect } from "react";
import type { QuestionPayload } from "@/lib/types";
import { MultipleChoice } from "./MultipleChoice";
import { NumericInput } from "./NumericInput";
import { TextInput } from "./TextInput";
import { SequenceInput } from "./SequenceInput";
import { PerceptionScene } from "./PerceptionScene";
import {
  DigitFlash,
  FactFlash,
  ColorFlash,
  ExpressionFlash,
} from "./MemoryFlash";
import { useTestStore } from "@/lib/store";

interface QuestionRendererProps {
  questionId: string;
  payload: QuestionPayload;
  questionType: string;
  onSubmit: (answer: string | number | string[]) => void;
}

export function QuestionRenderer({
  questionId,
  payload,
  questionType,
  onSubmit,
}: QuestionRendererProps) {
  const [answer, setAnswer] = useState<string | number | string[]>("");
  const [multiPartAnswers, setMultiPartAnswers] = useState<
    Record<number, string | number>
  >({});
  const [flashDone, setFlashDone] = useState(false);
  const [scenePhase, setScenePhase] = useState<"viewing" | "answering">(
    payload.scene ? "viewing" : "answering"
  );
  const sceneVisible = useTestStore((s) => s.sceneVisible);
  const setSceneVisible = useTestStore((s) => s.setSceneVisible);
  const sceneCountdown = useTestStore((s) => s.sceneCountdown);
  const setSceneCountdown = useTestStore((s) => s.setSceneCountdown);

  // Reset state when question changes
  useEffect(() => {
    setAnswer("");
    setMultiPartAnswers({});
    setFlashDone(false);

    if (payload.scene) {
      setScenePhase("viewing");
      setSceneVisible(true);
      setSceneCountdown(12);
    } else {
      setScenePhase("answering");
    }

    if (payload.flashContent) {
      setFlashDone(false);
    }
  }, [questionId, payload, setSceneVisible, setSceneCountdown]);

  // Scene countdown timer
  useEffect(() => {
    if (scenePhase !== "viewing" || !payload.scene) return;

    const interval = setInterval(() => {
      setSceneCountdown(sceneCountdown - 1);
      if (sceneCountdown <= 1) {
        setSceneVisible(false);
        setScenePhase("answering");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    scenePhase,
    sceneCountdown,
    payload.scene,
    setSceneCountdown,
    setSceneVisible,
  ]);

  const handleFlashComplete = useCallback(() => {
    setFlashDone(true);
  }, []);

  const handleSubmit = () => {
    if (payload.inputType === "multi-part") {
      const answers = Object.values(multiPartAnswers).map(String);
      onSubmit(answers);
    } else {
      onSubmit(answer);
    }
  };

  const canSubmit = () => {
    if (payload.inputType === "multi-part") {
      return (
        payload.subQuestions &&
        Object.keys(multiPartAnswers).length === payload.subQuestions.length
      );
    }
    if (payload.inputType === "sequence") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer !== "" && answer !== undefined;
  };

  // Perception scene display
  if (scenePhase === "viewing" && payload.scene) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <p className="font-mono text-sm text-muted">
          Study this scene carefully. You will be asked questions about it.
        </p>
        <PerceptionScene scene={payload.scene} countdown={sceneCountdown} />
      </div>
    );
  }

  // Flash content display (memory questions)
  if (payload.flashContent && !flashDone) {
    const fc = payload.flashContent;
    if (fc.type === "digits") {
      return (
        <DigitFlash
          digits={fc.items[0]}
          durationMs={fc.displayTimeMs}
          onComplete={handleFlashComplete}
        />
      );
    }
    if (fc.type === "facts") {
      return (
        <FactFlash
          facts={fc.items}
          displayTimeMs={fc.displayTimeMs}
          onComplete={handleFlashComplete}
        />
      );
    }
    if (fc.type === "colors") {
      return (
        <ColorFlash
          colors={fc.items}
          displayTimeMs={fc.displayTimeMs}
          onComplete={handleFlashComplete}
        />
      );
    }
    if (fc.type === "expression") {
      return (
        <ExpressionFlash
          expression={fc.items[0]}
          durationMs={fc.displayTimeMs}
          onComplete={handleFlashComplete}
        />
      );
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Question prompt */}
      <div className="space-y-3">
        <p className="font-sans text-lg text-white leading-relaxed whitespace-pre-wrap">
          {payload.prompt}
        </p>

        {/* Code/proof display block */}
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
            selected={answer as number | undefined}
            onSelect={(idx) => setAnswer(idx)}
          />
        )}

        {payload.inputType === "numeric" && (
          <NumericInput
            value={String(answer)}
            onChange={(v) => setAnswer(v)}
          />
        )}

        {payload.inputType === "text" && (
          <TextInput
            value={String(answer)}
            onChange={(v) => setAnswer(v)}
            monospace={questionType === "digit-span"}
          />
        )}

        {payload.inputType === "sequence" && (
          <SequenceInput
            length={10}
            value={Array.isArray(answer) ? answer : []}
            onChange={(v) => setAnswer(v)}
          />
        )}

        {payload.inputType === "multi-part" && payload.subQuestions && (
          <div className="space-y-6">
            {payload.subQuestions.map((sub, i) => (
              <div key={i} className="space-y-2">
                <p className="font-sans text-sm text-white/80">{sub.prompt}</p>
                {sub.inputType === "multiple-choice" && sub.options ? (
                  <MultipleChoice
                    options={sub.options}
                    selected={multiPartAnswers[i] as number | undefined}
                    onSelect={(idx) =>
                      setMultiPartAnswers((prev) => ({ ...prev, [i]: idx }))
                    }
                  />
                ) : sub.inputType === "numeric" ? (
                  <NumericInput
                    value={String(multiPartAnswers[i] ?? "")}
                    onChange={(v) =>
                      setMultiPartAnswers((prev) => ({ ...prev, [i]: v }))
                    }
                  />
                ) : (
                  <TextInput
                    value={String(multiPartAnswers[i] ?? "")}
                    onChange={(v) =>
                      setMultiPartAnswers((prev) => ({ ...prev, [i]: v }))
                    }
                  />
                )}
              </div>
            ))}
          </div>
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
