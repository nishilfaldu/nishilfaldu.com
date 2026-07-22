# @nishilfaldu/site-agent

Private workspace package: Cursor cloud-agent **server** bits for this site
(gate, `@cursor/sdk` client, App Router handlers).

UI stays in the app — it uses this site’s design tokens. Not published.

Requires Node.js **22.13+** (`@cursor/sdk`).

## Wire-up

1. Env: `CURSOR_API_KEY`, `AGENT_ACCESS_SECRET`
2. Config + routes:

```ts
// lib/site-agent.ts
import type { SiteAgentConfig } from "@nishilfaldu/site-agent";
import { createSiteAgent } from "@nishilfaldu/site-agent/next";

export const siteAgentConfig = {
  repoUrl: "https://github.com/nishilfaldu/nishilfaldu.com",
  startingRef: "main",
} satisfies SiteAgentConfig;

export const siteAgent = createSiteAgent(siteAgentConfig);
```

```ts
// app/api/agent/route.ts
import { siteAgent } from "@/lib/site-agent";
export const { POST, runtime } = siteAgent.launch;

// app/api/agent/unlock/route.ts
import { siteAgent } from "@/lib/site-agent";
export const { GET, runtime } = siteAgent.unlock;
```

3. Unlock once: `/api/agent/unlock?code=AGENT_ACCESS_SECRET`

## Exports

| Import | Purpose |
| --- | --- |
| `@nishilfaldu/site-agent` | Client-safe types/constants + `parseAgentLaunchResponse` |
| `@nishilfaldu/site-agent/next` | `createSiteAgent`, gate helpers, Cursor client |
