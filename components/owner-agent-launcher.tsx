import { AgentLauncher } from "@/components/agent-launcher";
import { hasAgentGateCookie } from "@/lib/agent/gate";

/**
 * Renders the agent control only when the owner unlock cookie is present.
 * Public visitors get nothing — no button, no modal.
 */
export async function OwnerAgentLauncher() {
  if (!(await hasAgentGateCookie())) return null;
  return <AgentLauncher />;
}
