"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/components/projects";

/**
 * The hover card behind every project link.
 *
 * Linger on a link and a small card floats up: the repo's social-card image,
 * the short name, one line on why it exists, all of it a link to the repo. The
 * essay stays the way in — this is a look before you leave, not a grid.
 *
 * Mouse-only by design. Touch has no hover, so a tap keeps doing what it
 * always did and follows the link; nothing here ever intercepts a click. The
 * card opens on keyboard focus too, but as a picture, not a stop: it's
 * aria-hidden and its link is untabbable, because the link under focus is
 * already the same destination.
 */

/** Card width in px. Image height follows from GitHub's 1200×630 cards. */
const WIDTH = 300;
/** Gap between the link's line box and the card. */
const GAP = 10;
/** Hover intent: how long the cursor rests before the card appears. */
const OPEN_DELAY = 250;
/** Grace period to travel from link to card without it closing underfoot. */
const CLOSE_DELAY = 150;

export function ProjectPreview({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  // Once opened, the card stays mounted so the image survives in cache.
  const [everOpened, setEverOpened] = useState(false);
  // GitHub's card CDN rate-limits; a broken-image icon is worse than no image,
  // so on error the card quietly becomes words only.
  const [imgFailed, setImgFailed] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number; above: boolean }>({
    x: 0,
    y: 0,
    above: true,
  });

  const wrapRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);

  const show = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
    setEverOpened(true);
  }, []);

  const hide = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    setOpen(false);
  }, []);

  /*
   * Fixed positioning, measured after render. A prose link can wrap across
   * two lines, so its bounding box is the wrong anchor — the first line box
   * (getClientRects) is where the reader's cursor actually is.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies(imgFailed): dropping the image changes the card's height, so the position must be re-measured
  useLayoutEffect(() => {
    if (!open) return;
    const anchor = wrapRef.current?.getClientRects()[0];
    const card = cardRef.current;
    if (!anchor || !card) return;

    const h = card.offsetHeight;
    const above = anchor.top - GAP - h >= 8;
    const x = Math.min(
      Math.max(8, anchor.left + anchor.width / 2 - WIDTH / 2),
      window.innerWidth - WIDTH - 8,
    );
    const y = above ? anchor.top - GAP - h : anchor.bottom + GAP;
    setPos({ x, y, above });
  }, [open, imgFailed]);

  // A fixed card can't follow the text, so scrolling dismisses it. Escape too.
  useLayoutEffect(() => {
    if (!open) return;
    const onScroll = () => hide();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, hide]);

  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(show, OPEN_DELAY);
  };

  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the interactive element is the child link; this span only watches its hover and focus to time the card
    <span
      ref={wrapRef}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {everOpened && (
        <span
          // A span, because it lives inside a <p> where a <div> is invalid.
          ref={cardRef as React.Ref<HTMLSpanElement>}
          aria-hidden="true"
          style={{ left: pos.x, top: pos.y, width: WIDTH }}
          className={`fixed z-30 block overflow-hidden rounded-xl border border-rule bg-paper shadow-[0_8px_28px_rgb(0_0_0/0.14)] transition-[opacity,transform] duration-200 ${
            open
              ? "translate-y-0 opacity-100"
              : `pointer-events-none opacity-0 ${pos.above ? "translate-y-1" : "-translate-y-1"}`
          }`}
        >
          <a
            href={`https://github.com/nishilfaldu/${project.repo}`}
            tabIndex={-1}
            className="block no-underline"
          >
            {/* GitHub's auto-generated social card; the ratio box keeps the
                card from jumping while it loads. */}
            {!imgFailed && (
              <span className="block aspect-[1200/630] w-full border-b border-rule bg-paper-raised">
                {/* biome-ignore lint/performance/noImgElement: one remote image, already CDN-sized by GitHub */}
                <img
                  src={`https://opengraph.githubassets.com/1/nishilfaldu/${project.repo}`}
                  alt=""
                  width={1200}
                  height={630}
                  onError={() => setImgFailed(true)}
                  className="block h-full w-full object-cover"
                />
              </span>
            )}
            <span className="block px-4 py-3">
              <span className="block text-[0.86rem] font-medium tracking-[0.01em] text-ink">
                {project.label}
                <span className="text-ink-muted"> · github</span>
              </span>
              <span className="mt-0.5 block text-[0.8rem] leading-snug text-ink-muted">
                {project.blurb}
              </span>
            </span>
          </a>
        </span>
      )}
    </span>
  );
}
