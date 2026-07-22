/**
 * Repos that feed the cooking toolbar. Add one entry to watch another product.
 * Do not auto-scan projects.ts — most of those repos have no preview deploys.
 *
 * Scope a fine-grained GITHUB_TOKEN to these repos only.
 *
 * `try` — what visitors can open while a PR is cooking:
 * - `preview` (default): GitHub Preview deployment URL (Vercel, etc.)
 * - `release`: latest GitHub Release (native / Electron apps)
 */

export type CookingTry = "preview" | "release";

export type CookingRepo = {
  owner: string;
  repo: string;
  try?: CookingTry;
};

export const COOKING_REPOS: readonly CookingRepo[] = [
  {
    owner: "nishilfaldu",
    repo: "nishilfaldu.com",
    try: "preview",
  },
  {
    owner: "nishilfaldu",
    repo: "sediment",
    try: "release",
  },
  {
    owner: "nishilfaldu",
    repo: "native-harbor",
    try: "release",
  },
] as const;
