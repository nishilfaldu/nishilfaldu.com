"use client";

import { useEffect, useId, useState } from "react";
import { BreatheDog } from "@/components/breathe/breathe-dog";
import { BreatheSession } from "@/components/breathe/breathe-session";

/**
 * Corner tool on every page — like report, but a soft pulse instead of a label.
 * Click opens a quiet room: just the sighs.
 */
export function BreatheCorner() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    function onChange() {
      setReducedMotion(mq.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {!open ? (
        <div className="fixed right-5 bottom-5 z-20 sm:right-6 sm:bottom-6">
          <button
            type="button"
            aria-label="Breathe"
            aria-expanded={false}
            aria-controls={panelId}
            onClick={() => setOpen(true)}
            className="breathe-corner-hit group relative flex h-14 w-14 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
          >
            <span
              className={`breathe-corner-orb${
                reducedMotion ? "" : " breathe-corner-orb-idle"
              }`}
              aria-hidden
            />
            <span className="breathe-corner-dog text-ink-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <BreatheDog className="h-9 w-auto" />
            </span>
          </button>
        </div>
      ) : null}

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Breathe"
          className="fixed inset-0 z-40 flex items-center justify-center bg-paper/92 p-6 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div
            className={`relative w-full max-w-sm${
              reducedMotion ? "" : " breathe-room-enter"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-2 right-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.92rem] text-ink-muted hover:text-ink"
            >
              Close
            </button>
            <BreatheSession />
          </div>
        </div>
      ) : null}
    </>
  );
}
