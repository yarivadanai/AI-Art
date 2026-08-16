import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getVerdict } from "@/lib/commentary";
import { referenceAnswerFor } from "@/lib/engine/grade-session";
import { CONFIDENCE_VALUES, SECTION_ORDER, type Confidence, type ResultResponse } from "@/lib/types";

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

    const questionResults = result.session.questions
      .sort((a, b) => {
        const sectionDiff =
          SECTION_ORDER.indexOf(a.section as (typeof SECTION_ORDER)[number]) -
          SECTION_ORDER.indexOf(b.section as (typeof SECTION_ORDER)[number]);
        if (sectionDiff !== 0) return sectionDiff;
        return a.index - b.index;
      })
      .map((q) => {
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
          referenceAnswer: referenceAnswerFor(q),
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
