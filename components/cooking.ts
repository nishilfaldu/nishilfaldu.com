/**
 * Shared cooking types — live WIP from open PRs + Vercel/GitHub preview deploys.
 * The toolbar fetches `/api/cooking`; nothing is hand-edited on main.
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

export const COOKING_STATUS_LABEL: Record<CookingStatus, string> = {
  cooking: "cooking",
  ready: "ready",
  building: "building",
};

export type CookingResponse = {
  items: CookingItem[];
  error?: string;
};
