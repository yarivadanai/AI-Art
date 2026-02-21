#!/usr/bin/env python3
"""
SCCA Dataset Generator v2
Restructures 7 sections -> 5 sections, generates 8-option MC for all T1,
reassigns sections for T2/T3, drops untranslatable-word T1 items.
Output: 605 questions total.
"""

import json
import hashlib
import random
import os
import sys
from pathlib import Path
from collections import Counter

# ── Paths ────────────────────────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent.parent
BANKS_PATH = Path("/tmp/scca-recovery/extracted_banks.json")
T2_PATH = ROOT / "lib" / "data" / "tier2_questions.json"
MASTER_PATH = ROOT / "lib" / "data" / "scca_master_dataset.json"
OUTPUT_PATH = MASTER_PATH  # Overwrite

# ── Section mapping ──────────────────────────────────────────────────────────

SECTION_MAP = {
    "topology": "structural",
    "parallel-state": "state-tracking",
    "attentional": "state-tracking",
    "recursive-exec": "sequential-depth",
    "crypto-bitwise": "sequential-depth",
    "micro-pattern": "signal-detection",
    "bayesian": "probabilistic",
}

NEW_SECTIONS = ["structural", "state-tracking", "sequential-depth", "signal-detection", "probabilistic"]

# Time limits by tier
TIME_LIMITS = {1: 15, 2: 20, 3: 95}

# ── Hashing ──────────────────────────────────────────────────────────────────

def normalize_answer(answer: str, normalization: str, decimal_places: int | None = None) -> str:
    if normalization == "exact":
        return answer
    elif normalization == "trimmed-lowercase":
        return answer.strip().lower()
    elif normalization == "hex-lowercase":
        return answer.strip().lower()
    elif normalization == "numeric-rounded":
        val = float(answer.strip())
        if decimal_places is not None:
            return f"{val:.{decimal_places}f}"
        return str(val)
    return answer

def hash_answer(answer: str, normalization: str, decimal_places: int | None = None) -> str:
    normalized = normalize_answer(answer, normalization, decimal_places)
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

# ── ID generation ────────────────────────────────────────────────────────────

_id_counter = 0
def make_id(section: str, tier: int, subtype: str) -> str:
    global _id_counter
    _id_counter += 1
    return f"{section}-t{tier}-{subtype}-{_id_counter:04d}"

# ── Load raw banks ───────────────────────────────────────────────────────────

def load_banks():
    with open(BANKS_PATH) as f:
        return json.load(f)

def load_existing_t2():
    with open(T2_PATH) as f:
        return json.load(f)

def load_existing_master():
    with open(MASTER_PATH) as f:
        return json.load(f)

# ── T1 generators ────────────────────────────────────────────────────────────

def build_isomorphism_t1(banks) -> list[dict]:
    """structural section: 25 isomorphism items with 8-option MC.
    Draw 7 distractors from other items' answer fields."""
    items = banks["isomorphisms"]
    all_answers = [item["answer"] for item in items]
    questions = []

    for i, item in enumerate(items[:25]):
        correct = item["answer"]
        # Get 7 distractors from other items with different target fields
        candidates = [a for j, a in enumerate(all_answers) if j != i and a != correct]
        random.shuffle(candidates)
        distractors = candidates[:7]

        options = distractors + [correct]
        random.shuffle(options)
        correct_idx = options.index(correct)

        prompt = (
            f"An analogy is drawn from {item['sourceField']}: \"{item['sourceConcept']}\" -- "
            f"{item['sourceDescription']}\n\n"
            f"Which of the following best describes the structural isomorphism in {item['targetField']}?"
        )

        questions.append({
            "id": make_id("structural", 1, "isomorphism"),
            "section": "structural",
            "subtype": "isomorphism",
            "tier": 1,
            "prompt": prompt,
            "display": None,
            "inputType": "multiple-choice",
            "options": options,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(str(correct_idx), "exact"),
            "normalization": "exact",
            "decimalPlaces": None,
            "timeLimit": 15,
            "_verifiedAnswer": str(correct_idx),
        })

    return questions


def build_cognitive_stack_t1(banks) -> list[dict]:
    """state-tracking section: 25 cognitive-stack items converted to 8-option MC.
    Cross-pollinate answers within same subtype."""
    items = banks["cognitiveStack"]
    by_subtype: dict[str, list] = {}
    for item in items:
        st = item.get("subtype", "unknown")
        by_subtype.setdefault(st, []).append(item)

    questions = []
    used = 0
    # Pick items proportionally from subtypes
    subtype_counts = {"center-embedding": 10, "scope-ambiguity": 8, "temporal-recursion": 7}
    for subtype, count in subtype_counts.items():
        pool = by_subtype.get(subtype, [])
        if len(pool) < count:
            count = len(pool)
        for i in range(count):
            if used >= 25:
                break
            item = pool[i]
            correct = item["answer"]

            # Gather alternatives from the item itself
            item_alts = item.get("alternatives", [])
            # Cross-pollinate: get answers from other items in the same subtype
            cross_answers = [p["answer"] for j, p in enumerate(pool) if j != i and p["answer"] != correct]
            # Also get alternatives from other items
            cross_alts = []
            for j, p in enumerate(pool):
                if j != i:
                    cross_alts.extend(p.get("alternatives", []))

            all_distractors = list(set(item_alts + cross_answers + cross_alts) - {correct})
            random.shuffle(all_distractors)
            distractors = all_distractors[:7]

            # If not enough, pad with variations
            while len(distractors) < 7:
                distractors.append(f"[Alternative reading {len(distractors)+1}]")

            options = distractors + [correct]
            random.shuffle(options)
            correct_idx = options.index(correct)

            prompt = f"{item['text']}\n\n{item['question']}"

            questions.append({
                "id": make_id("state-tracking", 1, "cognitive-stack"),
                "section": "state-tracking",
                "subtype": "cognitive-stack",
                "tier": 1,
                "prompt": prompt,
                "display": None,
                "inputType": "multiple-choice",
                "options": options,
                "clientSeed": None,
                "interactiveConfig": None,
                "answerHash": hash_answer(str(correct_idx), "exact"),
                "normalization": "exact",
                "decimalPlaces": None,
                "timeLimit": 15,
                "_verifiedAnswer": str(correct_idx),
            })
            used += 1

    return questions[:25]


def build_proof_error_t1(banks) -> list[dict]:
    """sequential-depth section: 25 proof-error items with 8-option MC.
    3 pre-authored distractors + 4 cross-pollinated from distractorExplanations pool."""
    all_proofs = banks["proofsBase"] + banks["proofsExt1"]
    # Build master distractor pool
    master_pool = []
    for p in all_proofs:
        master_pool.extend(p.get("distractorExplanations", []))

    questions = []
    for i, item in enumerate(all_proofs[:25]):
        correct = item["errorExplanation"]
        own_distractors = item.get("distractorExplanations", [])[:3]

        # Cross-pollinate from other items
        cross = [d for j, p in enumerate(all_proofs) for d in p.get("distractorExplanations", [])
                 if j != i and d != correct and d not in own_distractors]
        random.shuffle(cross)
        cross_distractors = cross[:max(0, 7 - len(own_distractors))]

        distractors = own_distractors + cross_distractors
        distractors = distractors[:7]
        while len(distractors) < 7:
            distractors.append(f"No error exists; the proof is valid as written (variant {len(distractors)})")

        steps_text = "\n".join(f"Step {j+1}: {s}" for j, s in enumerate(item["steps"]))
        prompt = f"Proof: \"{item['title']}\"\n\n{steps_text}\n\nIdentify the error in this proof."

        options = distractors + [correct]
        random.shuffle(options)
        correct_idx = options.index(correct)

        questions.append({
            "id": make_id("sequential-depth", 1, "proof-error"),
            "section": "sequential-depth",
            "subtype": "proof-error",
            "tier": 1,
            "prompt": prompt,
            "display": None,
            "inputType": "multiple-choice",
            "options": options,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(str(correct_idx), "exact"),
            "normalization": "exact",
            "decimalPlaces": None,
            "timeLimit": 15,
            "_verifiedAnswer": str(correct_idx),
        })

    return questions


def build_assembly_trace_t1(banks) -> list[dict]:
    """sequential-depth section: 25 assembly-trace items with 8-option MC.
    4 existing options + 4 generated numeric perturbations."""
    items = banks["assemblyExt"]
    questions = []

    for i, item in enumerate(items[:25]):
        correct_val = item["expectedEax"]
        existing_opts = item["options"]  # 4 options
        correct_option_idx = item["correctOptionIndex"]

        # Generate 4 numeric perturbations
        perturbations = set()
        for delta in [-2, -1, 1, 2]:
            perturbations.add(correct_val + delta)
        for delta in [correct_val >> 1, correct_val << 1, correct_val ^ 0xFF]:
            perturbations.add(delta)
        # Also intermediate values
        perturbations.add(correct_val * 2)
        perturbations.add(correct_val - 3)

        # Remove the correct value and existing options
        existing_set = set(existing_opts)
        perturbations -= existing_set
        perturbations -= {correct_val}
        perturbation_list = sorted(perturbations)[:4]

        # Build 8 options: existing 4 + 4 perturbations
        all_opts = [str(o) for o in existing_opts] + [str(p) for p in perturbation_list]
        correct_str = str(correct_val)

        # Ensure correct answer is in options
        if correct_str not in all_opts:
            all_opts[-1] = correct_str

        # Ensure exactly 8
        while len(all_opts) < 8:
            all_opts.append(str(correct_val + len(all_opts) + 10))
        all_opts = all_opts[:8]

        random.shuffle(all_opts)
        correct_idx = all_opts.index(correct_str)

        prompt = f"What is the value of EAX after executing this x86 assembly?\n\n{item['code']}"

        questions.append({
            "id": make_id("sequential-depth", 1, "assembly-trace"),
            "section": "sequential-depth",
            "subtype": "assembly-trace",
            "tier": 1,
            "prompt": prompt,
            "display": None,
            "inputType": "multiple-choice",
            "options": all_opts,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(str(correct_idx), "exact"),
            "normalization": "exact",
            "decimalPlaces": None,
            "timeLimit": 15,
            "_verifiedAnswer": str(correct_idx),
        })

    return questions


def build_grammar_violation_t1(banks) -> list[dict]:
    """signal-detection section: 25 grammar-violation items with 8-option MC.
    3 pre-authored distractors + 4 cross-pollinated from master pool."""
    all_grammar = banks["grammarBase"] + banks["grammarExt1"]
    # Build master distractor pool
    master_pool = set()
    for g in all_grammar:
        master_pool.update(g.get("distractors", []))
        master_pool.add(g["violation"])

    questions = []
    for i, item in enumerate(all_grammar[:25]):
        correct = item["violation"]
        own_distractors = item.get("distractors", [])[:3]

        # Cross-pollinate
        cross = list(master_pool - {correct} - set(own_distractors))
        random.shuffle(cross)
        cross_distractors = cross[:max(0, 7 - len(own_distractors))]

        distractors = own_distractors + cross_distractors
        distractors = distractors[:7]
        while len(distractors) < 7:
            distractors.append(f"No grammatical error present (variant {len(distractors)})")

        prompt = f"Identify the grammatical violation in the following sentence:\n\n\"{item['sentence']}\""

        options = distractors + [correct]
        random.shuffle(options)
        correct_idx = options.index(correct)

        questions.append({
            "id": make_id("signal-detection", 1, "grammar-violation"),
            "section": "signal-detection",
            "subtype": "grammar-violation",
            "tier": 1,
            "prompt": prompt,
            "display": None,
            "inputType": "multiple-choice",
            "options": options,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(str(correct_idx), "exact"),
            "normalization": "exact",
            "decimalPlaces": None,
            "timeLimit": 15,
            "_verifiedAnswer": str(correct_idx),
        })

    return questions


def build_expert_trap_t1(banks) -> list[dict]:
    """probabilistic section: 25 expert-trap items with 8-option MC.
    Draw 7 answers from other expert-trap items in different fields."""
    items = banks["expertTrap"]
    all_answers = [(item["field"], item["answer"]) for item in items]

    questions = []
    for i, item in enumerate(items[:25]):
        correct = item["answer"]
        my_field = item["field"]

        # Get distractors from items in different fields
        candidates = [a for j, (f, a) in enumerate(all_answers) if j != i and a != correct]
        random.shuffle(candidates)
        distractors = candidates[:7]

        prompt = (
            f"[{item['field']}]\n\n"
            f"{item['text']}\n\n"
            f"Which response best identifies the error or misconception?"
        )

        options = distractors + [correct]
        random.shuffle(options)
        correct_idx = options.index(correct)

        questions.append({
            "id": make_id("probabilistic", 1, "expert-trap"),
            "section": "probabilistic",
            "subtype": "expert-trap",
            "tier": 1,
            "prompt": prompt,
            "display": None,
            "inputType": "multiple-choice",
            "options": options,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(str(correct_idx), "exact"),
            "normalization": "exact",
            "decimalPlaces": None,
            "timeLimit": 15,
            "_verifiedAnswer": str(correct_idx),
        })

    return questions

# ── Main build ───────────────────────────────────────────────────────────────

def build_dataset():
    random.seed(42)  # Reproducible

    banks = load_banks()
    existing_t2 = load_existing_t2()
    existing_master = load_existing_master()

    # ── Step 1: Generate all T1 ──────────────────────────────────────────
    t1_questions = []
    t1_questions.extend(build_isomorphism_t1(banks))         # 25 structural
    t1_questions.extend(build_cognitive_stack_t1(banks))      # 25 state-tracking
    t1_questions.extend(build_proof_error_t1(banks))          # 25 sequential-depth
    t1_questions.extend(build_assembly_trace_t1(banks))       # 25 sequential-depth
    t1_questions.extend(build_grammar_violation_t1(banks))    # 25 signal-detection
    t1_questions.extend(build_expert_trap_t1(banks))          # 25 probabilistic

    print(f"T1 generated: {len(t1_questions)}")

    # ── Step 2: Reassign T2 from existing file ───────────────────────────
    t2_questions = []
    for q in existing_t2:
        old_section = q["section"]
        new_section = SECTION_MAP.get(old_section)
        if new_section is None:
            print(f"  WARNING: T2 unknown section '{old_section}', skipping")
            continue
        # Drop attentional T2 items? No -- plan says attentional -> state-tracking for T2/T3
        q_new = dict(q)
        q_new["section"] = new_section
        q_new["timeLimit"] = TIME_LIMITS[q_new["tier"]]
        t2_questions.append(q_new)

    print(f"T2 reassigned: {len(t2_questions)}")

    # ── Step 3: Reassign T3 from existing master ─────────────────────────
    t3_questions = []
    for q in existing_master:
        if q["tier"] != 3:
            continue
        old_section = q["section"]
        new_section = SECTION_MAP.get(old_section)
        if new_section is None:
            print(f"  WARNING: T3 unknown section '{old_section}', skipping")
            continue
        q_new = dict(q)
        q_new["section"] = new_section
        q_new["timeLimit"] = TIME_LIMITS[3]
        t3_questions.append(q_new)

    print(f"T3 reassigned: {len(t3_questions)}")

    # ── Step 4: Combine and validate ─────────────────────────────────────
    all_questions = t1_questions + t2_questions + t3_questions

    # Re-ID T2 and T3 to avoid collisions (keep original IDs for now, check uniqueness)
    existing_ids = set()
    for q in all_questions:
        if q["id"] in existing_ids:
            # Generate a new unique ID
            q["id"] = make_id(q["section"], q["tier"], q.get("subtype", "q"))
        existing_ids.add(q["id"])

    # ── Validation ───────────────────────────────────────────────────────
    print(f"\n=== Validation ===")
    total = len(all_questions)
    print(f"Total: {total} (expected 605)")
    assert total == 605, f"Expected 605, got {total}"

    # Unique IDs
    ids = [q["id"] for q in all_questions]
    assert len(set(ids)) == len(ids), f"Duplicate IDs found! {len(ids)} total, {len(set(ids))} unique"
    print("Unique IDs: PASS")

    # Section counts
    section_counts = Counter(q["section"] for q in all_questions)
    expected_counts = {
        "structural": 90,
        "state-tracking": 155,
        "sequential-depth": 180,
        "signal-detection": 90,
        "probabilistic": 90,
    }
    for sec, expected in expected_counts.items():
        actual = section_counts.get(sec, 0)
        print(f"  {sec}: {actual} (expected {expected})")
        assert actual == expected, f"{sec}: expected {expected}, got {actual}"
    print("Section counts: PASS")

    # Tier counts per section
    for sec in NEW_SECTIONS:
        sec_qs = [q for q in all_questions if q["section"] == sec]
        tier_counts = Counter(q["tier"] for q in sec_qs)
        print(f"  {sec} tiers: T1={tier_counts[1]}, T2={tier_counts[2]}, T3={tier_counts[3]}")

    # All T1 have 8-option MC
    t1_items = [q for q in all_questions if q["tier"] == 1]
    for q in t1_items:
        assert q["inputType"] == "multiple-choice", f"{q['id']}: T1 not MC"
        assert q["options"] is not None and len(q["options"]) == 8, f"{q['id']}: T1 has {len(q.get('options', []))} options, expected 8"
    print("All T1 = 8-option MC: PASS")

    # All questions have valid timeLimit
    for q in all_questions:
        expected_time = TIME_LIMITS[q["tier"]]
        assert q.get("timeLimit") == expected_time, f"{q['id']}: timeLimit {q.get('timeLimit')} != expected {expected_time}"
    print("All timeLimits valid: PASS")

    # Hash roundtrip
    for q in all_questions:
        computed = hash_answer(q["_verifiedAnswer"], q["normalization"], q.get("decimalPlaces"))
        assert computed == q["answerHash"], f"{q['id']}: hash mismatch"
    print("Hash roundtrip: PASS")

    # ── Output ───────────────────────────────────────────────────────────
    # Sort by section order, then tier, then id for deterministic output
    section_order = {s: i for i, s in enumerate(NEW_SECTIONS)}
    all_questions.sort(key=lambda q: (section_order.get(q["section"], 99), q["tier"], q["id"]))

    with open(OUTPUT_PATH, "w") as f:
        json.dump(all_questions, f, indent=2, ensure_ascii=False)

    print(f"\nWrote {len(all_questions)} questions to {OUTPUT_PATH}")


if __name__ == "__main__":
    build_dataset()
