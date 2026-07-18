"use client";

import type { CookingItem } from "@/lib/cooking/types";

/**
 * WIP previews — panel for the site toolbar’s “cooking” tool.
 * Items come from `/api/cooking` (open PRs + GitHub Preview deployments).
 */
export function CookingPanel({
  id,
  onClose,
  items,
}: {
  id: string;
  onClose: () => void;
  items: CookingItem[];
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
        Live previews of open PRs that haven’t landed yet.
      </p>
      <ul className="m-0 list-none p-0">
        {items.map((item) => (
          <CookingRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function CookingRow({ item }: { item: CookingItem }) {
  const href = item.url ?? item.prUrl;
  const linkLabel =
    item.status === "ready" && item.url
      ? "Preview ↗"
      : item.status === "building"
        ? "Building…"
        : "PR ↗";

  return (
    <li className="border-t border-rule py-4 first:border-t-0 first:pt-0 last:pb-0">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block no-underline text-ink"
      >
        <span className="flex items-baseline justify-between gap-3">
          <span className="font-medium tracking-[0.01em] transition-colors group-hover:text-accent">
            {item.title}
          </span>
          <span className="shrink-0 text-[0.82rem] text-accent">
            {linkLabel}
          </span>
        </span>
        {item.note ? (
          <span className="mt-1.5 block text-[0.92rem] leading-snug text-ink-muted">
            {item.note}
          </span>
        ) : null}
      </a>
      <span className="mt-2 flex flex-wrap items-baseline gap-x-2 text-[0.78rem] text-ink-muted">
        <span className="uppercase tracking-[0.04em]">{item.status}</span>
        <span aria-hidden className="text-rule">
          ·
        </span>
        <span>{item.project}</span>
        <span aria-hidden className="text-rule">
          ·
        </span>
        <span className="font-mono text-[0.72rem]">{item.branch}</span>
      </span>
    </li>
  );
}
