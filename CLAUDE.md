# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"The Measuring Paradox" - an interactive art piece: a fictional institution (MICA, the Machine-Indexed Cognitive Assessment; formerly branded SCCA, and the name still appears in file/ID names) gives humans a timed 25-question test built around things machines do easily (bitwise ops, state tracking, recursion, probability), then delivers a clinical "cognitive autopsy". Next.js 14 App Router + Prisma/PostgreSQL, deployed on Vercel. See README.md for the concept and route list.

## Commands

```bash
npm run dev            # next dev
npm run build          # prisma migrate deploy && next build  (needs DATABASE_URL)
npm run lint           # next lint
npm test               # vitest run (single test file: npx vitest run lib/__tests__/banks.test.ts)
npm run test:watch
npx vitest run -t "Hash validation"   # run one describe/it by name
npx tsc --noEmit       # type-check
npx prisma migrate dev # after editing prisma/schema.prisma; postinstall already runs prisma generate
npx tsx scripts/e2e_api.ts http://localhost:3000   # end-to-end API check against a running server (see Verification)
npx tsx scripts/rehash_dataset.ts                  # recompute every answerHash after changing lib/engine/canonicalize.ts
```

`DATABASE_URL` in `.env` (copy from `.env.example`). Only the API routes touch the DB; the test suite and the engine run without one.

## Architecture: the data flow that matters

1. **Question bank** - `lib/data/scca_master_dataset.json` (525 items, loaded by `lib/banks/dataset.ts`) is the single source of truth. Each item has `section`, `tier` (1/2/3), `subtype`, `prompt`, optional `options`/`display`/`clientSeed`, an `answerHash` (SHA-256 of the canonical answer), a `normalization` mode, and `_verifiedAnswer` (plaintext, server-only; used by tests and `scripts/`).
2. **Session creation** - `POST /api/session` makes a random seed, `lib/engine/test-plan.ts` uses `SeededRNG` (`lib/engine/rng.ts`) to pick per section T1,T1,T2,T3,T3 (5 sections x 5 = 25), and persists Session + Question rows (payload and answerKey as JSON). The response returns only `payload`, never `answerKey`, and `datasetItemToQuestion` copies fields explicitly so `_verifiedAnswer` never leaves the server. Keep it that way: `lib/banks/dataset.ts` must only be imported from server code (`test-plan.ts`, tests, scripts), never from a `"use client"` file, or the answers ship in the bundle. `scripts/e2e_api.ts` asserts the session payload carries no answer material; after a build, `grep -rl _verifiedAnswer .next/static` must be empty.
3. **Client** - `app/test/page.tsx` drives the flow with the Zustand store in `lib/store.ts` (phases: idle/intake, testing, between-sections, submitting, expired, complete). The store is persisted to localStorage (`mica-test-session`), so a reload resumes the same question with the typed `draft` and the original deadline; the page gates rendering on `hydrated`. The question clock is `questionStartTime` (set by `beginQuestion()` when a question actually becomes visible, i.e. on PROCEED, not while an intro is being read); the timer's deadline is `questionStartTime + timeLimit`, wall-clock based. Timer expiry submits the `draft`. `components/QuestionRenderer.tsx` dispatches on `inputType` and, when `payload.clientSeed` is set, renders `components/SeedDataDisplay.tsx`, whose `RENDERER_MAP` (keyed by question `subtype`) regenerates large data in the browser from the seed using `mulberry32`.
4. **Grading** - `POST /api/submit` canonicalizes each answer and compares SHA-256 hashes; scores are equal-weighted across the 5 sections; verdict bands and all the "Authority" prose live in `lib/commentary.ts`. Result creation is idempotent per session (unique constraint + race handling); sessions past `expiresAt + SUBMIT_GRACE_MS` are refused with 410. `/api/stats` aggregates Result rows for the dashboard.

### One canonicalizer, used on both sides of the hash

`lib/engine/canonicalize.ts` is the single definition of "canonical answer string" per normalization mode (forgiving about case, whitespace around separators, `0x`, thousands separators, decimal comma, unicode minus; strict about content). Both `hashAnswer` (`lib/banks/shared.ts`, used to hash reference answers) and `gradeAnswer` (`lib/engine/grader.ts`) call it. If you change it, run `npx tsx scripts/rehash_dataset.ts` so stored hashes match, and check that the bank test "no two distinct verified answers within a subtype collapse" still passes. `lib/__tests__/canonicalize.test.ts` holds the accepted-input cases.

### Answerability invariants (enforced by tests)

A question whose answer depends on generated data must show that data: inline in `prompt`/`display`, or via a `RENDERER_MAP` entry for its `subtype`. `lib/__tests__/banks.test.ts` checks: every T3 item with a `clientSeed` has a renderer (`SEED_RENDERER_TYPES` exported from `SeedDataDisplay.tsx`); no prompt cites "(Seed: N)" as its only data; the eight families removed in the 2026-08 repair (`affine_transform`, `kl_divergence`, `markov_100x100`, `bit_shift_matrix`, `variance_drift`, `taylor_series`, `deep_fsm`, `hash_anomaly`) stay out. If you add a renderer, make sure it shows the region containing the answer, not just a head/tail window.

### The PRNG parity invariant

Answers for seed-driven questions were computed offline in Python (`scripts/*.py` port mulberry32 and emulate `Math.imul`) and only their hashes ship. The browser reconstructs the visible data from the same seed via `mulberry32` in `lib/engine/rng.ts`. Any change to `mulberry32` or to how a `SeedDataDisplay` renderer consumes the RNG stream silently makes questions unanswerable. `lib/data/mulberry32_parity.json` + the parity test guard the RNG; nothing guards renderer/generator drift, so if you touch a renderer, check the matching generator in `scripts/`.

### Dataset regeneration is not reproducible from a clean checkout

`scripts/build_dataset_v2.py` (and the earlier `build_tier1.py`, `build_tier2.py`, `scca_architect.py`) reads `/tmp/scca-recovery/extracted_banks.json`, which does not exist in the repo. Treat the JSON files in `lib/data/` as the artifact of record and edit them with a targeted, idempotent script (pattern: `scripts/phase0_bank_repair.py`) rather than rerunning the pipeline. `lib/__tests__/banks.test.ts` pins exact counts (525 total, per-section and per-tier counts, 8 options for every T1, timeLimit 30/30/45 by tier, hash roundtrip of `_verifiedAnswer`); update the expectations in the same commit as an intentional bank change.

## Verification

Unit/type/lint: `npm test`, `npx tsc --noEmit`, `npm run lint`. End-to-end: point `.env` at any Postgres (an embedded one is fine), `npx prisma migrate deploy`, `npx next dev -p <port>`, then `npx tsx scripts/e2e_api.ts http://localhost:<port>` (creates sessions, submits messy-but-correct answers expecting 100%, blank session expecting 0, idempotent resubmit, 400/404 paths, stats). For client behaviour (reload resume, timer flush, Enter submit) drive `/test` in a browser and inspect `localStorage["mica-test-session"]`.

## Conventions

- Path alias `@/*` maps to repo root (tsconfig + vitest).
- Section keys are the string literals in `lib/types.ts` (`structural`, `state-tracking`, `sequential-depth`, `signal-detection`, `probabilistic`); the same fixed order is hard-coded in `app/api/session/route.ts`, `app/api/submit/route.ts`, and `lib/engine/test-plan.ts`.
- User-visible copy avoids em/en dashes (an earlier commit removed them all); use hyphens. Use "specimen" consistently in Authority voice.
- Fonts come from `next/font` in `app/layout.tsx` (CSS vars `--font-inter`, `--font-jetbrains-mono`, wired in `tailwind.config.ts`); don't reintroduce a Google Fonts `@import`.
- Root-level `review-banks.ts`, `bank-review.txt`, `review-questions.txt`, `scca-questions.txt`, `article-tds.md` are untracked scratch/legacy files (`review-banks.ts` imports bank modules that no longer exist and is excluded in tsconfig). Don't build on them.
