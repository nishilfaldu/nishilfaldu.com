import { addonsForCli } from "@/components/scaffolds/tanstack-addons";

export type TanstackPromptOptions = {
  /** Selected TanStack CLI add-on ids. */
  selectedAddons: readonly string[];
  /** TanStack Intent skill mappings — default on. */
  intent: boolean;
};

/** CLI create invocation from the current builder state. */
export function tanstackCreateCommand(opts: TanstackPromptOptions): string {
  const addons = addonsForCli(opts.selectedAddons);
  const lines = [
    "npx @tanstack/cli@latest create <project-name> \\",
    "  --framework React \\",
    "  --package-manager pnpm \\",
    "  --toolchain biome \\",
    "  --no-examples \\",
    opts.intent ? "  --intent \\" : "  --no-intent \\",
  ];
  if (addons.length > 0) {
    lines.push(`  --add-ons ${addons.join(",")} \\`);
  }
  lines.push("  -y");
  return lines.join("\n");
}

/** Full agent prompt for Open in Cursor / copy. */
export function buildTanstackPrompt(opts: TanstackPromptOptions): string {
  const command = tanstackCreateCommand(opts);
  const addons = addonsForCli(opts.selectedAddons);
  const hasConvex = addons.includes("convex");

  const parts: string[] = [
    `Scaffold a new TanStack Start app. If a project name isn't obvious from context, ask me for one. Prefer the official TanStack CLI over copying a template. Never hang forever on interactive prompts — if login or project creation needs me, pause and say what to do.`,
    ``,
    `1. Create the app with the current CLI (prefer \`npx @tanstack/cli@latest\` so flags match today):`,
    ``,
    command,
    ``,
    `If a flag or add-on id has been renamed or removed, check \`npx @tanstack/cli@latest create --help\` and \`--list-add-ons\`, then map to the same intent: React, pnpm, Biome toolchain, no demo examples, ${opts.intent ? "TanStack Intent on" : "TanStack Intent off"}${addons.length ? `, add-ons: ${addons.join(", ")}` : ", no extra add-ons"}.`,
    ``,
    `2. cd into the project. Confirm the app starts (\`pnpm dev\` or the generated script). Fix only if the scaffold itself is broken.`,
  ];

  let step = 3;

  if (opts.intent) {
    parts.push(
      ``,
      `${step}. Intent was requested. If the create step didn't fully wire agent skill guidance, run the current Intent consumer setup (\`npx @tanstack/intent@latest install\` or whatever \`--help\` shows) so AGENTS.md (or the project's agent config) can load skills from installed packages on demand.`,
    );
    step += 1;
  }

  if (hasConvex) {
    parts.push(
      ``,
      `${step}. Convex was selected. Complete any Convex login / project linking the CLI asks for. After scaffolding, tell me to install the official Convex plugin in Cursor if I don't already have it — once is enough for all projects:`,
      `   - In Agent chat: \`/add-plugin convex\``,
      `   - Or: Customize → search “Convex” → Add`,
      `Don't try to install the plugin from the terminal.`,
    );
    step += 1;
  }

  parts.push(
    ``,
    `${step}. Stop. Do not add packages or add-ons beyond what I selected unless I ask. Summarize: folder name, flags, add-ons${opts.intent ? ", Intent" : ""}${hasConvex ? ", Convex plugin reminder" : ""}.`,
  );

  return parts.join("\n");
}
