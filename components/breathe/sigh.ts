/**
 * Timing for one physiological / cyclic sigh cycle.
 * Double inhale + long exhale — exhale-focused, per Balban, Huberman, Spiegel
 * (Cell Reports Medicine, 2023): brief structured sighing improved mood and
 * lowered respiratory rate vs mindfulness in their trial.
 */
export const SIGH = {
  inhale1Ms: 2200,
  inhale2Ms: 900,
  exhaleMs: 5200,
  restMs: 1100,
  defaultCycles: 3,
} as const;

export type SighPhase =
  | "ready"
  | "inhale1"
  | "inhale2"
  | "exhale"
  | "rest"
  | "done";

export type ActivePhase = Exclude<SighPhase, "ready" | "done">;

/** Drive the timer and orb from one table — no phase if-ladders in the UI. */
export const PHASE: Record<
  ActivePhase,
  {
    ms: number;
    transitionMs: number;
    scale: number;
    ease: string;
    next: ActivePhase | "cycle-or-done";
  }
> = {
  inhale1: {
    ms: SIGH.inhale1Ms,
    transitionMs: SIGH.inhale1Ms,
    scale: 1.18,
    ease: "ease-in-out",
    next: "inhale2",
  },
  inhale2: {
    ms: SIGH.inhale2Ms,
    transitionMs: SIGH.inhale2Ms,
    scale: 1.28,
    ease: "ease-in-out",
    next: "exhale",
  },
  exhale: {
    ms: SIGH.exhaleMs,
    transitionMs: SIGH.exhaleMs,
    scale: 0.72,
    ease: "ease-in",
    next: "rest",
  },
  rest: {
    ms: SIGH.restMs,
    transitionMs: 500,
    scale: 0.68,
    ease: "ease-in-out",
    next: "cycle-or-done",
  },
};

export function isActivePhase(phase: SighPhase): phase is ActivePhase {
  return phase !== "ready" && phase !== "done";
}

export function phaseLabel(phase: SighPhase): string {
  switch (phase) {
    case "ready":
      return "When you’re ready";
    case "inhale1":
      return "Inhale through the nose";
    case "inhale2":
      return "Top it up — second sip of air";
    case "exhale":
      return "Long, slow exhale through the mouth";
    case "rest":
      return "Empty for a beat";
    case "done":
      return "That’s enough";
    default: {
      const _exhaustive: never = phase;
      return _exhaustive;
    }
  }
}
