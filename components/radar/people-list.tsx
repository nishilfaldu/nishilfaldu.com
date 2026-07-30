import { Mark } from "@/components/mark";
import { ProseLink } from "@/components/prose-link";
import { PEOPLE } from "@/components/radar/people";
import { RadarNav } from "@/components/radar/radar-nav";
import { ChannelRow } from "@/components/radar/source-link";

/**
 * /people — the handful of writers whose next thing I don’t want to miss.
 */
export function PeopleList() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <a href="/" aria-label="Home" className="inline-block no-underline">
        <Mark className="mb-10" />
      </a>

      <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">People</h1>
      <p className="mb-12 text-ink-muted">
        Not a follow list. The few people whose next piece I’d rather not find
        three weeks late, and every place each of them actually publishes.
      </p>

      {PEOPLE.length === 0 ? (
        <p className="text-ink-muted">
          Empty for now — the names are coming. Until then this page is just the
          shape of the habit.
        </p>
      ) : (
        <ul className="list-none p-0">
          {PEOPLE.map((person) => (
            <li
              key={person.slug}
              className="border-t border-rule py-6 first:border-t-0 first:pt-0"
            >
              <h2 className="m-0 text-[1.05rem] font-medium tracking-[0.01em]">
                {person.name}
              </h2>
              {person.note ? (
                <p className="mt-2 mb-0 text-ink-muted">{person.note}</p>
              ) : null}
              <ChannelRow channels={person.channels} />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-14 text-ink-muted">
        Reading them is the easy half. Not missing them is the part I’m still
        solving — every channel here is listed so something can poll it later
        instead of me remembering to.{" "}
        <ProseLink href="/writings">What I’ve written</ProseLink> is a separate
        page.
      </p>

      <RadarNav current="people" />
    </main>
  );
}
