/**
 * Repos that feed the cooking toolbar. Add one entry to watch another product.
 * Do not auto-scan projects.ts — most of those repos have no preview deploys.
 *
 * Scope a fine-grained GITHUB_TOKEN to these repos only.
 */

export type CookingRepo = {
  owner: string;
  repo: string;
};

export const COOKING_REPOS: readonly CookingRepo[] = [
  {
    owner: "nishilfaldu",
    repo: "nishilfaldu.com",
  },
] as const;
