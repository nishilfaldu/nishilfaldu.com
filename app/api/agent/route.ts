import { NextResponse } from "next/server";
import {
  type AgentLaunchError,
  type AgentLaunchSuccess,
  MAX_PAGE_PATH_CHARS,
  MAX_PROMPT_CHARS,
} from "@/lib/agent/constants";
import { createCloudAgent, cursorApiKey } from "@/lib/agent/cursor";
import { assertAgentAccess } from "@/lib/agent/gate";

export const runtime = "nodejs";

type ParsedBody = {
  prompt: string;
  access: string;
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
    access: readString(record.access),
    pagePath: readString(record.pagePath).slice(0, MAX_PAGE_PATH_CHARS),
  };
}

function jsonError(error: string, status: number) {
  const body: AgentLaunchError = { error };
  return NextResponse.json(body, { status });
}

/**
 * Spin a Cursor cloud agent for this repo.
 * Server secrets: CURSOR_API_KEY, AGENT_ACCESS_SECRET.
 * Auth: unlock cookie or access code in the body.
 */
export async function POST(request: Request) {
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

  const gate = await assertAgentAccess(parsed.access || undefined);
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
    const agent = await createCloudAgent({ apiKey, prompt: fullPrompt });
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
