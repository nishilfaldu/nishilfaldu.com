import { hasAgentGateCookie } from "@nishilfaldu/site-agent/gate";
import { AgentLauncher } from "@/components/agent-launcher";

/**
 * Renders the agent control only when the owner unlock cookie is present.
 * Public visitors get nothing — no button, no modal.
 */
export async function OwnerAgentLauncher() {
  if (!(await hasAgentGateCookie())) return null;
  return <AgentLauncher />;
}
