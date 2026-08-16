import { describe, it, expect } from "vitest";
import { ALL_FAMILIES, generateItem, familiesFor } from "@/lib/generators";
import { MAX_D, MIN_D } from "@/lib/generators/types";
import { gradeTyped } from "@/lib/engine/grader";
import { SECTION_ORDER } from "@/lib/types";

const SEEDS = ["a", "b", "c", "seed-4", "seed-5", "x9", "y10", "z11"];

describe("generator registry", () => {
  it("has three families per section", () => {
    for (const s of SECTION_ORDER) expect(familiesFor(s).length, s).toBe(3);
    expect(ALL_FAMILIES.length).toBe(15);
    expect(new Set(ALL_FAMILIES.map((f) => f.family)).size).toBe(15);
  });
});

describe.each(ALL_FAMILIES.map((f) => [f.family] as const))("%s", (family) => {
  it("is deterministic per (seed, d)", () => {
    for (let d = MIN_D; d <= MAX_D; d++) {
      const a = generateItem(family, "det", d);
      const b = generateItem(family, "det", d);
      expect(a).toEqual(b);
    }
  });

  it("differs across seeds", () => {
    const prompts = new Set(SEEDS.map((s) => JSON.stringify(generateItem(family, s, 4))));
    expect(prompts.size).toBeGreaterThan(1);
  });

  it("produces well-formed items whose reference grades as correct at every level", () => {
    for (let d = MIN_D; d <= MAX_D; d++) {
      for (const seed of SEEDS) {
        const item = generateItem(family, seed, d);
        expect(item.prompt.length, `${family} d${d}`).toBeGreaterThan(20);
        expect(item.prompt).not.toMatch(/undefined|NaN|\[object/);
        expect(item.display ?? "").not.toMatch(/undefined|NaN/);
        expect(item.reference.length).toBeGreaterThan(0);
        expect(item.timeLimit).toBeGreaterThanOrEqual(20);
        expect(item.timeLimit).toBeLessThanOrEqual(90);
        const g = gradeTyped(item.reference, item.reference, item.grader);
        expect(g.correct, `${family} d${d} seed ${seed}: reference must grade correct`).toBe(true);
        // A clearly wrong answer must not grade correct.
        const wrong = item.grader.kind === "numeric" ? String(Number(item.reference) + 7.5) : item.reference + "zz";
        expect(gradeTyped(wrong, item.reference, item.grader).correct).toBe(false);
      }
    }
  });

  it("time limit is non-decreasing in d", () => {
    let prev = 0;
    for (let d = MIN_D; d <= MAX_D; d++) {
      const t = generateItem(family, "t", d).timeLimit;
      expect(t).toBeGreaterThanOrEqual(prev);
      prev = t;
    }
  });
});

describe("typed graders accept human formatting", () => {
  it("hex: case, 0x, spacing, leading zeros", () => {
    expect(gradeTyped("0x0aB", "0AB", { kind: "hex" }).correct).toBe(true);
    expect(gradeTyped("a b", "AB", { kind: "hex" }).correct).toBe(true);
    expect(gradeTyped("ab", "0AB", { kind: "hex" }).correct).toBe(true);
    expect(gradeTyped("ac", "AB", { kind: "hex" }).correct).toBe(false);
  });
  it("numeric: compares to the exact value when supplied (half-way references)", () => {
    // 3/80 = 0.0375 renders as "0.037" (binary float below the half); "0.038" and "0.037" must both pass.
    const spec = { kind: "numeric" as const, decimalPlaces: 3, exact: 3 / 80 };
    expect(gradeTyped("0.038", "0.037", spec).correct).toBe(true);
    expect(gradeTyped("0.037", "0.037", spec).correct).toBe(true);
    expect(gradeTyped("0.0375", "0.037", spec).correct).toBe(true);
    expect(gradeTyped("0.039", "0.037", spec).correct).toBe(false);
  });
  it("numeric: rounding tolerance and separators", () => {
    expect(gradeTyped("0.1235", "0.123", { kind: "numeric", decimalPlaces: 3 }).correct).toBe(true);
    expect(gradeTyped("0.1236", "0.123", { kind: "numeric", decimalPlaces: 3 }).correct).toBe(false);
    expect(gradeTyped("1,021", "1021", { kind: "numeric", decimalPlaces: 0 }).correct).toBe(true);
    expect(gradeTyped("−4", "-4", { kind: "numeric", decimalPlaces: 0 }).correct).toBe(true);
  });
  it("set: order-insensitive, spaces ok", () => {
    expect(gradeTyped("7, 3", "3,7", { kind: "set" }).correct).toBe(true);
    expect(gradeTyped("7,3,1", "3,7", { kind: "set" }).correct).toBe(false);
  });
  it("sequence: partial credit, exact required for correct", () => {
    const g = gradeTyped("MNMN", "MNNN", { kind: "sequence" });
    expect(g.correct).toBe(false);
    expect(g.score).toBe(0.75);
    expect(gradeTyped("m n n n", "MNNN", { kind: "sequence" }).correct).toBe(true);
    const h = gradeTyped("1, 2, 4", "1,2,3", { kind: "sequence", separator: "," });
    expect(h.correct).toBe(false);
    expect(h.score).toBeCloseTo(2 / 3);
  });
  it("exact: case/space insensitive", () => {
    expect(gradeTyped("  hello ", "HELLO", { kind: "exact" }).correct).toBe(true);
    expect(gradeTyped("", "", { kind: "exact" }).correct).toBe(false);
  });
});
