import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateTestPlan } from "@/lib/engine/test-plan";
import { progressOf, startAdaptive, toServed } from "@/lib/engine/adaptive";
import { SESSION_CEILING_MS } from "@/lib/engine/limits";
import { sanitizeBeliefs } from "@/lib/beliefs";
import { SECTION_ORDER, type AdaptiveSessionResponse } from "@/lib/types";
import crypto from "crypto";

/**
 * POST /api/session - open a session.
 *
 * Default (mode "adaptive"): creates the session, serves the first ladder item
 * of the first domain, and returns it with progress. Items are then answered
 * one at a time via POST /api/answer.
 *
 * mode "fixed": the pre-Phase-2 flow (25 bank items up front, graded via
 * /api/section + /api/submit). Kept for scripts and comparison runs.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const beliefs = sanitizeBeliefs(body?.beliefs);
    const mode = body?.mode === "fixed" ? "fixed" : "adaptive";
    const seed = crypto.randomBytes(16).toString("hex");

    if (mode === "adaptive") {
      const session = await prisma.session.create({
        data: {
          seed,
          expiresAt: new Date(Date.now() + SESSION_CEILING_MS),
          beliefs: beliefs ?? undefined,
          mode: "adaptive",
        },
      });
      const { question, state } = await startAdaptive(session);
      const response: AdaptiveSessionResponse = {
        mode: "adaptive",
        sessionId: session.id,
        specimenId: session.id,
        expiresAt: session.expiresAt.toISOString(),
        question: toServed(question),
        progress: progressOf(state),
      };
      return NextResponse.json(response);
    }

    const plan = generateTestPlan(seed);
    const session = await prisma.session.create({
      data: {
        seed,
        expiresAt: plan.expiresAt,
        beliefs: beliefs ?? undefined,
        mode: "fixed",
        questions: {
          create: plan.questions.map((q) => ({
            section: q.section,
            index: q.index,
            type: q.type,
            payload: q.payload as object,
            answerKey: q.answerKey as object,
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json({
      mode: "fixed",
      sessionId: session.id,
      specimenId: session.id,
      expiresAt: session.expiresAt.toISOString(),
      questions: session.questions
        .sort((a, b) => {
          const sectionDiff =
            SECTION_ORDER.indexOf(a.section as (typeof SECTION_ORDER)[number]) -
            SECTION_ORDER.indexOf(b.section as (typeof SECTION_ORDER)[number]);
          if (sectionDiff !== 0) return sectionDiff;
          return a.index - b.index;
        })
        // Only payload leaves the server; answerKey (hash + reference) stays.
        .map((q) => ({ id: q.id, section: q.section, index: q.index, type: q.type, payload: q.payload })),
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
