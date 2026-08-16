import { createHash } from "crypto";
import type { AnswerKey, Normalization } from "@/lib/types";
import { canonicalize } from "./canonicalize";

/** @deprecated use canonicalize(); kept for callers that import the old name. */
export function normalizeAnswer(raw: string, normalization: Normalization, decimalPlaces?: number): string {
  return canonicalize(raw, normalization, decimalPlaces);
}

export function sha256(str: string): string {
  return createHash("sha256").update(str, "utf8").digest("hex");
}

export function gradeAnswer(
  userAnswer: string,
  answerKey: AnswerKey
): { correct: boolean; score: number } {
  const normalized = canonicalize(
    String(userAnswer),
    answerKey.normalization,
    answerKey.decimalPlaces
  );
  const userHash = sha256(normalized);
  const correct = userHash === answerKey.hash;
  return { correct, score: correct ? 1 : 0 };
}
