"use client";

import { useEffect, useState } from "react";

/**
 * A quiet stack of dashes, one per project, pinned to the right edge.
 *
 * The essay hides twenty-one projects inside its sentences, which is the point
 * — but it means there's no list to scan. This is the list, without breaking
 * the prose into cards.
 *
 * Order matches reading order, not importance. It's the same story, indexed.
 */
const PROJECTS: [id: string, label: string][] = [
  ["p-save-the-roadster", "C++ game"],
  ["p-ml-deep-learning-courses", "Andrew Ng courses"],
  ["p-bert-sentiment-pytorch", "First model"],
  ["p-insite-factcheck", "Fact checker"],
  ["p-hackathon-stats-dashboard", "Stats dashboard"],
  ["p-campaign-websites", "Campaign sites"],
  ["p-eventure", "Event app"],
  ["p-alterna-canvas", "Canvas"],
  ["p-coursework", "Coursework"],
  ["p-cedar-lang", "Compiler"],
  ["p-lda-models", "Topic model"],
  ["p-easy-rag", "RAG"],
  ["p-vector-search-ecommerce", "Vector search"],
  ["p-smart-reviewer", "News reviewer"],
  ["p-neon-nerdsnipe", "Login agent"],
  ["p-atlas", "Atlas"],
  ["p-sediment", "Sediment"],
  ["p-mcp-servers", "MCP servers"],
  ["p-reachcast", "Raycast extension"],
  ["p-pulse", "Pulse"],
  ["p-belle", "Belle"],
];

/** Where a click or a deep link comes to rest. Matches [id] scroll-margin-top. */
const READING_LINE = 0.3;

export function Toc() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  /*
   * On reload with a fragment, Chrome scrolls to the target *and focuses it*,
   * which draws the focus ring around a word in the middle of a paragraph.
   * Strip the hash before the browser acts on it, scroll there ourselves, then
   * put the hash back without moving focus.
   */
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const el = document.getElementById(id);
    if (!el) return;

    history.replaceState(null, "", window.location.pathname);
    el.scrollIntoView({ block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  }, []);

  /*
   * Light the dash for whichever project sits nearest the reading line. Nearest
   * rather than last-passed, so that when two links share a paragraph the one
   * you clicked is the one that lights up.
   */
  useEffect(() => {
    let queued = false;

    const update = () => {
      queued = false;
      const line = window.innerHeight * READING_LINE;
      let nearest: string | null = null;
      let best = Infinity;

      for (const [id] of PROJECTS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const dist = Math.abs(el.getBoundingClientRect().top - line);
        if (dist < best) {
          best = dist;
          nearest = id;
        }
      }
      setActive(nearest);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Escape closes, and so does a click anywhere that isn't the menu.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-toc]")) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const jump = (e: React.MouseEvent, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    // Scroll it ourselves, for the same reason as the deep-link effect above:
    // letting the browser follow the fragment moves focus and draws the ring.
    e.preventDefault();
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    target.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    });
    history.pushState(null, "", `#${id}`);
    setActive(id);
    setOpen(false);
  };

  return (
    <>
      {/* Below 64rem the stack has nowhere to sit, so it collapses into a
          button — which is itself three dashes, shrunk. */}
      <button
        data-toc
        type="button"
        aria-label="Jump to a project"
        aria-controls="project-nav"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed right-6 bottom-6 z-20 flex cursor-pointer flex-col gap-1 rounded-[10px] border border-rule bg-paper px-3 py-[11px] shadow-[0_2px_12px_rgb(0_0_0/0.10)] lg:hidden"
      >
        <span className="block h-px w-[18px] bg-ink" />
        <span className="block h-px w-[18px] bg-ink" />
        <span className="block h-px w-[18px] bg-ink" />
      </button>

      <nav
        data-toc
        id="project-nav"
        aria-label="Projects"
        className={`fixed right-6 bottom-[5.1rem] z-10 flex max-h-[60vh] max-w-[70vw] flex-col overflow-y-auto rounded-xl border border-rule bg-paper px-[1.15rem] py-[0.8rem] shadow-[0_8px_28px_rgb(0_0_0/0.14)] transition-[opacity,transform] duration-200 lg:top-1/2 lg:right-[1.6rem] lg:bottom-auto lg:max-h-none lg:max-w-none lg:-translate-y-1/2 lg:gap-2 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:opacity-100 lg:shadow-none ${
          open
            ? "translate-y-0 opacity-100"
            : "invisible translate-y-2 opacity-0 lg:visible"
        }`}
      >
        {PROJECTS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => jump(e, id)}
            className="group flex items-center gap-[0.65rem] py-[0.32rem] leading-none text-accent no-underline focus-visible:outline-none lg:justify-end lg:py-0"
          >
            <span
              className={`text-[0.98rem] tracking-[0.01em] whitespace-nowrap transition-[opacity,transform] duration-200 lg:pointer-events-none lg:text-[0.82rem] lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-x-0 lg:group-focus-visible:opacity-100 lg:translate-x-1`}
            >
              {label}
            </span>
            {/* The dash is the whole control on desktop: 16px of rule that
                grows to 28 and turns amber when it's the one you're reading. */}
            <span
              className={`hidden h-[1.5px] shrink-0 transition-[width,background-color] duration-200 lg:block ${
                active === id
                  ? "w-7 bg-accent"
                  : "w-4 bg-rule group-hover:w-7 group-hover:bg-accent group-focus-visible:w-7 group-focus-visible:bg-accent"
              }`}
            />
          </a>
        ))}
      </nav>
    </>
  );
}
