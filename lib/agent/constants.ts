/** Shared agent-launcher constants (safe for client + server). */

export const MAX_PROMPT_CHARS = 8000;

/** Bound launch-context path so it cannot bloat the Cursor prompt. */
export const MAX_PAGE_PATH_CHARS = 200;

export const AGENT_COOKIE = "nf_agent_gate";

/** 30 days. */
export const AGENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** This site’s repo — cloud agents always target this, nowhere else. */
export const AGENT_REPO_URL = "https://github.com/nishilfaldu/nishilfaldu.com";

export const AGENT_REPO_REF = "main";

export type AgentLaunchSuccess = {
  agentId: string;
  name: string;
  url: string;
  runId: string | null;
};

export type AgentLaunchError = {
  error: string;
};

/** Narrow unknown JSON from POST /api/agent into a typed result. */
export function parseAgentLaunchResponse(
  value: unknown,
): AgentLaunchSuccess | AgentLaunchError | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;

  if (typeof record.error === "string" && record.error.trim()) {
    return { error: record.error.trim() };
  }

  const agentId = record.agentId;
  const name = record.name;
  const url = record.url;
  if (
    typeof agentId !== "string" ||
    !agentId ||
    typeof url !== "string" ||
    !url ||
    typeof name !== "string"
  ) {
    return null;
  }

  return {
    agentId,
    name: name.trim() || "Cloud agent",
    url,
    runId: typeof record.runId === "string" ? record.runId : null,
  };
}
