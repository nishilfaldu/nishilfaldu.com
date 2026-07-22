import { createAgentUnlockHandler } from "@nishilfaldu/site-agent/next";
import { siteAgentConfig } from "@/lib/site-agent";

export const { GET, runtime } = createAgentUnlockHandler(siteAgentConfig);
