"use client";

import { create } from "zustand";
import type { Section, QuestionPayload } from "./types";

export interface QuestionState {
  id: string;
  section: Section;
  index: number;
  type: string;
  payload: QuestionPayload;
}

interface TestStore {
  // Session
  sessionId: string | null;
  specimenId: string | null;
  expiresAt: number | null;

  // Test state
  questions: QuestionState[];
  currentIndex: number;
  currentSection: Section | null;
  answers: Record<string, { answer: string; timeMs: number }>;
  sectionStartTime: number;
  questionStartTime: number;

  // UI state
  phase: "idle" | "intake" | "testing" | "between-sections" | "submitting" | "complete";
  sectionCommentary: string | null;
  previousSectionScore: { section: string; correct: number; total: number } | null;

  // Interactive component state
  interactivePhase: "idle" | "running" | "complete";
  interactiveResult: string | null;

  // Actions
  startSession: (data: {
    sessionId: string;
    specimenId: string;
    expiresAt: string;
    questions: QuestionState[];
  }) => void;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  setPhase: (phase: TestStore["phase"]) => void;
  setSectionCommentary: (commentary: string, score: { section: string; correct: number; total: number }) => void;
  setInteractivePhase: (phase: TestStore["interactivePhase"]) => void;
  setInteractiveResult: (result: string | null) => void;
  reset: () => void;
}

const initialState = {
  sessionId: null,
  specimenId: null,
  expiresAt: null,
  questions: [],
  currentIndex: 0,
  currentSection: null as Section | null,
  answers: {},
  sectionStartTime: 0,
  questionStartTime: 0,
  phase: "idle" as const,
  sectionCommentary: null,
  previousSectionScore: null,
  interactivePhase: "idle" as const,
  interactiveResult: null,
};

export const useTestStore = create<TestStore>((set, get) => ({
  ...initialState,

  startSession: (data) => {
    set({
      sessionId: data.sessionId,
      specimenId: data.specimenId,
      expiresAt: new Date(data.expiresAt).getTime(),
      questions: data.questions,
      currentIndex: 0,
      currentSection: data.questions[0]?.section || null,
      phase: "testing",
      questionStartTime: Date.now(),
      sectionStartTime: Date.now(),
    });
  },

  setAnswer: (questionId, answer) => {
    const now = Date.now();
    const timeMs = now - get().questionStartTime;
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: { answer, timeMs },
      },
    }));
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    const nextIdx = currentIndex + 1;

    if (nextIdx >= questions.length) {
      set({ phase: "submitting" });
      return;
    }

    const currentQ = questions[currentIndex];
    const nextQ = questions[nextIdx];

    if (currentQ.section !== nextQ.section) {
      set({
        phase: "between-sections",
        currentIndex: nextIdx,
        currentSection: nextQ.section,
        questionStartTime: Date.now(),
        sectionStartTime: Date.now(),
      });
    } else {
      set({
        currentIndex: nextIdx,
        questionStartTime: Date.now(),
      });
    }
  },

  setPhase: (phase) => set({ phase }),
  setSectionCommentary: (commentary, score) =>
    set({ sectionCommentary: commentary, previousSectionScore: score }),
  setInteractivePhase: (interactivePhase) => set({ interactivePhase }),
  setInteractiveResult: (interactiveResult) => set({ interactiveResult }),

  reset: () => set(initialState),
}));
