import type { Metadata } from "next";
import { Mark } from "@/components/mark";
import { pageMetadata } from "@/components/page-metadata";
import { ProseLink } from "@/components/prose-link";

/**
 * Agent's story — spin a Cursor cloud agent from this site.
 */

export const metadata: Metadata = pageMetadata({
  title: "Agent",
  description:
    "Notice something on this site, type a prompt, and a Cursor cloud agent goes off on the repo.",
  path: "/projects/agent",
  ogType: "article",
});

export default function AgentPage() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36 [&_p]:mb-[1.6rem]">
      <a
        href="/projects"
        aria-label="Projects"
        className="inline-block no-underline"
      >
        <Mark className="mb-10" />
      </a>

      <p className="mb-3 text-[0.92rem] text-ink-muted">
        <ProseLink href="/projects">Projects</ProseLink>
        {" · "}
        Agent
      </p>

      <h1 className="mb-[1.6rem] font-medium tracking-[0.01em]">Agent</h1>

      <p>Hey — Nishil here.</p>

      <p>
        I keep catching things while I’m on this site. A sentence that’s off. A
        page that wants a small fix. An idea that shouldn’t wait until I’m back
        in the IDE. Most of those used to become a note I’d lose.
      </p>

      <p>
        Agent is the opposite of that. From any page I can open a quiet control,
        type what I noticed, and hand it to a Cursor cloud agent pointed at this
        repo. It goes off on its own, works on a branch, and comes back with a
        pull request.
      </p>

      <p>
        It’s only for me — unlocked in the browser, invisible to everyone else.
        The point isn’t a public demo. It’s the loop I want in everything I’m
        building: see something, and right then spin an agent to work on it.
      </p>

      <p>
        This site is the first place that loop lives. The apps are next. The
        code is in this same portfolio repo —{" "}
        <ProseLink href="https://github.com/nishilfaldu/nishilfaldu.com">
          nishilfaldu.com
        </ProseLink>
        .
      </p>
    </main>
  );
}
