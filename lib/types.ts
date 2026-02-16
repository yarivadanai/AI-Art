export type Section =
  | "cognitive-stack"
  | "isomorphism"
  | "expert-trap"
  | "math"
  | "coding"
  | "perception"
  | "memory";

export type QuestionType =
  // Cognitive Stack
  | "center-embedding"
  | "scope-ambiguity"
  | "temporal-recursion"
  // Isomorphism
  | "cross-domain-mapping"
  // Expert Trap
  | "causal-violation"
  // Math
  | "decimal-arithmetic"
  | "order-of-operations"
  | "trig-log"
  | "definite-integral"
  | "proof-error"
  // Coding
  | "bug-finding"
  | "recursive-trace"
  | "assembly-reading"
  | "long-function"
  // Perception
  | "shape-counting"
  | "color-memory"
  | "relative-size"
  | "quadrant-counting"
  // Memory
  | "digit-span"
  | "fact-retention"
  | "sequence-recall"
  | "speed-arithmetic";

export type InputType =
  | "multiple-choice"
  | "numeric"
  | "text"
  | "sequence"
  | "multi-part";

export interface QuestionPayload {
  prompt: string;
  inputType: InputType;
  options?: string[];
  /** For perception: SVG scene data */
  scene?: SceneData;
  /** For memory flash content */
  flashContent?: FlashContent;
  /** Flash duration in ms */
  flashDurationMs?: number;
  /** Sub-questions for multi-part */
  subQuestions?: { prompt: string; inputType: InputType; options?: string[] }[];
  /** Extra display info (e.g. code block, proof steps) */
  display?: string;
  displayLanguage?: string;
}

export interface AnswerKey {
  correct: string | number | string[];
  /** For partial credit grading */
  partialCredit?: boolean;
  tolerance?: number;
  /** Additional exact-match strings */
  alternatives?: string[];
  /** Substring matches — any one sufficient */
  keywords?: string[];
}

export interface GeneratedQuestion {
  section: Section;
  index: number;
  type: QuestionType;
  payload: QuestionPayload;
  answerKey: AnswerKey;
}

export interface SceneShape {
  type: "circle" | "square" | "triangle" | "star" | "hexagon";
  color: string;
  x: number;
  y: number;
  size: "small" | "medium" | "large";
  sizeValue: number;
  filled: boolean;
  quadrant: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export interface SceneData {
  width: number;
  height: number;
  shapes: SceneShape[];
  labels: { text: string; x: number; y: number }[];
}

export interface FlashContent {
  type: "digits" | "facts" | "colors" | "expression";
  items: string[];
  displayTimeMs: number;
}

export interface SectionScores {
  "cognitive-stack": number;
  isomorphism: number;
  "expert-trap": number;
  math: number;
  coding?: number;
  perception: number;
  memory: number;
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
    type: QuestionType;
    payload: QuestionPayload;
  }[];
}

export interface SubmitRequest {
  sessionId: string;
  responses: {
    questionId: string;
    answer: string | number | string[];
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
    type: QuestionType;
    correct: boolean;
    score: number;
    payload: QuestionPayload;
    userAnswer: unknown;
    correctAnswer: unknown;
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
