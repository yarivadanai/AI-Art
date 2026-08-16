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
3. **Client** - `app/test/page.tsx` drives the flow with the Zustand store in `lib/store.ts` (phases: idle/intake, testing, between-sections, submitting, expired, complete). Intake collects the AI pledge plus three belief items (`lib/beliefs.ts`; sent with `POST /api/session`, stored on `Session.beliefs`). Every question requires an answer *and* a confidence chip (sure/unsure/guess) or the "I cannot determine this" abstain button; timer expiry submits the `draft` with confidence `expired`. The store is persisted to localStorage (`mica-test-session`), so a reload resumes the same question with the typed `draft` and the original deadline; the page gates rendering on `hydrated`. The question clock is `questionStartTime` (set by `beginQuestion()` when a question actually becomes visible, i.e. on PROCEED); the timer's deadline is `questionStartTime + timeLimit`, wall-clock based. At each section transition the client POSTs that section's answers to `/api/section`, stores the returned `SectionSummary`, and the Authority reacts to it (`getSectionFeedback` in `lib/commentary.ts`, escalating by transition index). `components/QuestionRenderer.tsx` dispatches on `inputType` and, when `payload.clientSeed` is set, renders `components/SeedDataDisplay.tsx`, whose `RENDERER_MAP` (keyed by question `subtype`) regenerates large data in the browser from the seed using `mulberry32`.
4. **Grading** - `lib/engine/grade-session.ts` is the single grading path: `gradeAndStore` canonicalizes each answer, compares SHA-256 hashes, and upserts one Response row per (session, question) with `confidence`/`abstained`; `POST /api/section` calls it mid-test, `POST /api/submit` calls it again with everything and then `buildResult` computes section scores (equal-weighted), commentary, verdict and `metrics` (`lib/engine/metrics.ts`: hallucination rate = P(wrong | sure), abstentions, timing) stored on `Result.metrics`. Result creation is idempotent per session; sessions past `expiresAt + SUBMIT_GRACE_MS` (`lib/engine/limits.ts`) are refused with 410. `GET /api/result/:id` reveals the reference answer per item (`answerKey.reference`, with a bank lookup fallback for pre-Phase-1 rows), the specimen's answer, time, confidence, plus `metrics` and `beliefs`; the report (`app/result/[id]/page.tsx`) builds the personal MIRROR from these (`getMirrorLines`) and shows per-item "method" lines from `lib/reference.ts` (order-of-magnitude honest). `/api/stats` aggregates Result rows for the dashboard, including population calibration and a computed perfect-score count.

### One canonicalizer, used on both sides of the hash

`lib/engine/canonicalize.ts` is the single definition of "canonical answer string" per normalization mode (forgiving about case, whitespace around separators, `0x`, thousands separators, decimal comma, unicode minus; strict about content). Both `hashAnswer` (`lib/banks/shared.ts`, used to hash reference answers) and `gradeAnswer` (`lib/engine/grader.ts`) call it. If you change it, run `npx tsx scripts/rehash_dataset.ts` so stored hashes match, and check that the bank test "no two distinct verified answers within a subtype collapse" still passes. `lib/__tests__/canonicalize.test.ts` holds the accepted-input cases.

### Answerability invariants (enforced by tests)

A question whose answer depends on generated data must show that data: inline in `prompt`/`display`, or via a `RENDERER_MAP` entry for its `subtype`. `lib/__tests__/banks.test.ts` checks: every T3 item with a `clientSeed` has a renderer (`SEED_RENDERER_TYPES` exported from `SeedDataDisplay.tsx`); no prompt cites "(Seed: N)" as its only data; the eight families removed in the 2026-08 repair (`affine_transform`, `kl_divergence`, `markov_100x100`, `bit_shift_matrix`, `variance_drift`, `taylor_series`, `deep_fsm`, `hash_anomaly`) stay out. If you add a renderer, make sure it shows the region containing the answer, not just a head/tail window.

### The PRNG parity invariant

Answers for seed-driven questions were computed offline in Python (`scripts/*.py` port mulberry32 and emulate `Math.imul`) and only their hashes ship. The browser reconstructs the visible data from the same seed via `mulberry32` in `lib/engine/rng.ts`. Any change to `mulberry32` or to how a `SeedDataDisplay` renderer consumes the RNG stream silently makes questions unanswerable. `lib/data/mulberry32_parity.json` + the parity test guard the RNG; nothing guards renderer/generator drift, so if you touch a renderer, check the matching generator in `scripts/`.

### Dataset regeneration is not reproducible from a clean checkout

`scripts/build_dataset_v2.py` (and the earlier `build_tier1.py`, `build_tier2.py`, `scca_architect.py`) reads `/tmp/scca-recovery/extracted_banks.json`, which does not exist in the repo. Treat the JSON files in `lib/data/` as the artifact of record and edit them with a targeted, idempotent script (pattern: `scripts/phase0_bank_repair.py`) rather than rerunning the pipeline. `lib/__tests__/banks.test.ts` pins exact counts (525 total, per-section and per-tier counts, 8 options for every T1, timeLimit 30/30/45 by tier, hash roundtrip of `_verifiedAnswer`); update the expectations in the same commit as an intentional bank change.

## Verification

Unit/type/lint: `npm test`, `npx tsc --noEmit`, `npm run lint`. End-to-end: point `.env` at any Postgres (an embedded one is fine), `npx prisma migrate deploy`, `npx next dev -p <port>`, then `npx tsx scripts/e2e_api.ts http://localhost:<port>` (session with beliefs -> per-section grading with a fixed correct/wrong/abstain/confidence plan -> submit -> reveal; an all-correct messy-format session expecting 100%; partial and blank sessions; oracle/idempotency checks; 400/404/409 paths; stats). Grading is first-write-wins per (session, question) on both `/api/section` and `/api/submit`: that is what makes re-sends idempotent and closes any pre-submit answer probing. For client behaviour run `scripts/e2e_browser.mjs` (Playwright, ad hoc install; walks intake -> 25 items -> report -> dashboard on a phone-width viewport, including reload resume, timer expiry, abstain, transition feedback) or drive `/test` by hand and inspect `localStorage["mica-test-session"]`.

## Conventions

- Path alias `@/*` maps to repo root (tsconfig + vitest).
- Section keys are the string literals in `lib/types.ts` (`structural`, `state-tracking`, `sequential-depth`, `signal-detection`, `probabilistic`); the canonical order is `SECTION_ORDER` there (the test plan in `lib/engine/test-plan.ts` and the client's `SECTION_NAMES` mirror it).
- User-visible copy avoids em/en dashes (an earlier commit removed them all); use hyphens. Use "specimen" consistently in Authority voice.
- Fonts come from `next/font` in `app/layout.tsx` (CSS vars `--font-inter`, `--font-jetbrains-mono`, wired in `tailwind.config.ts`); don't reintroduce a Google Fonts `@import`.
- Voice: the Authority calls visitors "specimens"; new copy goes in `lib/commentary.ts` and must be data-bound (no seeded pseudo-personalization).
- Root-level `review-banks.ts`, `bank-review.txt`, `review-questions.txt`, `scca-questions.txt`, `article-tds.md` are untracked scratch/legacy files (`review-banks.ts` imports bank modules that no longer exist and is excluded in tsconfig). Don't build on them.
