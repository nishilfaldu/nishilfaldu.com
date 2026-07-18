/**
 * Open ideas — not a notes dump, a short public tray of thoughts that might
 * become something. Editing this file is the whole workflow.
 */
export type IdeaStatus = "simmering" | "building" | "cooling";

export type IdeaRef = {
  href: string;
  label: string;
  /** One short clause — why this link is here. */
  note?: string;
};

export type Idea = {
  slug: string;
  title: string;
  /** Paragraphs in Nishil's voice. */
  body: string[];
  status: IdeaStatus;
  /** Related products / essays — not endorsements, just the landscape. */
  refs?: IdeaRef[];
};

export const IDEA_STATUS_LABEL: Record<IdeaStatus, string> = {
  simmering: "simmering",
  building: "building",
  cooling: "cooling",
};

export const IDEAS: Idea[] = [
  {
    slug: "idea-manager",
    title: "A place for ideas that isn’t Notes",
    body: [
      "I usually have a bunch of ideas in my head, and I don’t like crowding my notes app with them. Putting them on this site is a start — a public tray instead of a private pile. Eventually I want something that helps me manage ideas honestly, and is more fun to poke at than a flat list. This page is the first sketch of that feeling.",
    ],
    status: "building",
  },
  {
    slug: "family-health-home",
    title: "One home for the family’s health",
    body: [
      "I want one health app that actually holds everything. Gym schedule and how I plan workouts. Wearables — Apple Watch, Whoop, Fitbit, whatever’s on a wrist that week — all feeding the same place. Doctor reports and lab PDFs I can upload and actually find again. Not five apps and a camera roll of screenshots.",
      "If it’s a family of four, I want a dashboard for all of us: compare where we are, see progress, see what’s still open. When someone is far away, they upload; I can see it, make sense of it, keep tabs without nagging them for updates.",
      "BioAge (bioa.ge) is a simple personal version of “body as OS” — food, sleep, exercise, bloodwork — and it feels unfinished / quiet now. The fuller shape I’m imagining is closer to a family health home: multi-device, documents, shared visibility.",
      "From what I’ve seen, no one app really does all of that. OVURA is the closest on the family + wearables + records front; others cover personal stacks or family documents alone. Apple Health Sharing helps inside Apple’s wall. The whole picture — any watch stack, workouts, PDFs, a family of four you can compare, someone far away uploading so you can see it — still looks open.",
    ],
    status: "simmering",
    refs: [
      {
        href: "https://bioa.ge/",
        label: "BioAge",
        note: "simple personal “body OS” — the spark, not the full family picture",
      },
      {
        href: "https://ovura.ai/",
        label: "OVURA",
        note: "closest I’ve seen: family passports, wearables, labs, shared pulse",
      },
      {
        href: "https://kaizenhealth.io/",
        label: "Kaizen Health",
        note: "family records hub and document help",
      },
      {
        href: "https://aere.health/",
        label: "Aere",
        note: "personal stack — wearables + labs + PDF intelligence",
      },
      {
        href: "https://www.apple.com/ios/health/",
        label: "Apple Health Sharing",
        note: "family share inside Apple’s wall — useful, not the whole story",
      },
    ],
  },
];
