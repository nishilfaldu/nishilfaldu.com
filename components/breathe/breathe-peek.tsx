"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BreatheDog } from "@/components/breathe/breathe-dog";
import { BreatheSession } from "@/components/breathe/breathe-session";
import {
  PEEK_QUIET_MS,
  readBreatheStorage,
  writeBreatheStorage,
} from "@/components/breathe/breathe-shared";

const DWELL_MS = 48_000;
const HOP_THRESHOLD = 3;

function isQuiet(): boolean {
  const { quietUntil } = readBreatheStorage();
  return typeof quietUntil === "number" && quietUntil > Date.now();
}

/**
 * After a while on the site — or after hopping pages — a dog may peek in and
 * offer a gap. Not every visit. Not a dashboard.
 */
export function BreathePeek() {
  const pathname = usePathname();
  const panelId = useId();
  const [peekVisible, setPeekVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hopsRef = useRef(0);
  const armedRef = useRef(false);
  const openRef = useRef(open);
  openRef.current = open;

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
    if (pathname === "/breathe") {
      setPeekVisible(false);
      setOpen(false);
      return;
    }

    hopsRef.current += 1;
    if (hopsRef.current < HOP_THRESHOLD) return;
    if (armedRef.current || openRef.current || isQuiet()) return;
    if (Math.random() > 0.55) return;
    armedRef.current = true;
    setPeekVisible(true);
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/breathe") return;

    const timer = window.setTimeout(() => {
      if (armedRef.current || openRef.current || isQuiet()) return;
      if (Math.random() > 0.55) return;
      armedRef.current = true;
      setPeekVisible(true);
    }, DWELL_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

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

  function dismissPeek() {
    setPeekVisible(false);
    const prev = readBreatheStorage();
    writeBreatheStorage({
      ...prev,
      quietUntil: Date.now() + PEEK_QUIET_MS,
    });
  }

  function openRoom() {
    setOpen(true);
    setPeekVisible(false);
  }

  if (pathname === "/breathe") return null;

  return (
    <>
      {peekVisible && !open ? (
        <div
          data-breathe-peek
          className={`fixed right-6 bottom-6 z-20 flex flex-col items-end gap-2${
            reducedMotion ? "" : " breathe-peek-enter"
          }`}
        >
          <button
            type="button"
            onClick={openRoom}
            aria-expanded={false}
            aria-controls={panelId}
            className="group flex cursor-pointer items-end gap-2 border-0 bg-transparent p-0 text-left"
          >
            <span className="mb-1 max-w-[9.5rem] rounded-[10px] border border-rule bg-paper px-3 py-2 font-sans text-[0.82rem] leading-snug tracking-[0.01em] text-ink-muted shadow-[0_2px_12px_rgb(0_0_0/0.10)] transition-colors group-hover:text-accent">
              You’ve been hopping.
              <span className="mt-0.5 block text-accent">Time to breathe?</span>
            </span>
            <span className="text-ink-muted transition-colors group-hover:text-ink">
              <BreatheDog />
            </span>
          </button>
          <button
            type="button"
            onClick={dismissPeek}
            className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.78rem] text-ink-muted/80 hover:text-ink-muted"
          >
            Not now
          </button>
        </div>
      ) : null}

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="A gap to breathe"
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/35 p-4 sm:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div
            className={`max-h-[min(92vh,44rem)] w-full max-w-measure overflow-y-auto rounded-[12px] border border-rule bg-paper px-5 py-6 shadow-[0_12px_40px_rgb(0_0_0/0.22)] sm:px-8 sm:py-8${
              reducedMotion ? "" : " breathe-room-enter"
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <BreatheDog className="text-ink-muted" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.92rem] text-ink-muted hover:text-ink"
              >
                Close
              </button>
            </div>
            <BreatheSession compact />
            <p className="mt-8 mb-0 text-[0.92rem] text-ink-muted">
              Prefer the quiet page?{" "}
              <a
                href="/breathe"
                className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
              >
                Open /breathe
              </a>
              .
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
