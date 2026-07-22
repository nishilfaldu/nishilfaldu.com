import {
  resolveAgentConfig,
  type SiteAgentConfig,
} from "../constants";
import { hasAgentGateCookie } from "../gate";
import { AgentLauncher } from "./agent-launcher";

export type OwnerAgentLauncherProps = {
  config: SiteAgentConfig;
};

/**
 * Renders the agent control only when the owner unlock cookie is present.
 * Public visitors get nothing — no button, no modal.
 */
export async function OwnerAgentLauncher({ config }: OwnerAgentLauncherProps) {
  const resolved = resolveAgentConfig(config);
  if (!(await hasAgentGateCookie(resolved.cookieName))) return null;
  return <AgentLauncher launchPath={resolved.launchPath} />;
}
