import { createAgentHandlers } from "@nishilfaldu/site-agent/next";
import { siteAgentConfig } from "@/lib/site-agent";

export const { POST, runtime } = createAgentHandlers(siteAgentConfig);
