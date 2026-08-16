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

1. **Items** come from two sources. (a) `lib/generators/*` - 15 seeded parametric families, three per domain, each `generate(rng, d)` for a difficulty dial `d` 1..8 returning prompt, plaintext `reference`, a typed `grader` spec and a time limit; uniqueness is enforced by construction (`lib/__tests__/generators.test.ts` proves every family self-grades at every level for many seeds). (b) The legacy hashed bank `lib/data/scca_master_dataset.json` (525 items, loaded by `lib/banks/dataset.ts`; each item has `answerHash`, `normalization`, `_verifiedAnswer` server-only, optional `clientSeed` for the browser-side renderers in `components/SeedDataDisplay.tsx`). In the current flow the bank supplies only the per-domain machine-scale finale (tier-3 items whose data is actually rendered) and the legacy `mode:"fixed"` sessions.
2. **Adaptive session (default)** - `POST /api/session` creates a Session (`mode:"adaptive"`, `state` = `AdaptiveState` in `lib/engine/adaptive.ts`) and serves the first item. Per domain (in `SECTION_ORDER`): a 6-rung staircase starting at level 3 (+1 on correct, -1 on wrong; families rotate so consecutive rungs differ), frontier = highest level cleared, then one finale. `POST /api/answer` grades the current item (first write wins; re-sending a graded item replays the current one), moves the state, and returns the next item / a `sectionComplete` summary with frontier + finale outcome / `done: {resultId}`. `GET /api/session/:id` recovers the current item. `/api/submit` finalizes an adaptive session early; `/api/section` is fixed-mode only. Section score = frontier/8, overall = mean; `Result.metrics` carries `mode`, `frontiers`, `finales`, calibration and timing.
3. **Answer keys never leave the server.** `Question.answerKey` (`{reference, grader}` for generated items; `{hash, normalization, reference}` for bank items) is only read by grading and by `GET /api/result/:id`, which reveals `referenceAnswer` after grading. `lib/banks/dataset.ts` must only be imported from server code (`test-plan.ts`, `adaptive.ts`, the result route's lazy fallback, tests, scripts), never from a `"use client"` file. Generators are safe to import anywhere (they need the session seed, which never leaves the server, to reproduce an item). After a build, `grep -rl _verifiedAnswer .next/static` must be empty.
4. **Client** - `app/test/page.tsx` + the persisted Zustand store in `lib/store.ts` (`mica-test-session`, persist version 2). Intake: three belief items (`lib/beliefs.ts`) + AI pledge -> `POST /api/session`. Each item: answer + required confidence chip (sure/unsure/guess) or "I cannot determine this"; timer expiry captures the draft as `expired`. `capture()` stores a `pending` answer, `useAnswerSender` POSTs it (retry UI on failure; auto-resend after reload), `acknowledge()` records the grade and either shows the next item, stashes it behind the transition screen (`between-sections`, which shows the frontier strip and `getFrontierRemark` + `getSectionFeedback`), or moves to the finishing screen. The question clock is `questionStartTime` (set when an item becomes visible; wall-clock deadline = start + timeLimit).
5. **Grading** - `lib/engine/grader.ts`: `gradeTyped` (exact/hex/numeric/set/sequence with partial credit) when `answerKey.grader` exists, else hash of the canonical answer; `lib/engine/grade-session.ts` stores one Response per (session, question) with `confidence`/`abstained`; `lib/engine/metrics.ts` computes hallucination rate P(wrong | sure), abstentions, timing. The report (`app/result/[id]/page.tsx`) builds the personal MIRROR (`getMirrorLines`), shows frontiers/finales for adaptive results, and reveals every item with an honest method line (`lib/reference.ts`; generator families use their `method`). `/api/stats` aggregates for the dashboard.
6. **Voice** - all Authority copy is in `lib/commentary.ts` (`SECTION_LABELS`: Structural Insight, Working Memory, Exact Computation, Signal Detection, Probabilistic Inference; `getSectionIntro/Teaser/Feedback/FrontierRemark`, `getMirrorLines`, `REPORT_COPY`), data-bound, "specimen", hyphens only.

### One canonicalizer, used on both sides of the hash

`lib/engine/canonicalize.ts` is the single definition of "canonical answer string" per normalization mode (forgiving about case, whitespace around separators, `0x`, thousands separators, decimal comma, unicode minus; strict about content). Both `hashAnswer` (`lib/banks/shared.ts`, used to hash reference answers) and `gradeAnswer` (`lib/engine/grader.ts`) call it. If you change it, run `npx tsx scripts/rehash_dataset.ts` so stored hashes match, and check that the bank test "no two distinct verified answers within a subtype collapse" still passes. `lib/__tests__/canonicalize.test.ts` holds the accepted-input cases.

### Answerability invariants (enforced by tests)

A question whose answer depends on generated data must show that data: inline in `prompt`/`display`, or via a `RENDERER_MAP` entry for its `subtype`. `lib/__tests__/banks.test.ts` checks: every T3 item with a `clientSeed` has a renderer (`SEED_RENDERER_TYPES` exported from `SeedDataDisplay.tsx`); no prompt cites "(Seed: N)" as its only data; the eight families removed in the 2026-08 repair (`affine_transform`, `kl_divergence`, `markov_100x100`, `bit_shift_matrix`, `variance_drift`, `taylor_series`, `deep_fsm`, `hash_anomaly`) stay out. If you add a renderer, make sure it shows the region containing the answer, not just a head/tail window.

### The PRNG parity invariant

Answers for seed-driven questions were computed offline in Python (`scripts/*.py` port mulberry32 and emulate `Math.imul`) and only their hashes ship. The browser reconstructs the visible data from the same seed via `mulberry32` in `lib/engine/rng.ts`. Any change to `mulberry32` or to how a `SeedDataDisplay` renderer consumes the RNG stream silently makes questions unanswerable. `lib/data/mulberry32_parity.json` + the parity test guard the RNG; nothing guards renderer/generator drift, so if you touch a renderer, check the matching generator in `scripts/`.

### Dataset regeneration is not reproducible from a clean checkout

`scripts/build_dataset_v2.py` (and the earlier `build_tier1.py`, `build_tier2.py`, `scca_architect.py`) reads `/tmp/scca-recovery/extracted_banks.json`, which does not exist in the repo. Treat the JSON files in `lib/data/` as the artifact of record and edit them with a targeted, idempotent script (pattern: `scripts/phase0_bank_repair.py`) rather than rerunning the pipeline. `lib/__tests__/banks.test.ts` pins exact counts (525 total, per-section and per-tier counts, 8 options for every T1, timeLimit 30/30/45 by tier, hash roundtrip of `_verifiedAnswer`); update the expectations in the same commit as an intentional bank change.

## Verification

Unit/type/lint: `npm test` (generators property tests, graders, canonicalize, metrics, store, bank integrity), `npx tsc --noEmit`, `npm run lint`. End-to-end: point `.env` at any Postgres (an embedded one is fine), `npx prisma migrate deploy`, `npx next dev -p <port>`, then `npx tsx scripts/e2e_adaptive.ts http://localhost:<port>` (simulated visitors with controlled ability; reads reference answers from the DB, never the API; asserts 35 items, family rotation, frontiers exactly as the staircase predicts, finale outcomes, replay idempotency, early finalize, recovery, stats) and `npx tsx scripts/e2e_api.ts http://localhost:<port>` (legacy `mode:"fixed"` flow: per-section grading, calibration plan, all-correct messy session = 100%, oracle/idempotency, error paths). For the browser, `scripts/e2e_browser.mjs` (Playwright, ad hoc install) walks intake -> 35 adaptive items -> report -> dashboard on a phone-width viewport, including reload resume, timer expiry, abstain, keyboard-only chips and the transition screen. Do not run `next build` while `next dev` serves the same `.next`.

## Conventions

- Path alias `@/*` maps to repo root (tsconfig + vitest).
- Section keys are the string literals in `lib/types.ts` (`structural`, `state-tracking`, `sequential-depth`, `signal-detection`, `probabilistic`); the canonical order is `SECTION_ORDER` there (the test plan in `lib/engine/test-plan.ts` and the client's `SECTION_NAMES` mirror it).
- User-visible copy avoids em/en dashes (an earlier commit removed them all); use hyphens. Use "specimen" consistently in Authority voice.
- Fonts come from `next/font` in `app/layout.tsx` (CSS vars `--font-inter`, `--font-jetbrains-mono`, wired in `tailwind.config.ts`); don't reintroduce a Google Fonts `@import`.
- Voice: the Authority calls visitors "specimens"; new copy goes in `lib/commentary.ts` and must be data-bound (no seeded pseudo-personalization).
- Root-level `review-banks.ts`, `bank-review.txt`, `review-questions.txt`, `scca-questions.txt`, `article-tds.md` are untracked scratch/legacy files (`review-banks.ts` imports bank modules that no longer exist and is excluded in tsconfig). Don't build on them.
