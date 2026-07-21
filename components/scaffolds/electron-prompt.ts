export type ElectronBundler = "vite" | "webpack";

export type ElectronPromptOptions = {
  bundler: ElectronBundler;
};

const TEMPLATES: Record<ElectronBundler, string> = {
  vite: "vite-typescript",
  webpack: "webpack-typescript",
};

/** Official Forge create invocation from the current picker state. */
export function electronCreateCommand(opts: ElectronPromptOptions): string {
  const template = TEMPLATES[opts.bundler];
  return `pnpm create electron-app@latest <project-name> --template=${template}`;
}

/** Full agent prompt for Open in Cursor / copy. */
export function buildElectronPrompt(opts: ElectronPromptOptions): string {
  const command = electronCreateCommand(opts);
  const template = TEMPLATES[opts.bundler];
  const bundlerLabel = opts.bundler === "vite" ? "Vite" : "Webpack";

  const reactStep =
    opts.bundler === "vite"
      ? [
          `3. Add React to the renderer. Forge's templates are vanilla — React is not included. Prefer \`pnpm add\` and the current Vite React docs over hand-editing \`package.json\` or inventing config.`,
          ``,
          `\`pnpm add react react-dom\``,
          `\`pnpm add -D @vitejs/plugin-react\``,
          ``,
          `Then wire the renderer the way the current Vite + React docs say (\`@vitejs/plugin-react\` in the renderer Vite config, a minimal React root). Keep it bare — no router, UI kit, or sample screens. Confirm \`pnpm start\` still works.`,
        ].join("\n")
      : [
          `3. Add React to the renderer. Forge's templates are vanilla — React is not included. Prefer \`pnpm add\` and the current React + Webpack docs (or Forge's own Webpack guidance) over hand-editing \`package.json\` or inventing a loader stack.`,
          ``,
          `\`pnpm add react react-dom\``,
          ``,
          `Then wire the renderer the way those docs say for this template so JSX/TSX compiles — only add the smallest documented loader/plugin change needed. Convert to a minimal React root. Keep it bare — no router, UI kit, or sample screens. Confirm \`pnpm start\` still works.`,
        ].join("\n");

  return [
    `Scaffold a new Electron desktop app with Electron Forge + React + Biome. If a project name isn't obvious from context, ask me for one. Prefer official CLIs, \`pnpm\`, and package install commands over cloning third-party boilerplates or hand-rolling setup. Never hang forever on interactive prompts.`,
    ``,
    `1. Create the app with the current Forge CLI (prefer \`pnpm create electron-app@latest\` so the template and package manager match today):`,
    ``,
    command,
    ``,
    `If the template name has been renamed or removed, check \`pnpm create electron-app@latest --help\` and the live Electron Forge docs, then map to the same intent: TypeScript + ${bundlerLabel} (\`${template}\`), pnpm.`,
    ``,
    `Notes on the two TypeScript templates:`,
    `- \`vite-typescript\` — modern default; Forge's Vite plugin is still marked experimental.`,
    `- \`webpack-typescript\` — more battle-tested Forge path.`,
    ``,
    `Forge + pnpm: set \`node-linker=hoisted\` in the project's \`.npmrc\` (Forge's documented requirement).`,
    ``,
    `2. cd into the project. Confirm it starts (\`pnpm start\` or the generated script). Fix only if the scaffold itself is broken.`,
    ``,
    reactStep,
    ``,
    `4. Add Biome for lint + format. Prefer install + init commands over hand-writing config.`,
    ``,
    `\`pnpm add -D -E @biomejs/biome\``,
    `\`pnpm exec biome init\``,
    ``,
    `If those commands have changed, follow the current Biome getting-started docs with pnpm. Add \`lint\` / \`format\` (or \`check\`) scripts that run Biome. Confirm \`pnpm lint\` (or the script you added) runs. If the Forge template shipped ESLint/Prettier, remove those in favor of Biome — don't leave two linters fighting.`,
    ``,
    `5. Keep Electron security defaults. Do not turn off \`contextIsolation\` or \`sandbox\`, and do not enable \`nodeIntegration\` in renderer windows, unless I explicitly ask.`,
    ``,
    `6. Stop. Do not add a UI kit, auto-updater, or packaging tweaks unless I ask. Summarize: folder name, template (${template}), pnpm + React + Biome wired, and how to start / lint it.`,
  ].join("\n");
}
