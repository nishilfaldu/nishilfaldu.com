"use client";

import { useCallback, useRef, useState } from "react";
import { Dock } from "@/components/dock";
import { Gallery } from "@/components/gallery";
import { Mark } from "@/components/mark";
import { ProseLink } from "@/components/prose-link";
import { SHOWCASE } from "@/components/showcase-projects";

/**
 * The /projects page's one component: header, carousel, dock.
 *
 * This is the deliberate exception to the essay's no-tiles rule — the essay
 * tells the story in order, this page shows off the work Nishil is proud of.
 * The two stay linked in both directions, because neither replaces the other.
 *
 * The active index lives here: the dock writes it by click, the gallery
 * writes it by scroll, and each reads what the other wrote.
 */
export function Showcase() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((i: number) => {
    const card = trackRef.current?.children[i];
    if (!card) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    // Same reasoning as toc.tsx: scroll it ourselves so nothing moves focus.
    card.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      inline: "center",
      block: "nearest",
    });
    setActive(i);
  }, []);

  // Arrow keys page the carousel from anywhere — no need to focus the track.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goTo(Math.min(active + 1, SHOWCASE.length - 1));
    if (e.key === "ArrowLeft") goTo(Math.max(active - 1, 0));
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: arrow keys are a shortcut; every control inside is natively focusable and clickable
    <div
      onKeyDown={onKeyDown}
      // h-dvh, not min-h: the <main> below is a size container, and a size
      // container needs a definite height to measure against — under min-h
      // its flex share computes to zero and every card collapses to the floor.
      className="flex h-dvh flex-col overflow-x-hidden"
    >
      <header className="mx-auto w-full max-w-measure px-6 pt-14 pb-4 sm:px-8 sm:pt-20">
        <a href="/" aria-label="Home" className="inline-block no-underline">
          <Mark className="mb-8" />
        </a>
        <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">Projects</h1>
        <p className="text-ink-muted">
          The work I’m proud of.{" "}
          <ProseLink href="/">The story behind it</ProseLink> is on the front
          page.
        </p>
      </header>

      {/* A size container, so the gallery can size cards against the real
          space between header and dock (100cqh) instead of guessing at the
          header's height from the viewport. The dock is fixed, out of flow,
          so its zone is held open with margin — margin stays outside 100cqh,
          padding wouldn't. */}
      <main className="mb-28 flex min-h-0 flex-1 items-center [container-type:size]">
        <Gallery projects={SHOWCASE} trackRef={trackRef} onActive={setActive} />
      </main>

      <Dock projects={SHOWCASE} active={active} onSelect={goTo} />
    </div>
  );
}
