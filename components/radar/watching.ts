/**
 * Things I don’t want to find out about late.
 *
 * Not ideas — those live in ideas.ts and are things I might build. These are
 * events I’m waiting on, where the whole value is hearing about it early.
 * `watchingFor` is the specific thing that would count as it happening, and
 * `where` is where I’d expect to see it first.
 */
export type WatchItem = {
  slug: string;
  title: string;
  /** The specific thing. “A community round opens,” not “Nothing news.” */
  watchingFor: string;
  /** Why it matters to me. Paragraphs, in my voice. */
  body?: string[];
  /** Where it would break first. */
  where?: { href: string; label: string; note?: string }[];
};

export const WATCHING: WatchItem[] = [
  {
    slug: "nothing-community-round",
    title: "Nothing opening another community round",
    watchingFor:
      "A community investment round open to ordinary buyers, not just funds.",
    body: [
      "Nothing has raised from its own users before. If they do it again I want to be in the first hour, not reading a recap after it closed.",
      "The whole point of a round like that is that it sells out on enthusiasm. Finding out on time is most of the work.",
    ],
    where: [
      { href: "https://nothing.tech/", label: "nothing.tech" },
      { href: "https://x.com/nothing", label: "@nothing" },
      {
        href: "https://www.crowdcube.com/",
        label: "Crowdcube",
        note: "where a UK community raise would run",
      },
    ],
  },
];
