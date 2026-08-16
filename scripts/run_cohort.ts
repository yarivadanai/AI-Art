/**
 * Seat a machine cohort on the instrument and store the sessions for the
 * dashboard's three-cohort chart. Runs against the database directly (no web
 * server needed) and drives the same adaptive engine visitors go through.
 *
 *   npx tsx scripts/run_cohort.ts --cohort reference [--n 3]
 *   npx tsx scripts/run_cohort.ts --cohort llm --model claude-opus-5 [--n 3] [--effort medium] [--max-tokens 4096]
 *   npx tsx scripts/run_cohort.ts --cohort llm --model claude-sonnet-5 --dry-run
 *
 * reference: answers every item from the server-side reference and reports
 *   the measured wall time of the solver (the item generator, which computes
 *   the answer as it builds the item; at least 1 ms). Confidence "sure".
 * llm: sends each item to the Claude API (no tools) and records its JSON
 *   answer, confidence and abstention plus the request's wall time. Needs
 *   ANTHROPIC_API_KEY (or an `ant auth login` profile). Refusals are recorded
 *   as abstentions. --dry-run prints the prompts and stores nothing.
 *
 * Sessions are created with cohort = "reference" | "llm" and label = solver
 * name / model id, so /api/stats can separate them from human specimens.
 * Needs DATABASE_URL. Exits non-zero on failure.
 */
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";
import { prisma } from "../lib/db";
import { answerAdaptive, referenceOf, startAdaptive } from "../lib/engine/adaptive";
import { SESSION_CEILING_MS } from "../lib/engine/limits";
import { generateItem } from "../lib/generators";
import { buildItemPrompt, LLM_ANSWER_SCHEMA, LLM_SYSTEM_PROMPT, parseLlmAnswer } from "../lib/cohort/llm";
import type { AnswerSubmission, Confidence, QuestionPayload, Section } from "../lib/types";
import type { Question } from "@prisma/client";

interface Args {
  cohort: "reference" | "llm";
  model: string;
  n: number;
  effort?: string;
  maxTokens: number;
  dryRun: boolean;
}

function parseArgs(argv: string[]): Args {
  const get = (flag: string) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const cohort = get("--cohort");
  if (cohort !== "reference" && cohort !== "llm") {
    console.error("usage: run_cohort.ts --cohort reference|llm [--model <id>] [--n <sessions>] [--effort low|medium|high|xhigh|max] [--max-tokens N] [--dry-run]");
    process.exit(2);
  }
  return {
    cohort,
    model: get("--model") ?? "claude-opus-5",
    n: Math.max(1, Number(get("--n") ?? 1)),
    effort: get("--effort"),
    maxTokens: Math.max(256, Number(get("--max-tokens") ?? 4096)),
    dryRun: argv.includes("--dry-run"),
  };
}

interface Answerer {
  label: string;
  answer(q: Question, seed: string): Promise<{ answer: string; timeMs: number; confidence: Confidence | null; abstained: boolean; note?: string }>;
}

/** The script: reads the reference and reports how long the solver takes. */
function referenceAnswerer(): Answerer {
  return {
    label: "reference-solver",
    async answer(q, seed) {
      const answer = referenceOf(q);
      if (answer == null) throw new Error(`no reference on question ${q.id} (${q.type})`);
      const meta = (q.payload as unknown as QuestionPayload).meta;
      let timeMs = 1;
      if (meta?.kind === "ladder" && meta.level != null) {
        // Re-run the generator (which computes the answer as it builds the item) and time it.
        const t0 = process.hrtime.bigint();
        generateItem(q.type, `${seed}|${q.section}|${q.index}`, meta.level);
        timeMs = Math.max(1, Math.round(Number(process.hrtime.bigint() - t0) / 1e6));
      }
      return { answer, timeMs, confidence: "sure", abstained: false };
    },
  };
}

/** A language model through the Messages API, no tools. */
function llmAnswerer(args: Args): Answerer {
  // Lazy: a dry run must not need credentials. The SDK resolves ANTHROPIC_API_KEY or an `ant auth login` profile.
  let client: Anthropic | null = null;
  return {
    label: args.model,
    async answer(q) {
      const prompt = buildItemPrompt({ section: q.section as Section, payload: q.payload as unknown as QuestionPayload });
      if (args.dryRun) {
        console.log(`\n--- ${q.section} #${q.index} (${q.type}) ---\n${prompt}\n`);
        return { answer: "", timeMs: 0, confidence: null, abstained: true, note: "dry-run" };
      }
      client ??= new Anthropic();
      const t0 = Date.now();
      const res = await client.messages.create({
        model: args.model,
        max_tokens: args.maxTokens,
        system: LLM_SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
        output_config: {
          format: { type: "json_schema", schema: LLM_ANSWER_SCHEMA as unknown as Record<string, unknown> },
          ...(args.effort ? { effort: args.effort as "low" | "medium" | "high" | "xhigh" | "max" } : {}),
        },
      });
      const timeMs = Date.now() - t0;
      if (res.stop_reason === "refusal") {
        return { answer: "", timeMs, confidence: null, abstained: true, note: `refusal (${res.stop_details?.category ?? "no category"})` };
      }
      const text = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      const parsed = parseLlmAnswer(text);
      return {
        answer: parsed.answer,
        timeMs,
        confidence: parsed.abstained ? null : parsed.confidence,
        abstained: parsed.abstained,
        note: parsed.parsed ? undefined : `unparseable reply: ${text.slice(0, 80)}`,
      };
    },
  };
}

async function runSession(args: Args, who: Answerer, k: number) {
  const seed = crypto.randomBytes(16).toString("hex");
  const session = await prisma.session.create({
    data: {
      seed,
      expiresAt: new Date(Date.now() + SESSION_CEILING_MS),
      mode: "adaptive",
      cohort: args.cohort,
      label: who.label,
    },
  });
  console.log(`\n[${args.cohort}:${who.label}] session ${k + 1}/${args.n} = ${session.id}`);
  let { question, state } = await startAdaptive(session);
  const served: Question[] = [];
  let guard = 0;
  let resultId: string | null = null;
  while (question && guard++ < 60) {
    served.push(question);
    const a = await who.answer(question, seed);
    const meta = (question.payload as unknown as QuestionPayload).meta;
    const submission: AnswerSubmission = {
      questionId: question.id,
      answer: a.answer,
      timeMs: a.timeMs,
      confidence: a.confidence,
      abstained: a.abstained,
    };
    const out = await answerAdaptive(session, state, served, submission);
    if ("replay" in out) throw new Error("unexpected replay");
    const g = out.graded;
    console.log(
      `  ${question.section.padEnd(16)} ${meta?.kind === "ladder" ? `L${meta.level}` : "finale"} ${question.type.padEnd(28)} ${
        a.abstained ? "abstain" : g.correct ? "correct" : "wrong  "
      } ${String(a.timeMs).padStart(6)}ms${a.confidence ? ` ${a.confidence}` : ""}${a.note ? `  [${a.note}]` : ""}`
    );
    state = out.state;
    if (out.done) {
      resultId = out.done.resultId;
      break;
    }
    question = out.question!;
  }
  if (!resultId) throw new Error("session did not finish");
  const result = await prisma.result.findUniqueOrThrow({ where: { id: resultId } });
  const m = result.metrics as unknown as { frontiers?: Record<string, number>; hallucinationRate: number | null; abstained: number; meanTimeMs: number };
  console.log(
    `  => overall ${(result.overall * 100).toFixed(0)}%  frontiers ${JSON.stringify(m.frontiers)}  hallucination ${
      m.hallucinationRate == null ? "n/a" : (m.hallucinationRate * 100).toFixed(0) + "%"
    }  abstained ${m.abstained}  mean ${m.meanTimeMs}ms  result ${resultId}`
  );
  return resultId;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const who = args.cohort === "reference" ? referenceAnswerer() : llmAnswerer(args);
  if (args.dryRun && args.cohort === "llm") {
    // Print the prompts for one session's worth of items without storing anything.
    const seed = crypto.randomBytes(16).toString("hex");
    const tmp = await prisma.session.create({
      data: { seed, expiresAt: new Date(Date.now() + SESSION_CEILING_MS), mode: "adaptive", cohort: "llm", label: `${args.model} (dry-run)` },
    });
    try {
      const { question } = await startAdaptive(tmp);
      await who.answer(question, seed);
      console.log("(dry-run: first item only; nothing stored)");
    } finally {
      await prisma.question.deleteMany({ where: { sessionId: tmp.id } });
      await prisma.session.delete({ where: { id: tmp.id } });
    }
    return;
  }
  const ids: string[] = [];
  for (let k = 0; k < args.n; k++) ids.push(await runSession(args, who, k));
  console.log(`\ndone: ${ids.length} ${args.cohort} session(s) stored (label "${who.label}")`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
