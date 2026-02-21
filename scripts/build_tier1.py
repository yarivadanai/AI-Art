#!/usr/bin/env python3
"""
Tier 1 (Accessible Difficulty) Question Generator

Reads extracted bank data from /tmp/scca-recovery/extracted_banks.json
(produced by Node.js eval of recovered TypeScript banks) and converts
25 questions per section into the standard dataset format with SHA-256
hashed answers.

Tier 1 = expert-level questions a knowledgeable human can solve with effort.
These are language, logic, and knowledge questions (not computational).

Section mapping:
  isomorphisms    -> topology      (structural reasoning across domains)
  cognitive-stack -> parallel-state (parsing deeply nested structures)
  proofs          -> recursive-exec (tracing logical chains for errors)
  grammar         -> micro-pattern  (detecting subtle pattern violations)
  translations    -> attentional    (selecting correct meaning under load)
  expert-trap     -> bayesian       (reasoning about expert-level errors)
  assembly        -> crypto-bitwise (deterministic execution tracing)

Outputs:
  - lib/data/tier1_questions.json
"""

import hashlib
import json
import os
import random
import subprocess
import sys


# ============================================================================
# Normalization & Hashing -- must match grader.ts exactly
# ============================================================================

def normalize_and_hash(answer, normalization, decimal_places=None):
    trimmed = str(answer).strip()
    if normalization == "exact":
        normalized = trimmed
    elif normalization == "trimmed-lowercase":
        normalized = trimmed.lower()
    elif normalization == "hex-lowercase":
        normalized = trimmed.lower()
        if normalized.startswith("0x"):
            normalized = normalized[2:]
    elif normalization == "numeric-rounded":
        n = float(trimmed)
        dp = decimal_places if decimal_places is not None else 0
        normalized = f"{n:.{dp}f}"
    else:
        normalized = trimmed
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def make_question(qid, section, subtype, prompt, answer, normalization,
                  decimal_places=None, input_type="text", options=None,
                  display=None):
    return {
        "id": qid,
        "section": section,
        "subtype": subtype,
        "tier": 1,
        "prompt": prompt,
        "display": display,
        "inputType": input_type,
        "options": options,
        "clientSeed": None,
        "interactiveConfig": None,
        "answerHash": normalize_and_hash(answer, normalization, decimal_places),
        "normalization": normalization,
        "decimalPlaces": decimal_places,
        "_verifiedAnswer": str(answer).strip(),
    }


# ============================================================================
# Extraction
# ============================================================================

def extract_banks():
    """Load pre-extracted bank JSON (from Node.js eval of TS files)."""
    extracted_path = "/tmp/scca-recovery/extracted_banks.json"

    if os.path.exists(extracted_path):
        with open(extracted_path) as f:
            return json.load(f)

    # Run Node.js extraction if not yet done
    js_code = r"""
    const fs = require('fs');
    function extractArray(filepath, varName, preDefine) {
      let src = fs.readFileSync(filepath, 'utf-8');
      src = src.replace(/^import\b.*$/gm, '');
      src = src.replace(/^export\s+/gm, '');
      src = src.replace(/^interface\s+\w+\s*\{[\s\S]*?\n\}/gm, '');
      src = src.replace(/(const\s+\w+)\s*:\s*[\w<>\[\]|&\s"']+?\s*(?==)/g, '$1 ');
      src = src.replace(/^const\s+/gm, 'var ');
      src = src.replace(/^let\s+/gm, 'var ');
      if (preDefine) src = preDefine + '\n' + src;
      eval(src);
      return eval(varName);
    }
    const DIR = '/tmp/scca-recovery';
    const data = {
      isomorphisms: extractArray(DIR+'/isomorphisms.ts', 'ISOMORPHISM_ITEMS', ''),
      cognitiveStack: extractArray(DIR+'/cognitive-stack.ts', 'COGNITIVE_STACK_ITEMS', ''),
      proofsBase: extractArray(DIR+'/proofs.ts', 'FALLACIOUS_PROOFS',
        'var FALLACIOUS_PROOFS_EXT_1=[];var FALLACIOUS_PROOFS_EXT_2=[];'),
      proofsExt1: extractArray(DIR+'/proofs-ext-1.ts', 'FALLACIOUS_PROOFS_EXT_1', ''),
      grammarBase: extractArray(DIR+'/grammar.ts', 'GRAMMAR_ITEMS',
        'var GRAMMAR_ITEMS_EXT_1=[];var GRAMMAR_ITEMS_EXT_2=[];'),
      grammarExt1: extractArray(DIR+'/grammar-ext-1.ts', 'GRAMMAR_ITEMS_EXT_1', ''),
      translationsBase: extractArray(DIR+'/translations.ts', 'TRANSLATION_WORDS',
        'var TRANSLATION_WORDS_EXT=[];'),
      translationsExt: extractArray(DIR+'/translations-ext.ts', 'TRANSLATION_WORDS_EXT', ''),
      expertTrap: extractArray(DIR+'/expert-trap.ts', 'EXPERT_TRAP_ITEMS', ''),
      assemblyExt: extractArray(DIR+'/assembly-ext.ts', 'ASSEMBLY_TEMPLATES_EXT', ''),
    };
    fs.writeFileSync('/tmp/scca-recovery/extracted_banks.json', JSON.stringify(data, null, 2));
    process.stdout.write('OK');
    """
    result = subprocess.run(["node", "--no-warnings", "-e", js_code],
                            capture_output=True, text=True)
    if result.returncode != 0:
        print("Node.js extraction failed:", result.stderr)
        sys.exit(1)

    with open(extracted_path) as f:
        return json.load(f)


# ============================================================================
# Helpers
# ============================================================================

def select_items(items, n, seed):
    """Deterministically select n items."""
    rng = random.Random(seed)
    if len(items) <= n:
        return items[:]
    return rng.sample(items, n)


def shuffle_with_correct(correct_idx, options, seed):
    """Shuffle options and return (new_options, new_correct_idx).
    correct_idx is the index of the correct option in the input list.
    Returns the shuffled list and the new index of the correct option."""
    rng = random.Random(seed)
    indexed = list(enumerate(options))
    rng.shuffle(indexed)
    new_options = [opt for _, opt in indexed]
    new_correct_idx = next(i for i, (orig_i, _) in enumerate(indexed) if orig_i == correct_idx)
    return new_options, new_correct_idx


def make_mc(qid, section, subtype, prompt, correct_text, distractor_texts, seed,
            display=None):
    """Build a multiple-choice question. Answer is the shuffled index."""
    options = [correct_text] + list(distractor_texts[:3])
    # Pad if needed
    while len(options) < 4:
        options.append("None of the above")
    options = options[:4]

    shuffled, correct_idx = shuffle_with_correct(0, options, seed)

    return make_question(
        qid, section, subtype, prompt,
        str(correct_idx), "exact",
        input_type="multiple-choice", options=shuffled,
        display=display,
    )


# ============================================================================
# Section 1: Topology (isomorphisms -> topology)
# ============================================================================

def build_topology(banks, questions):
    items = banks["isomorphisms"]
    selected = select_items(items, 25, seed=42001)

    for i, item in enumerate(selected):
        prompt = (
            f"CROSS-DOMAIN MAPPING\n\n"
            f"Source domain: {item['sourceField']}\n"
            f"Concept: {item['sourceConcept']}\n\n"
            f"{item['sourceDescription']}\n\n"
            f"Target domain: {item['targetField']}\n\n"
            f"What is the structural equivalent of this concept in the target domain?"
        )

        # Distractors: answers from other items with different target fields
        distractors = [
            d["answer"] for d in items
            if d["answer"] != item["answer"] and d["targetField"] != item["targetField"]
        ]
        distractors = select_items(distractors, 3, seed=42001 + i)

        questions.append(make_mc(
            f"t1_topology_{i}", "topology", "isomorphism",
            prompt, item["answer"], distractors, seed=42001 + i + 1000
        ))


# ============================================================================
# Section 2: Parallel State (cognitive-stack -> parallel-state)
# ============================================================================

def build_parallel_state(banks, questions):
    items = banks["cognitiveStack"]
    selected = select_items(items, 25, seed=42002)

    for i, item in enumerate(selected):
        prompt = (
            f"NESTED STRUCTURE PARSING\n\n"
            f"{item['text']}\n\n"
            f"{item['question']}"
        )

        questions.append(make_question(
            f"t1_parallel-state_{i}", "parallel-state", item.get("subtype", "cognitive_stack"),
            prompt, item["answer"], "trimmed-lowercase"
        ))


# ============================================================================
# Section 3: Recursive Exec (proofs -> recursive-exec)
# ============================================================================

def build_recursive_exec(banks, questions):
    all_proofs = banks["proofsBase"] + banks["proofsExt1"]
    # Filter to items that have all required fields
    valid = [p for p in all_proofs if p.get("title") and p.get("steps")
             and p.get("errorStep") is not None and p.get("errorExplanation")
             and p.get("distractorExplanations") and len(p["distractorExplanations"]) >= 3]
    selected = select_items(valid, 25, seed=42003)

    for i, item in enumerate(selected):
        steps_text = "\n".join(
            f"  Step {j}: {step}" for j, step in enumerate(item["steps"])
        )
        prompt = (
            f"LOGICAL ERROR DETECTION\n\n"
            f"{item['title']}\n\n"
            f"{steps_text}\n\n"
            f"One step contains a critical logical error. "
            f"Which explanation correctly identifies it?"
        )

        correct = item["errorExplanation"]
        distractors = item["distractorExplanations"][:3]

        questions.append(make_mc(
            f"t1_recursive-exec_{i}", "recursive-exec", "proof_error",
            prompt, correct, distractors, seed=42003 + i + 1000
        ))


# ============================================================================
# Section 4: Micro Pattern (grammar -> micro-pattern)
# ============================================================================

def build_micro_pattern(banks, questions):
    all_grammar = banks["grammarBase"] + banks["grammarExt1"]
    # Only items with distractors
    valid = [g for g in all_grammar if g.get("distractors") and len(g["distractors"]) >= 3]
    selected = select_items(valid, 25, seed=42004)

    for i, item in enumerate(selected):
        prompt = (
            f"PATTERN VIOLATION DETECTION\n\n"
            f'"{item["sentence"]}"\n\n'
            f"Identify the grammatical violation in the sentence above."
        )

        correct = item["violation"]
        distractors = item["distractors"][:3]

        questions.append(make_mc(
            f"t1_micro-pattern_{i}", "micro-pattern", "grammar_violation",
            prompt, correct, distractors, seed=42004 + i + 1000
        ))


# ============================================================================
# Section 5: Attentional (translations -> attentional)
# ============================================================================

def build_attentional(banks, questions):
    all_trans = banks["translationsBase"] + banks["translationsExt"]
    # Only items with distractors
    valid = [t for t in all_trans if t.get("distractors") and len(t["distractors"]) >= 3]
    selected = select_items(valid, 25, seed=42005)

    for i, item in enumerate(selected):
        prompt = (
            f"SEMANTIC PRECISION\n\n"
            f"Word: {item['word']}\n"
            f"Language: {item['language']}\n\n"
            f"Select the description that most accurately captures this word's meaning. "
            f"The correct answer identifies the specific cultural or conceptual nuance "
            f"that makes this word untranslatable."
        )

        correct = item["correctDescription"]
        distractors = item["distractors"][:3]

        questions.append(make_mc(
            f"t1_attentional_{i}", "attentional", "untranslatable",
            prompt, correct, distractors, seed=42005 + i + 1000
        ))


# ============================================================================
# Section 6: Bayesian (expert-trap -> bayesian)
# ============================================================================

def build_bayesian(banks, questions):
    items = banks["expertTrap"]
    selected = select_items(items, 25, seed=42006)

    for i, item in enumerate(selected):
        prompt = (
            f"EXPERT ERROR IDENTIFICATION\n\n"
            f"Field: {item['field']}\n\n"
            f'"{item["text"]}"\n\n'
            f"The passage above contains a subtle but significant error "
            f"that experts in this field would recognize. "
            f"Which statement correctly identifies it?"
        )

        correct = item["answer"]
        # Use answers from other selected items as distractors
        distractors = [
            d["answer"] for d in selected
            if d["answer"] != correct and d["field"] != item["field"]
        ]
        distractors = select_items(distractors, 3, seed=42006 + i)

        questions.append(make_mc(
            f"t1_bayesian_{i}", "bayesian", "expert_trap",
            prompt, correct, distractors, seed=42006 + i + 1000
        ))


# ============================================================================
# Section 7: Crypto Bitwise (assembly -> crypto-bitwise)
# ============================================================================

def build_crypto_bitwise(banks, questions):
    items = banks["assemblyExt"]
    selected = select_items(items, 25, seed=42007)

    for i, item in enumerate(selected):
        prompt = (
            f"EXECUTION TRACE\n\n"
            f"What value does the EAX register hold after executing "
            f"this x86 assembly sequence?"
        )

        # Options are already defined with a correct index
        options = [str(opt) for opt in item["options"]]
        correct_idx = item["correctOptionIndex"]

        # For MC, answer is the index after shuffling
        shuffled, new_correct_idx = shuffle_with_correct(correct_idx, options, seed=42007 + i + 1000)

        questions.append(make_question(
            f"t1_crypto-bitwise_{i}", "crypto-bitwise", "assembly_trace",
            prompt, str(new_correct_idx), "exact",
            input_type="multiple-choice", options=shuffled,
            display=item["code"],
        ))


# ============================================================================
# Main
# ============================================================================

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_dir = os.path.join(project_root, "lib", "data")
    os.makedirs(data_dir, exist_ok=True)

    print("Loading extracted bank data...")
    banks = extract_banks()

    print(f"  Isomorphisms: {len(banks['isomorphisms'])} items")
    print(f"  Cognitive-stack: {len(banks['cognitiveStack'])} items")
    print(f"  Proofs: {len(banks['proofsBase']) + len(banks['proofsExt1'])} items")
    print(f"  Grammar: {len(banks['grammarBase']) + len(banks['grammarExt1'])} items")
    print(f"  Translations: {len(banks['translationsBase']) + len(banks['translationsExt'])} items")
    print(f"  Expert-trap: {len(banks['expertTrap'])} items")
    print(f"  Assembly: {len(banks['assemblyExt'])} items")

    print("\nGenerating 175 Tier 1 questions (25 per section)...")
    questions = []

    builders = [
        ("topology", build_topology),
        ("parallel-state", build_parallel_state),
        ("recursive-exec", build_recursive_exec),
        ("micro-pattern", build_micro_pattern),
        ("attentional", build_attentional),
        ("bayesian", build_bayesian),
        ("crypto-bitwise", build_crypto_bitwise),
    ]

    for name, builder in builders:
        n_before = len(questions)
        builder(banks, questions)
        print(f"  {name}: {len(questions) - n_before} questions ({len(questions)} total)")

    # ── Validation ──────────────────────────────────────────────────────────
    print(f"\nValidating {len(questions)} questions...")
    errors = []

    if len(questions) != 175:
        errors.append(f"Expected 175 questions, got {len(questions)}")

    ids = [q["id"] for q in questions]
    if len(set(ids)) != len(ids):
        dupes = [x for x in set(ids) if ids.count(x) > 1]
        errors.append(f"Duplicate IDs: {dupes}")

    for q in questions:
        h = q["answerHash"]
        if len(h) != 64 or not all(c in "0123456789abcdef" for c in h):
            errors.append(f"{q['id']}: invalid hash format")

    for q in questions:
        expected = normalize_and_hash(q["_verifiedAnswer"], q["normalization"], q.get("decimalPlaces"))
        if expected != q["answerHash"]:
            errors.append(f"{q['id']}: hash mismatch! answer='{q['_verifiedAnswer']}'")

    for q in questions:
        if q["tier"] != 1:
            errors.append(f"{q['id']}: tier is {q['tier']}, expected 1")

    # Validate MC answers are valid indices
    for q in questions:
        if q["inputType"] == "multiple-choice":
            if not q["options"] or len(q["options"]) < 2:
                errors.append(f"{q['id']}: MC missing options")
            try:
                idx = int(q["_verifiedAnswer"])
                if idx < 0 or idx >= len(q["options"]):
                    errors.append(f"{q['id']}: answer index {idx} out of range")
            except ValueError:
                errors.append(f"{q['id']}: MC answer is not a valid index: {q['_verifiedAnswer']}")

    section_counts = {}
    for q in questions:
        section_counts[q["section"]] = section_counts.get(q["section"], 0) + 1
    for sec in ["topology", "parallel-state", "recursive-exec", "micro-pattern",
                "attentional", "bayesian", "crypto-bitwise"]:
        if section_counts.get(sec, 0) != 25:
            errors.append(f"Section '{sec}' has {section_counts.get(sec, 0)} questions, expected 25")

    if errors:
        print(f"\nFAILED with {len(errors)} errors:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("  All questions valid!")
        print(f"  Section distribution: {section_counts}")

    # ── Write ──────────────────────────────────────────────────────────────
    output_path = os.path.join(data_dir, "tier1_questions.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {output_path} ({os.path.getsize(output_path)} bytes)")
    print(f"Done. {len(questions)} Tier 1 questions generated and validated.")


if __name__ == "__main__":
    main()
