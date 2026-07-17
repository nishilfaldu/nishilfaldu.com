"use client";

import { useState } from "react";
import { ScaffoldActions } from "@/components/scaffolds/scaffold-actions";
import {
  type AddonGroup,
  DEFAULT_SELECTED_ADDONS,
  isAddonDisabled,
  TANSTACK_ADDON_GROUPS,
} from "@/components/scaffolds/tanstack-addons";
import {
  buildTanstackPrompt,
  tanstackCreateCommand,
} from "@/components/scaffolds/tanstack-prompt";

/**
 * Interactive TanStack Start picker — selections build the Cursor prompt.
 */
export function TanstackBuilder() {
  const [selected, setSelected] = useState<string[]>([
    ...DEFAULT_SELECTED_ADDONS,
  ]);
  const [intent, setIntent] = useState(true);

  const prompt = buildTanstackPrompt({ selectedAddons: selected, intent });
  const command = tanstackCreateCommand({ selectedAddons: selected, intent });

  function toggleMulti(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      const addon = TANSTACK_ADDON_GROUPS.flatMap((g) => g.addons).find(
        (a) => a.id === id,
      );
      if (!addon || isAddonDisabled(addon, prev)) return prev;
      return [...prev, id];
    });
  }

  function pickSingle(group: AddonGroup, id: string | null) {
    setSelected((prev) => {
      const groupIds = new Set(group.addons.map((a) => a.id));
      let next = prev.filter((x) => !groupIds.has(x));
      if (id === null) return next;
      const addon = group.addons.find((a) => a.id === id);
      if (!addon) return next;
      // Drop conflicting exclusive selections (e.g. orm when picking convex)
      if (addon.exclusive) {
        const buckets = new Set(addon.exclusive);
        next = next.filter((existingId) => {
          const existing = TANSTACK_ADDON_GROUPS.flatMap((g) => g.addons).find(
            (a) => a.id === existingId,
          );
          if (!existing?.exclusive) return true;
          return !existing.exclusive.some((b) => buckets.has(b));
        });
      }
      return [...next, id];
    });
  }

  return (
    <div className="mt-4">
      <p className="m-0 text-[0.92rem] text-ink-muted">
        Locked base: React, pnpm, Biome, Start (not router-only), no demo
        examples. Pick add-ons — the prompt updates.
      </p>

      <label className="mt-4 flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          checked={intent}
          onChange={(e) => setIntent(e.target.checked)}
          className="mt-1 accent-[var(--color-accent)]"
        />
        <span>
          <span className="text-[0.95rem] text-ink">TanStack Intent</span>
          <span className="mt-0.5 block text-[0.88rem] text-ink-muted">
            Versioned skills ship with packages; the agent loads them on demand.
            Recommended.
          </span>
        </span>
      </label>

      {TANSTACK_ADDON_GROUPS.map((group) => (
        <fieldset key={group.id} className="mt-5 m-0 border-0 p-0">
          <legend className="mb-2 px-0 text-[0.92rem] font-medium tracking-[0.01em] text-ink">
            {group.label}
          </legend>
          {group.mode === "single" ? (
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="radio"
                  name={`ts-${group.id}`}
                  checked={!group.addons.some((a) => selected.includes(a.id))}
                  onChange={() => pickSingle(group, null)}
                  className="mt-1 accent-[var(--color-accent)]"
                />
                <span className="text-[0.95rem] text-ink-muted">None</span>
              </label>
              {group.addons.map((addon) => {
                const disabled = isAddonDisabled(addon, selected);
                return (
                  <label
                    key={addon.id}
                    className={`flex items-start gap-2.5 ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"}`}
                  >
                    <input
                      type="radio"
                      name={`ts-${group.id}`}
                      checked={selected.includes(addon.id)}
                      disabled={disabled}
                      onChange={() => pickSingle(group, addon.id)}
                      className="mt-1 accent-[var(--color-accent)]"
                    />
                    <span>
                      <span className="text-[0.95rem] text-ink">
                        {addon.name}
                      </span>
                      <span className="mt-0.5 block text-[0.88rem] text-ink-muted">
                        {addon.blurb}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {group.addons.map((addon) => {
                const disabled = isAddonDisabled(addon, selected);
                return (
                  <label
                    key={addon.id}
                    className={`flex items-start gap-2.5 ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(addon.id)}
                      disabled={disabled}
                      onChange={() => toggleMulti(addon.id)}
                      className="mt-1 accent-[var(--color-accent)]"
                    />
                    <span>
                      <span className="text-[0.95rem] text-ink">
                        {addon.name}
                      </span>
                      <span className="mt-0.5 block text-[0.88rem] text-ink-muted">
                        {addon.blurb}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </fieldset>
      ))}

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
