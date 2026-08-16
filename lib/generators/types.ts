import type { SeededRNG } from "@/lib/engine/rng";
import type { InputType, Section } from "@/lib/types";

/** Difficulty dial. Every family must produce a valid, uniquely-answerable item for each level. */
export const MIN_D = 1;
export const MAX_D = 8;
export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Typed grader specs. The reference answer stays on the server; grading is a
 * typed comparison, forgiving about presentation and strict about content.
 * `sequence` awards partial credit (fraction of positions matched); the
 * staircase still requires an exact match to count as cleared.
 */
export type GraderSpec =
  | { kind: "exact" } // case-insensitive, whitespace-collapsed
  | {
      kind: "numeric";
      decimalPlaces: number;
      /** Exact (unrounded) value; when present the submission is compared to this within half a unit of the last shown place. */
      exact?: number;
      tolerance?: number;
    }
  | { kind: "hex" }
  | { kind: "set"; separator?: string } // order-insensitive list of tokens
  | { kind: "sequence"; separator?: string } // order-sensitive list, partial credit
  | { kind: "mc" };

export interface GeneratedItem {
  prompt: string;
  display?: string;
  inputType: InputType;
  options?: string[];
  reference: string;
  grader: GraderSpec;
  timeLimit: number;
}

export interface GeneratorFamily {
  /** Stable id stored on Question.type. */
  family: string;
  section: Section;
  /** Short human label used on the report. */
  label: string;
  /** How a plain program solves it (report "METHOD" line). */
  method: string;
  generate(rng: SeededRNG, d: Difficulty): GeneratedItem;
}

export function clampD(d: number): Difficulty {
  return Math.max(MIN_D, Math.min(MAX_D, Math.round(d))) as Difficulty;
}
