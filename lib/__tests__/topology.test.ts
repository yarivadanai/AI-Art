import { describe, it, expect } from "vitest";
import { computeTopology, ladderMarks, polygonPath, topologyInputFromResult, type TopologyInput } from "@/lib/topology";
import { describeSpecimen } from "@/lib/commentary";
import { SECTION_ORDER, type SessionMetrics } from "@/lib/types";

const scores = { structural: 0.5, "state-tracking": 0.25, "sequential-depth": 1, "signal-detection": 0, probabilistic: 0.75 };

function metrics(partial: Partial<SessionMetrics> = {}): SessionMetrics {
  const per = Object.fromEntries(
    SECTION_ORDER.map((s) => [s, { section: s, correct: 3, total: 7, meanTimeMs: 25_000, abstained: 1, sure: 3, sureWrong: 2 }])
  ) as SessionMetrics["perSection"];
  return {
    mode: "adaptive",
    frontiers: { structural: 4, "state-tracking": 2, "sequential-depth": 8, "signal-detection": 0, probabilistic: 6 },
    finales: { structural: "correct", "state-tracking": "wrong", "sequential-depth": "abstained", "signal-detection": "unanswered", probabilistic: "abstained" },
    answered: 30,
    correct: 15,
    abstained: 5,
    sure: 15,
    sureWrong: 10,
    unsure: 5,
    guess: 5,
    expired: 0,
    hallucinationRate: 10 / 15,
    meanTimeMs: 25_000,
    totalTimeMs: 750_000,
    perSection: per,
    ...partial,
  };
}

describe("topology geometry", () => {
  it("builds five fixed axes in section order and is deterministic", () => {
    const input = topologyInputFromResult(scores, metrics());
    const a = computeTopology(input, 400);
    const b = computeTopology(input, 400);
    expect(a).toEqual(b);
    expect(a.axes.map((x) => x.section)).toEqual(SECTION_ORDER);
    // first axis points straight up
    expect(a.axes[0].outer.x).toBeCloseTo(a.cx, 6);
    expect(a.axes[0].outer.y).toBeLessThan(a.cy);
    expect(a.ringRadii.length).toBe(8);
    expect(a.levels).toBe(true);
  });

  it("frontier radii follow the scores and coverage is the area fraction", () => {
    const g = computeTopology(topologyInputFromResult(scores, metrics()), 400);
    const r = (i: number) => Math.hypot(g.axes[i].frontier.x - g.cx, g.axes[i].frontier.y - g.cy) / g.R;
    expect(r(0)).toBeCloseTo(0.5, 6);
    expect(r(2)).toBeCloseTo(1, 6);
    expect(r(3)).toBeCloseTo(0, 6);
    expect(g.coverage).toBeGreaterThan(0);
    expect(g.coverage).toBeLessThan(1);
    const full = computeTopology(
      topologyInputFromResult(Object.fromEntries(SECTION_ORDER.map((s) => [s, 1])), metrics()),
      400
    );
    expect(full.coverage).toBeCloseTo(1, 6);
    const none = computeTopology(topologyInputFromResult(Object.fromEntries(SECTION_ORDER.map((s) => [s, 0])), null), 400);
    expect(none.coverage).toBe(0);
    expect(none.levels).toBe(false);
  });

  it("marks reflect confident errors, abstentions, latency and finales", () => {
    const g = computeTopology(topologyInputFromResult(scores, metrics()), 400);
    for (const a of g.axes) {
      expect(a.errorDots.length).toBe(2);
      expect(a.latencyTicks.length).toBe(3); // 25 s -> round(2.5) = 3
    }
    // Without ladder marks, an abstained finale is not drawn twice: metrics count 1, finale abstained -> 0 rings.
    expect(g.axes.map((a) => a.abstainRings.length)).toEqual([1, 1, 0, 1, 0]);
    expect(g.axes.map((a) => a.finale)).toEqual(["correct", "wrong", "abstained", "unanswered", "abstained"]);
    // caps: one mark per event up to the 7 items a domain has; latency ticks stop at 6
    const heavy = topologyInputFromResult(
      scores,
      metrics({
        perSection: Object.fromEntries(
          SECTION_ORDER.map((s) => [s, { section: s, correct: 0, total: 7, meanTimeMs: 400_000, abstained: 9, sure: 9, sureWrong: 9 }])
        ) as SessionMetrics["perSection"],
      })
    );
    const h = computeTopology(heavy, 400);
    for (const a of h.axes) {
      expect(a.errorDots.length).toBe(7);
      expect(a.abstainRings.length).toBe(7);
      expect(a.latencyTicks.length).toBe(6);
    }
  });

  it("draws dots and rings from ladder items only when the graded rows are supplied", () => {
    const rows = [
      { section: "structural" as const, kind: "ladder" as const, correct: false, confidence: "sure", abstained: false },
      { section: "structural" as const, kind: "ladder" as const, correct: true, confidence: "sure", abstained: false },
      { section: "structural" as const, kind: "ladder" as const, correct: false, confidence: null, abstained: true },
      { section: "structural" as const, kind: "finale" as const, correct: false, confidence: "sure", abstained: false }, // finale: marker only
      { section: "state-tracking" as const, kind: null, correct: false, confidence: "sure", abstained: false }, // fixed mode: no meta = ladder
      { section: "state-tracking" as const, kind: "finale" as const, correct: false, confidence: null, abstained: true },
    ];
    const marks = ladderMarks(rows);
    expect(marks.structural).toEqual({ sureWrong: 1, abstained: 1 });
    expect(marks["state-tracking"]).toEqual({ sureWrong: 1, abstained: 0 });
    expect(marks.probabilistic).toEqual({ sureWrong: 0, abstained: 0 });
    const g = computeTopology(topologyInputFromResult(scores, metrics(), marks), 400);
    expect(g.axes[0].errorDots.length).toBe(1);
    expect(g.axes[0].abstainRings.length).toBe(1);
    expect(g.axes[0].finale).toBe("correct");
    expect(g.axes[4].errorDots.length).toBe(0);
  });

  it("describeSpecimen speaks in levels for adaptive results and percentages otherwise", () => {
    const d = describeSpecimen({ sessionId: "cmabcdefgh12345", overall: 0.5, sectionScores: scores, metrics: metrics() });
    expect(d.specimen).toBe("CMABCDEF");
    expect(d.band).toBe("C");
    expect(d.adaptive).toBe(true);
    expect(d.summary).toBe("Insight 4/8 · Memory 2/8 · Exact 8/8 · Signal 0/8 · Inference 6/8");
    expect(d.title).toBe("MICA | Specimen #CMABCDEF: Band C, Heuristic-Dependent");
    expect(d.description).toContain(d.summary);
    expect(d.shareText).toContain("Band C");
    const legacy = describeSpecimen({ sessionId: "x", overall: 0.1, sectionScores: { structural: 1.4 }, metrics: null });
    expect(legacy.adaptive).toBe(false);
    expect(legacy.rows[0]).toMatchObject({ value: "100%", frac: 1 });
    expect(legacy.rows[1]).toMatchObject({ value: "0%", frac: 0 });
  });

  it("copes with a legacy result (no metrics) and clamps scores", () => {
    const input: TopologyInput = topologyInputFromResult({ structural: 1.4, "state-tracking": -1 } as Record<string, number>, null);
    expect(input.domains[0].score).toBe(1);
    expect(input.domains[1].score).toBe(0);
    expect(input.domains[4].score).toBe(0);
    const g = computeTopology(input, 300);
    expect(polygonPath(g.polygon)).toMatch(/^M.*Z$/);
    expect(g.axes.every((a) => a.errorDots.length === 0 && a.finale === null)).toBe(true);
  });
});
