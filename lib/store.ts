"use client";

import { create } from "zustand";
import type { Section, QuestionPayload, QuestionType } from "./types";

export interface QuestionState {
  id: string;
  section: Section;
  index: number;
  type: QuestionType;
  payload: QuestionPayload;
}

interface TestStore {
  // Session
  sessionId: string | null;
  specimenId: string | null;
  expiresAt: number | null;
  includesCoding: boolean;

  // Test state
  questions: QuestionState[];
  currentIndex: number;
  currentSection: Section | null;
  answers: Record<string, { answer: string | number | string[]; timeMs: number }>;
  sectionStartTime: number;
  questionStartTime: number;

  // UI state
  phase: "idle" | "intake" | "testing" | "between-sections" | "submitting" | "complete";
  sectionCommentary: string | null;
  previousSectionScore: { section: string; correct: number; total: number } | null;

  // Perception
  sceneVisible: boolean;
  sceneCountdown: number;

  // Memory flash
  flashActive: boolean;
  flashContent: string[] | null;
  flashIndex: number;

  // Actions
  startSession: (data: {
    sessionId: string;
    specimenId: string;
    expiresAt: string;
    questions: QuestionState[];
    includesCoding: boolean;
  }) => void;
  setAnswer: (questionId: string, answer: string | number | string[]) => void;
  nextQuestion: () => void;
  setPhase: (phase: TestStore["phase"]) => void;
  setSectionCommentary: (commentary: string, score: { section: string; correct: number; total: number }) => void;
  setSceneVisible: (visible: boolean) => void;
  setSceneCountdown: (n: number) => void;
  setFlashActive: (active: boolean) => void;
  setFlashContent: (content: string[] | null) => void;
  setFlashIndex: (index: number) => void;
  reset: () => void;
}

const initialState = {
  sessionId: null,
  specimenId: null,
  expiresAt: null,
  includesCoding: false,
  questions: [],
  currentIndex: 0,
  currentSection: null as Section | null,
  answers: {},
  sectionStartTime: 0,
  questionStartTime: 0,
  phase: "idle" as const,
  sectionCommentary: null,
  previousSectionScore: null,
  sceneVisible: false,
  sceneCountdown: 0,
  flashActive: false,
  flashContent: null,
  flashIndex: 0,
};

export const useTestStore = create<TestStore>((set, get) => ({
  ...initialState,

  startSession: (data) => {
    set({
      sessionId: data.sessionId,
      specimenId: data.specimenId,
      expiresAt: new Date(data.expiresAt).getTime(),
      questions: data.questions,
      includesCoding: data.includesCoding,
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
      // Moving to a new section — show between-sections screen
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
  setSceneVisible: (visible) => set({ sceneVisible: visible }),
  setSceneCountdown: (n) => set({ sceneCountdown: n }),
  setFlashActive: (active) => set({ flashActive: active }),
  setFlashContent: (content) => set({ flashContent: content }),
  setFlashIndex: (index) => set({ flashIndex: index }),

  reset: () => set(initialState),
}));
