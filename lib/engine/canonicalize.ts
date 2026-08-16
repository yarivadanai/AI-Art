import type { Normalization } from "@/lib/types";

/**
 * Canonical form of an answer string for a given normalization mode.
 *
 * This is the single definition used both when hashing the reference answer
 * (lib/banks/shared.ts) and when grading a submission (lib/engine/grader.ts),
 * so the two can never drift. It is deliberately forgiving about presentation
 * (case, whitespace, thousands separators, 0x prefixes) and strict about
 * content: two answers that differ in any digit or symbol stay different.
 *
 * Pure: no crypto, no Node APIs, safe to import from client code.
 */
export function canonicalize(raw: string, normalization: Normalization, decimalPlaces?: number | null): string {
  const s = String(raw ?? "").trim();
  switch (normalization) {
    case "exact":
      // Structured tokens: MC indices, integers, "224,378,893", "0-3-6-1-2",
      // "TX_000145", 20-char N/A/V/B strings. Case-fold to upper (no bank
      // answer relies on lowercase), drop whitespace around separators and
      // collapse any remaining internal runs of whitespace to one space.
      return s
        .toUpperCase()
        .replace(/\s*([,;:\-_/])\s*/g, "$1")
        .replace(/\s+/g, " ");

    case "trimmed-lowercase":
      return s.toLowerCase().replace(/\s+/g, " ");

    case "hex-lowercase":
      // Hex strings, optionally comma-separated ("0350fd,05baff"). Accept
      // 0x prefixes and grouped digits ("ED 41 8D C0", "ed:41:8d:c0").
      return s
        .toLowerCase()
        .split(",")
        .map((part) => part.trim().replace(/^0x/, "").replace(/[\s:]/g, ""))
        .join(",");

    case "numeric-rounded": {
      const n = parseNumber(s);
      if (n === null) return s;
      const dp = decimalPlaces ?? 0;
      const fixed = n.toFixed(dp);
      // Normalize negative zero ("-0.000000" -> "0.000000").
      return /^-0(\.0+)?$/.test(fixed) ? fixed.slice(1) : fixed;
    }

    default:
      return s;
  }
}

/**
 * Parse a human-typed number. Accepts thousands separators ("584,368,244.06712",
 * "584 368 244.06712", "1_000"), a decimal comma when unambiguous ("0,047210"),
 * unicode minus, and a leading "+". Returns null if the string is not a number.
 */
export function parseNumber(raw: string): number | null {
  let s = raw.trim().replace(/[−‒–]/g, "-").replace(/^\+/, "");
  if (s === "") return null;
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) {
    // 1,234,567.89 -> thousands commas
    s = s.replace(/,/g, "");
  } else if (/^-?\d+,\d+$/.test(s)) {
    // 0,047210 -> decimal comma (single comma, no dot)
    s = s.replace(",", ".");
  }
  s = s.replace(/[\s_]/g, "");
  if (!/^-?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
