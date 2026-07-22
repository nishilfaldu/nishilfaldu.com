import {
  AGENT_COOKIE,
  AGENT_COOKIE_MAX_AGE,
  AGENT_REPO_REF,
  AGENT_REPO_URL,
  MAX_PROMPT_CHARS,
} from "@/lib/agent/constants";

export {
  AGENT_COOKIE,
  AGENT_COOKIE_MAX_AGE,
  AGENT_REPO_REF,
  AGENT_REPO_URL,
  MAX_PROMPT_CHARS,
};

export function cursorApiKey(): string | null {
  const key = process.env.CURSOR_API_KEY?.trim();
  return key || null;
}

export function agentAccessSecret(): string | null {
  const secret = process.env.AGENT_ACCESS_SECRET?.trim();
  return secret || null;
}
