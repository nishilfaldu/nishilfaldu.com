"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoopVideo } from "@/components/loop-video";
import { RotateImage } from "@/components/rotate-image";
import type { ShowcaseMedia } from "@/components/showcase-projects";

/**
 * The tile's media, plus a lightbox with a bigger view of it.
 * Open: click / enter / space on the tile. Close: esc, backdrop, or the x.
 * 7West's set becomes a scrollable gallery of every screenshot.
 */
export function MediaLightbox({
  media,
  name,
}: {
  media: ShowcaseMedia;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`View the ${name} preview larger`}
        className="mb-5 block w-full cursor-zoom-in overflow-hidden rounded-lg border border-rule"
      >
        {media.kind === "video" ? (
          <LoopVideo
            src={media.src}
            poster={media.poster}
            ratio={media.ratio}
          />
        ) : media.kind === "rotate" ? (
          <span className="block" style={{ aspectRatio: media.ratio }}>
            <RotateImage images={media.images} alt={media.alt} />
          </span>
        ) : (
          // biome-ignore lint/performance/noImgElement: small static showcase still, aspect-ratio kept in style
          <img
            src={media.src}
            alt={media.alt}
            style={{ aspectRatio: media.ratio }}
            className="block h-auto w-full object-cover"
          />
        )}
      </button>

      {open ? (
        // biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: the scrim is a click-to-close backdrop; esc and the close button cover keyboard
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8"
          onClick={close}
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: click only stops propagation so the backdrop close does not fire; esc and the close button cover keyboard */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${name}, enlarged preview`}
            className="relative flex max-h-full flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close preview"
              className="absolute -top-9 right-0 text-2xl leading-none text-white/70 transition-colors hover:text-white"
            >
              ×
            </button>

            {media.kind === "video" ? (
              <div className="w-[min(1100px,92vw)] overflow-hidden rounded-lg">
                <LoopVideo
                  src={media.src}
                  poster={media.poster}
                  ratio={media.ratio}
                />
              </div>
            ) : media.kind === "rotate" ? (
              <ScreenshotGallery images={media.images} />
            ) : (
              // biome-ignore lint/performance/noImgElement: enlarged still
              <img
                src={media.src}
                alt={media.alt}
                className="max-h-[85vh] w-auto max-w-[92vw] rounded-lg"
              />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

/**
 * One screenshot at a time, swipe / drag / arrows through the set.
 * Native snap-scroll does the touch work; chevrons and dots stay quiet.
 */
function ScreenshotGallery({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);

  const go = useCallback((dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-slide]");
    const step = slide ? slide.offsetWidth : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go]);

  const mark = (e: React.UIEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const slide = el.querySelector<HTMLElement>("[data-slide]");
    const step = slide ? slide.offsetWidth : 1;
    setIndex(Math.round(el.scrollLeft / step));
  };

  const chevron =
    "flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-white/80 transition-colors hover:bg-white/25 hover:text-white";

  return (
    <div>
      <div className="relative">
        <section
          ref={trackRef}
          aria-label="7West screenshots, swipe or use the arrows"
          onScroll={mark}
          className="flex w-[min(420px,92vw)] snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src) => (
            <div
              key={src}
              data-slide
              className="flex w-full flex-none snap-center items-center justify-center"
            >
              {/* biome-ignore lint/performance/noImgElement: full-size gallery stills */}
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-[76vh] w-auto max-w-full rounded-lg object-contain"
              />
            </div>
          ))}
        </section>

        {index > 0 ? (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous screenshot"
            className={`${chevron} absolute top-1/2 left-3 -translate-y-1/2`}
          >
            ‹
          </button>
        ) : null}
        {index < images.length - 1 ? (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next screenshot"
            className={`${chevron} absolute top-1/2 right-3 -translate-y-1/2`}
          >
            ›
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Go to screenshot ${i + 1}`}
            onClick={() => {
              const el = trackRef.current;
              const slide = el?.querySelector<HTMLElement>("[data-slide]");
              if (el && slide) {
                el.scrollTo({
                  left: i * slide.offsetWidth,
                  behavior: "smooth",
                });
              }
            }}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === index ? "bg-white" : "bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
