import type { SiteAgentConfig } from "@nishilfaldu/site-agent";
import { createSiteAgent } from "@nishilfaldu/site-agent/next";

export const siteAgentConfig = {
  repoUrl: "https://github.com/nishilfaldu/nishilfaldu.com",
  startingRef: "main",
} satisfies SiteAgentConfig;

export const siteAgent = createSiteAgent(siteAgentConfig);
