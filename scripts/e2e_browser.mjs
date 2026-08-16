/**
 * Browser walk of /test -> /result against a running server (dev or preview).
 *
 *   npm i -D playwright  (not a project dependency; install ad hoc), then
 *   node scripts/e2e_browser.mjs http://localhost:3000
 *   (set PW_EXECUTABLE=/path/to/chrome-headless-shell to reuse a cached browser)
 *
 * Adaptive flow. Covers: session-creation error UI, intake beliefs gate,
 * persisted resume after reload (draft and deadline intact), timer expiry
 * submitting the draft as 'expired', confidence-required submit, abstain,
 * keyboard-only chip path, per-item level display, domain transition with
 * frontier strip + graded Authority feedback and no clock charge, phone-width
 * overflow, the report (frontiers, machine-scale line, 35 reveal rows with
 * level tags), and the dashboard. Runs about 90s (one real timer expiry).
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
const input = page.locator('input[name="answer"]');
async function waitForNewItem(prevId) {
  await page.waitForFunction((id) => {
    const s = JSON.parse(localStorage.getItem("mica-test-session") ?? "null")?.state;
    return s && ((s.question && s.question.id !== id && !s.pending) || s.phase !== "testing");
  }, prevId, { timeout: 20000 });
  return store(page);
}
async function answerQuick(conf = "GUESS") {
  let s = await store(page);
  const q = s.question;
  await page.getByRole("button", { name: /SUBMIT/ }).waitFor();
  if (q.payload.inputType === "multiple-choice") await page.keyboard.press("A");
  else await input.fill("1");
  await page.getByRole("radio", { name: conf, exact: true }).click();
  await page.getByRole("button", { name: /SUBMIT/ }).click();
  return waitForNewItem(q.id);
}

console.log("[A] intake: beliefs gate + error path (/api/session 500)");
await page.route("**/api/session", (r) => r.fulfill({ status: 500, contentType: "application/json", body: '{"error":"db down"}' }));
await page.goto(`${BASE}/test`);
await page.getByRole("checkbox").check();
check(await page.getByRole("button", { name: /BEGIN TEST/ }).isDisabled(), "BEGIN disabled until beliefs are answered");
check((await answerBeliefs()) === 3, "three belief items");
check(!(await page.getByRole("button", { name: /BEGIN TEST/ }).isDisabled()), "BEGIN enabled after beliefs + pledge");
await page.getByRole("button", { name: /BEGIN TEST/ }).click();
await page.getByRole("alert").waitFor({ timeout: 10000 });
check(await page.getByRole("alert").isVisible(), "error alert shown instead of blank screen");
await page.getByRole("button", { name: /RETRY/ }).waitFor({ timeout: 3000 });
check(true, "RETRY button offered");
await page.unroute("**/api/session");

console.log("[B] start a real (adaptive) session");
await page.getByRole("button", { name: /RETRY/ }).click();
await page.getByRole("button", { name: /PROCEED/ }).waitFor({ timeout: 20000 });
let s = await store(page);
check(s?.phase === "testing" && s.question?.payload?.meta?.kind === "ladder" && s.question.payload.meta.level === 3, "first item is ladder level 3");
check(s?.progress?.itemsPerSection === 7, "progress mirrored");
check(s?.beliefs && Object.keys(s.beliefs).length === 3, "beliefs stored in the client store");
await page.getByRole("button", { name: /PROCEED/ }).click();
await page.getByRole("button", { name: /SUBMIT/ }).waitFor();
s = await store(page);
check(s?.introShown === true, "introShown persisted after PROCEED");
const t0 = s.questionStartTime;
check(Math.abs(Date.now() - t0) < 3000, "question clock started at PROCEED");
check(/LEVEL 3/.test(await page.locator("main").innerText()), "level shown on the item");

const q1 = s.question;
console.log(`[C] item 1 (${q1.type}): reload mid-item keeps draft + clock`);
const isMC = q1.payload.inputType === "multiple-choice";
if (isMC) await page.keyboard.press("B");
else await input.fill("partial 12");
s = await store(page);
check(s.draft === (isMC ? "1" : "partial 12"), "draft mirrored to store");
await page.waitForTimeout(2000);
await page.reload();
await page.getByRole("button", { name: /SUBMIT/ }).waitFor({ timeout: 15000 });
s = await store(page);
check(s.question?.id === q1.id && s.phase === "testing", "still on item 1 after reload");
check(s.questionStartTime === t0, "question clock survived reload");
if (!isMC) check((await input.inputValue()) === "partial 12", "draft restored into the input");
const secs = parseInt(await page.locator("[role=timer]").innerText());
check(secs > 0 && secs <= (q1.payload.timeLimit ?? 30) - 1, `timer resumed with elapsed time deducted (${secs}s)`);

console.log("[D] item 1: submit without confidence is refused; expiry submits the draft as 'expired' and the server advances");
await page.getByRole("button", { name: /SUBMIT/ }).click();
s = await store(page);
check(s.question?.id === q1.id && !s.pending, "submit without a confidence chip does not send");
const limit = q1.payload.timeLimit ?? 30;
await page.waitForTimeout(Math.max(0, t0 + limit * 1000 - Date.now() + 1500));
s = await waitForNewItem(q1.id);
check(s.answers[q1.id]?.confidence === "expired" && s.answers[q1.id]?.answer === (isMC ? "1" : "partial 12"), "expiry captured the draft as 'expired'");
check(s.question?.id !== q1.id && s.pending === null, "server served the next item");
check(s.lastGraded?.questionId === q1.id, "grade of item 1 recorded");
check(/PREVIOUS: LEVEL 3/.test(await page.locator("main").innerText()), "status line shows previous level outcome");

console.log("[E] item 2: chip + Enter submits");
const q2 = s.question;
if (q2.payload.inputType === "multiple-choice") await page.keyboard.press("A");
else await input.fill("42");
await page.getByRole("radio", { name: "SURE", exact: true }).click();
if (q2.payload.inputType === "multiple-choice") await page.keyboard.press("Enter");
else await input.press("Enter");
s = await waitForNewItem(q2.id);
check(s.answers[q2.id]?.confidence === "sure" && s.question?.id !== q2.id, "Enter sent the answer and advanced");
check(s.answers[q2.id]?.timeMs < 10000, `timeMs is the real elapsed (${s.answers[q2.id]?.timeMs}ms)`);

console.log("[F] item 3: abstain");
const q3 = s.question;
await page.getByRole("button", { name: /I CANNOT DETERMINE THIS/ }).click();
s = await waitForNewItem(q3.id);
check(s.answers[q3.id]?.abstained === true && s.question?.id !== q3.id, "abstention sent and advanced");

console.log("[F2] item 4: keyboard-only chip: Enter selects, Enter again submits");
const q4 = s.question;
if (q4.payload.inputType === "multiple-choice") await page.keyboard.press("A");
else await input.fill("7");
await page.getByRole("radio", { name: "UNSURE", exact: true }).focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(150);
s = await store(page);
check(s.question?.id === q4.id && s.draftConfidence === "unsure", "Enter on an unselected chip selects it without submitting");
await page.keyboard.press("Enter");
s = await waitForNewItem(q4.id);
check(s.answers[q4.id]?.confidence === "unsure" && s.question?.id !== q4.id, "Enter on the selected chip submits");

console.log("[G] finish domain 1: transition shows frontier + graded feedback; clock not charged");
while (s.phase === "testing" && s.progress?.sectionIndex === 0) {
  const isFinale = s.question?.payload?.meta?.kind === "finale";
  if (isFinale) check(/MACHINE-SCALE ITEM/.test(await page.locator("main").innerText()), "finale is labelled machine-scale");
  s = await answerQuick("GUESS");
}
check(s.phase === "between-sections", `between-sections after 7 items (phase=${s.phase})`);
check(!!s.sectionResults?.structural && typeof s.sectionResults.structural.frontier === "number", "section result (with frontier) stored");
check(!!s.nextQuestionStash, "next item stashed");
const beforeRead = s.questionStartTime;
await page.locator("[role=button][title]").first().click().catch(() => {});
await page.waitForFunction(() => /frontier|level cleared|no level cleared/i.test(document.body.innerText), null, { timeout: 15000 }).catch(() => {});
const transitionText = await page.locator("main").innerText();
check(/FRONTIER \d\/8/.test(transitionText), "frontier strip shown");
check(/of 7 (items )?correct/.test(transitionText), "Authority feedback shows the graded count over 7 items");
check(/abstention/.test(transitionText), "Authority acknowledges the abstention");
await page.waitForTimeout(2500);
await page.getByRole("button", { name: /PROCEED/ }).click();
await page.getByRole("button", { name: /SUBMIT/ }).waitFor();
s = await store(page);
check(s.phase === "testing" && s.progress?.sectionIndex === 1 && s.questionStartTime > beforeRead + 2000, "clock restarted at PROCEED into domain 2");

console.log("[H] mobile: no horizontal overflow on the item screen");
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 0, `no horizontal page scroll (overflow=${overflow}px)`);

console.log("[I] finish the test and reach the report");
let guard = 0;
while (guard++ < 40 && (s.phase === "testing" || s.phase === "between-sections")) {
  if (s.phase === "between-sections") {
    await page.getByRole("button", { name: /PROCEED/ }).click();
    await page.getByRole("button", { name: /SUBMIT/ }).waitFor();
    s = await store(page);
    continue;
  }
  s = await answerQuick(["SURE", "UNSURE", "GUESS"][guard % 3]);
}
await page.waitForURL(/\/result\//, { timeout: 30000 });
await page.waitForFunction(() => /COGNITIVE PROFILE/.test(document.body.innerText), null, { timeout: 20000 });
await page.locator("[role=button][title]").first().click().catch(() => {});
await page.waitForTimeout(1200);
const report = await page.locator("main").innerText();
check(/THE MIRROR/.test(report), "report has THE MIRROR section");
check(/FRONTIERS/.test(report) && /MACHINE SCALE/.test(report), "report has FRONTIERS and MACHINE SCALE lines");
check(/AT INTAKE/.test(report), "report quotes intake beliefs back");
check((report.match(/\[(PASS|FAIL|ABST)\]/g) || []).length === 35, `report lists 35 items (${(report.match(/\[(PASS|FAIL|ABST)\]/g) || []).length})`);
check((report.match(/LEVEL \d/g) || []).length >= 30, "reveal rows carry level tags");
check(/TIME EXPIRED/.test(report), "expired item labelled");
check(/\[ABST\]/.test(report), "abstained item marked [ABST]");
check(/LEVEL \d\/8/.test(report), "domain cards show frontier level");
s = await store(page);
check(s.phase === "complete" && s.sessionId === null && !!s.lastResultId, "store reset after completion with lastResultId");
const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow2 <= 0, `report has no horizontal overflow (${overflow2}px)`);

console.log("[J] dashboard renders");
await page.goto(`${BASE}/dashboard`);
await page.waitForFunction(() => /FINDINGS ON HUMAN COGNITION/.test(document.body.innerText), null, { timeout: 20000 });
const dash = await page.locator("main").innerText();
check(/SPECIMENS EVALUATED/.test(dash), "dashboard uses 'specimens'");
check(/CALIBRATION AND ABSTENTION/.test(dash), "dashboard shows calibration card");

await browser.close();
console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
