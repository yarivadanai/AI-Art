# The Measuring Paradox

An interactive art piece that reverses the lens we apply to artificial intelligence and turns it on human cognition.

Visitors sit for the **Machine-Indexed Cognitive Assessment (MICA)** -- a timed examination designed not around human strengths (language, narrative, social reasoning) but around cognitive primitives that silicon handles effortlessly: recursive computation, bitwise precision, state tracking, and probabilistic inference. An institutional "Authority" administers the test, grades it without mercy, and delivers a clinical report on the visitor's cognitive limitations.

The experience stages a question: we routinely judge AI by idealized human-like standards it can never fully meet. What happens when we apply machine-standard metrics to ourselves?

## Architecture

- **Frontend**: Next.js 14 + React 18 + Tailwind CSS + Zustand
- **Backend**: Next.js API routes + Prisma ORM
- **Database**: PostgreSQL (Neon recommended for Vercel deployment)
- **Grading**: server-side, exact and typed (numeric tolerance, hex, sets, sequences); reference answers never leave the server and are revealed on the report after grading
- **Question generation**: TypeScript parametric generators (`lib/generators/`, 15 families with a difficulty dial 1..8) for the adaptive ladders; a legacy hashed bank (`lib/data/`) supplies the machine-scale finales

## The Five Cognitive Stress Domains

| Section | Tests |
|---|---|
| **Structural Insight** | Hyperplane projection, Ackermann patterns, sequence rules |
| **Working Memory** | n-back, register-machine traces, cipher chains |
| **Exact Computation** | XOR chains, modular recurrences, bit operations |
| **Signal Detection** | Palindrome search, drift blocks, duplicate streams |
| **Probabilistic Inference** | Conditional tables, Bayesian update chains, Markov steady states |

Each session is adaptive: in every domain, six items climb or descend a ladder of eight difficulty levels with the visitor's own answers (start at level 3, +1 on a correct answer, -1 on a wrong one); the highest level cleared is the domain's *frontier*. A seventh item is then posed at machine scale (a bank item whose data is rendered in the browser from a seed). Every answer carries a stated confidence (sure / unsure / guess) or an explicit abstention ("I cannot determine this"), so the report can describe calibration and abstention the way we describe them for machines. The pre-Phase-2 fixed 25-item flow remains available with `{ "mode": "fixed" }` on `POST /api/session`.

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

This produces `lib/data/scca_master_dataset.json` with the question bank (605 items at the time; 80 unanswerable items were later removed by `scripts/phase0_bank_repair.py`, leaving 525). The generator includes built-in validation (unique IDs, section counts, hash roundtrip checks, 8-option MC verification for all T1 items).

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
  build_dataset_v2.py   # Original dataset generator (not reproducible from a clean checkout)
prisma/
  schema.prisma         # Database schema
```
