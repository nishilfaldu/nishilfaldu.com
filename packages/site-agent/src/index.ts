/** Client-safe surface: types, constants, response parsing. Server APIs live under `./next`. */
export {
  AGENT_LAUNCH_PATH,
  type AgentLaunchError,
  type AgentLaunchSuccess,
  MAX_PROMPT_CHARS,
  parseAgentLaunchResponse,
  type SiteAgentConfig,
} from "./constants";
