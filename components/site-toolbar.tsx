"use client";

import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { BreatheSession } from "@/components/breathe/breathe-session";

/**
 * Site tools — one quiet bar, bottom-left. Report, breathe, and room for more.
 * Not separate floating widgets fighting the corners.
 */

const REPO_ISSUES_NEW =
  "https://github.com/nishilfaldu/nishilfaldu.com/issues/new";
const MAX_NOTE_CHARS = 3500;

type Tool = "report" | "breathe" | null;

function pageUrl(pathname: string) {
  return `${window.location.origin}${pathname}${window.location.hash}`;
}

function issueTitle(pathname: string, note: string) {
  const trimmed = note.trim().replace(/\s+/g, " ");
  const excerpt = trimmed.slice(0, 72);
  if (!excerpt) return `Feedback on ${pathname}`;
  return excerpt.length < trimmed.length ? `${excerpt}…` : excerpt;
}

function issueBody(pathname: string, note: string) {
  return `**Page:** ${pageUrl(pathname)}

${note.trim()}
`;
}

function githubIssueUrl(pathname: string, note: string) {
  const url = new URL(REPO_ISSUES_NEW);
  url.searchParams.set("title", issueTitle(pathname, note));
  url.searchParams.set("body", issueBody(pathname, note));
  return url.toString();
}

export function SiteToolbar() {
  const pathname = usePathname();
  const reportId = useId();
  const breatheId = useId();
  const [tool, setTool] = useState<Tool>(null);
  const [note, setNote] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (tool !== "report") return;
    textareaRef.current?.focus();

    function onClick(e: MouseEvent) {
      if (!(e.target as Element).closest("[data-site-toolbar]")) {
        setTool(null);
        setNote("");
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [tool]);

  useEffect(() => {
    if (!tool) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setTool(null);
        setNote("");
      }
    }

    document.addEventListener("keydown", onKey);
    const prev = tool === "breathe" ? document.body.style.overflow : null;
    if (tool === "breathe") document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      if (prev !== null) document.body.style.overflow = prev;
    };
  }, [tool]);

  function closeTool() {
    setTool(null);
    setNote("");
  }

  function openTool(next: Exclude<Tool, null>) {
    setTool((current) => (current === next ? null : next));
    if (next !== "report") setNote("");
  }

  function submitReport(e: FormEvent) {
    e.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) {
      textareaRef.current?.focus();
      return;
    }
    window.open(
      githubIssueUrl(pathname, trimmed),
      "_blank",
      "noopener,noreferrer",
    );
    closeTool();
  }

  return (
    <div data-site-toolbar className="site-toolbar">
      {tool === "report" ? (
        <form
          id={reportId}
          onSubmit={submitReport}
          className="site-toolbar-panel mb-2 w-[min(22rem,calc(100vw-3rem))] rounded-xl border border-rule bg-paper p-4 shadow-[0_8px_28px_rgb(0_0_0/0.14)]"
        >
          <label
            htmlFor={`${reportId}-note`}
            className="mb-2 block text-[0.92rem] text-ink-muted"
          >
            What’s wrong or missing?
          </label>
          <textarea
            ref={textareaRef}
            id={`${reportId}-note`}
            name="note"
            rows={4}
            maxLength={MAX_NOTE_CHARS}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A typo, a broken link, something unclear…"
            className="mb-3 w-full resize-y rounded-[10px] border border-rule bg-paper px-3 py-2 font-sans text-[1rem] leading-snug text-ink placeholder:text-ink-muted/60 focus-visible:outline-none"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.82rem] text-ink-muted">
              Opens GitHub to finish.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeTool}
                className="cursor-pointer rounded-[10px] px-3 py-1.5 text-[0.92rem] text-ink-muted hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-[10px] border border-rule bg-paper px-3 py-1.5 text-[0.92rem] text-accent hover:border-accent"
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      ) : null}

      {tool === "breathe" ? (
        <div
          id={breatheId}
          role="dialog"
          aria-modal="true"
          aria-label="Breathe"
          className="fixed inset-0 z-40 flex items-center justify-center bg-paper/92 p-6 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeTool();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeTool();
          }}
        >
          <div
            className={`w-full max-w-sm${
              reducedMotion ? "" : " breathe-room-enter"
            }`}
          >
            <BreatheSession onClose={closeTool} />
          </div>
        </div>
      ) : null}

      <nav
        aria-label="Site tools"
        className="site-toolbar-bar inline-flex items-center gap-0 rounded-[12px] border border-rule bg-paper px-1 py-1 shadow-[0_2px_12px_rgb(0_0_0/0.10)]"
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
      </nav>
    </div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
  ariaControls,
  pulse,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  ariaControls: string;
  pulse?: boolean;
}) {
  return (
    <button
      type="button"
      aria-expanded={active}
      aria-controls={ariaControls}
      onClick={onClick}
      className={`site-toolbar-btn relative cursor-pointer rounded-[9px] border-0 bg-transparent px-3 py-1.5 font-sans text-[0.82rem] tracking-[0.01em] transition-colors ${
        active ? "text-accent" : "text-ink-muted hover:text-accent"
      }`}
    >
      {pulse ? <span className="site-toolbar-pulse" aria-hidden /> : null}
      {children}
    </button>
  );
}
