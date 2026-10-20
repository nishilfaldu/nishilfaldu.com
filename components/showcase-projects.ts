/**
 * Curated projects for the home page - only the work Nishil is proud of, in display order.
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
    slug: "glance",
    name: "Glance",
    tagline:
      "A map of a pull request: where the changes sit and how they connect.",
    url: "https://glance.nishilfaldu.site/",
    media: {
      kind: "image",
      src: "/showcase/3-glance.png",
      alt: "Glance homepage showing a pull request's repo map with the changed files and the functions they call.",
      ratio: "16 / 10",
    },
  },
  {
    slug: "driftmark",
    name: "Driftmark",
    tagline:
      "Two pull requests to Streamdown: a link fix and a streaming speed-up.",
    url: "https://driftmark.nishilfaldu.site/",
    extraLinks: [
      { label: "github", url: "https://github.com/nishilfaldu/driftmark" },
    ],
    media: {
      kind: "image",
      src: "/showcase/1-driftmark.png",
      alt: "Driftmark homepage showing the Streamdown link fix pull request with a before and after comparison.",
      ratio: "16 / 10",
    },
  },
  {
    slug: "scope",
    name: "Scope",
    tagline:
      "One MCP server for your AI apps, with rules for what each app can do.",
    url: "https://scope.nishilfaldu.site/",
    extraLinks: [
      { label: "github", url: "https://github.com/nishilfaldu/scope" },
    ],
    media: {
      kind: "image",
      src: "/showcase/1-scope-mcp-project-shot.png",
      alt: "Scope homepage showing one MCP server for AI apps and a Cursor request to send a Slack message.",
      ratio: "16 / 10",
    },
  },
  {
    slug: "pro-tour",
    name: "pro-tour",
    tagline:
      "Coding agents attach a video and checklist to each PR, so you can review by watching.",
    url: "https://pro-tour.nishilfaldu.site/",
    extraLinks: [
      { label: "github", url: "https://github.com/nishilfaldu/pro-tour" },
    ],
    media: {
      kind: "video",
      src: "/showcase/2-pro-tour-loop.mp4",
      poster: "/showcase/3-pro-tour-poster.jpg",
      ratio: "16 / 10",
    },
  },
  {
    slug: "chat-rendering",
    name: "Chat rendering",
    tagline: "How to render chat better than just virtualization alone.",
    url: "https://chat-rendering.nishilfaldu.site/",
    extraLinks: [
      {
        label: "demo",
        url: "https://drive.google.com/file/d/16C9j7E6CyxIoraDXoQoSoJDq9QaLRUVp/view?usp=sharing",
      },
      { label: "github", url: "https://github.com/nishilfaldu/chat-rendering" },
    ],

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
