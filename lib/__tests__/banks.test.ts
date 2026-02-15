import { describe, it, expect } from "vitest";
import { RARE_WORDS, SPELLING_WORDS, ANALOGY_PAIRS } from "@/lib/banks/words";
import { GRAMMAR_ITEMS } from "@/lib/banks/grammar";
import { TRANSLATION_WORDS } from "@/lib/banks/translations";
import {
  SCIENCE_FACTS,
  GEOGRAPHY_FACTS,
  HISTORICAL_EVENTS,
  MATH_CONSTANTS,
} from "@/lib/banks/knowledge-facts";
import { FALLACIOUS_PROOFS } from "@/lib/banks/proofs";
import {
  BUG_TEMPLATES,
  RECURSIVE_TEMPLATES,
  ASSEMBLY_TEMPLATES,
  LONG_FUNCTION_TEMPLATES,
} from "@/lib/banks/code-templates";

// ─── Minimum counts (after dedup, ~4-5x originals) ──────────────────────────

describe("Bank minimum counts", () => {
  it("RARE_WORDS has at least 500 entries", () => {
    expect(RARE_WORDS.length).toBeGreaterThanOrEqual(500);
  });
  it("SPELLING_WORDS has at least 375 entries", () => {
    expect(SPELLING_WORDS.length).toBeGreaterThanOrEqual(375);
  });
  it("ANALOGY_PAIRS has at least 390 entries", () => {
    expect(ANALOGY_PAIRS.length).toBeGreaterThanOrEqual(390);
  });
  it("GRAMMAR_ITEMS has at least 780 entries", () => {
    expect(GRAMMAR_ITEMS.length).toBeGreaterThanOrEqual(780);
  });
  it("TRANSLATION_WORDS has at least 450 entries", () => {
    expect(TRANSLATION_WORDS.length).toBeGreaterThanOrEqual(450);
  });
  it("SCIENCE_FACTS has at least 515 entries", () => {
    expect(SCIENCE_FACTS.length).toBeGreaterThanOrEqual(515);
  });
  it("GEOGRAPHY_FACTS has at least 320 entries", () => {
    expect(GEOGRAPHY_FACTS.length).toBeGreaterThanOrEqual(320);
  });
  it("HISTORICAL_EVENTS has at least 575 entries", () => {
    expect(HISTORICAL_EVENTS.length).toBeGreaterThanOrEqual(575);
  });
  it("MATH_CONSTANTS has at least 135 entries", () => {
    expect(MATH_CONSTANTS.length).toBeGreaterThanOrEqual(135);
  });
  it("FALLACIOUS_PROOFS has at least 145 entries", () => {
    expect(FALLACIOUS_PROOFS.length).toBeGreaterThanOrEqual(145);
  });
  it("BUG_TEMPLATES has at least 75 entries", () => {
    expect(BUG_TEMPLATES.length).toBeGreaterThanOrEqual(75);
  });
  it("RECURSIVE_TEMPLATES has at least 50 entries", () => {
    expect(RECURSIVE_TEMPLATES.length).toBeGreaterThanOrEqual(50);
  });
  it("ASSEMBLY_TEMPLATES has at least 50 entries", () => {
    expect(ASSEMBLY_TEMPLATES.length).toBeGreaterThanOrEqual(50);
  });
  it("LONG_FUNCTION_TEMPLATES has at least 50 entries", () => {
    expect(LONG_FUNCTION_TEMPLATES.length).toBeGreaterThanOrEqual(50);
  });
});

// ─── Structural validation ───────────────────────────────────────────────────

describe("RARE_WORDS structural integrity", () => {
  it("has no duplicate words", () => {
    const words = RARE_WORDS.map((w) => w.word.toLowerCase());
    expect(new Set(words).size).toBe(words.length);
  });
  it("every entry has word, definition, and 3 distractors", () => {
    for (const w of RARE_WORDS) {
      expect(w.word).toBeTruthy();
      expect(w.definition).toBeTruthy();
      expect(w.distractors).toHaveLength(3);
      for (const d of w.distractors) {
        expect(d).toBeTruthy();
      }
    }
  });
  it("no distractor matches the correct definition", () => {
    for (const w of RARE_WORDS) {
      const defLower = w.definition.toLowerCase();
      for (const d of w.distractors) {
        expect(d.toLowerCase()).not.toBe(defLower);
      }
    }
  });
});

describe("SPELLING_WORDS structural integrity", () => {
  it("has no duplicate words", () => {
    const words = SPELLING_WORDS.map((w) => w.correct.toLowerCase());
    expect(new Set(words).size).toBe(words.length);
  });
  it("every entry has correct spelling and 3 misspellings", () => {
    for (const w of SPELLING_WORDS) {
      expect(w.correct).toBeTruthy();
      expect(w.misspellings).toHaveLength(3);
    }
  });
  it("no misspelling is the same as the correct spelling", () => {
    for (const w of SPELLING_WORDS) {
      for (const m of w.misspellings) {
        expect(m.toLowerCase()).not.toBe(w.correct.toLowerCase());
      }
    }
  });
});

describe("ANALOGY_PAIRS structural integrity", () => {
  it("every entry has a, b, c, answer, relationship, and 3 distractors", () => {
    for (const a of ANALOGY_PAIRS) {
      expect(a.a).toBeTruthy();
      expect(a.b).toBeTruthy();
      expect(a.c).toBeTruthy();
      expect(a.answer).toBeTruthy();
      expect(a.relationship).toBeTruthy();
      expect(a.distractors).toHaveLength(3);
    }
  });
  it("no distractor matches the correct answer", () => {
    for (const a of ANALOGY_PAIRS) {
      for (const d of a.distractors) {
        expect(d.toLowerCase()).not.toBe(a.answer.toLowerCase());
      }
    }
  });
});

describe("GRAMMAR_ITEMS structural integrity", () => {
  it("has no duplicate sentences", () => {
    const sents = GRAMMAR_ITEMS.map((g) => g.sentence.toLowerCase().trim());
    expect(new Set(sents).size).toBe(sents.length);
  });
  it("every entry has sentence, violation, and 3 distractors", () => {
    for (const g of GRAMMAR_ITEMS) {
      expect(g.sentence).toBeTruthy();
      expect(g.violation).toBeTruthy();
      expect(g.distractors).toHaveLength(3);
    }
  });
});

describe("TRANSLATION_WORDS structural integrity", () => {
  it("every entry has word, language, description, and 3 distractors", () => {
    for (const t of TRANSLATION_WORDS) {
      expect(t.word).toBeTruthy();
      expect(t.language).toBeTruthy();
      expect(t.correctDescription).toBeTruthy();
      expect(t.distractors).toHaveLength(3);
    }
  });
  it("no distractor matches the correct description", () => {
    for (const t of TRANSLATION_WORDS) {
      const descLower = t.correctDescription.toLowerCase();
      for (const d of t.distractors) {
        expect(d.toLowerCase()).not.toBe(descLower);
      }
    }
  });
});

describe("SCIENCE_FACTS structural integrity", () => {
  it("has no duplicate questions", () => {
    const qs = SCIENCE_FACTS.map((f) => f.question.toLowerCase().trim());
    expect(new Set(qs).size).toBe(qs.length);
  });
  it("every entry has question, correctAnswer, and 3 distractors", () => {
    for (const f of SCIENCE_FACTS) {
      expect(f.question).toBeTruthy();
      expect(f.correctAnswer).toBeTruthy();
      expect(f.distractors).toHaveLength(3);
    }
  });
  it("correct answer is not among distractors", () => {
    for (const f of SCIENCE_FACTS) {
      const correct = f.correctAnswer.toLowerCase();
      for (const d of f.distractors) {
        expect(d.toLowerCase()).not.toBe(correct);
      }
    }
  });
});

describe("GEOGRAPHY_FACTS structural integrity", () => {
  it("every entry has question, correctAnswer, and 3 distractors", () => {
    for (const f of GEOGRAPHY_FACTS) {
      expect(f.question).toBeTruthy();
      expect(f.correctAnswer).toBeTruthy();
      expect(f.distractors).toHaveLength(3);
    }
  });
});

describe("HISTORICAL_EVENTS structural integrity", () => {
  it("every entry has event and year", () => {
    for (const e of HISTORICAL_EVENTS) {
      expect(e.event).toBeTruthy();
      expect(typeof e.year).toBe("number");
    }
  });
  it("has no duplicate events", () => {
    const events = HISTORICAL_EVENTS.map((e) => e.event.toLowerCase().trim());
    expect(new Set(events).size).toBe(events.length);
  });
});

describe("MATH_CONSTANTS structural integrity", () => {
  it("every entry has name, symbol, and value with 15+ decimal places", () => {
    for (const c of MATH_CONSTANTS) {
      expect(c.name).toBeTruthy();
      expect(c.symbol).toBeTruthy();
      expect(c.value).toBeTruthy();
      const dotIdx = c.value.indexOf(".");
      if (dotIdx >= 0) {
        const decimals = c.value.length - dotIdx - 1;
        expect(decimals).toBeGreaterThanOrEqual(15);
      }
    }
  });
  it("has no duplicate constants", () => {
    const names = MATH_CONSTANTS.map((c) => c.name.toLowerCase().trim());
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("FALLACIOUS_PROOFS structural integrity", () => {
  it("every proof has claim, steps (6+), errorStep, and explanations", () => {
    for (const p of FALLACIOUS_PROOFS) {
      expect(p.title).toBeTruthy();
      expect(p.steps.length).toBeGreaterThanOrEqual(6);
      expect(p.errorStep).toBeGreaterThanOrEqual(0);
      expect(p.errorStep).toBeLessThan(p.steps.length);
      expect(p.errorExplanation).toBeTruthy();
      expect(p.distractorExplanations).toHaveLength(3);
    }
  });
});

describe("BUG_TEMPLATES structural integrity", () => {
  it("every template has code, bugLine, and 4 options", () => {
    for (const t of BUG_TEMPLATES) {
      expect(t.code).toBeTruthy();
      expect(t.bugLine).toBeGreaterThan(0);
      expect(t.options).toHaveLength(4);
      expect(t.correctOptionIndex).toBeGreaterThanOrEqual(0);
      expect(t.correctOptionIndex).toBeLessThan(4);
    }
  });
});

describe("ASSEMBLY_TEMPLATES structural integrity", () => {
  it("every template has code, expectedEax, and 4 options", () => {
    for (const t of ASSEMBLY_TEMPLATES) {
      expect(t.code).toBeTruthy();
      expect(typeof t.expectedEax).toBe("number");
      expect(t.options).toHaveLength(4);
      expect(t.correctOptionIndex).toBeGreaterThanOrEqual(0);
      expect(t.correctOptionIndex).toBeLessThan(4);
    }
  });
  it("expectedEax matches the option at correctOptionIndex", () => {
    for (const t of ASSEMBLY_TEMPLATES) {
      expect(t.options[t.correctOptionIndex]).toBe(t.expectedEax);
    }
  });
});

describe("LONG_FUNCTION_TEMPLATES structural integrity", () => {
  it("every template has code (30+ lines), input, expected output, and 4 options", () => {
    for (const t of LONG_FUNCTION_TEMPLATES) {
      expect(t.code).toBeTruthy();
      const lineCount = t.code.split("\n").length;
      expect(lineCount).toBeGreaterThanOrEqual(25);
      expect(t.expectedOutput).toBeTruthy();
      expect(t.options).toHaveLength(4);
      expect(t.correctOptionIndex).toBeGreaterThanOrEqual(0);
      expect(t.correctOptionIndex).toBeLessThan(4);
    }
  });
  it("expectedOutput matches the option at correctOptionIndex", () => {
    for (const t of LONG_FUNCTION_TEMPLATES) {
      expect(t.options[t.correctOptionIndex]).toBe(t.expectedOutput);
    }
  });
});

// ─── Correctness: Recursive templates ────────────────────────────────────────

describe("RECURSIVE_TEMPLATES correctness", () => {
  it("every template's expectedOutput matches actual execution", () => {
    for (let i = 0; i < RECURSIVE_TEMPLATES.length; i++) {
      const t = RECURSIVE_TEMPLATES[i];
      try {
        // Execute the code to define the function(s), then call f(inputN)
        const fn = new Function(t.code + `\nreturn f(${t.inputN});`);
        const result = fn();
        expect(result).toBe(t.expectedOutput);
      } catch (e) {
        // If execution fails, the template has a syntax or runtime error
        throw new Error(
          `RECURSIVE_TEMPLATES[${i}] (inputN=${t.inputN}): execution failed — ${e}`
        );
      }
    }
  });
});

// ─── Correctness: Long function templates ────────────────────────────────────

describe("LONG_FUNCTION_TEMPLATES correctness", () => {
  it("every template's expectedOutput matches actual execution", () => {
    for (let i = 0; i < LONG_FUNCTION_TEMPLATES.length; i++) {
      const t = LONG_FUNCTION_TEMPLATES[i];
      try {
        // Build a function call expression
        const fnName = t.code.match(/function\s+(\w+)/)?.[1];
        if (!fnName) throw new Error("Could not extract function name");
        const fn = new Function(
          t.code + `\nreturn ${fnName}(${t.inputValue});`
        );
        const raw = fn();
        const result = typeof raw === "string" ? raw : JSON.stringify(raw);
        expect(result).toBe(t.expectedOutput);
      } catch (e) {
        throw new Error(
          `LONG_FUNCTION_TEMPLATES[${i}]: execution failed — ${e}`
        );
      }
    }
  });
});
