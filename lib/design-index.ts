/**
 * Every destination under /design, in one place. The contact sheet renders the
 * foundations from this list and the command menu searches all of it, so the
 * menu can't offer a page the sheet doesn't show, and neither can link at a
 * page that isn't built.
 *
 * `href: null` means the page doesn't exist yet. Nothing renders it as a link.
 */
export type Entry = {
  id: string;
  title: string;
  blurb: string;
  href: string | null;
  group: "Foundations" | "Brands" | "Pages";
  /** Extra search terms for the command menu — things you'd type looking for it. */
  keywords?: string[];
};

export const foundations: Entry[] = [
  {
    id: "colors",
    title: "Colors",
    blurb: "Five scales, ten steps. The step encodes the job, not the shade.",
    href: "/design/system/colors",
    group: "Foundations",
    keywords: ["palette", "swatch", "ramp", "oklch", "contrast", "amber"],
  },
  {
    id: "typography",
    title: "Typography",
    blurb:
      "Four roles — heading, copy, label, button. The role picks the metrics.",
    href: "/design/system/typography",
    group: "Foundations",
    keywords: [
      "type",
      "font",
      "typeface",
      "scale",
      "geist",
      "text",
      "mono",
      "tracking",
      "line height",
    ],
  },
  {
    id: "layout",
    title: "Layout & Spacing",
    blurb: "A 4px base, three containers, five breakpoints.",
    href: "/design/system/layout",
    group: "Foundations",
    keywords: [
      "spacing",
      "grid",
      "container",
      "breakpoint",
      "radius",
      "shadow",
      "motion",
      "easing",
      "rhythm",
      "gap",
    ],
  },
  {
    id: "components",
    title: "Components",
    blurb: "Buttons and inputs, every state, rendered from the contract.",
    href: "/design/system/components",
    group: "Foundations",
    keywords: [
      "button",
      "input",
      "card",
      "state",
      "hover",
      "focus",
      "disabled",
      "loading",
      "validation",
      "form",
    ],
  },
];

/**
 * Geist keeps brand inside the design system rather than beside it, with one
 * entry per product (Vercel, Next.js, Turbo…). Same shape here — one entry per
 * app, each covering its mark and how it wears Sunny.
 */
export const brands: Entry[] = [
  {
    id: "nishilfaldu",
    title: "nishilfaldu.com",
    blurb: "The monogram, an amber dot, and how the site wears Sunny.",
    href: null,
    group: "Brands",
    keywords: ["brand", "mark", "logo", "monogram", "portfolio", "identity"],
  },
];

const pages: Entry[] = [
  {
    id: "hub",
    title: "Design",
    blurb: "The design system and the interface guidelines.",
    href: "/design",
    group: "Pages",
    keywords: ["home", "hub", "index"],
  },
  {
    id: "system",
    title: "Sunny",
    blurb: "The design system behind nishilfaldu.com.",
    href: "/design/system",
    group: "Pages",
    // brand/mark land here: the Brands section lives on this page, not a page of its own
    keywords: [
      "design system",
      "tokens",
      "foundations",
      "brand",
      "brands",
      "mark",
      "logo",
      "monogram",
    ],
  },
  {
    id: "guidelines",
    title: "Web Interface Guidelines",
    blurb: "How interfaces should behave. Vendored from Vercel Labs under MIT.",
    href: "/design/guidelines",
    group: "Pages",
    keywords: ["accessibility", "interaction", "forms", "vercel", "wig"],
  },
  {
    id: "spec-light",
    title: "design.md",
    blurb: "The machine-readable spec, generated from the tokens.",
    href: "/design.md",
    group: "Pages",
    keywords: ["spec", "markdown", "agents", "llm"],
  },
  {
    id: "spec-dark",
    title: "design.dark.md",
    blurb: "The same spec, dark theme values.",
    href: "/design.dark.md",
    group: "Pages",
    keywords: ["spec", "markdown", "dark"],
  },
  {
    id: "guidelines-md",
    title: "guidelines.md",
    blurb: "The terse agent version of the interface guidelines.",
    href: "/design/guidelines.md",
    group: "Pages",
    keywords: ["spec", "markdown", "agents"],
  },
];

/** Everything the command menu can search, in the order groups should appear. */
export const allEntries: Entry[] = [...pages, ...foundations, ...brands];

/** Markdown routes are files, not app pages — the client router can't push them. */
export function isFile(href: string): boolean {
  return href.endsWith(".md");
}
