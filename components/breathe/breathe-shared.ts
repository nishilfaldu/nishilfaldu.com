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

export const BREATHE_STORAGE_KEY = "nf-breathe-v1";

export type BreatheStorage = {
  /** Don’t peek again until this time (ms since epoch). */
  quietUntil?: number;
  /** Last time they finished a session. */
  lastCompletedAt?: number;
};

export function readBreatheStorage(): BreatheStorage {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(BREATHE_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as BreatheStorage;
  } catch {
    return {};
  }
}

export function writeBreatheStorage(next: BreatheStorage) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BREATHE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode / quota — peek simply won’t persist.
  }
}

/** Quiet period after dismiss or complete so the peek stays a guest, not a nag. */
export const PEEK_QUIET_MS = 1000 * 60 * 60 * 16;
