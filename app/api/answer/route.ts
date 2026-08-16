import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { answerAdaptive, progressOf, readState, toServed } from "@/lib/engine/adaptive";
import { SUBMIT_GRACE_MS } from "@/lib/engine/limits";
import type { AnswerResponse } from "@/lib/types";

/**
 * POST /api/answer - answer the current item of an adaptive session.
 * Grades it (first write wins), moves the staircase, and returns the next
 * item, a section summary at domain boundaries, or the result id at the end.
 * Re-sending an already-graded item replays the current item (idempotent).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const sessionId = body?.sessionId;
    const questionId = body?.questionId;
    if (!sessionId || !questionId) {
      return NextResponse.json({ error: "Missing sessionId or questionId" }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { questions: true, result: true },
    });
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    const state = readState(session);
    if (!state) return NextResponse.json({ error: "Not an adaptive session" }, { status: 409 });
    if (session.result) {
      return NextResponse.json({ error: "Session already graded", resultId: session.result.id }, { status: 409 });
    }
    if (Date.now() > session.expiresAt.getTime() + SUBMIT_GRACE_MS) {
      return NextResponse.json({ error: "Session ceiling elapsed. Partial sessions are not graded." }, { status: 410 });
    }
    if (!session.questions.some((q) => q.id === questionId)) {
      return NextResponse.json({ error: "Unknown question for this session" }, { status: 400 });
    }

    const out = await answerAdaptive(session, state, session.questions, {
      questionId,
      answer: String(body.answer ?? ""),
      timeMs: Number(body.timeMs ?? 0),
      confidence: body.confidence ?? null,
      abstained: body.abstained === true,
    });

    if ("replay" in out) {
      return NextResponse.json({
        replay: true,
        question: out.question ? toServed(out.question) : undefined,
        progress: progressOf(out.state),
        done: out.done,
      });
    }

    const response: AnswerResponse = {
      graded: out.graded,
      sectionComplete: out.sectionComplete,
      question: out.question ? toServed(out.question) : undefined,
      progress: progressOf(out.state),
      done: out.done,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Answer error:", error);
    return NextResponse.json({ error: "Failed to record answer" }, { status: 500 });
  }
}
