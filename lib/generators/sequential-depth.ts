import type { SeededRNG } from "@/lib/engine/rng";
import type { Difficulty, GeneratedItem, GeneratorFamily } from "./types";
import { toHex } from "./util";

/**
 * Exact computation: many small exact steps where one slip is total.
 * Difficulty scales width and step count.
 */

// ── XOR chain ──────────────────────────────────────────────────────────────

function xorChain(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const nibbles = 2 + Math.floor(d / 2); // 2..6
  const count = 2 + Math.ceil(d / 2); // 3..6
  const max = Math.pow(16, nibbles) - 1;
  const words: number[] = [];
  for (let i = 0; i < count; i++) words.push(rng.int(0, max));
  const result = words.reduce((a, b) => a ^ b, 0) >>> 0;
  return {
    prompt: `Compute the bitwise XOR of the ${count} hexadecimal values below. Answer as a ${nibbles}-digit hex string.`,
    display: words.map((w, i) => `${String.fromCharCode(65 + i)} = ${toHex(w, nibbles)}`).join("\n"),
    inputType: "text",
    reference: toHex(result, nibbles),
    grader: { kind: "hex" },
    timeLimit: 20 + 5 * d,
  };
}

// ── modular recurrence ────────────────────────────────────────────────────

const MODULI = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

function modularRecurrence(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const m = d <= 3 ? rng.pick(MODULI.slice(0, 6)) : rng.pick(MODULI);
  const p = rng.int(2, 7);
  const q = rng.int(1, 9);
  const a0 = rng.int(1, 9);
  const k = 2 + d;
  let a = a0;
  for (let i = 0; i < k; i++) a = (p * a + q) % m;
  return {
    prompt: `A sequence is defined by a(0) = ${a0} and a(n+1) = (${p} * a(n) + ${q}) mod ${m}. What is a(${k})?`,
    inputType: "numeric",
    reference: String(a),
    grader: { kind: "numeric", decimalPlaces: 0 },
    timeLimit: 20 + 5 * d,
  };
}

// ── bit operations ─────────────────────────────────────────────────────────

function bitOps(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const width = d <= 4 ? 8 : 16;
  const digits = width / 4;
  const mask = width === 8 ? 0xff : 0xffff;
  const k = 1 + Math.ceil(d / 2); // 2..5
  // Retry until the final value is non-zero and no two consecutive ANDs
  // (which collapse the problem).
  for (let attempt = 0; attempt < 50; attempt++) {
    const r = bitOpsOnce(rng, width, digits, mask, k);
    if (r) return r;
  }
  throw new Error("bitOps: could not build a non-degenerate item");
}

function bitOpsOnce(rng: SeededRNG, width: number, digits: number, mask: number, k: number): GeneratedItem | null {
  let v = rng.int(1, mask);
  const start = v;
  const lines: string[] = [];
  let lastOp = "";
  for (let i = 0; i < k; i++) {
    let op = rng.pick(["SHL", "SHR", "ROL", "XOR", "AND"] as const);
    if (op === "AND" && lastOp === "AND") op = "XOR";
    lastOp = op;
    if (op === "SHL") {
      const s = rng.int(1, 3);
      lines.push(`SHL ${s}   (shift left by ${s} bits, keep the low ${width} bits)`);
      v = (v << s) & mask;
    } else if (op === "SHR") {
      const s = rng.int(1, 3);
      lines.push(`SHR ${s}   (shift right by ${s} bits)`);
      v = v >>> s;
    } else if (op === "ROL") {
      const s = rng.int(1, 3);
      lines.push(`ROL ${s}   (rotate left by ${s} bits within ${width} bits)`);
      v = ((v << s) | (v >>> (width - s))) & mask;
    } else if (op === "XOR") {
      const m2 = rng.int(1, mask);
      lines.push(`XOR ${toHex(m2, digits)}`);
      v = (v ^ m2) & mask;
    } else {
      const m2 = rng.int(1, mask);
      lines.push(`AND ${toHex(m2, digits)}`);
      v = v & m2;
    }
  }
  if (v === 0) return null;
  return {
    prompt: `Start with the ${width}-bit value 0x${toHex(start, digits)}. Apply the ${k} operations below in order and report the final value as ${digits} hex digits.`,
    display: lines.map((l, i) => `${i + 1}. ${l}`).join("\n"),
    inputType: "text",
    reference: toHex(v, digits),
    grader: { kind: "hex" },
    timeLimit: 20 + 5 * (k - 1) * 2,
  };
}

export const SEQUENTIAL_DEPTH_FAMILIES: GeneratorFamily[] = [
  {
    family: "gen_xor_chain",
    section: "sequential-depth",
    label: "XOR chain",
    method: "fold XOR over the list",
    generate: xorChain,
  },
  {
    family: "gen_modular_recurrence",
    section: "sequential-depth",
    label: "modular recurrence",
    method: "iterate the recurrence k times modulo m",
    generate: modularRecurrence,
  },
  {
    family: "gen_bit_ops",
    section: "sequential-depth",
    label: "bit operations",
    method: "apply each shift/rotate/mask to an integer",
    generate: bitOps,
  },
];
