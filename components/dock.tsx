"use client";

import { useRef, useState } from "react";
import type { ShowcaseProject } from "@/components/showcase-projects";

/**
 * The dock: one lettermark tile per showcase project, pinned to the bottom.
 *
 * It works like the macOS dock reads — tiles swell toward the cursor, the
 * running-app dot marks the active one — but built from this site's own
 * pieces: Newsreader initials on paper tiles, and the dot is the amber dot,
 * its second sanctioned job after <Mark />.
 *
 * Clicking a tile doesn't launch anything; it slides the carousel to that
 * project. The card up there is what leaves the site.
 */

/** Tile square in px. Magnification scales on top of this. */
const TILE = 48;
/** Peak scale under the cursor. */
const MAG = 1.45;
/** How far the swell reaches, in px of horizontal distance. */
const REACH = 110;

export function Dock({
  projects,
  active,
  onSelect,
}: {
  projects: ShowcaseProject[];
  active: number;
  onSelect: (index: number) => void;
}) {
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [scales, setScales] = useState<number[]>([]);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setScales(
      tileRefs.current.map((el) => {
        if (!el) return 1;
        const r = el.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        return d >= REACH ? 1 : 1 + (MAG - 1) * (1 - d / REACH);
      }),
    );
  };

  return (
    <nav
      aria-label="Showcase projects"
      onPointerMove={onMove}
      onPointerLeave={() => setScales([])}
      className="fixed bottom-5 left-1/2 z-20 flex max-w-[94vw] -translate-x-1/2 items-end gap-2 overflow-x-auto rounded-2xl border border-rule bg-paper px-3 pt-2 pb-[0.55rem] shadow-[0_8px_28px_rgb(0_0_0/0.14)]"
    >
      {projects.map((p, i) => (
        <button
          key={p.slug}
          ref={(el) => {
            tileRefs.current[i] = el;
          }}
          type="button"
          aria-label={p.name}
          aria-current={i === active ? "true" : undefined}
          onClick={() => onSelect(i)}
          style={{
            width: TILE,
            height: TILE,
            transform: `scale(${scales[i] ?? 1})`,
          }}
          className="group relative shrink-0 cursor-pointer rounded-xl border border-rule bg-paper-raised text-[1.35rem] font-medium text-ink transition-transform duration-100 ease-out [transform-origin:bottom]"
        >
          {p.name[0]}
          {/* The macOS hover label: the name, floating above the tile. */}
          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md border border-rule bg-paper px-2 py-1 text-[0.72rem] leading-none font-normal whitespace-nowrap opacity-0 shadow-[0_2px_12px_rgb(0_0_0/0.10)] transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
            {p.name}
          </span>
          {/* The running-app dot, in the only colour it's allowed to be. */}
          <span
            className={`absolute -bottom-[7px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-colors duration-200 ${
              i === active ? "bg-dot" : "bg-transparent"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
