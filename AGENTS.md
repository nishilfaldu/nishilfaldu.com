# nishilfaldu.com

Nishil Faldu's personal site. The front page is an essay about how he got
here, with twenty-one projects linked inside the sentences that explain why
they exist.

On the essay, the work only means anything in the order it happened. So it has
no project grid, no cards, no filters — anything that lifts a project out of
the narrative and into a tile is working against that page. Hovering a project
link previews it; the dash stack on the right indexes it; neither breaks the
prose.

`/projects` is the one deliberate exception, decided 2026-07-16: a curated
showcase — only the work he's proud of — as a carousel of live-site previews
with a Mac-style dock of lettermark tiles below. The curated list is
`components/showcase-projects.ts`; editing that file is the whole workflow.
`scripts/capture-showcase.mjs` screenshots the deployed entries into
`public/showcase/`. The dock pattern stays on this page only.

**A page file holds the page component and nothing else.** Everything else goes
in `components/`, however small or single-use.

The whole theme is a few variables at the top of `app/globals.css`. The values
are Geist's, borrowed for our own stylesheet — not ours to republish as a system
of our own.

Live at **nishilfaldu.site**, deployed from `main` by Vercel. `www` redirects to
the apex. The repo is named `.com`, but **that domain isn't registered** — the
name is aspirational, and nothing should point at it until someone buys it.
