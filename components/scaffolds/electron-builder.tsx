"use client";

import { useState } from "react";
import { ScaffoldActions } from "@/components/scaffolds/scaffold-actions";
import {
  buildElectronPrompt,
  type ElectronBundler,
  electronCreateCommand,
} from "@/components/scaffolds/electron-prompt";

const BUNDLERS: {
  id: ElectronBundler;
  name: string;
  blurb: string;
}[] = [
  {
    id: "vite",
    name: "Vite + TypeScript",
    blurb: "Modern default. Forge’s Vite plugin is still marked experimental.",
  },
  {
    id: "webpack",
    name: "Webpack + TypeScript",
    blurb: "More battle-tested Forge path.",
  },
];

/**
 * Interactive Electron Forge picker — Vite vs Webpack, then a Cursor prompt.
 */
export function ElectronBuilder() {
  const [bundler, setBundler] = useState<ElectronBundler>("vite");

  const prompt = buildElectronPrompt({ bundler });
  const command = electronCreateCommand({ bundler });

  return (
    <div className="mt-4">
      <p className="m-0 text-[0.92rem] text-ink-muted">
        Official Electron Forge via{" "}
        <code className="text-[0.88em]">create-electron-app</code> — pick a
        TypeScript bundler template, then the prompt adds React. The prompt
        updates.
      </p>

      <fieldset className="mt-5 m-0 border-0 p-0">
        <legend className="mb-2 px-0 text-[0.92rem] font-medium tracking-[0.01em] text-ink">
          Template
        </legend>
        <div className="flex flex-col gap-2">
          {BUNDLERS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-2.5"
            >
              <input
                type="radio"
                name="electron-bundler"
                checked={bundler === option.id}
                onChange={() => setBundler(option.id)}
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
