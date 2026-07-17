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
  return `npx create-electron-app@latest <project-name> --template=${template}`;
}

/** Full agent prompt for Open in Cursor / copy. */
export function buildElectronPrompt(opts: ElectronPromptOptions): string {
  const command = electronCreateCommand(opts);
  const template = TEMPLATES[opts.bundler];
  const bundlerLabel = opts.bundler === "vite" ? "Vite" : "Webpack";

  return [
    `Scaffold a new Electron desktop app with Electron Forge. If a project name isn't obvious from context, ask me for one. Prefer the official create-electron-app CLI over cloning a third-party boilerplate. Never hang forever on interactive prompts.`,
    ``,
    `1. Create the app with the current Forge CLI (prefer \`npx create-electron-app@latest\` so the template matches today):`,
    ``,
    command,
    ``,
    `If the template name has been renamed or removed, check \`npx create-electron-app@latest --help\` and the live Electron Forge docs, then map to the same intent: TypeScript + ${bundlerLabel} (\`${template}\`).`,
    ``,
    `Notes on the two TypeScript templates:`,
    `- \`vite-typescript\` — modern default; Forge's Vite plugin is still marked experimental.`,
    `- \`webpack-typescript\` — more battle-tested Forge path.`,
    ``,
    `2. cd into the project. Confirm it starts (\`npm start\` or the generated script). Fix only if the scaffold itself is broken.`,
    ``,
    `3. Keep Electron security defaults. Do not turn off \`contextIsolation\` or \`sandbox\`, and do not enable \`nodeIntegration\` in renderer windows, unless I explicitly ask.`,
    ``,
    `4. Stop. Do not add React, a UI kit, auto-updater, or packaging tweaks unless I ask. Summarize: folder name, template (${template}), and how to start it.`,
  ].join("\n");
}
