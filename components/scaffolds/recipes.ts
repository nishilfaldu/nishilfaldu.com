import { EXPO_APP_PROMPT } from "@/components/scaffolds/expo-prompt";
import { nextCreateCommand } from "@/components/scaffolds/next-prompt";
import { buildPracticesPhase } from "@/components/scaffolds/practices-prompt";

/**
 * Scaffold recipes — prompts you open in Cursor (or copy elsewhere).
 * Editing this file is the whole workflow for adding a new recipe.
 */

export type Scaffold = {
  slug: string;
  name: string;
  /** One sentence under the name. */
  tagline: string;
  /**
   * Full agent prompt. Now includes the standing-practices phase, so these
   * run well past the old ~6k "safe URL" budget — the Cursor deeplink can
   * still exceed typical URL limits in some browsers. "Copy prompt" in
   * ScaffoldActions is the reliable fallback; don't shrink prompt content
   * to chase the deeplink budget.
   */
  prompt?: string;
  /** ready = deeplink works; soon = listed but not wired yet; builder = interactive picker. */
  status: "ready" | "soon" | "builder";
};

const NEXT_CONVEX_CREATE_COMMAND = nextCreateCommand({ linter: "biome" });

const NEXT_CONVEX_CREATE_INTENT =
  "TypeScript, Biome, React Compiler, Tailwind, App Router, no src/, @/* imports, pnpm, keep AGENTS.md";

export const NEXT_CONVEX_PROMPT = `Scaffold a new Next.js app with Convex. If a project name isn't obvious from context, ask me for one. Prefer official CLIs over copying templates. Never hang forever on interactive prompts — if login or project creation needs me, pause and say what to do.

## A. Next.js (same base as my Next-only recipe)

1. Create the app:

${NEXT_CONVEX_CREATE_COMMAND}

If a flag has been renamed or removed, check \`create-next-app --help\` (or the live Next.js docs) and keep the same intent: ${NEXT_CONVEX_CREATE_INTENT}.

2. cd into the project. Confirm the lint script runs; fix only if the scaffold itself is broken.

## B. Convex

3. Install the package with the project's package manager: \`pnpm add convex\`.

4. Initialize against a Convex deployment with the current CLI (prefer \`pnpm exec convex\` so the command matches today):

\`pnpm exec convex dev --once\`

On first run this may ask me to log in and pick/create a project. Pause for that, then re-run with \`--once\` so it writes config, the \`convex/\` folder, env vars, and generated types without leaving a watcher running.

5. Wire the React client the way the current Convex Next.js docs say (provider + \`NEXT_PUBLIC_CONVEX_URL\`). Put the provider in \`components/\` if the app already uses that layout; otherwise follow the docs. Do not add sample todo/tasks UI unless I ask.

## C. Cursor (so the agent knows Convex)

6. After scaffolding, tell me to install the official Convex plugin in Cursor if I don't already have it — once is enough for all projects:
   - In Agent chat: \`/add-plugin convex\`
   - Or: Customize → search “Convex” → Add

Don't try to install the plugin from the terminal; that's a Cursor UI step.

## D. Wrap up Phase 1

7. Do not add auth, UI kits, or extra packages beyond this. Remind me about the Convex plugin if I still need it, and that day-to-day I should run \`pnpm exec convex dev\` alongside the Next dev server.

${buildPracticesPhase(8)}`;

export const SCAFFOLDS: Scaffold[] = [
  {
    slug: "next-app",
    name: "Next.js app",
    tagline:
      "TypeScript, Biome or ESLint, React Compiler, Tailwind, App Router, pnpm — no src/.",
    status: "builder",
  },
  {
    slug: "next-convex",
    name: "Next.js + Convex",
    tagline:
      "Same Next base, then Convex — plus install the Convex Cursor plugin once.",
    prompt: NEXT_CONVEX_PROMPT,
    status: "ready",
  },
  {
    slug: "tanstack-start",
    name: "TanStack Start",
    tagline:
      "Pick add-ons (Query, Convex, auth, deploy…), get a prompt — Intent on by default.",
    status: "builder",
  },
  {
    slug: "electron",
    name: "Electron",
    tagline:
      "Electron Forge TypeScript + React + Biome — Vite (default) or Webpack, pnpm. Official CLI, not a stale boilerplate.",
    status: "builder",
  },
  {
    slug: "expo",
    name: "Expo",
    tagline:
      "default@sdk-57 — Expo Router, native tabs, keep AGENTS.md, project Expo Skills for Cursor.",
    prompt: EXPO_APP_PROMPT,
    status: "ready",
  },
];

/** Web Cursor prompt deeplink — opens chat with the text prefilled. */
export function cursorPromptHref(prompt: string): string {
  const url = new URL("https://cursor.com/link/prompt");
  url.searchParams.set("text", prompt);
  return url.toString();
}
