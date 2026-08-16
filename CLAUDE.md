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
```

`DATABASE_URL` in `.env` (copy from `.env.example`). Only the API routes touch the DB; the test suite and the engine run without one.

## Architecture: the data flow that matters

1. **Question bank** - `lib/data/scca_master_dataset.json` (605 items, loaded by `lib/banks/dataset.ts`) is the single source of truth. Each item has `section`, `tier` (1/2/3), `subtype`, `prompt`, optional `options`/`display`/`clientSeed`, an `answerHash` (SHA-256 of the normalized answer), a `normalization` mode, and `_verifiedAnswer` (plaintext, kept only for tests).
2. **Session creation** - `POST /api/session` makes a random seed, `lib/engine/test-plan.ts` uses `SeededRNG` (`lib/engine/rng.ts`) to pick per section T1,T1,T2,T3,T3 (5 sections x 5 = 25), and persists Session + Question rows (payload and answerKey as JSON). The response returns only `payload`, never `answerKey`, and `datasetItemToQuestion` copies fields explicitly so `_verifiedAnswer` never leaves the server. Keep it that way: `lib/banks/dataset.ts` must only be imported from server code (`test-plan.ts`, tests), never from a `"use client"` file, or the answers ship in the bundle.
3. **Client** - `app/test/page.tsx` drives the flow with the Zustand store in `lib/store.ts` (phases: intake, testing, between-sections, submitting, complete). `components/QuestionRenderer.tsx` dispatches on `inputType` and, when `payload.clientSeed` is set, renders `components/SeedDataDisplay.tsx`, whose `RENDERER_MAP` (keyed by question `subtype`) regenerates large data (hex streams, particle fields, matrices, etc.) in the browser from the seed using `mulberry32`.
4. **Grading** - `POST /api/submit` normalizes each answer (`lib/engine/grader.ts`) and compares SHA-256 hashes; scores are equal-weighted across the 5 sections; verdict bands and all the "Authority" prose live in `lib/commentary.ts`. Result creation is idempotent per session (unique constraint + race handling). `/api/stats` aggregates Result rows for the dashboard.

### The PRNG parity invariant

Answers for seed-driven questions were computed offline in Python (`scripts/*.py` port mulberry32 and emulate `Math.imul`) and only their hashes ship. The browser reconstructs the visible data from the same seed via `mulberry32` in `lib/engine/rng.ts`. Any change to `mulberry32`, to how a `SeedDataDisplay` renderer consumes the RNG stream, or to normalization rules silently makes questions unanswerable. `lib/data/mulberry32_parity.json` + the parity test in `lib/__tests__/banks.test.ts` guard the RNG; nothing guards renderer/generator drift, so if you touch a renderer, check the matching generator in `scripts/`. `hashAnswer` in `lib/banks/shared.ts` and `normalizeAnswer` in `lib/engine/grader.ts` are intentionally the same logic in two places; change both together.

### Dataset regeneration is not reproducible from a clean checkout

`scripts/build_dataset_v2.py` (the current generator; `build_tier1.py`, `build_tier2.py`, `scca_architect.py` are earlier stages) reads `/tmp/scca-recovery/extracted_banks.json`, which does not exist in the repo. Treat the JSON files in `lib/data/` as the artifact of record and edit them (or write a targeted script) rather than trying to rerun the pipeline. `lib/__tests__/banks.test.ts` pins exact counts (605 total, per-section and per-tier counts, 8 options for every T1, timeLimit 30/30/45 by tier, hash roundtrip of `_verifiedAnswer`); update the test expectations when you intentionally change the bank.

## Conventions

- Path alias `@/*` maps to repo root (tsconfig + vitest).
- Section keys are the string literals in `lib/types.ts` (`structural`, `state-tracking`, `sequential-depth`, `signal-detection`, `probabilistic`); the same fixed order is hard-coded in `app/api/session/route.ts`, `app/api/submit/route.ts`, and `lib/engine/test-plan.ts`.
- User-visible copy avoids em/en dashes (an earlier commit removed them all); use hyphens.
- Root-level `review-banks.ts`, `bank-review.txt`, `review-questions.txt`, `scca-questions.txt`, `article-tds.md` are untracked scratch/legacy files (`review-banks.ts` imports bank modules that no longer exist and is excluded in tsconfig). Don't build on them.
