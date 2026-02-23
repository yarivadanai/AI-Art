# The Measuring Paradox

An interactive art piece that reverses the lens we apply to artificial intelligence and turns it on human cognition.

Visitors sit for the **Machine-Indexed Cognitive Assessment (MICA)** -- a timed examination designed not around human strengths (language, narrative, social reasoning) but around cognitive primitives that silicon handles effortlessly: recursive computation, bitwise precision, state tracking, and probabilistic inference. An institutional "Authority" administers the test, grades it without mercy, and delivers a clinical report on the visitor's cognitive limitations.

The experience stages a question: we routinely judge AI by idealized human-like standards it can never fully meet. What happens when we apply machine-standard metrics to ourselves?

## Architecture

- **Frontend**: Next.js 14 + React 18 + Tailwind CSS + Zustand
- **Backend**: Next.js API routes + Prisma ORM
- **Database**: PostgreSQL (Neon recommended for Vercel deployment)
- **Grading**: SHA-256 hash comparison (zero-knowledge; correct answers never stored in plaintext)
- **Question generation**: Python dataset builder + TypeScript seeded PRNG (mulberry32)

## The Five Cognitive Stress Domains

| Section | Tests |
|---|---|
| **Abstract Structure** | Structural isomorphism across mathematical/scientific domains |
| **State Tracking** | Center-embedding parsing, parallel state maintenance, cipher chains |
| **Sequential Depth** | Proof error detection, assembly tracing, recursive computation |
| **Signal Detection** | Grammar violation identification in syntactically complex sentences |
| **Probabilistic Inference** | Expert-level misconception detection across 100+ academic fields |

Each session draws 25 questions (5 per section) from a pool of 605 items across three difficulty tiers:

- **T1** (8-option multiple choice, 30s) -- Expert-level but solvable
- **T2** (free-response, 30s) -- At the edge of biological capacity
- **T3** (free-response, 45s) -- Trivial for machines, structurally hard for humans

## Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Initialize the database
npx prisma migrate deploy
npx prisma generate

# Run development server
npm run dev
```

## Dataset Generation

The question bank is built from raw source material by a Python generator:

```bash
python3 scripts/build_dataset_v2.py
```

This produces `lib/data/scca_master_dataset.json` with 605 questions. The generator includes built-in validation (unique IDs, section counts, hash roundtrip checks, 8-option MC verification for all T1 items).

## Testing

```bash
npm test          # Run once
npm run test:watch  # Watch mode
```

## Key Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/about` | Facility briefing + artist's note |
| `/test` | The assessment itself (25 timed questions) |
| `/result/[id]` | Individual cognitive autopsy report |
| `/dashboard` | Aggregate population data and findings |

## Project Structure

```
app/                    # Next.js pages and API routes
  api/session/          # POST: create new test session
  api/submit/           # POST: submit answers, receive grading
  api/result/[id]/      # GET: individual result
  api/stats/            # GET: aggregate population data
components/             # React components (timer, MC, text input, charts)
lib/
  engine/               # Test plan generator, grader, seeded PRNG
  banks/                # Dataset loader
  data/                 # Question banks (JSON)
  types.ts              # TypeScript type definitions
  store.ts              # Zustand client state
  commentary.ts         # Section intro text
scripts/
  build_dataset_v2.py   # Dataset generator (605 questions)
prisma/
  schema.prisma         # Database schema
```
