/**
 * Cooking repo config.
 *
 * Watched repos are discovered at runtime from whatever GITHUB_TOKEN can
 * read — scope a fine-grained token to the products you care about, and they
 * show up. No need to edit this file just to watch a new repo.
 *
 * Use COOKING_TRY_OVERRIDES when a repo should surface GitHub Releases
 * (native / Electron) instead of the default Preview deployment link.
 */

export type CookingTry = "preview" | "release";

export type CookingRepo = {
  owner: string;
  repo: string;
  try?: CookingTry;
};

/** `owner/repo` → try mode. Anything else defaults to `preview`. */
export const COOKING_TRY_OVERRIDES: Readonly<Record<string, CookingTry>> = {
  "nishilfaldu/sediment": "release",
  "nishilfaldu/native-harbor": "release",
};

export function tryModeFor(owner: string, repo: string): CookingTry {
  return COOKING_TRY_OVERRIDES[`${owner}/${repo}`] ?? "preview";
}
