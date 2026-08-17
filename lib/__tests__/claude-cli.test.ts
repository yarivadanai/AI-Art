import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import {
  buildArgv,
  childEnv,
  ClaudeCliError,
  completeViaClaudeCli,
  describeAuth,
  looksRateLimited,
  METERED_ENV_VARS,
  parseCliResult,
} from "@/lib/cohort/claude-cli";

describe("claude -p argv", () => {
  it("builds an inert one-shot argv", () => {
    const argv = buildArgv({ model: "claude-sonnet-5", system: "be terse" });
    expect(argv[0]).toBe("-p");
    expect(argv).toContain("--no-session-persistence");
    expect(argv).toContain("--disable-slash-commands");
    expect(argv).toContain("--strict-mcp-config");
    // no tools, one turn, JSON envelope, our system prompt (not appended to Claude Code's)
    expect(argv[argv.indexOf("--tools") + 1]).toBe("");
    expect(argv[argv.indexOf("--max-turns") + 1]).toBe("1");
    expect(argv[argv.indexOf("--output-format") + 1]).toBe("json");
    expect(argv[argv.indexOf("--system-prompt") + 1]).toBe("be terse");
    expect(argv).not.toContain("--append-system-prompt");
    expect(argv).not.toContain("--mcp-config");
    expect(argv).not.toContain("--effort");
    expect(argv).not.toContain("--json-schema");
  });

  it("loads no setting sources, so the operator's CLAUDE.md and memory stay out of the item", () => {
    // Verified by probe: without this the model can recite the operator's
    // user-level memory - which describes this very test - into the assessment.
    const argv = buildArgv({ model: "m", system: "s" });
    const i = argv.indexOf("--setting-sources");
    expect(i).toBeGreaterThan(-1);
    expect(argv[i + 1]).toBe("");
  });

  it("passes effort and the answer schema through only when asked", () => {
    const argv = buildArgv({ model: "claude-opus-5", system: "s", effort: "high", schema: { type: "object" } });
    expect(argv[argv.indexOf("--effort") + 1]).toBe("high");
    expect(JSON.parse(argv[argv.indexOf("--json-schema") + 1])).toEqual({ type: "object" });
  });
});

describe("claude -p environment", () => {
  it("scrubs metered credentials and provider routing, keeping the subscription session", () => {
    const saved = { ...process.env };
    try {
      process.env.ANTHROPIC_API_KEY = "sk-ant-metered";
      process.env.ANTHROPIC_AUTH_TOKEN = "tok";
      process.env.ANTHROPIC_BASE_URL = "https://example.invalid";
      process.env.CLAUDE_CODE_USE_BEDROCK = "1";
      process.env.CLAUDE_CODE_USE_VERTEX = "1";
      const env = childEnv("/tmp/account-a");
      for (const key of METERED_ENV_VARS) expect(env[key]).toBeUndefined();
      expect(env.CLAUDE_CONFIG_DIR).toBe("/tmp/account-a");
      expect(env.CLAUDE_CODE_DISABLE_1M_CONTEXT).toBe("1");
      expect(env.PATH).toBe(process.env.PATH);
    } finally {
      process.env = saved;
    }
  });

  it("names the credential it will use", () => {
    const saved = { ...process.env };
    try {
      delete process.env.CLAUDE_CODE_OAUTH_TOKEN;
      delete process.env.CLAUDE_CONFIG_DIR;
      expect(describeAuth()).toMatch(/subscription/);
      expect(describeAuth("/tmp/acct")).toContain("/tmp/acct");
      process.env.CLAUDE_CODE_OAUTH_TOKEN = "tok";
      expect(describeAuth()).toContain("CLAUDE_CODE_OAUTH_TOKEN");
    } finally {
      process.env = saved;
    }
  });
});

describe("claude -p result envelope", () => {
  it("reads a success envelope", () => {
    const reply = parseCliResult(
      JSON.stringify({
        type: "result",
        subtype: "success",
        is_error: false,
        result: '{"answer":"0x2A","confidence":"sure","abstain":false}',
        session_id: "abc",
        total_cost_usd: 0.01,
        duration_api_ms: 4113,
        modelUsage: { "claude-haiku-4-5": {}, "claude-sonnet-5": {} },
      }),
      "claude-sonnet-5"
    );
    expect(reply.text).toContain("0x2A");
    expect(reply.model).toBe("claude-sonnet-5");
    expect(reply.apiDurationMs).toBe(4113);
    expect(reply.sessionId).toBe("abc");
  });

  it("throws on an error envelope and on non-JSON output", () => {
    expect(() =>
      parseCliResult(JSON.stringify({ subtype: "error_during_execution", is_error: true, result: "boom" }), "m")
    ).toThrow(ClaudeCliError);
    expect(() => parseCliResult("Usage: claude [options]", "m")).toThrow(/non-JSON/);
  });

  it("flags limit failures apart from ordinary ones", () => {
    expect(looksRateLimited(1, "", "Claude usage limit reached. Resets at 3pm")).toBe(true);
    expect(looksRateLimited(1, '{"result":"overloaded_error"}', "")).toBe(true);
    expect(looksRateLimited(130, "", "")).toBe(true);
    expect(looksRateLimited(1, "", "ENOENT: no such file")).toBe(false);
    expect(looksRateLimited(0, "", "")).toBe(false);
  });
});

/**
 * The spawn path against fixture binaries. These stand in for the CLI dying in
 * the ways that actually happen (bad flag, expired login, hang) - notably none
 * of them read stdin, so every case also exercises the EPIPE that a large
 * prompt causes when the child is already gone.
 */
describe("claude -p spawn", () => {
  let dir: string;
  const savedBinary = process.env.CLAUDE_BINARY;
  // Larger than a pipe buffer, so stdin cannot be absorbed by the kernel.
  const bigPrompt = "x".repeat(1_000_000);

  const fixture = (name: string, body: string) => {
    const path = join(dir, name);
    writeFileSync(path, `#!/bin/sh\n${body}\n`);
    chmodSync(path, 0o755);
    return path;
  };

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "mica-cli-"));
  });
  afterAll(() => {
    if (savedBinary === undefined) delete process.env.CLAUDE_BINARY;
    else process.env.CLAUDE_BINARY = savedBinary;
    rmSync(dir, { recursive: true, force: true });
  });

  it("returns the reply when the CLI succeeds without draining stdin", async () => {
    process.env.CLAUDE_BINARY = fixture(
      "ok",
      `echo '{"subtype":"success","is_error":false,"result":"{\\"answer\\":\\"7\\"}","duration_api_ms":42,"modelUsage":{"m":{}}}'`
    );
    const reply = await completeViaClaudeCli({ model: "m", system: "s", prompt: bigPrompt });
    expect(reply.text).toContain('"answer":"7"');
    expect(reply.apiDurationMs).toBe(42);
  });

  it("rejects with the exit code and stderr instead of crashing on EPIPE", async () => {
    process.env.CLAUDE_BINARY = fixture("boom", 'echo "Invalid API key - Please run /login" >&2\nexit 1');
    await expect(completeViaClaudeCli({ model: "m", system: "s", prompt: bigPrompt })).rejects.toMatchObject({
      name: "ClaudeCliError",
      detail: { exitCode: 1, rateLimited: false },
    });
  });

  it("marks a limit failure as rate limited", async () => {
    process.env.CLAUDE_BINARY = fixture("limited", 'echo "Claude usage limit reached" >&2\nexit 1');
    await expect(completeViaClaudeCli({ model: "m", system: "s", prompt: "hi" })).rejects.toMatchObject({
      detail: { rateLimited: true },
    });
  });

  it("times out, kills the child, and settles once", async () => {
    process.env.CLAUDE_BINARY = fixture("hang", "sleep 30");
    await expect(
      completeViaClaudeCli({ model: "m", system: "s", prompt: bigPrompt, timeoutMs: 300 })
    ).rejects.toThrow(/timed out/);
  });

  it("rejects when the CLI prints something that is not the JSON envelope", async () => {
    process.env.CLAUDE_BINARY = fixture("garbage", 'echo "error: unknown option --json-schema"');
    await expect(completeViaClaudeCli({ model: "m", system: "s", prompt: "hi" })).rejects.toThrow(/non-JSON/);
  });

  it("rejects when the binary is missing", async () => {
    process.env.CLAUDE_BINARY = join(dir, "does-not-exist");
    await expect(completeViaClaudeCli({ model: "m", system: "s", prompt: "hi" })).rejects.toThrow(/could not spawn/);
  });
});
