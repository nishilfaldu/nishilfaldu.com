# nishilfaldu.com

Nishil Faldu's personal site. One page: an essay about how he got here, with
twenty-one projects linked inside the sentences that explain why they exist.

The work only means anything in the order it happened. So there's no project
grid, no cards, no filters — anything that lifts a project out of the narrative
and into a tile is working against the page.

**A page file holds the page component and nothing else.** Everything else goes
in `components/`, however small or single-use.

The whole theme is a few variables at the top of `app/globals.css`. The values
are Geist's, borrowed for our own stylesheet — not ours to republish as a system
of our own.

## Roadmap

1. Not deployed from this repo yet. The live site is `nishilfaldu.site`, which
   this replaces. `layout.tsx` sets canonical to `nishilfaldu.com` — confirm
   which domain wins, and redirect the other.
