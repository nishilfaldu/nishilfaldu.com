import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/*
 * One table, one owner.
 *
 * Sediment scopes every row by `userId` because it has real users. This
 * deployment serves exactly one person, so there is no `userId` here and the
 * owner check lives on the write path instead (convex/lib/guard.ts). Reads are
 * public by design — this table *is* the /reading page.
 *
 * `dayId` is a LOCAL calendar date string ("2026-07-30"), not a timestamp.
 * That's the one idea worth copying wholesale from Sediment: it makes "group by
 * the day I found it" an index read rather than a range query, and it's why a
 * link saved at 11pm stays on today's board instead of jumping to tomorrow's
 * the way a UTC timestamp would.
 */
export default defineSchema({
  links: defineTable({
    dayId: v.string(),
    url: v.string(),
    title: v.union(v.string(), v.null()),
    description: v.union(v.string(), v.null()),
    thumbnail: v.union(v.string(), v.null()),
    /** Why I kept it. Public — the add form says so at the point of writing. */
    note: v.union(v.string(), v.null()),
    searchText: v.string(),
    updatedAt: v.number(),
  })
    .index("by_day", ["dayId"])
    .index("by_url", ["url"])
    /*
     * Unused today: the page ships the whole archive to the client and filters
     * there, which is instant and costs no round trip per keystroke. The index
     * is declared anyway because it's one line, and the day the payload gets
     * too big to ship the escape hatch is a query, not a migration.
     */
    .searchIndex("search_links", { searchField: "searchText" }),
});
