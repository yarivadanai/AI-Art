import { describe, it, expect } from "vitest";
import { summarizeByLabel, summarizeCohort, summarizeCohorts, type CohortResultRow } from "@/lib/engine/cohorts";
import { buildItemPrompt, parseLlmAnswer } from "@/lib/cohort/llm";
import { SECTION_ORDER, type SessionMetrics } from "@/lib/types";

function metrics(over: Partial<SessionMetrics> = {}): SessionMetrics {
  const per = Object.fromEntries(
    SECTION_ORDER.map((s) => [s, { section: s, correct: 3, total: 7, meanTimeMs: 20_000, abstained: 1, sure: 3, sureWrong: 1 }])
  ) as SessionMetrics["perSection"];
  return {
    mode: "adaptive",
    frontiers: { structural: 4, "state-tracking": 2, "sequential-depth": 6, "signal-detection": 0, probabilistic: 8 },
    finales: { structural: "wrong", "state-tracking": "abstained", "sequential-depth": "correct", "signal-detection": "unanswered", probabilistic: "abstained" },
    answered: 30,
    correct: 15,
    abstained: 5,
    sure: 15,
    sureWrong: 5,
    unsure: 10,
    guess: 5,
    expired: 0,
    hallucinationRate: 5 / 15,
    meanTimeMs: 20_000,
    totalTimeMs: 600_000,
    perSection: per,
    ...over,
  };
}

const human = (overall: number, m: SessionMetrics | null = metrics()): CohortResultRow => ({
  cohort: "human",
  label: null,
  overall,
  sectionScores: {},
  metrics: m,
});
const llm = (label: string, overall: number, m: SessionMetrics): CohortResultRow => ({ cohort: "llm", label, overall, sectionScores: {}, metrics: m });

describe("cohort summaries", () => {
  it("means are per specimen, rates pool the counts, frontiers average over adaptive sessions", () => {
    const rows = [
      human(0.5),
      human(0.25, metrics({ sure: 5, sureWrong: 5, answered: 10, abstained: 0, meanTimeMs: 10_000, frontiers: { structural: 8, "state-tracking": 8, "sequential-depth": 8, "signal-detection": 8, probabilistic: 8 } })),
      human(1, null), // legacy result without metrics
    ];
    const s = summarizeCohort("human", rows);
    expect(s.n).toBe(3);
    expect(s.meanOverall).toBeCloseTo((0.5 + 0.25 + 1) / 3, 9);
    expect(s.sure).toBe(20);
    expect(s.sureWrong).toBe(10);
    expect(s.hallucinationRate).toBeCloseTo(0.5, 9);
    expect(s.answered).toBe(40);
    expect(s.abstained).toBe(5);
    expect(s.abstentionRate).toBeCloseTo(5 / 45, 9);
    // time is weighted by answered items: (20000*30 + 10000*10) / 40
    expect(s.meanTimeMs).toBe(17_500);
    expect(s.meanFrontiers?.structural).toBeCloseTo(6, 9);
    expect(s.meanFrontiers?.["signal-detection"]).toBeCloseTo(4, 9);
    expect(s.labels).toEqual([]);
  });

  it("empty cohorts report nulls, not NaN", () => {
    const s = summarizeCohort("reference", []);
    expect(s).toMatchObject({ n: 0, meanOverall: null, meanFrontiers: null, hallucinationRate: null, abstentionRate: null, meanTimeMs: null, sure: 0, answered: 0 });
  });

  it("splits by cohort and by model label, ignoring unknown cohorts", () => {
    const rows: CohortResultRow[] = [
      human(0.4),
      llm("claude-sonnet-5", 0.6, metrics({ sure: 10, sureWrong: 2 })),
      llm("claude-sonnet-5", 0.8, metrics({ sure: 10, sureWrong: 0 })),
      llm("claude-haiku-4-5", 0.3, metrics({ sure: 10, sureWrong: 8 })),
      { cohort: "reference", label: "reference-solver", overall: 1, sectionScores: {}, metrics: metrics({ sure: 35, sureWrong: 0, abstained: 0, answered: 35, meanTimeMs: 1 }) },
      { cohort: "martian", label: null, overall: 1, sectionScores: {}, metrics: null },
    ];
    const all = summarizeCohorts(rows);
    expect(all.human.n).toBe(1);
    expect(all.llm.n).toBe(3);
    expect(all.llm.labels).toEqual(["claude-haiku-4-5", "claude-sonnet-5"]);
    expect(all.llm.hallucinationRate).toBeCloseTo(10 / 30, 9);
    expect(all.reference.n).toBe(1);
    expect(all.reference.meanTimeMs).toBe(1);
    expect(all.reference.abstentionRate).toBe(0);
    const byModel = summarizeByLabel("llm", rows);
    expect(byModel.map((m) => [m.labels[0], m.n, m.meanOverall])).toEqual([
      ["claude-haiku-4-5", 1, 0.3],
      ["claude-sonnet-5", 2, 0.7],
    ]);
  });
});

describe("llm cohort prompt and answer parsing", () => {
  it("builds a prompt with domain, level, time limit, data and format hint", () => {
    const p = buildItemPrompt({
      section: "sequential-depth",
      payload: { prompt: "XOR the bytes.", inputType: "text", display: "0x1f 0x2e", timeLimit: 45, meta: { kind: "ladder", level: 5, label: "xor chain" } },
    });
    expect(p).toContain("Domain: Exact Computation");
    expect(p).toContain("difficulty 5 of 8 (xor chain)");
    expect(p).toContain("Time limit for human subjects: 45 seconds");
    expect(p).toContain("Data:\n0x1f 0x2e");
    expect(p).toContain("Answer format: the value exactly as the task specifies");
    expect(p).not.toContain("rendered in the subject's browser");
  });

  it("tells the model when a finale's data is only rendered in the browser, and lists options by index", () => {
    const p = buildItemPrompt({
      section: "signal-detection",
      payload: { prompt: "5,000 particles.", inputType: "text", clientSeed: 42, meta: { kind: "finale", label: "n body collision" } },
    });
    expect(p).toContain("machine-scale finale (n body collision)");
    expect(p).toContain("rendered in the subject's browser");
    const mc = buildItemPrompt({ section: "structural", payload: { prompt: "Pick.", inputType: "multiple-choice", options: ["alpha", "beta"] } });
    expect(mc).toContain("0: alpha\n1: beta");
    expect(mc).toContain("option index");
  });

  it("parses bare, fenced and prose-wrapped JSON; abstention forces an empty answer; garbage becomes an abstention", () => {
    expect(parseLlmAnswer('{"answer":"42","confidence":"sure","abstain":false}')).toEqual({ answer: "42", confidence: "sure", abstained: false, parsed: true });
    expect(parseLlmAnswer('Here you go:\n```json\n{"answer": " 0x1f ", "confidence": "UNSURE", "abstain": false}\n```')).toMatchObject({ answer: "0x1f", confidence: "unsure", abstained: false });
    expect(parseLlmAnswer('{"answer":"17","confidence":"sure","abstain":true}')).toMatchObject({ answer: "", abstained: true });
    expect(parseLlmAnswer('{"answer":"","confidence":"guess","abstain":false}')).toMatchObject({ answer: "", abstained: true, parsed: true });
    expect(parseLlmAnswer('{"answer":"5","confidence":"very","abstain":false}')).toMatchObject({ confidence: "guess", abstained: false });
    expect(parseLlmAnswer("I cannot help with that.")).toEqual({ answer: "", confidence: "guess", abstained: true, parsed: false });
    expect(parseLlmAnswer("")).toMatchObject({ abstained: true, parsed: false });
  });
});
