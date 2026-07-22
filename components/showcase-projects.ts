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
  /** Internal page, e.g. /projects/sediment. */
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
    slug: "agent",
    name: "Agent",
    tagline:
      "Notice something on this site, type a prompt, and a Cursor cloud agent goes off on the repo.",
    path: "/projects/agent",
  },
  {
    slug: "phone-tap",
    name: "Phone Tap",
    tagline:
      "Tap two phones and hand over a job packet — resume, LinkedIn, the professional stuff — into a place that keeps it on purpose.",
    path: "/projects/phone-tap",
    status: "building",
  },
  {
    slug: "native-harbor",
    name: "Native Harbor",
    tagline:
      "A native Mac app I’m still building — watched from Cooking when PRs are open.",
    status: "building",
  },
  {
    slug: "sediment",
    name: "Sediment",
    tagline: "An inspiration dashboard for the pieces you already know matter.",
    path: "/projects/sediment",
  },
  {
    slug: "atlas",
    name: "Atlas",
    tagline:
      "A verification engine for AI-written code — and the honest write-up of why catching breaks wasn’t enough.",
    path: "/projects/atlas",
  },
  {
    slug: "cedar-lang",
    name: "Cedar",
    tagline:
      "A statically-typed language with a compiler written from scratch in Go, down to native executables.",
    path: "/projects/cedar",
  },
  {
    slug: "cooking",
    name: "Cooking",
    tagline:
      "A quiet corner of this site that shows open PRs, previews, and releases across the repos I’m watching.",
    path: "/projects/cooking",
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
