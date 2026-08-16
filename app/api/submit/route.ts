import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SUBMIT_GRACE_MS } from "@/lib/engine/limits";
import { buildResult, gradeAndStore, loadGradedRows } from "@/lib/engine/grade-session";
import { finalizeAdaptive, readState } from "@/lib/engine/adaptive";

/**
 * POST /api/submit - final grading. Upserts every submitted answer (so this
 * works with or without earlier /api/section calls), then builds the Result
 * from all stored responses. Idempotent per session: a second call returns the
 * existing result.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const sessionId = body?.sessionId;
    const responses = body?.responses;

    if (!sessionId || !responses) {
      return NextResponse.json(
        { error: "Missing sessionId or responses" },
        { status: 400 }
      );
    }
    if (!Array.isArray(responses)) {
      return NextResponse.json(
        { error: "responses must be an array" },
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

    const existingResult = await prisma.result.findUnique({ where: { sessionId } });
    if (existingResult) {
      return NextResponse.json({
        resultId: existingResult.id,
        sectionScores: existingResult.sectionScores,
        overall: existingResult.overall,
        verdict: existingResult.verdict,
      });
    }

    if (Date.now() > session.expiresAt.getTime() + SUBMIT_GRACE_MS) {
      console.warn("Submit rejected: session past ceiling", {
        sessionId,
        expiresAt: session.expiresAt.toISOString(),
      });
      return NextResponse.json(
        { error: "Session ceiling elapsed. Partial sessions are not graded." },
        { status: 410 }
      );
    }

    // Adaptive sessions grade per item via /api/answer; /api/submit finalizes
    // whatever has been answered (used when a session ends early).
    const adaptiveState = readState(session);
    if (adaptiveState) {
      const resultId = await finalizeAdaptive(sessionId, adaptiveState);
      const r = await prisma.result.findUnique({ where: { id: resultId } });
      return NextResponse.json({
        resultId,
        sectionScores: r?.sectionScores,
        overall: r?.overall,
        verdict: r?.verdict,
        metrics: r?.metrics,
      });
    }

    await gradeAndStore(sessionId, session.questions, responses);
    const rows = await loadGradedRows(sessionId, session.questions);
    const { sectionScores, sectionCommentary, overall, verdict, metrics } = buildResult(session.questions, rows);

    let result;
    try {
      result = await prisma.result.create({
        data: {
          sessionId,
          sectionScores: sectionScores as object,
          overall,
          verdict: verdict.label,
          commentary: sectionCommentary as object,
          metrics: metrics as unknown as object,
        },
      });
    } catch (createError: unknown) {
      // Race: another request created the result between our check and create.
      const isUniqueViolation =
        createError instanceof Error &&
        createError.message.includes("Unique constraint");
      if (isUniqueViolation) {
        const existing = await prisma.result.findUnique({ where: { sessionId } });
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
      metrics,
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit responses" },
      { status: 500 }
    );
  }
}
