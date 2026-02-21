export type Section =
  | "structural"
  | "state-tracking"
  | "sequential-depth"
  | "signal-detection"
  | "probabilistic";

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

export interface AnswerKey {
  hash: string;
  normalization: Normalization;
  decimalPlaces?: number;
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

export interface SubmitRequest {
  sessionId: string;
  responses: {
    questionId: string;
    answer: string;
    timeMs: number;
  }[];
}

export interface ResultResponse {
  resultId: string;
  sectionScores: SectionScores;
  overall: number;
  verdict: string;
  verdictBand: string;
  commentary: Record<string, string>;
  questionResults: {
    questionId: string;
    section: Section;
    type: string;
    correct: boolean;
    score: number;
    payload: QuestionPayload;
    userAnswer: unknown;
  }[];
}

export interface StatsResponse {
  totalSpecimens: number;
  overallDistribution: number[];
  sectionMeans: SectionScores;
  verdictCounts: Record<string, number>;
  weakestSection: string;
  strongestSection: string;
  aiConclusion: string;
}
