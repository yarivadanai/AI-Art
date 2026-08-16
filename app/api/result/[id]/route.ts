import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getVerdict } from "@/lib/commentary";
import {
  CONFIDENCE_VALUES,
  SECTION_ORDER,
  type AnswerKey,
  type Confidence,
  type ResultResponse,
} from "@/lib/types";
import type { Question } from "@prisma/client";

/**
 * Plaintext reference answer for a stored question. Sessions created since
 * Phase 1 carry it in answerKey.reference. Older rows fall back to a lookup in
 * the bank by (subtype, answerHash), which is stable across prompt edits; the
 * bank is imported lazily so this route only pays for it when needed.
 */
async function referenceAnswerFor(question: Question): Promise<string | null> {
  const key = question.answerKey as unknown as AnswerKey;
  if (typeof key.reference === "string") return key.reference;
  const { DATASET } = await import("@/lib/banks/dataset");
  const item = DATASET.find((d) => d.subtype === question.type && d.answerHash === key.hash);
  return item?._verifiedAnswer ?? null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await prisma.result.findUnique({
      where: { id: params.id },
      include: {
        session: {
          include: {
            questions: true,
            responses: true,
          },
        },
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      );
    }

    const verdict = getVerdict(result.overall);
    const responseMap = new Map(result.session.responses.map((r) => [r.questionId, r]));

    const sortedQuestions = result.session.questions.sort((a, b) => {
      const sectionDiff =
        SECTION_ORDER.indexOf(a.section as (typeof SECTION_ORDER)[number]) -
        SECTION_ORDER.indexOf(b.section as (typeof SECTION_ORDER)[number]);
      if (sectionDiff !== 0) return sectionDiff;
      return a.index - b.index;
    });
    const references = await Promise.all(sortedQuestions.map((q) => referenceAnswerFor(q)));

    const questionResults = sortedQuestions.map((q, i) => {
        const response = responseMap.get(q.id);
        const confidence =
          response?.confidence && (CONFIDENCE_VALUES as string[]).includes(response.confidence)
            ? (response.confidence as Confidence)
            : null;
        return {
          questionId: q.id,
          section: q.section,
          type: q.type,
          correct: response?.correct ?? false,
          score: response?.score ?? 0,
          payload: q.payload,
          userAnswer: response?.answer ?? null,
          // The session is graded; revealing the reference now closes the loop.
          referenceAnswer: references[i],
          timeMs: response?.timeMs ?? 0,
          confidence,
          abstained: response?.abstained ?? false,
        };
      });

    const body: ResultResponse = {
      resultId: result.id,
      specimenId: result.sessionId,
      sectionScores: result.sectionScores as unknown as ResultResponse["sectionScores"],
      overall: result.overall,
      verdict: result.verdict,
      verdictBand: verdict.band,
      commentary: result.commentary as Record<string, string>,
      metrics: (result.metrics as ResultResponse["metrics"]) ?? null,
      beliefs: (result.session.beliefs as ResultResponse["beliefs"]) ?? null,
      questionResults: questionResults as unknown as ResultResponse["questionResults"],
    };
    return NextResponse.json(body);
  } catch (error) {
    console.error("Result fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}
