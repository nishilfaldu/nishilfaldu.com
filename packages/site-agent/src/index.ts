/** Client-safe surface: types, constants, response parsing. Server APIs live under `./next`. */
export {
  AGENT_COOKIE,
  AGENT_COOKIE_MAX_AGE,
  AGENT_LAUNCH_PATH,
  type AgentLaunchError,
  type AgentLaunchSuccess,
  MAX_PAGE_PATH_CHARS,
  MAX_PROMPT_CHARS,
  parseAgentLaunchResponse,
  resolveRepo,
  type SiteAgentConfig,
} from "./constants";
