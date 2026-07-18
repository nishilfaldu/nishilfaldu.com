"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  isActivePhase,
  PHASE,
  phaseLabel,
  SIGH,
  type SighPhase,
} from "@/components/breathe/sigh";

/**
 * Just the sighs — orb, phase, a thin provenance line. No notes, no essay.
 */
export function BreatheSession({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<SighPhase>("ready");
  const [cycle, setCycle] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<number | null>(null);
  const labelId = useId();

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
    return () => clearTimer(timerRef);
  }, []);

  function reset() {
    clearTimer(timerRef);
    setPhase("ready");
    setCycle(0);
  }

  function start() {
    clearTimer(timerRef);
    setCycle(1);
    setPhase("inhale1");
  }

  useEffect(() => {
    if (!isActivePhase(phase)) return;

    const step = PHASE[phase];
    timerRef.current = window.setTimeout(() => {
      if (step.next === "cycle-or-done") {
        if (cycle >= SIGH.defaultCycles) {
          setPhase("done");
        } else {
          setCycle((c) => c + 1);
          setPhase("inhale1");
        }
        return;
      }
      setPhase(step.next);
    }, step.ms);

    return () => clearTimer(timerRef);
  }, [phase, cycle]);

  const active = isActivePhase(phase);
  const step = active ? PHASE[phase] : null;
  const scale = step?.scale ?? 1;
  const durationMs = step?.transitionMs ?? 600;
  const ease = step?.ease ?? "ease-in-out";

  return (
    <div className="flex flex-col items-center text-center">
      <output
        className="flex min-h-56 flex-col items-center justify-center pt-6 pb-2"
        aria-labelledby={labelId}
      >
        <div
          className="h-[9.5rem] w-[9.5rem] rounded-full border border-rule bg-paper-raised shadow-[inset_0_0_0_1px_rgb(255_174_0/0.12)]"
          style={{
            transform: `scale(${scale})`,
            transition: reducedMotion
              ? undefined
              : `transform ${durationMs}ms ${ease}`,
          }}
        />
        <p
          id={labelId}
          className="mt-5 m-0 text-[1.05rem] tracking-[0.01em] text-ink"
        >
          {phaseLabel(phase)}
        </p>
        {active ? (
          <p className="m-0 mt-2 text-[0.88rem] text-ink-muted tabular-nums">
            {cycle} / {SIGH.defaultCycles}
          </p>
        ) : null}
      </output>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {phase === "ready" ? (
          <button
            type="button"
            onClick={start}
            className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] font-medium text-accent hover:text-ink"
          >
            Begin →
          </button>
        ) : null}
        {phase === "done" ? (
          <>
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] font-medium text-accent hover:text-ink"
            >
              Again →
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] text-ink-muted hover:text-ink"
            >
              Done
            </button>
          </>
        ) : null}
        {active ? (
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] text-ink-muted hover:text-ink"
          >
            Stop
          </button>
        ) : null}
        {phase === "ready" ? (
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] text-ink-muted hover:text-ink"
          >
            Close
          </button>
        ) : null}
      </div>

      <p className="mt-12 mb-0 max-w-[22rem] text-[0.82rem] leading-snug text-ink-muted">
        Cyclic sigh — two nose inhales, one long mouth exhale. From Balban,
        Huberman & Spiegel (Stanford).
      </p>
    </div>
  );
}

function clearTimer(ref: { current: number | null }) {
  if (ref.current !== null) {
    window.clearTimeout(ref.current);
    ref.current = null;
  }
}
