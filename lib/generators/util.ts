import type { SeededRNG } from "@/lib/engine/rng";

export const HEX = "0123456789abcdef";

export function hexString(rng: SeededRNG, len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) s += HEX[rng.int(0, 15)];
  return s;
}

export function toHex(n: number, digits: number): string {
  return (n >>> 0).toString(16).toUpperCase().padStart(digits, "0");
}

/** Standard normal via Box-Muller from two uniforms. */
export function gaussian(rng: SeededRNG): number {
  const u1 = Math.max(rng.next(), 1e-12);
  const u2 = rng.next();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function fmt(n: number, dp: number): string {
  const s = n.toFixed(dp);
  return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s;
}

/** Lay out a long string in labelled rows of `width` characters (index at row start). */
export function rows(s: string, width: number, pad = 4): string {
  const out: string[] = [];
  for (let i = 0; i < s.length; i += width) {
    out.push(`[${String(i).padStart(pad)}] ${s.slice(i, i + width)}`);
  }
  return out.join("\n");
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
