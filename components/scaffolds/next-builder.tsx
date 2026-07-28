"use client";

import { useState } from "react";
import {
  buildNextPrompt,
  type NextLinter,
  nextCreateCommand,
} from "@/components/scaffolds/next-prompt";
import { ScaffoldActions } from "@/components/scaffolds/scaffold-actions";

const LINTERS: {
  id: NextLinter;
  name: string;
  blurb: string;
}[] = [
  {
    id: "biome",
    name: "Biome",
    blurb: "Single fast tool for lint + format. My usual default.",
  },
  {
    id: "eslint",
    name: "ESLint",
    blurb: "create-next-app's own default, kept for stacks that expect it.",
  },
];

/**
 * Interactive Next.js picker — Biome vs ESLint, then a Cursor prompt.
 */
export function NextBuilder() {
  const [linter, setLinter] = useState<NextLinter>("biome");

  const prompt = buildNextPrompt({ linter });
  const command = nextCreateCommand({ linter });

  return (
    <div className="mt-4">
      <p className="m-0 text-[0.92rem] text-ink-muted">
        Official <code className="text-[0.88em]">create-next-app</code> — pick
        Biome or ESLint and the prompt updates.
      </p>

      <fieldset className="mt-5 m-0 border-0 p-0">
        <legend className="mb-2 px-0 text-[0.92rem] font-medium tracking-[0.01em] text-ink">
          Linter
        </legend>
        <div className="flex flex-col gap-2">
          {LINTERS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-2.5"
            >
              <input
                type="radio"
                name="next-linter"
                checked={linter === option.id}
                onChange={() => setLinter(option.id)}
                className="mt-1 accent-[var(--color-accent)]"
              />
              <span>
                <span className="text-[0.95rem] text-ink">{option.name}</span>
                <span className="mt-0.5 block text-[0.88rem] text-ink-muted">
                  {option.blurb}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <ScaffoldActions prompt={prompt} />

      <details className="mt-4">
        <summary className="cursor-pointer text-[0.92rem] text-ink-muted hover:text-accent">
          Read the prompt
        </summary>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-[10px] border border-rule bg-paper-raised p-4 font-mono text-[0.78rem] leading-relaxed text-ink">
          {prompt}
        </pre>
      </details>

      <details className="mt-3">
        <summary className="cursor-pointer text-[0.92rem] text-ink-muted hover:text-accent">
          CLI command
        </summary>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-[10px] border border-rule bg-paper-raised p-4 font-mono text-[0.78rem] leading-relaxed text-ink">
          {command}
        </pre>
      </details>
    </div>
  );
}
