/**
 * Curated projects for /projects — only the work Nishil is proud of, in display order.
 *
 * Editing this file is the whole workflow: add, remove, reorder. The essay's full
 * index lives in projects.ts; this list is deliberately shorter and separate.
 *
 * `path` → internal story page (takes precedence).
 * `url` → live deployment.
 * Neither → GitHub repo under nishilfaldu/<slug>.
 */
export type ShowcaseProject = {
  slug: string;
  name: string;
  /** One human sentence. */
  tagline: string;
  /** Internal page, e.g. /projects/sediment. */
  path?: string;
  /** Live deployment. */
  url?: string;
};

export const SHOWCASE: ShowcaseProject[] = [
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
      "A local-first verification layer for AI-assisted development — it tells you what broke and why.",
  },
  {
    slug: "cedar-lang",
    name: "Cedar",
    tagline:
      "A statically-typed language with a compiler written from scratch in Go, down to native executables.",
  },
  {
    slug: "easy-rag",
    name: "Easy RAG",
    tagline:
      "Train a chatbot on your own documents and embed it on any site with one snippet.",
  },
  {
    slug: "vector-search-ecommerce",
    name: "Vector Search",
    tagline:
      "Semantic product search in a single SQL call — the vectors live entirely inside Postgres.",
  },
  {
    slug: "eventure",
    name: "Eventure",
    tagline:
      "Event planning with checklists, vendor discovery, real-time chat, and peer-to-peer video.",
    url: "https://eventure-two.vercel.app",
  },
  {
    slug: "smart-reviewer",
    name: "Smart Reviewer",
    tagline:
      "An AI news reviewer — summaries and sentiment over polled background jobs.",
    url: "https://smart-reviewer-aries.vercel.app",
  },
  {
    slug: "reachcast",
    name: "Reachcast",
    tagline:
      "Cold-email outreach in one keystroke: fill a template, get a prefilled Gmail draft, from Raycast.",
  },
  {
    slug: "belle",
    name: "Belle",
    tagline:
      "Storefront and baking-academy concept for a patisserie. Early and unfinished, on purpose.",
    url: "https://belle-ten.vercel.app",
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
