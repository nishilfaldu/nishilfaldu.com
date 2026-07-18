"use client";

import { useEffect, useState } from "react";
import type { CookingItem, CookingResponse } from "@/lib/cooking/types";

/**
 * Poll `/api/cooking` for open-PR WIP. Owned by the cooking feature —
 * SiteToolbar should only consume this, not fetch itself.
 */
export function useCooking(): {
  items: CookingItem[];
  hasItems: boolean;
} {
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
