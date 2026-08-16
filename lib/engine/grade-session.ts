import { prisma } from "@/lib/db";
import { gradeAnswer } from "@/lib/engine/grader";
import { computeMetrics, type GradedItem } from "@/lib/engine/metrics";
import { getSectionCommentary, getVerdict } from "@/lib/commentary";
import {
  CONFIDENCE_VALUES,
  SECTION_ORDER,
  type AnswerKey,
  type AnswerSubmission,
  type Confidence,
  type Section,
  type SectionSummary,
} from "@/lib/types";
import type { Question, Response } from "@prisma/client";

export interface GradedRow extends GradedItem {
  questionId: string;
  type: string;
  answer: string;
  score: number;
}

function normalizeConfidence(v: unknown): Confidence | null {
  return typeof v === "string" && (CONFIDENCE_VALUES as string[]).includes(v) ? (v as Confidence) : null;
}

function rowFromResponse(r: Response, q: Question): GradedRow {
  return {
    questionId: r.questionId,
    section: q.section as Section,
    type: q.type,
    answer: typeof r.answer === "string" ? r.answer : JSON.stringify(r.answer),
    correct: r.correct,
    score: r.score,
    timeMs: r.timeMs,
    confidence: normalizeConfidence(r.confidence),
    abstained: r.abstained,
  };
}

/**
 * Grade a batch of submissions against a session's questions and store one
 * Response row per (session, question). FIRST WRITE WINS: a question that
 * already has a row is never re-graded or overwritten, and its stored row is
 * returned instead. This makes /api/section and /api/submit idempotent for the
 * real client (which resends identical answers on retry) and closes the
 * pre-submit oracle: each item can be graded exactly once, which is no more
 * information than the post-submit report reveals. Unknown questionIds are
 * ignored. Abstentions grade as wrong with an empty answer and are flagged.
 */
export async function gradeAndStore(
  sessionId: string,
  questions: Question[],
  submissions: AnswerSubmission[]
): Promise<GradedRow[]> {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const existing = await prisma.response.findMany({ where: { sessionId } });
  const existingByQ = new Map(existing.map((r) => [r.questionId, r]));

  const rows: GradedRow[] = [];
  const toCreate: GradedRow[] = [];
  const seen = new Set<string>();

  for (const sub of submissions) {
    if (!sub || typeof sub !== "object") continue;
    const qid = String(sub.questionId);
    const question = questionMap.get(qid);
    if (!question || seen.has(qid)) continue;
    seen.add(qid);

    const prior = existingByQ.get(qid);
    if (prior) {
      rows.push(rowFromResponse(prior, question));
      continue;
    }

    const abstained = sub.abstained === true;
    const answer = abstained ? "" : String(sub.answer ?? "");
    const answerKey = question.answerKey as unknown as AnswerKey;
    const graded = abstained ? { correct: false, score: 0 } : gradeAnswer(answer, answerKey);
    const timeMs = Number.isFinite(Number(sub.timeMs)) ? Math.max(0, Math.round(Number(sub.timeMs))) : 0;
    const confidence = normalizeConfidence(sub.confidence);

    const row: GradedRow = {
      questionId: question.id,
      section: question.section as Section,
      type: question.type,
      answer,
      correct: graded.correct,
      score: graded.score,
      timeMs,
      confidence,
      abstained,
    };
    rows.push(row);
    toCreate.push(row);
  }

  if (toCreate.length > 0) {
    // skipDuplicates: a concurrent request may have created the same row; the
    // unique (sessionId, questionId) index makes first-write-wins hold under races.
    await prisma.response.createMany({
      data: toCreate.map((r) => ({
        sessionId,
        questionId: r.questionId,
        answer: r.answer,
        correct: r.correct,
        score: r.score,
        timeMs: r.timeMs,
        confidence: r.confidence,
        abstained: r.abstained,
      })),
      skipDuplicates: true,
    });
  }

  return rows;
}

/** Load all stored responses for a session as graded rows (questions without a response are omitted). */
export async function loadGradedRows(sessionId: string, questions: Question[]): Promise<GradedRow[]> {
  const responses = await prisma.response.findMany({ where: { sessionId } });
  const qmap = new Map(questions.map((q) => [q.id, q]));
  const rows: GradedRow[] = [];
  for (const r of responses) {
    const q = qmap.get(r.questionId);
    if (q) rows.push(rowFromResponse(r, q));
  }
  return rows;
}

export function summarizeSections(rows: GradedRow[]): SectionSummary[] {
  const metrics = computeMetrics(rows);
  return SECTION_ORDER.filter((s) => metrics.perSection[s].total > 0).map((s) => metrics.perSection[s]);
}

const SECTION_WEIGHT = 1 / SECTION_ORDER.length;

/**
 * Compute the final result for a session from its stored responses. Questions
 * with no response count as wrong for the scores (an incomplete submission
 * still produces a complete profile) but are excluded from the calibration and
 * timing metrics, which describe only what the specimen actually did.
 */
export function buildResult(questions: Question[], rows: GradedRow[]) {
  const byId = new Map(rows.map((r) => [r.questionId, r]));

  const sectionScores: Record<string, number> = {};
  const sectionCommentary: Record<string, string> = {};
  for (const section of SECTION_ORDER) {
    const sectionQs = questions.filter((q) => q.section === section);
    if (sectionQs.length === 0) continue;
    const correctCount = sectionQs.filter((q) => byId.get(q.id)?.correct).length;
    sectionScores[section] = correctCount / sectionQs.length;
    sectionCommentary[section] = getSectionCommentary(section, correctCount, sectionQs.length);
  }

  let overall = 0;
  for (const section of SECTION_ORDER) overall += (sectionScores[section] || 0) * SECTION_WEIGHT;

  const verdict = getVerdict(overall);
  sectionCommentary.overall = verdict.commentary;
  const metrics = computeMetrics(rows);

  return { sectionScores, sectionCommentary, overall, verdict, metrics };
}
