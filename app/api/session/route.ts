import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateTestPlan } from "@/lib/engine/test-plan";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const includesCoding = body.includesCoding === true;

    // Generate unique seed
    const seed = crypto.randomBytes(16).toString("hex");

    // Generate test plan
    const plan = generateTestPlan(seed, includesCoding);

    // Create session with questions in DB
    const session = await prisma.session.create({
      data: {
        seed,
        includesCoding,
        expiresAt: plan.expiresAt,
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

    // Return session data (WITHOUT answer keys)
    const response = {
      sessionId: session.id,
      specimenId: session.id,
      expiresAt: session.expiresAt.toISOString(),
      questions: session.questions
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
