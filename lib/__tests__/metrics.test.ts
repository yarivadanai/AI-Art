import { describe, it, expect } from "vitest";
import { computeMetrics, type GradedItem } from "@/lib/engine/metrics";
import { sanitizeBeliefs, BELIEF_ITEMS } from "@/lib/beliefs";
import { getMirrorLines, getSectionFeedback } from "@/lib/commentary";
import type { SectionScores } from "@/lib/types";

const item = (o: Partial<GradedItem>): GradedItem => ({
  section: "structural",
  correct: false,
  timeMs: 10_000,
  confidence: null,
  abstained: false,
  ...o,
});

describe("computeMetrics", () => {
  it("computes calibration, abstention and timing", () => {
    const items: GradedItem[] = [
      item({ correct: true, confidence: "sure", timeMs: 5_000 }),
      item({ correct: false, confidence: "sure", timeMs: 15_000 }),
      item({ correct: false, confidence: "guess", timeMs: 10_000 }),
      item({ abstained: true, timeMs: 3_000, section: "state-tracking" }),
      item({ correct: true, confidence: "unsure", timeMs: 30_000, section: "state-tracking" }),
      item({ correct: false, confidence: "expired", timeMs: 30_000, section: "probabilistic" }),
    ];
    const m = computeMetrics(items);
    expect(m.answered).toBe(5);
    expect(m.abstained).toBe(1);
    expect(m.correct).toBe(2);
    expect(m.sure).toBe(2);
    expect(m.sureWrong).toBe(1);
    expect(m.hallucinationRate).toBe(0.5);
    expect(m.guess).toBe(1);
    expect(m.unsure).toBe(1);
    expect(m.expired).toBe(1);
    // mean over answered (non-abstained) items: (5+15+10+30+30)/5 = 18000
    expect(m.meanTimeMs).toBe(18_000);
    expect(m.perSection.structural.correct).toBe(1);
    expect(m.perSection.structural.total).toBe(3);
    expect(m.perSection.structural.sureWrong).toBe(1);
    expect(m.perSection["state-tracking"].abstained).toBe(1);
    // abstained item excluded from the section mean: only the 30s item counts
    expect(m.perSection["state-tracking"].meanTimeMs).toBe(30_000);
    expect(m.perSection["signal-detection"].total).toBe(0);
  });

  it("hallucinationRate is null with no sure answers", () => {
    const m = computeMetrics([item({ confidence: "guess" })]);
    expect(m.hallucinationRate).toBeNull();
  });
});

describe("sanitizeBeliefs", () => {
  it("keeps known ids with integer 1..5 and drops the rest", () => {
    const ids = BELIEF_ITEMS.map((b) => b.id);
    const out = sanitizeBeliefs({ [ids[0]]: 4, [ids[1]]: 9, [ids[2]]: "3", bogus: 2 });
    expect(out).toEqual({ [ids[0]]: 4 });
  });
  it("returns null for garbage", () => {
    expect(sanitizeBeliefs(null)).toBeNull();
    expect(sanitizeBeliefs("x")).toBeNull();
    expect(sanitizeBeliefs({ nope: 1 })).toBeNull();
  });
});

const scores: SectionScores = {
  structural: 0.4,
  "state-tracking": 0.2,
  "sequential-depth": 0.6,
  "signal-detection": 0,
  probabilistic: 0.2,
};

describe("Authority voice", () => {
  it("section feedback is data-bound and escalates without placeholders", () => {
    const summary = { section: "structural" as const, correct: 2, total: 5, meanTimeMs: 18_400, abstained: 1, sure: 2, sureWrong: 1 };
    const running = { correct: 2, total: 5, sure: 2, sureWrong: 1, abstained: 1, meanTimeMs: 18_400 };
    const texts = [0, 1, 2, 3].map((i) => getSectionFeedback("structural", summary, running, i, "abc12345xyz"));
    for (const t of texts) {
      expect(t).toContain("2 of 5");
      expect(t).not.toMatch(/undefined|NaN|\[object/);
    }
    expect(texts[0]).toContain("18.4 s");
    expect(texts[1]).toMatch(/SURE/);
    expect(texts[2]).toContain("#ABC12345");
    expect(texts[3]).toMatch(/irony/);
    expect(new Set(texts).size).toBe(4);
  });

  it("mirror lines quote every belief back and end with the thesis", () => {
    const metrics = computeMetrics([
      item({ correct: true, confidence: "sure", timeMs: 12_000 }),
      item({ correct: false, confidence: "sure", timeMs: 20_000 }),
      item({ abstained: true }),
      item({ correct: false, confidence: "guess", timeMs: 25_000 }),
    ]);
    const lines = getMirrorLines(metrics, { llm_understands: 5, trust_machine_calc: 1, confident_error_worse: 3 }, scores);
    const labels = lines.map((l) => l.label);
    expect(labels).toEqual(["SPEED", "CALIBRATION", "ABSTENTION", "AT INTAKE", "AT INTAKE", "AT INTAKE", "THE MIRROR"]);
    const all = lines.map((l) => l.text).join("\n");
    expect(all).toContain("1 was wrong");
    expect(all).toContain("used 1 time");
    expect(all).toContain("Exact Computation: 60%");
    expect(all).not.toMatch(/undefined|NaN/);
    expect(lines[lines.length - 1].text).toMatch(/Either both forms of intelligence understand, or neither does/);
  });

  it("mirror lines cope with no beliefs and no sure answers", () => {
    const metrics = computeMetrics([item({ correct: false, confidence: "guess" })]);
    const lines = getMirrorLines(metrics, null, scores);
    expect(lines.map((l) => l.label)).toEqual(["SPEED", "CALIBRATION", "ABSTENTION", "THE MIRROR"]);
    expect(lines[1].text).toMatch(/No answer was marked SURE/);
  });

  it("returns nothing without metrics (legacy results)", () => {
    expect(getMirrorLines(null, null, scores)).toEqual([]);
  });
});
