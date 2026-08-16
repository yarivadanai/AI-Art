/**
 * Browser walk of /test -> /result against a running server (dev or preview).
 *
 *   npm i -D playwright  (not a project dependency; install ad hoc), then
 *   node scripts/e2e_browser.mjs http://localhost:3000
 *   (set PW_EXECUTABLE=/path/to/chrome-headless-shell to reuse a cached browser)
 *
 * Covers: session-creation error UI, intake beliefs gate, persisted resume
 * after reload (draft and deadline intact), timer expiry submitting the draft,
 * confidence-required submit, abstain button, Enter/keyboard submit, section
 * transition with graded feedback and no clock charge, phone-width overflow,
 * and the report (mirror, reveal rows, reference answers).
 * Runs about 60s (it waits for one real timer expiry).
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

async function answerBeliefs() {
  const groups = page.locator('[role=radiogroup][aria-label]').filter({ has: page.locator('button[aria-label="Agree"]') });
  const n = await groups.count();
  for (let i = 0; i < n; i++) await groups.nth(i).locator('button[aria-label="Agree"]').click();
  return n;
}

console.log("[A] intake: beliefs gate + error path (/api/session 500)");
await page.route("**/api/session", (r) => r.fulfill({ status: 500, contentType: "application/json", body: '{"error":"db down"}' }));
await page.goto(`${BASE}/test`);
await page.getByRole("checkbox").check();
check(await page.getByRole("button", { name: /BEGIN TEST/ }).isDisabled(), "BEGIN disabled until beliefs are answered");
const nBeliefs = await answerBeliefs();
check(nBeliefs === 3, `three belief items (${nBeliefs})`);
check(!(await page.getByRole("button", { name: /BEGIN TEST/ }).isDisabled()), "BEGIN enabled after beliefs + pledge");
await page.getByRole("button", { name: /BEGIN TEST/ }).click();
await page.getByRole("alert").waitFor({ timeout: 10000 });
check(await page.getByRole("alert").isVisible(), "error alert shown instead of blank screen");
await page.getByRole("button", { name: /RETRY/ }).waitFor({ timeout: 3000 });
check(true, "RETRY button offered");
await page.unroute("**/api/session");

console.log("[B] start a real session");
await page.getByRole("button", { name: /RETRY/ }).click();
await page.getByRole("button", { name: /PROCEED/ }).waitFor({ timeout: 20000 });
let s = await store(page);
check(s?.phase === "testing" && s.questions.length === 25, "session persisted with 25 questions");
check(s?.beliefs && Object.keys(s.beliefs).length === 3, "beliefs stored in the client store");
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

console.log("[D] Q1: submit without confidence is refused; timer expiry submits the draft as 'expired'");
await page.getByRole("button", { name: /SUBMIT/ }).click();
s = await store(page);
check(s.currentIndex === 0, "submit without a confidence chip does not advance");
check(await page.getByRole("status").isVisible().catch(() => false), "nudge asks for confidence");
const limit = q1.payload.timeLimit ?? 30;
const remainingMs = t0 + limit * 1000 - Date.now() + 1500;
await page.waitForTimeout(Math.max(0, remainingMs));
s = await store(page);
check(s.currentIndex === 1, `advanced to Q2 on expiry (index=${s.currentIndex})`);
check(s.answers[q1.id]?.answer === (isMC ? "1" : "partial 12"), `expiry submitted the draft (got ${JSON.stringify(s.answers[q1.id]?.answer)})`);
check(s.answers[q1.id]?.confidence === "expired", "expiry recorded confidence 'expired'");
check(s.answers[q1.id]?.timeMs >= limit * 1000 - 500, `timeMs ~ full limit (${s.answers[q1.id]?.timeMs})`);

const q2 = s.questions[1];
console.log(`[E] Q2 (${q2.payload.inputType}): confidence chip + Enter submits`);
if (q2.payload.inputType === "multiple-choice") {
  await page.keyboard.press("A");
} else {
  await input.fill("42");
}
await page.getByRole("radio", { name: "SURE", exact: true }).click();
if (q2.payload.inputType === "multiple-choice") await page.keyboard.press("Enter");
else await input.press("Enter");
await page.waitForTimeout(500);
s = await store(page);
check(s.currentIndex === 2, `Enter advanced to Q3 (index=${s.currentIndex})`);
check(s.answers[q2.id]?.answer === (q2.payload.inputType === "multiple-choice" ? "0" : "42"), "Q2 answer recorded");
check(s.answers[q2.id]?.confidence === "sure", "Q2 confidence recorded");
check(s.answers[q2.id]?.timeMs < 8000, `Q2 timeMs is the real elapsed (${s.answers[q2.id]?.timeMs}ms)`);

console.log("[F] Q3: abstain button");
const q3 = s.questions[2];
await page.getByRole("button", { name: /I CANNOT DETERMINE THIS/ }).click();
await page.waitForTimeout(300);
s = await store(page);
check(s.currentIndex === 3 && s.answers[q3.id]?.abstained === true && s.answers[q3.id]?.answer === "", "abstention recorded and advanced");

console.log("[F2] Q4: keyboard-only: focus a chip, Enter selects it, Enter again submits");
const q4 = s.questions[3];
if (q4.payload.inputType === "multiple-choice") await page.keyboard.press("A");
else await input.fill("7");
const chip = page.getByRole("radio", { name: "UNSURE", exact: true });
await chip.focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(150);
s = await store(page);
check(s.currentIndex === 3 && s.draftConfidence === "unsure", "Enter on an unselected chip selects it without submitting");
await page.keyboard.press("Enter");
await page.waitForTimeout(300);
s = await store(page);
check(s.currentIndex === 4 && s.answers[q4.id]?.confidence === "unsure", "Enter on the selected chip submits");

async function answerQuick(i, conf = "GUESS") {
  const q = s.questions[i];
  if (q.payload.inputType === "multiple-choice") await page.keyboard.press("A");
  else await input.fill("1");
  await page.getByRole("radio", { name: conf, exact: true }).click();
  await page.getByRole("button", { name: /SUBMIT/ }).click();
  await page.waitForTimeout(250);
  s = await store(page);
}

console.log("[G] finish section 1; transition shows graded feedback and does not charge the clock");
for (let i = 4; i < 5; i++) await answerQuick(i);
check(s.phase === "between-sections" && s.currentIndex === 5, `between-sections after 5 answers (phase=${s.phase})`);
const beforeRead = s.questionStartTime;
// wait for grading + feedback text
await page.waitForFunction(() => /of 5 correct/.test(document.body.innerText), null, { timeout: 15000 }).catch(() => {});
// let the typewriter finish (or click it to skip)
await page.locator("[role=button][title]").first().click().catch(() => {});
await page.waitForFunction(() => /abstention/.test(document.body.innerText), null, { timeout: 15000 }).catch(() => {});
const transitionText = await page.locator("main").innerText();
check(/of 5 correct/.test(transitionText), "Authority feedback shows the graded count");
check(/abstention/.test(transitionText), "Authority acknowledges the abstention");
s = await store(page);
check(!!s.sectionSummaries?.structural, "section summary persisted in store");
await page.waitForTimeout(2500);
await page.getByRole("button", { name: /PROCEED/ }).click();
await page.getByRole("button", { name: /SUBMIT/ }).waitFor();
s = await store(page);
check(s.questionStartTime > beforeRead + 2000, "clock restarted at PROCEED after transition screen");

console.log("[H] mobile: no horizontal overflow on the question screen");
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 0, `no horizontal page scroll (overflow=${overflow}px)`);

console.log("[I] finish the test quickly and reach the report");
while (s.phase === "testing" || s.phase === "between-sections") {
  if (s.phase === "between-sections") {
    await page.getByRole("button", { name: /PROCEED/ }).click();
    await page.getByRole("button", { name: /SUBMIT/ }).waitFor();
    s = await store(page);
    continue;
  }
  await answerQuick(s.currentIndex, ["SURE", "UNSURE", "GUESS"][s.currentIndex % 3]);
}
await page.waitForURL(/\/result\//, { timeout: 30000 });
await page.waitForFunction(() => /COGNITIVE PROFILE/.test(document.body.innerText), null, { timeout: 20000 });
await page.waitForTimeout(1500);
const report = await page.locator("main").innerText();
check(/THE MIRROR/.test(report), "report has THE MIRROR section");
check(/AT INTAKE/.test(report), "report quotes intake beliefs back");
check(/CALIBRATION/.test(report) && /ABSTENTION/.test(report), "report has calibration + abstention lines");
check(/REFERENCE/.test(report) && /METHOD/.test(report), "report reveals reference answers and methods");
check((report.match(/\[(PASS|FAIL|ABST)\]/g) || []).length === 25, `report lists 25 items (${(report.match(/\[(PASS|FAIL|ABST)\]/g) || []).length})`);
check(/\[ABST\]/.test(report), "abstained item marked [ABST]");
check(/TIME EXPIRED/.test(report), "expired item labelled");
s = await store(page);
check(s.phase === "complete" && s.sessionId === null && !!s.lastResultId, "store reset after completion with lastResultId");
const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow2 <= 0, `report has no horizontal overflow (${overflow2}px)`);

console.log("[J] dashboard renders with calibration");
await page.goto(`${BASE}/dashboard`);
await page.waitForFunction(() => /FINDINGS ON HUMAN COGNITION/.test(document.body.innerText), null, { timeout: 20000 });
const dash = await page.locator("main").innerText();
check(/SPECIMENS EVALUATED/.test(dash), "dashboard uses 'specimens'");
check(/CALIBRATION AND ABSTENTION/.test(dash), "dashboard shows calibration card");
check(!/No participant/.test(dash), "no hardcoded participant claim");

await browser.close();
console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
