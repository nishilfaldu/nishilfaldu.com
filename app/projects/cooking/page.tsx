import type { Metadata } from "next";
import { Mark } from "@/components/mark";
import { pageMetadata } from "@/components/page-metadata";
import { ProseLink } from "@/components/prose-link";

/**
 * Cooking's story — live WIP from GitHub on this site's toolbar.
 */

export const metadata: Metadata = pageMetadata({
  title: "Cooking",
  description:
    "A quiet corner of this site that shows open PRs, previews, and releases across the repos I’m watching.",
  path: "/projects/cooking",
  ogType: "article",
});

export default function CookingPage() {
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
        Cooking
      </p>

      <h1 className="mb-[1.6rem] font-medium tracking-[0.01em]">Cooking</h1>

      <p>Hey — Nishil here.</p>

      <p>
        Most of what I care about lives on a branch before it hits main. This
        site, Sediment, the next thing — visitors only ever saw the finished
        surface. I wanted a tiny window into what’s still warm.
      </p>

      <p>
        Cooking is that window. It lives in the bottom-left toolbar on this
        site. It watches whatever GitHub repos the site token can read — open a
        PR and it shows up; grant the token a new repo (like Volt) and that
        joins the tray. Try-links are a Preview when Vercel (or anything else)
        posted a GitHub Deployment, or the latest Release when the project is
        native — like Sediment’s Electron builds.
      </p>

      <p>
        Each row is small on purpose. Title and a note from the PR. Links to the
        preview or release, the repo, and the pull request via the branch name.
        Underneath, every repo on the live watch list, so you can see what this
        corner of the site is paying attention to even when nothing is open.
      </p>

      <p>
        No hand-edited status board. Open a PR and it shows up. Merge or close
        it and it goes away. Add a repo to the GitHub token and it joins the
        tray — no deploy just to widen the watch list.
      </p>

      <p>
        The idea started on the{" "}
        <ProseLink href="/ideas?idea=cooking-status">ideas</ProseLink> page. The
        code lives in this same portfolio repo —{" "}
        <ProseLink href="https://github.com/nishilfaldu/nishilfaldu.com">
          nishilfaldu.com
        </ProseLink>
        . If you’re here, look for “cooking” in the toolbar and open it.
      </p>
    </main>
  );
}
