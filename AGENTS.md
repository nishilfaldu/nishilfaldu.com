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
**cooking** when open PRs exist on allowlisted repos. Cooking opens a panel of
live preview links from `/api/cooking`. Breathe opens a quiet cyclic-sigh
overlay (Stanford / Balban et al.) — not a route.

**`/tinkerletter`** — issues in `components/tinkerletter/issues.ts`; pages under
`/tinkerletter/<slug>`. Prose column; interactives in modals, not inline.

**`/scaffolds`** — CLI prompts in `components/scaffolds/`. Ready recipes
(Next, Next+Convex, Expo) + builders (TanStack add-ons, Electron Forge).
Official CLIs, not stale templates. Expo keeps create-expo-app’s AGENTS.md and
installs official Expo Skills into the project (no Cursor Marketplace plugin).

**Cooking (WIP)** — automatic. `/api/cooking` lists open PRs on repos in
`lib/cooking/repos.ts`. Web apps (`try: "preview"`) get Preview URLs from
GitHub Deployments. Native apps (`try: "release"`, e.g. Sediment) get a link
to the latest GitHub Release instead. Title/note from the PR. Repo name →
repo; branch → PR. To watch another product: add one entry to `COOKING_REPOS`
(and grant that repo on `GITHUB_TOKEN`). Do not hand-edit a status file on
`main`.

Env — empty keys live in `.env.example` (copy to `.env.local` locally).
Same names on the Vercel project → Environment Variables (never expose to the
client):

- `GITHUB_TOKEN` — read PRs/deployments/releases; scope to `COOKING_REPOS`
- `NEXT_PUBLIC_SEDIMENT_DOWNLOAD_URL` — optional override for Sediment’s download gate

If preview links ask for a Vercel login, turn off **Deployment Protection** for
Preview in the Vercel project settings so visitors can open them.

**Page files** hold the page component only; everything else in `components/`.

**CSS** — `app/globals.css` is theme + sitewide base only (`@theme` tokens,
body type, selection, focus, reduced-motion). Something belongs there only if
it’s genuinely used in a lot of places. One feature’s motion or layout goes
next to that component (Tailwind first; a co-located `.css` only when keyframes
or selectors can’t live in the component). Don’t invent global classes for a
single UI.
