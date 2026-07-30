import type { Channel } from "@/components/radar/sources";

/**
 * Sites that earn a check every day. Short on purpose — a long list is one
 * nobody opens.
 */
export type DailySite = {
  slug: string;
  name: string;
  /** Where the daily check actually lands. */
  href: string;
  /** One sentence — what I’m there for. */
  note: string;
  /** Other places the same source publishes. */
  channels?: Channel[];
};

export const DAILY: DailySite[] = [
  {
    slug: "hacker-news",
    name: "Hacker News",
    href: "https://news.ycombinator.com/",
    note: "The front page most days, and the comments more often than the links.",
    channels: [{ kind: "rss", href: "https://news.ycombinator.com/rss" }],
  },
  {
    slug: "techcrunch",
    name: "TechCrunch",
    href: "https://techcrunch.com/",
    note: "Who raised, who launched, who quietly shut down.",
    channels: [{ kind: "rss", href: "https://techcrunch.com/feed/" }],
  },
  {
    slug: "cnbc",
    name: "CNBC",
    href: "https://www.cnbc.com/technology/",
    note: "Mostly the YouTube channel — the interviews say more than the write-ups do.",
    channels: [
      { kind: "youtube", href: "https://www.youtube.com/@CNBC" },
      {
        kind: "rss",
        href: "https://www.cnbc.com/id/19854910/device/rss/rss.html",
        label: "tech rss",
      },
    ],
  },
];
