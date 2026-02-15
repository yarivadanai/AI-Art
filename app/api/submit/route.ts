import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { gradeAnswer } from "@/lib/engine/grader";
import { getSectionCommentary, getVerdict } from "@/lib/commentary";
import type { AnswerKey, Section, SectionScores } from "@/lib/types";

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

    // Fetch session with questions
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

    // Check if result already exists
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

    // Grade each response
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
      const { correct, score } = gradeAnswer(resp.answer, answerKey);

      gradedResponses.push({
        questionId: resp.questionId,
        answer: resp.answer,
        correct,
        score,
        timeMs: resp.timeMs || 0,
        section: question.section,
      });
    }

    // Store responses
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

    // Compute section scores
    const sections: Section[] = [
      "language",
      "math",
      "coding",
      "perception",
      "memory",
      "knowledge",
    ];

    const sectionScores: Record<string, number> = {};
    const sectionCommentary: Record<string, string> = {};

    for (const section of sections) {
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

    // Compute overall score with weights
    const hasCoding = session.includesCoding && sectionScores.coding !== undefined;
    let weights: Record<string, number>;

    if (hasCoding) {
      weights = {
        language: 0.18,
        math: 0.18,
        coding: 0.18,
        perception: 0.16,
        memory: 0.16,
        knowledge: 0.14,
      };
    } else {
      weights = {
        language: 0.216,
        math: 0.216,
        perception: 0.196,
        memory: 0.196,
        knowledge: 0.176,
      };
    }

    let overall = 0;
    for (const [section, weight] of Object.entries(weights)) {
      overall += (sectionScores[section] || 0) * weight;
    }

    const verdict = getVerdict(overall);
    sectionCommentary.overall = verdict.commentary;

    // Build question results for the response
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
        correctAnswer: (question.answerKey as { correct: unknown }).correct,
      };
    });

    // Store result
    const result = await prisma.result.create({
      data: {
        sessionId,
        sectionScores: sectionScores as object,
        overall,
        verdict: verdict.label,
        commentary: sectionCommentary as object,
      },
    });

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
