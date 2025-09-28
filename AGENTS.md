# Repository Guidelines

## Project Structure & Module Organization
- `apps/web/`: Next.js App Router for landing, session runner, dashboards, and marketing pages; Tailwind tokens live in `apps/web/styles/`, shared images under `apps/web/public/authority/`.
- `apps/api/`: NestJS service partitioned into `session`, `generator`, `grader`, and `telemetry` modules with contract specs in `apps/api/test/`.
- `packages/engine/`: Deterministic item builders, scoring pipelines, RNG utilities, and zod schemas shared by web and API clients.
- `packages/ui/`: Reusable React widgets (timers, grid painter, chrome) plus Storybook stories for visual QA.

## Build, Test, and Development Commands
- `pnpm dev:web` – launch the Next.js dev server; ensure `.env.local` sets `NEXT_PUBLIC_AUTHORITY_NAME` and API URLs.
- `pnpm dev:api` – start the NestJS watcher; expects PostgreSQL + Redis and reads credentials from `.env.api`.
- `pnpm lint` – run ESLint, Prettier, and RNG guardrails; resolve reported violations before committing.
- `pnpm test` – execute unit suites (Vitest/Jest) with coverage; add `--filter <scope>` for targeted runs.
- `pnpm test:e2e` – run Playwright smoke tests for full session flow and `/about` routing.
- `pnpm prisma:generate` followed by `pnpm prisma:push` during local schema work; use `pnpm prisma:migrate` for deploys.

## Coding Style & Naming Conventions
- TypeScript operates in strict mode; prefer named exports and domain directories like `packages/engine/section-b/`.
- Indent TS/JS/JSON with two spaces; Tailwind classes auto-sort via `prettier-plugin-tailwindcss`.
- React components use PascalCase; directories use kebab-case.
- RNG helpers must accept seeded PRNG instances—never call `Math.random` directly.

## Testing Guidelines
- Co-locate specs as `*.spec.ts`; snapshot outputs live in `__snapshots__/` and document the RNG seed.
- Maintain ≥85% statement coverage for `packages/engine` and `apps/api`, ≥75% for `packages/ui` via `pnpm test --coverage`.
- Playwright suites in `apps/web/tests/e2e/` validate telemetry events (paste/blur) and enforce Lighthouse a11y ≥90.

## Commit & Pull Request Guidelines
- Use Conventional Commits, e.g., `feat(engine): carry-trap generator` and reference `requirements.md` (`req §17`) when applicable.
- PRs need a summary, linked issue, validation notes (unit/e2e), and screenshots or recordings for UI-impacting changes.
- Tag both web and API reviewers when shared schemas change; keep diffs focused (~<400 LOC net change).

## Security & Configuration Tips
- Copy `.env.example` into `.env.local` / `.env.api`; never commit secrets (`DATABASE_URL`, `REDIS_URL`, `PRISMA_PROVIDER`).
- Run `NODE_OPTIONS=--enable-source-maps` for debugging; production builds must keep `dangerouslyAllowSVG` disabled.
- Seed data with specimen placeholders and apply migrations via `pnpm prisma:migrate` in staging/production.
