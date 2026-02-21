import { createHash } from "crypto";
import type { AnswerKey, Normalization } from "@/lib/types";

export function normalizeAnswer(raw: string, normalization: Normalization, decimalPlaces?: number): string {
  const trimmed = raw.trim();
  switch (normalization) {
    case "exact":
      return trimmed;
    case "trimmed-lowercase":
      return trimmed.toLowerCase();
    case "hex-lowercase":
      return trimmed.toLowerCase().replace(/^0x/, "");
    case "numeric-rounded": {
      const n = parseFloat(trimmed);
      if (isNaN(n)) return trimmed;
      const dp = decimalPlaces ?? 0;
      return n.toFixed(dp);
    }
    default:
      return trimmed;
  }
}

export function sha256(str: string): string {
  return createHash("sha256").update(str, "utf8").digest("hex");
}

export function gradeAnswer(
  userAnswer: string,
  answerKey: AnswerKey
): { correct: boolean; score: number } {
  const normalized = normalizeAnswer(
    String(userAnswer),
    answerKey.normalization,
    answerKey.decimalPlaces
  );
  const userHash = sha256(normalized);
  const correct = userHash === answerKey.hash;
  return { correct, score: correct ? 1 : 0 };
}
