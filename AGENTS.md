# nishilfaldu.com

Nishil Faldu's personal site. One page: an essay about how he got here, with
twenty-one projects linked inside the sentences that explain why they exist.

The work only means anything in the order it happened, so there's no project
grid, no cards, no filters. Anything that lifts a project out of the narrative
and into a tile is working against the page.

Next 16, React 19, Tailwind v4, Biome, pnpm. Scripts are in `package.json`; the
rules that bite are commented where they bite.

**A page file contains the page component and nothing else.** Everything else
goes in `components/`, however small or single-use.

**There is no design system, on purpose.** There was one — Sunny: a workspace
package, OKLCH tokens, a generated theme, a contrast audit, five docs pages
under `/design`. Deleted 2026-07-16, because it documented a component library
that didn't exist for a site that hadn't been built. It's recoverable at commit
`d46ce2b` — check it out rather than rebuilding it from memory. Don't add a
scale, a generator, or a docs page; components get extracted when a second page
needs them.

**The colours are Geist's, borrowed as paint, not adopted as a brand.**
`public/design.md` was once `vercel.com/design.md` copied verbatim — "Vercel's
Geist design system" and all — served from Nishil's domain. It was deleted.
Don't recreate a `/design` route or anything that publishes these values as a
system this site owns.

## Roadmap

1. `README.md` is still create-next-app text.
2. Not deployed from this repo yet. The live site is `nishilfaldu.site` (one
   hand-written `index.html`), which this replaces. `layout.tsx` sets canonical
   to `nishilfaldu.com` — confirm which domain wins, and redirect the other.
