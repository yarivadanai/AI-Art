import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { gradeAnswer } from "@/lib/engine/grader";
import { getSectionCommentary, getVerdict } from "@/lib/commentary";
import type { AnswerKey, Section } from "@/lib/types";

const SECTIONS: Section[] = [
  "structural",
  "state-tracking",
  "sequential-depth",
  "signal-detection",
  "probabilistic",
];

const SECTION_WEIGHT = 1 / 5;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, responses } = body;

    if (!sessionId || !responses) {
      return NextResponse.json(
        { error: "Missing sessionId or responses" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { questions: true },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    const existingResult = await prisma.result.findUnique({
      where: { sessionId },
    });

    if (existingResult) {
      return NextResponse.json({
        resultId: existingResult.id,
        sectionScores: existingResult.sectionScores,
        overall: existingResult.overall,
        verdict: existingResult.verdict,
      });
    }

    const questionMap = new Map(session.questions.map((q) => [q.id, q]));
    const gradedResponses: {
      questionId: string;
      answer: unknown;
      correct: boolean;
      score: number;
      timeMs: number;
      section: string;
    }[] = [];

    for (const resp of responses) {
      const question = questionMap.get(resp.questionId);
      if (!question) continue;

      const answerKey = question.answerKey as unknown as AnswerKey;
      const { correct, score } = gradeAnswer(String(resp.answer), answerKey);

      gradedResponses.push({
        questionId: resp.questionId,
        answer: resp.answer,
        correct,
        score,
        timeMs: resp.timeMs || 0,
        section: question.section,
      });
    }

    await prisma.response.createMany({
      data: gradedResponses.map((r) => ({
        questionId: r.questionId,
        sessionId,
        answer: r.answer as object,
        correct: r.correct,
        score: r.score,
        timeMs: r.timeMs,
      })),
    });

    const sectionScores: Record<string, number> = {};
    const sectionCommentary: Record<string, string> = {};

    for (const section of SECTIONS) {
      const sectionResponses = gradedResponses.filter(
        (r) => r.section === section
      );
      if (sectionResponses.length === 0) continue;

      const totalScore = sectionResponses.reduce((sum, r) => sum + r.score, 0);
      const maxScore = sectionResponses.length;
      sectionScores[section] = maxScore > 0 ? totalScore / maxScore : 0;

      const correctCount = sectionResponses.filter((r) => r.correct).length;
      sectionCommentary[section] = getSectionCommentary(
        section,
        correctCount,
        maxScore
      );
    }

    let overall = 0;
    for (const section of SECTIONS) {
      overall += (sectionScores[section] || 0) * SECTION_WEIGHT;
    }

    const verdict = getVerdict(overall);
    sectionCommentary.overall = verdict.commentary;

    const questionResults = gradedResponses.map((r) => {
      const question = questionMap.get(r.questionId)!;
      return {
        questionId: r.questionId,
        section: question.section,
        type: question.type,
        correct: r.correct,
        score: r.score,
        payload: question.payload,
        userAnswer: r.answer,
      };
    });

    let result;
    try {
      result = await prisma.result.create({
        data: {
          sessionId,
          sectionScores: sectionScores as object,
          overall,
          verdict: verdict.label,
          commentary: sectionCommentary as object,
        },
      });
    } catch (createError: unknown) {
      // Handle race condition: if another request already created the result
      const isUniqueViolation =
        createError instanceof Error &&
        createError.message.includes("Unique constraint");
      if (isUniqueViolation) {
        const existing = await prisma.result.findUnique({
          where: { sessionId },
        });
        if (existing) {
          return NextResponse.json({
            resultId: existing.id,
            sectionScores: existing.sectionScores,
            overall: existing.overall,
            verdict: existing.verdict,
          });
        }
      }
      throw createError;
    }

    return NextResponse.json({
      resultId: result.id,
      sectionScores,
      overall,
      verdict: verdict.label,
      verdictBand: verdict.band,
      commentary: sectionCommentary,
      questionResults,
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit responses" },
      { status: 500 }
    );
  }
}
