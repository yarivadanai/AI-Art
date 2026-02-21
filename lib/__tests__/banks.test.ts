import { describe, it, expect } from "vitest";
import { DATASET } from "@/lib/banks/dataset";
import type { DatasetQuestion } from "@/lib/banks/dataset";
import { hashAnswer } from "@/lib/banks/shared";
import { mulberry32 } from "@/lib/engine/rng";
import parityData from "@/lib/data/mulberry32_parity.json";

// ── Dataset integrity ───────────────────────────────────────────────────────

describe("Dataset integrity", () => {
  it("has exactly 630 questions", () => {
    expect(DATASET.length).toBe(630);
  });

  it("has 90 questions per section", () => {
    const sections = [
      "topology",
      "parallel-state",
      "recursive-exec",
      "micro-pattern",
      "attentional",
      "bayesian",
      "crypto-bitwise",
    ];
    for (const section of sections) {
      const count = DATASET.filter((q) => q.section === section).length;
      expect(count, `${section} should have 90`).toBe(90);
    }
  });

  it("has correct tier distribution per section", () => {
    const sections = [
      "topology",
      "parallel-state",
      "recursive-exec",
      "micro-pattern",
      "attentional",
      "bayesian",
      "crypto-bitwise",
    ];
    for (const section of sections) {
      const sectionQs = DATASET.filter((q) => q.section === section);
      const t1 = sectionQs.filter((q) => q.tier === 1).length;
      const t2 = sectionQs.filter((q) => q.tier === 2).length;
      const t3 = sectionQs.filter((q) => q.tier === 3).length;
      expect(t1, `${section} tier 1`).toBe(25);
      expect(t2, `${section} tier 2`).toBe(15);
      expect(t3, `${section} tier 3`).toBe(50);
    }
  });

  it("has no duplicate IDs", () => {
    const ids = DATASET.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── Hash format & roundtrip ─────────────────────────────────────────────────

describe("Hash validation", () => {
  it("all hashes are valid 64-char hex strings", () => {
    for (const q of DATASET) {
      expect(q.answerHash).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("_verifiedAnswer hashes to answerHash for every question", () => {
    for (const q of DATASET) {
      const computed = hashAnswer(
        q._verifiedAnswer,
        q.normalization,
        q.decimalPlaces
      );
      expect(computed, `${q.id}: hash mismatch`).toBe(q.answerHash);
    }
  });
});

// ── Structural integrity ────────────────────────────────────────────────────

describe("Structural integrity", () => {
  it("every question has required fields", () => {
    for (const q of DATASET) {
      expect(q.id).toBeTruthy();
      expect(q.section).toBeTruthy();
      expect(q.subtype).toBeTruthy();
      expect(q.prompt).toBeTruthy();
      expect(q.inputType).toBeTruthy();
      expect(q.answerHash).toBeTruthy();
      expect(q.normalization).toBeTruthy();
      expect(q._verifiedAnswer).toBeDefined();
    }
  });

  const validInputTypes = ["multiple-choice", "numeric", "text", "interactive-canvas"];
  it("all inputTypes are valid", () => {
    for (const q of DATASET) {
      expect(validInputTypes).toContain(q.inputType);
    }
  });

  const validNorms = ["exact", "trimmed-lowercase", "hex-lowercase", "numeric-rounded"];
  it("all normalizations are valid", () => {
    for (const q of DATASET) {
      expect(validNorms).toContain(q.normalization);
    }
  });

  it("numeric-rounded questions have decimalPlaces defined", () => {
    for (const q of DATASET) {
      if (q.normalization === "numeric-rounded") {
        expect(q.decimalPlaces, `${q.id}`).not.toBeNull();
        expect(q.decimalPlaces!).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("clientSeed questions have integer seeds", () => {
    for (const q of DATASET) {
      if (q.clientSeed != null) {
        expect(Number.isInteger(q.clientSeed), `${q.id}: non-integer seed`).toBe(true);
      }
    }
  });

  it("all tiers are valid (1, 2, or 3)", () => {
    for (const q of DATASET) {
      expect([1, 2, 3]).toContain(q.tier);
    }
  });

  it("multiple-choice questions have options and valid answer index", () => {
    for (const q of DATASET) {
      if (q.inputType === "multiple-choice") {
        expect(q.options, `${q.id}: MC missing options`).toBeTruthy();
        expect(q.options!.length, `${q.id}: MC needs >= 2 options`).toBeGreaterThanOrEqual(2);
        const idx = parseInt(q._verifiedAnswer);
        expect(idx, `${q.id}: answer not a valid index`).toBeGreaterThanOrEqual(0);
        expect(idx, `${q.id}: answer index out of range`).toBeLessThan(q.options!.length);
      }
    }
  });
});

// ── mulberry32 parity test ──────────────────────────────────────────────────

describe("mulberry32 parity", () => {
  const parity = parityData as Record<string, number[]>;

  for (const [seedStr, expectedValues] of Object.entries(parity)) {
    it(`seed ${seedStr} matches Python output`, () => {
      const rng = mulberry32(parseInt(seedStr));
      for (let i = 0; i < expectedValues.length; i++) {
        const tsVal = rng();
        const pyVal = expectedValues[i];
        // Must match to at least 15 decimal places
        expect(Math.abs(tsVal - pyVal)).toBeLessThan(1e-15);
      }
    });
  }
});

// ── Hash normalization tests ────────────────────────────────────────────────

describe("Hash normalization", () => {
  it("' 0.109109 ' with numeric-rounded/6 hashes same as '0.109109'", () => {
    const h1 = hashAnswer(" 0.109109 ", "numeric-rounded", 6);
    const h2 = hashAnswer("0.109109", "numeric-rounded", 6);
    expect(h1).toBe(h2);
  });

  it("'B9F9B96A' with hex-lowercase hashes same as 'b9f9b96a'", () => {
    const h1 = hashAnswer("B9F9B96A", "hex-lowercase");
    const h2 = hashAnswer("b9f9b96a", "hex-lowercase");
    expect(h1).toBe(h2);
  });

  it("exact normalization preserves case", () => {
    const h1 = hashAnswer("ABC", "exact");
    const h2 = hashAnswer("abc", "exact");
    expect(h1).not.toBe(h2);
  });

  it("trimmed-lowercase trims and lowercases", () => {
    const h1 = hashAnswer("  Hello World  ", "trimmed-lowercase");
    const h2 = hashAnswer("hello world", "trimmed-lowercase");
    expect(h1).toBe(h2);
  });
});
