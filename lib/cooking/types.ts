/**
 * Cooking domain types — open-PR WIP for the toolbar.
 * UI imports from here; do not define these under components/.
 */

export type CookingStatus = "cooking" | "ready" | "building";

export type CookingTryLink = {
  kind: "preview" | "release";
  url: string;
};

export type CookingItem = {
  /** Stable id: `${repo}#${prNumber}` */
  id: string;
  /** Full repo, e.g. "nishilfaldu/nishilfaldu.com". */
  repo: string;
  branch: string;
  /** PR title. */
  title: string;
  /** Short blurb from the PR body (may be empty). */
  note: string;
  status: CookingStatus;
  /** Preview deploy or latest release — null if neither applies yet. */
  tryLink: CookingTryLink | null;
  /** GitHub PR link — always set. */
  prUrl: string;
  /** ISO timestamp from PR or deployment. */
  updatedAt: string;
};

export type CookingWatchedRepo = {
  owner: string;
  repo: string;
};

export type CookingResponse = {
  items: CookingItem[];
  /** Repos the token can read — the live watch list. */
  watching: CookingWatchedRepo[];
};
