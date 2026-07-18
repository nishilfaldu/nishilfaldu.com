/**
 * Branches in flight — Vercel preview links and a line about what’s cooking.
 *
 * Editing this file on **main** is the whole workflow. After a WIP branch is
 * pushed and Vercel posts a Preview URL, add or update an entry here. When the
 * work lands, delete the entry. A site-wide “cooking” button opens a modal
 * listing every entry (`<CookingStatus />` in the root layout). Empty list =
 * button hidden.
 *
 * Preview URLs: paste the stable git-branch alias from the Vercel bot comment
 * on the PR (or the Preview link in the deployment). Don’t paste per-deploy
 * hashes (`…-5irtpn6ju-…`) — those rotate. Long branch names get truncated by
 * Vercel, so deriving the alias from the branch alone is unreliable.
 *
 * If a preview asks visitors to log in to Vercel, turn off Deployment
 * Protection for Preview in the project settings so the links are public.
 */

export type PreviewStatus = "cooking" | "ready" | "cooling";

export type Preview = {
  /** Git branch name exactly as pushed. */
  branch: string;
  /** Short name for the work — what a visitor would recognize. */
  title: string;
  /** One or two sentences: what’s being tried on this preview. */
  note: string;
  status: PreviewStatus;
  /**
   * Stable Vercel git-branch preview URL, e.g.
   * https://nishilfalducom-git-<slug>-nishil-faldus-projects.vercel.app
   */
  url: string;
};

export const PREVIEW_STATUS_LABEL: Record<PreviewStatus, string> = {
  cooking: "cooking",
  ready: "ready",
  cooling: "cooling",
};

export const GITHUB_REPO = "https://github.com/nishilfaldu/nishilfaldu.com";

export function githubBranchUrl(branch: string): string {
  const path = branch.split("/").map(encodeURIComponent).join("/");
  return `${GITHUB_REPO}/tree/${path}`;
}

/**
 * Active previews only. Keep it short — what’s actually in flight.
 * Agents: update on main when you push a WIP branch; remove when it merges.
 */
export const PREVIEWS: Preview[] = [
  {
    branch: "cursor/previews-status-5bf0",
    title: "Homepage cooking status",
    note: "WIP previews in a site-wide modal — room for several branches in flight, without touching the home links.",
    status: "cooking",
    url: "https://nishilfalducom-git-cursor-preview-71520e-nishil-faldus-projects.vercel.app",
  },
];
