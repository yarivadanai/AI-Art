import type { Section } from "./types";
import { getFamily } from "./generators";

/**
 * How a plain program solves each question family, and roughly how long it
 * takes. Shown on the report next to the specimen's own time. Order-of-
 * magnitude honesty only: "microseconds" means a few thousand primitive
 * operations at most; "milliseconds" up to ~10^8; "under a second" beyond.
 */
export type TimeClass = "microseconds" | "milliseconds" | "under a second";

export interface ReferenceNote {
  method: string;
  time: TimeClass;
}

const BY_SUBTYPE: Record<string, ReferenceNote> = {
  // T1 curated reasoning (lookup / evaluation)
  isomorphism: { method: "table lookup over the mapping the item was built from", time: "microseconds" },
  "cognitive-stack": { method: "a recursive-descent parser binds each verb to its subject on one pass", time: "microseconds" },
  "proof-error": { method: "step-by-step checker evaluates each inference rule against the previous lines", time: "microseconds" },
  "assembly-trace": { method: "a 5-instruction interpreter loop over the register file", time: "microseconds" },
  "grammar-violation": { method: "constituency parse plus agreement rules", time: "milliseconds" },
  "expert-trap": { method: "keyword match against the field's canonical misconception list", time: "microseconds" },

  // Structure
  hyperplane_projection_small: { method: "v - (v.u / u.u) u, one dot product and a subtraction", time: "microseconds" },
  hyperplane_projection: { method: "v - (v.u / u.u) u over 10 components", time: "microseconds" },
  n_ball_volume_small: { method: "pi^(n/2) r^n / Gamma(n/2 + 1)", time: "microseconds" },
  n_ball_volume: { method: "pi^(n/2) r^n / Gamma(n/2 + 1)", time: "microseconds" },
  simplex_centroid_small: { method: "average the vertices, take the requested coordinate", time: "microseconds" },
  simplex_centroid: { method: "average the vertices, take the requested coordinate", time: "microseconds" },
  torus_geodesic: { method: "first t with (v_a - v_b) t an integer: 1 / |v_a - v_b|", time: "microseconds" },

  // State tracking
  "cipher-chain-small": { method: "apply each substitution in order to each character", time: "microseconds" },
  "hex-xor-match-small": { method: "XOR every pair, compare to the target: O(n^2) over 30 strings", time: "microseconds" },
  "ledger-running-balance-small": { method: "single pass keeping a running total", time: "microseconds" },
  "logic-circuit-small": { method: "evaluate the gate graph once (two gates are dead)", time: "microseconds" },
  particle_small: { method: "compare velocity vectors pairwise", time: "microseconds" },
  trajectory_small: { method: "nearest-neighbour walk with a visited set", time: "microseconds" },
  frequency_phase: { method: "evaluate the sine sum on a grid, take the argmax", time: "under a second" },
  hex_stream_sync: { method: "hash the 8-char window at position 0 for each of 1,000 streams, find the collision", time: "milliseconds" },
  ledger_anomaly: { method: "one pass over 500 rows checking each delta mod 7", time: "microseconds" },
  n_back_desync: { method: "two ring buffers, one comparison per step", time: "microseconds" },
  n_body_collision: { method: "hash-bucket positions per timestep, report the first shared bucket", time: "milliseconds" },
  prime_matrix_async: { method: "sieve to 10^5, then scan the grid for the pattern", time: "milliseconds" },
  quad_logic_inversion: { method: "apply the gate list to a 10-bit vector, count set bits", time: "microseconds" },
  "register-machine-sim": { method: "interpret the program: a loop over the instruction list", time: "microseconds" },
  trajectory_spline: { method: "nearest-neighbour walk with a visited set", time: "microseconds" },
  "vigenere-decrypt": { method: "subtract the key modulo 26, character by character", time: "microseconds" },

  // Sequential depth
  aes_small: { method: "rotate row r left by r bytes", time: "microseconds" },
  aes_state_matrix: { method: "rotate row r left by r bytes", time: "microseconds" },
  array_shift_small: { method: "apply the shifts, index the array", time: "microseconds" },
  bit_shift_small: { method: "three shift instructions", time: "microseconds" },
  "discrete-log-small": { method: "try exponents until the residue matches (or baby-step giant-step)", time: "microseconds" },
  "recurrence-modular-small": { method: "iterate the recurrence modulo m", time: "microseconds" },
  recursive_trace_small: { method: "run the function", time: "microseconds" },
  "xor-chain-small": { method: "fold XOR over the list", time: "microseconds" },
  bounded_ackermann: { method: "A(3, n) = 2^(n+3) - 3, or memoised recursion", time: "microseconds" },
  deep_array_shift: { method: "sieve to n, apply the shifts, index", time: "milliseconds" },
  massive_lcg: { method: "10^6 multiply-adds modulo 2^128 (or exponentiate the affine map)", time: "milliseconds" },
  matrix_recurrence: { method: "iterate the recurrence modulo m for 10^5 steps", time: "milliseconds" },
  power_tower: { method: "modular exponentiation with the exponent reduced by Euler's theorem", time: "microseconds" },
  sha256_mental: { method: "Ch(e,f,g) = (e AND f) XOR (NOT e AND g) on eight nibbles", time: "microseconds" },
  xor_1024bit: { method: "XOR two 1024-bit integers", time: "microseconds" },

  // Signal detection
  hash_prefix_small: { method: "SHA-256 each candidate, test the prefix", time: "microseconds" },
  hex_palindrome_small: { method: "slide an 8-char window over 200 chars, test each for symmetry", time: "microseconds" },
  variance_drift_small: { method: "sliding-window mean over 100 values", time: "microseconds" },
  bitwise_palindrome: { method: "slide a window over 50,000 chars", time: "milliseconds" },
  lsb_steganography: { method: "read the least significant bit of each of 10^6 pixels, find the triple", time: "milliseconds" },

  // Probabilistic
  conditional_small: { method: "P(A|C) = P(A and C) / P(C) from the table", time: "microseconds" },
  dag_posterior_small: { method: "enumerate the joint over the network, normalise", time: "microseconds" },
  dag_posterior: { method: "enumerate the joint over the network, normalise", time: "microseconds" },
  markov_small: { method: "solve pi P = pi, sum(pi) = 1 (a 2x2 or 3x3 linear system)", time: "microseconds" },
  gmm_update: { method: "one E-step and one M-step over 1,000 points", time: "milliseconds" },
  hmm_viterbi: { method: "Viterbi: 500 steps x states^2 max-products", time: "milliseconds" },
};

const BY_SECTION: Record<Section, ReferenceNote> = {
  structural: { method: "a linear algebra library", time: "microseconds" },
  "state-tracking": { method: "a loop with a hash map", time: "milliseconds" },
  "sequential-depth": { method: "an interpreter loop", time: "microseconds" },
  "signal-detection": { method: "a sliding-window scan", time: "milliseconds" },
  probabilistic: { method: "exact enumeration", time: "microseconds" },
};

export function referenceNote(subtype: string, section: Section): ReferenceNote {
  if (subtype.startsWith("gen_")) {
    const fam = getFamily(subtype);
    if (fam) return { method: fam.method, time: "microseconds" };
  }
  return BY_SUBTYPE[subtype] ?? BY_SECTION[section];
}

/** Rough upper bound in ms for a time class, for the "N times slower" line. Deliberately conservative. */
export function timeClassCeilingMs(t: TimeClass): number {
  switch (t) {
    case "microseconds":
      return 1; // treat as at most 1 ms
    case "milliseconds":
      return 100;
    case "under a second":
      return 1000;
  }
}

/** Human-readable duration for a specimen response time. */
export function formatSeconds(ms: number): string {
  if (ms < 1000) return `${(ms / 1000).toFixed(1)} s`;
  return `${(ms / 1000).toFixed(1)} s`;
}
