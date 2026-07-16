import { Mark } from "@/components/mark";
import { ProseLink } from "@/components/prose-link";
import { TINKER_ISSUES } from "@/components/tinkerletter/issues";

/**
 * /tinkerletter — interactive issues you can touch, not just read.
 */
export function TinkerletterList() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <a href="/" aria-label="Home" className="inline-block no-underline">
        <Mark className="mb-10" />
      </a>

      <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">
        Tinkerletter
      </h1>
      <p className="mb-12 text-ink-muted">
        Ideas you can touch. Each issue is one technical or physical idea, one
        interaction, one reveal — instead of reading about a thing, you run it.{" "}
        <ProseLink href="/">Back to the story</ProseLink>.
      </p>

      <ul className="list-none p-0">
        {TINKER_ISSUES.map((issue) => (
          <li
            key={issue.slug}
            className="border-t border-rule py-6 first:border-t-0 first:pt-0"
          >
            <a
              href={`/tinkerletter/${issue.slug}`}
              className="group block text-ink no-underline"
            >
              <span className="mb-1 block text-[0.82rem] tracking-[0.04em] text-ink-muted uppercase">
                Issue nº {issue.number} · {issue.date}
              </span>
              <span className="flex items-baseline justify-between gap-4">
                <span className="font-medium tracking-[0.01em] transition-colors group-hover:text-accent">
                  {issue.title}
                </span>
                <span className="shrink-0 text-[0.92rem] text-accent">
                  Read ↗
                </span>
              </span>
              <span className="mt-2 block text-ink-muted">{issue.tagline}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
