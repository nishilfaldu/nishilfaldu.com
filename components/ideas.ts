/**
 * Open ideas — not a notes dump, a short public tray of thoughts that might
 * become something. Editing this file is the whole workflow.
 */
export type IdeaStatus = "simmering" | "building" | "cooling";

export type Idea = {
  slug: string;
  title: string;
  /** A few sentences in Nishil's voice. */
  body: string;
  status: IdeaStatus;
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
    body: "I usually have a bunch of ideas in my head, and I don’t like crowding my notes app with them. Putting them on this site is a start — a public tray instead of a private pile. Eventually I want something that helps me manage ideas honestly, and is more fun to poke at than a flat list. This page is the first sketch of that feeling.",
    status: "building",
  },
];
