"use client";

import { useEffect, useRef } from "react";
import type { ShowcaseProject } from "@/components/showcase-projects";

/**
 * The carousel: one big card per showcase project.
 *
 * Native scroll-snap does the sliding — swipe on touch, trackpad on desktop,
 * arrow keys anywhere. Cards are sized so the neighbours peek in from the
 * edges, which is the whole "there's more here" affordance; no arrows, no
 * pagination pips, the dock below is the index.
 *
 * Each card is a single link: the live site when one exists, the repo when
 * not, and the footer line on the card says which before you commit.
 */
export function Gallery({
  projects,
  trackRef,
  onActive,
}: {
  projects: ShowcaseProject[];
  /** Owned by <Showcase />, which scrolls it when the dock is clicked. */
  trackRef: React.RefObject<HTMLDivElement | null>;
  onActive: (index: number) => void;
}) {
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  /*
   * Tell the dock which card is centred, so the amber dot follows a swipe.
   * Nearest-to-centre, not "intersecting": on a wide viewport a narrow card's
   * neighbours are fully visible too, so visibility alone can't name a winner.
   * Same pattern as the reading line in toc.tsx.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let queued = false;

    const update = () => {
      queued = false;
      const centre = track.getBoundingClientRect().left + track.clientWidth / 2;
      let nearest = -1;
      let best = Infinity;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - centre);
        if (dist < best) {
          best = dist;
          nearest = i;
        }
      });
      if (nearest >= 0) onActive(nearest);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [trackRef, onActive]);

  return (
    <div
      ref={trackRef}
      // The card width also answers to the available *height*: 100cqh is the
      // real space between header and dock (<main> is a size container), the
      // 15rem covers the caption, the dock's zone, and the track's own
      // padding, and ×1.6 turns the leftover image height back into width.
      // The track's side padding derives from the same width so the first and
      // last cards can centre exactly.
      style={
        {
          "--card-w": "max(16rem, min(70vw, 52rem, (100cqh - 10rem) * 1.6))",
        } as React.CSSProperties
      }
      className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.5rem,calc((100vw-var(--card-w))/2))] pt-2 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {projects.map((p, i) => (
        <a
          key={p.slug}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          href={p.url ?? `https://github.com/nishilfaldu/${p.slug}`}
          className="w-[var(--card-w)] shrink-0 snap-center overflow-hidden rounded-2xl border border-rule bg-paper no-underline shadow-[0_8px_28px_rgb(0_0_0/0.10)] transition-shadow duration-200 hover:shadow-[0_12px_36px_rgb(0_0_0/0.16)]"
        >
          <span className="block aspect-[16/10] w-full border-b border-rule bg-paper-raised">
            {/* biome-ignore lint/performance/noImgElement: local captures and GitHub's CDN cards; no resizing pipeline needed */}
            <img
              src={p.image}
              alt={`Preview of ${p.name}`}
              loading={i < 2 ? "eager" : "lazy"}
              // Our captures are shot at exactly 16:10 and fill the box;
              // GitHub's cards are wider (1200×630), and cropping them cuts
              // the repo name off, so they letterbox on paper-raised instead.
              className={`block h-full w-full ${
                p.image.startsWith("/")
                  ? "object-cover object-top"
                  : "object-contain"
              }`}
            />
          </span>
          <span className="flex items-baseline justify-between gap-4 px-6 py-4">
            <span className="min-w-0">
              <span className="block font-medium tracking-[0.01em] text-ink">
                {p.name}
              </span>
              <span className="mt-0.5 line-clamp-2 block text-[0.92rem] leading-snug text-ink-muted">
                {p.tagline}
              </span>
            </span>
            <span className="shrink-0 text-[0.92rem] whitespace-nowrap text-accent">
              {p.url ? "visit ↗" : "github ↗"}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
