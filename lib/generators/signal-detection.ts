import type { SeededRNG } from "@/lib/engine/rng";
import type { Difficulty, GeneratedItem, GeneratorFamily } from "./types";
import { HEX, gaussian, hexString, rows } from "./util";

/**
 * Signal detection: find the one thing that is different in data that carries
 * no meaning to help you find it. Difficulty scales the haystack.
 */

const PAL_LEN = 6;

function isPal(s: string): boolean {
  for (let i = 0; i < s.length >> 1; i++) if (s[i] !== s[s.length - 1 - i]) return false;
  return true;
}
function countPalindromes(s: string, len: number): number {
  let n = 0;
  for (let i = 0; i + len <= s.length; i++) if (isPal(s.slice(i, i + len))) n++;
  return n;
}

// ── palindrome search ──────────────────────────────────────────────────────

function palindromeSearch(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const N = 40 + 30 * d; // 70..280
  for (let attempt = 0; attempt < 200; attempt++) {
    let s = hexString(rng, N);
    // Also avoid accidental 5- and 6-palindromes anywhere, then plant one.
    if (countPalindromes(s, PAL_LEN) > 0 || countPalindromes(s, PAL_LEN - 1) > 0) continue;
    const start = rng.int(0, N - PAL_LEN);
    const half = hexString(rng, PAL_LEN / 2);
    const pal = half + half.split("").reverse().join("");
    s = s.slice(0, start) + pal + s.slice(start + PAL_LEN);
    // Planting can create a second palindrome at the seams; verify uniqueness.
    if (countPalindromes(s, PAL_LEN) !== 1) continue;
    return {
      prompt: `${N} hexadecimal characters are shown in rows of 40 (the number in brackets is the index of the first character of each row, 0-based). Exactly one run of ${PAL_LEN} consecutive characters reads the same forwards and backwards. Report the 0-based index at which it starts.`,
      display: rows(s, 40),
      inputType: "numeric",
      reference: String(start),
      grader: { kind: "numeric", decimalPlaces: 0 },
      timeLimit: 25 + 6 * d,
    };
  }
  throw new Error("palindromeSearch: could not build a unique item");
}

// ── drift block ────────────────────────────────────────────────────────────

function driftBlock(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const N = 16 + 12 * d; // 28..112
  const W = 4;
  for (let attempt = 0; attempt < 200; attempt++) {
    const xs: number[] = [];
    for (let i = 0; i < N; i++) xs.push(gaussian(rng));
    const start = rng.int(0, N - W);
    for (let i = start; i < start + W; i++) xs[i] += 2.5;
    const vals = xs.map((x) => Math.round(x * 100) / 100);
    // Uniqueness: the planted window must have the largest sum by a clear margin.
    let best = -Infinity;
    let second = -Infinity;
    let bestIdx = -1;
    for (let i = 0; i + W <= N; i++) {
      const s = vals.slice(i, i + W).reduce((a, b) => a + b, 0);
      if (s > best) {
        second = best;
        best = s;
        bestIdx = i;
      } else if (s > second) second = s;
    }
    if (bestIdx !== start || best - second < 2.0) continue;
    const lines: string[] = [];
    for (let i = 0; i < N; i += 8) {
      lines.push(
        `[${String(i).padStart(3)}] ` +
          vals
            .slice(i, i + 8)
            .map((v) => (v >= 0 ? "+" : "") + v.toFixed(2))
            .join("  ")
      );
    }
    return {
      prompt: `${N} values drawn from a standard normal distribution are shown in rows of 8 (bracketed number = index of the first value in the row, 0-based). One block of ${W} consecutive values has been shifted upward by about 2.5. Report the 0-based index at which the block starts.`,
      display: lines.join("\n"),
      inputType: "numeric",
      reference: String(start),
      grader: { kind: "numeric", decimalPlaces: 0 },
      timeLimit: 25 + 6 * d,
    };
  }
  throw new Error("driftBlock: could not build a unique item");
}

// ── duplicate stream ───────────────────────────────────────────────────────

function duplicateStream(rng: SeededRNG, d: Difficulty): GeneratedItem {
  const S = 6 + 4 * d; // 10..38
  const len = 4;
  const seen = new Set<string>();
  const strs: string[] = [];
  while (strs.length < S - 1) {
    const s = hexString(rng, len);
    if (seen.has(s)) continue;
    seen.add(s);
    strs.push(s);
  }
  // Duplicate one existing string and insert it at a random position.
  const dupIdx = rng.int(0, strs.length - 1);
  const dup = strs[dupIdx];
  const insertAt = rng.int(0, strs.length);
  strs.splice(insertAt, 0, dup);
  const ids = strs.map((s, i) => (s === dup ? i : -1)).filter((i) => i >= 0);
  const perRow = 4;
  const lines: string[] = [];
  for (let i = 0; i < S; i += perRow) {
    lines.push(
      strs
        .slice(i, i + perRow)
        .map((s, j) => `${String(i + j).padStart(2)}: ${s}`)
        .join("    ")
    );
  }
  return {
    prompt: `${S} ${len}-character hex strings are shown with their IDs. Exactly two are identical. Report their IDs as "ID1,ID2" (either order).`,
    display: lines.join("\n"),
    inputType: "text",
    reference: `${ids[0]},${ids[1]}`,
    grader: { kind: "set" },
    timeLimit: 25 + 6 * d,
  };
}

// Silence unused-import lint if HEX is not referenced directly.
void HEX;

export const SIGNAL_DETECTION_FAMILIES: GeneratorFamily[] = [
  {
    family: "gen_palindrome_search",
    section: "signal-detection",
    label: "palindrome search",
    method: "slide a 6-char window over the string, test each for symmetry",
    generate: palindromeSearch,
  },
  {
    family: "gen_drift_block",
    section: "signal-detection",
    label: "drift block",
    method: "sliding-window sum, take the argmax",
    generate: driftBlock,
  },
  {
    family: "gen_duplicate_stream",
    section: "signal-detection",
    label: "duplicate stream",
    method: "hash each string, report the first collision",
    generate: duplicateStream,
  },
];
