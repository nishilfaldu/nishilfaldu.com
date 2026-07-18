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
      "Would be cool if the interface itself were very dynamic — some screens generated on the fly by AI for the moment you’re in, not a fixed dashboard forever. And maximum customizability in how you organize the software: almost a dynamic GUI, laid out the way your household actually thinks about health.",
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
  {
    slug: "attention-residue",
    title: "Room for attention residue to clear",
    body: [
      "Attention residue is the lag after you close the scroll — your head is still half in the last clip, the comment thread, the next swipe, even though the app is gone. Social feeds make it worse because they slam unrelated contexts together; the baseline doesn’t come back for a while.",
      "I don’t want a ten-step detox routine. I do think most people need some real boredom in a day — half an hour, maybe an hour — with nothing to fill it. Thoughts settle. You get a little more creative. The bigger picture of what you’re actually trying to do shows up. Feelings get room too, instead of being drowned out by the next video.",
      "The problem is everyone scrolls all the time, so that residue never fully clears. Something that makes space for that void — without turning into another feed — feels worth thinking about.",
    ],
    status: "simmering",
    refs: [
      {
        href: "https://www.sciencedirect.com/science/article/abs/pii/S0749597814000699",
        label: "Sophie Leroy — attention residue",
        note: "the research term for leftover focus after you switch tasks",
      },
    ],
  },
  {
    slug: "breathe-nudge",
    title: "Something tiny that asks you to breathe",
    body: [
      "When I’m deep with AI agents I hop — two agents, four projects, five threads — shipping without absorbing anything. I’m not really learning. I’m not enjoying it. I forget to breathe. Not the automatic kind; the kind where you notice you’re here.",
      "After a break the overwhelm shows up. It would be nice to have something tiny for that — not a productivity suite. A corner of the computer. A cute dog that peeks in after half an hour of constant work and says it’s time to breathe. Or some other gentle interrupt that isn’t another dashboard.",
      "The point isn’t mindfulness theater. It’s a reminder that the pace of agents isn’t a pace a person can hold without gaps.",
    ],
    status: "simmering",
  },
  {
    slug: "fridge-to-kroger",
    title: "Order from the fridge, not from a list",
    body: [
      "Grocery runs start at the refrigerator. I notice what’s missing, write it down or try to hold it in my head, then at Kroger I rebuild the list from notes or memory. That’s another list to maintain, and it’s annoying.",
      "It would be nicer to stand there and just say order this, order that — and have something talk to Kroger’s API so the cart fills itself. Voice at the fridge, not a second notes app between me and the store. (Public API can add to cart; checkout still finishes in Kroger — good enough if the list stops living in my head.)",
    ],
    status: "simmering",
    refs: [
      {
        href: "https://developer.kroger.com/",
        label: "Kroger Developer Portal",
        note: "products, locations, cart — the official API surface",
      },
    ],
  },
  {
    slug: "show-your-work",
    title: "A nudge to show the work",
    body: [
      "I ship cool project changes and then forget to tell anyone. A nice push lands, I move on, and the share never happens — tweet, short note, whatever. I should do that more.",
      "Inspired by Austin Kleon’s Show Your Work: the point isn’t a marketing machine, it’s the habit of making the work visible as you go. Something that notices a push worth sharing and gently reminds me would help — not another content calendar, just a nudge when the work was actually good.",
    ],
    status: "simmering",
    refs: [
      {
        href: "https://austinkleon.com/show-your-work/",
        label: "Austin Kleon — Show Your Work",
        note: "the book behind the habit",
      },
    ],
  },
];
