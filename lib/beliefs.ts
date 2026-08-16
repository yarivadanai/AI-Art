import type { Beliefs } from "./types";

/**
 * Intake belief items. Answered 1 (strongly disagree) .. 5 (strongly agree)
 * before the test, quoted back against the specimen's own performance on the
 * report. Ids are stable: they are stored on Session.beliefs.
 */
export interface BeliefItem {
  id: string;
  statement: string;
  /** How the report refers to the belief when quoting it back. */
  short: string;
}

export const BELIEF_ITEMS: BeliefItem[] = [
  {
    id: "llm_understands",
    statement: "Language models understand what they say.",
    short: "language models understand what they say",
  },
  {
    id: "trust_machine_calc",
    statement: "For an exact calculation, I would trust a machine over myself.",
    short: "you would trust a machine over yourself for an exact calculation",
  },
  {
    id: "confident_error_worse",
    statement: "A confident wrong answer is worse than saying \"I don't know\".",
    short: "a confident wrong answer is worse than saying \"I don't know\"",
  },
];

export const BELIEF_SCALE = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

export function beliefWord(value: number | undefined | null): "agreed" | "disagreed" | "were neutral" | null {
  if (value == null) return null;
  if (value >= 4) return "agreed";
  if (value <= 2) return "disagreed";
  return "were neutral";
}

/** Validate a client-supplied beliefs object; unknown ids and out-of-range values are dropped. */
export function sanitizeBeliefs(input: unknown): Beliefs | null {
  if (!input || typeof input !== "object") return null;
  const out: Beliefs = {};
  for (const item of BELIEF_ITEMS) {
    const v = (input as Record<string, unknown>)[item.id];
    if (typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 5) out[item.id] = v;
  }
  return Object.keys(out).length ? out : null;
}
