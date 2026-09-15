"use client";

/**
 * A muted, looping showcase clip. `muted` goes through the ref because React
 * does not render it as an attribute, and Chrome blocks autoplay without it.
 */
export function LoopVideo({
  src,
  poster,
  ratio,
}: {
  src: string;
  poster: string;
  ratio: string;
}) {
  return (
    <video
      ref={(el) => {
        if (el) el.muted = true;
      }}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster={poster}
      style={{ aspectRatio: ratio }}
      className="block h-auto w-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
