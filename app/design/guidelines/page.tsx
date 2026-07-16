import type { Metadata } from "next";
import Link from "next/link";
import {
  ATTRIBUTION,
  guidelinesHtml,
  guidelinesSections,
} from "@/lib/guidelines";

export const metadata: Metadata = {
  title: "Web Interface Guidelines",
  description:
    "Rules for building accessible, fast, delightful interfaces. Vendored from vercel-labs/web-interface-guidelines under MIT.",
};

export default async function GuidelinesPage() {
  const html = await guidelinesHtml();
  const sections = guidelinesSections();

  return (
    <div className="flex flex-col gap-10">
      <section className="max-w-measure">
        <Link
          href="/design"
          className="text-label-13 text-gray-900 hover:text-gray-1000"
        >
          ← Design
        </Link>
        <h1 className="mt-4 text-heading-48 text-gray-1000">
          Web Interface Guidelines
        </h1>
        <p className="mt-4 text-copy-20 text-gray-900">
          Interfaces succeed because of hundreds of small choices. These are the
          ones worth writing down.
        </p>
      </section>

      <aside className="max-w-measure rounded-md border border-gray-alpha-400 bg-background-200 p-5">
        <h2 className="text-heading-16 text-gray-1000">Not mine</h2>
        <p className="mt-2 text-copy-14 text-gray-900">
          This is{" "}
          <a
            href={ATTRIBUTION.url}
            className="text-link underline underline-offset-2 hover:text-link-hover"
          >
            {ATTRIBUTION.source}
          </a>
          , reproduced under the {ATTRIBUTION.license} License.{" "}
          {ATTRIBUTION.copyright}. It’s reproduced word for word because it’s
          already right, and rewriting it to sound like me would make it worse
          and less honest. Three upstream sections are omitted — Vercel’s own
          brand copywriting rules, their agent install instructions, and their
          hiring notice — because they’re theirs, not universal.
        </p>
        <p className="mt-3 text-copy-14 text-gray-900">
          Agents: the terse version is at{" "}
          <a
            href="/design/guidelines.md"
            className="text-link underline underline-offset-2 hover:text-link-hover"
          >
            /design/guidelines.md
          </a>
          .
        </p>
      </aside>

      <nav className="max-w-measure">
        <h2 className="text-label-12-mono text-gray-700 uppercase">Contents</h2>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-label-14 text-gray-900 hover:text-gray-1000"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <article
        className="markdown max-w-measure"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: renders a pinned vendored file in this repo, never user input
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
