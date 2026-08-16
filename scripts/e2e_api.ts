/**
 * End-to-end API check against a running server (dev or preview).
 *
 *   npx tsx scripts/e2e_api.ts http://localhost:3000
 *
 * Drives the real caller path: POST /api/session (with intake beliefs) ->
 * POST /api/section per section (mid-test grading + Authority feedback) ->
 * POST /api/submit -> GET /api/result/:id -> GET /api/stats. Uses the
 * server-only dataset to look up reference answers, then submits them in
 * deliberately messy formats to prove canonicalization, with confidence chips
 * and abstentions to prove calibration metrics; plus an all-blank session and
 * an idempotency check. Exits non-zero on any failed assertion.
 */
import { DATASET } from "../lib/banks/dataset";
import type { DatasetQuestion } from "../lib/banks/dataset";
import { BELIEF_ITEMS } from "../lib/beliefs";

const BASE = process.argv[2] ?? "http://localhost:3000";
let failures = 0;

function check(cond: unknown, msg: string) {
  if (cond) {
    console.log(`  ok   ${msg}`);
  } else {
    failures++;
    console.log(`  FAIL ${msg}`);
  }
}

async function json(path: string, init?: RequestInit) {
  const res = await fetch(BASE + path, init);
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON */
  }
  return { status: res.status, body };
}
const post = (path: string, body: unknown) =>
  json(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

/** Find the dataset item a served question came from. */
function findItem(q: { section: string; type: string; payload: any }): DatasetQuestion | undefined {
  return DATASET.find(
    (d) =>
      d.section === q.section &&
      d.subtype === q.type &&
      d.prompt === q.payload.prompt &&
      (d.clientSeed ?? null) === (q.payload.clientSeed ?? null)
  );
}

/** Rewrite a correct answer into a plausible human variant the grader must accept. */
function messy(answer: string, item: DatasetQuestion, i: number): string {
  switch (item.normalization) {
    case "exact":
      if (answer.includes(",")) return answer.split(",").join(", ");
      if (answer.includes("-")) return answer.split("-").join(" - ");
      if (/[A-Z]/.test(answer)) return i % 2 ? answer.toLowerCase() : ` ${answer} `;
      return ` ${answer}`;
    case "hex-lowercase":
      if (answer.includes(",")) return answer.toUpperCase().split(",").join(", ");
      return i % 3 === 0 ? `0x${answer.toUpperCase()}` : i % 3 === 1 ? answer.toLowerCase() : answer.match(/.{1,2}/g)!.join(" ");
    case "numeric-rounded": {
      const n = Number(answer);
      const dp = item.decimalPlaces ?? 0;
      const [intPart, frac = ""] = Math.abs(n).toFixed(dp).split(".");
      const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const sign = n < 0 ? "−" : "+";
      return `${sign}${grouped}${frac ? "." + frac.replace(/0+$/, "") : ""}`;
    }
    case "trimmed-lowercase":
      return `  ${answer.toUpperCase()}  `;
    default:
      return answer;
  }
}

const ORDER = ["structural", "state-tracking", "sequential-depth", "signal-detection", "probabilistic"];

async function main() {
  console.log(`e2e against ${BASE}`);

  // 1. Session with beliefs
  console.log("\n[1] POST /api/session (with intake beliefs)");
  const beliefs = Object.fromEntries(BELIEF_ITEMS.map((b, i) => [b.id, [5, 1, 4][i]]));
  const s = await post("/api/session", { beliefs: { ...beliefs, bogus: 3 } });
  check(s.status === 200, `status 200 (got ${s.status})`);
  const questions: any[] = s.body?.questions ?? [];
  check(questions.length === 25, `25 questions (got ${questions.length})`);
  check(!!s.body?.sessionId && !!s.body?.expiresAt, "sessionId and expiresAt present");
  check(
    questions.every(
      (q) =>
        !("answerKey" in q) &&
        !("_verifiedAnswer" in q) &&
        !("answerHash" in q.payload) &&
        !("reference" in q.payload) &&
        !("_verifiedAnswer" in q.payload)
    ),
    "no answer material in the session payload"
  );
  const sections = questions.map((q) => q.section);
  check(JSON.stringify(sections) === JSON.stringify(ORDER.flatMap((sec) => Array(5).fill(sec))), "questions ordered by section, 5 each");
  check(questions.every((q) => typeof q.payload.timeLimit === "number"), "every payload has a timeLimit");

  // 2. Per-section grading with a mix of correct/messy/wrong/abstain/confidence
  console.log("\n[2] POST /api/section per section (mid-test grading)");
  const items = questions.map(findItem);
  check(items.every(Boolean), "every served question maps back to a dataset item");
  // Plan: q0 correct SURE, q1 wrong SURE, q2 abstain, q3 correct GUESS, q4 correct UNSURE (per section)
  const plan = (i: number) => {
    const k = i % 5;
    const item = items[i]!;
    const correct = messy(item._verifiedAnswer, item, i);
    if (k === 0) return { answer: correct, confidence: "sure", abstained: false, expectCorrect: true };
    if (k === 1) return { answer: "definitely-wrong-" + i, confidence: "sure", abstained: false, expectCorrect: false };
    if (k === 2) return { answer: "", confidence: null, abstained: true, expectCorrect: false };
    if (k === 3) return { answer: correct, confidence: "guess", abstained: false, expectCorrect: true };
    return { answer: correct, confidence: "unsure", abstained: false, expectCorrect: true };
  };
  const responses = questions.map((q, i) => {
    const p = plan(i);
    return { questionId: q.id, answer: p.answer, timeMs: 1000 + i * 100, confidence: p.confidence, abstained: p.abstained };
  });

  let firstSummary: any = null;
  for (const section of ORDER) {
    const idxs = questions.map((q, i) => (q.section === section ? i : -1)).filter((i) => i >= 0);
    const sec = await post("/api/section", { sessionId: s.body.sessionId, responses: idxs.map((i) => responses[i]) });
    const summary = sec.body?.sections?.find((x: any) => x.section === section);
    if (!firstSummary) firstSummary = summary;
    check(sec.status === 200 && summary, `${section}: 200 + summary`);
    if (summary) {
      check(summary.correct === 3 && summary.total === 5, `${section}: 3/5 correct (got ${summary.correct}/${summary.total})`);
      check(summary.abstained === 1 && summary.sure === 2 && summary.sureWrong === 1, `${section}: abstained=1 sure=2 sureWrong=1`);
      // meanTimeMs excludes the abstained item (index k=2)
      const expectedMean = Math.round(idxs.filter((i) => i % 5 !== 2).reduce((a, i) => a + 1000 + i * 100, 0) / 4);
      check(summary.meanTimeMs === expectedMean, `${section}: meanTimeMs excludes abstention (${summary.meanTimeMs} vs ${expectedMean})`);
    }
  }
  // Re-grading a section is idempotent (upsert)
  const again = await post("/api/section", { sessionId: s.body.sessionId, responses: responses.slice(0, 5) });
  check(again.status === 200 && again.body.sections?.[0]?.correct === 3, "re-grading a section is idempotent");

  // 3. Final submit
  console.log("\n[3] POST /api/submit");
  const sub = await post("/api/submit", { sessionId: s.body.sessionId, responses });
  check(sub.status === 200, `status 200 (got ${sub.status})`);
  check(sub.body?.resultId, "resultId returned");
  check(Math.abs(sub.body?.overall - 0.6) < 1e-9, `overall == 0.6 (got ${sub.body?.overall})`);
  check(sub.body?.metrics?.sure === 10 && sub.body?.metrics?.sureWrong === 5, "metrics: 10 sure, 5 sureWrong");
  check(sub.body?.metrics?.abstained === 5 && sub.body?.metrics?.answered === 20, "metrics: 5 abstained, 20 answered");
  check(sub.body?.metrics?.hallucinationRate === 0.5, "metrics: hallucinationRate 0.5");

  // Section grading after result exists -> 409
  const late = await post("/api/section", { sessionId: s.body.sessionId, responses: responses.slice(0, 5) });
  check(late.status === 409, `section grading after result -> 409 (got ${late.status})`);

  // 4. Idempotency
  console.log("\n[4] POST /api/submit again (idempotent)");
  const again2 = await post("/api/submit", { sessionId: s.body.sessionId, responses: [] });
  check(again2.status === 200 && again2.body?.resultId === sub.body?.resultId, "same resultId returned");

  // 5. Result reveal
  console.log("\n[5] GET /api/result/:id (reveal)");
  const r = await json(`/api/result/${sub.body.resultId}`);
  check(r.status === 200, `status 200 (got ${r.status})`);
  check(Math.abs(r.body?.overall - 0.6) < 1e-9, "result overall == 0.6");
  const qr: any[] = r.body?.questionResults ?? [];
  check(qr.length === 25, "25 question results");
  check(qr.every((x, i) => x.referenceAnswer === items[questions.findIndex((q) => q.id === x.questionId)]!._verifiedAnswer), "referenceAnswer revealed for every item");
  check(qr.every((x) => typeof x.timeMs === "number" && x.timeMs > 0), "timeMs present for every item");
  const byId = new Map(qr.map((x) => [x.questionId, x]));
  check(questions.every((q, i) => byId.get(q.id)?.correct === plan(i).expectCorrect), "correctness per plan");
  check(questions.every((q, i) => byId.get(q.id)?.abstained === plan(i).abstained), "abstained flags per plan");
  check(questions.every((q, i) => (byId.get(q.id)?.confidence ?? null) === plan(i).confidence), "confidence per plan");
  check(JSON.stringify(r.body?.beliefs) === JSON.stringify(beliefs), "beliefs stored (unknown ids dropped) and returned");
  check(r.body?.metrics?.perSection?.structural?.correct === 3, "metrics.perSection on result");
  check(r.body?.specimenId === s.body.sessionId, "specimenId returned");

  // 6. Blank session (no section calls) still grades all 25
  console.log("\n[6] blank session");
  const s2 = await post("/api/session", {});
  const blank = await post("/api/submit", {
    sessionId: s2.body.sessionId,
    responses: s2.body.questions.map((q: any) => ({ questionId: q.id, answer: "", timeMs: 0 })),
  });
  check(blank.status === 200 && blank.body?.overall === 0, `blank overall == 0 (got ${blank.body?.overall})`);
  const r2 = await json(`/api/result/${blank.body.resultId}`);
  check(r2.body?.beliefs === null && r2.body?.questionResults?.length === 25, "blank: no beliefs, 25 items");

  // 7. Bad requests
  console.log("\n[7] error paths");
  const missing = await post("/api/submit", {});
  check(missing.status === 400, `missing fields -> 400 (got ${missing.status})`);
  const notFound = await post("/api/submit", { sessionId: "nope", responses: [] });
  check(notFound.status === 404, `unknown session -> 404 (got ${notFound.status})`);
  const secBad = await post("/api/section", { sessionId: "nope", responses: [] });
  check(secBad.status === 404, `section unknown session -> 404 (got ${secBad.status})`);
  const secBad2 = await post("/api/section", { sessionId: s.body.sessionId });
  check(secBad2.status === 400, `section missing responses -> 400 (got ${secBad2.status})`);

  // 8. Stats
  console.log("\n[8] GET /api/stats");
  const st = await json("/api/stats");
  check(st.status === 200 && st.body?.totalSpecimens >= 2, `stats reflect >= 2 specimens (got ${st.body?.totalSpecimens})`);
  check(typeof st.body?.perfectScores === "number", "perfectScores computed");
  check(st.body?.calibration?.specimensWithMetrics >= 2 && st.body?.calibration?.sure >= 10, "calibration aggregates present");

  console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
