"use client";

import { useEffect, useId, useState } from "react";
import { BreatheRoom } from "@/components/breathe/breathe-room";
import "./site-toolbar.css";

/**
 * Site tools - one quiet bar, bottom-left. Breathe, and room for more.
 * Shell only: tool state + dismiss. Panels own their own UI.
 */

type Tool = "breathe";

const TOOL: Record<Tool, { dismissOnOutside: boolean; trapScroll: boolean }> = {
  breathe: { dismissOnOutside: false, trapScroll: true },
};

export function SiteToolbar() {
  const breatheId = useId();
  const [tool, setTool] = useState<Tool | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // The inline script in the layout already applied any stored choice.
    if (document.documentElement.dataset.theme === "light") setTheme("light");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") {
      document.documentElement.dataset.theme = "light";
    } else {
      delete document.documentElement.dataset.theme;
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "light" ? "#ffffff" : "#000000");
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    function onChange() {
      setReducedMotion(mq.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!tool) return;
    const { dismissOnOutside, trapScroll } = TOOL[tool];

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setTool(null);
    }

    function onClick(e: MouseEvent) {
      if (!(e.target instanceof Element)) return;
      if (!e.target.closest("[data-site-toolbar]")) setTool(null);
    }

    document.addEventListener("keydown", onKey);
    if (dismissOnOutside) document.addEventListener("click", onClick);

    const prevOverflow = trapScroll ? document.body.style.overflow : null;
    if (trapScroll) document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      if (dismissOnOutside) document.removeEventListener("click", onClick);
      if (prevOverflow !== null) document.body.style.overflow = prevOverflow;
    };
  }, [tool]);

  function closeTool() {
    setTool(null);
  }

  function openTool(next: Tool) {
    setTool((current) => (current === next ? null : next));
  }

  return (
    <div
      data-site-toolbar
      className="fixed bottom-[1.35rem] left-[1.35rem] z-30 flex flex-col items-start"
    >
      {tool === "breathe" ? (
        <BreatheRoom
          id={breatheId}
          onClose={closeTool}
          reducedMotion={reducedMotion}
        />
      ) : null}

      <nav
        aria-label="Site tools"
        className="inline-flex items-center gap-0 rounded-[12px] border border-rule bg-paper px-1 py-1 shadow-[0_2px_12px_rgb(0_0_0/0.10)]"
      >
        <button
          type="button"
          aria-expanded={tool === "breathe"}
          aria-controls={breatheId}
          onClick={() => openTool("breathe")}
          className={`relative cursor-pointer rounded-[9px] border-0 bg-transparent px-3 py-1.5 font-sans text-[0.82rem] tracking-[0.01em] transition-colors ${
            tool === "breathe"
              ? "text-accent"
              : "text-ink-muted hover:text-accent"
          }`}
        >
          {!reducedMotion && tool !== "breathe" ? (
            <span
              className="toolbar-pulse absolute top-[0.45rem] right-[0.35rem] h-[0.35rem] w-[0.35rem] rounded-full bg-dot"
              aria-hidden
            />
          ) : null}
          breathe
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-pressed={theme === "light"}
          aria-label={`Switch to the ${theme === "dark" ? "light" : "dark"} theme`}
          className="cursor-pointer rounded-[9px] border-0 bg-transparent px-3 py-1.5 font-sans text-[0.82rem] tracking-[0.01em] text-ink-muted transition-colors hover:text-accent"
        >
          {theme === "dark" ? "light" : "dark"}
        </button>
      </nav>
    </div>
  );
}
