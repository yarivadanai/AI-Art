import type { SeededRNG } from "@/lib/engine/rng";
import type { Difficulty, GeneratedItem, GeneratorFamily } from "./types";
import { fmt } from "./util";

/**
 * Structural insight: see the shape or die computing. Difficulty scales
 * dimension, depth of the pattern, and how much the closed form is worth.
 */

// ── projection onto a hyperplane ───────────────────────────────────────────

function projection(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const dim = 2 + d; // 3..10
  const v: number[] = [];
  const u: number[] = [];
  for (let i = 0; i < dim; i++) {
    v.push(rng.int(-5, 5));
    u.push(rng.int(-4, 4));
  }
  if (!u.some((x) => x !== 0)) u[0] = 1;
  const vu = v.reduce((s, x, i) => s + x * u[i], 0);
  const uu = u.reduce((s, x) => s + x * x, 0);
  const c = rng.int(0, dim - 1);
  const comp = v[c] - (vu / uu) * u[c];
  return {
    prompt: `In ${dim} dimensions, vector V is projected orthogonally onto the hyperplane whose normal is U (proj = V - (V.U / U.U) U). What is component ${c} (0-based) of the projection, to 3 decimal places?`,
    display: `V = [${v.join(", ")}]\nU = [${u.join(", ")}]`,
    inputType: "numeric",
    reference: fmt(comp, 3),
    grader: { kind: "numeric", decimalPlaces: 3, exact: comp },
    timeLimit: 30 + 5 * d,
  };
}

// ── Ackermann pattern ──────────────────────────────────────────────────────

function ackermann(m: number, n: number): number {
  // Closed forms; the prompt gives the recursive definition.
  if (m === 1) return n + 2;
  if (m === 2) return 2 * n + 3;
  return Math.pow(2, n + 3) - 3; // m === 3
}

function ackermannPattern(rng: SeededRNG, d: Difficulty): GeneratedItem {
  let m: number;
  let n: number;
  if (d <= 2) {
    m = 1; // A(1,n) = n + 2: one level of unrolling
    n = 4 + 3 * d + rng.int(0, 3); // 7..13
  } else if (d === 3) {
    m = 2; // A(2,n) = 2n + 3
    n = 6 + rng.int(0, 6); // 6..12
  } else {
    m = 3; // A(3,n) = 2^(n+3) - 3
    n = d - 1 + rng.int(0, 1); // d4:3-4 .. d8:7-8
  }
  const value = ackermann(m, n);
  return {
    prompt: `The Ackermann function is defined by A(0, n) = n + 1; A(m, 0) = A(m - 1, 1); A(m, n) = A(m - 1, A(m, n - 1)). Evaluate A(${m}, ${n}). Direct recursion is impractical here; the structure is not.`,
    inputType: "numeric",
    reference: String(value),
    grader: { kind: "numeric", decimalPlaces: 0 },
    timeLimit: 30 + 5 * d,
  };
}

// ── sequence rule ──────────────────────────────────────────────────────────

function sequenceRule(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const terms: number[] = [];
  let ruleClass: string;
  const shown = 6 + Math.min(2, Math.floor(d / 3));
  if (d <= 2) {
    // arithmetic or geometric
    if (rng.next() < 0.5) {
      const a = rng.int(-9, 9);
      const step = rng.int(2, 9) * (rng.next() < 0.5 ? 1 : -1);
      for (let i = 0; i <= shown; i++) terms.push(a + i * step);
      ruleClass = "each term is the previous term plus a fixed constant";
    } else {
      const a = rng.int(1, 5);
      const r = rng.int(2, 3);
      for (let i = 0; i <= shown; i++) terms.push(a * Math.pow(r, i));
      ruleClass = "each term is the previous term times a fixed constant";
    }
  } else if (d <= 4) {
    // quadratic: t(i) = a i^2 + b i + c
    const a = rng.int(1, 3);
    const b = rng.int(-5, 5);
    const c = rng.int(-9, 9);
    for (let i = 0; i <= shown; i++) terms.push(a * i * i + b * i + c);
    ruleClass = "the differences between consecutive terms themselves increase by a fixed constant";
  } else if (d <= 6) {
    // second-order linear recurrence t(n) = p t(n-1) + q t(n-2)
    const p = rng.int(1, 2);
    const q = rng.pick([1, -1, 2]);
    terms.push(rng.int(1, 4), rng.int(1, 6));
    for (let i = 2; i <= shown; i++) terms.push(p * terms[i - 1] + q * terms[i - 2]);
    ruleClass = "each term is a fixed combination p*previous + q*the one before that, with small integers p and q";
  } else {
    // interleaved: odd positions arithmetic, even positions geometric-ish
    const a = rng.int(1, 9);
    const step = rng.int(2, 7);
    const g = rng.int(1, 3);
    const r = 2;
    for (let i = 0; i <= shown; i++) {
      terms.push(i % 2 === 0 ? a + (i / 2) * step : g * Math.pow(r, (i - 1) / 2));
    }
    ruleClass = "two independent rules interleaved: one for the odd positions, one for the even positions";
  }
  const next = terms[shown];
  return {
    prompt: `The first ${shown} terms of a sequence are shown. The rule is of this kind: ${ruleClass}. What is the next term?`,
    display: terms.slice(0, shown).join(", ") + ", ?",
    inputType: "numeric",
    reference: String(next),
    grader: { kind: "numeric", decimalPlaces: 0 },
    timeLimit: 30 + 5 * d,
  };
}

export const STRUCTURAL_FAMILIES: GeneratorFamily[] = [
  {
    family: "gen_projection",
    section: "structural",
    label: "hyperplane projection",
    method: "v - (v.u / u.u) u, one dot product and a subtraction",
    generate: projection,
  },
  {
    family: "gen_ackermann",
    section: "structural",
    label: "Ackermann pattern",
    method: "closed forms A(1,n) = n + 2, A(2,n) = 2n + 3, A(3,n) = 2^(n+3) - 3, or memoised recursion",
    generate: ackermannPattern,
  },
  {
    family: "gen_sequence_rule",
    section: "structural",
    label: "sequence rule",
    method: "fit the stated rule class to the shown terms and extend it",
    generate: sequenceRule,
  },
];
