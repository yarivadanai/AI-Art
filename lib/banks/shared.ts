import { createHash } from "crypto";
import type { Normalization } from "@/lib/types";

export function hashAnswer(answer: string, normalization: Normalization, decimalPlaces?: number | null): string {
  let normalized: string;
  const trimmed = answer.trim();
  switch (normalization) {
    case "exact":
      normalized = trimmed;
      break;
    case "trimmed-lowercase":
      normalized = trimmed.toLowerCase();
      break;
    case "hex-lowercase":
      normalized = trimmed.toLowerCase().replace(/^0x/, "");
      break;
    case "numeric-rounded": {
      const n = parseFloat(trimmed);
      normalized = isNaN(n) ? trimmed : n.toFixed(decimalPlaces ?? 0);
      break;
    }
    default:
      normalized = trimmed;
  }
  return createHash("sha256").update(normalized, "utf8").digest("hex");
}
