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
