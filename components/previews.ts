/**
 * Branches in flight — Vercel preview links and a line about what’s cooking.
 *
 * Editing this file on **main** is the whole workflow. After a WIP branch is
 * pushed and Vercel has a preview, add or update an entry here (title, note,
 * branch). The preview URL is derived from the branch name; don’t paste
 * deployment hashes. When the work lands, delete the entry.
 *
 * Same spirit as ideas.ts: the list is the source of truth, no extra store.
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
   * Override the derived Vercel URL when the default alias is wrong.
   * Almost never needed — prefer fixing the branch slug instead.
   */
  url?: string;
};

export const PREVIEW_STATUS_LABEL: Record<PreviewStatus, string> = {
  cooking: "cooking",
  ready: "ready",
  cooling: "cooling",
};

/**
 * Vercel project + team that own this site’s preview deploys.
 * Confirmed against live git-branch aliases (nishilfalducom-git-…-vercel.app).
 */
const VERCEL_PROJECT = "nishilfalducom";
const VERCEL_TEAM = "nishil-faldus-projects";

/** Branch → predictable preview hostname (Vercel’s git-branch alias). */
export function vercelPreviewUrl(branch: string): string {
  const slug = branch
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `https://${VERCEL_PROJECT}-git-${slug}-${VERCEL_TEAM}.vercel.app`;
}

export function previewHref(p: Preview): string {
  return p.url ?? vercelPreviewUrl(p.branch);
}

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
    title: "A board for what’s in flight",
    note: "A quiet list of branches being worked on, each with its Vercel preview and a line about what’s cooking — so I can open them fast and visitors can peek at what’s coming.",
    status: "cooking",
  },
];
