/**
 * Secondary rooms of the site — anything that isn’t the essay, projects,
 * writings, or tinkerletter. Editing this file is how new destinations join
 * the site without growing the home footer.
 *
 * Home links here once (“Elsewhere”). Add rooms here; don’t append them to
 * the essay’s closing line.
 */

export type ElsewhereRoom = {
  href: `/${string}`;
  name: string;
  /** One short clause — what this room is for. */
  note: string;
};

export const ELSEWHERE: ElsewhereRoom[] = [
  {
    href: "/ideas",
    name: "Ideas",
    note: "Open loops I’m willing to put on the site — a tray, not a notes dump.",
  },
  {
    href: "/scaffolds",
    name: "Scaffolds",
    note: "Prompts that spin up Next, Convex, Expo, TanStack, Electron the way I always do.",
  },
  {
    href: "/previews",
    name: "In the works",
    note: "Live Vercel previews of branches that haven’t landed yet.",
  },
];
