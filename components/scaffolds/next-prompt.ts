import { buildPracticesPhase } from "@/components/scaffolds/practices-prompt";

export type NextLinter = "biome" | "eslint";

export type NextPromptOptions = {
  linter: NextLinter;
};

/** Official create-next-app invocation from the current picker state. */
export function nextCreateCommand(opts: NextPromptOptions): string {
  const linterFlag = opts.linter === "biome" ? "--biome" : "--eslint";
  return `pnpm create next-app@latest <project-name> \\
  --typescript \\
  ${linterFlag} \\
  --react-compiler \\
  --tailwind \\
  --app \\
  --no-src-dir \\
  --import-alias "@/*" \\
  --use-pnpm \\
  --agents-md`;
}

/** Full agent prompt for Open in Cursor / copy. */
export function buildNextPrompt(opts: NextPromptOptions): string {
  const command = nextCreateCommand(opts);
  const linterLabel = opts.linter === "biome" ? "Biome" : "ESLint";
  const intent = `TypeScript, ${linterLabel}, React Compiler, Tailwind, App Router, no src/, @/* imports, pnpm, keep AGENTS.md`;

  return `Scaffold a new Next.js app. If a project name isn't obvious from context, ask me for one. Run the CLI non-interactively — never hang waiting for prompts.

1. Create the app with the current create-next-app (prefer \`pnpm create next-app@latest\` so flags match today's CLI):

${command}

If a flag has been renamed or removed, check \`create-next-app --help\` (or the live Next.js docs) and keep the same intent: ${intent}.

2. cd into the project.

3. Confirm the lint script runs (\`pnpm lint\` or whatever the scaffold generated). Fix only if the scaffold itself is broken.

4. Do not add a backend, database, auth, UI kit, or other packages beyond this. Keep the generated AGENTS.md — you'll add to it below, not overwrite it.

${buildPracticesPhase(5)}`;
}
