/** Shared agent-launcher constants (safe for client + server). */

export const MAX_PROMPT_CHARS = 8000;

export const AGENT_COOKIE = "nf_agent_gate";

/** 30 days. */
export const AGENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** This site’s repo — cloud agents always target this, nowhere else. */
export const AGENT_REPO_URL = "https://github.com/nishilfaldu/nishilfaldu.com";

export const AGENT_REPO_REF = "main";
