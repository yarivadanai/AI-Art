import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getVerdict } from "@/lib/commentary";

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

    // Build question results
    const responseMap = new Map(
      result.session.responses.map((r) => [r.questionId, r])
    );

    const questionResults = result.session.questions
      .sort((a, b) => {
        const sectionOrder = [
          "language",
          "math",
          "coding",
          "perception",
          "memory",
          "knowledge",
        ];
        const sectionDiff =
          sectionOrder.indexOf(a.section) - sectionOrder.indexOf(b.section);
        if (sectionDiff !== 0) return sectionDiff;
        return a.index - b.index;
      })
      .map((q) => {
        const response = responseMap.get(q.id);
        return {
          questionId: q.id,
          section: q.section,
          type: q.type,
          correct: response?.correct ?? false,
          score: response?.score ?? 0,
          payload: q.payload,
          userAnswer: response?.answer ?? null,
          correctAnswer: (q.answerKey as { correct: unknown }).correct,
        };
      });

    return NextResponse.json({
      resultId: result.id,
      sectionScores: result.sectionScores,
      overall: result.overall,
      verdict: result.verdict,
      verdictBand: verdict.band,
      commentary: result.commentary,
      questionResults,
    });
  } catch (error) {
    console.error("Result fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}
