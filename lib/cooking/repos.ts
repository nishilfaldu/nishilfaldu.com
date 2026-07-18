/**
 * Repos that feed the cooking toolbar. Add one entry to watch another product.
 * Do not auto-scan projects.ts — most of those repos have no Vercel previews.
 *
 * Vercel project id comes from env (`vercelProjectEnv`), not from a hardcoded
 * project name/namespace in source.
 */

export type CookingRepo = {
  owner: string;
  repo: string;
  /** Short label in the cooking panel. */
  label: string;
  /**
   * Name of the env var that holds this repo’s Vercel project id
   * (e.g. VERCEL_PROJECT_ID). Resolved at runtime.
   */
  vercelProjectEnv: string;
};

export const COOKING_REPOS: readonly CookingRepo[] = [
  {
    owner: "nishilfaldu",
    repo: "nishilfaldu.com",
    label: "Portfolio",
    vercelProjectEnv: "VERCEL_PROJECT_ID",
  },
] as const;
