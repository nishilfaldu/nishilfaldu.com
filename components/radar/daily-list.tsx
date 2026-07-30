import { Mark } from "@/components/mark";
import { DAILY } from "@/components/radar/daily";
import { RadarNav } from "@/components/radar/radar-nav";
import { ChannelRow } from "@/components/radar/source-link";

/**
 * /daily — the short list of sites worth opening every day.
 */
export function DailyList() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <a href="/" aria-label="Home" className="inline-block no-underline">
        <Mark className="mb-10" />
      </a>

      <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">Daily</h1>
      <p className="mb-12 text-ink-muted">
        Sites that earn a check every day. Short on purpose — a long list is one
        nobody opens.
      </p>

      <ul className="list-none p-0">
        {DAILY.map((site) => (
          <li
            key={site.slug}
            className="border-t border-rule py-6 first:border-t-0 first:pt-0"
          >
            <h2 className="m-0 text-[1.05rem] font-medium tracking-[0.01em]">
              <a
                href={site.href}
                className="text-accent underline decoration-accent/40 decoration-1 underline-offset-2 transition-[text-decoration-color] hover:decoration-accent focus-visible:decoration-accent"
              >
                {site.name}
              </a>
            </h2>
            <p className="mt-2 mb-0 text-ink-muted">{site.note}</p>
            {site.channels ? <ChannelRow channels={site.channels} /> : null}
          </li>
        ))}
      </ul>

      <RadarNav current="daily" />
    </main>
  );
}
