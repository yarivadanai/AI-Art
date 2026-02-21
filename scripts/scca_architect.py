#!/usr/bin/env python3
"""
SCCA Master Dataset Generator (Deterministic PRNG Architecture)

Generates 350 questions (7 sections x 5 subtypes x 10 each) with SHA-256 hashed
answers. Uses mulberry32 PRNG for all seed-dependent computations to guarantee
parity with the TypeScript client.

Outputs:
  - lib/data/scca_master_dataset.json
  - lib/data/mulberry32_parity.json
"""

import hashlib
import json
import math
import os
import sys
import numpy as np
from scipy.special import gamma


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


def make_question(qid, section, subtype, prompt, answer, normalization,
                  decimal_places=None, input_type="text", options=None,
                  display=None, client_seed=None, interactive_config=None):
    return {
        "id": qid,
        "section": section,
        "subtype": subtype,
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
# Section 1: Topology (no PRNG dependency -- uses numpy.random.seed)
# ============================================================================

def build_sec1(subtype, i):
    dim = 10 + i

    if subtype == 0:  # simplex_centroid
        dist = 1.0 / math.sqrt(2 * dim * (dim + 1))
        ans = f"{dist:.6f}"
        return make_question(
            f"sec1_sub0_{i}", "topology", "simplex_centroid",
            f"A {dim}-dimensional regular simplex has edge length 1. Calculate the exact Euclidean distance between its centroid and the centroid of one of its ({dim-1})-faces. (6 decimal places)",
            ans, "numeric-rounded", 6
        )

    elif subtype == 1:  # hyperplane_projection
        np.random.seed(100 + i)
        v = np.random.randint(-10, 10, dim)
        u = np.random.randint(-5, 5, dim)
        u[u == 0] = 1
        proj = v - (np.dot(v, u) / np.dot(u, u)) * u
        ans = f"{proj[3]:.6f}"
        return make_question(
            f"sec1_sub1_{i}", "topology", "hyperplane_projection",
            f"Vector V (dim={dim}) is projected orthogonally onto normal vector U. Given V={v.tolist()} and U={u.tolist()}, what is the exact 4th component (index 3) of the projected vector? (6 decimal places)",
            ans, "numeric-rounded", 6
        )

    elif subtype == 2:  # torus_geodesic
        v1, v2 = 3 + i, 7 + (i * 2)
        ans = f"{(1.0 / abs(v1 - v2)):.6f}"
        return make_question(
            f"sec1_sub2_{i}", "topology", "torus_geodesic",
            f"A point in a {dim}-torus starts at origin and moves with velocity components v_3 = {v1}, v_6 = {v2}. At what exact time t>0 does it first intersect the sub-plane x_3 = x_6? (6 decimal places)",
            ans, "numeric-rounded", 6
        )

    elif subtype == 3:  # n_ball_volume
        radius = 2.5 + (i * 0.1)
        vol = (math.pi ** (dim / 2) / gamma(dim / 2 + 1)) * (radius ** dim)
        ans = f"{vol:.6f}"
        return make_question(
            f"sec1_sub3_{i}", "topology", "n_ball_volume",
            f"Calculate the exact hyper-volume of a {dim}-dimensional hyper-sphere with radius R = {radius:.1f}. (6 decimal places)",
            ans, "numeric-rounded", 6
        )

    elif subtype == 4:  # affine_transform
        np.random.seed(140 + i)
        mat = np.random.rand(dim, dim)
        vec = np.random.rand(dim)
        mag = float(np.linalg.norm(np.dot(mat, vec)))
        ans = f"{mag:.6f}"
        return make_question(
            f"sec1_sub4_{i}", "topology", "affine_transform",
            f"Apply a procedurally generated {dim}x{dim} transformation matrix (Seed: {140+i}) to a random vector (Seed: {140+i}). Output exact magnitude of resulting vector. (6 decimal places)",
            ans, "numeric-rounded", 6
        )


# ============================================================================
# Section 2: Parallel State (ALL use mulberry32)
# ============================================================================

def build_sec2(subtype, i):
    seed = 2000 + (subtype * 100) + i

    if subtype == 0:  # n_body_collision
        rng = mulberry32(seed)
        # Generate 5000 velocity vectors
        velocities = []
        for _ in range(5000):
            vx = rng() * 200 - 100
            vy = rng() * 200 - 100
            velocities.append((vx, vy))
        # Pick 2 indices deterministically from PRNG stream to plant duplicates
        idx1 = mulberry32_int(rng, 0, 2499)
        idx2 = mulberry32_int(rng, 2500, 4999)
        # Plant: make idx2's velocity identical to idx1's
        velocities[idx2] = velocities[idx1]
        ans = f"{min(idx1, idx2)},{max(idx1, idx2)}"
        return make_question(
            f"sec2_sub0_{i}", "parallel-state", "n_body_collision",
            "5,000 independent particles rendered below. Two share identical velocity vectors. Report their IDs as 'ID1,ID2' ascending.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 1:  # hex_stream_sync
        rng = mulberry32(seed)
        # Generate 1000 hex streams (each 64 chars)
        streams = []
        for _ in range(1000):
            streams.append(mulberry32_hex_string(rng, 64))
        # Pick 3 indices deterministically, plant identical 8-char subsequence
        indices = sorted([
            mulberry32_int(rng, 0, 333),
            mulberry32_int(rng, 334, 666),
            mulberry32_int(rng, 667, 999),
        ])
        # Generate the shared subsequence
        shared_sub = mulberry32_hex_string(rng, 8)
        # Plant at position 0 of each selected stream
        for idx in indices:
            s = list(streams[idx])
            for c_i, c in enumerate(shared_sub):
                s[c_i] = c
            streams[idx] = "".join(s)
        ans = ",".join(map(str, indices))
        return make_question(
            f"sec2_sub1_{i}", "parallel-state", "hex_stream_sync",
            "1,000 hex streams rendered below. 3 streams emit an identical 8-char subsequence at position 0. Report their IDs as 'ID1,ID2,ID3' ascending.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 2:  # prime_matrix_async
        rng = mulberry32(seed)
        # Generate 100x100 hex matrix (each cell 2 hex chars = 0-255)
        matrix = []
        for _ in range(10000):
            matrix.append(mulberry32_int(rng, 0, 255))
        # Pick a cell deterministically
        px = mulberry32_int(rng, 0, 99)
        py = mulberry32_int(rng, 0, 99)
        # Plant a prime hex value at that cell
        prime_val = 251  # largest prime < 256
        matrix[py * 100 + px] = prime_val
        ans = f"{px},{py}"
        return make_question(
            f"sec2_sub2_{i}", "parallel-state", "prime_matrix_async",
            f"100x100 hex matrix rendered below. One cell has been set to the value {prime_val:02X} (decimal {prime_val}). Submit its coordinate as 'X,Y'.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 3:  # frequency_phase
        rng = mulberry32(seed)
        # Generate 50 sine wave parameters: amplitude and frequency
        params = []
        for _ in range(50):
            amp = rng() * 10
            freq = rng() * 5 + 0.1
            phase = rng() * 2 * math.pi
            params.append((amp, freq, phase))
        # Find actual zero-crossing: sum of all sin(freq*t + phase)*amp == 0
        # Search PRNG index space for closest to zero
        best_idx = 0
        best_val = float("inf")
        for t_idx in range(100001):
            t = t_idx * 0.001
            total = sum(a * math.sin(f * t + p) for a, f, p in params)
            if abs(total) < best_val:
                best_val = abs(total)
                best_idx = t_idx
        ans = str(best_idx)
        return make_question(
            f"sec2_sub3_{i}", "parallel-state", "frequency_phase",
            "50 sine waves with parameters rendered below. Find the time index (0-100000, step=0.001) where the sum of all amplitudes is closest to 0.00000.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 4:  # ledger_anomaly
        rng = mulberry32(seed)
        # Generate 500 transactions with timestamps
        transactions = []
        ts = 1000000
        for tx_i in range(500):
            delta = mulberry32_int(rng, 1, 100)
            ts += delta
            amount = mulberry32_int(rng, 100, 99999)
            transactions.append({"id": f"TX_{tx_i:06d}", "ts": ts, "delta": delta, "amount": amount})
        # Pick one to violate modulo-7 rule (delta % 7 == 0 is the violation)
        plant_idx = mulberry32_int(rng, 0, 499)
        # Ensure the planted tx has delta divisible by 7, others don't
        # Adjust planted transaction's delta to be divisible by 7
        old_delta = transactions[plant_idx]["delta"]
        new_delta = old_delta + (7 - old_delta % 7) if old_delta % 7 != 0 else old_delta
        transactions[plant_idx]["delta"] = new_delta
        # Make sure no other transaction accidentally has delta % 7 == 0
        for tx_i, tx in enumerate(transactions):
            if tx_i != plant_idx and tx["delta"] % 7 == 0:
                transactions[tx_i]["delta"] += 1
        ans = transactions[plant_idx]["id"]
        return make_question(
            f"sec2_sub4_{i}", "parallel-state", "ledger_anomaly",
            "500 transaction logs rendered below. Find the single TX_ID where the timestamp delta violates the Modulo-7 rule (delta divisible by 7).",
            ans, "exact", client_seed=seed
        )


# ============================================================================
# Section 3: Recursive Exec
# ============================================================================

def build_sec3(subtype, i):
    if subtype == 0:  # power_tower
        A, B, C, M = 7 + i, 11 + i, 13 + i, 10007 + i
        if not is_prime(M):
            M += 1
            while not is_prime(M):
                M += 1
        ans = str(pow(A, pow(B, C, M - 1), M))
        return make_question(
            f"sec3_sub0_{i}", "recursive-exec", "power_tower",
            f"Calculate exact integer value of {A}^({B}^{C}) modulo {M}.",
            ans, "exact"
        )

    elif subtype == 1:  # deep_array_shift
        N = 50000 + i * 100
        primes = sum(1 for x in range(2, N + 1) if is_prime(x))
        composites = (N - 1) - primes
        ans = str((0 + ((primes - composites) % 5)) % 5)
        return make_question(
            f"sec3_sub1_{i}", "recursive-exec", "deep_array_shift",
            f"Array A=[0,1,2,3,4]. For N=1 to {N}: shift left by 1 if N is prime, else shift right by 1. Value at index 0 upon completion?",
            ans, "exact"
        )

    elif subtype == 2:  # matrix_recurrence
        n = 100000 + i
        A_val, B_val, M = 3, 5, 1009

        def mat_pow(m, p, mod):
            res = np.eye(2, dtype=object)
            base = m % mod
            while p > 0:
                if p % 2 == 1:
                    res = np.dot(res, base) % mod
                base = np.dot(base, base) % mod
                p //= 2
            return res

        final_mat = mat_pow(np.array([[A_val, B_val], [1, 0]], dtype=object), n - 1, M)
        ans = str(int(final_mat[0][0] * 1) % M)
        return make_question(
            f"sec3_sub2_{i}", "recursive-exec", "matrix_recurrence",
            f"Given f(0)=0, f(1)=1. f(n) = ({A_val}*f(n-1) + {B_val}*f(n-2)) mod {M}. Evaluate f({n}).",
            ans, "exact"
        )

    elif subtype == 3:  # deep_fsm -- FIXED: actually simulate
        seed = 3300 + i
        rng = mulberry32(seed)
        num_inputs = 25000 + i
        # Generate inputs using mulberry32
        inputs = [mulberry32_int(rng, 0, 255) for _ in range(num_inputs)]
        # Simulate FSM: state = (state + input%7) % 50
        state = 0
        for inp in inputs:
            state = (state + inp % 7) % 50
        ans = str(state)
        return make_question(
            f"sec3_sub3_{i}", "recursive-exec", "deep_fsm",
            f"A 50-state FSM starts at state 0. For each of {num_inputs} inputs, state = (state + input%7) % 50. Inputs generated from seed {seed}. Determine final state.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 4:  # bounded_ackermann -- closed form for m=3
        n_val = i + 5
        # Ackermann(3, n) = 2^(n+3) - 3 (exact closed form)
        ans = str(pow(2, n_val + 3, 1000) - 3)
        if int(ans) < 0:
            ans = str(int(ans) + 1000)
        return make_question(
            f"sec3_sub4_{i}", "recursive-exec", "bounded_ackermann",
            f"Evaluate bounded Ackermann H(3, {n_val}) modulo 1000. Recursion depth capped at 1000 (returns n%1000 at cap).",
            ans, "exact"
        )


# ============================================================================
# Section 4: Micro Pattern (ALL use mulberry32)
# ============================================================================

def build_sec4(subtype, i):
    seed = 4000 + (subtype * 100) + i

    if subtype == 0:  # variance_drift
        rng = mulberry32(seed)
        # Generate 100,000 floats using Box-Muller from mulberry32
        # Plant one block of 15 with slightly different variance
        num_floats = 100000
        block_size = 15
        plant_start = mulberry32_int(rng, 1000, num_floats - block_size - 1000)
        # Generate all floats -- use pairs for Box-Muller
        floats = []
        for _ in range(num_floats // 2 + 1):
            u1 = max(rng(), 1e-10)
            u2 = rng()
            z0 = math.sqrt(-2 * math.log(u1)) * math.cos(2 * math.pi * u2)
            z1 = math.sqrt(-2 * math.log(u1)) * math.sin(2 * math.pi * u2)
            floats.append(z0)
            floats.append(z1)
        floats = floats[:num_floats]
        # Plant: multiply block by 1.05 (variance drift)
        for j in range(plant_start, plant_start + block_size):
            floats[j] *= 1.05
        ans = str(plant_start)
        return make_question(
            f"sec4_sub0_{i}", "micro-pattern", "variance_drift",
            f"100,000 N(0,1) floats rendered below. One block of {block_size} consecutive values uses N(0,1.05). Submit the starting index.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 1:  # bitwise_palindrome
        rng = mulberry32(seed)
        num_chars = 50000
        # Generate hex chars
        chars = list(mulberry32_hex_string(rng, num_chars))
        # Pick a starting index for a 64-char palindrome
        plant_start = mulberry32_int(rng, 100, num_chars - 65)
        # Generate a 32-char half, mirror it to create palindrome
        half = mulberry32_hex_string(rng, 32)
        palindrome = half + half[::-1]
        for j in range(64):
            chars[plant_start + j] = palindrome[j]
        ans = str(plant_start)
        return make_question(
            f"sec4_sub1_{i}", "micro-pattern", "bitwise_palindrome",
            "Within 50,000 hex chars rendered below, find the single 64-char block that is a perfect palindrome. Submit starting index.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 2:  # taylor_series
        rng = mulberry32(seed)
        # Maclaurin series for sin(x): 0, 1, 0, -1/6, 0, 1/120, 0
        # We'll look for 7 consecutive floats matching these coefficients (within tolerance)
        target = [0.0, 1.0, 0.0, -1.0/6.0, 0.0, 1.0/120.0, 0.0]
        num_floats = 250000
        # Generate float stream
        floats = []
        for _ in range(num_floats):
            floats.append(rng() * 2 - 1)  # range [-1, 1]
        # Plant the target sequence at a deterministic index
        plant_idx = mulberry32_int(rng, 10000, num_floats - 8)
        for j in range(7):
            floats[plant_idx + j] = target[j]
        ans = str(plant_idx)
        return make_question(
            f"sec4_sub2_{i}", "micro-pattern", "taylor_series",
            "Float stream rendered below. Find the index where 7 consecutive values match the first 7 Maclaurin coefficients of sin(x): [0, 1, 0, -1/6, 0, 1/120, 0]. Submit starting index.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 3:  # hash_anomaly
        rng = mulberry32(seed)
        num_strings = 10000
        # Generate 10000 32-byte hex strings
        strings = []
        for _ in range(num_strings):
            strings.append(mulberry32_hex_string(rng, 64))  # 32 bytes = 64 hex chars
        # Plant one whose SHA-256 starts with "00000"
        # We keep trying deterministic modifications until we find one
        plant_idx = mulberry32_int(rng, 0, num_strings - 1)
        # Brute force a suffix that produces leading "00000"
        base = strings[plant_idx][:58]  # keep first 58 chars, vary last 6
        found = False
        for attempt in range(1000000):
            candidate = base + f"{attempt:06x}"
            h = hashlib.sha256(candidate.encode()).hexdigest()
            if h.startswith("00000"):
                strings[plant_idx] = candidate
                found = True
                break
        if not found:
            # Fallback: just use a known hash-collision string
            for attempt in range(10000000):
                candidate = f"{attempt:064x}"
                h = hashlib.sha256(candidate.encode()).hexdigest()
                if h.startswith("00000"):
                    strings[plant_idx] = candidate
                    found = True
                    break
        ans = str(plant_idx)
        return make_question(
            f"sec4_sub3_{i}", "micro-pattern", "hash_anomaly",
            "10,000 32-byte hex strings rendered below. Identify the index of the string whose SHA-256 hash begins with '00000'.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 4:  # lsb_steganography
        rng = mulberry32(seed)
        # Generate pixel values for a virtual 1024x1024 image
        # We only need to track LSBs. Plant one pixel where LSB(R,G,B) = (1,1,1) = 7
        # All others should NOT have all three LSBs = 1
        plant_x = mulberry32_int(rng, 0, 1023)
        plant_y = mulberry32_int(rng, 0, 1023)
        ans = f"{plant_x},{plant_y}"
        return make_question(
            f"sec4_sub4_{i}", "micro-pattern", "lsb_steganography",
            "1024x1024 RGBA pixel array rendered below. Identify the 'X,Y' coordinate where LSBs of R, G, B form the binary integer 7 (all three LSBs are 1).",
            ans, "exact", client_seed=seed
        )


# ============================================================================
# Section 5: Attentional (ALL use mulberry32)
# ============================================================================

def build_sec5(subtype, i):
    seed = 5000 + (subtype * 100) + i

    if subtype == 0:  # async_multi_axis -- FIXED: use mulberry32
        rng = mulberry32(seed)
        digits = "".join(str(mulberry32_int(rng, 0, 9)) for _ in range(15))
        return make_question(
            f"sec5_sub0_{i}", "attentional", "async_multi_axis",
            "A 15-digit target sequence has been generated below. Type the exact sequence as your answer.",
            digits, "exact", client_seed=seed
        )

    elif subtype == 1:  # quad_logic_inversion -- FIXED: real computation
        rng = mulberry32(seed)
        # Generate 100 Boolean states (4 quadrants x 25 time steps)
        steps = 25
        states = []  # each: (TL, TR, BL, BR)
        for _ in range(steps):
            tl = rng() > 0.5
            tr = rng() > 0.5
            bl = rng() > 0.5
            br = rng() > 0.5
            states.append((tl, tr, bl, br))
        # Count how many times (TL XOR BR) == (TR AND BL)
        count = 0
        for tl, tr, bl, br in states:
            if (tl ^ br) == (tr and bl):
                count += 1
        ans = str(count)
        return make_question(
            f"sec5_sub1_{i}", "attentional", "quad_logic_inversion",
            f"4 quadrants display Boolean states over {steps} time steps. Submit the number of steps where (TL XOR BR) == (TR AND BL).",
            ans, "exact", client_seed=seed
        )

    elif subtype == 2:  # n_back_desync -- FIXED: use mulberry32 for stimuli
        rng = mulberry32(seed)
        # Generate visual stimulus sequence (20 items, 3-back)
        visual = [mulberry32_choice(rng, list("ABCD")) for _ in range(20)]
        # Generate audio stimulus sequence (20 items, 2-back)
        audio = [mulberry32_choice(rng, list("WXYZ")) for _ in range(20)]
        # Compute correct n-back responses
        # V if visual[i] == visual[i-3], A if audio[i] == audio[i-2]
        response = []
        for idx in range(20):
            v_match = idx >= 3 and visual[idx] == visual[idx - 3]
            a_match = idx >= 2 and audio[idx] == audio[idx - 2]
            if v_match and a_match:
                response.append("B")  # Both
            elif v_match:
                response.append("V")
            elif a_match:
                response.append("A")
            else:
                response.append("N")  # Neither
        ans = "".join(response)
        return make_question(
            f"sec5_sub2_{i}", "attentional", "n_back_desync",
            "Two stimulus sequences are shown below: a Visual stream (letters A-D) and an Audio stream (letters W-Z). For each of 20 time steps, check: does the visual letter match the one 3 steps back? Does the audio letter match 2 steps back? Respond V=visual match only, A=audio match only, B=both, N=neither. Submit 20-char string.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 3:  # trajectory_spline -- FIXED: use mulberry32
        rng = mulberry32(seed)
        # Generate 20 node positions in 2D
        nodes = []
        for node_id in range(20):
            x = rng() * 100
            y = rng() * 100
            nodes.append((node_id, x, y))
        # Compute nearest-neighbor traversal starting from node 0
        visited = [0]
        current = 0
        remaining = set(range(1, 20))
        while remaining:
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
        ans = "-".join(map(str, visited[:5]))  # First 5 nodes in traversal
        return make_question(
            f"sec5_sub3_{i}", "attentional", "trajectory_spline",
            "20 nodes with 2D positions rendered below. Starting from node 0, compute the nearest-neighbor traversal. Submit first 5 node IDs: 'ID-ID-ID-ID-ID'.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 4:  # peripheral_cipher -- FIXED: use mulberry32
        rng = mulberry32(seed)
        # Generate plaintext (20 uppercase letters)
        alpha = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
        plaintext = "".join(mulberry32_choices(rng, alpha, 20))
        # Generate substitution key (permutation of alphabet)
        key = alpha[:]
        # Fisher-Yates shuffle with mulberry32
        for j in range(25, 0, -1):
            k = mulberry32_int(rng, 0, j)
            key[j], key[k] = key[k], key[j]
        # Apply substitution cipher
        sub_map = {alpha[j]: key[j] for j in range(26)}
        ciphertext = "".join(sub_map[c] for c in plaintext)
        ans = ciphertext
        return make_question(
            f"sec5_sub4_{i}", "attentional", "peripheral_cipher",
            f"Plaintext and substitution cipher key shown below. Apply the substitution cipher to the 20-character plaintext. Submit the 20-character ciphertext.",
            ans, "trimmed-lowercase", client_seed=seed
        )


# ============================================================================
# Section 6: Bayesian
# ============================================================================

def build_sec6(subtype, i):
    if subtype == 0:  # dag_posterior (no PRNG needed)
        P_A = 0.1 + (i * 0.01)
        numerator = P_A * 0.9 * 0.8
        denominator = (P_A * 0.9 * 0.8) + ((1 - P_A) * 0.05 * 0.3)
        ans = f"{numerator / denominator:.6f}"
        return make_question(
            f"sec6_sub0_{i}", "bayesian", "dag_posterior",
            f"Nodes A,B,C. P(A)={P_A:.2f}, P(B|A)=0.9, P(B|~A)=0.05, P(C|A,B)=0.8, P(C|~A,B)=0.3. Calculate exact P(A | B, C). (6 decimal places)",
            ans, "numeric-rounded", 6
        )

    elif subtype == 1:  # hmm_viterbi -- FIXED: real Viterbi
        seed = 6100 + i
        rng = mulberry32(seed)
        n_states = 5
        n_obs = 4
        seq_len = 500
        # Generate transition matrix (n_states x n_states)
        trans = []
        for s in range(n_states):
            row = [rng() for _ in range(n_states)]
            total = sum(row)
            trans.append([v / total for v in row])
        # Generate emission matrix (n_states x n_obs)
        emit = []
        for s in range(n_states):
            row = [rng() for _ in range(n_obs)]
            total = sum(row)
            emit.append([v / total for v in row])
        # Generate initial probs
        init = [rng() for _ in range(n_states)]
        init_total = sum(init)
        init = [v / init_total for v in init]
        # Generate observation sequence
        observations = [mulberry32_int(rng, 0, n_obs - 1) for _ in range(seq_len)]
        # Run Viterbi algorithm
        # V[t][s] = max probability of state sequence ending in state s at time t
        import math as m
        log_init = [m.log(max(p, 1e-300)) for p in init]
        log_trans = [[m.log(max(p, 1e-300)) for p in row] for row in trans]
        log_emit = [[m.log(max(p, 1e-300)) for p in row] for row in emit]
        V = [log_init[s] + log_emit[s][observations[0]] for s in range(n_states)]
        path = [[s] for s in range(n_states)]
        for t in range(1, seq_len):
            new_V = []
            new_path = []
            for s in range(n_states):
                candidates = [(V[prev] + log_trans[prev][s] + log_emit[s][observations[t]], prev) for prev in range(n_states)]
                best_val, best_prev = max(candidates, key=lambda x: x[0])
                new_V.append(best_val)
                new_path.append(path[best_prev] + [s])
            V = new_V
            path = new_path
        best_final = max(range(n_states), key=lambda s: V[s])
        # Answer is the final state (500th, index 499)
        ans = str(path[best_final][-1])
        return make_question(
            f"sec6_sub1_{i}", "bayesian", "hmm_viterbi",
            f"HMM with {n_states} states, {n_obs} observation symbols, {seq_len}-step sequence. Parameters and observations rendered below. Report the final hidden state in the Viterbi path.",
            ans, "exact", client_seed=seed
        )

    elif subtype == 2:  # kl_divergence (uses numpy.random.seed)
        np.random.seed(6200 + i)
        P = np.random.dirichlet(np.ones(100))
        Q = np.random.dirichlet(np.ones(100))
        kl = float(np.sum(P * np.log(P / Q)))
        ans = f"{kl:.6f}"
        return make_question(
            f"sec6_sub2_{i}", "bayesian", "kl_divergence",
            f"Calculate exact KL divergence D_KL(P||Q) between two 100-dim Dirichlet distributions (Seed: {6200+i}). (6 decimal places)",
            ans, "numeric-rounded", 6
        )

    elif subtype == 3:  # gmm_update -- FIXED: real EM step
        seed = 6300 + i
        rng = mulberry32(seed)
        # Generate 3 cluster centers (1D for simplicity)
        centers = [rng() * 10 for _ in range(3)]
        # Generate 1000 data points from these clusters
        n_points = 1000
        data_points = []
        for _ in range(n_points):
            cluster = mulberry32_int(rng, 0, 2)
            # Point near center with some noise
            noise = (rng() - 0.5) * 2  # [-1, 1]
            data_points.append(centers[cluster] + noise)
        # Run one EM update step for cluster 0
        # E-step: compute responsibilities assuming equal priors and unit variance
        responsibilities = []
        for dp in data_points:
            dists = [math.exp(-0.5 * (dp - c) ** 2) for c in centers]
            total = sum(dists)
            responsibilities.append([d / total for d in dists])
        # M-step: update mean of cluster 0
        num = sum(responsibilities[j][0] * data_points[j] for j in range(n_points))
        den = sum(responsibilities[j][0] for j in range(n_points))
        new_mean = num / den
        ans = f"{new_mean:.6f}"
        return make_question(
            f"sec6_sub3_{i}", "bayesian", "gmm_update",
            "3-cluster 1D GMM parameters and 1000 data points rendered below. After one EM step with equal priors and unit variance, report the updated mean of Cluster 0. (6 decimal places)",
            ans, "numeric-rounded", 6, client_seed=seed
        )

    elif subtype == 4:  # markov_100x100 (uses numpy.random.seed)
        np.random.seed(6400 + i)
        P = np.random.rand(50, 50)
        P = P / P.sum(axis=1)[:, np.newaxis]
        evals, evecs = np.linalg.eig(P.T)
        steady = evecs[:, np.isclose(evals, 1)][:, 0]
        val = (steady / steady.sum())[7].real
        ans = f"{val:.6f}"
        return make_question(
            f"sec6_sub4_{i}", "bayesian", "markov_100x100",
            f"Given a 50x50 PRNG transition matrix (Seed: {6400+i}), calculate exact steady-state probability of State 7. (6 decimal places)",
            ans, "numeric-rounded", 6
        )


# ============================================================================
# Section 7: Crypto Bitwise
# ============================================================================

def build_sec7(subtype, i):
    seed = 7000 + (subtype * 100) + i

    if subtype == 0:  # xor_1024bit
        rng = mulberry32(seed)
        # Generate 5 x 256-char hex strings using mulberry32
        values = []
        for _ in range(5):
            hex_str = mulberry32_hex_string(rng, 256).upper()
            values.append(int(hex_str, 16))
        xor_val = 0
        for v in values:
            xor_val ^= v
        ans = f"{xor_val:0256X}"
        return make_question(
            f"sec7_sub0_{i}", "crypto-bitwise", "xor_1024bit",
            "Perform bitwise XOR across five 1024-bit hex strings rendered below. Submit resulting 256-char uppercase hex string.",
            ans, "hex-lowercase", client_seed=seed
        )

    elif subtype == 1:  # aes_state_matrix
        rng = mulberry32(seed)
        # Generate 4x4 state matrix (16 bytes)
        matrix = [mulberry32_int(rng, 0, 255) for _ in range(16)]
        # AES ShiftRows: row 0 no shift, row 1 shift left 1, row 2 shift left 2, row 3 shift left 3
        # Matrix is column-major: index = row + 4*col
        # Row r, Col c -> index r + 4*c
        # After ShiftRows: row r, col c -> row r, col (c+r)%4
        shifted = [0] * 16
        for r in range(4):
            for c in range(4):
                shifted[r + 4 * c] = matrix[r + 4 * ((c + r) % 4)]
        # Output 2nd row (row index 1): shifted[1], shifted[5], shifted[9], shifted[13]
        ans = f"{shifted[1]:02X}{shifted[5]:02X}{shifted[9]:02X}{shifted[13]:02X}"
        return make_question(
            f"sec7_sub1_{i}", "crypto-bitwise", "aes_state_matrix",
            "Execute AES ShiftRows on the 4x4 state matrix rendered below. Output the resulting 2nd row as 8 uppercase hex chars.",
            ans, "hex-lowercase", client_seed=seed
        )

    elif subtype == 2:  # massive_lcg
        M = 2 ** 128
        A = 1664526
        C = 1013904223
        X0 = 123456789 + i
        N = 1000000
        A_N = pow(A, N, M)
        geom = (C * (A_N - 1) * pow(A - 1, -1, M)) % M
        ans = f"{((A_N * X0) + geom) % M:032X}"
        return make_question(
            f"sec7_sub2_{i}", "crypto-bitwise", "massive_lcg",
            f"Given 128-bit LCG (A={A}, C={C}, M=2^128, Seed={X0}). Calculate exact state X_1000000. Submit 32 uppercase hex chars.",
            ans, "hex-lowercase"
        )

    elif subtype == 3:  # bit_shift_matrix
        rng = mulberry32(seed)
        # Generate initial 256-bit value from mulberry32
        hex_str = mulberry32_hex_string(rng, 64).upper()
        val = int(hex_str, 16)
        mask = (1 << 256) - 1
        for j in range(50):
            shift = (j * 7 + i) % 256
            if j % 2 == 0:
                val = ((val << shift) | (val >> (256 - shift))) & mask
            else:
                val = ((val >> shift) | (val << (256 - shift))) & mask
        ans = f"{val:064X}"
        return make_question(
            f"sec7_sub3_{i}", "crypto-bitwise", "bit_shift_matrix",
            "Apply 50 deterministic circular bit-shifts to the 256-bit integer rendered below. Provide final 64-char uppercase hex result.",
            ans, "hex-lowercase", client_seed=seed
        )

    elif subtype == 4:  # sha256_mental (Ch function)
        rng = mulberry32(seed)
        e = mulberry32_int(rng, 0, 0xFFFFFFFF)
        f_val = mulberry32_int(rng, 0, 0xFFFFFFFF)
        g = mulberry32_int(rng, 0, 0xFFFFFFFF)
        # Ch(e, f, g) = (e AND f) XOR (NOT e AND g)
        result = (e & f_val) ^ (~e & g)
        result = result & 0xFFFFFFFF  # Ensure 32-bit
        ans = f"{result:08X}"
        return make_question(
            f"sec7_sub4_{i}", "crypto-bitwise", "sha256_mental",
            f"Calculate the SHA-256 Ch(e,f,g) function for E={e:08X}, F={f_val:08X}, G={g:08X}. Output 8 uppercase hex chars.",
            ans, "hex-lowercase", client_seed=seed
        )


# ============================================================================
# Main: build all 350 + validate + write
# ============================================================================

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_dir = os.path.join(project_root, "lib", "data")
    os.makedirs(data_dir, exist_ok=True)

    print("Generating 350 questions...")
    dataset = []
    sections = [build_sec1, build_sec2, build_sec3, build_sec4, build_sec5, build_sec6, build_sec7]
    for sec_idx, generator in enumerate(sections):
        for subtype in range(5):
            for i in range(10):
                q = generator(subtype, i)
                dataset.append(q)
        print(f"  Section {sec_idx + 1}/7 complete ({len(dataset)} questions)")

    # ── Validation ──────────────────────────────────────────────────────────
    print("\nValidating dataset...")
    errors = []

    # Check total count
    if len(dataset) != 350:
        errors.append(f"Expected 350 questions, got {len(dataset)}")

    # Check unique IDs
    ids = [q["id"] for q in dataset]
    if len(set(ids)) != len(ids):
        dupes = [x for x in ids if ids.count(x) > 1]
        errors.append(f"Duplicate IDs: {set(dupes)}")

    # Check all hashes are valid 64-char hex
    for q in dataset:
        h = q["answerHash"]
        if len(h) != 64 or not all(c in "0123456789abcdef" for c in h):
            errors.append(f"{q['id']}: invalid hash format: {h[:20]}...")

    # Check hash roundtrip
    for q in dataset:
        expected = normalize_and_hash(q["_verifiedAnswer"], q["normalization"], q.get("decimalPlaces"))
        if expected != q["answerHash"]:
            errors.append(f"{q['id']}: hash mismatch! answer='{q['_verifiedAnswer']}' norm={q['normalization']} dp={q.get('decimalPlaces')}")

    # Check clientSeed is integer when present
    for q in dataset:
        if q["clientSeed"] is not None and not isinstance(q["clientSeed"], int):
            errors.append(f"{q['id']}: clientSeed is not int: {q['clientSeed']}")

    if errors:
        print(f"\nFAILED with {len(errors)} errors:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print(f"  All {len(dataset)} questions valid")
        print(f"  All IDs unique")
        print(f"  All hashes valid 64-char hex")
        print(f"  All _verifiedAnswer values hash correctly")

    # ── Write dataset ───────────────────────────────────────────────────────
    output_path = os.path.join(data_dir, "scca_master_dataset.json")
    with open(output_path, "w") as f:
        json.dump(dataset, f, indent=2)
    print(f"\nWrote {output_path} ({os.path.getsize(output_path)} bytes)")

    # ── Generate mulberry32 parity fixture ──────────────────────────────────
    parity_seeds = [12345, 4000, 99999, 0, 2147483647]
    parity_data = {}
    for seed in parity_seeds:
        rng = mulberry32(seed)
        parity_data[str(seed)] = [rng() for _ in range(10)]

    parity_path = os.path.join(data_dir, "mulberry32_parity.json")
    with open(parity_path, "w") as f:
        json.dump(parity_data, f, indent=2)
    print(f"Wrote {parity_path}")

    print("\nDone. 350 items mathematically locked and hashed.")


if __name__ == "__main__":
    main()
