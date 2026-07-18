"use client";

import { COOKING_REPOS } from "@/lib/cooking/repos";
import type { CookingItem } from "@/lib/cooking/types";

/**
 * WIP panel for the site toolbar’s cooking tool.
 * Open PRs up top; watched repos always listed below (click → GitHub).
 */

const linkClass =
  "text-ink-muted no-underline transition-colors hover:text-accent";

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

      {items.length > 0 ? (
        <>
          <p className="mb-4 text-[0.92rem] leading-snug text-ink-muted">
            Open PRs that haven’t landed yet.
          </p>
          <ul className="m-0 list-none p-0">
            {items.map((item) => (
              <CookingRow key={item.id} item={item} />
            ))}
          </ul>
        </>
      ) : (
        <p className="mb-0 text-[0.92rem] leading-snug text-ink-muted">
          Nothing open right now.
        </p>
      )}

      <WatchedRepos />
    </div>
  );
}

function WatchedRepos() {
  return (
    <div className="mt-5 border-t border-rule pt-4">
      <p className="m-0 mb-2 text-[0.72rem] tracking-[0.06em] text-ink-muted uppercase">
        Watching
      </p>
      <ul className="m-0 flex list-none flex-wrap items-baseline gap-x-0 gap-y-1 p-0">
        {COOKING_REPOS.map((watched, i) => {
          const full = `${watched.owner}/${watched.repo}`;
          return (
            <li key={full} className="flex items-baseline">
              {i > 0 ? (
                <span aria-hidden className="px-2 text-rule">
                  ·
                </span>
              ) : null}
              <a
                href={`https://github.com/${full}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-mono text-[0.78rem] ${linkClass}`}
                title={full}
              >
                {watched.repo}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function tryLabel(kind: "preview" | "release"): string {
  return kind === "release" ? "Release ↗" : "Preview ↗";
}

function CookingRow({ item }: { item: CookingItem }) {
  const slash = item.repo.lastIndexOf("/");
  const name = slash === -1 ? item.repo : item.repo.slice(slash + 1);
  const showTry = item.tryLink != null || item.status === "building";

  return (
    <li className="border-t border-rule py-4 first:border-t-0 first:pt-0 last:pb-0">
      <p className="m-0 font-medium tracking-[0.01em] text-ink">{item.title}</p>
      {item.note ? (
        <p className="mt-1.5 mb-0 text-[0.92rem] leading-snug text-ink-muted">
          {item.note}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-[0.82rem]">
        {item.tryLink ? (
          <a
            href={item.tryLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent no-underline transition-colors hover:opacity-80"
          >
            {tryLabel(item.tryLink.kind)}
          </a>
        ) : item.status === "building" ? (
          <span className="text-ink-muted">Building…</span>
        ) : null}

        {showTry ? (
          <span aria-hidden className="text-rule">
            ·
          </span>
        ) : null}

        <a
          href={`https://github.com/${item.repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          title={item.repo}
        >
          {name}
        </a>

        <span aria-hidden className="text-rule">
          ·
        </span>

        <a
          href={item.prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-mono text-[0.72rem] ${linkClass}`}
          title="Open pull request"
        >
          {item.branch}
        </a>
      </div>
    </li>
  );
}
