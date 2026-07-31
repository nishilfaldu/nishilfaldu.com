import type { Channel } from "@/components/radar/sources";

/**
 * People whose next thing I don’t want to miss.
 *
 * Not a follow list — a short one. Editing this file is the whole workflow:
 * add a person, list every place they actually publish, keep the note to one
 * clause about why they’re here.
 *
 * Two names so far. The rest are still owed.
 */
export type Person = {
  slug: string;
  name: string;
  /** One clause — why I read them, not their résumé. */
  note?: string;
  /** Every place they publish. Order is how I’d check them. */
  channels: Channel[];
};

export const PEOPLE: Person[] = [
  {
    slug: "tim-ferriss",
    name: "Tim Ferriss",
    note: "Asks better questions than most interviewers ask in a career.",
    channels: [
      { kind: "site", href: "https://tim.blog/" },
      { kind: "podcast", href: "https://tim.blog/podcast/" },
      { kind: "youtube", href: "https://www.youtube.com/@TimFerriss" },
      { kind: "x", href: "https://x.com/tferriss" },
      { kind: "rss", href: "https://tim.blog/feed/" },
    ],
  },
  {
    slug: "derek-sivers",
    name: "Derek Sivers",
    note: "Writes a page where everyone else would write a book.",
    channels: [
      { kind: "site", href: "https://sive.rs/" },
      { kind: "podcast", href: "https://sive.rs/podcast" },
      { kind: "github", href: "https://github.com/sivers" },
      { kind: "rss", href: "https://sive.rs/en.atom" },
    ],
  },
];
