// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";

// Minimal localStorage shim so zustand/persist works under node.
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
Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });

const { useTestStore, STORE_KEY } = await import("@/lib/store");

const questions = [
  { id: "a1", section: "structural" as const, index: 0, type: "x", payload: { prompt: "p", inputType: "text" as const, timeLimit: 30 } },
  { id: "a2", section: "structural" as const, index: 1, type: "x", payload: { prompt: "p", inputType: "text" as const, timeLimit: 30 } },
  { id: "b1", section: "state-tracking" as const, index: 0, type: "x", payload: { prompt: "p", inputType: "text" as const, timeLimit: 45 } },
];

function start() {
  useTestStore.getState().startSession({
    sessionId: "s1",
    specimenId: "s1",
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    questions,
  });
}

beforeEach(() => {
  storage.clear();
  useTestStore.getState().reset();
  vi.useRealTimers();
});

describe("test store", () => {
  it("starts in testing phase with the first question and an empty draft", () => {
    start();
    const s = useTestStore.getState();
    expect(s.phase).toBe("testing");
    expect(s.currentIndex).toBe(0);
    expect(s.draft).toBe("");
    expect(s.introShown).toBe(false);
  });

  it("keeps the typed draft so a timer expiry can submit it", () => {
    start();
    useTestStore.getState().setDraft("224, 378");
    // What TestRunner.handleTimerExpire does:
    const st = useTestStore.getState();
    st.setAnswer("a1", st.draft);
    st.nextQuestion();
    expect(useTestStore.getState().answers["a1"].answer).toBe("224, 378");
    expect(useTestStore.getState().draft).toBe("");
    expect(useTestStore.getState().currentIndex).toBe(1);
  });

  it("does not count intro/transition reading time toward the question clock", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-16T10:00:00Z"));
    start();
    // Visitor reads the section-0 intro for 40s, then proceeds.
    vi.advanceTimersByTime(40_000);
    useTestStore.getState().setIntroShown();
    useTestStore.getState().beginQuestion();
    vi.advanceTimersByTime(3_000);
    useTestStore.getState().setAnswer("a1", "x");
    expect(useTestStore.getState().answers["a1"].timeMs).toBe(3_000);

    useTestStore.getState().nextQuestion(); // a2, same section: clock starts now
    vi.advanceTimersByTime(2_000);
    useTestStore.getState().setAnswer("a2", "y");
    expect(useTestStore.getState().answers["a2"].timeMs).toBe(2_000);

    useTestStore.getState().nextQuestion(); // section change -> between-sections
    expect(useTestStore.getState().phase).toBe("between-sections");
    vi.advanceTimersByTime(90_000); // long read of the transition screen
    useTestStore.getState().beginQuestion();
    useTestStore.getState().setPhase("testing");
    vi.advanceTimersByTime(5_000);
    useTestStore.getState().setAnswer("b1", "z");
    expect(useTestStore.getState().answers["b1"].timeMs).toBe(5_000);
  });

  it("moves to submitting after the last question", () => {
    start();
    const st = useTestStore.getState();
    st.setAnswer("a1", "1");
    st.nextQuestion();
    st.setAnswer("a2", "2");
    st.nextQuestion();
    st.setPhase("testing");
    st.setAnswer("b1", "3");
    st.nextQuestion();
    expect(useTestStore.getState().phase).toBe("submitting");
  });

  it("persists mid-test state and rehydrates it", async () => {
    start();
    useTestStore.getState().setIntroShown();
    useTestStore.getState().setDraft("half typed");
    useTestStore.getState().setAnswer("a1", "done");
    useTestStore.getState().nextQuestion();
    useTestStore.getState().setDraft("half typed");

    const raw = storage.getItem(STORE_KEY);
    expect(raw).toBeTruthy();
    const persisted = JSON.parse(raw!).state;
    expect(persisted.phase).toBe("testing");
    expect(persisted.currentIndex).toBe(1);
    expect(persisted.answers.a1.answer).toBe("done");
    expect(persisted.draft).toBe("half typed");
    expect(persisted.introShown).toBe(true);
    expect(persisted.hydrated).toBeUndefined();

    // Simulate a reload: wipe in-memory state (which persist also writes out),
    // put the pre-reload snapshot back in storage, then rehydrate from it.
    useTestStore.setState({ ...useTestStore.getInitialState(), hydrated: false } as any, true);
    storage.setItem(STORE_KEY, raw!);
    await useTestStore.persist.rehydrate();
    const s = useTestStore.getState();
    expect(s.hydrated).toBe(true);
    expect(s.phase).toBe("testing");
    expect(s.currentIndex).toBe(1);
    expect(s.draft).toBe("half typed");
    expect(s.questions.length).toBe(3);
  });

  it("completeSession clears the session but remembers the result id", () => {
    start();
    useTestStore.getState().completeSession("r123");
    const s = useTestStore.getState();
    expect(s.phase).toBe("complete");
    expect(s.sessionId).toBeNull();
    expect(s.questions.length).toBe(0);
    expect(s.lastResultId).toBe("r123");
    // A fresh reset keeps the pointer to the last report.
    useTestStore.getState().reset();
    expect(useTestStore.getState().lastResultId).toBe("r123");
    expect(useTestStore.getState().phase).toBe("idle");
  });
});
