"use client";

import { useEffect, useId, useState } from "react";
import { BreatheRoom } from "@/components/breathe/breathe-room";
import { CookingPanel } from "@/components/cooking-panel";
import { PREVIEWS } from "@/components/previews";
import { ReportPanel } from "@/components/report-panel";
import "./site-toolbar.css";

/**
 * Site tools — one quiet bar, bottom-left. Report, breathe, cooking (when
 * something’s in flight), and room for more. Shell only: tool state + dismiss.
 * Panels own their own UI.
 */

type Tool = "report" | "breathe" | "cooking";

const TOOL: Record<Tool, { dismissOnOutside: boolean; trapScroll: boolean }> = {
  report: { dismissOnOutside: true, trapScroll: false },
  breathe: { dismissOnOutside: false, trapScroll: true },
  cooking: { dismissOnOutside: true, trapScroll: false },
};

export function SiteToolbar() {
  const reportId = useId();
  const breatheId = useId();
  const cookingId = useId();
  const [tool, setTool] = useState<Tool | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hasCooking = PREVIEWS.length > 0;

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
      {tool === "report" ? (
        <ReportPanel id={reportId} onClose={closeTool} />
      ) : null}

      {tool === "breathe" ? (
        <BreatheRoom
          id={breatheId}
          onClose={closeTool}
          reducedMotion={reducedMotion}
        />
      ) : null}

      {tool === "cooking" && hasCooking ? (
        <CookingPanel id={cookingId} onClose={closeTool} />
      ) : null}

      <nav
        aria-label="Site tools"
        className="inline-flex items-center gap-0 rounded-[12px] border border-rule bg-paper px-1 py-1 shadow-[0_2px_12px_rgb(0_0_0/0.10)]"
      >
        <ToolbarButton
          active={tool === "report"}
          ariaControls={reportId}
          onClick={() => openTool("report")}
        >
          report
        </ToolbarButton>
        <span className="px-0.5 text-rule select-none" aria-hidden>
          ·
        </span>
        <ToolbarButton
          active={tool === "breathe"}
          ariaControls={breatheId}
          onClick={() => openTool("breathe")}
          pulse={!reducedMotion && tool !== "breathe"}
        >
          breathe
        </ToolbarButton>
        {hasCooking ? (
          <>
            <span className="px-0.5 text-rule select-none" aria-hidden>
              ·
            </span>
            <ToolbarButton
              active={tool === "cooking"}
              ariaControls={cookingId}
              onClick={() => openTool("cooking")}
              pulse={!reducedMotion && tool !== "cooking"}
              ariaLabel={`What’s cooking: ${PREVIEWS.length} preview${PREVIEWS.length === 1 ? "" : "s"}`}
            >
              cooking
            </ToolbarButton>
          </>
        ) : null}
      </nav>
    </div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
  ariaControls,
  ariaLabel,
  pulse,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  ariaControls: string;
  ariaLabel?: string;
  pulse?: boolean;
}) {
  return (
    <button
      type="button"
      aria-expanded={active}
      aria-controls={ariaControls}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`relative cursor-pointer rounded-[9px] border-0 bg-transparent px-3 py-1.5 font-sans text-[0.82rem] tracking-[0.01em] transition-colors ${
        active ? "text-accent" : "text-ink-muted hover:text-accent"
      }`}
    >
      {pulse ? (
        <span
          className="toolbar-pulse absolute top-[0.45rem] right-[0.35rem] h-[0.35rem] w-[0.35rem] rounded-full bg-dot"
          aria-hidden
        />
      ) : null}
      {children}
    </button>
  );
}
