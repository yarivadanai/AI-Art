export type Section =
  | "structural"
  | "state-tracking"
  | "sequential-depth"
  | "signal-detection"
  | "probabilistic";

export const SECTION_ORDER: Section[] = [
  "structural",
  "state-tracking",
  "sequential-depth",
  "signal-detection",
  "probabilistic",
];

export type InputType =
  | "multiple-choice"
  | "numeric"
  | "text"
  | "interactive-canvas";

export type Normalization =
  | "exact"
  | "trimmed-lowercase"
  | "hex-lowercase"
  | "numeric-rounded";

/** Self-reported confidence attached to an answer. "expired" = the clock ran out. */
export type Confidence = "sure" | "unsure" | "guess" | "expired";
export const CONFIDENCE_VALUES: Confidence[] = ["sure", "unsure", "guess", "expired"];

import type { GraderSpec } from "./generators/types";

/**
 * Server-only answer key stored on Question.answerKey. Bank items grade by
 * hash (+ normalization); generated items grade by typed comparison against
 * `reference` using `grader`. `reference` is revealed on the report after grading.
 */
export interface AnswerKey {
  hash: string;
  normalization: Normalization;
  decimalPlaces?: number;
  reference?: string;
  grader?: GraderSpec;
}

export interface InteractiveConfig {
  type: string;
  params: Record<string, unknown>;
  durationMs: number;
}

/** Adaptive-session metadata attached to a served item (safe to send to the client). */
export interface ItemMeta {
  kind: "ladder" | "finale";
  /** Difficulty level 1..8 for ladder items; finales are "machine-scale" and carry no level. */
  level?: number;
  /** Generator family label or bank subtype label for the report. */
  label?: string;
}

export interface QuestionPayload {
  prompt: string;
  inputType: InputType;
  options?: string[];
  display?: string;
  dataPayload?: string;
  clientSeed?: number;
  interactiveConfig?: InteractiveConfig;
  timeLimit?: number;
  meta?: ItemMeta;
}

export interface GeneratedQuestion {
  section: Section;
  index: number;
  type: string;
  payload: QuestionPayload;
  answerKey: AnswerKey;
}

export interface SectionScores {
  structural: number;
  "state-tracking": number;
  "sequential-depth": number;
  "signal-detection": number;
  probabilistic: number;
}

export interface VerdictBand {
  band: "A" | "B" | "C" | "D" | "F";
  label: string;
  commentary: string;
}

/** Intake beliefs: 1 (strongly disagree) .. 5 (strongly agree) per belief id. */
export type Beliefs = Record<string, number>;

export interface SessionResponse {
  sessionId: string;
  specimenId: string;
  expiresAt: string;
  questions: {
    id: string;
    section: Section;
    index: number;
    type: string;
    payload: QuestionPayload;
  }[];
}

export interface AnswerSubmission {
  questionId: string;
  answer: string;
  timeMs: number;
  confidence?: Confidence | null;
  abstained?: boolean;
}

export interface SubmitRequest {
  sessionId: string;
  responses: AnswerSubmission[];
}

/** Per-section summary returned by POST /api/section (and included in metrics). */
export interface SectionSummary {
  section: Section;
  correct: number;
  total: number;
  /** Mean time over answered (non-abstained) items, ms. */
  meanTimeMs: number;
  abstained: number;
  sure: number;
  sureWrong: number;
}

export type FinaleOutcome = "correct" | "wrong" | "abstained" | "unanswered";

/** Calibration and timing summary for a whole session. */
export interface SessionMetrics {
  /** Adaptive sessions: highest level cleared per domain (0 = none), and how the machine-scale finale went. */
  mode?: "fixed" | "adaptive";
  frontiers?: Record<Section, number>;
  finales?: Record<Section, FinaleOutcome>;
  answered: number;
  correct: number;
  abstained: number;
  sure: number;
  sureWrong: number;
  unsure: number;
  guess: number;
  expired: number;
  /** P(wrong | sure); null when no "sure" answers. */
  hallucinationRate: number | null;
  meanTimeMs: number;
  totalTimeMs: number;
  perSection: Record<Section, SectionSummary>;
}

export interface QuestionResult {
  questionId: string;
  section: Section;
  type: string;
  correct: boolean;
  score: number;
  payload: QuestionPayload;
  userAnswer: unknown;
  referenceAnswer: string | null;
  timeMs: number;
  confidence: Confidence | null;
  abstained: boolean;
}

export interface ResultResponse {
  resultId: string;
  specimenId: string;
  sectionScores: SectionScores;
  overall: number;
  verdict: string;
  verdictBand: string;
  commentary: Record<string, string>;
  metrics: SessionMetrics | null;
  beliefs: Beliefs | null;
  questionResults: QuestionResult[];
}

export interface StatsResponse {
  totalSpecimens: number;
  overallDistribution: number[];
  sectionMeans: SectionScores;
  verdictCounts: Record<string, number>;
  weakestSection: string;
  strongestSection: string;
  aiConclusion: string;
  /** Number of results with a perfect overall score. */
  perfectScores: number;
  /** Population calibration, over results that carry metrics. */
  calibration: {
    specimensWithMetrics: number;
    sure: number;
    sureWrong: number;
    hallucinationRate: number | null;
    abstained: number;
    answered: number;
    meanTimeMs: number | null;
  };
  /** Phase 3: the same instrument on three kinds of subject (humans, language models, a script). */
  cohorts: Record<CohortId, CohortSummary>;
  /** One row per language model that has sat the test. */
  llmModels: CohortSummary[];
}

/** Who sat the session: visitors, language models via the API, or the reference solver. */
export type CohortId = "human" | "llm" | "reference";

export interface CohortSummary {
  cohort: CohortId;
  n: number;
  /** Distinct Session.label values in the cohort (model ids / solver name). */
  labels: string[];
  meanOverall: number | null;
  /** Mean highest level cleared per domain over adaptive sessions; null when none. */
  meanFrontiers: Record<Section, number> | null;
  hallucinationRate: number | null;
  abstentionRate: number | null;
  meanTimeMs: number | null;
  sure: number;
  sureWrong: number;
  answered: number;
  abstained: number;
}

// ── Adaptive session API shapes ─────────────────────────────────────────────

export interface ServedQuestion {
  id: string;
  section: Section;
  index: number;
  type: string;
  payload: QuestionPayload;
}

export interface AdaptiveProgress {
  sectionIndex: number;
  sectionsTotal: number;
  /** Items served so far in the current section (ladder rungs + finale). */
  itemIndex: number;
  itemsPerSection: number;
  ladderLength: number;
  currentLevel: number | null;
}

export interface AdaptiveSessionResponse {
  mode: "adaptive";
  sessionId: string;
  specimenId: string;
  expiresAt: string;
  question: ServedQuestion;
  progress: AdaptiveProgress;
}

export interface AnswerRequest {
  sessionId: string;
  questionId: string;
  answer: string;
  timeMs: number;
  confidence?: Confidence | null;
  abstained?: boolean;
}

export interface AnswerResponse {
  /** How the submitted item was graded (echoed for the client's own record; the report reveals answers later). */
  graded: { questionId: string; correct: boolean; score: number; level: number | null; kind: "ladder" | "finale" };
  /** Present when the item completed a section. */
  sectionComplete?: { summary: SectionSummary; frontier: number; finale: FinaleOutcome };
  /** Next item to show (absent when done). */
  question?: ServedQuestion;
  progress?: AdaptiveProgress;
  /** Present when the whole session is finished and graded. */
  done?: { resultId: string };
}

