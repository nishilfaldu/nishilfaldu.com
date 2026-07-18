"use client";

import { useEffect, useState } from "react";
import { Mark } from "@/components/mark";
import { ProseLink } from "@/components/prose-link";
import { BOOK, type WritingLeaf } from "@/components/writings";
import "./writings-book.css";

/**
 * One book: open spread on wider screens, a single leaf on small ones.
 * Turn with the edges, the buttons, or the arrow keys.
 */
export function WritingsBook() {
  const leaves = BOOK.leaves;
  const lastIndex = Math.max(0, leaves.length - 1);

  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [spread, setSpread] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 40rem)");
    setReducedMotion(motion.matches);
    setSpread(wide.matches);

    function onMotion() {
      setReducedMotion(motion.matches);
    }
    function onWide() {
      setSpread(wide.matches);
    }

    motion.addEventListener("change", onMotion);
    wide.addEventListener("change", onWide);
    return () => {
      motion.removeEventListener("change", onMotion);
      wide.removeEventListener("change", onWide);
    };
  }, []);

  useEffect(() => {
    if (!spread) return;
    setIndex((i) => i - (i % 2));
  }, [spread]);

  const step = spread ? 2 : 1;
  const leftIndex = spread ? index - (index % 2) : index;
  const rightIndex = spread ? leftIndex + 1 : -1;
  const left = leaves[leftIndex];
  const right =
    rightIndex >= 0 && rightIndex <= lastIndex ? leaves[rightIndex] : undefined;
  const atStart = leftIndex <= 0;
  const atEnd = spread ? leftIndex + step > lastIndex : leftIndex >= lastIndex;

  function jump(next: number) {
    const clamped = Math.max(0, Math.min(lastIndex, next));
    const aligned = spread ? clamped - (clamped % 2) : clamped;
    setIndex(aligned);
    setTick((t) => t + 1);
  }

  function go(direction: 1 | -1) {
    jump(leftIndex + direction * step);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      let next: number | null = null;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        next = leftIndex + step;
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        next = leftIndex - step;
      } else if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = lastIndex;
      }
      if (next === null) return;
      e.preventDefault();
      const clamped = Math.max(0, Math.min(lastIndex, next));
      const aligned = spread ? clamped - (clamped % 2) : clamped;
      setIndex(aligned);
      setTick((t) => t + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leftIndex, step, lastIndex, spread]);

  return (
    <main className="mx-auto max-w-[52rem] px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <div className="max-w-measure">
        <a href="/" aria-label="Home" className="inline-block no-underline">
          <Mark className="mb-10" />
        </a>
        <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">
          {BOOK.title}
        </h1>
        <p className="mb-10 text-ink-muted">
          {BOOK.blurb} <ProseLink href="/">Back to the story</ProseLink>.
        </p>
      </div>

      <div className="relative mx-auto w-full [perspective:1600px]">
        <div
          key={`${leftIndex}-${tick}`}
          className={`grid min-h-[28rem] grid-cols-1 overflow-hidden rounded-sm border border-rule bg-paper-raised sm:min-h-[32rem] sm:grid-cols-[1fr_1px_1fr]${
            reducedMotion ? "" : " book-spread-enter"
          }`}
          aria-live="polite"
        >
          {spread ? (
            <>
              <LeafFace leaf={left} side="left" blank={!left} />
              <div className="bg-rule" aria-hidden />
              <LeafFace leaf={right} side="right" blank={!right} />
            </>
          ) : (
            <LeafFace leaf={left} side="single" blank={!left} />
          )}
        </div>

        <button
          type="button"
          aria-label="Previous page"
          disabled={atStart}
          onClick={() => go(-1)}
          className="absolute top-0 bottom-0 left-0 z-1 w-[18%] max-w-[5.5rem] cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default hover:enabled:bg-linear-to-l hover:enabled:from-transparent hover:enabled:to-accent/5"
        />
        <button
          type="button"
          aria-label="Next page"
          disabled={atEnd}
          onClick={() => go(1)}
          className="absolute top-0 right-0 bottom-0 z-1 w-[18%] max-w-[5.5rem] cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default hover:enabled:bg-linear-to-r hover:enabled:from-transparent hover:enabled:to-accent/5"
        />
      </div>

      <div className="mx-auto mt-8 flex max-w-measure flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:max-w-none">
        <div className="flex items-center gap-x-4">
          <button
            type="button"
            disabled={atStart}
            onClick={() => go(-1)}
            className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] font-medium text-accent hover:text-ink disabled:cursor-default disabled:text-ink-muted disabled:opacity-40"
          >
            ← Previous
          </button>
          <button
            type="button"
            disabled={atEnd}
            onClick={() => go(1)}
            className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] font-medium text-accent hover:text-ink disabled:cursor-default disabled:text-ink-muted disabled:opacity-40"
          >
            Next →
          </button>
        </div>
        <p className="m-0 text-[0.88rem] text-ink-muted tabular-nums">
          {spread
            ? right
              ? `${leftIndex + 1}–${rightIndex + 1} of ${leaves.length}`
              : `${leftIndex + 1} of ${leaves.length}`
            : `${leftIndex + 1} of ${leaves.length}`}
        </p>
      </div>
    </main>
  );
}

function LeafFace({
  leaf,
  side,
  blank,
}: {
  leaf: WritingLeaf | undefined;
  side: "left" | "right" | "single";
  blank: boolean;
}) {
  const leafSide =
    side === "left"
      ? " book-leaf-left"
      : side === "right"
        ? " book-leaf-right"
        : "";

  return (
    <article
      className={`relative min-h-[28rem] px-6 pt-7 pb-8 sm:min-h-[32rem] sm:px-8 sm:pt-9 sm:pb-10${
        blank ? " bg-paper-raised" : " bg-paper"
      }${leafSide}`}
    >
      {leaf && !blank ? <LeafBody leaf={leaf} /> : null}
    </article>
  );
}

function LeafBody({ leaf }: { leaf: WritingLeaf }) {
  if (leaf.form === "title") {
    return (
      <div className="flex h-full flex-col items-center justify-center px-2 text-center">
        {leaf.lines.map((line, i) => (
          <p
            key={`${leaf.slug}-${i}`}
            className={
              i === 0
                ? "m-0 text-[1.45rem] font-medium tracking-[0.01em] text-ink sm:text-[1.6rem]"
                : "mt-3 m-0 text-[1.02rem] tracking-[0.02em] text-ink-muted"
            }
          >
            {line}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {leaf.heading ? (
        <p className="mb-5 text-[0.82rem] tracking-[0.06em] text-ink-muted uppercase">
          {leaf.heading}
        </p>
      ) : null}
      {leaf.form === "verse" ? (
        <div className="text-[1.08rem] leading-[1.75] tracking-[0.005em]">
          {leaf.lines.map((line, i) => (
            <p key={`${leaf.slug}-${i}`} className="m-0">
              {line || "\u00a0"}
            </p>
          ))}
        </div>
      ) : (
        <div className="text-[1.05rem] leading-[1.7]">
          {leaf.lines.map((paragraph, i) => (
            <p key={`${leaf.slug}-${i}`} className="m-0 mb-[1.05em] last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
