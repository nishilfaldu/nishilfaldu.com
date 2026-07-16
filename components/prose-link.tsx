import { ProjectPreview } from "@/components/project-preview";
import { PROJECTS } from "@/components/projects";

/**
 * Every link on the site.
 *
 * The colour is `accent` — Geist's amber-900, which is the *text* step and
 * reads as rust. Not amber-700, the amber everyone pictures: that one is
 * #ffae00 and sits at 1.86:1 on white, so it can't carry a link, an underline,
 * or anything else that has to be legible against paper. The real amber gets
 * exactly one job on this site, and it's the dot in <Mark />.
 *
 * The underline starts at 40% and goes solid on hover. In a page that is
 * nothing but prose, the underline is what makes twenty-one projects findable
 * without breaking the paragraphs into cards.
 */
export function ProseLink({
  id,
  href,
  nowrap,
  children,
}: {
  /** Anchor target for <Toc /> and deep links. Projects have one; socials don't. */
  id?: string;
  href: string;
  /** Keeps short link text on one line. Never on prose links — a long phrase
      that refuses to wrap blows past the measure. */
  nowrap?: boolean;
  children: React.ReactNode;
}) {
  const anchor = (
    <a
      id={id}
      href={href}
      className={`text-accent underline decoration-accent/40 decoration-1 underline-offset-2 transition-[text-decoration-color] hover:decoration-accent focus-visible:decoration-accent ${
        nowrap ? "whitespace-nowrap" : ""
      }`}
    >
      {children}
    </a>
  );

  // Project links (their id is in the index) grow a hover card; socials don't.
  const project = id && PROJECTS.find((p) => p.id === id);
  return project ? (
    <ProjectPreview project={project}>{anchor}</ProjectPreview>
  ) : (
    anchor
  );
}
