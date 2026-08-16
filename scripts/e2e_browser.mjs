/**
 * Browser walk of /test against a running server (dev or preview).
 *
 *   npm i -D playwright  (not a project dependency; install ad hoc), then
 *   node scripts/e2e_browser.mjs http://localhost:3000
 *   (set PW_EXECUTABLE=/path/to/chrome-headless-shell to reuse a cached browser)
 *
 * Covers: session-creation error UI, persisted resume after reload (draft and
 * deadline intact), timer expiry submitting the draft, Enter/keyboard submit,
 * section transition not charging the question clock, phone-width overflow.
 * Runs about 45s (it waits for one real timer expiry).
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
let failures = 0;
const check = (c, m) => { console.log(`  ${c ? "ok  " : "FAIL"} ${m}`); if (!c) failures++; };
const store = async (page) => JSON.parse(await page.evaluate(() => localStorage.getItem("mica-test-session") ?? "null"))?.state ?? null;

const browser = await chromium.launch(process.env.PW_EXECUTABLE ? { executablePath: process.env.PW_EXECUTABLE } : {});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); // phone width
const page = await ctx.newPage();
page.on("pageerror", (e) => { console.log("  PAGEERROR", e.message); failures++; });

console.log("[A] error path: /api/session returns 500");
await page.route("**/api/session", (r) => r.fulfill({ status: 500, contentType: "application/json", body: '{"error":"db down"}' }));
await page.goto(`${BASE}/test`);
await page.getByRole("checkbox").check();
await page.getByRole("button", { name: /BEGIN TEST/ }).click();
await page.getByRole("alert").waitFor({ timeout: 10000 });
check(await page.getByRole("alert").isVisible(), "error alert shown instead of blank screen");
await page.getByRole("button", { name: /RETRY/ }).waitFor({ timeout: 3000 }); check(true, "RETRY button offered");
await page.unroute("**/api/session");

console.log("[B] start a real session");
await page.getByRole("button", { name: /RETRY/ }).click();
await page.getByRole("button", { name: /PROCEED/ }).waitFor({ timeout: 20000 });
let s = await store(page);
check(s?.phase === "testing" && s.questions.length === 25, "session persisted with 25 questions");
check(s?.introShown === false, "intro not yet dismissed");
await page.getByRole("button", { name: /PROCEED/ }).click();
await page.getByRole("button", { name: /SUBMIT/ }).waitFor();
s = await store(page);
check(s?.introShown === true, "introShown persisted after PROCEED");
const t0 = s.questionStartTime;
check(Math.abs(Date.now() - t0) < 3000, "question clock started at PROCEED, not at session start");

const q1 = s.questions[0];
console.log(`[C] Q1 (${q1.type}, ${q1.payload.inputType}): reload mid-question keeps draft + clock`);
const input = page.locator('input[name="answer"]');
const isMC = q1.payload.inputType === "multiple-choice";
if (isMC) {
  await page.keyboard.press("B");
  s = await store(page);
  check(s.draft === "1", `keyboard letter selects option (draft=${s.draft})`);
} else {
  await input.fill("partial 12");
  s = await store(page);
  check(s.draft === "partial 12", "draft mirrored to store while typing");
  const im = await input.getAttribute("inputmode");
  check(q1.payload.inputType !== "numeric" || im === "decimal", "numeric input uses inputmode=decimal");
}
await page.waitForTimeout(2500);
await page.reload();
await page.getByRole("button", { name: /SUBMIT/ }).waitFor({ timeout: 15000 });
s = await store(page);
check(s.currentIndex === 0 && s.phase === "testing", "still on Q1 after reload (no intake reset)");
check(s.questionStartTime === t0, "question clock survived reload (deadline unchanged)");
if (!isMC) check((await input.inputValue()) === "partial 12", "draft restored into the input after reload");
const shown = await page.locator("[role=timer]").innerText();
const secs = parseInt(shown);
check(secs > 0 && secs <= (q1.payload.timeLimit ?? 30) - 2, `timer resumed with elapsed time deducted (${shown})`);

console.log("[D] Q1: let the timer expire with a draft -> draft is submitted");
const limit = q1.payload.timeLimit ?? 30;
const remainingMs = t0 + limit * 1000 - Date.now() + 1500;
await page.waitForTimeout(Math.max(0, remainingMs));
s = await store(page);
check(s.currentIndex === 1, `advanced to Q2 on expiry (index=${s.currentIndex})`);
check(s.answers[q1.id]?.answer === (isMC ? "1" : "partial 12"), `expiry submitted the draft (got ${JSON.stringify(s.answers[q1.id]?.answer)})`);
check(s.answers[q1.id]?.timeMs >= limit * 1000 - 500, `timeMs ~ full limit (${s.answers[q1.id]?.timeMs})`);

const q2 = s.questions[1];
console.log(`[E] Q2 (${q2.payload.inputType}): Enter submits`);
if (q2.payload.inputType === "multiple-choice") {
  await page.keyboard.press("A");
  await page.keyboard.press("Enter");
} else {
  await input.fill("42");
  await input.press("Enter");
}
await page.waitForTimeout(500);
s = await store(page);
check(s.currentIndex === 2, `Enter advanced to Q3 (index=${s.currentIndex})`);
check(s.answers[q2.id]?.answer === (q2.payload.inputType === "multiple-choice" ? "0" : "42"), "Q2 answer recorded");
check(s.answers[q2.id]?.timeMs < 5000, `Q2 timeMs is the real elapsed (${s.answers[q2.id]?.timeMs}ms)`);

console.log("[F] section transition: clock does not run while reading the intro");
// answer Q3..Q5 quickly
for (let i = 2; i < 5; i++) {
  const q = s.questions[i];
  if (q.payload.inputType === "multiple-choice") { await page.keyboard.press("A"); await page.keyboard.press("Enter"); }
  else { await input.fill("1"); await input.press("Enter"); }
  await page.waitForTimeout(300);
  s = await store(page);
}
check(s.phase === "between-sections" && s.currentIndex === 5, `between-sections after 5 answers (phase=${s.phase})`);
const beforeRead = s.questionStartTime;
await page.waitForTimeout(3000);
await page.getByRole("button", { name: /PROCEED/ }).click();
await page.getByRole("button", { name: /SUBMIT/ }).waitFor();
s = await store(page);
check(s.questionStartTime > beforeRead + 2500, "clock restarted at PROCEED after transition screen");

console.log("[G] mobile: page has no horizontal overflow on the question screen");
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 0, `no horizontal page scroll (overflow=${overflow}px)`);

await browser.close();
console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
