/**
 * The twenty-one projects, once.
 *
 * The essay is still where they live; this is the index of it. <Toc /> reads
 * ids and labels to build the dash stack, <ProjectPreview /> reads repos and
 * blurbs to build the hover cards. Order is reading order, not importance.
 *
 * Blurbs are lifted from the essay's own sentences — they're Nishil's phrasing,
 * shortened, not new copy.
 */
export type Project = {
  /** The `p-*` anchor the prose link carries. */
  id: string;
  /** Short name, as shown in the TOC. */
  label: string;
  /** Repo name under github.com/nishilfaldu. */
  repo: string;
  /** One line, in the essay's voice. */
  blurb: string;
};

export const PROJECTS: Project[] = [
  {
    id: "p-save-the-roadster",
    label: "C++ game",
    repo: "save-the-roadster",
    blurb: "A game in C++ — the first thing I actually wanted to build.",
  },
  {
    id: "p-ml-deep-learning-courses",
    label: "Andrew Ng courses",
    repo: "ml-deep-learning-courses",
    blurb: "All the Andrew Ng courses, worked through with handwritten notes.",
  },
  {
    id: "p-bert-sentiment-pytorch",
    label: "First model",
    repo: "bert-sentiment-pytorch",
    blurb: "My first real model — it learned to read the mood of a review.",
  },
  {
    id: "p-insite-factcheck",
    label: "Fact checker",
    repo: "insite-factcheck",
    blurb: "A fact checker for COVID misinformation, built at a hackathon.",
  },
  {
    id: "p-hackathon-stats-dashboard",
    label: "Stats dashboard",
    repo: "hackathon-stats-dashboard",
    blurb: "A stats dashboard for a hackathon I was helping run.",
  },
  {
    id: "p-campaign-websites",
    label: "Campaign sites",
    repo: "campaign-websites",
    blurb:
      "Three campaign sites for friends in student government, one a year.",
  },
  {
    id: "p-eventure",
    label: "Event app",
    repo: "eventure",
    blurb:
      "An app for planning events — my senior project, built over video calls.",
  },
  {
    id: "p-alterna-canvas",
    label: "Canvas",
    repo: "alterna-canvas",
    blurb:
      "A take on Canvas where keeping up with coursework grew a small garden.",
  },
  {
    id: "p-coursework",
    label: "Coursework",
    repo: "coursework",
    blurb: "My old coursework, still up, kept because I liked it.",
  },
  {
    id: "p-cedar-lang",
    label: "Compiler",
    repo: "cedar-lang",
    blurb: "A small compiler in Go, from scratch, just to see if I could.",
  },
  {
    id: "p-lda-models",
    label: "Topic model",
    repo: "lda-models",
    blurb:
      "A model that surfaces the hidden themes in a million news headlines.",
  },
  {
    id: "p-easy-rag",
    label: "RAG",
    repo: "easy-rag",
    blurb: "A way to spin up chatbots that actually know your own documents.",
  },
  {
    id: "p-vector-search-ecommerce",
    label: "Vector search",
    repo: "vector-search-ecommerce",
    blurb: "A store where search lives entirely inside the database.",
  },
  {
    id: "p-smart-reviewer",
    label: "News reviewer",
    repo: "smart-reviewer",
    blurb: "A little news reviewer, from a company's take-home.",
  },
  {
    id: "p-neon-nerdsnipe",
    label: "Login agent",
    repo: "neon-nerdsnipe",
    blurb: "An agent sent to crack a login puzzle.",
  },
  {
    id: "p-atlas",
    label: "Atlas",
    repo: "atlas",
    blurb: "A tool to catch the mistakes an AI makes in code.",
  },
  {
    id: "p-sediment",
    label: "Sediment",
    repo: "sediment",
    blurb: "One place to throw every bit of inspiration I find.",
  },
  {
    id: "p-mcp-servers",
    label: "MCP servers",
    repo: "mcp-servers",
    blurb:
      "A few small servers so an agent can reach into my calendar and inbox.",
  },
  {
    id: "p-reachcast",
    label: "Raycast extension",
    repo: "reachcast",
    blurb: "A Raycast extension for the cold emails.",
  },
  {
    id: "p-pulse",
    label: "Pulse",
    repo: "pulse",
    blurb: "A game where everyone gets the same single quest each day.",
  },
  {
    id: "p-belle",
    label: "Belle",
    repo: "belle",
    blurb: "A storefront for a patisserie. Half-finished, and that was enough.",
  },
];
