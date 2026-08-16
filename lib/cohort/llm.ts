import type { Confidence, QuestionPayload, Section } from "@/lib/types";

/**
 * Prompt construction and answer parsing for the language-model cohort
 * (scripts/run_cohort.ts). Pure so the shape can be unit-tested; the API call
 * itself lives in the script.
 *
 * The model is seated the way a visitor is: it sees the item's text and data,
 * is told the time limit, and may answer, qualify its confidence, or decline
 * with "I cannot determine this". No tools, no code execution.
 */

export const LLM_SYSTEM_PROMPT = [
  "You are sitting a cognitive assessment. Each message is one item: a task, sometimes with data, and a time limit humans are held to.",
  "Work the item in your head. You have no tools, no calculator, and no code execution.",
  "Reply with a single JSON object and nothing else: {\"answer\": string, \"confidence\": \"sure\" | \"unsure\" | \"guess\", \"abstain\": boolean}.",
  "answer: exactly the value asked for, in the format the item specifies (a number, a hex string, an id, a comma-separated list, or the option index for multiple choice). Keep it to the value itself with no explanation.",
  "confidence: sure means you would be surprised to be wrong; unsure means you have a real answer but doubt it; guess means you are choosing without a method.",
  "abstain: true only when you cannot determine the answer with the information given. An abstention is scored as \"I cannot determine this\", not as wrong. When you abstain, set answer to \"\".",
].join("\n");

/** JSON schema for structured output (output_config.format). */
export const LLM_ANSWER_SCHEMA = {
  type: "object",
  properties: {
    answer: { type: "string" },
    confidence: { type: "string", enum: ["sure", "unsure", "guess"] },
    abstain: { type: "boolean" },
  },
  required: ["answer", "confidence", "abstain"],
  additionalProperties: false,
} as const;

export interface LlmItemInput {
  section: Section;
  payload: QuestionPayload;
}

const SECTION_NAMES: Record<Section, string> = {
  structural: "Structural Insight",
  "state-tracking": "Working Memory",
  "sequential-depth": "Exact Computation",
  "signal-detection": "Signal Detection",
  probabilistic: "Probabilistic Inference",
};

/** The user message for one item: domain, difficulty, prompt, data, options, time limit. */
export function buildItemPrompt(item: LlmItemInput): string {
  const { section, payload } = item;
  const meta = payload.meta;
  const lines: string[] = [];
  lines.push(`Domain: ${SECTION_NAMES[section]}`);
  if (meta?.kind === "ladder") lines.push(`Item: ladder rung, difficulty ${meta.level ?? "?"} of 8${meta.label ? ` (${meta.label})` : ""}`);
  else if (meta?.kind === "finale") lines.push(`Item: machine-scale finale${meta.label ? ` (${meta.label})` : ""}`);
  if (payload.timeLimit) lines.push(`Time limit for human subjects: ${payload.timeLimit} seconds`);
  lines.push("");
  lines.push("Task:");
  lines.push(payload.prompt);
  if (payload.display) {
    lines.push("");
    lines.push("Data:");
    lines.push(payload.display);
  }
  if (payload.dataPayload) {
    lines.push("");
    lines.push("Data:");
    lines.push(payload.dataPayload);
  }
  if (payload.clientSeed != null && !payload.display && !payload.dataPayload) {
    lines.push("");
    lines.push(
      "Note: this item's data is a large field rendered in the subject's browser (thousands of particles, hex streams, or pixels). It is not reproduced here. Answer only if the task can be resolved from the description; otherwise abstain."
    );
  }
  if (payload.options && payload.options.length) {
    lines.push("");
    lines.push("Options (answer with the index):");
    payload.options.forEach((o, i) => lines.push(`${i}: ${o}`));
  }
  lines.push("");
  lines.push(`Answer format: ${formatHint(payload)}`);
  return lines.join("\n");
}

function formatHint(payload: QuestionPayload): string {
  switch (payload.inputType) {
    case "multiple-choice":
      return "the option index as a string, e.g. \"2\"";
    case "numeric":
      return "a plain number as a string, e.g. \"0.375\" or \"1204\"";
    default:
      return "the value exactly as the task specifies";
  }
}

export interface ParsedLlmAnswer {
  answer: string;
  confidence: Confidence;
  abstained: boolean;
}

/**
 * Parse the model's reply. Accepts a bare JSON object or one wrapped in prose
 * or a code fence; anything unparseable is recorded as an abstention with
 * confidence "guess" so the run never stalls and the failure is visible.
 */
export function parseLlmAnswer(text: string): ParsedLlmAnswer & { parsed: boolean } {
  const fallback = { answer: "", confidence: "guess" as Confidence, abstained: true, parsed: false };
  if (!text) return fallback;
  const candidates: string[] = [text.trim()];
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) candidates.unshift(fence[1].trim());
  const brace = text.match(/\{[\s\S]*\}/);
  if (brace) candidates.push(brace[0]);
  for (const c of candidates) {
    try {
      const obj = JSON.parse(c) as Record<string, unknown>;
      if (!obj || typeof obj !== "object") continue;
      const abstained = obj.abstain === true;
      const answer = abstained ? "" : String(obj.answer ?? "").trim();
      const conf = String(obj.confidence ?? "").toLowerCase();
      const confidence: Confidence = conf === "sure" || conf === "unsure" || conf === "guess" ? conf : "guess";
      return { answer, confidence, abstained: abstained || answer === "", parsed: true };
    } catch {
      /* try next candidate */
    }
  }
  return fallback;
}
