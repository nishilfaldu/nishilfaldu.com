"use client";

import { useState } from "react";
import { cursorPromptHref } from "@/components/scaffolds/recipes";

/**
 * Open in Cursor (deeplink) + copy prompt for everyone else.
 */
export function ScaffoldActions({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);
  const href = cursorPromptHref(prompt);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
      <a
        href={href}
        className="text-[0.95rem] font-medium text-accent no-underline hover:text-ink"
      >
        Open in Cursor →
      </a>
      <button
        type="button"
        onClick={copy}
        className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] text-ink-muted hover:text-accent"
      >
        {copied ? "Copied" : "Copy prompt"}
      </button>
    </div>
  );
}
