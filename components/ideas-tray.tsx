"use client";

import { useEffect, useState } from "react";
import { Mark } from "@/components/mark";
import { ProseLink } from "@/components/prose-link";
import {
  IDEA_STATUS_LABEL,
  type Idea,
  IDEAS,
} from "@/components/ideas";

/**
 * One idea in focus, a short index to jump, and a “draw another” shuffle.
 * Fun enough to poke — still a quiet page, not a dashboard.
 */
export function IdeasTray() {
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    function onChange() {
      setReducedMotion(mq.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const idea = IDEAS[index] ?? IDEAS[0];
  if (!idea) {
    return (
      <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
        <Mark className="mb-10" />
        <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">Ideas</h1>
        <p className="text-ink-muted">Nothing in the tray yet.</p>
      </main>
    );
  }

  function select(i: number) {
    setIndex(i);
    setTick((t) => t + 1);
  }

  function drawAnother() {
    if (IDEAS.length < 2) {
      setTick((t) => t + 1);
      return;
    }
    let next = index;
    while (next === index) {
      next = Math.floor(Math.random() * IDEAS.length);
    }
    select(next);
  }

  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <a href="/" aria-label="Home" className="inline-block no-underline">
        <Mark className="mb-10" />
      </a>

      <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">Ideas</h1>
      <p className="mb-10 text-ink-muted">
        Open loops I’m willing to put on the site — not a notes dump. Draw one,
        sit with it, or jump the list.{" "}
        <ProseLink href="/">Back to the story</ProseLink>.
      </p>

      <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-12">
        <nav
          aria-label="Ideas in the tray"
          className="sm:w-[9.5rem] sm:shrink-0"
        >
          <p className="mb-3 text-[0.8rem] tracking-[0.04em] text-ink-muted uppercase">
            In the tray
          </p>
          <ol className="m-0 list-none p-0">
            {IDEAS.map((item, i) => (
              <li key={item.slug} className="mb-2 last:mb-0">
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-current={i === index ? "true" : undefined}
                  className={`group flex w-full cursor-pointer items-baseline gap-2 border-0 bg-transparent p-0 text-left font-sans text-[0.95rem] transition-colors ${
                    i === index
                      ? "text-ink"
                      : "text-ink-muted hover:text-accent"
                  }`}
                >
                  <span
                    className={`mt-[0.35em] inline-block h-1.5 w-1.5 shrink-0 rounded-full transition-transform ${
                      i === index
                        ? "bg-dot scale-110"
                        : "bg-rule group-hover:bg-accent"
                    }`}
                    aria-hidden
                  />
                  <span className="leading-snug tracking-[0.01em]">
                    {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <section className="min-w-0 flex-1" aria-live="polite">
          <IdeaFocus
            key={`${idea.slug}-${tick}`}
            idea={idea}
            animate={!reducedMotion}
          />

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={drawAnother}
              className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] font-medium text-accent hover:text-ink"
            >
              {IDEAS.length < 2 ? "Nudge this one →" : "Draw another →"}
            </button>
            <span className="text-[0.88rem] text-ink-muted">
              {index + 1} of {IDEAS.length}
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

function IdeaFocus({ idea, animate }: { idea: Idea; animate: boolean }) {
  return (
    <article
      className={
        animate
          ? "ideas-focus-enter border-t border-rule pt-6"
          : "border-t border-rule pt-6"
      }
    >
      <p className="mb-3 text-[0.88rem] tracking-[0.02em] text-ink-muted">
        {IDEA_STATUS_LABEL[idea.status]}
      </p>
      <h2 className="m-0 mb-4 text-[1.35rem] font-medium tracking-[0.01em] text-ink">
        {idea.title}
      </h2>
      <p className="m-0 text-[1.05rem] leading-relaxed text-ink">{idea.body}</p>
    </article>
  );
}
