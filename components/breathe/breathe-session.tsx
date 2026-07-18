"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  PEEK_QUIET_MS,
  phaseLabel,
  readBreatheStorage,
  SIGH,
  type SighPhase,
  writeBreatheStorage,
} from "@/components/breathe/breathe-shared";
import { ProseLink } from "@/components/prose-link";

type BreatheSessionProps = {
  /** Compact when inside the peek overlay. */
  compact?: boolean;
  onFinished?: () => void;
};

/**
 * Guided cyclic sigh — double nose inhale, long mouth exhale.
 * Not a dashboard. A few cycles, then you’re done.
 */
export function BreatheSession({ compact, onFinished }: BreatheSessionProps) {
  const [phase, setPhase] = useState<SighPhase>("ready");
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<number | null>(null);
  const headingId = useId();
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
          const prev = readBreatheStorage();
          writeBreatheStorage({
            ...prev,
            lastCompletedAt: Date.now(),
            quietUntil: Date.now() + PEEK_QUIET_MS,
          });
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

  const orbClass = reducedMotion
    ? "breathe-orb"
    : `breathe-orb breathe-orb-${phase}`;

  return (
    <div
      className={
        compact ? "breathe-session breathe-session-compact" : "breathe-session"
      }
    >
      <p
        id={headingId}
        className="mb-2 text-[0.88rem] tracking-[0.04em] text-ink-muted uppercase"
      >
        A gap
      </p>
      <h2 className="m-0 mb-4 text-[1.35rem] font-medium tracking-[0.01em] text-ink">
        Something tiny that asks you to breathe
      </h2>

      {!compact ? (
        <div className="mb-8 space-y-4 text-[1.05rem] leading-relaxed text-ink">
          <p className="m-0">
            Hopping between agents and threads leaves residue — part of your
            attention stays with the last thing even after you’ve closed it.
            Overwhelm often shows up later, once the hopping stops.
          </p>
          <p className="m-0 text-ink-muted">
            This isn’t mindfulness theater. It’s a few physiological sighs: two
            inhales through the nose, then a long exhale through the mouth.
            Stanford’s trial found that kind of exhale-focused sighing helped
            mood and calmed breathing rate more than a matched stretch of
            passive mindfulness.
          </p>
        </div>
      ) : (
        <p className="mb-6 text-[1.02rem] leading-relaxed text-ink-muted">
          Two inhales through the nose, one long exhale through the mouth. Three
          rounds. Then you’re done.
        </p>
      )}

      <output className="breathe-stage" aria-labelledby={headingId}>
        <div
          className={orbClass}
          style={reducedMotion ? { transform: `scale(${scale})` } : undefined}
        />
        <p className="breathe-phase-label m-0">{phaseLabel(phase)}</p>
        {phase !== "ready" && phase !== "done" ? (
          <p className="m-0 mt-2 text-[0.88rem] text-ink-muted tabular-nums">
            Round {cycle} of {SIGH.defaultCycles}
          </p>
        ) : null}
      </output>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        {phase === "ready" ? (
          <button
            type="button"
            onClick={start}
            className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] font-medium text-accent hover:text-ink"
          >
            Begin three sighs →
          </button>
        ) : null}
        {phase === "done" ? (
          <button
            type="button"
            onClick={() => {
              setPhase("ready");
              setCycle(0);
              setRunning(false);
            }}
            className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[0.95rem] font-medium text-accent hover:text-ink"
          >
            Do another three →
          </button>
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
      </div>

      {phase === "done" ? (
        <p className="mt-8 mb-0 text-[1.05rem] leading-relaxed text-ink">
          The pace of agents isn’t a pace a person can hold without gaps. You
          took one.
        </p>
      ) : null}

      <div className="mt-10 border-t border-rule pt-6">
        <p className="mb-2 text-[0.88rem] tracking-[0.02em] text-ink-muted">
          Optional — ready to resume
        </p>
        <p className="mb-3 text-[0.95rem] text-ink-muted">
          If you were mid-hop: one line for where you left off. Stays in this
          browser only — a breadcrumb so attention can let go (Leroy’s
          ready-to-resume idea).
        </p>
        <textarea
          value={breadcrumb}
          onChange={(e) => setBreadcrumb(e.target.value)}
          rows={2}
          maxLength={280}
          placeholder="Was in agent thread X, next is…"
          className="w-full resize-y rounded-[10px] border border-rule bg-paper px-3 py-2 font-sans text-[0.98rem] leading-snug text-ink placeholder:text-ink-muted/60 focus-visible:outline-none"
        />
      </div>

      {!compact ? (
        <div className="mt-10 border-t border-rule pt-6">
          <p className="mb-3 text-[0.88rem] tracking-[0.02em] text-ink-muted">
            In the neighborhood
          </p>
          <ul className="m-0 list-none p-0">
            <li className="mb-2.5 last:mb-0">
              <ProseLink href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/">
                Balban et al. — cyclic sighing
              </ProseLink>
              <span className="text-[0.95rem] text-ink-muted">
                {" "}
                — Cell Reports Medicine; brief exhale-focused breathwork
              </span>
            </li>
            <li className="mb-2.5 last:mb-0">
              <ProseLink href="https://med.stanford.edu/news/insights/2023/02/cyclic-sighing-can-help-breathe-away-anxiety.html">
                Stanford Medicine — cyclic sighing
              </ProseLink>
              <span className="text-[0.95rem] text-ink-muted">
                {" "}
                — plain-language writeup of the trial
              </span>
            </li>
            <li className="mb-2.5 last:mb-0">
              <ProseLink href="https://www.uwb.edu/business/faculty/sophie-leroy/attention-residue">
                Sophie Leroy — attention residue
              </ProseLink>
              <span className="text-[0.95rem] text-ink-muted">
                {" "}
                — why hopping leaves you half elsewhere
              </span>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
