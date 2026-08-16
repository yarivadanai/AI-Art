import { createHash } from "crypto";
import type { Normalization } from "@/lib/types";
import { canonicalize } from "@/lib/engine/canonicalize";

/** SHA-256 of the canonical form of an answer. Must stay in lockstep with gradeAnswer(). */
export function hashAnswer(answer: string, normalization: Normalization, decimalPlaces?: number | null): string {
  return createHash("sha256").update(canonicalize(answer, normalization, decimalPlaces), "utf8").digest("hex");
}
