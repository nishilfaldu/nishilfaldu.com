/**
 * Scaffold recipes — prompts you open in Cursor (or copy elsewhere).
 * Editing this file is the whole workflow for adding a new recipe.
 */

export type Scaffold = {
  slug: string;
  name: string;
  /** One sentence under the name. */
  tagline: string;
  /** Full agent prompt. Keep under ~6k chars so the Cursor deeplink stays < 8k URL. */
  prompt?: string;
  /** ready = deeplink works; soon = listed but not wired yet; builder = interactive picker. */
  status: "ready" | "soon" | "builder";
};

/** Shared create-next-app invocation — keep Next recipes in lockstep. */
export const NEXT_CREATE_COMMAND = `pnpm create next-app@latest <project-name> \\
  --typescript \\
  --biome \\
  --react-compiler \\
  --tailwind \\
  --app \\
  --no-src-dir \\
  --import-alias "@/*" \\
  --use-pnpm \\
  --agents-md`;

const NEXT_CREATE_INTENT =
  "TypeScript, Biome, React Compiler, Tailwind, App Router, no src/, @/* imports, pnpm, keep AGENTS.md";

export const NEXT_APP_PROMPT = `Scaffold a new Next.js app. If a project name isn't obvious from context, ask me for one. Run the CLI non-interactively — never hang waiting for prompts.

1. Create the app with the current create-next-app (prefer \`pnpm create next-app@latest\` so flags match today's CLI):

${NEXT_CREATE_COMMAND}

If a flag has been renamed or removed, check \`create-next-app --help\` (or the live Next.js docs) and keep the same intent: ${NEXT_CREATE_INTENT}.

2. cd into the project.

3. Confirm the lint script runs (\`pnpm lint\` or whatever the scaffold generated). Fix only if the scaffold itself is broken.

4. Stop. Do not add a backend, database, auth, UI kit, or other packages unless I ask. Tell me the folder name and the flags you used.

Notes:
- Prefer the official CLI over copying an old template.
- Keep the generated AGENTS.md. You may add project rules below it; don't overwrite the generated section.`;

export const NEXT_CONVEX_PROMPT = `Scaffold a new Next.js app with Convex. If a project name isn't obvious from context, ask me for one. Prefer official CLIs over copying templates. Never hang forever on interactive prompts — if login or project creation needs me, pause and say what to do.

## A. Next.js (same base as my Next-only recipe)

1. Create the app:

${NEXT_CREATE_COMMAND}

If a flag has been renamed or removed, check \`create-next-app --help\` (or the live Next.js docs) and keep the same intent: ${NEXT_CREATE_INTENT}.

2. cd into the project. Confirm the lint script runs; fix only if the scaffold itself is broken.

## B. Convex

3. Install the package with the project's package manager: \`pnpm add convex\`.

4. Initialize against a Convex deployment with the current CLI (prefer \`pnpm exec convex\` / \`npx convex@latest\` so the command matches today):

\`pnpm exec convex dev --once\`

On first run this may ask me to log in and pick/create a project. Pause for that, then re-run with \`--once\` so it writes config, the \`convex/\` folder, env vars, and generated types without leaving a watcher running.

5. Wire the React client the way the current Convex Next.js docs say (provider + \`NEXT_PUBLIC_CONVEX_URL\`). Put the provider in \`components/\` if the app already uses that layout; otherwise follow the docs. Do not add sample todo/tasks UI unless I ask.

## C. Cursor (so the agent knows Convex)

6. After scaffolding, tell me to install the official Convex plugin in Cursor if I don't already have it — once is enough for all projects:
   - In Agent chat: \`/add-plugin convex\`
   - Or: Customize → search “Convex” → Add

Don't try to install the plugin from the terminal; that's a Cursor UI step.

## D. Stop

7. Do not add auth, UI kits, or extra packages unless I ask. Summarize: folder name, Next flags, Convex wired. Remind me about the Convex plugin if I still need it, and that day-to-day I should run \`pnpm exec convex dev\` alongside the Next dev server.`;

export const SCAFFOLDS: Scaffold[] = [
  {
    slug: "next-app",
    name: "Next.js app",
    tagline:
      "TypeScript, Biome, React Compiler, Tailwind, App Router, pnpm — no src/.",
    prompt: NEXT_APP_PROMPT,
    status: "ready",
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
      "Electron Forge TypeScript — Vite (default) or Webpack. Official CLI, not a stale boilerplate.",
    status: "builder",
  },
];

/** Web Cursor prompt deeplink — opens chat with the text prefilled. */
export function cursorPromptHref(prompt: string): string {
  const url = new URL("https://cursor.com/link/prompt");
  url.searchParams.set("text", prompt);
  return url.toString();
}
