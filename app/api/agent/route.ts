import { NextResponse } from "next/server";
import {
  type AgentLaunchError,
  type AgentLaunchSuccess,
  MAX_PROMPT_CHARS,
} from "@/lib/agent/constants";
import { createCloudAgent } from "@/lib/agent/cursor";
import { assertAgentAccess, cursorApiKey } from "@/lib/agent/gate";

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
    pagePath: readString(record.pagePath),
  };
}

/**
 * Spin a Cursor cloud agent for this repo.
 * Server secrets: CURSOR_API_KEY, AGENT_ACCESS_SECRET.
 * Auth: unlock cookie or access code in the body.
 */
export async function POST(request: Request) {
  const apiKey = cursorApiKey();
  if (!apiKey) {
    const body: AgentLaunchError = {
      error: "CURSOR_API_KEY is not configured.",
    };
    return NextResponse.json(body, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    const body: AgentLaunchError = { error: "Invalid JSON body." };
    return NextResponse.json(body, { status: 400 });
  }

  const parsed = parseBody(json);
  if (!parsed) {
    const body: AgentLaunchError = { error: "Invalid JSON body." };
    return NextResponse.json(body, { status: 400 });
  }

  const gate = await assertAgentAccess(parsed.access || undefined);
  if (!gate.ok) {
    const body: AgentLaunchError = { error: gate.error };
    return NextResponse.json(body, { status: gate.status });
  }

  if (!parsed.prompt) {
    const body: AgentLaunchError = { error: "Prompt is required." };
    return NextResponse.json(body, { status: 400 });
  }
  if (parsed.prompt.length > MAX_PROMPT_CHARS) {
    const body: AgentLaunchError = {
      error: `Prompt must be at most ${MAX_PROMPT_CHARS} characters.`,
    };
    return NextResponse.json(body, { status: 400 });
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
    const body: AgentLaunchError = {
      error: "Could not start the cloud agent.",
    };
    return NextResponse.json(body, { status: 502 });
  }
}
