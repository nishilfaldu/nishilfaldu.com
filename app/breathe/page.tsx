import type { Metadata } from "next";
import { BreatheSession } from "@/components/breathe/breathe-session";
import { Mark } from "@/components/mark";
import { pageMetadata } from "@/components/page-metadata";
import { ProseLink } from "@/components/prose-link";

/**
 * A gap on the site — guided cyclic sigh, not a wellness product.
 */

export const metadata: Metadata = pageMetadata({
  title: "Breathe",
  description:
    "A tiny gap when agent-pace overwhelm shows up — a few physiological sighs, then back.",
  path: "/breathe",
});

export default function BreathePage() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <a href="/" aria-label="Home" className="inline-block no-underline">
        <Mark className="mb-10" />
      </a>
      <BreatheSession />
      <p className="mt-14 mb-0 text-ink-muted">
        <ProseLink href="/">Back to the story</ProseLink>
        {" · "}
        <ProseLink href="/ideas">Ideas</ProseLink>
      </p>
    </main>
  );
}
