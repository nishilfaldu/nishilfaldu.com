"use client";

import type { ReactNode } from "react";
import type { CookingItem, CookingWatchedRepo } from "@/lib/cooking/types";

/**
 * WIP panel for the site toolbar’s cooking tool.
 * Open PRs up top; watched repos always listed below (click → GitHub).
 */

const linkClass =
  "inline-flex items-center gap-1 text-ink-muted no-underline transition-colors hover:text-accent";

const iconClass =
  "size-[0.9em] shrink-0 opacity-80 [stroke-width:1.5] stroke-current fill-none";

export function CookingPanel({
  id,
  onClose,
  items,
  watching,
}: {
  id: string;
  onClose: () => void;
  items: CookingItem[];
  watching: CookingWatchedRepo[];
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

      <WatchedRepos watching={watching} />
    </div>
  );
}

function WatchedRepos({ watching }: { watching: CookingWatchedRepo[] }) {
  if (watching.length === 0) return null;

  return (
    <div className="mt-5 border-t border-rule pt-4">
      <p className="m-0 mb-2 text-[0.72rem] tracking-[0.06em] text-ink-muted uppercase">
        Watching
      </p>
      <ul className="m-0 flex list-none flex-wrap items-center gap-x-0 gap-y-1.5 p-0">
        {watching.map((watched, i) => {
          const full = `${watched.owner}/${watched.repo}`;
          return (
            <li key={full} className="flex items-center">
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
                <IconRepo />
                <span>{watched.repo}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
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

      <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[0.82rem]">
        {item.tryLink ? (
          <a
            href={item.tryLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent no-underline transition-colors hover:opacity-80"
          >
            {item.tryLink.kind === "release" ? (
              <IconRelease />
            ) : (
              <IconPreview />
            )}
            <span>
              {item.tryLink.kind === "release" ? "Release" : "Preview"}
            </span>
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
          <IconRepo />
          <span>{name}</span>
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
          <IconBranch />
          <span>{item.branch}</span>
        </a>
      </div>
    </li>
  );
}

function IconSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      className={iconClass}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {children}
    </svg>
  );
}

/** External / live preview. */
function IconPreview() {
  return (
    <IconSvg>
      <path d="M6 3H3.5A1.5 1.5 0 0 0 2 4.5v7A1.5 1.5 0 0 0 3.5 13h7A1.5 1.5 0 0 0 12 11.5V9" />
      <path d="M10 2h4v4" />
      <path d="M8.5 7.5 14 2" />
    </IconSvg>
  );
}

/** GitHub release / package tag. */
function IconRelease() {
  return (
    <IconSvg>
      <path d="M2.5 7.5 7.5 2.5h4.2L13.5 4.3v4.2L8.5 13.5z" />
      <circle cx="10.2" cy="5.8" r="1.1" />
    </IconSvg>
  );
}

/** Repository. */
function IconRepo() {
  return (
    <IconSvg>
      <path d="M4 2.5h7.5A1.5 1.5 0 0 1 13 4v9.5H5.5A1.5 1.5 0 0 1 4 12V2.5Z" />
      <path d="M4 12a1.5 1.5 0 0 0 1.5 1.5H13" />
      <path d="M6.5 5h4M6.5 7.5h4" />
    </IconSvg>
  );
}

/** Git branch → PR. */
function IconBranch() {
  return (
    <IconSvg>
      <circle cx="4.5" cy="3.5" r="1.6" />
      <circle cx="4.5" cy="12.5" r="1.6" />
      <circle cx="11.5" cy="8.5" r="1.6" />
      <path d="M4.5 5.2v5.6" />
      <path d="M4.5 8.5h5.4" />
    </IconSvg>
  );
}
