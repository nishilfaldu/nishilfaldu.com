import { Mark } from "@/components/mark";
import { ProseLink } from "@/components/prose-link";
import {
  projectHref,
  projectLinkLabel,
  SHOWCASE,
  SHOWCASE_STATUS_LABEL,
} from "@/components/showcase-projects";

/**
 * The home page: a quiet list of the work Nishil is proud of.
 * No carousel, no dock, no preview cards — name, one sentence, a link.
 */
export function ProjectList() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <a href="/" aria-label="Home" className="inline-block no-underline">
        <Mark className="mb-10" />
      </a>

      <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">Projects</h1>
      <p className="mb-12 text-ink-muted">The work I’m proud of.</p>

      <ul className="list-none p-0">
        {SHOWCASE.map((p) => (
          <li
            key={p.slug}
            className="border-t border-rule py-6 first:border-t-0 first:pt-0"
          >
            <a
              href={projectHref(p)}
              className="group block no-underline text-ink"
            >
              <span className="flex items-baseline justify-between gap-4">
                <span className="min-w-0">
                  <span className="font-medium tracking-[0.01em] group-hover:text-accent transition-colors">
                    {p.name}
                  </span>
                  {p.status ? (
                    <span className="ml-2 text-[0.88rem] tracking-[0.02em] text-ink-muted">
                      {SHOWCASE_STATUS_LABEL[p.status]}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-[0.92rem] text-accent">
                  {projectLinkLabel(p)} ↗
                </span>
              </span>
              <span className="mt-2 block text-ink-muted">{p.tagline}</span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-14">
        <ProseLink nowrap href="/">
          Projects
        </ProseLink>{" "}
        ·{" "}
        <ProseLink nowrap href="/story">
          Story
        </ProseLink>{" "}
        ·{" "}
        <ProseLink nowrap href="/writings">
          Writings
        </ProseLink>{" "}
        ·{" "}
        <ProseLink nowrap href="/tinkerletter">
          Tinkerletter
        </ProseLink>{" "}
        ·{" "}
        <ProseLink nowrap href="/scaffolds">
          Scaffolds
        </ProseLink>{" "}
        ·{" "}
        <ProseLink nowrap href="/reading">
          Reading
        </ProseLink>{" "}
        ·{" "}
        <ProseLink nowrap href="/daily">
          Daily
        </ProseLink>{" "}
        ·{" "}
        <ProseLink nowrap href="/watching">
          Watching
        </ProseLink>{" "}
        ·{" "}
        <ProseLink nowrap href="https://x.com/FalduNishil">
          <span className="line-through decoration-1">Twitter</span> X
        </ProseLink>{" "}
        ·{" "}
        <ProseLink nowrap href="https://github.com/nishilfaldu">
          GitHub
        </ProseLink>{" "}
        ·{" "}
        <ProseLink nowrap href="https://www.linkedin.com/in/nishilfaldu">
          LinkedIn
        </ProseLink>
      </p>
    </main>
  );
}
