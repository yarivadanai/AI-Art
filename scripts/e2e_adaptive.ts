/**
 * End-to-end check of the adaptive (staircase) session against a running server.
 *
 *   npx tsx scripts/e2e_adaptive.ts http://localhost:3000
 *
 * Simulates visitors with a controlled ability: correct on ladder items up to
 * a per-domain level, wrong above it, a chosen finale behaviour; reads the
 * reference answers straight from the database (test-only; the API never
 * exposes them) and asserts the frontiers, summaries, result and stats.
 * Needs DATABASE_URL (same as the server). Exits non-zero on any failure.
 */
import { PrismaClient } from "@prisma/client";
import { SECTION_ORDER } from "../lib/types";

const BASE = process.argv[2] ?? "http://localhost:3000";
const prisma = new PrismaClient();
let failures = 0;
const check = (c: unknown, m: string) => {
  console.log(`  ${c ? "ok  " : "FAIL"} ${m}`);
  if (!c) failures++;
};
const post = async (path: string, body: unknown) => {
  const res = await fetch(BASE + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    /* ignore */
  }
  return { status: res.status, body: json };
};
const get = async (path: string) => {
  const res = await fetch(BASE + path);
  return { status: res.status, body: await res.json().catch(() => null) };
};

async function referenceOf(questionId: string): Promise<string> {
  const q = await prisma.question.findUniqueOrThrow({ where: { id: questionId } });
  const key = q.answerKey as any;
  if (typeof key.reference !== "string") throw new Error(`no reference for ${questionId}`);
  return key.reference;
}

interface Ability {
  /** highest ladder level answered correctly per section */
  ceiling: Record<string, number>;
  finale: "correct" | "wrong" | "abstain";
}

async function runVisitor(name: string, ability: Ability, beliefs?: Record<string, number>) {
  console.log(`\n[${name}]`);
  const s = await post("/api/session", { beliefs });
  check(s.status === 200 && s.body?.mode === "adaptive", "session created (adaptive)");
  const sessionId = s.body.sessionId as string;
  let q = s.body.question;
  let progress = s.body.progress;
  check(q?.payload?.meta?.kind === "ladder" && q.payload.meta.level === 3, `first item is ladder level 3 (got ${JSON.stringify(q?.payload?.meta)})`);
  check(!("answerKey" in (q ?? {})) && !("reference" in (q?.payload ?? {})), "no answer material on served item");
  check(progress?.itemsPerSection === 7 && progress?.ladderLength === 6, "progress shape");

  const served: any[] = [];
  const summaries: any[] = [];
  let done: any = null;
  let guard = 0;
  let levelsSeen: Record<string, number[]> = {};
  while (q && guard++ < 60) {
    served.push(q);
    const meta = q.payload.meta;
    const section = q.section as string;
    levelsSeen[section] = levelsSeen[section] ?? [];
    let answer = "";
    let abstained = false;
    let confidence: string | null = "sure";
    if (meta.kind === "ladder") {
      levelsSeen[section].push(meta.level);
      const ok = meta.level <= ability.ceiling[section];
      answer = ok ? await referenceOf(q.id) : "wrong-answer-9999";
      confidence = ok ? "sure" : "guess";
    } else {
      if (ability.finale === "abstain") {
        abstained = true;
        confidence = null;
      } else if (ability.finale === "correct") answer = await referenceOf(q.id);
      else answer = "nope";
    }
    const a = await post("/api/answer", { sessionId, questionId: q.id, answer, timeMs: 3000 + guard * 100, confidence, abstained });
    if (a.status !== 200) {
      check(false, `answer ${guard} status ${a.status}: ${JSON.stringify(a.body)}`);
      break;
    }
    if (a.body.sectionComplete) summaries.push({ section, ...a.body.sectionComplete });
    if (a.body.done) {
      done = a.body.done;
      break;
    }
    q = a.body.question;
    progress = a.body.progress;
  }

  check(served.length === 35, `served 35 items (got ${served.length})`);
  check(summaries.length === 5, `5 section summaries (got ${summaries.length})`);
  check(!!done?.resultId, "finished with a resultId");

  // Ladder families rotate within a section (no two consecutive rungs share a family)
  for (const section of SECTION_ORDER) {
    const fams = served.filter((x) => x.section === section && x.payload.meta.kind === "ladder").map((x) => x.type);
    const consecutiveSame = fams.some((f, i) => i > 0 && f === fams[i - 1]);
    check(!consecutiveSame && new Set(fams).size === 3, `${section}: families rotate (${fams.join(",")})`);
    const finale = served.find((x) => x.section === section && x.payload.meta.kind === "finale");
    check(!!finale && !finale.type.startsWith("gen_"), `${section}: finale is a bank T3 item (${finale?.type})`);
  }

  // Frontier per section: with the ability model, staircase from 3 reaches min(ceiling, 8) if ceiling>=3
  for (const sm of summaries) {
    const c = ability.ceiling[sm.section];
    // Expected frontier: start 3; correct while level<=c; 6 rungs. If c>=3, frontier=min(c, 3+... ) bounded by rungs.
    // Simulate quickly:
    let level = 3;
    let frontier = 0;
    for (let r = 0; r < 6; r++) {
      const ok = level <= c;
      if (ok) {
        frontier = Math.max(frontier, level);
        level = Math.min(8, level + 1);
      } else level = Math.max(1, level - 1);
    }
    check(sm.frontier === frontier, `${sm.section}: frontier ${sm.frontier} (expected ${frontier} for ceiling ${c}; levels ${levelsSeen[sm.section].join(">")})`);
    check(sm.finale === (ability.finale === "abstain" ? "abstained" : ability.finale), `${sm.section}: finale outcome ${sm.finale}`);
    check(sm.summary.total === 7, `${sm.section}: summary over 7 items`);
  }

  // Idempotency / replay: re-answering the last item returns done
  const last = served[served.length - 1];
  const replay = await post("/api/answer", { sessionId, questionId: last.id, answer: "x", timeMs: 1 });
  check(replay.status === 409 && replay.body?.resultId === done.resultId, `re-answer after completion -> 409 with resultId (got ${replay.status})`);

  // Result
  const r = await get(`/api/result/${done.resultId}`);
  check(r.status === 200, "result fetch 200");
  check(r.body?.metrics?.mode === "adaptive", "metrics.mode adaptive");
  check(r.body?.questionResults?.length === 35, `35 question results (got ${r.body?.questionResults?.length})`);
  check(r.body?.questionResults?.every((x: any) => typeof x.referenceAnswer === "string" && x.referenceAnswer.length > 0), "reference revealed for every item");
  const expectedOverall = SECTION_ORDER.reduce((s, sec) => s + (summaries.find((x) => x.section === sec)?.frontier ?? 0) / 8, 0) / 5;
  check(Math.abs(r.body?.overall - expectedOverall) < 1e-9, `overall = mean(frontier/8) = ${expectedOverall.toFixed(3)} (got ${r.body?.overall})`);
  for (const sec of SECTION_ORDER) {
    check(r.body?.metrics?.frontiers?.[sec] === summaries.find((x) => x.section === sec)?.frontier, `${sec}: metrics.frontiers matches`);
  }
  // GET /api/session/:id after done
  const g = await get(`/api/session/${sessionId}`);
  check(g.status === 200 && g.body?.done?.resultId === done.resultId, "GET session reports done");
  return { sessionId, resultId: done.resultId, overall: r.body?.overall };
}

async function main() {
  console.log(`adaptive e2e against ${BASE}`);
  const strong = await runVisitor(
    "strong visitor: ceiling 8 everywhere, finale correct",
    { ceiling: Object.fromEntries(SECTION_ORDER.map((s) => [s, 8])), finale: "correct" },
    { llm_understands: 2, trust_machine_calc: 5, confident_error_worse: 5 }
  );
  const mixed = await runVisitor("mixed visitor: ceilings 5/2/0/4/7, abstains on finales", {
    ceiling: { structural: 5, "state-tracking": 2, "sequential-depth": 0, "signal-detection": 4, probabilistic: 7 },
    finale: "abstain",
  });
  const weak = await runVisitor("weak visitor: nothing cleared, finale wrong", {
    ceiling: Object.fromEntries(SECTION_ORDER.map((s) => [s, 0])),
    finale: "wrong",
  });
  check(strong.overall > mixed.overall && mixed.overall > weak.overall, `overall orders visitors (${strong.overall?.toFixed(2)} > ${mixed.overall?.toFixed(2)} > ${weak.overall?.toFixed(2)})`);

  console.log("\n[recovery]");
  const s = await post("/api/session", {});
  const g = await get(`/api/session/${s.body.sessionId}`);
  check(g.status === 200 && g.body?.question?.id === s.body.question.id, "GET session returns the current item");
  // replay: answering the current item twice returns the same next item
  const ref = await referenceOf(s.body.question.id);
  const a1 = await post("/api/answer", { sessionId: s.body.sessionId, questionId: s.body.question.id, answer: ref, timeMs: 5, confidence: "sure" });
  const a2 = await post("/api/answer", { sessionId: s.body.sessionId, questionId: s.body.question.id, answer: "different", timeMs: 5, confidence: "sure" });
  check(a1.body?.graded?.correct === true && a2.body?.replay === true && a2.body?.question?.id === a1.body?.question?.id, "re-sending a graded item replays the current item (first write wins)");
  // early finalize via /api/submit
  const fin = await post("/api/submit", { sessionId: s.body.sessionId, responses: [] });
  check(fin.status === 200 && fin.body?.resultId && fin.body?.metrics?.mode === "adaptive", "early /api/submit finalizes an adaptive session");
  const sec = await post("/api/section", { sessionId: s.body.sessionId, responses: [] });
  check(sec.status === 409, `/api/section refuses adaptive sessions (got ${sec.status})`);

  console.log("\n[stats]");
  const st = await get("/api/stats");
  check(st.status === 200 && st.body?.totalSpecimens >= 4, `stats include the new sessions (${st.body?.totalSpecimens})`);

  console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
  await prisma.$disconnect();
  process.exit(failures ? 1 : 0);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
