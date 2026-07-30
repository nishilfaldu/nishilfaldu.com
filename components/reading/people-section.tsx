import { PEOPLE } from "@/components/radar/people";
import { ChannelRow } from "@/components/radar/source-link";

/**
 * The other half of the page. The archive is what I already read; this is the
 * short list of people whose next thing I'd rather not find three weeks late.
 */
export function PeopleSection() {
  return (
    <section className="mt-20 border-t border-rule pt-12">
      <h2 className="mb-[1.2rem] text-[1.05rem] font-medium tracking-[0.01em]">
        People I keep up with
      </h2>
      <p className="mb-10 text-ink-muted">
        Not a follow list. Every channel is here because something could poll it
        later instead of me remembering to.
      </p>

      {PEOPLE.length === 0 ? (
        <p className="text-ink-muted">Empty for now — the names are coming.</p>
      ) : (
        <ul className="m-0 list-none p-0">
          {PEOPLE.map((person) => (
            <li
              key={person.slug}
              className="border-t border-rule py-6 first:border-t-0 first:pt-0"
            >
              <h3 className="m-0 text-[1.05rem] font-medium tracking-[0.01em]">
                {person.name}
              </h3>
              {person.note ? (
                <p className="mt-2 mb-0 text-ink-muted">{person.note}</p>
              ) : null}
              <ChannelRow channels={person.channels} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
