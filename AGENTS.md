# nishilfaldu.com

Personal site. Live at **nishilfaldu.site** (Vercel, `main`). Repo is named
`.com` but that domain isn’t registered — don’t point anything at it.

**Home** — essay; projects only in narrative order. No grid, cards, or filters.
Hover preview + dash stack are fine; tiles aren’t. Closing line: Projects,
Writings, Tinkerletter, Scaffolds, socials.

**`/projects`** — curated list in `components/showcase-projects.ts`. Story
pages under `/projects/<slug>` (Sediment, Atlas, Cedar).

**`/ideas`** — open loops in `components/ideas.ts`; interactive tray at
`/ideas` (one in focus, draw another). Not a notes dump. Not linked from
home for now.

**`/writings`** — book UI in `components/writings-book.tsx`; pages in
`components/writings.ts`. Turnable leaves (verse / prose / title). Linked
from home.

**Site toolbar** — bottom-left bar (`SiteToolbar`): report, breathe, and
**cooking** when WIP previews exist (`components/previews.ts`). Cooking opens
a panel of live Vercel preview links. Breathe opens a quiet cyclic-sigh
overlay (Stanford / Balban et al.) — not a route.

**`/tinkerletter`** — issues in `components/tinkerletter/issues.ts`; pages under
`/tinkerletter/<slug>`. Prose column; interactives in modals, not inline.

**`/scaffolds`** — CLI prompts in `components/scaffolds/`. Ready recipes
(Next, Next+Convex, Expo) + builders (TanStack add-ons, Electron Forge).
Official CLIs, not stale templates. Expo keeps create-expo-app’s AGENTS.md and
installs official Expo Skills into the project (no Cursor Marketplace plugin).

**WIP previews** — `components/previews.ts` on **main** is the source of truth
(same edit-the-file pattern as ideas). After you push a WIP branch and Vercel
posts a Preview URL, add or update an entry with `title`, `note`, `branch`,
`status`, and `url` (the stable `…-git-…vercel.app` alias from the Vercel bot /
PR comment — not a per-deploy hash). Remove the entry when the work merges.
The toolbar **cooking** tool reads this file; empty list = tool hidden.

If preview links ask for a Vercel login, turn off **Deployment Protection** for
Preview in the Vercel project settings so visitors can open them.

**Page files** hold the page component only; everything else in `components/`.

**CSS** — `app/globals.css` is theme + sitewide base only (`@theme` tokens,
body type, selection, focus, reduced-motion). Something belongs there only if
it’s genuinely used in a lot of places. One feature’s motion or layout goes
next to that component (Tailwind first; a co-located `.css` only when keyframes
or selectors can’t live in the component). Don’t invent global classes for a
single UI.
