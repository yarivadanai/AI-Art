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

export interface AnswerKey {
  hash: string;
  normalization: Normalization;
  decimalPlaces?: number;
  /** Plaintext reference answer. Server-only: stored in the DB, revealed on the report after grading. */
  reference?: string;
}

export interface InteractiveConfig {
  type: string;
  params: Record<string, unknown>;
  durationMs: number;
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

/** Calibration and timing summary for a whole session. */
export interface SessionMetrics {
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
}
