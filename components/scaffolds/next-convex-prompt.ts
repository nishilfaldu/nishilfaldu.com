import {
  type NextLinter,
  nextCreateCommand,
} from "@/components/scaffolds/next-prompt";
import { buildPracticesPhase } from "@/components/scaffolds/practices-prompt";

export type NextConvexPromptOptions = {
  linter: NextLinter;
};

/** Full agent prompt for Open in Cursor / copy. */
export function buildNextConvexPrompt(opts: NextConvexPromptOptions): string {
  const command = nextCreateCommand(opts);
  const linterLabel = opts.linter === "biome" ? "Biome" : "ESLint";
  const intent = `TypeScript, ${linterLabel}, React Compiler, Tailwind, App Router, no src/, @/* imports, pnpm, keep AGENTS.md`;

  return `Scaffold a new Next.js app with Convex. If a project name isn't obvious from context, ask me for one. Prefer official CLIs over copying templates. Never hang forever on interactive prompts — if login or project creation needs me, pause and say what to do.

## A. Next.js (same base as my Next-only recipe)

1. Create the app:

${command}

If a flag has been renamed or removed, check \`create-next-app --help\` (or the live Next.js docs) and keep the same intent: ${intent}.

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
}
