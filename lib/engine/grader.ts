import { createHash } from "crypto";
import type { AnswerKey, Normalization } from "@/lib/types";
import type { GraderSpec } from "@/lib/generators/types";
import { canonicalize, parseNumber } from "./canonicalize";

/** @deprecated use canonicalize(); kept for callers that import the old name. */
export function normalizeAnswer(raw: string, normalization: Normalization, decimalPlaces?: number): string {
  return canonicalize(raw, normalization, decimalPlaces);
}

export function sha256(str: string): string {
  return createHash("sha256").update(str, "utf8").digest("hex");
}

export interface Grade {
  correct: boolean;
  /** 0..1; equals 1 iff correct, except `sequence` graders which award partial credit. */
  score: number;
}

const splitList = (s: string, sep: string) =>
  s
    .split(sep)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

/**
 * Typed comparison against a plaintext reference. Forgiving about presentation
 * (case, whitespace, 0x, thousands separators, decimal comma), strict about
 * content. Used for generated items; bank items still grade by hash.
 */
export function gradeTyped(userAnswer: string, reference: string, spec: GraderSpec): Grade {
  const u = String(userAnswer ?? "");
  switch (spec.kind) {
    case "exact":
    case "mc": {
      const a = canonicalize(u, "trimmed-lowercase");
      const b = canonicalize(reference, "trimmed-lowercase");
      const correct = a !== "" && a === b;
      return { correct, score: correct ? 1 : 0 };
    }
    case "hex": {
      const a = canonicalize(u, "hex-lowercase").replace(/^0+(?=[0-9a-f])/, "");
      const b = canonicalize(reference, "hex-lowercase").replace(/^0+(?=[0-9a-f])/, "");
      const correct = a !== "" && a === b;
      return { correct, score: correct ? 1 : 0 };
    }
    case "numeric": {
      const n = parseNumber(u);
      // Compare against the exact value when the generator supplied one, so a
      // reference that rounds to "0.037" (3/80 = 0.0375) still accepts the
      // visitor's correctly rounded "0.038"; otherwise against the shown string.
      const r = typeof spec.exact === "number" && Number.isFinite(spec.exact) ? spec.exact : parseNumber(reference);
      if (n === null || r === null) return { correct: false, score: 0 };
      const tol = spec.tolerance ?? 0.5 * Math.pow(10, -spec.decimalPlaces);
      const correct = Math.abs(n - r) <= tol + 1e-9;
      return { correct, score: correct ? 1 : 0 };
    }
    case "set": {
      const sep = spec.separator ?? ",";
      const a = new Set(splitList(canonicalize(u, "trimmed-lowercase"), sep));
      const b = new Set(splitList(canonicalize(reference, "trimmed-lowercase"), sep));
      const correct = a.size === b.size && Array.from(b).every((t) => a.has(t));
      return { correct, score: correct ? 1 : 0 };
    }
    case "sequence": {
      const sep = spec.separator ?? "";
      const a = sep ? splitList(canonicalize(u, "trimmed-lowercase"), sep) : canonicalize(u, "trimmed-lowercase").replace(/\s+/g, "").split("");
      const b = sep ? splitList(canonicalize(reference, "trimmed-lowercase"), sep) : canonicalize(reference, "trimmed-lowercase").replace(/\s+/g, "").split("");
      if (b.length === 0) return { correct: false, score: 0 };
      let matches = 0;
      for (let i = 0; i < b.length; i++) if (a[i] === b[i]) matches++;
      const score = a.length === b.length ? matches / b.length : Math.min(matches, b.length) / Math.max(a.length, b.length);
      const correct = a.length === b.length && matches === b.length;
      return { correct, score: correct ? 1 : score };
    }
  }
}

/**
 * Grade a submission against a stored answer key. Generated items carry a
 * typed grader + reference; bank items carry a hash + normalization.
 */
export function gradeAnswer(userAnswer: string, answerKey: AnswerKey): Grade {
  if (answerKey.grader && typeof answerKey.reference === "string") {
    return gradeTyped(String(userAnswer), answerKey.reference, answerKey.grader);
  }
  const normalized = canonicalize(String(userAnswer), answerKey.normalization, answerKey.decimalPlaces);
  const correct = sha256(normalized) === answerKey.hash;
  return { correct, score: correct ? 1 : 0 };
}
