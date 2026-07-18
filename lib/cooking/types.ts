/**
 * Cooking domain types — open-PR WIP for the toolbar.
 * UI imports from here; do not define these under components/.
 */

export type CookingStatus = "cooking" | "ready" | "building";

export type CookingItem = {
  /** Stable id: `${repo}#${prNumber}` */
  id: string;
  /** Display name from the allowlist, e.g. "Portfolio". */
  project: string;
  /** Full repo, e.g. "nishilfaldu/nishilfaldu.com". */
  repo: string;
  branch: string;
  /** PR title. */
  title: string;
  /** Short blurb from the PR body (may be empty). */
  note: string;
  status: CookingStatus;
  /** Preview URL when Ready; null while building / missing. */
  url: string | null;
  /** GitHub PR link — always set. */
  prUrl: string;
  /** ISO timestamp from PR or deployment. */
  updatedAt: string;
};

export type CookingResponse = {
  items: CookingItem[];
  error?: string;
};
