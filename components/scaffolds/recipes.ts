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
  /** ready = deeplink works; soon = listed but not wired yet. */
  status: "ready" | "soon";
};

export const NEXT_APP_PROMPT = `Scaffold a new Next.js app in the current working directory's parent intent, or ask me for a project name if none is obvious. Do this non-interactively — never hang on CLI prompts.

1. Create the app with the current create-next-app (always @latest / the current create command so flags stay current):

pnpm create next-app <project-name> \\
  --typescript \\
  --biome \\
  --react-compiler \\
  --tailwind \\
  --app \\
  --no-src-dir \\
  --import-alias "@/*" \\
  --use-pnpm \\
  --agents-md

If create-next-app has renamed or added a flag since your training data, read its --help (or the live Next.js docs) and map to the same intent: TypeScript, Biome, React Compiler on, Tailwind on, App Router, no src/, @/* alias, pnpm, keep AGENTS.md.

2. cd into the project.

3. Confirm \`pnpm lint\` (or the generated lint script) runs. Fix only if the scaffold itself is broken.

4. Stop. Do not add a backend, auth, UI kit, or extra packages unless I ask. Summarize the folder name and the flags you used.

Notes:
- Prefer running the official CLI over copying an old template repo.
- Keep the generated AGENTS.md (it points agents at node_modules/next/dist/docs/). You may append project-specific rules outside any BEGIN/END nextjs-agent-rules markers.
- This recipe is Next.js app-only — no Convex, database, or auth in this pass.`;

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
    tagline: "Same Next base, then wire Convex. Coming next.",
    status: "soon",
  },
  {
    slug: "tanstack-start",
    name: "TanStack Start",
    tagline: "TanStack Start with the same taste in tooling. Coming next.",
    status: "soon",
  },
  {
    slug: "tanstack-convex",
    name: "TanStack Start + Convex",
    tagline: "Start plus Convex. Coming next.",
    status: "soon",
  },
];

/** Web Cursor prompt deeplink — opens chat with the text prefilled. */
export function cursorPromptHref(prompt: string): string {
  const url = new URL("https://cursor.com/link/prompt");
  url.searchParams.set("text", prompt);
  return url.toString();
}
