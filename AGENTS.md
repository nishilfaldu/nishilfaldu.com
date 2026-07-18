# nishilfaldu.com

Personal site. Live at **nishilfaldu.site** (Vercel, `main`). Repo is named
`.com` but that domain isn’t registered — don’t point anything at it.

**Home** — essay; projects only in narrative order. No grid, cards, or filters.
Hover preview + dash stack are fine; tiles aren’t.

**`/projects`** — curated list in `components/showcase-projects.ts`. Story
pages under `/projects/<slug>` (Sediment, Atlas, Cedar).

**`/ideas`** — open loops in `components/ideas.ts`; interactive tray at
`/ideas` (one in focus, draw another). Not a notes dump. Not linked from
home for now.

**`/writings`** — book UI in `components/writings-book.tsx`; pages in
`components/writings.ts`. Turnable leaves (verse / prose / title). Linked
from home.

**`/tinkerletter`** — issues in `components/tinkerletter/issues.ts`; pages under
`/tinkerletter/<slug>`. Prose column; interactives in modals, not inline.

**`/scaffolds`** — CLI prompts in `components/scaffolds/`. Ready recipes
(Next, Next+Convex, Expo) + builders (TanStack add-ons, Electron Forge).
Official CLIs, not stale templates. Expo keeps create-expo-app’s AGENTS.md and
installs official Expo Skills into the project (no Cursor Marketplace plugin).

**`/previews`** — “In the works”: live Vercel preview links for WIP branches.
Source of truth is `components/previews.ts` on **main** (same edit-the-file
pattern as ideas). After you push a WIP branch and Vercel posts a Preview URL,
add or update an entry with `title`, `note`, `branch`, `status`, and `url`
(the stable `…-git-…vercel.app` alias from the Vercel bot / PR comment — not a
per-deploy hash). Remove the entry when the work merges. Linked from home.

If preview links ask for a Vercel login, turn off **Deployment Protection** for
Preview in the Vercel project settings so visitors can open them.

**Page files** hold the page component only; everything else in `components/`.

**Theme** — CSS variables at the top of `app/globals.css` (Geist values;
borrowed, not ours to republish).
