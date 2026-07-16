/**
 * Tinkerletter issues. Editing this file is the whole listing workflow —
 * same idea as showcase-projects.ts.
 */
export type TinkerIssue = {
  slug: string;
  number: string;
  title: string;
  /** One human sentence. */
  tagline: string;
  date: string;
};

export const TINKER_ISSUES: TinkerIssue[] = [
  {
    slug: "shoe-buyers-field-guide",
    number: "01",
    title: "The Shoe Buyer’s Field Guide",
    tagline:
      "Your shoes already know something about your body that you probably don’t. Let’s see if you can read it.",
    date: "July 2026",
  },
];
