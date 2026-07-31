import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import { assertOwner } from "./lib/guard";
import { buildSearchText } from "./lib/searchText";

/** The only shape that leaves this deployment. No _id, no _creationTime. */
function toPublic(doc: Doc<"links">) {
  return {
    id: doc._id as string,
    dayId: doc.dayId,
    url: doc.url,
    title: doc.title,
    description: doc.description,
    thumbnail: doc.thumbnail,
    note: doc.note,
  };
}

/**
 * Public and unauthenticated on purpose — this is what /reading renders, and
 * the site reads it server-side through ConvexHttpClient with ISR.
 *
 * .collect() rather than .take(): the whole archive is the page. Convex will
 * throw past 32k documents, which is a limit worth hitting before optimizing.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("links")
      .withIndex("by_day")
      .order("desc")
      .collect();
    return rows.map(toPublic);
  },
});

export const add = mutation({
  args: {
    secret: v.string(),
    url: v.string(),
    dayId: v.string(),
    note: v.union(v.string(), v.null()),
  },
  handler: async (ctx, { secret, url, dayId, note }) => {
    assertOwner(secret);

    // Same URL twice is a mis-paste, not a second discovery.
    const existing = await ctx.db
      .query("links")
      .withIndex("by_url", (q) => q.eq("url", url))
      .first();
    if (existing) {
      return { status: "duplicate" as const, id: existing._id as string };
    }

    const id = await ctx.db.insert("links", {
      dayId,
      url,
      title: null,
      description: null,
      thumbnail: null,
      note,
      searchText: buildSearchText({ note, url }),
      updatedAt: Date.now(),
    });

    // Titles and thumbnails arrive after the insert — the row appears on the
    // page immediately and fills in, rather than blocking on a slow fetch.
    await ctx.scheduler.runAfter(0, internal.og.fetchAndPatch, { id, url });

    return { status: "created" as const, id: id as string };
  },
});

export const update = mutation({
  args: {
    secret: v.string(),
    id: v.id("links"),
    dayId: v.optional(v.string()),
    title: v.optional(v.union(v.string(), v.null())),
    description: v.optional(v.union(v.string(), v.null())),
    thumbnail: v.optional(v.union(v.string(), v.null())),
    note: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, { secret, id, ...patch }) => {
    assertOwner(secret);

    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("No such link.");

    const merged = { ...existing, ...patch };
    await ctx.db.patch(id, {
      ...patch,
      searchText: buildSearchText(merged),
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { secret: v.string(), id: v.id("links") },
  handler: async (ctx, { secret, id }) => {
    assertOwner(secret);
    // Already gone is the outcome the caller asked for. A double-click or a
    // stale tab shouldn't throw its way back to the browser as a 500.
    if (!(await ctx.db.get(id))) return;
    await ctx.db.delete(id);
  },
});

/**
 * Called by the scheduled OG fetch, not by anyone outside the deployment.
 * Never clobbers a value that's already there — hand-written titles win.
 */
export const patchMetadata = internalMutation({
  args: {
    id: v.id("links"),
    title: v.union(v.string(), v.null()),
    description: v.union(v.string(), v.null()),
    thumbnail: v.union(v.string(), v.null()),
  },
  handler: async (ctx, { id, title, description, thumbnail }) => {
    const existing = await ctx.db.get(id);
    if (!existing) return;

    const merged = {
      title: existing.title ?? title,
      description: existing.description ?? description,
      thumbnail: existing.thumbnail ?? thumbnail,
    };

    await ctx.db.patch(id, {
      ...merged,
      searchText: buildSearchText({
        ...merged,
        note: existing.note,
        url: existing.url,
      }),
      updatedAt: Date.now(),
    });
  },
});
