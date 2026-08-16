import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { gradeAndStore, summarizeSections } from "@/lib/engine/grade-session";
import { SUBMIT_GRACE_MS } from "@/lib/engine/limits";

/**
 * POST /api/section - grade and store one section's answers mid-test so the
 * Authority can give real feedback at the transition. Idempotent per
 * (session, question). The final POST /api/submit re-sends everything, so a
 * failed call here loses nothing.
 *
 * Body: { sessionId, responses: AnswerSubmission[] }
 * Returns: { sections: SectionSummary[] } for the sections that now have responses.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const sessionId = body?.sessionId;
    const responses = body?.responses;
    if (!sessionId || !Array.isArray(responses)) {
      return NextResponse.json({ error: "Missing sessionId or responses" }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { questions: true, result: true },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (session.result) {
      return NextResponse.json({ error: "Session already graded" }, { status: 409 });
    }
    if (Date.now() > session.expiresAt.getTime() + SUBMIT_GRACE_MS) {
      return NextResponse.json({ error: "Session ceiling elapsed." }, { status: 410 });
    }

    const rows = await gradeAndStore(sessionId, session.questions, responses);
    return NextResponse.json({ sections: summarizeSections(rows) });
  } catch (error) {
    console.error("Section grading error:", error);
    return NextResponse.json({ error: "Failed to grade section" }, { status: 500 });
  }
}
