#!/usr/bin/env python3
"""
Phase 0 bank repair (2026-08-16).

Applies targeted, auditable edits to lib/data/scca_master_dataset.json:

1. Removes eight T3 families whose answer cannot be derived from what is
   shown on screen (no renderer / no display, or a renderer that shows only a
   head+tail window that excludes the planted answer):
     affine_transform, kl_divergence, markov_100x100, bit_shift_matrix,
     variance_drift, taylor_series, deep_fsm, hash_anomaly
2. Fixes massive_lcg: the multiplier was 1664526 (even), which annihilates the
   seed mod 2^128 so all ten items shared one answer. Uses the Numerical
   Recipes multiplier 1664525 and recomputes X_1000000 for each seed.
3. Rewords hyperplane_projection T3 ("onto the plane with normal vector U",
   which is what the stored answers compute) and torus_geodesic (states the
   period). Answers unchanged.
4. Switches free-response subtypes whose every answer is a plain integer from
   normalization "exact" to "numeric-rounded" (decimalPlaces 0), so "42,201",
   "+5" or "5.0" grade correctly.

Hashes are NOT computed here. There is exactly one definition of the answer
hash (lib/engine/canonicalize.ts via lib/banks/shared.ts); this script edits
prompts/answers/normalization and then runs `npx tsx scripts/rehash_dataset.ts`.

Idempotent: re-running on repaired data is a no-op.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PATH = ROOT / "lib" / "data" / "scca_master_dataset.json"

REMOVE_SUBTYPES = {
    "affine_transform",
    "kl_divergence",
    "markov_100x100",
    "bit_shift_matrix",
    "variance_drift",
    "taylor_series",
    "deep_fsm",
    "hash_anomaly",
}

LCG_A_BAD = 1664526
LCG_A = 1664525
LCG_C = 1013904223
LCG_M = 1 << 128
LCG_STEPS = 1_000_000


def lcg_state(seed: int) -> str:
    # Closed form: X_n = A^n X_0 + C (A^n - 1)/(A - 1) mod M.
    # (A-1) is even so we cannot divide mod 2^128; iterate instead (1e6 steps is fast).
    x = seed
    for _ in range(LCG_STEPS):
        x = (LCG_A * x + LCG_C) % LCG_M
    return f"{x:032X}"


def main() -> None:
    data = json.load(open(PATH))
    before = len(data)

    kept = [q for q in data if q["subtype"] not in REMOVE_SUBTYPES]
    removed = before - len(kept)

    lcg_fixed = 0
    for q in kept:
        if q["subtype"] == "massive_lcg":
            m = re.search(r"Seed=(\d+)", q["prompt"])
            assert m, q["id"]
            seed = int(m.group(1))
            if f"A={LCG_A_BAD}" in q["prompt"]:
                q["prompt"] = q["prompt"].replace(f"A={LCG_A_BAD}", f"A={LCG_A}")
            ans = lcg_state(seed)
            if q["_verifiedAnswer"] != ans:
                q["_verifiedAnswer"] = ans
                lcg_fixed += 1
            assert q["normalization"] == "hex-lowercase"

    reworded = 0
    for q in kept:
        if q["subtype"] == "hyperplane_projection":
            new = q["prompt"].replace(
                "is projected orthogonally onto normal vector U.",
                "is projected orthogonally onto the hyperplane with normal vector U.",
            )
            if new != q["prompt"]:
                q["prompt"] = new
                reworded += 1
        if q["subtype"] == "torus_geodesic":
            new = re.sub(
                r"A point in a (\d+)-torus starts at origin",
                r"A point in a \1-torus (every coordinate is taken modulo 1) starts at the origin",
                q["prompt"],
            )
            if new != q["prompt"]:
                q["prompt"] = new
                reworded += 1

    lcg_answers = {q["_verifiedAnswer"] for q in kept if q["subtype"] == "massive_lcg"}
    assert len(lcg_answers) == 10, "massive_lcg answers must be distinct"

    # 4. Integer-valued free-response subtypes -> numeric-rounded (dp 0).
    by_subtype: dict[str, list[dict]] = {}
    for q in kept:
        by_subtype.setdefault(q["subtype"], []).append(q)
    int_re = re.compile(r"^-?\d+$")
    to_numeric = 0
    for subtype, qs in by_subtype.items():
        if any(q["inputType"] == "multiple-choice" for q in qs):
            continue
        if not all(q["normalization"] == "exact" and int_re.match(q["_verifiedAnswer"]) for q in qs):
            continue
        for q in qs:
            q["normalization"] = "numeric-rounded"
            q["decimalPlaces"] = 0
            to_numeric += 1

    json.dump(kept, open(PATH, "w"), indent=2, ensure_ascii=False)
    with open(PATH, "a") as f:
        f.write("\n")
    print(
        f"items: {before} -> {len(kept)} (removed {removed}); lcg answers fixed: {lcg_fixed}; "
        f"reworded: {reworded}; exact->numeric-rounded: {to_numeric}"
    )

    # Recompute every hash with the canonical TS definition.
    print("running scripts/rehash_dataset.ts ...")
    r = subprocess.run(["npx", "tsx", "scripts/rehash_dataset.ts"], cwd=ROOT)
    if r.returncode != 0:
        print("rehash failed; hashes may be stale", file=sys.stderr)
        sys.exit(r.returncode)


if __name__ == "__main__":
    main()
