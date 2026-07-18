/** Fixed Expo create invocation — default template, SDK 57, pnpm. */
export const EXPO_CREATE_COMMAND =
  "pnpm create expo-app@latest <project-name> --template default@sdk-57 -y";

/** Official Expo Skills into the project (cloud agents clone the repo). */
export const EXPO_SKILLS_COMMAND =
  "pnpm dlx skills add expo/skills --skill '*' --agent cursor -y";

/**
 * Agent prompt for the Expo scaffold.
 * Keep AGENTS.md from create-expo-app; install Expo Skills project-scoped.
 */
export const EXPO_APP_PROMPT = `Scaffold a new Expo app. If a project name isn't obvious from context, ask me for one. Prefer the official create-expo-app CLI over cloning a third-party boilerplate. Never hang forever on interactive prompts.

1. Create the app with the current CLI (prefer \`pnpm create expo-app@latest\` so the template matches today):

${EXPO_CREATE_COMMAND}

If the template tag or flag has been renamed or removed, check \`pnpm create expo-app@latest --help\` and the live Expo docs, then map to the same intent: official \`default\` template on the current SDK (SDK 57 or whatever \`default@sdk-*\` the docs recommend now), TypeScript, Expo Router, keep the generated AGENTS.md / agent files (do **not** pass \`--no-agents-md\`).

The default template ships Expo Router with native tabs (\`expo-router/unstable-native-tabs\` on native). That is expected — do not swap them for the older JS \`Tabs\` layout unless I ask.

2. cd into the project. Confirm it starts (\`pnpm start\` / \`npx expo start\`). Prefer a **development build** / simulator or \`expo run:ios\` / \`expo run:android\` over Expo Go. Fix only if the scaffold itself is broken.

3. Install official Expo Skills into **this project** (not globally) so Cursor cloud agents that clone the repo get them. There is no Expo plugin on the Cursor Marketplace — skills via the official CLI are the supported path:

${EXPO_SKILLS_COMMAND}

If that CLI syntax has changed, check https://docs.expo.dev/skills/ and https://github.com/expo/skills, then install the official \`expo/skills\` set for Cursor into the project. Commit the generated skill files (and any skills lockfile) with the app.

If I explicitly say I want skills only on this machine and not in the repo, use the same command with \`-g\` / \`--global\` instead — and do not commit skill files.

4. Stop. Do not add EAS config, auth, UI kits, NativeWind, or extra packages unless I ask. Summarize: folder name, template/SDK, that AGENTS.md was kept, that Expo Skills are in the project (or global if I asked), and how to start / run a dev build.`;
