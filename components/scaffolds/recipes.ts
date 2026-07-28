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
    status: "builder",
  },
  {
    slug: "tanstack-start",
    name: "TanStack Start",
    tagline:
      "Pick a linter and add-ons (Query, Convex, auth, deploy…), get a prompt — Intent on by default.",
    status: "builder",
  },
  {
    slug: "electron",
    name: "Electron",
    tagline:
      "Electron Forge TypeScript + React, Biome or ESLint — Vite (default) or Webpack, pnpm. Official CLI, not a stale boilerplate.",
    status: "builder",
  },
  {
    slug: "expo",
    name: "Expo",
    tagline:
      "default@sdk-57 — Expo Router, native tabs, Biome or ESLint, project Expo Skills for Cursor.",
    status: "builder",
  },
];

/** Web Cursor prompt deeplink — opens chat with the text prefilled. */
export function cursorPromptHref(prompt: string): string {
  const url = new URL("https://cursor.com/link/prompt");
  url.searchParams.set("text", prompt);
  return url.toString();
}
