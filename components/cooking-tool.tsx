"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CookingPanel } from "@/components/cooking-panel";
import type {
  CookingItem,
  CookingResponse,
  CookingWatchedRepo,
} from "@/lib/cooking/types";

const PANEL_ID = "site-toolbar-cooking";

type CookingFeed = {
  items: CookingItem[];
  watching: CookingWatchedRepo[];
  hasItems: boolean;
};

const CookingContext = createContext<CookingFeed | null>(null);

function useCookingFeed(): CookingFeed {
  const [items, setItems] = useState<CookingItem[]>([]);
  const [watching, setWatching] = useState<CookingWatchedRepo[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/cooking");
        const data = (await res.json()) as CookingResponse;
        if (cancelled) return;
        setItems(data.items ?? []);
        setWatching(data.watching ?? []);
      } catch {
        if (cancelled) return;
        setItems([]);
        setWatching([]);
      }
    }

    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return { items, watching, hasItems: items.length > 0 };
}

function useCookingContext(): CookingFeed {
  const ctx = useContext(CookingContext);
  if (!ctx) {
    throw new Error("CookingTool components require CookingTool.Provider");
  }
  return ctx;
}

function Provider({ children }: { children: ReactNode }) {
  const feed = useCookingFeed();
  return (
    <CookingContext.Provider value={feed}>{children}</CookingContext.Provider>
  );
}

function Panel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, watching } = useCookingContext();
  if (!open) return null;
  return (
    <CookingPanel
      id={PANEL_ID}
      onClose={onClose}
      items={items}
      watching={watching}
    />
  );
}

function NavButton({
  active,
  onClick,
  pulse,
}: {
  active: boolean;
  onClick: () => void;
  pulse?: boolean;
}) {
  const { items, hasItems } = useCookingContext();

  return (
    <>
      <span className="px-0.5 text-rule select-none" aria-hidden>
        ·
      </span>
      <button
        type="button"
        aria-expanded={active}
        aria-controls={PANEL_ID}
        aria-label={
          hasItems
            ? `What’s cooking: ${items.length} open`
            : "Cooking — watched repos"
        }
        onClick={onClick}
        className={`relative cursor-pointer rounded-[9px] border-0 bg-transparent px-3 py-1.5 font-sans text-[0.82rem] tracking-[0.01em] transition-colors ${
          active ? "text-accent" : "text-ink-muted hover:text-accent"
        }`}
      >
        {pulse && hasItems ? (
          <span
            className="toolbar-pulse absolute top-[0.45rem] right-[0.35rem] h-[0.35rem] w-[0.35rem] rounded-full bg-dot"
            aria-hidden
          />
        ) : null}
        cooking
      </button>
    </>
  );
}

/**
 * Cooking feature for the site toolbar: fetch/poll, panel, and nav button.
 * Watch list comes from the API (repos the GitHub token can read).
 * Pulse only when PRs are open.
 */
export const CookingTool = {
  Provider,
  Panel,
  NavButton,
};
