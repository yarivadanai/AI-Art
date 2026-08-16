import { prisma } from "@/lib/db";
import { SeededRNG } from "@/lib/engine/rng";
import { generateItem, familiesFor, getFamily } from "@/lib/generators";
import { MAX_D, MIN_D } from "@/lib/generators/types";
import { getBank } from "@/lib/banks/dataset";
import { datasetItemToQuestion } from "@/lib/engine/test-plan";
import { gradeAndStore, loadGradedRows, type GradedRow } from "@/lib/engine/grade-session";
import { computeMetrics } from "@/lib/engine/metrics";
import { getSectionCommentary, getVerdict } from "@/lib/commentary";
import {
  SECTION_ORDER,
  type AdaptiveProgress,
  type AnswerKey,
  type AnswerSubmission,
  type FinaleOutcome,
  type GeneratedQuestion,
  type Section,
  type SectionSummary,
  type ServedQuestion,
} from "@/lib/types";
import type { Question, Session } from "@prisma/client";

/** Ladder rungs per domain before the machine-scale finale. */
export const LADDER_LENGTH = 6;
export const START_LEVEL = 3;
export const ITEMS_PER_SECTION = LADDER_LENGTH + 1;

/** Persisted on Session.state. */
export interface AdaptiveState {
  version: 2;
  sectionIndex: number;
  /** Items served so far in the current section, 0..ITEMS_PER_SECTION. */
  itemIndex: number;
  /** Current ladder level for the next rung. */
  level: number;
  frontiers: Record<Section, number>;
  finales: Record<Section, FinaleOutcome>;
  currentQuestionId: string | null;
  done: boolean;
}

export function newState(): AdaptiveState {
  const zero = Object.fromEntries(SECTION_ORDER.map((s) => [s, 0])) as Record<Section, number>;
  const un = Object.fromEntries(SECTION_ORDER.map((s) => [s, "unanswered"])) as Record<Section, FinaleOutcome>;
  return {
    version: 2,
    sectionIndex: 0,
    itemIndex: 0,
    level: START_LEVEL,
    frontiers: zero,
    finales: un,
    currentQuestionId: null,
    done: false,
  };
}

export function readState(session: Session): AdaptiveState | null {
  const s = session.state as unknown as AdaptiveState | null;
  return s && s.version === 2 ? s : null;
}

export function currentSection(state: AdaptiveState): Section {
  return SECTION_ORDER[Math.min(state.sectionIndex, SECTION_ORDER.length - 1)];
}

export function progressOf(state: AdaptiveState): AdaptiveProgress {
  return {
    sectionIndex: state.sectionIndex,
    sectionsTotal: SECTION_ORDER.length,
    itemIndex: state.itemIndex,
    itemsPerSection: ITEMS_PER_SECTION,
    ladderLength: LADDER_LENGTH,
    currentLevel: state.itemIndex < LADDER_LENGTH ? state.level : null,
  };
}

// ── item construction ──────────────────────────────────────────────────────

/** Rotate the section's three families so consecutive rungs differ; offset seeded per session. */
function familyForRung(seed: string, section: Section, rung: number): string {
  const fams = familiesFor(section);
  const offset = new SeededRNG(`${seed}|fam|${section}`).int(0, fams.length - 1);
  return fams[(offset + rung) % fams.length].family;
}

function ladderQuestion(seed: string, section: Section, rung: number, level: number): GeneratedQuestion {
  const family = familyForRung(seed, section, rung);
  const fam = getFamily(family)!;
  const item = generateItem(family, `${seed}|${section}|${rung}`, level);
  return {
    section,
    index: rung,
    type: family,
    payload: {
      prompt: item.prompt,
      inputType: item.inputType,
      ...(item.options && { options: item.options }),
      ...(item.display && { display: item.display }),
      timeLimit: item.timeLimit,
      meta: { kind: "ladder", level, label: fam.label },
    },
    answerKey: {
      hash: "",
      normalization: "exact",
      reference: item.reference,
      grader: item.grader,
    },
  };
}

/** The domain's machine-scale finale: a bank T3 item whose data is actually rendered. */
function finaleQuestion(seed: string, section: Section): GeneratedQuestion {
  const pool = getBank(section).filter((q) => q.tier === 3);
  const rng = new SeededRNG(`${seed}|finale|${section}`);
  const item = rng.pick(pool);
  const q = datasetItemToQuestion(item, section, LADDER_LENGTH);
  q.payload.meta = { kind: "finale", label: item.subtype.replace(/[-_]/g, " ") };
  return q;
}

async function persistQuestion(sessionId: string, q: GeneratedQuestion): Promise<Question> {
  return prisma.question.create({
    data: {
      sessionId,
      section: q.section,
      index: q.index,
      type: q.type,
      payload: q.payload as object,
      answerKey: q.answerKey as object,
    },
  });
}

export function toServed(q: Question): ServedQuestion {
  return {
    id: q.id,
    section: q.section as Section,
    index: q.index,
    type: q.type,
    payload: q.payload as unknown as ServedQuestion["payload"],
  };
}

/** Serve the item the state calls for next (does not mutate state.itemIndex; the caller does). */
async function serveNext(session: Session, state: AdaptiveState): Promise<Question> {
  const section = currentSection(state);
  const q =
    state.itemIndex < LADDER_LENGTH
      ? ladderQuestion(session.seed, section, state.itemIndex, state.level)
      : finaleQuestion(session.seed, section);
  return persistQuestion(session.id, q);
}

/** Create the first item of a fresh adaptive session and store the state. */
export async function startAdaptive(session: Session): Promise<{ question: Question; state: AdaptiveState }> {
  const state = newState();
  const question = await serveNext(session, state);
  state.currentQuestionId = question.id;
  await prisma.session.update({ where: { id: session.id }, data: { state: state as unknown as object, mode: "adaptive" } });
  return { question, state };
}

export interface AdvanceResult {
  graded: { questionId: string; correct: boolean; score: number; level: number | null; kind: "ladder" | "finale" };
  sectionComplete?: { summary: SectionSummary; frontier: number; finale: FinaleOutcome };
  question?: Question;
  state: AdaptiveState;
  done?: { resultId: string };
}

/**
 * Grade the current item (first write wins), move the staircase, and serve the
 * next item / section summary / final result. Idempotent: re-sending the
 * answer for an item that is no longer current returns the current item again.
 */
export async function answerAdaptive(
  session: Session,
  state: AdaptiveState,
  questions: Question[],
  submission: AnswerSubmission
): Promise<AdvanceResult | { replay: true; question: Question | null; state: AdaptiveState; done?: { resultId: string } }> {
  const qmap = new Map(questions.map((q) => [q.id, q]));
  const target = qmap.get(String(submission.questionId));
  if (!target) throw new Error("unknown question");

  if (state.done) {
    // Idempotent: a done session always resolves to its result (created if a
    // previous attempt failed between grading and finalizing).
    const resultId = await finalizeAdaptive(session.id, state);
    return { replay: true, question: null, state, done: { resultId } };
  }
  if (target.id !== state.currentQuestionId) {
    // Already advanced past this item: replay the current one.
    const current = state.currentQuestionId ? qmap.get(state.currentQuestionId) ?? null : null;
    return { replay: true, question: current, state };
  }

  const rows = await gradeAndStore(session.id, [target], [submission]);
  const row = rows[0];
  const meta = (target.payload as unknown as { meta?: { kind: "ladder" | "finale"; level?: number } }).meta;
  const kind = meta?.kind ?? "ladder";
  const level = meta?.level ?? null;
  const section = currentSection(state);

  const graded = { questionId: target.id, correct: !!row?.correct, score: row?.score ?? 0, level, kind };

  // Move the staircase.
  if (kind === "ladder") {
    if (row?.correct) {
      state.frontiers[section] = Math.max(state.frontiers[section], state.level);
      state.level = Math.min(MAX_D, state.level + 1);
    } else {
      state.level = Math.max(MIN_D, state.level - 1);
    }
  } else {
    state.finales[section] = row?.abstained ? "abstained" : row?.correct ? "correct" : "wrong";
  }
  state.itemIndex += 1;

  let sectionComplete: AdvanceResult["sectionComplete"];
  if (state.itemIndex >= ITEMS_PER_SECTION) {
    const all = await loadGradedRows(session.id, questions.concat(target));
    const sectionRows = all.filter((r) => r.section === section);
    const summary = computeMetrics(sectionRows).perSection[section];
    sectionComplete = { summary, frontier: state.frontiers[section], finale: state.finales[section] };
    state.sectionIndex += 1;
    state.itemIndex = 0;
    state.level = START_LEVEL;
  }

  if (state.sectionIndex >= SECTION_ORDER.length) {
    // Finalize first, then mark done: if result creation fails the state still
    // points at the last item and the client's retry re-enters here.
    state.currentQuestionId = null;
    const resultId = await finalizeAdaptive(session.id, state);
    state.done = true;
    await prisma.session.update({ where: { id: session.id }, data: { state: state as unknown as object } });
    return { graded, sectionComplete, state, done: { resultId } };
  }

  const next = await serveNext(session, state);
  state.currentQuestionId = next.id;
  await prisma.session.update({ where: { id: session.id }, data: { state: state as unknown as object } });
  return { graded, sectionComplete, question: next, state };
}

/**
 * Build and store the Result for an adaptive session. Section score = frontier / MAX_D
 * (highest level cleared), overall = mean; metrics carry frontiers and finale
 * outcomes. Idempotent.
 */
export async function finalizeAdaptive(sessionId: string, state: AdaptiveState): Promise<string> {
  const existing = await prisma.result.findUnique({ where: { sessionId } });
  if (existing) return existing.id;

  const questions = await prisma.question.findMany({ where: { sessionId } });
  const rows: GradedRow[] = await loadGradedRows(sessionId, questions);
  const sectionScores: Record<string, number> = {};
  const commentary: Record<string, string> = {};
  for (const section of SECTION_ORDER) {
    const f = state.frontiers[section] ?? 0;
    sectionScores[section] = f / MAX_D;
    commentary[section] = getSectionCommentary(section, f, MAX_D);
  }
  const overall = SECTION_ORDER.reduce((s, sec) => s + sectionScores[sec], 0) / SECTION_ORDER.length;
  const verdict = getVerdict(overall);
  commentary.overall = verdict.commentary;
  const metrics = { ...computeMetrics(rows), mode: "adaptive" as const, frontiers: state.frontiers, finales: state.finales };

  try {
    const result = await prisma.result.create({
      data: {
        sessionId,
        sectionScores: sectionScores as object,
        overall,
        verdict: verdict.label,
        commentary: commentary as object,
        metrics: metrics as unknown as object,
      },
    });
    return result.id;
  } catch (e) {
    const again = await prisma.result.findUnique({ where: { sessionId } });
    if (again) return again.id;
    throw e;
  }
}

/** Reference answer for a stored question (adaptive items always carry one). */
export function referenceOf(q: Question): string | null {
  const key = q.answerKey as unknown as AnswerKey;
  return typeof key.reference === "string" ? key.reference : null;
}
