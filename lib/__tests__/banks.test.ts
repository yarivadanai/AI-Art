import { describe, it, expect } from "vitest";
import { DATASET } from "@/lib/banks/dataset";
import type { DatasetQuestion } from "@/lib/banks/dataset";
import { hashAnswer } from "@/lib/banks/shared";
import { mulberry32 } from "@/lib/engine/rng";
import { SEED_RENDERER_TYPES } from "@/components/SeedDataDisplay";
import parityData from "@/lib/data/mulberry32_parity.json";

// ── Dataset integrity ───────────────────────────────────────────────────────

describe("Dataset integrity", () => {
  it("has exactly 525 questions", () => {
    expect(DATASET.length).toBe(525);
  });

  it("has correct question counts per section", () => {
    const expected: Record<string, number> = {
      structural: 80,
      "state-tracking": 155,
      "sequential-depth": 160,
      "signal-detection": 60,
      probabilistic: 70,
    };
    for (const [section, count] of Object.entries(expected)) {
      const actual = DATASET.filter((q) => q.section === section).length;
      expect(actual, `${section} should have ${count}`).toBe(count);
    }
  });

  it("has correct tier distribution per section", () => {
    const expected: Record<string, { t1: number; t2: number; t3: number }> = {
      structural: { t1: 25, t2: 15, t3: 40 },
      "state-tracking": { t1: 25, t2: 30, t3: 100 },
      "sequential-depth": { t1: 50, t2: 30, t3: 80 },
      "signal-detection": { t1: 25, t2: 15, t3: 20 },
      probabilistic: { t1: 25, t2: 15, t3: 30 },
    };
    for (const [section, tiers] of Object.entries(expected)) {
      const sectionQs = DATASET.filter((q) => q.section === section);
      const t1 = sectionQs.filter((q) => q.tier === 1).length;
      const t2 = sectionQs.filter((q) => q.tier === 2).length;
      const t3 = sectionQs.filter((q) => q.tier === 3).length;
      expect(t1, `${section} tier 1`).toBe(tiers.t1);
      expect(t2, `${section} tier 2`).toBe(tiers.t2);
      expect(t3, `${section} tier 3`).toBe(tiers.t3);
    }
  });

  it("has no duplicate IDs", () => {
    const ids = DATASET.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every section has enough items per tier for a test plan (2 T1, 1 T2, 2 T3)", () => {
    for (const section of ["structural", "state-tracking", "sequential-depth", "signal-detection", "probabilistic"]) {
      const s = DATASET.filter((q) => q.section === section);
      expect(s.filter((q) => q.tier === 1).length, `${section} T1`).toBeGreaterThanOrEqual(2);
      expect(s.filter((q) => q.tier === 2).length, `${section} T2`).toBeGreaterThanOrEqual(1);
      expect(s.filter((q) => q.tier === 3).length, `${section} T3`).toBeGreaterThanOrEqual(2);
    }
  });
});

// ── Answerability ───────────────────────────────────────────────────────────
// A question whose answer depends on generated data must actually show that
// data: either inline in the prompt/display, or via a client renderer keyed by
// subtype. Families removed in the 2026-08 repair violated this.

describe("Answerability", () => {
  const REMOVED_SUBTYPES = [
    "affine_transform",
    "kl_divergence",
    "markov_100x100",
    "bit_shift_matrix",
    "variance_drift",
    "taylor_series",
    "deep_fsm",
    "hash_anomaly",
  ];

  it("contains none of the removed no-data families", () => {
    for (const q of DATASET) {
      expect(REMOVED_SUBTYPES, `${q.id} (${q.subtype})`).not.toContain(q.subtype);
    }
  });

  it("every T3 item with a clientSeed has a client renderer for its subtype", () => {
    for (const q of DATASET) {
      if (q.tier === 3 && q.clientSeed != null) {
        expect(SEED_RENDERER_TYPES, `${q.id}: no renderer for ${q.subtype}`).toContain(q.subtype);
      }
    }
  });

  it("no prompt cites a seed as the only source of its data", () => {
    // "(Seed: 1234)" in a prompt with no display and no clientSeed means the
    // examinee is asked to compute from data that is never shown.
    for (const q of DATASET) {
      if (/\(Seed:\s*\d+\)/.test(q.prompt) && !q.display && q.clientSeed == null) {
        throw new Error(`${q.id}: prompt references a seed but shows no data`);
      }
    }
  });

  it("massive_lcg items have distinct answers", () => {
    const answers = DATASET.filter((q) => q.subtype === "massive_lcg").map((q) => q._verifiedAnswer);
    expect(answers.length).toBe(10);
    expect(new Set(answers).size).toBe(10);
  });
});

// ── T1 8-option MC ──────────────────────────────────────────────────────────

describe("T1 multiple-choice format", () => {
  const t1Items = DATASET.filter((q) => q.tier === 1);

  it("all T1 have inputType multiple-choice", () => {
    for (const q of t1Items) {
      expect(q.inputType, `${q.id}`).toBe("multiple-choice");
    }
  });

  it("all T1 have exactly 8 options", () => {
    for (const q of t1Items) {
      expect(q.options, `${q.id}: missing options`).toBeTruthy();
      expect(q.options!.length, `${q.id}: expected 8 options`).toBe(8);
    }
  });
});

// ── Time limits ─────────────────────────────────────────────────────────────

describe("Time limits", () => {
  it("all questions have valid timeLimit matching their tier", () => {
    const tierToTime: Record<number, number> = { 1: 30, 2: 30, 3: 45 };
    for (const q of DATASET) {
      const expected = tierToTime[q.tier];
      expect(q.timeLimit, `${q.id}: timeLimit`).toBe(expected);
    }
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
