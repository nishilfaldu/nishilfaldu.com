import { Mark } from "@/components/mark";
import {
  githubBranchUrl,
  PREVIEW_STATUS_LABEL,
  PREVIEWS,
  previewHref,
} from "@/components/previews";
import { ProseLink } from "@/components/prose-link";

/**
 * /previews: what’s cooking on other branches.
 * Same quiet list as /projects — name, a note, a link. No cards, no dashboard.
 */
export function PreviewsList() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <a href="/" aria-label="Home" className="inline-block no-underline">
        <Mark className="mb-10" />
      </a>

      <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">
        In the works
      </h1>
      <p className="mb-12 text-ink-muted">
        Live Vercel previews of branches that haven’t landed yet. Peek at what’s
        coming, or open one when you want to see how it’s going.{" "}
        <ProseLink href="/">Back to the story</ProseLink>.
      </p>

      {PREVIEWS.length === 0 ? (
        <p className="text-ink-muted">Nothing cooking right now.</p>
      ) : (
        <ul className="list-none p-0">
          {PREVIEWS.map((p) => {
            const href = previewHref(p);
            return (
              <li
                key={p.branch}
                className="border-t border-rule py-7 first:border-t-0 first:pt-0"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block no-underline text-ink"
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="font-medium tracking-[0.01em] transition-colors group-hover:text-accent">
                      {p.title}
                    </span>
                    <span className="shrink-0 text-[0.92rem] text-accent">
                      Preview ↗
                    </span>
                  </span>
                  <span className="mt-2 block text-ink-muted">{p.note}</span>
                </a>
                <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.82rem] tracking-[0.01em] text-ink-muted">
                  <span className="uppercase tracking-[0.04em]">
                    {PREVIEW_STATUS_LABEL[p.status]}
                  </span>
                  <span aria-hidden className="text-rule">
                    ·
                  </span>
                  <a
                    href={githubBranchUrl(p.branch)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.78rem] text-ink-muted no-underline transition-colors hover:text-accent"
                  >
                    {p.branch}
                  </a>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
