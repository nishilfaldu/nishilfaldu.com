/** Shared agent-launcher constants (safe for client + server). */

export const MAX_PROMPT_CHARS = 8000;

/** Bound launch-context path so it cannot bloat the Cursor prompt. */
export const MAX_PAGE_PATH_CHARS = 200;

export const DEFAULT_AGENT_COOKIE = "nf_agent_gate";

/** 30 days. */
export const AGENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export const DEFAULT_LAUNCH_PATH = "/api/agent";

export type AgentLaunchSuccess = {
  agentId: string;
  name: string;
  url: string;
  runId: string | null;
};

export type AgentLaunchError = {
  error: string;
};

/** Per-app wiring for handlers and the owner UI. */
export type SiteAgentConfig = {
  /** GitHub repo the cloud agent always targets. */
  repoUrl: string;
  /** Branch or SHA to start from. */
  startingRef?: string;
  /** httpOnly unlock cookie name. */
  cookieName?: string;
  /** POST path the launcher calls (default `/api/agent`). */
  launchPath?: string;
  /** Where unlock redirects after success (default `/`). */
  unlockRedirectTo?: string;
  /** Open a PR when the agent finishes (default true). */
  autoCreatePR?: boolean;
};

export function resolveAgentConfig(config: SiteAgentConfig): {
  repoUrl: string;
  startingRef: string;
  cookieName: string;
  launchPath: string;
  unlockRedirectTo: string;
  autoCreatePR: boolean;
} {
  return {
    repoUrl: config.repoUrl,
    startingRef: config.startingRef?.trim() || "main",
    cookieName: config.cookieName?.trim() || DEFAULT_AGENT_COOKIE,
    launchPath: config.launchPath?.trim() || DEFAULT_LAUNCH_PATH,
    unlockRedirectTo: config.unlockRedirectTo?.trim() || "/",
    autoCreatePR: config.autoCreatePR ?? true,
  };
}

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
