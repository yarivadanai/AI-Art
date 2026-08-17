import { spawn } from "child_process";
import os from "os";

/**
 * One-shot completion through the local Claude Code CLI (`claude -p`), so the
 * language-model cohort runs on the operator's Claude subscription session
 * instead of a metered API key.
 *
 * The spawn is deliberately inert, because a cohort item has to reach the model
 * as the item and nothing else:
 *   - no tools, no MCP servers, no skills, one turn;
 *   - `--setting-sources ""`, which is what actually keeps the operator's
 *     user-level CLAUDE.md, auto-memory and hooks out of the request. A neutral
 *     cwd alone does not: it only avoids the *project* CLAUDE.md. Verified by
 *     probe - without this flag the model can recite the operator's memory, and
 *     that memory describes this very test;
 *   - `--system-prompt` replaces Claude Code's agent prompt rather than
 *     appending to it;
 *   - the prompt goes in on stdin, so it never lands in `ps` or hits ARG_MAX.
 *
 * Auth comes from the CLI's own session - `CLAUDE_CONFIG_DIR` when set,
 * otherwise `~/.claude` - and every credential that would outrank it (metered
 * API keys, Bedrock/Vertex routing) is scrubbed from the child env.
 */

/** Read lazily so tests can point it at a fixture binary. */
export function claudeBinary(): string {
  return process.env.CLAUDE_BINARY ?? "claude";
}

/** Credentials and routing switches that would take priority over the subscription session. */
export const METERED_ENV_VARS = [
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_AUTH_TOKEN",
  "ANTHROPIC_BASE_URL",
  "CLAUDE_CODE_USE_BEDROCK",
  "CLAUDE_CODE_USE_VERTEX",
  "ANTHROPIC_BEDROCK_BASE_URL",
  "ANTHROPIC_VERTEX_BASE_URL",
] as const;

export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

export interface ClaudeCliRequest {
  model: string;
  system: string;
  prompt: string;
  effort?: Effort;
  /** JSON Schema the reply must satisfy (CLI-side structured output). */
  schema?: unknown;
  /** Alternative CLI config dir (a specific subscription session). */
  configDir?: string;
  timeoutMs?: number;
}

export interface ClaudeCliReply {
  text: string;
  /** What the CLI estimates the turn cost, whichever account it billed. */
  costUsd: number;
  /** Wall time the CLI spent on the API call, per its own result envelope. */
  apiDurationMs: number;
  model: string;
  sessionId: string | null;
}

export class ClaudeCliError extends Error {
  constructor(
    message: string,
    readonly detail: { exitCode: number | null; rateLimited: boolean; stdout: string; stderr: string }
  ) {
    super(message);
    this.name = "ClaudeCliError";
  }
}

/** Phrases the CLI prints when the remedy is waiting or another account, not a code fix. */
export const RATE_LIMIT_MARKERS = [
  "rate limit",
  "rate_limit",
  "usage limit",
  "limit reached",
  "reached your limit",
  "5-hour limit",
  "weekly limit",
  "spend cap",
  "max-budget",
  "overloaded_error",
  "insufficient credit",
] as const;

/**
 * True when the failure means "wait or switch accounts", not "fix the code".
 * Exit 130 is SIGINT, which the CLI also uses when it aborts itself on a usage
 * limit; treating it as a limit is deliberate, since the alternative reading
 * (an operator pressing Ctrl-C) kills the parent run anyway.
 */
export function looksRateLimited(exitCode: number | null, stdout: string, stderr: string): boolean {
  if (exitCode === 130) return true;
  const blob = (stdout.slice(-32_768) + stderr.slice(-32_768)).toLowerCase();
  return RATE_LIMIT_MARKERS.some((m) => blob.includes(m));
}

export function buildArgv(req: Pick<ClaudeCliRequest, "model" | "system" | "effort" | "schema">): string[] {
  const argv = [
    "-p",
    "--output-format",
    "json",
    "--model",
    req.model,
    "--tools",
    "",
    "--strict-mcp-config",
    "--setting-sources",
    "",
    "--no-session-persistence",
    "--disable-slash-commands",
    "--max-turns",
    "1",
    "--system-prompt",
    req.system,
  ];
  if (req.schema !== undefined) argv.push("--json-schema", JSON.stringify(req.schema));
  if (req.effort) argv.push("--effort", req.effort);
  return argv;
}

export function childEnv(configDir?: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const key of METERED_ENV_VARS) delete env[key];
  // A 1M-context request needs an org opt-in the subscription session may not have.
  env.CLAUDE_CODE_DISABLE_1M_CONTEXT = "1";
  if (configDir) env.CLAUDE_CONFIG_DIR = configDir;
  return env;
}

/** Which credential the child will actually use, for the run log. */
export function describeAuth(configDir?: string): string {
  if (process.env.CLAUDE_CODE_OAUTH_TOKEN) return "CLAUDE_CODE_OAUTH_TOKEN (subscription token)";
  const dir = configDir ?? process.env.CLAUDE_CONFIG_DIR;
  return dir ? `CLAUDE_CONFIG_DIR=${dir} (subscription session)` : "~/.claude session (subscription)";
}

interface CliResultEnvelope {
  type?: string;
  subtype?: string;
  is_error?: boolean;
  result?: unknown;
  session_id?: string;
  total_cost_usd?: number;
  duration_api_ms?: number;
  modelUsage?: Record<string, unknown>;
}

export function parseCliResult(stdout: string, requestedModel: string): ClaudeCliReply {
  let envelope: CliResultEnvelope;
  try {
    envelope = JSON.parse(stdout) as CliResultEnvelope;
  } catch {
    throw new ClaudeCliError(`claude -p emitted non-JSON output: ${stdout.slice(0, 300)}`, {
      exitCode: 0,
      rateLimited: false,
      stdout,
      stderr: "",
    });
  }
  if (envelope.is_error || envelope.subtype !== "success") {
    const detail = typeof envelope.result === "string" ? envelope.result : JSON.stringify(envelope.result ?? {});
    throw new ClaudeCliError(`claude -p returned subtype=${envelope.subtype}: ${detail.slice(0, 300)}`, {
      exitCode: 0,
      rateLimited: looksRateLimited(0, stdout, ""),
      stdout,
      stderr: "",
    });
  }
  const usage = envelope.modelUsage ?? {};
  const model = requestedModel in usage ? requestedModel : (Object.keys(usage)[0] ?? requestedModel);
  return {
    text: typeof envelope.result === "string" ? envelope.result : JSON.stringify(envelope.result ?? ""),
    costUsd: envelope.total_cost_usd ?? 0,
    apiDurationMs: envelope.duration_api_ms ?? 0,
    model,
    sessionId: envelope.session_id ?? null,
  };
}

const DEFAULT_TIMEOUT_MS = 600_000;

/** Spawn one completion. Rejects with ClaudeCliError on any non-success. */
export async function completeViaClaudeCli(req: ClaudeCliRequest): Promise<ClaudeCliReply> {
  const binary = claudeBinary();
  const argv = buildArgv(req);
  const timeoutMs = req.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  return new Promise<ClaudeCliReply>((resolve, reject) => {
    const child = spawn(binary, argv, {
      env: childEnv(req.configDir),
      cwd: os.tmpdir(),
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGKILL");
      console.error(
        JSON.stringify({ event: "claude_cli_timeout", model: req.model, timeoutMs, stderr: stderr.slice(-500) })
      );
      reject(
        new ClaudeCliError(`claude -p timed out after ${timeoutMs} ms (model=${req.model})`, {
          exitCode: null,
          rateLimited: false,
          stdout,
          stderr,
        })
      );
    }, timeoutMs);
    child.stdout.on("data", (d: Buffer) => {
      stdout += d.toString();
    });
    child.stderr.on("data", (d: Buffer) => {
      stderr += d.toString();
    });
    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      console.error(JSON.stringify({ event: "claude_cli_spawn_failed", binary, error: String(err) }));
      reject(
        new ClaudeCliError(`could not spawn ${binary}: ${String(err)}. Is the Claude Code CLI on PATH?`, {
          exitCode: null,
          rateLimited: false,
          stdout,
          stderr,
        })
      );
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code !== 0) {
        const rateLimited = looksRateLimited(code, stdout, stderr);
        console.error(
          JSON.stringify({
            event: "claude_cli_failed",
            model: req.model,
            exitCode: code,
            rateLimited,
            stderr: stderr.slice(-500),
            stdout: stdout.slice(-500),
          })
        );
        reject(
          new ClaudeCliError(
            `claude -p exited ${code}${rateLimited ? " (looks rate limited)" : ""}: ${(stderr || stdout).slice(-300)}`,
            { exitCode: code, rateLimited, stdout, stderr }
          )
        );
        return;
      }
      try {
        resolve(parseCliResult(stdout, req.model));
      } catch (err) {
        if (err instanceof ClaudeCliError) {
          console.error(
            JSON.stringify({
              event: "claude_cli_bad_result",
              model: req.model,
              rateLimited: err.detail.rateLimited,
              message: err.message,
            })
          );
        }
        reject(err);
      }
    });
    // A child that dies before draining stdin (bad flag, expired login, or the
    // SIGKILL on the timeout path) makes this write EPIPE. Without a listener
    // that is an unhandled stream error, which takes the whole cohort run down
    // instead of failing this one item.
    child.stdin.on("error", () => {
      /* the close/error/timeout handlers own the outcome */
    });
    child.stdin.end(req.prompt);
  });
}
