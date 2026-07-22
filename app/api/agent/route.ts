import { NextResponse } from "next/server";
import { cursorApiKey, MAX_PROMPT_CHARS } from "@/lib/agent/config";
import { createCloudAgent } from "@/lib/agent/cursor";
import { assertAgentAccess, hasAgentGateCookie } from "@/lib/agent/gate";

export const runtime = "nodejs";

type AgentBody = {
  prompt?: unknown;
  access?: unknown;
  pagePath?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Whether this browser already holds a valid unlock cookie. */
export async function GET() {
  const unlocked = await hasAgentGateCookie();
  return NextResponse.json(
    { unlocked },
    { headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * Spin a Cursor cloud agent for this repo.
 * Server secrets: CURSOR_API_KEY, AGENT_ACCESS_SECRET.
 */
export async function POST(request: Request) {
  const apiKey = cursorApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "CURSOR_API_KEY is not configured." },
      { status: 503 },
    );
  }

  let body: AgentBody;
  try {
    body = (await request.json()) as AgentBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const access = asTrimmedString(body.access);
  const gate = await assertAgentAccess(access || undefined);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const prompt = asTrimmedString(body.prompt);
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return NextResponse.json(
      { error: `Prompt must be at most ${MAX_PROMPT_CHARS} characters.` },
      { status: 400 },
    );
  }

  const pagePath = asTrimmedString(body.pagePath);
  const fullPrompt =
    pagePath.length > 0
      ? `${prompt}\n\n(Launched from site path: ${pagePath})`
      : prompt;

  try {
    const agent = await createCloudAgent({ apiKey, prompt: fullPrompt });
    return NextResponse.json(
      {
        agentId: agent.agentId,
        name: agent.name,
        url: agent.url,
        runId: agent.runId,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create agent.";
    console.error("Cloud agent create failed:", message);
    return NextResponse.json(
      { error: "Could not start the cloud agent." },
      { status: 502 },
    );
  }
}
