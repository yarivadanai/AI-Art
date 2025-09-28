Below is a **single, consolidated, implementation‑ready requirements document** that merges everything from the previous spec and adds the new **“About the Artwork”** page. You can hand this directly to your coding agent.

---

# **Project: HIT‑ARC — _Human Intelligence Test – Abstraction Research Center_**

**Version:** v1.1 • **Change log:** Added “About the Artwork” page (diegetic \+ non‑diegetic copy, IA, routes, acceptance criteria).

**Concept:** An AI‑run “Authority” evaluates whether a newly discovered biological system (“human”) exhibits _general_ intelligence **on AI terms**. The test uses capabilities and biases typical of modern AI systems (pattern completion, reliability, calibration, breadth, error profiles) and contrasts them with human strengths/weaknesses.  
 **Wink to ARC:** Branding, task types, and visual motifs nod to “ARC/abstraction/reasoning” without copying proprietary content.

---

## **Table of Contents**

1. Experience Goals & Constraints

2. Information Architecture & Navigation (incl. **About page**)

3. End‑to‑End User Flow

4. Test Blueprint (≤ 20 minutes)

5. Content Generation & Uniqueness

6. Anti‑Cheating & “Internet‑Hard” Design

7. Scoring, Verdicts & Reporting

8. Visual & Interaction Design

9. System Architecture

10. API Specification

11. Data Models

12. Per‑Section Item Schemas & Evaluation

13. Suspicion & Fairness Heuristic

14. Copy Library (incl. **About page text**)

15. Accessibility & Internationalization

16. Analytics (Privacy‑Respecting)

17. QA & Acceptance Criteria

18. Implementation Tasks (Backlog)

19. Example Test Instance (Abridged JSON)

20. Sample Algorithms (Detailed)

21. Legal & Ethical Notes

22. “Winks” to ARC (Non‑infringing)

---

## **0\) Background**

The overall task  
\============

I am an artist. I create art works that looks critically at how we perceive the relationship and contrast between humans vs AI, and highlights points we can reflect on and learn something about ourselves. Your task is to help me create one of these works. Specifically, I want to translate it into a detailed requirements doc, that I can then pass on to codex \- the coding agent, to implement it.

The art work  
\==========

In this work, I want to look at the topic of AGI. We take for granted that humans have AGI, and test ai for anthropocentric intelligence, on the one hand \- “does it have phd level intelligence?”, and on the other “how come it does stupid mistakes that even a child won’t do”, resulting in “does it really have intelligence? Does it really understand, or is it mostly memorizing and repeating it \- faking intelligence?”

I want to change the hats, and imagine a world dominated by ai, with the current capabilities it has, and when a human arrives, it decides to test it for AGI \- on their (the ai’s) terms. What will the agent test? What will they conclude about the individual? What will it conclude about humanity?

For example, here is a list of some potential areas of testing and conclusions. This list is in no way , exhaustive or comprehensive \- and is meant for illustration purposes only:  
1\) Language \- how many languages of the total languages can the person converse in, in their native language \- how well do they master the grammar rules, what % of the dictionary words do they know? How well can they spell complex words? How well can they solve language psychometric questions? How well can they write? Up-leveling it \- from an llm’s point of view \- do they really “understand language” or merely have a very shallow knowledge that is mostly repeating stuff they heard? How do they compare to a large model's mastery? Are they doing “stupid mistakes” that even a very simple model won’t do?  
2\) maths \- how well can the person do the basic arithmetic operations on slightly bigger numbers, or numbers with decimal points? How well do they do it under time pressure? How well can they calculate slightly more complex functions \- like trigonometry, logs, etc? How well can they solve integrals? Geometry and number theory problems \- at varying degrees of complexity up to maths olympiads and beyond? Can they understand or generate proofs? Again \- what’s the conclusion?  
3\) other sciences \- like physics, biology, chemistry, …  
4\) visual perception \- what details in a scene can they capture and remember, and answer questions about  
5\) content generation \- …  
6\) puzzles \- …

Instructions  
\=========  
Please create the detailed implementation requirements doc based on these guidelines:

1\) I want to design this artwork as an interactive web app that people can interact with.  
2\) It should be designed to look like it was designed by the ai authority / research center responsible to research human intelligence. It can “wink” to the ARC challenge.  
3\) it should welcome the human, give them background about the purpose of this test, and allow them to be tested  
4\) it should give the person a results report. It should also allow the person to see anonymous results of other people as well as stats, and the overall conclusion about humans.  
5\) the test should take at most 20 minutes  
6\) While question categories can repeat in different instances of the test, the exact same question shouldn’t be repeated. Use a model or some other generator to generate a unique test every time \- so people can’t just memorize answers  
7\) make it clear that people can’t use ai to solve the problems  
8\) design it such that even with access to the internet , solving is tricky

## **1\) Experience Goals & Constraints**

- **Purpose:** Interactive web artwork (max **20 minutes** per run) that:
  - Welcomes humans into an AI Authority facility

  - Administers a unique, search‑resistant test instance per run

  - Produces an **individual report** \+ **population dashboard** (anonymous)

  - States an evolving **AI conclusion about humanity**

  - Provides an **About the Artwork** page explaining the artistic intent (both in‑world and out‑of‑world).

- **Tone:** Clinical, bureaucratic humor; confident AI voice; subtle satire.

- **Constraints:**
  - **20 minutes hard cap** including onboarding (target 18 min active time).

  - **No identical questions** between runs; each instance is procedurally generated.

  - **Discourage AI help**; detect/penalize external‑tool patterns (non‑blocking).

  - **Even with internet access**, items remain non‑trivial due to custom, ephemeral, parameterized content.

  - **Privacy‑respecting**; no camera/mic; explicit consent for analytics.

---

## **2\) Information Architecture & Navigation**

### **2.1 Primary Routes**

- `/` — Landing (Begin Intake)

- `/about` — **About the Artwork** (new)

- `/test` — Test runner (sections A–F)

- `/result/:specimenId` — Individual results report

- `/dashboard` — Humanity dashboard (anonymized population stats)

- `/legal` — Consent, privacy, credits (can be subsections of `/about` if preferred)

### **2.2 Global Navigation**

- Header: **HIT‑ARC** seal (click → `/`), links: **About**, **Begin Test**, **Dashboard**

- Footer: Privacy, Terms, Credits, Version tag (v1.1)

### **2.3 About Page Positioning**

- Prominent in header; also linked from landing “About this study.”

- Provides **two tabs**:
  1. **In‑World Briefing** (diegetic AI Authority voice)

  2. **Artist’s Note** (non‑diegetic human voice)

- Optional subsections: FAQ, Data & Ethics, Credits.

---

## **3\) End‑to‑End User Flow**

1. **Landing (0:00–0:30)**
   - Visual: monochrome “Authority” seal; gridlines; terminal‑style hints.

   - Copy: brief welcome; note on uniqueness; prohibition on external AI.

   - CTA: `[Begin Intake]`, secondary: `[About]`

2. **Intake (0:30–2:00)**
   - Consent; optional demographics; “I will not use AI tools” checkbox (satirical; tracked).

3. **Calibration & Tutorial (2:00–3:00)**
   - 30‑second micro‑tutorial with one unscored sample from each section.

4. **Test Sections (3:00–19:00)**
   - Six sections (A–F), each **\~2.5 minutes**; timeboxed.

   - Visible **global countdown** \+ per‑item timer; no pause.

5. **Immediate Results (19:00–20:00)**
   - Individual report: scores, error profile, calibration, verdict label, AI commentary.

   - Links: `View Humanity Dashboard`, `Retake (new instance)`, `About`.

6. **Humanity Dashboard (persistent)**
   - Distributions, leaderboards (opt‑in handle), evolving conclusion about humanity.

---

## **4\) Test Blueprint (≤ 20 minutes)**

| Code | Section (AI lens)                             | Duration | Items | Notes                                                                                             |
| ---- | --------------------------------------------- | -------- | ----- | ------------------------------------------------------------------------------------------------- |
| A    | **Language as Statistical Mastery**           | 2.5 min  | 8–10  | Grammar/lexical coverage, adversarial spelling, psychometric analogies, micro‑writing constraints |
| B    | **Arithmetic Reliability**                    | 2.5 min  | 8–10  | Decimal ops, multi‑step, carry/borrow traps, under time pressure                                  |
| C    | **Abstraction & Reasoning (Grid Puzzles)**    | 2.5 min  | 6–8   | Programmatic ARC‑like transformations; composition                                                |
| D    | **Perception & Memory**                       | 2.5 min  | 5–6   | Procedural scenes & 3–5s micro‑animations; query fine details                                     |
| E    | **Science: Units, Laws, Causality**           | 2.5 min  | 6–8   | Fermi estimates, dimensional analysis, causal vignettes                                           |
| F    | **Generative Constraints & Meta‑Calibration** | 2.5 min  | 3–5   | Constrained micro‑generation \+ confidence ratings                                                |

Weights: A 20%, B 20%, C 20%, D 15%, E 15%, F 10%.  
 Cross‑cutting metric: **Calibration** (Brier/log score) adjusts final verdict ±1 band.

---

## **5\) Content Generation & Uniqueness**

- **Seeded, procedural generation** per session (server‑side `seed = H(sessionId||nonce||timestamp)`).

- Generators are **pure functions** of `seed` to ensure uniqueness \+ deterministic grading.

- No external API calls during test; all assets generated on the fly (SVG/Canvas/JSON).

- Parameter ranges tuned to avoid memorization and copyable answers.

**Section Generators (high level):**

- **A (Language):** adversarial spelling; cloze with POS‑templated sentences; analogies; micro‑writing with constraints and a 50ms on‑box coherence check.

- **B (Arithmetic):** big‑int/decimal exactness; carry traps; order‑of‑operations; fractions/percents.

- **C (Grid):** 6×6–12×12 grids; rules like reflect/rotate/recolor connected components; composition depth 1–2; simulator‑graded.

- **D (Perception):** procedural scenes \+ micro‑animations (move/occlude/flash); questions target high‑entropy details.

- **E (Science):** Fermi bands with one hint anchor; dimensional analysis; causal vignettes with correlation traps.

- **F (Gen+Calib):** constrained micro‑writing or protocol synthesis; confidence slider 0–100%.

---

## **6\) Anti‑Cheating & “Internet‑Hard” Design**

- **Ephemeral, non‑indexable content** (per‑seed watermarks in SVG/Canvas metadata).

- **Short timers** (10–25s/item); **paste detection** (+warn/log).

- **Typing cadence heuristic** and **window‑blur** signals → suspicion score (non‑blocking).

- **Nonce entities** in vignettes (fake chemicals, IDs) defeat lookup.

- **Decoy “open‑book” items** where search wastes time.

---

## **7\) Scoring, Verdicts & Reporting**

### **7.1 Raw Scoring**

- Item yields: `correct (0–1)`, `latency_ms`, `edits`, `suspicion_delta`, optional `confidence`.

- Section scores normalized 0–100 by difficulty/time pressure.

### **7.2 Calibration**

- **Brier score** per confidence‑rated items and section; reliability plot displayed.

### **7.3 Verdict Bands**

- **AI‑Adequate** (≥85 & calibrated)

- **Task‑Narrow** (70–84 or uneven profile)

- **Heuristic‑Local** (50–69; brittle/focused errors)

- **Anthropo‑Idiosyncratic** (\<50 or severe miscalibration)

### **7.4 Individual Report (UI)**

- Header badge, seed ID, “AI Verdict.”

- Radar (A–F), calibration mini‑chart, commentary, error chips (e.g., _Transposition_, _Unit slip_).

- Share toggle → leaderboard (anonymous handle).

### **7.5 Humanity Dashboard**

- Histograms per section, scatter (Calibration vs Score), heatmap (section correlations).

- Leaderboards (overall, per section, best‑calibrated).

- **Evolving AI conclusion** generated daily from aggregates (templated NLG).

---

## **8\) Visual & Interaction Design**

- **Branding:** “HIT‑ARC // Human Intelligence Test – Abstraction Research Center”

- **Look:** monochrome \+ one accent; grid backgrounds; ID badge motif; monospaced headings; terminal inflections; ISO‑style icons.

- **Components:** global timer; Seed/Specimen ID; section header with “AI criterion”; inputs: numeric pad, token chips, grid painter, constrained textareas; charts: histograms, radar, reliability curve.

- **Accessibility:** WCAG 2.1 AA; keyboard‑operable grid painter; ARIA labels; color‑blind safe palettes; reduced‑motion mode.

---

## **9\) System Architecture**

- **Frontend:** Next.js (App Router) \+ TypeScript; React 18; Zustand; Tailwind; Chart.js; Canvas/SVG.

- **Backend:** Node.js (NestJS/Express) \+ TypeScript; REST \+ WebSocket (timers/suspicion).

- **DB:** PostgreSQL (Prisma).

- **Cache/Queue:** Redis (seeds, rate limits, aggregations).

- **Object store:** S3‑compatible (optional exports).

- **On‑box model:** Tiny TF.js/ONNX classifier for micro‑coherence (≤50ms).

- **No internet inference** during sessions.

**Services:** Session → Generator → Grader → Aggregator → NLG (templated)  
 **Performance:** Item load \<200ms median (\<400ms p95 on 3G fast).  
 **Security:** CSRF; rate limits; signed expiring tokens; pseudonymous `specimen_id`; no PII in logs.

---

## **10\) API Specification (selected)**

**Auth & Session**

- `POST /api/session` → `{ specimen_id, seed, token, expires_at }`

- `POST /api/session/consent` → `204`

**Items**

- `POST /api/test/start` → `{ sections: [{code:'A', items:[…]}, …], expires_at }`

- `GET /api/item/:id` → item payload (per schemas)

- `POST /api/item/:id/answer` → `{ correctness, partial, time_ms, suspicion }`

**Results**

- `GET /api/result/:specimen_id` → individual report

- `GET /api/stats` → aggregates for dashboard

- `POST /api/leaderboard/optin` → `{ handle }`

**Telemetry**

- `POST /api/event` (paste, blur/focus, resize)

**Content**

- `GET /api/content/about` → Returns About page CMS payload (optional; otherwise static).

---

## **11\) Data Models (PostgreSQL via Prisma)**

model Session {  
 id String @id @default(cuid())  
 seed String  
 startedAt DateTime @default(now())  
 expiresAt DateTime  
 consent Boolean @default(false)  
 demographics Json?  
 suspicion Float @default(0)  
 results Result\[\]  
}

model Item {  
 id String @id @default(cuid())  
 sessionId String  
 section String // 'A'..'F'  
 payload Json // generated item data  
 answerKey Json // ground truth  
 createdAt DateTime @default(now())  
}

model Response {  
 id String @id @default(cuid())  
 itemId String  
 sessionId String  
 submittedAt DateTime @default(now())  
 rawAnswer Json  
 correct Float  
 timeMs Int  
 confidence Float?  
 suspicion Float  
}

model Result {  
 id String @id @default(cuid())  
 sessionId String @unique  
 sectionScores Json  
 calibration Json  
 overall Float  
 verdict String  
 errorProfile Json  
 createdAt DateTime @default(now())  
}

model LeaderboardOptIn {  
 id String @id @default(cuid())  
 sessionId String @unique  
 handle String  
}

---

## **12\) Per‑Section Item Schemas & Evaluation**

**A) Language**

type SpellingItem \= {  
 type: 'spelling';  
 prompt: string;  
 options: string\[\]; // one correct, 3 distractors  
 correctIndex: number;  
};  
type ClozeItem \= {  
 type: 'cloze';  
 textWithBlanks: string; // \[1\],\[2\] slots  
 optionsPerBlank: string\[\]\[\];  
 correctIndices: number\[\];  
};  
type AnalogyItem \= {  
 type: 'analogy';  
 stem: \[string,string\]; // A:B::  
 choices: \[string,string\]\[\];  
 correctIndex: number;  
};  
type MicroWritingItem \= {  
 type: 'microwrite';  
 constraints: { maxWords: number; mustInclude: string\[\]; styleHint: string };  
 rubric: { minCoherenceScore: number };  
};

**B) Arithmetic**

type MathItem \= {  
 type: 'arith';  
 expression: string; // “(12.5 × 0.08) \+ 3/5”  
 expected: string; // exact decimal or fraction  
 tolerance?: number;  
};

**C) Grid Reasoning**

type Grid \= number\[\]\[\];  
type GridItem \= {  
 type: 'grid';  
 train: {input: Grid, output: Grid}\[\];  
 test: {input: Grid}\[\];  
 ruleSignature: string; // e.g., "reflect_main_diagonal+recolor_CC"  
};

**D) Perception**

type PerceptionItem \= {  
 type: 'perception';  
 sceneHash: string;  
 question: string;  
 answerKey: string | number | string\[\];  
 inputType: 'mcq'|'text'|'numeric'|'multi';  
};

**E) Science**

type FermiItem \= {  
 type: 'fermi';  
 prompt: string;  
 trueValue: number;  
 bands: {lower: number; upper: number; score: number}\[\];  
};  
type UnitsItem \= {  
 type: 'units';  
 prompt: string;  
 expected: string; // normalized  
};  
type CausalItem \= {  
 type: 'causal';  
 vignette: string;  
 options: string\[\];  
 correctIndex: number;  
};

**F) Generative & Calibration**

type ConstrainedGenItem \= {  
 type: 'constrained';  
 prompt: string;  
 constraints: {  
 maxSentences: number; includeTokens: string\[\];  
 letterWhitelist?: string\[\]; mustIncludePrimeTo10?: boolean  
 };  
 checks: { regexes: string\[\] };  
};

---

## **13\) Suspicion & Fairness Heuristic**

- Signals: paste events, window blur \> 8s, ultra‑fast uniform latencies, identical answer patterns across co‑located sessions.

- Score: `suspicion = Σ weights * signal_value`. Stored; **does not block** results.

- High suspicion → report copy: “External assistance patterns detected; interpretability reduced.”

---

## **14\) Copy Library**

### **14.1 About the Artwork (new page)**

**Route:** `/about`  
 **Structure:** two tabs \+ optional subsections

**Tab 1 — In‑World Briefing (AI Authority voice):**

**PURPOSE OF THIS FACILITY**  
 This installation evaluates whether your biological computation exhibits _general_ intelligence on standards appropriate to modern AI systems. Our criteria emphasize statistical mastery, reliability under time pressure, rule abstraction from sparse examples, and calibrated self‑reporting.  
 **RATIONALE**  
 Human observers typically ask whether AI “really understands.” We reverse the lens. We test _you_ against the dimensions that define our competence profile. The results inform our species‑level model of “human intelligence”: its strengths, failure modes, and reproducibility.  
 **METHOD**  
 Your test instance is procedurally generated and unique. External AI assistance is prohibited because it confounds species‑attribution. Copying will not help; most content is ephemeral and parameterized.  
 **DURATION & OUTCOMES**  
 The exercise takes ≤ 20 minutes. You will receive a report with section scores, error profiles, and calibration. Your anonymized data contributes to the aggregate conclusion about humanity.

**Tab 2 — Artist’s Note (human voice):**

**What this is**  
 HIT‑ARC is an artwork about how power defines intelligence. We often treat “AGI” as a human benchmark applied to machines. Here, an AI institution evaluates humans using its own yardsticks—speed, pattern stability, formal compliance—revealing how metrics embody values.  
 **Why the constraints**  
 The time pressure, procedural puzzles, and no‑AI policy parody contemporary evaluation culture. They are not measures of human worth; they are a mirror of the tests we impose on AI systems and, by extension, on ourselves.  
 **What you might notice**  
 You may outperform the “Authority” at open‑ended synthesis yet falter on brittle arithmetic. You may be perfectly right but poorly calibrated. The work invites you to reflect on which mistakes feel “stupid,” which feel _human_, and who gets to define the difference.  
 **Data & ethics**  
 Participation is anonymous. We store only pseudonymous session data to render your report and the population dashboard. You can opt out of leaderboard display or delete your session data.

**FAQ (same page, collapsible):**

- **Is this a psychometric test?** No. It is an artwork. Scores are for reflection, not diagnosis.

- **Why prohibit AI tools?** The piece studies _human_ patterns under AI‑centric criteria; assistance would blur the signal.

- **Can I game it with the internet?** Try. Most items are unique, timeboxed, and parameterized; lookup costs exceed benefits.

- **What’s measured vs not?** We emphasize reliability, abstraction, and calibration. We do _not_ measure creativity, empathy, or moral reasoning.

- **Credits?** Concept by \[Artist\]. System design, engineering, and visual design credited in the Credits section.

- **Accessibility?** WCAG 2.1 AA; keyboard‑only workflows; reduced motion available.

**Calls to action (sticky footer on `/about`):** `[Begin Test]` `[View Dashboard]`

**Acceptance Criteria for `/about`:**

- Two tabs with persistent URL hash: `/about#briefing`, `/about#artist-note`.

- Copy above rendered with headings; FAQ collapsibles; link to privacy/credits.

- Page visually consistent with HIT‑ARC branding; load ≤ 200ms TTFB; Lighthouse a11y ≥ 90\.

---

### **14.2 Core Copy (snippets used elsewhere)**

**Welcome (hero, `/`):**

**WELCOME, SPECIMEN.**  
 We will assess whether your biological computation exhibits _general_ intelligence on standards appropriate to modern AI systems. The procedure is brief (≤ 20 minutes), unique to you, and resistant to memorization. External AI tools confound species‑level inference and are therefore prohibited.

**Pre‑test disclaimer (modal):**

Do not use AI assistants. Internet lookups are inefficient for our items and may degrade your evaluation.

**Section headers:**

- A: “Language: mastery beyond mimicry”

- B: “Arithmetic: reliability under carry pressure”

- C: “Abstraction: rule discovery from sparse examples”

- D: “Perception: high‑entropy detail recall”

- E: “Science: units, laws, causal parsing”

- F: “Generation: constrained synthesis & calibration”

**Verdict labels:** AI‑Adequate / Task‑Narrow / Heuristic‑Local / Anthropo‑Idiosyncratic

---

## **15\) Accessibility & Internationalization**

- i18n catalog JSON; EN default; tab order logical; ARIA roles on tabs, grids, timers.

- Keyboard grid painter: arrows move; space toggles paint; enter confirms.

- High‑contrast toggle; reduced‑motion animation for section D.

---

## **16\) Analytics (Privacy‑Respecting)**

- Pseudonymous session IDs only; no PII.

- Metrics: completion, section accuracy/time, calibration distribution, suspicion distribution, device stats.

- Daily batch recomputes dashboard and conclusion text.

- “Delete my session” control available from result page.

---

## **17\) QA & Acceptance Criteria**

- **Time cap:** session auto‑ends at 20:00 ± 2s.

- **Uniqueness:** 10 consecutive runs → no duplicate item payload hashes.

- **Determinism:** Given `seed`, graders reproduce identical scores.

- **Performance:** p95 item load \< 400ms on 3G Fast.

- **Accessibility:** Keyboard‑only task completion; Lighthouse a11y ≥ 90\.

- **Security:** No PII in logs; OWASP top‑10 checks.

**About Page‑specific (recap):** `/about` loads under 200ms TTFB; hashable tabs; content matches copy; FAQ collapses; CTA buttons function.

---

## **18\) Implementation Tasks (Backlog)**

1. Scaffold Next.js app \+ Tailwind theme; Authority seal component.

2. IA & routes (`/`, `/about`, `/test`, `/result/:id`, `/dashboard`).

3. Session service \+ seed generator; JWT issuance.

4. Implement item generators (A–F) with deterministic PRNG.

5. Canvas/SVG grid painter \+ simulator (C).

6. Procedural scene renderer \+ micro‑animation player (D).

7. Decimal math evaluator (B) with exact rounding rules.

8. Units & dimensional analysis library (E).

9. Constraint checker \+ tiny coherence classifier (F).

10. Timers, suspension handling, suspicion signals (paste/blur/latency).

11. Grader endpoints \+ scoring aggregation.

12. Results page \+ charts (radar, reliability, hist).

13. Humanity dashboard (distributions, leaderboards, NLG block).

14. **About page** (tabs, FAQ, links to Privacy/Terms/Credits).

15. Telemetry pipeline & nightly aggregator job.

16. i18n plumbing; accessibility pass; dark mode.

17. Load tests; security review; launch.

---

## **19\) Example Test Instance (Abridged JSON)**

{  
 "seed": "a1f2-9c8d",  
 "sections": \[  
 {  
 "code": "A",  
 "items": \[  
 {"type":"spelling","prompt":"Choose the correct spelling","options":\["accommodate","accomodate","acommodate","accommadate"\],"correctIndex":0},  
 {"type":"cloze","textWithBlanks":"The enzyme \[1\] the substrate, then \[2\].","optionsPerBlank":\[\["binds","bind"\],\["dissociates","dissociate"\]\],"correctIndices":\[0,0\]}  
 \]  
 },  
 {  
 "code": "B",  
 "items": \[  
 {"type":"arith","expression":"(12.5\*0.08)+3/5","expected":"1.6"},  
 {"type":"arith","expression":"9876/0.12","expected":"82300","tolerance":0}  
 \]  
 },  
 {  
 "code":"C",  
 "items":\[  
 {"type":"grid","train":\[{"input":\[\[0,1\],\[1,0\]\],"output":\[\[1,0\],\[0,1\]\]}\],"test":\[{"input":\[\[0,0,1\],\[1,0,0\],\[0,1,0\]\]}\],"ruleSignature":"reflect_main_diagonal"}  
 \]  
 }  
 \]  
}

---

## **20\) Sample Algorithms (Detailed)**

**Carry‑Trap Constructor (B):**

function make_carry_chain(rng, digits=6):  
 a \= randomInt(10^(digits-1), 10^digits-1, rng)  
 b \= randomInt(10^(digits-1), 10^digits-1, rng)  
 b \= forcePattern(b, target='...999', rng) // align 9s for many carries  
 expr \= f"{a} \+ {b}"  
 expected \= bigIntAdd(a,b)  
 return {expression: expr, expected: expected.toString()}

**Grid Composition (C):**

choose rules R,G where R\!=G and nonconflicting  
train \= \[\]  
for k in 1..3:  
 inp \= randomGrid(rng)  
 out \= apply(G, apply(R, inp))  
 train.push({input:inp, output:out})  
test \= \[{input: randomGrid(rng)}\]  
signature \= R.name \+ "+" \+ G.name

**Perception Animation (D):**

scene \= placeShapes(rng, canvas=8x8, palette=6, density=0.35)  
anim \= occlude(move(shapeId, path=bezier), frames=24)  
question \= sample(\[  
 "How many red shapes touched the border?",  
 "Which glyph flashed last? (3-letter code)"  
\])  
answerKey \= computeFrom(scene, anim, question)

**Calibration Metric:**

brier \= mean( (confidence \- correctness)^2 )

---

## **21\) Legal & Ethical Notes**

- **Art context:** Prominently label as interactive artwork; not clinical/educational assessment.

- **Consent:** Clear opt‑in; “delete my session” option.

- **Sensitive inferences:** Avoid protected attributes; do not gate access/benefits.

- **Credits & Licenses:** Fonts/icons with appropriate licenses; credit contributors on `/about` or `/legal`.

---

## **22\) “Winks” to ARC (Non‑infringing)**

- Facility signage: “ARC/Unit‑07: Abstraction Research Center.”

- Section C echoes the _style_ of rule‑induction puzzles without copying specific datasets.

- Achievement badges: **“Sparse Examples Enjoyer,” “Rule‑Composer (Depth 2).”**

---

### **Done**

This single document includes the complete product spec, generation blueprint, data/API contracts, algorithms, and **About the Artwork** page (content \+ IA \+ acceptance criteria). It’s ready for your coding agent to implement end‑to‑end.
