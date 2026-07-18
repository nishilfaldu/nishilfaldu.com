"use client";

import {
  PREVIEW_STATUS_LABEL,
  PREVIEWS,
  type Preview,
} from "@/components/previews";

/**
 * WIP Vercel previews — panel for the site toolbar’s “cooking” tool.
 * Lists every branch in flight; empty `PREVIEWS` means the tool isn’t shown.
 */
export function CookingPanel({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  return (
    <div
      id={id}
      className="mb-2 w-[min(24rem,calc(100vw-3rem))] max-h-[min(70vh,32rem)] overflow-y-auto rounded-xl border border-rule bg-paper p-4 shadow-[0_8px_28px_rgb(0_0_0/0.14)]"
    >
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p className="m-0 text-[0.82rem] tracking-[0.04em] text-ink-muted uppercase">
          In the works
        </p>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.82rem] text-ink-muted hover:text-ink"
        >
          Close
        </button>
      </div>
      <p className="mb-4 text-[0.92rem] leading-snug text-ink-muted">
        Live Vercel previews of branches that haven’t landed yet.
      </p>
      <ul className="m-0 list-none p-0">
        {PREVIEWS.map((p) => (
          <CookingItem key={p.branch} preview={p} />
        ))}
      </ul>
    </div>
  );
}

function CookingItem({ preview }: { preview: Preview }) {
  return (
    <li className="border-t border-rule py-4 first:border-t-0 first:pt-0 last:pb-0">
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
          <span className="shrink-0 text-[0.82rem] text-accent">Preview ↗</span>
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
