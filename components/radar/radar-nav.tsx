import { ProseLink } from "@/components/prose-link";

/**
 * The three pages are one habit split three ways, so each one names the other
 * two. Without this they’re islands you can only reach from the home footer.
 */
const PAGES = [
  { key: "reading", href: "/reading", label: "Reading" },
  { key: "daily", href: "/daily", label: "Daily" },
  { key: "watching", href: "/watching", label: "Watching" },
] as const;

export type RadarPage = (typeof PAGES)[number]["key"];

export function RadarNav({ current }: { current: RadarPage }) {
  const others = PAGES.filter((page) => page.key !== current);
  return (
    <p className="mt-14 text-ink-muted">
      Also:{" "}
      {others.map((page, i) => (
        <span key={page.key}>
          {i > 0 ? " · " : null}
          <ProseLink nowrap href={page.href}>
            {page.label}
          </ProseLink>
        </span>
      ))}{" "}
      · <ProseLink href="/">Back to the story</ProseLink>
    </p>
  );
}
