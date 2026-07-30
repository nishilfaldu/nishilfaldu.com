"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Keep } from "@/components/reading/keeps";
import {
  dayLabel,
  domainOf,
  kindOf,
  thumbnailOf,
} from "@/components/reading/presentation";

/**
 * The archive: one board per day, newest day first.
 *
 * Search filters in the browser over the whole list rather than round-tripping
 * to Convex. That's the right trade while the archive fits in a page payload —
 * no latency, no debounce, and results narrow as you type. The search index
 * exists on the table for the day that stops being true.
 */

type Props = {
  keeps: Keep[];
  canEdit: boolean;
};

function matches(keep: Keep, terms: string[]): boolean {
  if (terms.length === 0) return true;
  const haystack = [keep.title, keep.description, keep.note, keep.url]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

function groupByDay(keeps: Keep[]): Array<[string, Keep[]]> {
  const days = new Map<string, Keep[]>();
  for (const keep of keeps) {
    const bucket = days.get(keep.dayId);
    if (bucket) bucket.push(keep);
    else days.set(keep.dayId, [keep]);
  }
  return [...days.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

export function Archive({ keeps, canEdit }: Props) {
  const [query, setQuery] = useState("");
  // Removal is optimistic and lives here, not in the row, so that dropping the
  // last link of a day also drops the day heading and its count.
  const [removed, setRemoved] = useState<ReadonlySet<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (
        event.key === "Escape" &&
        document.activeElement === inputRef.current
      ) {
        setQuery("");
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const terms = useMemo(
    () => query.toLowerCase().split(/\s+/).filter(Boolean),
    [query],
  );
  const days = useMemo(
    () =>
      groupByDay(
        keeps.filter((keep) => !removed.has(keep.id) && matches(keep, terms)),
      ),
    [keeps, terms, removed],
  );

  const found = days.reduce((total, [, items]) => total + items.length, 0);

  function markRemoved(id: string, gone: boolean) {
    setRemoved((current) => {
      const next = new Set(current);
      if (gone) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <>
      <div className="mb-10">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search everything I kept"
          aria-label="Search the archive"
          className="w-full border-0 border-b border-rule bg-transparent pb-2 text-ink outline-none placeholder:text-ink-muted focus:border-accent"
        />
        <p className="mt-2 mb-0 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          {terms.length > 0
            ? `${found} ${found === 1 ? "result" : "results"}`
            : "⌘K"}
        </p>
      </div>

      {days.length === 0 ? (
        <p className="text-ink-muted">
          {keeps.length - removed.size === 0
            ? "Nothing here yet. The first thing worth keeping goes in above."
            : "Nothing matches that. Try one word instead of three."}
        </p>
      ) : (
        days.map(([dayId, items]) => (
          <section key={dayId} className="mb-14">
            <h2 className="sticky top-0 z-10 m-0 flex items-baseline justify-between gap-4 border-b border-rule bg-paper py-2 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-ink-muted">
              <span>{dayLabel(dayId)}</span>
              <span>
                {items.length}
                {/* Otherwise the date and the count run together: "30 Jul 20261". */}
                <span className="sr-only"> kept</span>
              </span>
            </h2>

            <ul className="m-0 list-none p-0">
              {items.map((keep) => (
                <li key={keep.id}>
                  <KeepRow
                    keep={keep}
                    canEdit={canEdit}
                    onRemoved={markRemoved}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  );
}

function KeepRow({
  keep,
  canEdit,
  onRemoved,
}: {
  keep: Keep;
  canEdit: boolean;
  onRemoved: (id: string, gone: boolean) => void;
}) {
  const domain = domainOf(keep.url);
  const kind = kindOf(keep.url);
  const thumbnail = thumbnailOf(keep.url, keep.thumbnail);

  async function remove() {
    onRemoved(keep.id, true);
    const response = await fetch("/api/keeps", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: keep.id }),
    });
    // Put it back if the server disagreed — the row was never really gone.
    if (!response.ok) onRemoved(keep.id, false);
  }

  return (
    <div className="group relative -mx-3">
      <a
        href={keep.url}
        target="_blank"
        rel="noreferrer"
        className="flex gap-4 rounded-md px-3 py-4 no-underline transition-colors hover:bg-paper-raised"
      >
        {thumbnail ? (
          // Third-party stills from arbitrary hosts. Deliberately not next/image:
          // optimizing them would mean proxying the whole internet through us.
          // biome-ignore lint/performance/noImgElement: arbitrary remote hosts
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            className="hidden h-[54px] w-24 shrink-0 rounded-sm border border-rule object-cover sm:block"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <span className="block font-medium tracking-[0.01em] text-ink">
            {keep.title ?? keep.url}
          </span>

          {keep.description ? (
            <span className="mt-1 line-clamp-2 block text-[0.9rem] text-ink-muted">
              {keep.description}
            </span>
          ) : null}

          {keep.note ? (
            <span className="mt-2 block border-l-2 border-dot pl-3 text-[0.9rem] text-ink">
              {keep.note}
            </span>
          ) : null}

          <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            {kind ? `${domain} · ${kind}` : domain}
          </span>
        </div>
      </a>

      {canEdit ? (
        // Fades in on hover, but stays in the tab order and reappears on focus.
        // `hidden` would make it unreachable by keyboard entirely.
        <button
          type="button"
          onClick={remove}
          aria-label={`Remove ${keep.title ?? keep.url}`}
          className="absolute top-4 right-3 cursor-pointer border-0 bg-transparent p-0 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted opacity-0 transition-opacity hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
        >
          remove
        </button>
      ) : null}
    </div>
  );
}
