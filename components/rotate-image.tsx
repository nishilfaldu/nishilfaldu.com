"use client";

import { useEffect, useState } from "react";

/**
 * Cycles through a set of screenshots one at a time, crossfading.
 * Pauses on hover, never starts for reduced-motion users.
 */
export function RotateImage({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      3200,
    );
    return () => window.clearInterval(id);
  }, [paused, images.length]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover only pauses the decorative cycling
    <span
      className="relative block h-full w-full bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        // biome-ignore lint/performance/noImgElement: small static showcase stills
        <img
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          loading={i < 2 ? "eager" : "lazy"}
          aria-hidden={i !== index}
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
    </span>
  );
}
