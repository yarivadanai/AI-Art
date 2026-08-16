import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { finalizeAdaptive, progressOf, readState, toServed } from "@/lib/engine/adaptive";

/**
 * GET /api/session/:id - recovery: the current item and progress of an
 * adaptive session (or the result id if it is finished). Never returns answer keys.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await prisma.session.findUnique({
      where: { id: params.id },
      include: { questions: true, result: true },
    });
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    const state = readState(session);
    if (!state) return NextResponse.json({ error: "Not an adaptive session" }, { status: 409 });
    if (session.result || state.done) {
      const resultId = session.result?.id ?? (await finalizeAdaptive(session.id, state));
      return NextResponse.json({ done: { resultId }, progress: progressOf(state) });
    }
    const current = state.currentQuestionId ? session.questions.find((q) => q.id === state.currentQuestionId) : null;
    return NextResponse.json({
      sessionId: session.id,
      specimenId: session.id,
      expiresAt: session.expiresAt.toISOString(),
      question: current ? toServed(current) : undefined,
      progress: progressOf(state),
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}
