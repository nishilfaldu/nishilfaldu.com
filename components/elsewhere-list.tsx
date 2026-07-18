import { ELSEWHERE } from "@/components/elsewhere";
import { Mark } from "@/components/mark";
import { ProseLink } from "@/components/prose-link";

/**
 * /elsewhere: the quiet index of secondary rooms.
 * One place for Ideas, Scaffolds, previews, and whatever comes next —
 * so the home footer stays short.
 */
export function ElsewhereList() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <a href="/" aria-label="Home" className="inline-block no-underline">
        <Mark className="mb-10" />
      </a>

      <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">Elsewhere</h1>
      <p className="mb-12 text-ink-muted">
        The other rooms on this site — not the story, not the projects.{" "}
        <ProseLink href="/">Back to the essay</ProseLink>.
      </p>

      <ul className="list-none p-0">
        {ELSEWHERE.map((room) => (
          <li
            key={room.href}
            className="border-t border-rule py-6 first:border-t-0 first:pt-0"
          >
            <a href={room.href} className="group block no-underline text-ink">
              <span className="font-medium tracking-[0.01em] transition-colors group-hover:text-accent">
                {room.name}
              </span>
              <span className="mt-2 block text-ink-muted">{room.note}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
