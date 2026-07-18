"use client";

import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

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

export function ReportPanel({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [note, setNote] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function submit(e: FormEvent) {
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
    onClose();
  }

  return (
    <form
      id={id}
      onSubmit={submit}
      className="mb-2 w-[min(22rem,calc(100vw-3rem))] rounded-xl border border-rule bg-paper p-4 shadow-[0_8px_28px_rgb(0_0_0/0.14)]"
    >
      <label
        htmlFor={`${id}-note`}
        className="mb-2 block text-[0.92rem] text-ink-muted"
      >
        What’s wrong or missing?
      </label>
      <textarea
        ref={textareaRef}
        id={`${id}-note`}
        name="note"
        rows={4}
        maxLength={MAX_NOTE_CHARS}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="A typo, a broken link, something unclear…"
        className="mb-3 w-full resize-y rounded-[10px] border border-rule bg-paper px-3 py-2 font-sans text-[1rem] leading-snug text-ink placeholder:text-ink-muted/60 focus-visible:outline-none"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.82rem] text-ink-muted">Opens GitHub to finish.</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
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
  );
}
