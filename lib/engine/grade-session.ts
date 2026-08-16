import { prisma } from "@/lib/db";
import { gradeAnswer } from "@/lib/engine/grader";
import { computeMetrics, type GradedItem } from "@/lib/engine/metrics";
import { getSectionCommentary, getVerdict } from "@/lib/commentary";
import { DATASET } from "@/lib/banks/dataset";
import {
  CONFIDENCE_VALUES,
  SECTION_ORDER,
  type AnswerKey,
  type AnswerSubmission,
  type Confidence,
  type QuestionPayload,
  type Section,
  type SectionSummary,
} from "@/lib/types";
import type { Question } from "@prisma/client";

export interface GradedRow extends GradedItem {
  questionId: string;
  type: string;
  answer: string;
  score: number;
}

function normalizeConfidence(v: unknown): Confidence | null {
  return typeof v === "string" && (CONFIDENCE_VALUES as string[]).includes(v) ? (v as Confidence) : null;
}

/**
 * Grade a batch of submissions against a session's questions and upsert one
 * Response row per (session, question). Idempotent: resubmitting a question
 * overwrites its row (last write wins), which is what the client's retry path
 * relies on. Unknown questionIds are ignored. Abstentions grade as wrong with
 * an empty answer and are flagged so calibration can treat them separately.
 */
export async function gradeAndStore(
  sessionId: string,
  questions: Question[],
  submissions: AnswerSubmission[]
): Promise<GradedRow[]> {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const rows: GradedRow[] = [];

  for (const sub of submissions) {
    if (!sub || typeof sub !== "object") continue;
    const question = questionMap.get(String(sub.questionId));
    if (!question) continue;

    const abstained = sub.abstained === true;
    const answer = abstained ? "" : String(sub.answer ?? "");
    const answerKey = question.answerKey as unknown as AnswerKey;
    const graded = abstained ? { correct: false, score: 0 } : gradeAnswer(answer, answerKey);
    const timeMs = Number.isFinite(Number(sub.timeMs)) ? Math.max(0, Math.round(Number(sub.timeMs))) : 0;
    const confidence = normalizeConfidence(sub.confidence);

    rows.push({
      questionId: question.id,
      section: question.section as Section,
      type: question.type,
      answer,
      correct: graded.correct,
      score: graded.score,
      timeMs,
      confidence,
      abstained,
    });
  }

  if (rows.length === 0) return rows;

  await prisma.$transaction(
    rows.map((r) =>
      prisma.response.upsert({
        where: { sessionId_questionId: { sessionId, questionId: r.questionId } },
        create: {
          sessionId,
          questionId: r.questionId,
          answer: r.answer,
          correct: r.correct,
          score: r.score,
          timeMs: r.timeMs,
          confidence: r.confidence,
          abstained: r.abstained,
        },
        update: {
          answer: r.answer,
          correct: r.correct,
          score: r.score,
          timeMs: r.timeMs,
          confidence: r.confidence,
          abstained: r.abstained,
        },
      })
    )
  );

  return rows;
}

/** Load all stored responses for a session as graded rows (questions without a response are omitted). */
export async function loadGradedRows(sessionId: string, questions: Question[]): Promise<GradedRow[]> {
  const responses = await prisma.response.findMany({ where: { sessionId } });
  const qmap = new Map(questions.map((q) => [q.id, q]));
  const rows: GradedRow[] = [];
  for (const r of responses) {
    const q = qmap.get(r.questionId);
    if (!q) continue;
    rows.push({
      questionId: r.questionId,
      section: q.section as Section,
      type: q.type,
      answer: typeof r.answer === "string" ? r.answer : JSON.stringify(r.answer),
      correct: r.correct,
      score: r.score,
      timeMs: r.timeMs,
      confidence: normalizeConfidence(r.confidence),
      abstained: r.abstained,
    });
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
 * with no response count as unanswered (wrong) so an incomplete submission
 * still produces a fair, complete profile.
 */
export function buildResult(questions: Question[], rows: GradedRow[]) {
  const byId = new Map(rows.map((r) => [r.questionId, r]));
  const items: GradedItem[] = questions.map((q) => {
    const r = byId.get(q.id);
    return r ?? { section: q.section as Section, correct: false, timeMs: 0, confidence: null, abstained: false };
  });

  const sectionScores: Record<string, number> = {};
  const sectionCommentary: Record<string, string> = {};
  for (const section of SECTION_ORDER) {
    const sectionItems = items.filter((i) => i.section === section);
    if (sectionItems.length === 0) continue;
    const correctCount = sectionItems.filter((i) => i.correct).length;
    sectionScores[section] = correctCount / sectionItems.length;
    sectionCommentary[section] = getSectionCommentary(section, correctCount, sectionItems.length);
  }

  let overall = 0;
  for (const section of SECTION_ORDER) overall += (sectionScores[section] || 0) * SECTION_WEIGHT;

  const verdict = getVerdict(overall);
  sectionCommentary.overall = verdict.commentary;
  const metrics = computeMetrics(items);

  return { sectionScores, sectionCommentary, overall, verdict, metrics };
}

/**
 * Plaintext reference answer for a stored question. New sessions carry it in
 * answerKey.reference; sessions created before Phase 1 fall back to matching
 * the served payload against the bank.
 */
export function referenceAnswerFor(question: Question): string | null {
  const key = question.answerKey as unknown as AnswerKey;
  if (typeof key.reference === "string") return key.reference;
  const payload = question.payload as unknown as QuestionPayload;
  const item = DATASET.find(
    (d) =>
      d.section === question.section &&
      d.subtype === question.type &&
      d.prompt === payload.prompt &&
      (d.clientSeed ?? null) === (payload.clientSeed ?? null)
  );
  return item?._verifiedAnswer ?? null;
}
