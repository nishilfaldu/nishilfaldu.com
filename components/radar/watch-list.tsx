import { Mark } from "@/components/mark";
import { ProseLink } from "@/components/prose-link";
import { RadarNav } from "@/components/radar/radar-nav";
import { SourceLink } from "@/components/radar/source-link";
import { WATCHING } from "@/components/radar/watching";

/**
 * /watching — events I’m waiting on, where hearing about it late is the loss.
 */
export function WatchList() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <a href="/" aria-label="Home" className="inline-block no-underline">
        <Mark className="mb-10" />
      </a>

      <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">Watching</h1>
      <p className="mb-12 text-ink-muted">
        Not things I want to build — those are on{" "}
        <ProseLink href="/ideas">ideas</ProseLink>. These are things I don’t
        want to find out about late. Each one says what would count as it
        actually happening, and where I’d expect to see it first.
      </p>

      <ul className="list-none p-0">
        {WATCHING.map((item) => (
          <li
            key={item.slug}
            className="border-t border-rule py-8 first:border-t-0 first:pt-0"
          >
            <h2 className="m-0 mb-3 text-[1.05rem] font-medium tracking-[0.01em]">
              {item.title}
            </h2>
            <p className="m-0 flex gap-2.5 text-ink">
              <span
                className="mt-[0.5em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-dot"
                aria-hidden
              />
              <span>{item.watchingFor}</span>
            </p>
            {item.body?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="mt-4 mb-0 text-ink-muted"
              >
                {paragraph}
              </p>
            ))}
            {item.where && item.where.length > 0 ? (
              <div className="mt-5">
                <p className="mb-2 text-[0.8rem] tracking-[0.04em] text-ink-muted uppercase">
                  Where it breaks
                </p>
                <ul className="m-0 list-none p-0">
                  {item.where.map((place) => (
                    <li key={place.href} className="mb-1.5 last:mb-0">
                      <SourceLink href={place.href}>{place.label}</SourceLink>
                      {place.note ? (
                        <span className="text-[0.92rem] text-ink-muted">
                          {" "}
                          — {place.note}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <RadarNav current="watching" />
    </main>
  );
}
