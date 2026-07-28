"use client";

import { useState } from "react";
import { cursorPromptHref } from "@/components/scaffolds/recipes";

function withProjectDescription(prompt: string, description: string): string {
  const trimmed = description.trim();
  if (!trimmed) return prompt;
  return `${prompt}

## Then build this

Phase 1 (scaffold) and the standing practices above are done and proven before you start this. Here's what I'm actually building:

${trimmed}`;
}

/**
 * Tell-me-about-your-project textarea, then Open in Cursor (deeplink) +
 * copy prompt for everyone else. The textarea's value is appended as a
 * final section of the prompt so pressing enter in Cursor scaffolds the
 * app, wires standing practices, then builds what was described.
 */
export function ScaffoldActions({ prompt }: { prompt: string }) {
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const finalPrompt = withProjectDescription(prompt, description);
  const href = cursorPromptHref(finalPrompt);

  async function copy() {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-4">
      <label
        htmlFor="project-description"
        className="mb-2 block text-[0.92rem] font-medium tracking-[0.01em] text-ink"
      >
        What are you building?{" "}
        <span className="font-normal text-ink-muted">(optional)</span>
      </label>
      <textarea
        id="project-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="A couple sentences is enough — the agent scaffolds and wires practices first either way, then builds this."
        rows={3}
        className="w-full resize-y rounded-[10px] border border-rule bg-paper-raised p-3 font-sans text-[0.92rem] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
      />

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
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
    </div>
  );
}
