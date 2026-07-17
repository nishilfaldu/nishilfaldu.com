import type { Metadata } from "next";
import { Mark } from "@/components/mark";
import { pageMetadata } from "@/components/page-metadata";
import { ProseLink } from "@/components/prose-link";
import { SedimentDownload } from "@/components/sediment-download";

/**
 * Sediment's story — same voice as the welcome email, on the portfolio.
 * Download lives here so getsediment doesn't need a separate marketing site.
 */

export const metadata: Metadata = pageMetadata({
  title: "Sediment",
  description:
    "An inspiration dashboard for the pieces you already know matter. Copy something, find it later, share it with family and friends.",
  path: "/projects/sediment",
  ogType: "article",
});

export default function SedimentPage() {
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
        Sediment
      </p>

      <h1 className="mb-[1.6rem] font-medium tracking-[0.01em]">Sediment</h1>

      <p>Hey — Nishil here.</p>

      <p>Quick story, if you care:</p>

      <p>
        Social apps are full of stuff worth keeping — articles, posts, little
        sparks. Most of them even have a saves folder now. But those keep
        growing and growing, and when I actually need something later, it’s
        still a slog to dig it back up. I don’t want to scroll for hours just to
        get back to that one thing.
      </p>

      <p>
        So Sediment is an inspiration dashboard for the pieces I already know
        matter. The ones I’ll want later. The ones that would be a pain to hunt
        down on the platform where I first saw them — even in that app’s own
        saves.
      </p>

      <p>
        Copy something → it lands on today’s board. And when I need it, I can
        search across everything I’ve kept — instead of scrolling.
      </p>

      <p>
        Honestly a big part of why I built this is family and friends. When
        we’re talking and I think of an article I read, I want to pull it up and
        share it right then. That’s the whole idea.
      </p>

      <p>
        If Sediment ends up useful,{" "}
        <ProseLink href="https://github.com/nishilfaldu/sediment">
          starring the repo
        </ProseLink>{" "}
        helps a lot. Got a feature idea or a bug?{" "}
        <ProseLink href="https://github.com/nishilfaldu/sediment/issues">
          Open an issue
        </ProseLink>{" "}
        — or a PR. I’ll take a look.
      </p>

      <p>
        And if you’d be into a small community where people share cool resources
        with each other —{" "}
        <ProseLink href="https://www.linkedin.com/in/nishilfaldu">
          hit me up on LinkedIn
        </ProseLink>
        . No pressure. I’m just gauging if anyone wants that.
      </p>

      <SedimentDownload />
    </main>
  );
}
