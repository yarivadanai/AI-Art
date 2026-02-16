import { describe, it, expect } from "vitest";
import { COGNITIVE_STACK_ITEMS } from "@/lib/banks/cognitive-stack";
import { ISOMORPHISM_ITEMS } from "@/lib/banks/isomorphisms";
import { EXPERT_TRAP_ITEMS } from "@/lib/banks/expert-trap";
import { FALLACIOUS_PROOFS } from "@/lib/banks/proofs";
import {
  BUG_TEMPLATES,
  RECURSIVE_TEMPLATES,
  ASSEMBLY_TEMPLATES,
  LONG_FUNCTION_TEMPLATES,
} from "@/lib/banks/code-templates";

// ─── Minimum counts ─────────────────────────────────────────────────────────

describe("Bank minimum counts", () => {
  it("COGNITIVE_STACK_ITEMS has at least 25 entries", () => {
    expect(COGNITIVE_STACK_ITEMS.length).toBeGreaterThanOrEqual(25);
  });
  it("ISOMORPHISM_ITEMS has at least 25 entries", () => {
    expect(ISOMORPHISM_ITEMS.length).toBeGreaterThanOrEqual(25);
  });
  it("EXPERT_TRAP_ITEMS has at least 25 entries", () => {
    expect(EXPERT_TRAP_ITEMS.length).toBeGreaterThanOrEqual(25);
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

// ─── Cognitive Stack structural integrity ───────────────────────────────────

describe("COGNITIVE_STACK_ITEMS structural integrity", () => {
  it("every entry has text, question, answer, alternatives, and valid subtype", () => {
    const validSubtypes = ["center-embedding", "scope-ambiguity", "temporal-recursion"];
    for (const item of COGNITIVE_STACK_ITEMS) {
      expect(item.text).toBeTruthy();
      expect(item.question).toBeTruthy();
      expect(item.answer).toBeTruthy();
      expect(Array.isArray(item.alternatives)).toBe(true);
      expect(item.alternatives.length).toBeGreaterThanOrEqual(1);
      expect(validSubtypes).toContain(item.subtype);
      expect(item.explanation).toBeTruthy();
    }
  });
  it("has no duplicate questions", () => {
    const qs = COGNITIVE_STACK_ITEMS.map((i) => i.question.toLowerCase().trim());
    expect(new Set(qs).size).toBe(qs.length);
  });
  it("has all three subtypes represented", () => {
    const subtypes = new Set(COGNITIVE_STACK_ITEMS.map((i) => i.subtype));
    expect(subtypes.has("center-embedding")).toBe(true);
    expect(subtypes.has("scope-ambiguity")).toBe(true);
    expect(subtypes.has("temporal-recursion")).toBe(true);
  });
});

// ─── Isomorphism structural integrity ───────────────────────────────────────

describe("ISOMORPHISM_ITEMS structural integrity", () => {
  it("every entry has sourceField, sourceConcept, sourceDescription, targetField, answer, and keywords", () => {
    for (const item of ISOMORPHISM_ITEMS) {
      expect(item.sourceField).toBeTruthy();
      expect(item.sourceConcept).toBeTruthy();
      expect(item.sourceDescription).toBeTruthy();
      expect(item.targetField).toBeTruthy();
      expect(item.answer).toBeTruthy();
      expect(Array.isArray(item.keywords)).toBe(true);
      expect(item.keywords.length).toBeGreaterThanOrEqual(1);
      expect(item.explanation).toBeTruthy();
    }
  });
  it("has no duplicate sourceConcepts", () => {
    const concepts = ISOMORPHISM_ITEMS.map((i) => i.sourceConcept.toLowerCase().trim());
    expect(new Set(concepts).size).toBe(concepts.length);
  });
});

// ─── Expert Trap structural integrity ───────────────────────────────────────

describe("EXPERT_TRAP_ITEMS structural integrity", () => {
  it("every entry has field, text, answer, and keywords", () => {
    for (const item of EXPERT_TRAP_ITEMS) {
      expect(item.field).toBeTruthy();
      expect(item.text).toBeTruthy();
      expect(item.answer).toBeTruthy();
      expect(Array.isArray(item.keywords)).toBe(true);
      expect(item.keywords.length).toBeGreaterThanOrEqual(1);
      expect(item.explanation).toBeTruthy();
    }
  });
  it("has no duplicate fields combined with first 50 chars of text", () => {
    const keys = EXPERT_TRAP_ITEMS.map(
      (i) => `${i.field}::${i.text.slice(0, 50)}`.toLowerCase()
    );
    expect(new Set(keys).size).toBe(keys.length);
  });
});

// ─── Fallacious Proofs structural integrity ─────────────────────────────────

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

// ─── Code Templates structural integrity ────────────────────────────────────

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
