"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  PREVIEW_STATUS_LABEL,
  PREVIEWS,
  type Preview,
} from "@/components/previews";

/**
 * WIP Vercel previews as a site-wide status modal — not a home-footer item.
 * A quiet fixed trigger (above “report”) opens a dialog that can hold several
 * branches in flight. Hidden when `PREVIEWS` is empty.
 */
export function CookingStatus() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) setOpen(false);
    };
    dialog.addEventListener("click", onBackdropClick);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.removeEventListener("click", onBackdropClick);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (PREVIEWS.length === 0) return null;

  const label =
    PREVIEWS.length === 1 ? "cooking" : `${PREVIEWS.length} cooking`;

  return (
    <>
      <div className="fixed bottom-[4.75rem] left-6 z-20">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`What’s cooking: ${PREVIEWS.length} preview${PREVIEWS.length === 1 ? "" : "s"}`}
          onClick={() => setOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-rule bg-paper px-3 py-2 font-sans text-[0.82rem] tracking-[0.01em] text-ink-muted shadow-[0_2px_12px_rgb(0_0_0/0.10)] transition-colors hover:text-accent"
        >
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-dot animate-pulse"
          />
          {label}
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        className="fixed inset-0 m-auto w-[min(28rem,calc(100vw-1.5rem))] max-h-[min(90vh,36rem)] border border-rule bg-paper p-0 text-ink shadow-[0_24px_80px_rgb(0_0_0/0.28)] open:flex open:flex-col backdrop:bg-black/55"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-rule px-5 py-4 sm:px-6">
          <h2
            id={titleId}
            className="m-0 text-[1.05rem] font-medium tracking-[0.01em]"
          >
            In the works
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.92rem] text-ink-muted hover:text-ink"
          >
            Close
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <p className="mb-6 text-[0.95rem] leading-snug text-ink-muted">
            Live Vercel previews of branches that haven’t landed yet.
          </p>
          <ul className="m-0 list-none p-0">
            {PREVIEWS.map((p) => (
              <CookingItem key={p.branch} preview={p} />
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}

function CookingItem({ preview }: { preview: Preview }) {
  return (
    <li className="border-t border-rule py-5 first:border-t-0 first:pt-0 last:pb-0">
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
          <span className="shrink-0 text-[0.92rem] text-accent">Preview ↗</span>
        </span>
        <span className="mt-2 block text-[0.95rem] leading-snug text-ink-muted">
          {preview.note}
        </span>
      </a>
      <span className="mt-2.5 flex flex-wrap items-baseline gap-x-2 text-[0.78rem] text-ink-muted">
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
