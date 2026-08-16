import type { SeededRNG } from "@/lib/engine/rng";
import type { Difficulty, GeneratedItem, GeneratorFamily } from "./types";

/**
 * Working memory: hold several things at once for longer than attention is
 * built to hold them. Difficulty scales the number of things and the span.
 */

// ── n-back ─────────────────────────────────────────────────────────────────

function nBack(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const n = d <= 2 ? 1 : d <= 5 ? 2 : 3;
  const L = 8 + 2 * d;
  const alphabet = d <= 4 ? "ABCD" : "ABCDEF";
  const stream: string[] = [];
  for (let i = 0; i < L; i++) stream.push(alphabet[rng.int(0, alphabet.length - 1)]);
  // Plant matches so the answer is never all-N: at least ceil(L/6) matches.
  const want = Math.max(2, Math.ceil(L / 6));
  const positions = rng.pickN(
    Array.from({ length: L - n }, (_, i) => i + n),
    want
  );
  for (const p of positions) stream[p] = stream[p - n];
  const answer = stream
    .slice(n)
    .map((ch, i) => (ch === stream[i] ? "M" : "N"))
    .join("");
  const shown = stream.map((ch, i) => `${String(i + 1).padStart(2)}:${ch}`).join("  ");
  return {
    prompt: `A stream of ${L} letters is shown with its step numbers. Starting at step ${n + 1}, decide for each step whether the letter matches the one exactly ${n} step${n === 1 ? "" : "s"} back. Answer with one letter per step, M for match and N for no match, in order (${L - n} letters).`,
    display: shown,
    inputType: "text",
    reference: answer,
    grader: { kind: "sequence" },
    timeLimit: 25 + 4 * d,
  };
}

// ── register machine trace ─────────────────────────────────────────────────

function registerTrace(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const nReg = d <= 4 ? 3 : 4;
  const k = 2 + d;
  const regs = Array.from({ length: nReg }, () => rng.int(1, 9));
  const lines: string[] = [];
  const cur = [...regs];
  for (let i = 0; i < k; i++) {
    const op = rng.pick(["ADD", "ADD", "SUB", "MOV", "SWAP", "DBL"] as const);
    const x = rng.int(0, nReg - 1);
    let y = rng.int(0, nReg - 1);
    if (y === x) y = (y + 1) % nReg;
    if (op === "ADD") {
      lines.push(`ADD  R${x}, R${y}    ; R${x} = R${x} + R${y}`);
      cur[x] = cur[x] + cur[y];
    } else if (op === "SUB") {
      // keep values non-negative and small
      if (cur[x] >= cur[y]) {
        lines.push(`SUB  R${x}, R${y}    ; R${x} = R${x} - R${y}`);
        cur[x] = cur[x] - cur[y];
      } else {
        lines.push(`SUB  R${y}, R${x}    ; R${y} = R${y} - R${x}`);
        cur[y] = cur[y] - cur[x];
      }
    } else if (op === "MOV") {
      const imm = rng.int(1, 9);
      lines.push(`MOV  R${x}, ${imm}     ; R${x} = ${imm}`);
      cur[x] = imm;
    } else if (op === "SWAP") {
      lines.push(`SWAP R${x}, R${y}    ; exchange R${x} and R${y}`);
      [cur[x], cur[y]] = [cur[y], cur[x]];
    } else {
      lines.push(`DBL  R${x}         ; R${x} = 2 * R${x}`);
      cur[x] = cur[x] * 2;
    }
    // Keep numbers within mental range.
    for (let r = 0; r < nReg; r++) if (cur[r] > 999) cur[r] = cur[r] % 100;
  }
  // If any wrap happened, the trace is not faithful; state the rule explicitly.
  const wrapNote = "If a register would exceed 999 it is replaced by its value modulo 100.";
  const init = regs.map((v, i) => `R${i}=${v}`).join(", ");
  return {
    prompt: `A ${nReg}-register machine starts with ${init}. Execute the ${k} instructions below in order and report the final values as "R0,R1,R2${nReg === 4 ? ",R3" : ""}" (comma-separated). ${wrapNote}`,
    display: lines.map((l, i) => `${String(i + 1).padStart(2)}. ${l}`).join("\n"),
    inputType: "text",
    reference: cur.join(","),
    grader: { kind: "sequence", separator: "," },
    timeLimit: 25 + 5 * d,
  };
}

// ── cipher chain ───────────────────────────────────────────────────────────

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function cipherChain(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const len = 4 + Math.floor(d / 3);
  let word = "";
  for (let i = 0; i < len; i++) word += LETTERS[rng.int(0, 25)];
  const steps = 1 + Math.ceil(d / 2);
  const desc: string[] = [];
  let cur = word;
  for (let s = 0; s < steps; s++) {
    const kind = rng.pick(["shift", "shift", "reverse", "swap"] as const);
    if (kind === "shift") {
      const by = rng.int(1, 12);
      desc.push(`Shift every letter forward by ${by} in the alphabet (Z wraps to A).`);
      cur = cur
        .split("")
        .map((c) => LETTERS[(LETTERS.indexOf(c) + by) % 26])
        .join("");
    } else if (kind === "reverse") {
      desc.push("Reverse the whole string.");
      cur = cur.split("").reverse().join("");
    } else {
      const i = rng.int(1, len);
      let j = rng.int(1, len);
      if (j === i) j = (j % len) + 1;
      desc.push(`Swap the letters at positions ${i} and ${j} (1-based).`);
      const arr = cur.split("");
      [arr[i - 1], arr[j - 1]] = [arr[j - 1], arr[i - 1]];
      cur = arr.join("");
    }
  }
  return {
    prompt: `Start with the string ${word}. Apply the ${steps} operation${steps === 1 ? "" : "s"} below in order and report the resulting string.`,
    display: desc.map((t, i) => `${i + 1}. ${t}`).join("\n"),
    inputType: "text",
    reference: cur,
    grader: { kind: "exact" },
    timeLimit: 20 + 4 * d,
  };
}

export const STATE_TRACKING_FAMILIES: GeneratorFamily[] = [
  {
    family: "gen_n_back",
    section: "state-tracking",
    label: "n-back",
    method: "one ring buffer of n letters, one comparison per step",
    generate: nBack,
  },
  {
    family: "gen_register_trace",
    section: "state-tracking",
    label: "register trace",
    method: "interpret the instruction list over an integer array",
    generate: registerTrace,
  },
  {
    family: "gen_cipher_chain",
    section: "state-tracking",
    label: "cipher chain",
    method: "apply each transformation to each character in order",
    generate: cipherChain,
  },
];
