// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";

// Minimal window.localStorage shim, installed before lib/store is imported
// (vi.hoisted runs ahead of the static imports below).
const { storage } = vi.hoisted(() => {
  class MemoryStorage {
    private m = new Map<string, string>();
    getItem(k: string) {
      return this.m.get(k) ?? null;
    }
    setItem(k: string, v: string) {
      this.m.set(k, v);
    }
    removeItem(k: string) {
      this.m.delete(k);
    }
    clear() {
      this.m.clear();
    }
  }
  const storage = new MemoryStorage();
  (globalThis as any).window = { localStorage: storage };
  return { storage };
});

import { useTestStore, STORE_KEY } from "@/lib/store";
import type { AdaptiveProgress, ServedQuestion } from "@/lib/types";

const q = (id: string, section: ServedQuestion["section"], index = 0, level: number | undefined = 3): ServedQuestion => ({
  id,
  section,
  index,
  type: "gen_x",
  payload: { prompt: "p", inputType: "text", timeLimit: 30, meta: level ? { kind: "ladder", level } : { kind: "finale" } },
});
const prog = (sectionIndex: number, itemIndex: number): AdaptiveProgress => ({
  sectionIndex,
  sectionsTotal: 5,
  itemIndex,
  itemsPerSection: 7,
  ladderLength: 6,
  currentLevel: 3,
});

function start() {
  useTestStore.getState().startAdaptive({
    sessionId: "s1",
    specimenId: "s1",
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    question: q("a1", "structural", 0),
    progress: prog(0, 0),
  });
}

const summary = (section: any) => ({ section, correct: 3, total: 7, meanTimeMs: 5000, abstained: 1, sure: 2, sureWrong: 1 });

beforeEach(() => {
  storage.clear();
  useTestStore.getState().reset();
  vi.useRealTimers();
});

describe("adaptive test store", () => {
  it("starts in testing phase with the first item and an empty draft", () => {
    start();
    const s = useTestStore.getState();
    expect(s.phase).toBe("testing");
    expect(s.question?.id).toBe("a1");
    expect(s.draft).toBe("");
    expect(s.pending).toBeNull();
    expect(s.introShown).toBe(false);
  });

  it("capture records a pending answer once; expiry captures the draft as 'expired'", () => {
    start();
    useTestStore.getState().setDraft("224, 378");
    const p = useTestStore.getState().captureExpired();
    expect(p?.answer).toBe("224, 378");
    expect(p?.confidence).toBe("expired");
    expect(useTestStore.getState().pending?.questionId).toBe("a1");
    // A second capture for the same item returns the same pending answer (no double send).
    const p2 = useTestStore.getState().capture("other", "sure", false);
    expect(p2).toBe(useTestStore.getState().pending);
    expect(useTestStore.getState().answers["a1"].answer).toBe("224, 378");
  });

  it("abstention is captured with an empty answer", () => {
    start();
    const p = useTestStore.getState().capture("ignored", null, true);
    expect(p?.abstained).toBe(true);
    expect(p?.answer).toBe("");
  });

  it("acknowledge advances to the next item and restarts the clock; transitions do not charge the clock", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-16T10:00:00Z"));
    start();
    vi.advanceTimersByTime(40_000); // reading the intro
    useTestStore.getState().setIntroShown();
    useTestStore.getState().beginQuestion();
    vi.advanceTimersByTime(3_000);
    const p = useTestStore.getState().capture("x", "sure", false)!;
    expect(p.timeMs).toBe(3_000);
    useTestStore.getState().acknowledge({
      graded: { questionId: "a1", correct: true, level: 3, kind: "ladder" },
      question: q("a2", "structural", 1, 4),
      progress: prog(0, 1),
    });
    let s = useTestStore.getState();
    expect(s.pending).toBeNull();
    expect(s.question?.id).toBe("a2");
    expect(s.lastGraded?.correct).toBe(true);
    vi.advanceTimersByTime(2_000);
    expect(useTestStore.getState().capture("y", "guess", false)!.timeMs).toBe(2_000);

    // Section boundary: stash next item, go to transition, clock restarts only on proceed.
    useTestStore.getState().acknowledge({
      graded: { questionId: "a2", correct: false, level: 4, kind: "finale" },
      sectionComplete: { section: "structural", summary: summary("structural"), frontier: 3, finale: "wrong" },
      question: q("b1", "state-tracking", 0),
      progress: prog(1, 0),
    });
    s = useTestStore.getState();
    expect(s.phase).toBe("between-sections");
    expect(s.question?.id).toBe("a2");
    expect(s.nextQuestionStash?.id).toBe("b1");
    expect(s.sectionResults.structural?.frontier).toBe(3);
    vi.advanceTimersByTime(90_000); // long read of the transition screen
    useTestStore.getState().proceed();
    vi.advanceTimersByTime(5_000);
    s = useTestStore.getState();
    expect(s.phase).toBe("testing");
    expect(s.question?.id).toBe("b1");
    expect(useTestStore.getState().capture("z", "unsure", false)!.timeMs).toBe(5_000);
  });

  it("done moves to submitting with the result id", () => {
    start();
    useTestStore.getState().capture("x", "sure", false);
    useTestStore.getState().acknowledge({
      graded: { questionId: "a1", correct: true, level: 3, kind: "finale" },
      sectionComplete: { section: "probabilistic", summary: summary("probabilistic"), frontier: 5, finale: "correct" },
      done: { resultId: "r9" },
    });
    const s = useTestStore.getState();
    expect(s.phase).toBe("submitting");
    expect(s.lastResultId).toBe("r9");
    expect(s.pending).toBeNull();
  });

  it("persists mid-test state (including a pending answer) and rehydrates it", async () => {
    start();
    useTestStore.getState().setIntroShown();
    useTestStore.getState().setDraft("half typed");
    useTestStore.getState().capture("half typed", "guess", false);

    const raw = storage.getItem(STORE_KEY);
    expect(raw).toBeTruthy();
    const persisted = JSON.parse(raw!).state;
    expect(persisted.phase).toBe("testing");
    expect(persisted.question.id).toBe("a1");
    expect(persisted.pending.answer).toBe("half typed");
    expect(persisted.introShown).toBe(true);
    expect(persisted.hydrated).toBeUndefined();

    useTestStore.setState({ ...useTestStore.getInitialState(), hydrated: false } as any, true);
    storage.setItem(STORE_KEY, raw!);
    await useTestStore.persist.rehydrate();
    const s = useTestStore.getState();
    expect(s.hydrated).toBe(true);
    expect(s.phase).toBe("testing");
    expect(s.pending?.questionId).toBe("a1");
    expect(s.question?.id).toBe("a1");
  });

  it("migrates a pre-Phase-2 persisted value to a clean state, keeping lastResultId", async () => {
    storage.setItem(
      STORE_KEY,
      JSON.stringify({ state: { phase: "testing", questions: [{ id: "old" }], currentIndex: 3, lastResultId: "old-r" }, version: 0 })
    );
    vi.resetModules();
    const fresh = await import("@/lib/store");
    await Promise.resolve();
    const s = fresh.useTestStore.getState();
    expect(s.phase).toBe("idle");
    expect(s.lastResultId).toBe("old-r");
    expect(s.question).toBeNull();
  });

  it("hydrates (and clears the key) when the persisted value is corrupt at module load", async () => {
    storage.setItem(STORE_KEY, "{not json");
    vi.resetModules();
    const fresh = await import("@/lib/store");
    await Promise.resolve();
    expect(fresh.useTestStore.getState().hydrated).toBe(true);
    expect(fresh.useTestStore.getState().phase).toBe("idle");
    expect(storage.getItem(STORE_KEY)).not.toBe("{not json");
  });

  it("completeSession clears the session but remembers the result id", () => {
    start();
    useTestStore.getState().completeSession("r123");
    const s = useTestStore.getState();
    expect(s.phase).toBe("complete");
    expect(s.sessionId).toBeNull();
    expect(s.question).toBeNull();
    expect(s.lastResultId).toBe("r123");
    useTestStore.getState().reset();
    expect(useTestStore.getState().lastResultId).toBe("r123");
    expect(useTestStore.getState().phase).toBe("idle");
  });
});
