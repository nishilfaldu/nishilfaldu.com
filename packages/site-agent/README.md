# @nishilfaldu/site-agent

Local workspace package: owner-only Cursor cloud agent launcher for Next.js apps.

Not published. Other apps in this monorepo (or sibling checkouts) can depend on it via `workspace:*`.

## Wire an app

1. Env: `CURSOR_API_KEY`, `AGENT_ACCESS_SECRET`
2. Config + routes:

```ts
// lib/site-agent.ts
import type { SiteAgentConfig } from "@nishilfaldu/site-agent";

export const siteAgentConfig: SiteAgentConfig = {
  repoUrl: "https://github.com/you/your-app",
  startingRef: "main",
};
```

```ts
// app/api/agent/route.ts
import { createAgentHandlers } from "@nishilfaldu/site-agent/next";
import { siteAgentConfig } from "@/lib/site-agent";

export const { POST, runtime } = createAgentHandlers(siteAgentConfig);
```

```ts
// app/api/agent/unlock/route.ts
import { createAgentUnlockHandler } from "@nishilfaldu/site-agent/next";
import { siteAgentConfig } from "@/lib/site-agent";

export const { GET, runtime } = createAgentUnlockHandler(siteAgentConfig);
```

```tsx
// app/layout.tsx
import { OwnerAgentLauncher } from "@nishilfaldu/site-agent/react/owner";
import { siteAgentConfig } from "@/lib/site-agent";

<OwnerAgentLauncher config={siteAgentConfig} />
```

3. Unlock once: `/api/agent/unlock?code=AGENT_ACCESS_SECRET`

## Exports

| Import | Purpose |
| --- | --- |
| `@nishilfaldu/site-agent` | Config helpers, Cursor client, gate utils |
| `@nishilfaldu/site-agent/next` | `createAgentHandlers`, `createAgentUnlockHandler` |
| `@nishilfaldu/site-agent/react` | Client `AgentLauncher` |
| `@nishilfaldu/site-agent/react/owner` | Server `OwnerAgentLauncher` (cookie gate) |
