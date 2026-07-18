# nishilfaldu.com

Personal site. Live at **nishilfaldu.site** (Vercel, `main`). Repo is named
`.com` but that domain isn’t registered — don’t point anything at it.

**Home** — essay; projects only in narrative order. No grid, cards, or filters.
Hover preview + dash stack are fine; tiles aren’t.

**`/projects`** — curated list in `components/showcase-projects.ts`. Story
pages under `/projects/<slug>` (Sediment, Atlas, Cedar).

**`/ideas`** — open loops in `components/ideas.ts`; interactive tray at
`/ideas` (one in focus, draw another). Not a notes dump.

**`/tinkerletter`** — issues in `components/tinkerletter/issues.ts`; pages under
`/tinkerletter/<slug>`. Prose column; interactives in modals, not inline.

**`/scaffolds`** — CLI prompts in `components/scaffolds/`. Ready recipes
(Next, Next+Convex, Expo) + builders (TanStack add-ons, Electron Forge).
Official CLIs, not stale templates. Expo keeps create-expo-app’s AGENTS.md and
installs official Expo Skills into the project (no Cursor Marketplace plugin).

**Page files** hold the page component only; everything else in `components/`.

**Theme** — CSS variables at the top of `app/globals.css` (Geist values;
borrowed, not ours to republish).
