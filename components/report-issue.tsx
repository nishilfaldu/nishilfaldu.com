"use client";

import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";

/**
 * Public feedback: write on the site, land on GitHub's new-issue page with
 * the note and current URL already filled in. They hit Submit new issue there.
 *
 * No token, no server — GitHub owns auth and the actual create step.
 * https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue#creating-an-issue-from-a-url-query
 */

const REPO_ISSUES_NEW =
  "https://github.com/nishilfaldu/nishilfaldu.com/issues/new";

/** Browser / GitHub query strings aren't infinite; keep headroom. */
const MAX_NOTE_CHARS = 3500;

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

export function ReportIssue() {
  const pathname = usePathname();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    textareaRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-report]")) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const submit = (e: FormEvent) => {
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
    setOpen(false);
    setNote("");
  };

  return (
    <div data-report className="fixed bottom-6 left-6 z-20">
      {open ? (
        <form
          id={panelId}
          onSubmit={submit}
          className="w-[min(22rem,calc(100vw-3rem))] rounded-xl border border-rule bg-paper p-4 shadow-[0_8px_28px_rgb(0_0_0/0.14)]"
        >
          <label
            htmlFor={`${panelId}-note`}
            className="mb-2 block text-[0.92rem] text-ink-muted"
          >
            What’s wrong or missing?
          </label>
          <textarea
            ref={textareaRef}
            id={`${panelId}-note`}
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
                onClick={() => setOpen(false)}
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
      ) : (
        <button
          type="button"
          aria-label="Report an issue"
          aria-expanded={false}
          aria-controls={panelId}
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded-[10px] border border-rule bg-paper px-3 py-2 font-sans text-[0.82rem] tracking-[0.01em] text-ink-muted shadow-[0_2px_12px_rgb(0_0_0/0.10)] transition-colors hover:text-accent"
        >
          report
        </button>
      )}
    </div>
  );
}
