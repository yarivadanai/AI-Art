/**
 * Seat a machine cohort on the instrument and store the sessions for the
 * dashboard's three-cohort chart. Runs against the database directly (no web
 * server needed) and drives the same adaptive engine visitors go through.
 *
 *   npx tsx scripts/run_cohort.ts --cohort reference [--n 3]
 *   npx tsx scripts/run_cohort.ts --cohort llm --model claude-opus-5 [--n 3] [--effort medium]
 *   npx tsx scripts/run_cohort.ts --cohort llm --model claude-sonnet-5 --dry-run
 *
 * reference: answers every item from the server-side reference and reports
 *   the measured wall time of the solver (the item generator, which computes
 *   the answer as it builds the item; at least 1 ms). Confidence "sure".
 * llm: puts each item to a language model through the local Claude Code CLI
 *   (`claude -p`, no tools, no MCP, one turn) and records its JSON answer,
 *   confidence and abstention plus the call's wall time. Auth is the operator's
 *   Claude subscription session (`~/.claude`, or `--config-dir` / the
 *   CLAUDE_CONFIG_DIR env var for a specific account); metered credentials such
 *   as ANTHROPIC_API_KEY are scrubbed from the child so they cannot bill the
 *   API account by accident. --dry-run prints the prompts and stores nothing.
 *
 * Sessions are created with cohort = "reference" | "llm" and label = solver
 * name / model id, so /api/stats can separate them from human specimens.
 * Needs DATABASE_URL. Exits non-zero on failure.
 */
import crypto from "crypto";
import { prisma } from "../lib/db";
import { answerAdaptive, referenceOf, startAdaptive } from "../lib/engine/adaptive";
import { SESSION_CEILING_MS } from "../lib/engine/limits";
import { generateItem } from "../lib/generators";
import { buildItemPrompt, LLM_ANSWER_SCHEMA, LLM_SYSTEM_PROMPT, parseLlmAnswer } from "../lib/cohort/llm";
import { ClaudeCliError, completeViaClaudeCli, describeAuth, type Effort } from "../lib/cohort/claude-cli";
import type { AnswerSubmission, Confidence, QuestionPayload, Section } from "../lib/types";
import type { Question } from "@prisma/client";

interface Args {
  cohort: "reference" | "llm";
  model: string;
  n: number;
  effort?: Effort;
  configDir?: string;
  timeoutMs: number;
  dryRun: boolean;
}

const EFFORTS: Effort[] = ["low", "medium", "high", "xhigh", "max"];

function parseArgs(argv: string[]): Args {
  const get = (flag: string) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const usage =
    "usage: run_cohort.ts --cohort reference|llm [--model <id>] [--n <sessions>] [--effort low|medium|high|xhigh|max] [--config-dir <dir>] [--timeout-ms N] [--dry-run]";
  const cohort = get("--cohort");
  if (cohort !== "reference" && cohort !== "llm") {
    console.error(usage);
    process.exit(2);
  }
  const effort = get("--effort");
  if (effort !== undefined && !EFFORTS.includes(effort as Effort)) {
    console.error(`--effort must be one of ${EFFORTS.join(", ")}\n${usage}`);
    process.exit(2);
  }
  return {
    cohort,
    model: get("--model") ?? "claude-opus-5",
    n: Math.max(1, Number(get("--n") ?? 1)),
    effort: effort as Effort | undefined,
    configDir: get("--config-dir"),
    timeoutMs: Math.max(10_000, Number(get("--timeout-ms") ?? 600_000)),
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

/** Consecutive transport failures that mean the run is broken, not the model. */
const CONSECUTIVE_FAILURE_LIMIT = 3;

/** A language model through the local Claude Code CLI, no tools. */
function llmAnswerer(args: Args): Answerer {
  let consecutiveFailures = 0;
  return {
    label: args.model,
    async answer(q) {
      const prompt = buildItemPrompt({ section: q.section as Section, payload: q.payload as unknown as QuestionPayload });
      if (args.dryRun) {
        console.log(`\n--- ${q.section} #${q.index} (${q.type}) ---\n${prompt}\n`);
        return { answer: "", timeMs: 0, confidence: null, abstained: true, note: "dry-run" };
      }
      const t0 = Date.now();
      let reply;
      try {
        reply = await completeViaClaudeCli({
          model: args.model,
          system: LLM_SYSTEM_PROMPT,
          prompt,
          schema: LLM_ANSWER_SCHEMA,
          effort: args.effort,
          configDir: args.configDir,
          timeoutMs: args.timeoutMs,
        });
      } catch (err) {
        // One failed call is a real datum about the run, not a reason to
        // abandon it: record the item as an abstention and keep going. But a
        // systematic failure - a limit, an expired login, an unknown model id,
        // a flag this CLI version rejects - fails every remaining item the same
        // way, and a session of empty answers would land on the dashboard as if
        // the model had genuinely declined 35 items. So a limit aborts at once,
        // and CONSECUTIVE_FAILURE_LIMIT failures in a row abort too.
        const rateLimited = err instanceof ClaudeCliError && err.detail.rateLimited;
        consecutiveFailures += 1;
        console.error(
          JSON.stringify({
            event: "cohort_item_failed",
            model: args.model,
            questionId: q.id,
            section: q.section,
            type: q.type,
            rateLimited,
            consecutiveFailures,
            message: err instanceof Error ? err.message : String(err),
          })
        );
        if (rateLimited) throw err;
        if (consecutiveFailures >= CONSECUTIVE_FAILURE_LIMIT) {
          throw new Error(
            `${consecutiveFailures} consecutive failed calls (last: ${err instanceof Error ? err.message : String(err)}). ` +
              "Aborting rather than storing a session of transport failures as abstentions."
          );
        }
        return {
          // Not the model's thinking time: metrics sum timeMs over every item,
          // so charging a 10-minute timeout to the specimen would be a lie.
          answer: "",
          timeMs: 0,
          confidence: null,
          abstained: true,
          note: `call failed: ${(err instanceof Error ? err.message : String(err)).slice(0, 120)}`,
        };
      }
      consecutiveFailures = 0;
      // The CLI reports the API call's own duration; prefer it over the spawn's
      // wall time so the dashboard's per-item column compares thinking to
      // thinking and not to ~2 s of process startup.
      const timeMs = Math.max(1, reply.apiDurationMs || Date.now() - t0);
      const parsed = parseLlmAnswer(reply.text);
      return {
        answer: parsed.answer,
        timeMs,
        confidence: parsed.abstained ? null : parsed.confidence,
        abstained: parsed.abstained,
        note: parsed.parsed ? undefined : `unparseable reply: ${reply.text.slice(0, 80)}`,
      };
    },
  };
}

/**
 * One throwaway call before any session is created, so a bad model id, an
 * expired login or a CLI that rejects one of our flags fails here - loudly and
 * with nothing stored - instead of 35 items later as a wall of abstentions.
 */
async function preflight(args: Args) {
  try {
    const reply = await completeViaClaudeCli({
      model: args.model,
      system: "Reply with a single JSON object and nothing else.",
      prompt: 'Reply with exactly {"answer":"ok","confidence":"sure","abstain":false}.',
      schema: LLM_ANSWER_SCHEMA,
      effort: args.effort,
      configDir: args.configDir,
      timeoutMs: Math.min(args.timeoutMs, 120_000),
    });
    const parsed = parseLlmAnswer(reply.text);
    if (!parsed.parsed) throw new Error(`preflight reply did not parse: ${reply.text.slice(0, 120)}`);
    console.log(`preflight ok (${reply.model}, ${reply.apiDurationMs} ms)\n`);
  } catch (err) {
    console.error(
      JSON.stringify({ event: "cohort_preflight_failed", model: args.model, message: err instanceof Error ? err.message : String(err) })
    );
    throw new Error(`preflight call failed, nothing was stored: ${err instanceof Error ? err.message : String(err)}`);
  }
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
  if (args.cohort === "llm" && !args.dryRun) {
    console.log(
      `transport: claude -p (no tools, no MCP, one turn)  model ${args.model}${args.effort ? `  effort ${args.effort}` : ""}\nauth: ${describeAuth(args.configDir)}`
    );
    await preflight(args);
  }
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
