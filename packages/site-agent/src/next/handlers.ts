import { NextResponse } from "next/server";
import {
  type AgentLaunchError,
  type AgentLaunchSuccess,
  MAX_PAGE_PATH_CHARS,
  MAX_PROMPT_CHARS,
  resolveAgentConfig,
  type SiteAgentConfig,
} from "../constants";
import { createCloudAgent, cursorApiKey } from "../cursor";
import { assertAgentAccess } from "../gate";

type ParsedBody = {
  prompt: string;
  pagePath: string;
};

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseBody(value: unknown): ParsedBody | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  return {
    prompt: readString(record.prompt),
    pagePath: readString(record.pagePath).slice(0, MAX_PAGE_PATH_CHARS),
  };
}

function jsonError(error: string, status: number) {
  const body: AgentLaunchError = { error };
  return NextResponse.json(body, { status });
}

/**
 * Build Next.js App Router handlers for launch + unlock.
 *
 * ```ts
 * // app/api/agent/route.ts
 * export const { POST, runtime } = createAgentHandlers(config);
 *
 * // app/api/agent/unlock/route.ts
 * export const { GET, runtime } = createAgentUnlockHandler(config);
 * ```
 */
export function createAgentHandlers(config: SiteAgentConfig) {
  const resolved = resolveAgentConfig(config);

  async function POST(request: Request) {
    const apiKey = cursorApiKey();
    if (!apiKey) {
      return jsonError("CURSOR_API_KEY is not configured.", 503);
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return jsonError("Invalid JSON body.", 400);
    }

    const parsed = parseBody(json);
    if (!parsed) {
      return jsonError("Invalid JSON body.", 400);
    }

    const gate = await assertAgentAccess(undefined, resolved.cookieName);
    if (!gate.ok) {
      return jsonError(gate.error, gate.status);
    }

    if (!parsed.prompt) {
      return jsonError("Prompt is required.", 400);
    }
    if (parsed.prompt.length > MAX_PROMPT_CHARS) {
      return jsonError(
        `Prompt must be at most ${MAX_PROMPT_CHARS} characters.`,
        400,
      );
    }

    const fullPrompt = parsed.pagePath
      ? `${parsed.prompt}\n\n(Launched from site path: ${parsed.pagePath})`
      : parsed.prompt;

    try {
      const agent = await createCloudAgent({
        apiKey,
        prompt: fullPrompt,
        repoUrl: resolved.repoUrl,
        startingRef: resolved.startingRef,
        autoCreatePR: resolved.autoCreatePR,
      });
      const body: AgentLaunchSuccess = agent;
      return NextResponse.json(body, {
        headers: { "Cache-Control": "no-store" },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create agent.";
      console.error("Cloud agent create failed:", message);
      return jsonError("Could not start the cloud agent.", 502);
    }
  }

  return { POST, runtime: "nodejs" as const };
}

export function createAgentUnlockHandler(config: SiteAgentConfig) {
  const resolved = resolveAgentConfig(config);

  async function GET(request: Request) {
    const code = new URL(request.url).searchParams.get("code") ?? "";
    const gate = await assertAgentAccess(code || undefined, resolved.cookieName);
    if (!gate.ok) {
      return new NextResponse(gate.error, {
        status: gate.status,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.redirect(
      new URL(resolved.unlockRedirectTo, request.url),
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  return { GET, runtime: "nodejs" as const };
}
