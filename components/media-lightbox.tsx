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
              <div className="max-h-[85vh] overflow-y-auto overscroll-contain rounded-lg">
                <div className="flex flex-col items-center gap-6 py-2">
                  {media.images.map((src) => (
                    // biome-ignore lint/performance/noImgElement: full-size gallery stills
                    <img
                      key={src}
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-auto w-[min(420px,82vw)] rounded-lg"
                    />
                  ))}
                </div>
              </div>
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
