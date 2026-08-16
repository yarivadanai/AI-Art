/**
 * Recompute every answerHash in lib/data/scca_master_dataset.json from its
 * _verifiedAnswer using the current canonicalize() rules.
 *
 * Run whenever lib/engine/canonicalize.ts changes:
 *   npx tsx scripts/rehash_dataset.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { hashAnswer } from "../lib/banks/shared";
import type { DatasetQuestion } from "../lib/banks/dataset";

const PATH = resolve(__dirname, "../lib/data/scca_master_dataset.json");
const data = JSON.parse(readFileSync(PATH, "utf8")) as DatasetQuestion[];

let changed = 0;
for (const q of data) {
  const h = hashAnswer(q._verifiedAnswer, q.normalization, q.decimalPlaces);
  if (h !== q.answerHash) {
    q.answerHash = h;
    changed++;
  }
}
writeFileSync(PATH, JSON.stringify(data, null, 2) + "\n");
console.log(`rehashed ${data.length} items, ${changed} changed`);
