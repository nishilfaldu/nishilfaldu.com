/**
 * Repos that feed the cooking toolbar. Add one entry to watch another product.
 * Do not auto-scan projects.ts — most of those repos have no Vercel previews.
 *
 * Vercel project ids are resolved at runtime (token + team id → match GitHub
 * repo). GitHub token scope should include only these repos.
 */

export type CookingRepo = {
  owner: string;
  repo: string;
  /** Short label in the cooking panel. */
  label: string;
};

export const COOKING_REPOS: readonly CookingRepo[] = [
  {
    owner: "nishilfaldu",
    repo: "nishilfaldu.com",
    label: "Portfolio",
  },
] as const;
