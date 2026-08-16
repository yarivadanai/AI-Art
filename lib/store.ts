"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import type {
  AdaptiveProgress,
  Beliefs,
  Confidence,
  FinaleOutcome,
  Section,
  SectionSummary,
  ServedQuestion,
} from "./types";

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

export interface StoredAnswer {
  answer: string;
  timeMs: number;
  confidence: Confidence | null;
  abstained: boolean;
}

/** An answer captured locally and not yet acknowledged by the server (retried on failure/reload). */
export interface PendingAnswer extends StoredAnswer {
  questionId: string;
}

export interface SectionResult {
  summary: SectionSummary;
  frontier: number;
  finale: FinaleOutcome;
}

export interface LastGraded {
  questionId: string;
  correct: boolean;
  level: number | null;
  kind: "ladder" | "finale";
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

  // Adaptive test state (server-authoritative; mirrored here for rendering + reload)
  question: ServedQuestion | null;
  progress: AdaptiveProgress | null;
  /** Item to show after the visitor leaves the section-transition screen. */
  nextQuestionStash: ServedQuestion | null;
  nextProgressStash: AdaptiveProgress | null;
  /** Server results per completed section. */
  sectionResults: Partial<Record<Section, SectionResult>>;
  /** Grade of the item just answered (for the small status line). */
  lastGraded: LastGraded | null;
  /** Answer sent (or about to be sent) to the server, kept until acknowledged. */
  pending: PendingAnswer | null;
  /** Local record of everything answered (the report is the source of truth). */
  answers: Record<string, StoredAnswer>;
  /** Wall-clock ms when the current question's timer started. Timer deadline = this + timeLimit. */
  questionStartTime: number;
  /** Whether the section-0 intro has been dismissed (survives refresh). */
  introShown: boolean;
  /** Typed-but-not-submitted answer for the current question; flushed on timer expiry. */
  draft: string;
  /** Confidence chip selected for the current question (cleared on every transition). */
  draftConfidence: Confidence | null;
  /** Intake belief answers, sent with the session request and quoted back on the report. */
  beliefs: Beliefs | null;

  // UI state
  phase: TestPhase;
  /** Result id of the last completed session (so /test can link back to the report). */
  lastResultId: string | null;
  /** True once persisted state has been rehydrated on the client. */
  hydrated: boolean;

  // Actions
  startAdaptive: (data: {
    sessionId: string;
    specimenId: string;
    expiresAt: string;
    question: ServedQuestion;
    progress: AdaptiveProgress;
  }) => void;
  /** (Re)start the wall clock for the current question. Call when a question actually becomes visible. */
  beginQuestion: () => void;
  setDraft: (draft: string) => void;
  setDraftConfidence: (confidence: Confidence | null) => void;
  setBeliefs: (beliefs: Beliefs | null) => void;
  /** Capture the visitor's answer for the current item as pending (to be sent to the server). */
  capture: (answer: string, confidence: Confidence | null, abstained: boolean) => PendingAnswer | null;
  /** Timer ran out: capture whatever was typed (possibly nothing) with confidence 'expired'. */
  captureExpired: () => PendingAnswer | null;
  /** Server acknowledged the pending answer: record the grade and either show the next item, a transition, or finish. */
  acknowledge: (ack: {
    graded: LastGraded | null;
    sectionComplete?: { section: Section; summary: SectionSummary; frontier: number; finale: FinaleOutcome };
    question?: ServedQuestion;
    progress?: AdaptiveProgress;
    done?: { resultId: string };
  }) => void;
  /** Leave the transition screen and show the stashed next item. */
  proceed: () => void;
  setPhase: (phase: TestPhase) => void;
  setIntroShown: () => void;
  completeSession: (resultId: string) => void;
  setHydrated: (hydrated: boolean) => void;
  reset: () => void;
}

const initialState = {
  sessionId: null as string | null,
  specimenId: null as string | null,
  expiresAt: null as number | null,
  question: null as ServedQuestion | null,
  progress: null as AdaptiveProgress | null,
  nextQuestionStash: null as ServedQuestion | null,
  nextProgressStash: null as AdaptiveProgress | null,
  sectionResults: {} as Partial<Record<Section, SectionResult>>,
  lastGraded: null as LastGraded | null,
  pending: null as PendingAnswer | null,
  answers: {} as Record<string, StoredAnswer>,
  questionStartTime: 0,
  introShown: false,
  draft: "",
  draftConfidence: null as Confidence | null,
  beliefs: null as Beliefs | null,
  phase: "idle" as TestPhase,
  lastResultId: null as string | null,
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

        startAdaptive: (data) => {
          const now = Date.now();
          set({
            ...initialState,
            lastResultId: get().lastResultId,
            beliefs: get().beliefs,
            sessionId: data.sessionId,
            specimenId: data.specimenId,
            expiresAt: new Date(data.expiresAt).getTime(),
            question: data.question,
            progress: data.progress,
            phase: "testing",
            questionStartTime: now,
          });
        },

        beginQuestion: () => set({ questionStartTime: Date.now(), draft: "", draftConfidence: null }),

        setDraft: (draft) => set({ draft }),
        setDraftConfidence: (draftConfidence) => set({ draftConfidence }),
        setBeliefs: (beliefs) => set({ beliefs }),

        capture: (answer, confidence, abstained) => {
          const { question, pending, questionStartTime, answers } = get();
          if (!question) return null;
          if (pending && pending.questionId === question.id) return pending; // already captured
          if (answers[question.id]) return null; // already answered
          const timeMs = Math.max(0, Date.now() - questionStartTime);
          const p: PendingAnswer = { questionId: question.id, answer: abstained ? "" : answer, timeMs, confidence, abstained };
          set({ pending: p, answers: { ...answers, [question.id]: p } });
          return p;
        },

        captureExpired: () => {
          const { draft } = get();
          return get().capture(draft ?? "", "expired", false);
        },

        acknowledge: (ack) => {
          const state = get();
          const sectionResults = ack.sectionComplete
            ? {
                ...state.sectionResults,
                [ack.sectionComplete.section]: {
                  summary: ack.sectionComplete.summary,
                  frontier: ack.sectionComplete.frontier,
                  finale: ack.sectionComplete.finale,
                },
              }
            : state.sectionResults;

          if (ack.done) {
            set({ pending: null, lastGraded: ack.graded, sectionResults, phase: "submitting", question: null });
            // SubmittingScreen navigates and calls completeSession.
            set({ lastResultId: ack.done.resultId });
            return;
          }
          if (ack.sectionComplete) {
            set({
              pending: null,
              lastGraded: ack.graded,
              sectionResults,
              nextQuestionStash: ack.question ?? null,
              nextProgressStash: ack.progress ?? null,
              phase: "between-sections",
              draft: "",
              draftConfidence: null,
            });
            return;
          }
          set({
            pending: null,
            lastGraded: ack.graded,
            question: ack.question ?? state.question,
            progress: ack.progress ?? state.progress,
            questionStartTime: Date.now(),
            draft: "",
            draftConfidence: null,
          });
        },

        proceed: () => {
          const { nextQuestionStash, nextProgressStash } = get();
          set({
            question: nextQuestionStash,
            progress: nextProgressStash,
            nextQuestionStash: null,
            nextProgressStash: null,
            phase: "testing",
            questionStartTime: Date.now(),
            draft: "",
            draftConfidence: null,
          });
        },

        setPhase: (phase) => set({ phase }),
        setIntroShown: () => set({ introShown: true }),

        completeSession: (resultId) => set({ ...initialState, lastResultId: resultId, phase: "complete" }),
        setHydrated: (hydrated) => set({ hydrated }),

        reset: () => set({ ...initialState, lastResultId: get().lastResultId }),
      };
    },
    {
      name: STORE_KEY,
      version: 2,
      storage: createJSONStorage(safeStorage),
      partialize: (state) => {
        const { hydrated: _h, ...rest } = state;
        return rest;
      },
      // Pre-Phase-2 persisted sessions (fixed 25-item flow) cannot be resumed
      // against the adaptive API; start clean but keep the last report pointer.
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<TestStore>;
        return { ...initialState, lastResultId: p.lastResultId ?? null } as unknown as TestStore;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
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
