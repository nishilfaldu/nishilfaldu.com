import { AGENT_REPO_REF, AGENT_REPO_URL } from "@/lib/agent/constants";

export type CreateAgentResult = {
  agentId: string;
  name: string;
  url: string;
  runId: string | null;
};

type CursorCreateResponse = {
  agent?: {
    id?: string;
    name?: string;
    url?: string;
  };
  run?: {
    id?: string;
  };
};

/**
 * Create a Cursor cloud agent against this repo and enqueue the first run.
 * https://cursor.com/docs/cloud-agent/api/endpoints
 */
export async function createCloudAgent(args: {
  apiKey: string;
  prompt: string;
}): Promise<CreateAgentResult> {
  const response = await fetch("https://api.cursor.com/v1/agents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: { text: args.prompt },
      repos: [
        {
          url: AGENT_REPO_URL,
          startingRef: AGENT_REPO_REF,
        },
      ],
      autoCreatePR: true,
    }),
  });

  const raw = await response.text();
  let data: CursorCreateResponse | null = null;
  if (raw) {
    try {
      data = JSON.parse(raw) as CursorCreateResponse;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const detail = raw.slice(0, 400) || response.statusText;
    throw new Error(`Cursor API ${response.status}: ${detail}`);
  }

  const agentId = data?.agent?.id;
  const url = data?.agent?.url;
  const name = data?.agent?.name?.trim() || "Cloud agent";
  const runId = data?.run?.id ?? null;
  if (!agentId || !url) {
    throw new Error("Cursor API returned an incomplete agent payload.");
  }

  return {
    agentId,
    name,
    url,
    runId,
  };
}
