"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  phaseLabel,
  SIGH,
  type SighPhase,
} from "@/components/breathe/breathe-shared";

/**
 * Just the sighs — orb, phase, a thin provenance line. No notes, no essay.
 */
export function BreatheSession({
  onFinished,
  onClose,
}: {
  onFinished?: () => void;
  onClose?: () => void;
}) {
  const [phase, setPhase] = useState<SighPhase>("ready");
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<number | null>(null);
  const labelId = useId();
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

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
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function start() {
    clearTimer();
    setRunning(true);
    setCycle(1);
    setPhase("inhale1");
  }

  useEffect(() => {
    if (!running) return;

    function schedule(ms: number, fn: () => void) {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = window.setTimeout(fn, ms);
    }

    if (phase === "inhale1") {
      schedule(SIGH.inhale1Ms, () => setPhase("inhale2"));
    } else if (phase === "inhale2") {
      schedule(SIGH.inhale2Ms, () => setPhase("exhale"));
    } else if (phase === "exhale") {
      schedule(SIGH.exhaleMs, () => setPhase("rest"));
    } else if (phase === "rest") {
      schedule(SIGH.restMs, () => {
        if (cycle >= SIGH.defaultCycles) {
          setPhase("done");
          setRunning(false);
          onFinishedRef.current?.();
        } else {
          setCycle((c) => c + 1);
          setPhase("inhale1");
        }
      });
    }

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase, running, cycle]);

  const scale =
    phase === "inhale1"
      ? 1.18
      : phase === "inhale2"
        ? 1.28
        : phase === "exhale"
          ? 0.72
          : phase === "rest"
            ? 0.68
            : 1;

  const durationMs =
    phase === "inhale1"
      ? SIGH.inhale1Ms
      : phase === "inhale2"
        ? SIGH.inhale2Ms
        : phase === "exhale"
          ? SIGH.exhaleMs
          : phase === "rest"
            ? 500
            : 600;

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
              : `transform ${durationMs}ms ${
                  phase === "exhale" ? "ease-in" : "ease-in-out"
                }`,
          }}
        />
        <p
          id={labelId}
          className="mt-5 m-0 text-[1.05rem] tracking-[0.01em] text-ink"
        >
          {phaseLabel(phase)}
        </p>
        {phase !== "ready" && phase !== "done" ? (
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
              onClick={() => {
                setPhase("ready");
                setCycle(0);
                setRunning(false);
              }}
              className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] font-medium text-accent hover:text-ink"
            >
              Again →
            </button>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] text-ink-muted hover:text-ink"
              >
                Done
              </button>
            ) : null}
          </>
        ) : null}
        {running ? (
          <button
            type="button"
            onClick={() => {
              clearTimer();
              setRunning(false);
              setPhase("ready");
              setCycle(0);
            }}
            className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] text-ink-muted hover:text-ink"
          >
            Stop
          </button>
        ) : null}
        {phase === "ready" && onClose ? (
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
