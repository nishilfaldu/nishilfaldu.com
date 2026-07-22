import { Agent } from "@cursor/sdk";
import type { AgentLaunchSuccess } from "./constants";

const AGENT_WEB_BASE = "https://cursor.com/agents";

export function cursorApiKey(): string | null {
  const key = process.env.CURSOR_API_KEY?.trim();
  return key || null;
}

/**
 * Create a Cursor cloud agent against a repo and enqueue the first run.
 * https://cursor.com/docs/sdk/typescript
 */
export async function createCloudAgent(args: {
  apiKey: string;
  prompt: string;
  repoUrl: string;
  startingRef: string;
}): Promise<AgentLaunchSuccess> {
  const agent = await Agent.create({
    apiKey: args.apiKey,
    cloud: {
      repos: [
        {
          url: args.repoUrl,
          startingRef: args.startingRef,
        },
      ],
      autoCreatePR: true,
    },
  });

  try {
    const run = await agent.send(args.prompt);
    const agentId = agent.agentId;
    if (!agentId) {
      throw new Error("Cursor SDK returned an incomplete agent id.");
    }

    let name = "Cloud agent";
    try {
      const info = await Agent.get(agentId, { apiKey: args.apiKey });
      if (info.name.trim()) name = info.name.trim();
    } catch {
      // Title is best-effort; the agent URL is what matters for the UI.
    }

    return {
      agentId,
      name,
      url: `${AGENT_WEB_BASE}/${agentId}`,
      runId: run.id || null,
    };
  } finally {
    agent.close();
  }
}
