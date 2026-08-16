import type { SeededRNG } from "@/lib/engine/rng";
import type { Difficulty, GeneratedItem, GeneratorFamily } from "./types";
import { fmt } from "./util";

/**
 * Probabilistic inference: exact numbers where intuition offers only a
 * feeling. Difficulty scales table size, evidence count, and state count.
 */

// ── conditional probability from a joint table ─────────────────────────────

function conditionalTable(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const rowsN = d <= 5 ? 2 : 3;
  const colsN = d <= 3 ? 2 : 3;
  const counts: number[][] = [];
  for (let i = 0; i < rowsN; i++) {
    counts.push([]);
    for (let j = 0; j < colsN; j++) counts[i].push(rng.int(3, 40));
  }
  const i = rng.int(0, rowsN - 1);
  const j = rng.int(0, colsN - 1);
  const colTotal = counts.reduce((s, r) => s + r[j], 0);
  const p = counts[i][j] / colTotal;
  const rowLabels = ["A1", "A2", "A3"].slice(0, rowsN);
  const colLabels = ["B1", "B2", "B3"].slice(0, colsN);
  const header = "      " + colLabels.map((c) => c.padStart(5)).join(" ");
  const body = counts.map((r, ri) => `${rowLabels[ri].padEnd(5)} ` + r.map((c) => String(c).padStart(5)).join(" ")).join("\n");
  return {
    prompt: `The table gives joint counts of two attributes, A (rows) and B (columns), over a population. What is P(A = ${rowLabels[i]} | B = ${colLabels[j]}), to 3 decimal places?`,
    display: `${header}\n${body}`,
    inputType: "numeric",
    reference: fmt(p, 3),
    grader: { kind: "numeric", decimalPlaces: 3 },
    timeLimit: 30 + 5 * d,
  };
}

// ── Bayesian update chain ──────────────────────────────────────────────────

function bayesChain(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const tests = d <= 2 ? 1 : d <= 5 ? 2 : 3;
  const prior = rng.int(2, 30) / 100;
  let pH = prior;
  const lines: string[] = [];
  for (let t = 0; t < tests; t++) {
    const sens = rng.int(70, 98) / 100; // P(+ | H)
    const spec = rng.int(70, 98) / 100; // P(- | not H)
    const positive = t === 0 ? true : rng.next() < 0.6;
    const pPosH = positive ? sens : 1 - sens;
    const pPosNotH = positive ? 1 - spec : spec;
    const num = pPosH * pH;
    const den = num + pPosNotH * (1 - pH);
    pH = num / den;
    lines.push(
      `Test ${t + 1}: sensitivity P(positive | condition) = ${sens.toFixed(2)}, specificity P(negative | no condition) = ${spec.toFixed(2)}. Result: ${positive ? "POSITIVE" : "NEGATIVE"}.`
    );
  }
  return {
    prompt: `A condition has prior probability ${prior.toFixed(2)}. ${tests === 1 ? "One test is" : `${tests} conditionally independent tests are`} applied, with the results below. What is the posterior probability of the condition after ${tests === 1 ? "the test" : "all tests"}, to 3 decimal places?`,
    display: lines.join("\n"),
    inputType: "numeric",
    reference: fmt(pH, 3),
    grader: { kind: "numeric", decimalPlaces: 3 },
    timeLimit: 35 + 5 * d,
  };
}

// ── Markov steady state ────────────────────────────────────────────────────

function markovSteady(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const n = d <= 4 ? 2 : 3;
  // Build a row-stochastic matrix with two-decimal entries, all > 0 (ergodic).
  const P: number[][] = [];
  for (let i = 0; i < n; i++) {
    const cuts: number[] = [];
    let remaining = 100;
    const row: number[] = [];
    for (let j = 0; j < n - 1; j++) {
      const v = rng.int(5, remaining - 5 * (n - 1 - j));
      row.push(v);
      remaining -= v;
    }
    row.push(remaining);
    void cuts;
    P.push(row.map((x) => x / 100));
  }
  // Power iteration to convergence.
  let pi = Array(n).fill(1 / n);
  for (let it = 0; it < 5000; it++) {
    const next = Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) next[j] += pi[i] * P[i][j];
    let delta = 0;
    for (let j = 0; j < n; j++) delta += Math.abs(next[j] - pi[j]);
    pi = next;
    if (delta < 1e-13) break;
  }
  const state = rng.int(0, n - 1);
  const labels = ["S0", "S1", "S2"].slice(0, n);
  const header = "      " + labels.map((c) => c.padStart(6)).join(" ");
  const body = P.map((r, i) => `${labels[i].padEnd(5)} ` + r.map((c) => c.toFixed(2).padStart(6)).join(" ")).join("\n");
  return {
    prompt: `A Markov chain over ${n} states has the transition matrix below (row = from, column = to). In the long run, what fraction of time does the chain spend in ${labels[state]}? Answer to 3 decimal places.`,
    display: `${header}\n${body}`,
    inputType: "numeric",
    reference: fmt(pi[state], 3),
    grader: { kind: "numeric", decimalPlaces: 3 },
    timeLimit: 35 + 5 * d,
  };
}

export const PROBABILISTIC_FAMILIES: GeneratorFamily[] = [
  {
    family: "gen_conditional_table",
    section: "probabilistic",
    label: "conditional probability",
    method: "P(A|B) = count(A and B) / count(B) from the table",
    generate: conditionalTable,
  },
  {
    family: "gen_bayes_chain",
    section: "probabilistic",
    label: "Bayesian update",
    method: "multiply prior odds by each likelihood ratio, convert back",
    generate: bayesChain,
  },
  {
    family: "gen_markov_steady",
    section: "probabilistic",
    label: "Markov steady state",
    method: "solve pi P = pi with sum(pi) = 1 (a small linear system)",
    generate: markovSteady,
  },
];
