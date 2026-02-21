#!/usr/bin/env python3
"""
Tier 2 (Borderline Difficulty) Question Generator

Generates 105 questions (7 sections x 3 subtypes x 5 each) with SHA-256 hashed
answers. These are scaled-down versions of the Tier 3 computational questions,
small enough that a careful human could potentially solve them.

Uses mulberry32 PRNG for all seed-dependent computations to guarantee
parity with the TypeScript client.

Outputs:
  - lib/data/tier2_questions.json
"""

import hashlib
import json
import math
import os
import sys
import numpy as np


# ============================================================================
# Mulberry32 PRNG -- must match TypeScript implementation exactly
# ============================================================================

def mulberry32(seed):
    state = [seed & 0xFFFFFFFF]

    def imul(a, b):
        """Emulate JavaScript Math.imul (32-bit integer multiply)."""
        return ((a & 0xFFFFFFFF) * (b & 0xFFFFFFFF)) & 0xFFFFFFFF

    def next_float():
        state[0] = (state[0] + 0x6D2B79F5) & 0xFFFFFFFF
        t = state[0]
        t = imul(t ^ (t >> 15), t | 1)
        t = (t ^ ((t + imul(t ^ (t >> 7), t | 61)) & 0xFFFFFFFF)) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296

    return next_float


def mulberry32_int(rng, min_val, max_val):
    """Random integer in [min_val, max_val] inclusive."""
    return math.floor(rng() * (max_val - min_val + 1)) + min_val


def mulberry32_choice(rng, arr):
    """Pick random element from array."""
    return arr[math.floor(rng() * len(arr))]


def mulberry32_choices(rng, arr, k):
    """Pick k elements with replacement."""
    return [mulberry32_choice(rng, arr) for _ in range(k)]


def mulberry32_hex_char(rng):
    return "0123456789abcdef"[math.floor(rng() * 16)]


def mulberry32_hex_string(rng, length):
    return "".join(mulberry32_hex_char(rng) for _ in range(length))


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


# ============================================================================
# Helpers
# ============================================================================

def is_prime(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True


def make_question(qid, section, subtype, tier, prompt, answer, normalization,
                  decimal_places=None, input_type="text", options=None,
                  display=None, client_seed=None, interactive_config=None):
    return {
        "id": qid,
        "section": section,
        "subtype": subtype,
        "tier": tier,
        "prompt": prompt,
        "display": display,
        "inputType": input_type,
        "options": options,
        "clientSeed": client_seed,
        "interactiveConfig": interactive_config,
        "answerHash": normalize_and_hash(answer, normalization, decimal_places),
        "normalization": normalization,
        "decimalPlaces": decimal_places,
        "_verifiedAnswer": str(answer).strip(),
    }


# ============================================================================
# Section 1: Topology (15 questions: 3 subtypes x 5 each)
# ============================================================================

def build_topology(questions):
    from scipy.special import gamma

    # Subtype 1: simplex_centroid_small (5 questions)
    for i in range(5):
        dim = 3 + i  # dim = 3, 4, 5, 6, 7
        dist = 1.0 / math.sqrt(2 * dim * (dim + 1))
        ans = f"{dist:.6f}"
        questions.append(make_question(
            f"t2_topology_{len(questions)}", "topology", "simplex_centroid_small", 2,
            f"A {dim}-dimensional regular simplex has edge length 1. "
            f"Calculate the Euclidean distance between its centroid and the centroid of one of its ({dim-1})-dimensional faces. "
            f"The formula is: d = 1 / sqrt(2 * n * (n+1)) where n is the dimension. (6 decimal places)",
            ans, "numeric-rounded", 6
        ))

    # Subtype 2: hyperplane_projection_small (5 questions)
    projection_data = [
        ([3, -1, 4], [1, 2, 2]),
        ([5, 0, -3], [2, 1, -1]),
        ([-2, 7, 1], [1, 1, 1]),
        ([4, 4, -2], [0, 3, 4]),
        ([6, -3, 2], [2, -1, 2]),
    ]
    for i in range(5):
        v = np.array(projection_data[i][0], dtype=float)
        u = np.array(projection_data[i][1], dtype=float)
        proj = v - (np.dot(v, u) / np.dot(u, u)) * u
        ans = f"{proj[0]:.6f}"
        questions.append(make_question(
            f"t2_topology_{len(questions)}", "topology", "hyperplane_projection_small", 2,
            f"Vector V = {projection_data[i][0]} is projected orthogonally onto the plane with normal vector U = {projection_data[i][1]}. "
            f"The projection formula is: proj = V - (V . U / U . U) * U. "
            f"What is the first component (index 0) of the projected vector? (6 decimal places)",
            ans, "numeric-rounded", 6
        ))

    # Subtype 3: n_ball_volume_small (5 questions)
    for i in range(5):
        dim = 3 + (i % 2)  # alternating 3D and 4D
        radius = 1.0 + i * 0.5  # 1.0, 1.5, 2.0, 2.5, 3.0
        vol = (math.pi ** (dim / 2) / gamma(dim / 2 + 1)) * (radius ** dim)
        ans = f"{vol:.6f}"
        questions.append(make_question(
            f"t2_topology_{len(questions)}", "topology", "n_ball_volume_small", 2,
            f"Calculate the volume of a {dim}-dimensional ball (hyper-sphere) with radius R = {radius:.1f}. "
            f"The formula is V = (pi^(n/2) / Gamma(n/2 + 1)) * R^n. "
            f"For n={dim}: Gamma({dim/2 + 1}) = {gamma(dim/2 + 1):.6f}. (6 decimal places)",
            ans, "numeric-rounded", 6
        ))


# ============================================================================
# Section 2: Parallel State (15 questions: 3 subtypes x 5 each)
# ============================================================================

def build_parallel_state(questions):

    # Subtype 1: particle_small (5 questions)
    for i in range(5):
        seed = 8000 + i
        rng = mulberry32(seed)
        velocities = []
        for _ in range(20):
            vx = round(rng() * 20 - 10, 2)
            vy = round(rng() * 20 - 10, 2)
            velocities.append((vx, vy))
        idx1 = mulberry32_int(rng, 0, 9)
        idx2 = mulberry32_int(rng, 10, 19)
        velocities[idx2] = velocities[idx1]
        data_lines = []
        for p_i, (vx, vy) in enumerate(velocities):
            data_lines.append(f"  Particle {p_i}: vx={vx:.2f}, vy={vy:.2f}")
        data_str = "\n".join(data_lines)
        ans = f"{min(idx1, idx2)},{max(idx1, idx2)}"
        questions.append(make_question(
            f"t2_parallel-state_{len(questions)}", "parallel-state", "particle_small", 2,
            f"20 particles have the following velocity vectors:\n{data_str}\n\n"
            f"Two particles share identical velocity vectors. Report their IDs as 'ID1,ID2' (ascending order).",
            ans, "exact", client_seed=seed
        ))

    # Subtype 2: hex_stream_small (5 questions)
    for i in range(5):
        seed = 8100 + i
        rng = mulberry32(seed)
        streams = []
        for _ in range(50):
            streams.append(mulberry32_hex_string(rng, 4))
        idx1 = mulberry32_int(rng, 0, 24)
        idx2 = mulberry32_int(rng, 25, 49)
        shared = mulberry32_hex_string(rng, 4)
        streams[idx1] = shared
        streams[idx2] = shared
        data_lines = []
        for s_i, s in enumerate(streams):
            data_lines.append(f"  Stream {s_i:2d}: {s}")
        data_str = "\n".join(data_lines)
        ans = f"{min(idx1, idx2)},{max(idx1, idx2)}"
        questions.append(make_question(
            f"t2_parallel-state_{len(questions)}", "parallel-state", "hex_stream_small", 2,
            f"50 hex streams of 4 characters each:\n{data_str}\n\n"
            f"Two streams have identical content. Report their IDs as 'ID1,ID2' (ascending order).",
            ans, "exact", client_seed=seed
        ))

    # Subtype 3: ledger_small (5 questions)
    for i in range(5):
        seed = 8200 + i
        rng = mulberry32(seed)
        transactions = []
        for tx_i in range(20):
            amount = mulberry32_int(rng, 100, 999)
            transactions.append({"id": tx_i, "amount": amount})
        plant_idx = mulberry32_int(rng, 0, 19)
        old_amount = transactions[plant_idx]["amount"]
        new_amount = old_amount + (7 - old_amount % 7) if old_amount % 7 != 0 else old_amount
        transactions[plant_idx]["amount"] = new_amount
        for tx_i in range(20):
            if tx_i != plant_idx and transactions[tx_i]["amount"] % 7 == 0:
                transactions[tx_i]["amount"] += 1
        data_lines = []
        for tx in transactions:
            data_lines.append(f"  TX_{tx['id']:02d}: amount={tx['amount']}")
        data_str = "\n".join(data_lines)
        ans = f"TX_{plant_idx:02d}"
        questions.append(make_question(
            f"t2_parallel-state_{len(questions)}", "parallel-state", "ledger_small", 2,
            f"20 transaction records:\n{data_str}\n\n"
            f"Find the single transaction where the amount is divisible by 7. Report its ID (e.g., TX_05).",
            ans, "exact", client_seed=seed
        ))


# ============================================================================
# Section 3: Recursive Exec (15 questions: 3 subtypes x 5 each)
# ============================================================================

def build_recursive_exec(questions):

    # Subtype 1: power_tower_small (5 questions)
    power_tower_data = [
        (3, 7, 13),
        (5, 11, 17),
        (7, 5, 19),
        (2, 13, 23),
        (4, 9, 29),
    ]
    for i in range(5):
        a, b, m = power_tower_data[i]
        ans = str(pow(a, b, m))
        questions.append(make_question(
            f"t2_recursive-exec_{len(questions)}", "recursive-exec", "power_tower_small", 2,
            f"Calculate {a}^{b} mod {m}. Give the exact integer result.",
            ans, "exact"
        ))

    # Subtype 2: recursive_trace_small (5 questions)
    recursive_data = [
        ("Fibonacci", 7, 13, "F(0)=0, F(1)=1, F(n) = F(n-1) + F(n-2)"),
        ("Fibonacci", 10, 55, "F(0)=0, F(1)=1, F(n) = F(n-1) + F(n-2)"),
        ("Factorial", 6, 720, "F(0)=1, F(n) = n * F(n-1)"),
        ("Factorial", 8, 40320, "F(0)=1, F(n) = n * F(n-1)"),
        ("Tribonacci", 8, 44, "T(0)=0, T(1)=0, T(2)=1, T(n) = T(n-1) + T(n-2) + T(n-3)"),
    ]
    for i in range(5):
        name, n, expected, desc = recursive_data[i]
        ans = str(expected)
        questions.append(make_question(
            f"t2_recursive-exec_{len(questions)}", "recursive-exec", "recursive_trace_small", 2,
            f"Compute {name}({n}) using the recurrence: {desc}. Give the exact integer result.",
            ans, "exact"
        ))

    # Subtype 3: array_shift_small (5 questions)
    shift_ranges = [
        (1, 20),
        (1, 25),
        (1, 30),
        (1, 15),
        (1, 35),
    ]
    for i in range(5):
        start_n, end_n = shift_ranges[i]
        arr = [0, 1, 2, 3, 4]
        for n in range(start_n, end_n + 1):
            if is_prime(n):
                arr = arr[1:] + arr[:1]
            else:
                arr = arr[-1:] + arr[:-1]
        ans = str(arr[0])
        questions.append(make_question(
            f"t2_recursive-exec_{len(questions)}", "recursive-exec", "array_shift_small", 2,
            f"Array A = [0, 1, 2, 3, 4]. For each N from {start_n} to {end_n}: "
            f"if N is prime, shift the array left by 1 position; otherwise, shift right by 1 position. "
            f"A left shift of [a,b,c,d,e] gives [b,c,d,e,a]. A right shift gives [e,a,b,c,d]. "
            f"What is the value at index 0 after all shifts?",
            ans, "exact"
        ))


# ============================================================================
# Section 4: Micro Pattern (15 questions: 3 subtypes x 5 each)
# ============================================================================

def build_micro_pattern(questions):

    # Subtype 1: hex_palindrome_small (5 questions)
    for i in range(5):
        seed = 8300 + i
        rng = mulberry32(seed)
        num_chars = 200
        chars = list(mulberry32_hex_string(rng, num_chars))
        plant_start = mulberry32_int(rng, 10, num_chars - 9)
        half = mulberry32_hex_string(rng, 4)
        palindrome = half + half[::-1]
        for j in range(8):
            chars[plant_start + j] = palindrome[j]
        hex_string = "".join(chars)
        display_lines = []
        for start in range(0, len(hex_string), 40):
            display_lines.append(f"  [{start:3d}] {hex_string[start:start+40]}")
        display_str = "\n".join(display_lines)
        ans = str(plant_start)
        questions.append(make_question(
            f"t2_micro-pattern_{len(questions)}", "micro-pattern", "hex_palindrome_small", 2,
            f"200 hex characters are shown below. One 8-character substring is a perfect palindrome "
            f"(reads the same forwards and backwards). Find its starting index (0-based).\n\n{display_str}",
            ans, "exact", client_seed=seed
        ))

    # Subtype 2: variance_drift_small (5 questions)
    for i in range(5):
        seed = 8400 + i
        rng = mulberry32(seed)
        num_floats = 100
        block_size = 5
        plant_start = mulberry32_int(rng, 10, num_floats - block_size - 10)
        floats = []
        for _ in range(num_floats // 2 + 1):
            u1 = max(rng(), 1e-10)
            u2 = rng()
            z0 = math.sqrt(-2 * math.log(u1)) * math.cos(2 * math.pi * u2)
            z1 = math.sqrt(-2 * math.log(u1)) * math.sin(2 * math.pi * u2)
            floats.append(z0)
            floats.append(z1)
        floats = floats[:num_floats]
        for j in range(plant_start, plant_start + block_size):
            floats[j] += 1.0
        data_lines = []
        for f_i in range(0, num_floats, 5):
            row_vals = [f"{floats[f_i + k]:+.4f}" for k in range(min(5, num_floats - f_i))]
            data_lines.append(f"  [{f_i:3d}] " + "  ".join(row_vals))
        data_str = "\n".join(data_lines)
        ans = str(plant_start)
        questions.append(make_question(
            f"t2_micro-pattern_{len(questions)}", "micro-pattern", "variance_drift_small", 2,
            f"100 values drawn from N(0,1) are shown below. One block of {block_size} consecutive values "
            f"has been shifted to have mean approximately 1.0 instead of approximately 0.0. "
            f"Find the starting index of the anomalous block.\n\n{data_str}",
            ans, "exact", client_seed=seed
        ))

    # Subtype 3: hash_prefix_small (5 questions)
    for i in range(5):
        seed = 8500 + i
        rng = mulberry32(seed)
        num_strings = 50
        strings = []
        for _ in range(num_strings):
            strings.append(mulberry32_hex_string(rng, 8))
        plant_idx = mulberry32_int(rng, 0, num_strings - 1)
        target_digits = [15, 15, 10, 8, 5, 3, 2, 2]
        for j in range(7, 0, -1):
            k = mulberry32_int(rng, 0, j)
            target_digits[j], target_digits[k] = target_digits[k], target_digits[j]
        planted_str = "".join("0123456789abcdef"[d] for d in target_digits)
        strings[plant_idx] = planted_str
        for s_i in range(num_strings):
            if s_i != plant_idx:
                digit_sum = sum(int(c, 16) for c in strings[s_i])
                if digit_sum == 60:
                    old_char = strings[s_i][-1]
                    old_val = int(old_char, 16)
                    new_val = (old_val + 1) % 16
                    strings[s_i] = strings[s_i][:-1] + "0123456789abcdef"[new_val]
        data_lines = []
        for s_i, s in enumerate(strings):
            data_lines.append(f"  [{s_i:2d}] {s}")
        data_str = "\n".join(data_lines)
        ans = str(plant_idx)
        questions.append(make_question(
            f"t2_micro-pattern_{len(questions)}", "micro-pattern", "hash_prefix_small", 2,
            f"50 hex strings (8 characters each) are shown below. One of them has the property that "
            f"the sum of its hex digit values (0-15 per digit) equals exactly 60. "
            f"Which string index has this property?\n\n{data_str}",
            ans, "exact"
        ))


# ============================================================================
# Section 5: Attentional (15 questions: 3 subtypes x 5 each)
# ============================================================================

def build_attentional(questions):

    # Subtype 1: cipher_small (5 questions)
    for i in range(5):
        seed = 8600 + i
        rng = mulberry32(seed)
        alpha = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
        used_letters = alpha[:8]
        plaintext = "".join(mulberry32_choices(rng, used_letters, 8))
        key_letters = used_letters[:]
        for j in range(7, 0, -1):
            k = mulberry32_int(rng, 0, j)
            key_letters[j], key_letters[k] = key_letters[k], key_letters[j]
        sub_map = {used_letters[j]: key_letters[j] for j in range(8)}
        ciphertext = "".join(sub_map[c] for c in plaintext)
        key_lines = [f"  {used_letters[j]} -> {key_letters[j]}" for j in range(8)]
        key_str = "\n".join(key_lines)
        ans = ciphertext.lower()
        questions.append(make_question(
            f"t2_attentional_{len(questions)}", "attentional", "cipher_small", 2,
            f"Apply the following substitution cipher to the plaintext.\n\n"
            f"Plaintext: {plaintext}\n\nSubstitution key:\n{key_str}\n\n"
            f"Submit the 8-character ciphertext (case-insensitive).",
            ans, "trimmed-lowercase", client_seed=seed
        ))

    # Subtype 2: trajectory_small (5 questions)
    for i in range(5):
        seed = 8700 + i
        rng = mulberry32(seed)
        nodes = []
        for node_id in range(8):
            x = round(rng() * 20, 1)
            y = round(rng() * 20, 1)
            nodes.append((node_id, x, y))
        visited = [0]
        current = 0
        remaining = set(range(1, 8))
        for step in range(4):
            best_dist = float("inf")
            best_node = -1
            cx, cy = nodes[current][1], nodes[current][2]
            for node_id in remaining:
                nx, ny = nodes[node_id][1], nodes[node_id][2]
                d = math.sqrt((cx - nx) ** 2 + (cy - ny) ** 2)
                if d < best_dist:
                    best_dist = d
                    best_node = node_id
            visited.append(best_node)
            remaining.remove(best_node)
            current = best_node
        data_lines = []
        for node_id, x, y in nodes:
            data_lines.append(f"  Node {node_id}: ({x:.1f}, {y:.1f})")
        data_str = "\n".join(data_lines)
        ans = "-".join(map(str, visited))
        questions.append(make_question(
            f"t2_attentional_{len(questions)}", "attentional", "trajectory_small", 2,
            f"8 nodes have the following 2D positions:\n{data_str}\n\n"
            f"Starting from Node 0, perform a nearest-neighbor traversal for 4 steps "
            f"(always move to the closest unvisited node using Euclidean distance). "
            f"Report the first 5 node IDs in the path (including start) as 'ID-ID-ID-ID-ID'.",
            ans, "exact", client_seed=seed
        ))

    # Subtype 3: logic_small (5 questions)
    for i in range(5):
        seed = 8800 + i
        rng = mulberry32(seed)
        states = [rng() > 0.5 for _ in range(10)]
        gate_names = ["AND", "OR", "XOR"]
        gates = []
        for _ in range(3):
            gate = mulberry32_choice(rng, gate_names)
            operand_idx = mulberry32_int(rng, 0, 9)
            gates.append((gate, operand_idx))
        current_states = states[:]
        gate_descriptions = []
        for g_i, (gate, op_idx) in enumerate(gates):
            new_states = []
            gate_descriptions.append(
                f"  Step {g_i+1}: Apply {gate} with State[{op_idx}] "
                f"(= {'True' if current_states[op_idx] else 'False'})"
            )
            for j in range(10):
                a = current_states[j]
                b = current_states[op_idx]
                if gate == "AND":
                    new_states.append(a and b)
                elif gate == "OR":
                    new_states.append(a or b)
                elif gate == "XOR":
                    new_states.append(a ^ b)
            current_states = new_states
        count_true = sum(1 for s in current_states if s)
        state_str = ", ".join(f"S[{j}]={'T' if states[j] else 'F'}" for j in range(10))
        gate_str = "\n".join(gate_descriptions)
        ans = str(count_true)
        questions.append(make_question(
            f"t2_attentional_{len(questions)}", "attentional", "logic_small", 2,
            f"Initial Boolean states: {state_str}\n\n"
            f"Apply the following gate chain (each gate combines every state with the given operand state):\n{gate_str}\n\n"
            f"After all 3 gate operations, how many of the 10 states are True?",
            ans, "exact", client_seed=seed
        ))


# ============================================================================
# Section 6: Bayesian (15 questions: 3 subtypes x 5 each)
# ============================================================================

def build_bayesian(questions):

    # Subtype 1: dag_posterior_small (5 questions)
    dag_params = [
        (0.30, 0.80, 0.10, 0.90, 0.20),
        (0.20, 0.70, 0.15, 0.85, 0.25),
        (0.40, 0.90, 0.05, 0.95, 0.10),
        (0.10, 0.75, 0.20, 0.80, 0.30),
        (0.50, 0.85, 0.10, 0.70, 0.15),
    ]
    for i in range(5):
        P_A, P_B_A, P_B_nA, P_C_B, P_C_nB = dag_params[i]
        P_C_given_A = P_C_B * P_B_A + P_C_nB * (1 - P_B_A)
        P_C_given_nA = P_C_B * P_B_nA + P_C_nB * (1 - P_B_nA)
        P_C = P_C_given_A * P_A + P_C_given_nA * (1 - P_A)
        P_A_given_C = (P_C_given_A * P_A) / P_C
        ans = f"{P_A_given_C:.6f}"
        questions.append(make_question(
            f"t2_bayesian_{len(questions)}", "bayesian", "dag_posterior_small", 2,
            f"Bayesian network: A -> B -> C.\n"
            f"P(A) = {P_A:.2f}\n"
            f"P(B | A) = {P_B_A:.2f}, P(B | not A) = {P_B_nA:.2f}\n"
            f"P(C | B) = {P_C_B:.2f}, P(C | not B) = {P_C_nB:.2f}\n\n"
            f"Calculate P(A | C). Use the law of total probability and Bayes' theorem. (6 decimal places)",
            ans, "numeric-rounded", 6
        ))

    # Subtype 2: markov_small (5 questions)
    markov_matrices = [
        [[0.5, 0.3, 0.2],
         [0.2, 0.5, 0.3],
         [0.3, 0.2, 0.5]],
        [[0.6, 0.2, 0.2],
         [0.1, 0.7, 0.2],
         [0.3, 0.1, 0.6]],
        [[0.4, 0.4, 0.2],
         [0.3, 0.3, 0.4],
         [0.1, 0.5, 0.4]],
        [[0.7, 0.2, 0.1],
         [0.1, 0.6, 0.3],
         [0.2, 0.3, 0.5]],
        [[0.5, 0.25, 0.25],
         [0.25, 0.5, 0.25],
         [0.15, 0.35, 0.5]],
    ]
    target_states = [0, 1, 2, 0, 1]

    for i in range(5):
        P = np.array(markov_matrices[i])
        target = target_states[i]
        evals, evecs = np.linalg.eig(P.T)
        idx = np.argmin(np.abs(evals - 1.0))
        steady = evecs[:, idx].real
        steady = steady / steady.sum()
        val = float(steady[target])
        ans = f"{val:.6f}"
        matrix_lines = []
        for r in range(3):
            row_str = "  [" + ", ".join(f"{P[r][c]:.2f}" for c in range(3)) + "]"
            matrix_lines.append(row_str)
        matrix_str = "\n".join(matrix_lines)
        questions.append(make_question(
            f"t2_bayesian_{len(questions)}", "bayesian", "markov_small", 2,
            f"A 3-state Markov chain has the following transition matrix (rows are 'from', columns are 'to'):\n{matrix_str}\n\n"
            f"Calculate the steady-state probability of State {target}. "
            f"(The steady state pi satisfies pi * P = pi with sum(pi) = 1.) (6 decimal places)",
            ans, "numeric-rounded", 6
        ))

    # Subtype 3: conditional_small (5 questions)
    bayes_problems = [
        {
            "prevalence": 0.01, "sensitivity": 0.95, "fpr": 0.10,
            "desc": "A disease affects 1% of the population. A test has 95% sensitivity (true positive rate) and 10% false positive rate.",
            "question": "Given a positive test result, what is P(disease | positive)?",
        },
        {
            "prevalence": 0.05, "sensitivity": 0.90, "fpr": 0.05,
            "desc": "A condition affects 5% of patients. A diagnostic has 90% sensitivity and 5% false positive rate.",
            "question": "Given a positive result, what is P(condition | positive)?",
        },
        {
            "prevalence": 0.001, "sensitivity": 0.99, "fpr": 0.02,
            "desc": "A rare disease affects 0.1% of the population. A screening test has 99% sensitivity and 2% false positive rate.",
            "question": "Given a positive test, what is P(disease | positive)?",
        },
        {
            "prevalence": 0.10, "sensitivity": 0.80, "fpr": 0.15,
            "desc": "A defect occurs in 10% of manufactured parts. An inspection catches 80% of defective parts (sensitivity) with a 15% false positive rate.",
            "question": "If a part fails inspection, what is P(defective | failed)?",
        },
        {
            "prevalence": 0.02, "sensitivity": 0.98, "fpr": 0.03,
            "desc": "A security threat is present in 2% of network packets. An IDS has 98% detection rate (sensitivity) and 3% false positive rate.",
            "question": "Given an alert, what is P(threat | alert)?",
        },
    ]
    for i in range(5):
        prob = bayes_problems[i]
        prev = prob["prevalence"]
        sens = prob["sensitivity"]
        fpr = prob["fpr"]
        p_positive = sens * prev + fpr * (1 - prev)
        p_disease_given_positive = (sens * prev) / p_positive
        ans = f"{p_disease_given_positive:.6f}"
        questions.append(make_question(
            f"t2_bayesian_{len(questions)}", "bayesian", "conditional_small", 2,
            f"{prob['desc']}\n\n"
            f"Use Bayes' theorem: P(D|+) = P(+|D)*P(D) / [P(+|D)*P(D) + P(+|~D)*P(~D)]\n\n"
            f"Prevalence = {prev}, Sensitivity = {sens}, False positive rate = {fpr}\n\n"
            f"{prob['question']} (6 decimal places)",
            ans, "numeric-rounded", 6
        ))


# ============================================================================
# Section 7: Crypto Bitwise (15 questions: 3 subtypes x 5 each)
# ============================================================================

def build_crypto_bitwise(questions):

    # Subtype 1: xor_small (5 questions)
    for i in range(5):
        seed = 8900 + i
        rng = mulberry32(seed)
        hex_a = mulberry32_hex_string(rng, 8).upper()
        hex_b = mulberry32_hex_string(rng, 8).upper()
        val_a = int(hex_a, 16)
        val_b = int(hex_b, 16)
        xor_result = val_a ^ val_b
        ans = f"{xor_result:08X}"
        questions.append(make_question(
            f"t2_crypto-bitwise_{len(questions)}", "crypto-bitwise", "xor_small", 2,
            f"Compute the bitwise XOR of these two 8-character hex strings:\n"
            f"  A = {hex_a}\n"
            f"  B = {hex_b}\n\n"
            f"Submit the result as an 8-character uppercase hex string.",
            ans, "hex-lowercase", client_seed=seed
        ))

    # Subtype 2: bit_shift_small (5 questions)
    for i in range(5):
        seed = 9000 + i
        rng = mulberry32(seed)
        val = mulberry32_int(rng, 0, 0xFFFF)
        mask = 0xFFFF
        ops = []
        op_names = ["SHL", "SHR", "XOR"]
        for _ in range(3):
            op = mulberry32_choice(rng, op_names)
            if op == "XOR":
                operand = mulberry32_int(rng, 0, 0xFFFF)
                ops.append((op, operand))
            else:
                shift_amt = mulberry32_int(rng, 1, 8)
                ops.append((op, shift_amt))
        current = val
        op_lines = []
        for op, operand in ops:
            if op == "SHL":
                current = (current << operand) & mask
                op_lines.append(f"  {op} {operand} (shift left by {operand} bits, keep lower 16 bits)")
            elif op == "SHR":
                current = (current >> operand) & mask
                op_lines.append(f"  {op} {operand} (shift right by {operand} bits)")
            elif op == "XOR":
                current = (current ^ operand) & mask
                op_lines.append(f"  XOR 0x{operand:04X} (bitwise XOR with 0x{operand:04X})")
        ops_str = "\n".join(op_lines)
        ans = f"{current:04X}"
        questions.append(make_question(
            f"t2_crypto-bitwise_{len(questions)}", "crypto-bitwise", "bit_shift_small", 2,
            f"Starting value: 0x{val:04X} (16-bit)\n\n"
            f"Apply these operations in order:\n{ops_str}\n\n"
            f"Submit the final 16-bit value as a 4-character uppercase hex string.",
            ans, "hex-lowercase", client_seed=seed
        ))

    # Subtype 3: aes_small (5 questions)
    for i in range(5):
        seed = 9100 + i
        rng = mulberry32(seed)
        matrix = [mulberry32_int(rng, 0, 255) for _ in range(16)]
        shifted = [0] * 16
        for r in range(4):
            for c in range(4):
                shifted[r + 4 * c] = matrix[r + 4 * ((c + r) % 4)]
        matrix_lines = []
        for r in range(4):
            row_vals = [f"{matrix[r + 4*c]:02X}" for c in range(4)]
            matrix_lines.append(f"  Row {r}: " + " ".join(row_vals))
        matrix_str = "\n".join(matrix_lines)
        ans = f"{shifted[1]:02X}{shifted[5]:02X}{shifted[9]:02X}{shifted[13]:02X}"
        questions.append(make_question(
            f"t2_crypto-bitwise_{len(questions)}", "crypto-bitwise", "aes_small", 2,
            f"Perform the AES ShiftRows operation on this 4x4 byte matrix (column-major order):\n{matrix_str}\n\n"
            f"ShiftRows: row 0 shifts by 0, row 1 left by 1, row 2 left by 2, row 3 left by 3 positions.\n"
            f"The matrix is in column-major layout: Row r, Col c is at index r + 4*c.\n"
            f"After ShiftRows, row r, col c gets the value from row r, col (c+r)%4.\n"
            f"Output the resulting Row 1 as 8 uppercase hex characters (4 bytes).",
            ans, "hex-lowercase", client_seed=seed
        ))


# ============================================================================
# Main: build all 105 + validate + write
# ============================================================================

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_dir = os.path.join(project_root, "lib", "data")
    os.makedirs(data_dir, exist_ok=True)

    print("Generating 105 Tier 2 questions...")
    questions = []

    build_topology(questions)
    print(f"  Section 1 (topology): {len(questions)} questions")

    count_before = len(questions)
    build_parallel_state(questions)
    print(f"  Section 2 (parallel-state): {len(questions) - count_before} questions ({len(questions)} total)")

    count_before = len(questions)
    build_recursive_exec(questions)
    print(f"  Section 3 (recursive-exec): {len(questions) - count_before} questions ({len(questions)} total)")

    count_before = len(questions)
    build_micro_pattern(questions)
    print(f"  Section 4 (micro-pattern): {len(questions) - count_before} questions ({len(questions)} total)")

    count_before = len(questions)
    build_attentional(questions)
    print(f"  Section 5 (attentional): {len(questions) - count_before} questions ({len(questions)} total)")

    count_before = len(questions)
    build_bayesian(questions)
    print(f"  Section 6 (bayesian): {len(questions) - count_before} questions ({len(questions)} total)")

    count_before = len(questions)
    build_crypto_bitwise(questions)
    print(f"  Section 7 (crypto-bitwise): {len(questions) - count_before} questions ({len(questions)} total)")

    # ── Validation ──────────────────────────────────────────────────────────
    print(f"\nValidating {len(questions)} questions...")
    errors = []

    if len(questions) != 105:
        errors.append(f"Expected 105 questions, got {len(questions)}")

    ids = [q["id"] for q in questions]
    if len(set(ids)) != len(ids):
        dupes = [x for x in ids if ids.count(x) > 1]
        errors.append(f"Duplicate IDs: {set(dupes)}")

    for q in questions:
        h = q["answerHash"]
        if len(h) != 64 or not all(c in "0123456789abcdef" for c in h):
            errors.append(f"{q['id']}: invalid hash format: {h[:20]}...")

    for q in questions:
        expected = normalize_and_hash(q["_verifiedAnswer"], q["normalization"], q.get("decimalPlaces"))
        if expected != q["answerHash"]:
            errors.append(f"{q['id']}: hash mismatch! answer='{q['_verifiedAnswer']}' norm={q['normalization']} dp={q.get('decimalPlaces')}")

    for q in questions:
        if q["tier"] != 2:
            errors.append(f"{q['id']}: tier is {q['tier']}, expected 2")

    for q in questions:
        if q["clientSeed"] is not None and not isinstance(q["clientSeed"], int):
            errors.append(f"{q['id']}: clientSeed is not int: {q['clientSeed']}")

    section_counts = {}
    for q in questions:
        section_counts[q["section"]] = section_counts.get(q["section"], 0) + 1
    expected_sections = ["topology", "parallel-state", "recursive-exec", "micro-pattern",
                         "attentional", "bayesian", "crypto-bitwise"]
    for sec in expected_sections:
        if section_counts.get(sec, 0) != 15:
            errors.append(f"Section '{sec}' has {section_counts.get(sec, 0)} questions, expected 15")

    if errors:
        print(f"\nFAILED with {len(errors)} errors:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print(f"  All {len(questions)} questions valid")
        print(f"  All IDs unique")
        print(f"  All hashes valid 64-char hex")
        print(f"  All _verifiedAnswer values hash correctly")
        print(f"  All questions have tier=2")
        print(f"  Section distribution: {section_counts}")

    # ── Print summary ───────────────────────────────────────────────────────
    print("\n--- QUESTION SUMMARY ---")
    for sec in expected_sections:
        sec_qs = [q for q in questions if q["section"] == sec]
        subtypes = {}
        for q in sec_qs:
            subtypes[q["subtype"]] = subtypes.get(q["subtype"], 0) + 1
        print(f"\n  {sec} ({len(sec_qs)} questions):")
        for st, count in sorted(subtypes.items()):
            print(f"    {st}: {count}")
        sample = sec_qs[0]
        print(f"    Sample: {sample['id']} -> {sample['_verifiedAnswer']}")

    # ── Write dataset ───────────────────────────────────────────────────────
    output_path = os.path.join(data_dir, "tier2_questions.json")
    with open(output_path, "w") as f:
        json.dump(questions, f, indent=2)
    print(f"\nWrote {output_path} ({os.path.getsize(output_path)} bytes)")
    print(f"\nDone. {len(questions)} Tier 2 questions generated and validated.")


if __name__ == "__main__":
    main()
