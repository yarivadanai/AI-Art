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
    # Identity mappings for re-runs on already-mapped data
    "structural": "structural",
    "state-tracking": "state-tracking",
    "sequential-depth": "sequential-depth",
    "signal-detection": "signal-detection",
    "probabilistic": "probabilistic",
}

NEW_SECTIONS = ["structural", "state-tracking", "sequential-depth", "signal-detection", "probabilistic"]

# Time limits by tier
TIME_LIMITS = {1: 30, 2: 30, 3: 45}

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
            "timeLimit": TIME_LIMITS[1],
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
                "timeLimit": TIME_LIMITS[1],
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
            "timeLimit": TIME_LIMITS[1],
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
            "timeLimit": TIME_LIMITS[1],
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
            "timeLimit": TIME_LIMITS[1],
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
            "timeLimit": TIME_LIMITS[1],
            "_verifiedAnswer": str(correct_idx),
        })

    return questions

# ── mulberry32 PRNG (matches lib/engine/rng.ts) ──────────────────────────────

def _i32(x):
    """Truncate to signed 32-bit integer (JS |0)."""
    x = x & 0xFFFFFFFF
    return x - 0x100000000 if x >= 0x80000000 else x

def _u32(x):
    """Truncate to unsigned 32-bit integer (JS >>> 0)."""
    return x & 0xFFFFFFFF

def _imul(a, b):
    """Emulate Math.imul: 32-bit signed multiplication."""
    return _i32((_u32(a) * _u32(b)) & 0xFFFFFFFF)

def mulberry32(seed):
    """Port of the JS mulberry32 PRNG. Returns a callable yielding floats in [0,1)."""
    state = [_i32(seed)]
    def rng():
        state[0] = _i32(state[0] + 0x6D2B79F5)
        s = state[0]
        t = _imul(s ^ (_u32(s) >> 15), 1 | s)
        t = _i32(t + _imul(t ^ (_u32(t) >> 7), 61 | t)) ^ t
        return _u32(t ^ (_u32(t) >> 14)) / 4294967296
    return rng

def mb_randint(rng, lo, hi):
    """Random int in [lo, hi) using mulberry32 rng."""
    return lo + int(rng() * (hi - lo))

# ── T3 hardened generators ───────────────────────────────────────────────────

def generate_register_machine_sim() -> list[dict]:
    """T3 state-tracking: 10 register-machine simulation questions (seeds 5000-5009)."""
    questions = []
    for i in range(10):
        rng = mulberry32(5000 + i)

        regs = [mb_randint(rng, 0, 256) for _ in range(4)]
        initial_regs = regs[:]

        opcodes = ['ADD', 'SUB', 'XOR', 'SHL', 'CMP']
        instructions = []
        for _ in range(20):
            op = opcodes[mb_randint(rng, 0, 5)]
            dst = mb_randint(rng, 0, 4)
            if op == 'CMP':
                src = mb_randint(rng, 0, 4)
                instructions.append((op, dst, src, None))
            elif op == 'SHL':
                k = mb_randint(rng, 1, 4)
                instructions.append((op, dst, None, k))
            else:
                src = mb_randint(rng, 0, 4)
                instructions.append((op, dst, src, None))

        sim_regs = initial_regs[:]
        pc = 0
        while pc < len(instructions):
            op, dst, src, imm = instructions[pc]
            if op == 'ADD':
                sim_regs[dst] = (sim_regs[dst] + sim_regs[src]) % 256
            elif op == 'SUB':
                sim_regs[dst] = (sim_regs[dst] - sim_regs[src]) % 256
            elif op == 'XOR':
                sim_regs[dst] = sim_regs[dst] ^ sim_regs[src]
            elif op == 'SHL':
                sim_regs[dst] = (sim_regs[dst] << imm) & 0xFF
            elif op == 'CMP':
                if sim_regs[dst] > sim_regs[src]:
                    pc += 1  # Skip next instruction
            pc += 1

        answer = ",".join(str(r) for r in sim_regs)

        reg_init = ", ".join(f"R{j}={initial_regs[j]}" for j in range(4))
        instr_lines = []
        for idx, (op, dst, src, imm) in enumerate(instructions):
            if op == 'CMP':
                instr_lines.append(f"{idx:2d}: CMP R{dst}, R{src}")
            elif op == 'SHL':
                instr_lines.append(f"{idx:2d}: SHL R{dst}, {imm}")
            else:
                instr_lines.append(f"{idx:2d}: {op} R{dst}, R{src}")

        prompt = (
            f"A 4-register machine (R0-R3, 8-bit unsigned mod 256) executes the following program.\n"
            f"Initial state: {reg_init}\n\n"
            f"Instructions:\n" + "\n".join(instr_lines) + "\n\n"
            f"Opcodes: ADD Rd,Rs sets Rd=(Rd+Rs) mod 256. SUB Rd,Rs sets Rd=(Rd-Rs) mod 256. "
            f"XOR Rd,Rs sets Rd=Rd XOR Rs. SHL Rd,k sets Rd=(Rd << k) mod 256. "
            f"CMP Ra,Rb skips the next instruction if Ra > Rb.\n\n"
            f"Report the final register values as: R0,R1,R2,R3"
        )

        questions.append({
            "id": make_id("state-tracking", 3, "register-machine-sim"),
            "section": "state-tracking",
            "subtype": "register-machine-sim",
            "tier": 3,
            "prompt": prompt,
            "display": None,
            "inputType": "text",
            "options": None,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(answer, "exact"),
            "normalization": "exact",
            "decimalPlaces": None,
            "timeLimit": TIME_LIMITS[3],
            "_verifiedAnswer": answer,
        })

    return questions


def generate_vigenere_decrypt() -> list[dict]:
    """T3 state-tracking: 10 Vigenere decryption questions (seeds 5400-5409)."""
    questions = []
    for i in range(10):
        rng = mulberry32(5400 + i)

        keyword = "".join(chr(ord('a') + mb_randint(rng, 0, 26)) for _ in range(5))
        plaintext = "".join(chr(ord('a') + mb_randint(rng, 0, 26)) for _ in range(30))

        ciphertext = ""
        for j, ch in enumerate(plaintext):
            shift = ord(keyword[j % 5]) - ord('a')
            ciphertext += chr(ord('a') + (ord(ch) - ord('a') + shift) % 26)

        known_pairs = []
        for pos in range(5):
            candidates = [j for j in range(30) if j % 5 == pos]
            chosen = candidates[mb_randint(rng, 0, len(candidates))]
            known_pairs.append((chosen, plaintext[chosen], ciphertext[chosen]))

        pairs_text = "\n".join(
            f"  Position {idx}: plaintext '{p}' -> ciphertext '{c}'"
            for idx, p, c in sorted(known_pairs)
        )

        prompt = (
            f"A Vigenere cipher with a 5-letter keyword was used to encrypt a 30-character plaintext "
            f"(all lowercase letters). The keyword repeats cyclically (positions 0-4, 5-9, etc.).\n\n"
            f"Ciphertext: {ciphertext}\n\n"
            f"Known plaintext-ciphertext pairs:\n{pairs_text}\n\n"
            f"Deduce the keyword from the known pairs, then decrypt the full ciphertext.\n"
            f"Answer with the 30-character plaintext (lowercase letters only)."
        )

        questions.append({
            "id": make_id("state-tracking", 3, "vigenere-decrypt"),
            "section": "state-tracking",
            "subtype": "vigenere-decrypt",
            "tier": 3,
            "prompt": prompt,
            "display": None,
            "inputType": "text",
            "options": None,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(plaintext, "trimmed-lowercase"),
            "normalization": "trimmed-lowercase",
            "decimalPlaces": None,
            "timeLimit": TIME_LIMITS[3],
            "_verifiedAnswer": plaintext,
        })

    return questions


# ── T2 hardened generators ───────────────────────────────────────────────────

def generate_cipher_chain_small() -> list[dict]:
    """T2 state-tracking: 5 double-substitution cipher questions (seeds 5100-5104)."""
    questions = []
    for i in range(5):
        rng = mulberry32(5100 + i)

        def make_cipher(r):
            letters = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
            for j in range(25, 0, -1):
                k = mb_randint(r, 0, j + 1)
                letters[j], letters[k] = letters[k], letters[j]
            return {chr(ord('A') + idx): letters[idx] for idx in range(26)}

        cipher1 = make_cipher(rng)
        cipher2 = make_cipher(rng)

        plaintext = "".join(chr(ord('A') + mb_randint(rng, 0, 26)) for _ in range(8))
        intermediate = "".join(cipher1[ch] for ch in plaintext)
        result = "".join(cipher2[ch] for ch in intermediate)

        def format_table(cipher, name):
            pairs = [f"{k}->{v}" for k, v in sorted(cipher.items())]
            rows = [" ".join(pairs[r:r+13]) for r in range(0, 26, 13)]
            return f"{name}:\n  " + "\n  ".join(rows)

        prompt = (
            f"Apply two substitution ciphers in sequence to the plaintext.\n\n"
            f"Plaintext: {plaintext}\n\n"
            f"{format_table(cipher1, 'Cipher 1')}\n\n"
            f"{format_table(cipher2, 'Cipher 2')}\n\n"
            f"First apply Cipher 1 to the plaintext to get an intermediate result, "
            f"then apply Cipher 2 to the intermediate result.\n"
            f"Answer with the final 8-character result (uppercase letters)."
        )

        questions.append({
            "id": make_id("state-tracking", 2, "cipher-chain-small"),
            "section": "state-tracking",
            "subtype": "cipher-chain-small",
            "tier": 2,
            "prompt": prompt,
            "display": None,
            "inputType": "text",
            "options": None,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(result, "trimmed-lowercase"),
            "normalization": "trimmed-lowercase",
            "decimalPlaces": None,
            "timeLimit": TIME_LIMITS[2],
            "_verifiedAnswer": result,
        })

    return questions


def generate_hex_xor_match_small() -> list[dict]:
    """T2 state-tracking: 5 hex-XOR-match questions (seeds 5200-5204)."""
    questions = []
    for i in range(5):
        rng = mulberry32(5200 + i)

        even_digits = [0, 2, 4, 6, 8, 0xA, 0xC, 0xE]

        def all_even_xor(a_hex, b_hex):
            x = int(a_hex, 16) ^ int(b_hex, 16)
            for _ in range(6):
                if (x & 0xF) % 2 != 0:
                    return False
                x >>= 4
            return True

        # Generate the designed answer pair
        a_val = mb_randint(rng, 0, 0x1000000)
        xor_result = 0
        for _ in range(6):
            digit = even_digits[mb_randint(rng, 0, len(even_digits))]
            xor_result = (xor_result << 4) | digit
        b_val = a_val ^ xor_result
        a_str = f"{a_val:06x}"
        b_str = f"{b_val:06x}"

        # Generate other strings that don't form valid pairs
        existing = {a_str, b_str}
        others = []
        while len(others) < 28:
            s = f"{mb_randint(rng, 0, 0x1000000):06x}"
            if s in existing:
                continue
            conflict = False
            for e in existing:
                if all_even_xor(s, e):
                    conflict = True
                    break
            if not conflict:
                others.append(s)
                existing.add(s)

        all_strings = others[:]
        pos_a = mb_randint(rng, 0, len(all_strings) + 1)
        all_strings.insert(pos_a, a_str)
        pos_b = mb_randint(rng, 0, len(all_strings) + 1)
        all_strings.insert(pos_b, b_str)

        # Sort the answer pair alphabetically
        pair = sorted([a_str, b_str])
        answer = f"{pair[0]},{pair[1]}"

        strings_text = "\n".join(f"  {j+1:2d}. {s}" for j, s in enumerate(all_strings))

        prompt = (
            f"Below are 30 hex strings, each 6 characters long.\n"
            f"Find the two strings whose bitwise XOR produces a result where ALL hex digits are even "
            f"(i.e., every digit is one of 0, 2, 4, 6, 8, A, C, E).\n\n"
            f"{strings_text}\n\n"
            f"Answer with the two hex strings separated by a comma (alphabetically first string first), "
            f"e.g.: a1b2c3,d4e5f6"
        )

        questions.append({
            "id": make_id("state-tracking", 2, "hex-xor-match-small"),
            "section": "state-tracking",
            "subtype": "hex-xor-match-small",
            "tier": 2,
            "prompt": prompt,
            "display": None,
            "inputType": "text",
            "options": None,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(answer, "hex-lowercase"),
            "normalization": "hex-lowercase",
            "decimalPlaces": None,
            "timeLimit": TIME_LIMITS[2],
            "_verifiedAnswer": answer,
        })

    return questions


def generate_ledger_running_balance_small() -> list[dict]:
    """T2 state-tracking: 5 running-balance questions (seeds 5300-5304)."""
    questions = []
    for i in range(5):
        rng = mulberry32(5300 + i)

        starting_balance = mb_randint(rng, 200, 600)
        target_neg = mb_randint(rng, 12, 22)

        transactions = []
        balance = starting_balance
        first_negative_idx = None

        for j in range(25):
            if j == target_neg and first_negative_idx is None:
                amount = -(balance + mb_randint(rng, 1, 50))
            elif first_negative_idx is not None:
                amount = mb_randint(rng, -80, 81)
            else:
                max_debit = min(80, balance - 1)
                if max_debit <= 0:
                    amount = mb_randint(rng, 10, 100)
                elif rng() < 0.5:
                    amount = mb_randint(rng, 10, 100)
                else:
                    amount = -mb_randint(rng, 1, max_debit + 1)

            transactions.append(amount)
            balance += amount
            if balance < 0 and first_negative_idx is None:
                first_negative_idx = j + 1  # 1-indexed

        answer = str(first_negative_idx)

        tx_lines = []
        for j, amount in enumerate(transactions):
            sign = "+" if amount >= 0 else ""
            tx_lines.append(f"  TX{j+1:02d}: {sign}{amount}")

        prompt = (
            f"Starting balance: {starting_balance}\n\n"
            f"Transactions (applied sequentially):\n" + "\n".join(tx_lines) + "\n\n"
            f"Find the first transaction number where the running balance goes negative.\n"
            f"Answer with just the number (e.g., 14)."
        )

        questions.append({
            "id": make_id("state-tracking", 2, "ledger-running-balance-small"),
            "section": "state-tracking",
            "subtype": "ledger-running-balance-small",
            "tier": 2,
            "prompt": prompt,
            "display": None,
            "inputType": "numeric",
            "options": None,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(answer, "exact"),
            "normalization": "exact",
            "decimalPlaces": None,
            "timeLimit": TIME_LIMITS[2],
            "_verifiedAnswer": answer,
        })

    return questions


def generate_discrete_log_small() -> list[dict]:
    """T2 sequential-depth: 5 discrete-log questions (seeds 5500-5504)."""
    primes = [17, 19, 23, 29, 31, 37, 41, 43]
    questions = []
    for i in range(5):
        rng = mulberry32(5500 + i)

        p = primes[mb_randint(rng, 0, len(primes))]
        base = mb_randint(rng, 2, p)

        # Compute all powers
        powers = {}
        val = 1
        for x in range(1, p):
            val = (val * base) % p
            if val not in powers:
                powers[val] = x

        # Pick a target with x in [5, 40]
        candidates = [(v, x) for v, x in powers.items() if 5 <= x <= 40]
        if not candidates:
            candidates = [(v, x) for v, x in powers.items() if x >= 2]

        target, answer_x = candidates[mb_randint(rng, 0, len(candidates))]
        answer = str(answer_x)

        prompt = (
            f"Find the smallest positive integer x such that {base}^x = {target} (mod {p}).\n\n"
            f"Answer with x."
        )

        questions.append({
            "id": make_id("sequential-depth", 2, "discrete-log-small"),
            "section": "sequential-depth",
            "subtype": "discrete-log-small",
            "tier": 2,
            "prompt": prompt,
            "display": None,
            "inputType": "numeric",
            "options": None,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(answer, "exact"),
            "normalization": "exact",
            "decimalPlaces": None,
            "timeLimit": TIME_LIMITS[2],
            "_verifiedAnswer": answer,
        })

    return questions


def generate_recurrence_modular_small() -> list[dict]:
    """T2 sequential-depth: 4 custom-recurrence questions (seeds 5600-5603)."""
    questions = []
    for i in range(4):
        rng = mulberry32(5600 + i)

        a = mb_randint(rng, 2, 8)
        b = mb_randint(rng, 1, 6)
        m = mb_randint(rng, 50, 200)
        f0 = mb_randint(rng, 1, 20)
        f1 = mb_randint(rng, 1, 20)

        prev2, prev1 = f0, f1
        for _ in range(2, 13):
            curr = (a * prev1 + b * prev2) % m
            prev2, prev1 = prev1, curr

        answer = str(prev1)

        prompt = (
            f"Given the recurrence relation:\n"
            f"  f(0) = {f0}\n"
            f"  f(1) = {f1}\n"
            f"  f(n) = ({a} * f(n-1) + {b} * f(n-2)) mod {m}  for n >= 2\n\n"
            f"Compute f(12)."
        )

        questions.append({
            "id": make_id("sequential-depth", 2, "recurrence-modular-small"),
            "section": "sequential-depth",
            "subtype": "recurrence-modular-small",
            "tier": 2,
            "prompt": prompt,
            "display": None,
            "inputType": "numeric",
            "options": None,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(answer, "exact"),
            "normalization": "exact",
            "decimalPlaces": None,
            "timeLimit": TIME_LIMITS[2],
            "_verifiedAnswer": answer,
        })

    return questions


def generate_xor_chain_small() -> list[dict]:
    """T2 sequential-depth: 5 XOR-rotate chain questions (seeds 5700-5704)."""
    questions = []
    for i in range(5):
        rng = mulberry32(5700 + i)

        def rot_left_16(val, k):
            k = k % 16
            return ((val << k) | (val >> (16 - k))) & 0xFFFF

        def rot_right_16(val, k):
            k = k % 16
            return ((val >> k) | (val << (16 - k))) & 0xFFFF

        initial = mb_randint(rng, 0, 0x10000)
        xor1 = mb_randint(rng, 0, 0x10000)
        rot_l = mb_randint(rng, 1, 8)
        xor2 = mb_randint(rng, 0, 0x10000)
        rot_r = mb_randint(rng, 1, 8)
        xor3 = mb_randint(rng, 0, 0x10000)

        val = initial
        val = val ^ xor1
        val = rot_left_16(val, rot_l)
        val = val ^ xor2
        val = rot_right_16(val, rot_r)
        val = val ^ xor3

        answer = f"{val:04x}"

        prompt = (
            f"Perform the following operations on a 16-bit value (all operations are 16-bit):\n\n"
            f"Start: 0x{initial:04X}\n"
            f"Step 1: XOR with 0x{xor1:04X}\n"
            f"Step 2: Rotate left by {rot_l} bits\n"
            f"Step 3: XOR with 0x{xor2:04X}\n"
            f"Step 4: Rotate right by {rot_r} bits\n"
            f"Step 5: XOR with 0x{xor3:04X}\n\n"
            f"Answer with the final 16-bit value in lowercase hex (4 digits, e.g. a1b2)."
        )

        questions.append({
            "id": make_id("sequential-depth", 2, "xor-chain-small"),
            "section": "sequential-depth",
            "subtype": "xor-chain-small",
            "tier": 2,
            "prompt": prompt,
            "display": None,
            "inputType": "text",
            "options": None,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(answer, "hex-lowercase"),
            "normalization": "hex-lowercase",
            "decimalPlaces": None,
            "timeLimit": TIME_LIMITS[2],
            "_verifiedAnswer": answer,
        })

    return questions


def generate_logic_circuit_small() -> list[dict]:
    """T2 state-tracking: 5 logic-circuit evaluation questions (seeds 5800-5804)."""
    questions = []
    gate_types = ['AND', 'OR', 'XOR', 'NAND', 'NOR']
    input_names = ['A', 'B', 'C', 'D', 'E', 'F']

    for i in range(5):
        rng = mulberry32(5800 + i)

        inputs = [mb_randint(rng, 0, 2) for _ in range(6)]

        gates = []
        for g in range(4):
            gt = gate_types[mb_randint(rng, 0, len(gate_types))]
            available = list(range(6 + g))
            in1 = available[mb_randint(rng, 0, len(available))]
            in2 = available[mb_randint(rng, 0, len(available))]
            attempts = 0
            while in2 == in1 and attempts < 20:
                in2 = available[mb_randint(rng, 0, len(available))]
                attempts += 1
            gates.append((gt, in1, in2))

        def evaluate(input_vals):
            vals = list(input_vals)
            for gt, in1, in2 in gates:
                a_v, b_v = vals[in1], vals[in2]
                if gt == 'AND':
                    vals.append(a_v & b_v)
                elif gt == 'OR':
                    vals.append(a_v | b_v)
                elif gt == 'XOR':
                    vals.append(a_v ^ b_v)
                elif gt == 'NAND':
                    vals.append(1 - (a_v & b_v))
                elif gt == 'NOR':
                    vals.append(1 - (a_v | b_v))
            return vals[-1]

        output = evaluate(inputs)

        sensitive_count = 0
        for j in range(6):
            flipped = inputs[:]
            flipped[j] = 1 - flipped[j]
            if evaluate(flipped) != output:
                sensitive_count += 1

        answer = f"{output},{sensitive_count}"

        def node_name(idx):
            return input_names[idx] if idx < 6 else f"G{idx - 5}"

        gate_lines = []
        for g, (gt, in1, in2) in enumerate(gates):
            gate_lines.append(f"  G{g+1} = {node_name(in1)} {gt} {node_name(in2)}")

        input_text = ", ".join(f"{input_names[j]}={inputs[j]}" for j in range(6))

        prompt = (
            f"A 6-input logic circuit has 4 internal gates. Evaluate the circuit.\n\n"
            f"Inputs: {input_text}\n\n"
            f"Gates:\n" + "\n".join(gate_lines) + "\n\n"
            f"Output = G4\n\n"
            f"1) What is the output value (0 or 1)?\n"
            f"2) How many of the 6 inputs, if individually flipped, would change the output?\n\n"
            f"Answer as: output,count (e.g., 1,3)"
        )

        questions.append({
            "id": make_id("state-tracking", 2, "logic-circuit-small"),
            "section": "state-tracking",
            "subtype": "logic-circuit-small",
            "tier": 2,
            "prompt": prompt,
            "display": None,
            "inputType": "text",
            "options": None,
            "clientSeed": None,
            "interactiveConfig": None,
            "answerHash": hash_answer(answer, "exact"),
            "normalization": "exact",
            "decimalPlaces": None,
            "timeLimit": TIME_LIMITS[2],
            "_verifiedAnswer": answer,
        })

    return questions


# ── Subtypes to replace ──────────────────────────────────────────────────────

T2_EASY_SUBTYPES = {
    "cipher_small", "hex_stream_small", "ledger_small",
    "power_tower_small", "xor_small", "logic_small",
}
# recursive_trace_small: remove 4 of 5 (keep 1 Tribonacci)
T3_EASY_SUBTYPES = {"async_multi_axis", "peripheral_cipher"}

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

    # ── Step 2b: Filter easy T2 subtypes and inject hardened replacements ─
    # Handle recursive_trace_small specially: keep 1 Tribonacci question
    kept_recursive = []
    removed_recursive = []
    for q in t2_questions:
        if q.get("subtype") == "recursive_trace_small":
            if "tribonacci" in q.get("prompt", "").lower() and len(kept_recursive) == 0:
                kept_recursive.append(q)
            else:
                removed_recursive.append(q)
    # If no tribonacci found, keep the first one
    if not kept_recursive and removed_recursive:
        kept_recursive.append(removed_recursive.pop(0))

    t2_before = len(t2_questions)
    t2_questions = [q for q in t2_questions
                    if q.get("subtype") not in T2_EASY_SUBTYPES
                    and q.get("subtype") != "recursive_trace_small"]
    t2_questions.extend(kept_recursive)
    t2_removed = t2_before - len(t2_questions)
    print(f"  T2 easy subtypes removed: {t2_removed}")

    # Inject hardened T2
    t2_hardened = []
    t2_hardened.extend(generate_cipher_chain_small())
    t2_hardened.extend(generate_hex_xor_match_small())
    t2_hardened.extend(generate_ledger_running_balance_small())
    t2_hardened.extend(generate_discrete_log_small())
    t2_hardened.extend(generate_recurrence_modular_small())
    t2_hardened.extend(generate_xor_chain_small())
    t2_hardened.extend(generate_logic_circuit_small())
    t2_questions.extend(t2_hardened)
    print(f"  T2 hardened injected: {len(t2_hardened)}")
    print(f"  T2 final count: {len(t2_questions)}")

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

    # ── Step 3b: Filter easy T3 subtypes and inject hardened replacements ─
    t3_before = len(t3_questions)
    t3_questions = [q for q in t3_questions
                    if q.get("subtype") not in T3_EASY_SUBTYPES]
    t3_removed = t3_before - len(t3_questions)
    print(f"  T3 easy subtypes removed: {t3_removed}")

    t3_hardened = []
    t3_hardened.extend(generate_register_machine_sim())
    t3_hardened.extend(generate_vigenere_decrypt())
    t3_questions.extend(t3_hardened)
    print(f"  T3 hardened injected: {len(t3_hardened)}")
    print(f"  T3 final count: {len(t3_questions)}")

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
