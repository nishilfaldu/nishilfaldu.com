/**
 * Curated projects for the home page — only the work Nishil is proud of, in display order.
 *
 * Editing this file is the whole workflow: add, remove, reorder. The essay's full
 * index lives in projects.ts; this list is deliberately shorter and separate.
 *
 * `url` → live deployment.
 * Neither → GitHub repo under nishilfaldu/<slug>.
 * `status` → optional label when the work isn't finished yet.
 * `media` → the tile's visual: a loop video, a still, or a rotating set.
 */
export type ShowcaseStatus = "building";

export type ShowcaseMedia =
  | { kind: "video"; src: string; poster: string; ratio: string }
  | { kind: "image"; src: string; alt: string; ratio: string }
  | { kind: "rotate"; images: string[]; alt: string; ratio: string };

export type ShowcaseProject = {
  slug: string;
  name: string;
  /** One human sentence. */
  tagline: string;
  /** Live deployment. */
  url?: string;
  /** Override the link label ("visit", "github", "play store"). */
  linkLabel?: string;
  /** Extra links shown next to the main one ("app store", ...). */
  extraLinks?: { label: string; url: string }[];
  /** Omit when shipped. */
  status?: ShowcaseStatus;
  media?: ShowcaseMedia;
};

export const SHOWCASE_STATUS_LABEL: Record<ShowcaseStatus, string> = {
  building: "in progress",
};

export const SHOWCASE: ShowcaseProject[] = [
  {
    slug: "chat-rendering",
    name: "Chat rendering",
    tagline: "How to render chat better than just virtualization alone.",
    url: "https://chat-rendering.nishilfaldu.site/",
    media: {
      kind: "video",
      src: "/showcase/chat-rendering-loop.mp4",
      poster: "/showcase/chat-rendering-poster.jpg",
      ratio: "16 / 10",
    },
  },
  {
    slug: "cedar-lang",
    name: "Cedar",
    tagline:
      "A statically-typed language with a compiler written from scratch in Go.",
    media: {
      kind: "image",
      src: "/showcase/cedar-terminal.png",
      alt: "A terminal showing a Cedar Fibonacci program, the build to a native executable, and the program printing 610.",
      ratio: "16 / 10",
    },
  },
  {
    slug: "7west",
    name: "7West",
    tagline:
      "A community app for your university - posts, discussions, groups, and events, on Android.",
    url: "https://play.google.com/store/apps/details?id=space.sevenwest.wall",
    linkLabel: "play store",
    media: {
      kind: "rotate",
      images: [
        "/showcase/7west/01.webp",
        "/showcase/7west/02.webp",
        "/showcase/7west/03.webp",
        "/showcase/7west/04.webp",
        "/showcase/7west/05.webp",
        "/showcase/7west/06.webp",
        "/showcase/7west/07.webp",
        "/showcase/7west/08.webp",
      ],
      alt: "The 7West Play Store screenshots, cycling one at a time.",
      ratio: "16 / 10",
    },
  },
];

export function projectHref(p: ShowcaseProject): string {
  if (p.url) return p.url;
  return `https://github.com/nishilfaldu/${p.slug}`;
}

export function projectLinkLabel(p: ShowcaseProject): string {
  if (p.linkLabel) return p.linkLabel;
  if (p.url) return "visit";
  return "github";
}
