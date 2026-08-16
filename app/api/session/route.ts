import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateTestPlan } from "@/lib/engine/test-plan";
import { sanitizeBeliefs } from "@/lib/beliefs";
import { SECTION_ORDER } from "@/lib/types";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const beliefs = sanitizeBeliefs(body?.beliefs);

    const seed = crypto.randomBytes(16).toString("hex");
    const plan = generateTestPlan(seed);

    const session = await prisma.session.create({
      data: {
        seed,
        expiresAt: plan.expiresAt,
        beliefs: beliefs ?? undefined,
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

    const response = {
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
        .map((q) => ({
          id: q.id,
          section: q.section,
          index: q.index,
          type: q.type,
          payload: q.payload,
        })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
