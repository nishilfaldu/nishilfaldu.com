import { readFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

const DIR = join(process.cwd(), "vendor", "web-interface-guidelines");

/**
 * Vendored from vercel-labs/web-interface-guidelines under MIT.
 * See vendor/web-interface-guidelines/NOTICE.md for provenance and for why
 * these sections are dropped.
 */
const OMITTED_SECTIONS = [
  "# Vercel-specific",
  "# Integrate with Agents",
  "# Join Vercel",
];

export const ATTRIBUTION = {
  source: "vercel-labs/web-interface-guidelines",
  url: "https://github.com/vercel-labs/web-interface-guidelines",
  upstream: "https://vercel.com/design/guidelines",
  license: "MIT",
  copyright: "Copyright (c) 2025 Vercel Labs",
} as const;

function readVendored(file: string): string {
  return readFileSync(join(DIR, file), "utf8");
}

export function licenseText(): string {
  return readVendored("LICENSE");
}

/** The terse agent-facing version, served verbatim with an attribution header. */
export function agentsMarkdown(): string {
  const body = readVendored("AGENTS.md");
  return `<!--
Web Interface Guidelines
Vendored verbatim from ${ATTRIBUTION.source} under the ${ATTRIBUTION.license} License.
${ATTRIBUTION.copyright}
Source: ${ATTRIBUTION.url}

${licenseText().trim()}
-->

${body}`;
}

/**
 * Splits on top-level headings so omitted sections drop cleanly, then keeps the
 * trailing credits block that follows the final rule.
 */
function stripSections(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let skipping = false;

  for (const line of lines) {
    const isTopHeading = /^# /.test(line);
    if (isTopHeading) {
      skipping = OMITTED_SECTIONS.some((s) => line.trim() === s);
    }
    // the credits block trails the last omitted section behind a horizontal rule
    if (skipping && line.trim() === "---") {
      skipping = false;
      continue;
    }
    if (!skipping) out.push(line);
  }
  return out.join("\n");
}

/**
 * The single source of anchor ids. The table of contents and the heading
 * renderer both call this, so a link can never point at an id that isn't there.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * marked stopped emitting heading ids in v5 (they moved to a separate
 * gfm-heading-id extension), so anchors need to be added back by hand.
 */
const renderer: Parameters<typeof marked.use>[0]["renderer"] = {
  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const id = slugify(
      this.parser.parseInline(tokens, this.parser.textRenderer),
    );
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  },
};

marked.use({ renderer });

export async function guidelinesHtml(): Promise<string> {
  const md = stripSections(readVendored("guidelines.md"));
  return marked.parse(md, { async: true });
}

export function guidelinesSections(): { title: string; id: string }[] {
  const md = stripSections(readVendored("guidelines.md"));
  return md
    .split("\n")
    .filter((l) => /^## /.test(l))
    .map((l) => {
      const title = l.replace(/^##\s+/, "").trim();
      return { title, id: slugify(title) };
    });
}
