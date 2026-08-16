"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import type { Section, QuestionPayload } from "./types";

/**
 * localStorage that never throws. Storage can be blocked (cookies disabled,
 * partitioned iframes), full (quota), or absent (SSR/tests); in every such
 * case we degrade to an in-memory map so the test still runs, just without
 * reload-resume. Without this, persist would skip hydration entirely (no
 * storage) or throw out of setState (setItem quota errors).
 */
function safeStorage(): StateStorage {
  const memory = new Map<string, string>();
  const ls = (): Storage | null => {
    try {
      if (typeof window === "undefined") return null;
      const s = window.localStorage;
      // Some browsers expose localStorage but throw on access.
      s.getItem("__mica_probe__");
      return s;
    } catch {
      return null;
    }
  };
  return {
    getItem: (name) => {
      try {
        return ls()?.getItem(name) ?? memory.get(name) ?? null;
      } catch {
        return memory.get(name) ?? null;
      }
    },
    setItem: (name, value) => {
      memory.set(name, value);
      try {
        ls()?.setItem(name, value);
      } catch {
        /* quota or blocked: memory copy is enough for this page's lifetime */
      }
    },
    removeItem: (name) => {
      memory.delete(name);
      try {
        ls()?.removeItem(name);
      } catch {
        /* ignore */
      }
    },
  };
}

export interface QuestionState {
  id: string;
  section: Section;
  index: number;
  type: string;
  payload: QuestionPayload;
}

export type TestPhase =
  | "idle"
  | "intake"
  | "testing"
  | "between-sections"
  | "submitting"
  | "expired"
  | "complete";

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
  /** Wall-clock ms when the current question's timer started. Timer deadline = this + timeLimit. */
  questionStartTime: number;
  sectionStartTime: number;
  /** Whether the section-0 intro has been dismissed (survives refresh). */
  introShown: boolean;
  /** Typed-but-not-submitted answer for the current question; flushed on timer expiry. */
  draft: string;

  // UI state
  phase: TestPhase;
  sectionCommentary: string | null;
  previousSectionScore: { section: string; correct: number; total: number } | null;
  /** Result id of the last completed session (so /test can link back to the report). */
  lastResultId: string | null;
  /** True once persisted state has been rehydrated on the client. */
  hydrated: boolean;

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
  /** (Re)start the wall clock for the current question. Call when a question actually becomes visible. */
  beginQuestion: () => void;
  setDraft: (draft: string) => void;
  setAnswer: (questionId: string, answer: string) => void;
  /** Timer ran out: record whatever was typed (possibly nothing) for the current question and advance. */
  expireQuestion: () => void;
  nextQuestion: () => void;
  setPhase: (phase: TestPhase) => void;
  setIntroShown: () => void;
  setSectionCommentary: (commentary: string, score: { section: string; correct: number; total: number }) => void;
  setInteractivePhase: (phase: TestStore["interactivePhase"]) => void;
  setInteractiveResult: (result: string | null) => void;
  completeSession: (resultId: string) => void;
  setHydrated: (hydrated: boolean) => void;
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
  questionStartTime: 0,
  sectionStartTime: 0,
  introShown: false,
  draft: "",
  phase: "idle" as TestPhase,
  sectionCommentary: null,
  previousSectionScore: null,
  lastResultId: null as string | null,
  interactivePhase: "idle" as const,
  interactiveResult: null,
};

export const STORE_KEY = "mica-test-session";

// The initializer's `set`, captured so onRehydrateStorage can recover from a
// hydration error. With synchronous storage, hydration runs inside create()
// (before `useTestStore` is assigned, and create() then installs the
// initializer's state, discarding any set() made during hydration), so the
// recovery must run on a microtask after create() has returned.
let recoverFromHydrationError: (() => void) | null = null;

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => {
      recoverFromHydrationError = () => queueMicrotask(() => set({ ...initialState, hydrated: true }));
      return {
      ...initialState,
      hydrated: false,

      startSession: (data) => {
        const now = Date.now();
        set({
          sessionId: data.sessionId,
          specimenId: data.specimenId,
          expiresAt: new Date(data.expiresAt).getTime(),
          questions: data.questions,
          currentIndex: 0,
          currentSection: data.questions[0]?.section || null,
          answers: {},
          introShown: false,
          draft: "",
          phase: "testing",
          questionStartTime: now,
          sectionStartTime: now,
        });
      },

      beginQuestion: () => set({ questionStartTime: Date.now(), draft: "" }),

      setDraft: (draft) => set({ draft }),

      setAnswer: (questionId, answer) => {
        const now = Date.now();
        const timeMs = Math.max(0, now - get().questionStartTime);
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: { answer, timeMs },
          },
        }));
      },

      expireQuestion: () => {
        const { questions, currentIndex, answers, draft } = get();
        const q = questions[currentIndex];
        if (!q) return;
        if (!answers[q.id]) {
          get().setAnswer(q.id, draft ?? "");
        }
        get().nextQuestion();
      },

      nextQuestion: () => {
        const { currentIndex, questions } = get();
        const nextIdx = currentIndex + 1;

        if (nextIdx >= questions.length) {
          set({ phase: "submitting", draft: "" });
          return;
        }

        const currentQ = questions[currentIndex];
        const nextQ = questions[nextIdx];

        if (currentQ.section !== nextQ.section) {
          // The next question's clock starts when the visitor leaves the
          // section-transition screen (see beginQuestion), not now.
          set({
            phase: "between-sections",
            currentIndex: nextIdx,
            currentSection: nextQ.section,
            draft: "",
          });
        } else {
          set({
            currentIndex: nextIdx,
            questionStartTime: Date.now(),
            draft: "",
          });
        }
      },

      setPhase: (phase) => set({ phase }),
      setIntroShown: () => set({ introShown: true }),
      setSectionCommentary: (commentary, score) =>
        set({ sectionCommentary: commentary, previousSectionScore: score }),
      setInteractivePhase: (interactivePhase) => set({ interactivePhase }),
      setInteractiveResult: (interactiveResult) => set({ interactiveResult }),

      completeSession: (resultId) => set({ ...initialState, lastResultId: resultId, phase: "complete" }),
      setHydrated: (hydrated) => set({ hydrated }),

      reset: () => set({ ...initialState, lastResultId: get().lastResultId }),
      };
    },
    {
      name: STORE_KEY,
      storage: createJSONStorage(safeStorage),
      // Persist everything except transient flags.
      partialize: (state) => {
        const { hydrated: _h, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // Corrupt/unreadable persisted value: drop it and start clean rather
          // than staying on the "restoring" screen forever.
          console.warn("MICA: discarding unreadable persisted session", error);
          try {
            safeStorage().removeItem(STORE_KEY);
          } catch {
            /* ignore */
          }
          recoverFromHydrationError?.();
          return;
        }
        state?.setHydrated(true);
      },
    }
  )
);
