/**
 * Repos that feed the cooking toolbar. Add one entry to watch another product.
 * Do not auto-scan projects.ts — most of those repos have no Vercel previews.
 */

export type CookingRepo = {
  owner: string;
  repo: string;
  /** Short label in the cooking panel. */
  label: string;
  /**
   * Vercel project id or name (for VERCEL_TOKEN lookups).
   * Portfolio ships as project name `nishilfaldu.com`.
   */
  vercelProject: string;
};

export const COOKING_REPOS: readonly CookingRepo[] = [
  {
    owner: "nishilfaldu",
    repo: "nishilfaldu.com",
    label: "Portfolio",
    vercelProject: "nishilfaldu.com",
  },
] as const;
