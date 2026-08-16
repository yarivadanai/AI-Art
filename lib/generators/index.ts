import { SeededRNG } from "@/lib/engine/rng";
import type { Section } from "@/lib/types";
import { STATE_TRACKING_FAMILIES } from "./state-tracking";
import { SEQUENTIAL_DEPTH_FAMILIES } from "./sequential-depth";
import { STRUCTURAL_FAMILIES } from "./structural";
import { SIGNAL_DETECTION_FAMILIES } from "./signal-detection";
import { PROBABILISTIC_FAMILIES } from "./probabilistic";
import { clampD, type Difficulty, type GeneratedItem, type GeneratorFamily } from "./types";

export const ALL_FAMILIES: GeneratorFamily[] = [
  ...STRUCTURAL_FAMILIES,
  ...STATE_TRACKING_FAMILIES,
  ...SEQUENTIAL_DEPTH_FAMILIES,
  ...SIGNAL_DETECTION_FAMILIES,
  ...PROBABILISTIC_FAMILIES,
];

const BY_FAMILY = new Map(ALL_FAMILIES.map((f) => [f.family, f]));

export function familiesFor(section: Section): GeneratorFamily[] {
  return ALL_FAMILIES.filter((f) => f.section === section);
}

export function getFamily(family: string): GeneratorFamily | undefined {
  return BY_FAMILY.get(family);
}

/** Deterministic: the same (family, seed, d) always yields the same item. */
export function generateItem(family: string, seed: string, d: number): GeneratedItem {
  const f = BY_FAMILY.get(family);
  if (!f) throw new Error(`Unknown generator family: ${family}`);
  const rng = new SeededRNG(`${family}|${seed}|${d}`);
  return f.generate(rng, clampD(d) as Difficulty);
}
