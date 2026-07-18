"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  PREVIEW_STATUS_LABEL,
  PREVIEWS,
  type Preview,
} from "@/components/previews";

/**
 * WIP preview status, living inside the home links line — not a third section,
 * not another footer destination. When something’s cooking, a quiet label
 * sits with Projects / Writings / …; open it for the preview links.
 */
export function CookingStatus() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  if (PREVIEWS.length === 0) return null;

  const label =
    PREVIEWS.length === 1 ? "cooking" : `${PREVIEWS.length} cooking`;

  return (
    <span ref={rootRef} className="relative inline-block whitespace-nowrap">
      <span aria-hidden>{" · "}</span>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={
          open
            ? "Hide what’s cooking"
            : `What’s cooking: ${PREVIEWS.length} preview${PREVIEWS.length === 1 ? "" : "s"}`
        }
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-pointer items-baseline gap-1.5 border-0 bg-transparent p-0 font-sans text-[1em] leading-[inherit] tracking-[0.01em] text-ink-muted transition-colors hover:text-accent"
      >
        <span
          aria-hidden
          className={`inline-block h-1.5 w-1.5 shrink-0 translate-y-[-0.05em] rounded-full bg-dot ${
            open ? "" : "animate-pulse"
          }`}
        />
        {label}
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute bottom-[calc(100%+0.65rem)] left-1/2 z-20 w-[min(22rem,calc(100vw-3rem))] -translate-x-1/2 rounded-xl border border-rule bg-paper p-4 text-left shadow-[0_8px_28px_rgb(0_0_0/0.14)] sm:left-auto sm:right-0 sm:translate-x-0"
        >
          <p className="mb-3 text-[0.82rem] tracking-[0.04em] text-ink-muted uppercase">
            In the works
          </p>
          <ul className="m-0 list-none p-0">
            {PREVIEWS.map((p) => (
              <CookingItem key={p.branch} preview={p} />
            ))}
          </ul>
        </div>
      ) : null}
    </span>
  );
}

function CookingItem({ preview }: { preview: Preview }) {
  return (
    <li className="border-t border-rule py-3 first:border-t-0 first:pt-0 last:pb-0">
      <a
        href={preview.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block no-underline text-ink"
      >
        <span className="flex items-baseline justify-between gap-3">
          <span className="font-medium tracking-[0.01em] transition-colors group-hover:text-accent">
            {preview.title}
          </span>
          <span className="shrink-0 text-[0.82rem] text-accent">↗</span>
        </span>
        <span className="mt-1.5 block text-[0.92rem] leading-snug text-ink-muted">
          {preview.note}
        </span>
      </a>
      <span className="mt-2 flex flex-wrap items-baseline gap-x-2 text-[0.78rem] text-ink-muted">
        <span className="uppercase tracking-[0.04em]">
          {PREVIEW_STATUS_LABEL[preview.status]}
        </span>
        <span aria-hidden className="text-rule">
          ·
        </span>
        <span className="font-mono text-[0.72rem]">{preview.branch}</span>
      </span>
    </li>
  );
}
