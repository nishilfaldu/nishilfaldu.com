/**
 * The showcase: only the projects Nishil is proud of, in display order.
 *
 * This is the /projects page's whole content — the dock gets a tile and the
 * carousel gets a card per entry. Curation is editing this file: add, remove,
 * reorder, done. The essay's full index lives in projects.ts; this list is
 * deliberately shorter and deliberately separate.
 *
 * `url` is the live deployment; leave it off and the card links to the repo.
 * Adding a `url` also enrolls the project in scripts/capture-showcase.mjs,
 * which screenshots it into public/showcase/<slug>.png.
 *
 * Seeded by Claude from the GitHub repo descriptions — prune freely.
 */
export type ShowcaseProject = {
  /** Repo name under github.com/nishilfaldu, and the screenshot filename. */
  slug: string;
  /** Display name. Its first letter is the dock tile. */
  name: string;
  /** One line under the preview, adapted from the repo description. */
  tagline: string;
  /** Live deployment. Omit → the card links to the repo instead. */
  url?: string;
  /** Preview image: a capture for deployed projects, GitHub's card otherwise. */
  image: string;
};

const card = (slug: string) =>
  `https://opengraph.githubassets.com/1/nishilfaldu/${slug}`;

export const SHOWCASE: ShowcaseProject[] = [
  {
    slug: "sediment",
    name: "Sediment",
    tagline: "A home for every inspiration you find, to de-clutter your mind.",
    url: "https://getsediment.vercel.app",
    image: "/showcase/sediment.png",
  },
  {
    slug: "atlas",
    name: "Atlas",
    tagline:
      "A local-first verification layer for AI-assisted development — it tells you what broke and why.",
    image: card("atlas"),
  },
  {
    slug: "cedar-lang",
    name: "Cedar",
    tagline:
      "A statically-typed language with a compiler written from scratch in Go, down to native executables.",
    image: card("cedar-lang"),
  },
  {
    slug: "easy-rag",
    name: "Easy RAG",
    tagline:
      "Train a chatbot on your own documents and embed it on any site with one snippet.",
    image: card("easy-rag"),
  },
  {
    slug: "vector-search-ecommerce",
    name: "Vector Search",
    tagline:
      "Semantic product search in a single SQL call — the vectors live entirely inside Postgres.",
    image: card("vector-search-ecommerce"),
  },
  {
    slug: "eventure",
    name: "Eventure",
    tagline:
      "Event planning with checklists, vendor discovery, real-time chat, and peer-to-peer video.",
    url: "https://eventure-two.vercel.app",
    image: "/showcase/eventure.png",
  },
  {
    slug: "smart-reviewer",
    name: "Smart Reviewer",
    tagline:
      "An AI news reviewer — summaries and sentiment over polled background jobs.",
    url: "https://smart-reviewer-aries.vercel.app",
    image: "/showcase/smart-reviewer.png",
  },
  {
    slug: "reachcast",
    name: "Reachcast",
    tagline:
      "Cold-email outreach in one keystroke: fill a template, get a prefilled Gmail draft, from Raycast.",
    image: card("reachcast"),
  },
  {
    slug: "belle",
    name: "Belle",
    tagline:
      "Storefront and baking-academy concept for a patisserie. Early and unfinished, on purpose.",
    url: "https://belle-ten.vercel.app",
    image: "/showcase/belle.png",
  },
];
