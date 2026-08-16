/**
 * End-to-end API check against a running server (dev or preview).
 *
 *   npx tsx scripts/e2e_api.ts http://localhost:3000
 *
 * Drives the real caller path: POST /api/session -> POST /api/submit ->
 * GET /api/result/:id -> GET /api/stats. Uses the server-only dataset to look
 * up reference answers, then submits them in deliberately messy formats to
 * prove canonicalization, plus an all-blank session and an idempotency check.
 * Exits non-zero on any failed assertion.
 */
import { DATASET } from "../lib/banks/dataset";
import type { DatasetQuestion } from "../lib/banks/dataset";

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
      // thousands separators + trailing-zero trimming
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

async function main() {
  console.log(`e2e against ${BASE}`);

  // 1. Session
  console.log("\n[1] POST /api/session");
  const s = await json("/api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  check(s.status === 200, `status 200 (got ${s.status})`);
  const questions: any[] = s.body?.questions ?? [];
  check(questions.length === 25, `25 questions (got ${questions.length})`);
  check(!!s.body?.sessionId && !!s.body?.expiresAt, "sessionId and expiresAt present");
  check(
    questions.every((q) => !("answerKey" in q) && !("_verifiedAnswer" in q) && !("answerHash" in q.payload) && !("_verifiedAnswer" in q.payload)),
    "no answer material in the session payload"
  );
  const order = ["structural", "state-tracking", "sequential-depth", "signal-detection", "probabilistic"];
  const sections = questions.map((q) => q.section);
  check(
    JSON.stringify(sections) === JSON.stringify(order.flatMap((sec) => Array(5).fill(sec))),
    "questions ordered by section, 5 each"
  );
  check(questions.every((q) => typeof q.payload.timeLimit === "number"), "every payload has a timeLimit");

  // 2. All-correct submission in messy formats
  console.log("\n[2] POST /api/submit (all correct, messy formatting)");
  const items = questions.map(findItem);
  check(items.every(Boolean), "every served question maps back to a dataset item");
  const responses = questions.map((q, i) => {
    const item = items[i]!;
    return { questionId: q.id, answer: messy(item._verifiedAnswer, item, i), timeMs: 1000 + i * 100 };
  });
  const sub = await json("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: s.body.sessionId, responses }),
  });
  check(sub.status === 200, `status 200 (got ${sub.status})`);
  check(sub.body?.resultId, "resultId returned");
  check(sub.body?.overall === 1, `overall == 1 (got ${sub.body?.overall})`);
  const wrong = (sub.body?.questionResults ?? []).filter((r: any) => !r.correct);
  if (wrong.length) {
    for (const r of wrong) {
      const item = items[questions.findIndex((q) => q.id === r.questionId)]!;
      console.log(`       wrong: ${item.id} sent=${JSON.stringify(r.userAnswer)} expected=${item._verifiedAnswer} norm=${item.normalization}`);
    }
  }
  check(sub.body?.verdictBand === "A", `verdict band A (got ${sub.body?.verdictBand})`);

  // 3. Idempotency: resubmitting the same session returns the same result
  console.log("\n[3] POST /api/submit again (idempotent)");
  const again = await json("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: s.body.sessionId, responses: [] }),
  });
  check(again.status === 200 && again.body?.resultId === sub.body?.resultId, "same resultId returned");

  // 4. Result endpoint
  console.log("\n[4] GET /api/result/:id");
  const r = await json(`/api/result/${sub.body.resultId}`);
  check(r.status === 200, `status 200 (got ${r.status})`);
  check(r.body?.overall === 1, "result overall == 1");
  check(Array.isArray(r.body?.questionResults) && r.body.questionResults.length === 25, "25 question results");

  // 5. Blank session
  console.log("\n[5] blank session");
  const s2 = await json("/api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  const blank = await json("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: s2.body.sessionId,
      responses: s2.body.questions.map((q: any) => ({ questionId: q.id, answer: "", timeMs: 0 })),
    }),
  });
  check(blank.status === 200 && blank.body?.overall === 0, `blank overall == 0 (got ${blank.body?.overall})`);

  // 6. Bad requests
  console.log("\n[6] error paths");
  const missing = await json("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  check(missing.status === 400, `missing fields -> 400 (got ${missing.status})`);
  const notFound = await json("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: "nope", responses: [] }),
  });
  check(notFound.status === 404, `unknown session -> 404 (got ${notFound.status})`);

  // 7. Stats
  console.log("\n[7] GET /api/stats");
  const st = await json("/api/stats");
  check(st.status === 200 && st.body?.totalSpecimens >= 2, `stats reflect >= 2 specimens (got ${st.body?.totalSpecimens})`);

  console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
