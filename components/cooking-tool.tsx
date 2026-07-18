"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CookingPanel } from "@/components/cooking-panel";
import type { CookingItem, CookingResponse } from "@/lib/cooking/types";

const PANEL_ID = "site-toolbar-cooking";

type CookingFeed = {
  items: CookingItem[];
  hasItems: boolean;
};

const CookingContext = createContext<CookingFeed | null>(null);

function useCookingFeed(): CookingFeed {
  const [items, setItems] = useState<CookingItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/cooking");
        const data = (await res.json()) as CookingResponse;
        if (cancelled) return;
        setItems(data.items ?? []);
      } catch {
        if (cancelled) return;
        setItems([]);
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

  return { items, hasItems: items.length > 0 };
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
  const { items, hasItems } = useCookingContext();

  useEffect(() => {
    if (open && !hasItems) onClose();
  }, [open, hasItems, onClose]);

  if (!open || !hasItems) return null;

  return <CookingPanel id={PANEL_ID} onClose={onClose} items={items} />;
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

  if (!hasItems) return null;

  const count = items.length;
  return (
    <>
      <span className="px-0.5 text-rule select-none" aria-hidden>
        ·
      </span>
      <button
        type="button"
        aria-expanded={active}
        aria-controls={PANEL_ID}
        aria-label={`What’s cooking: ${count} preview${count === 1 ? "" : "s"}`}
        onClick={onClick}
        className={`relative cursor-pointer rounded-[9px] border-0 bg-transparent px-3 py-1.5 font-sans text-[0.82rem] tracking-[0.01em] transition-colors ${
          active ? "text-accent" : "text-ink-muted hover:text-accent"
        }`}
      >
        {pulse ? (
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
 * SiteToolbar only wires open/close — no cooking data in the shell.
 */
export const CookingTool = {
  Provider,
  Panel,
  NavButton,
};
