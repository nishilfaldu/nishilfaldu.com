/**
 * Curated projects for /projects — only the work Nishil is proud of, in display order.
 *
 * Editing this file is the whole workflow: add, remove, reorder. The essay's full
 * index lives in projects.ts; this list is deliberately shorter and separate.
 *
 * `path` → internal story page (takes precedence).
 * `url` → live deployment.
 * Neither → GitHub repo under nishilfaldu/<slug>.
 * `status` → optional label when the work isn’t finished yet.
 */
export type ShowcaseStatus = "building";

export type ShowcaseProject = {
  slug: string;
  name: string;
  /** One human sentence. */
  tagline: string;
  /** Internal page, e.g. /projects/cedar. */
  path?: string;
  /** Live deployment. */
  url?: string;
  /** Omit when shipped. */
  status?: ShowcaseStatus;
};

export const SHOWCASE_STATUS_LABEL: Record<ShowcaseStatus, string> = {
  building: "in progress",
};

export const SHOWCASE: ShowcaseProject[] = [
  {
    slug: "cedar-lang",
    name: "Cedar",
    tagline:
      "A statically-typed language with a compiler written from scratch in Go, down to native executables.",
    path: "/projects/cedar",
  },
];

export function projectHref(p: ShowcaseProject): string {
  if (p.path) return p.path;
  if (p.url) return p.url;
  return `https://github.com/nishilfaldu/${p.slug}`;
}

export function projectLinkLabel(p: ShowcaseProject): string {
  if (p.path) return "read";
  if (p.url) return "visit";
  return "github";
}
