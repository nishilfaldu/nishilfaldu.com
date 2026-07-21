/**
 * Curated TanStack CLI add-ons for the /scaffolds builder.
 * Refresh from: pnpm dlx @tanstack/cli@latest create --list-add-ons --json
 */

export type AddonGroupId = "tanstack" | "database" | "orm" | "auth" | "deploy";

export type TanstackAddon = {
  id: string;
  name: string;
  /** Short line under the name. */
  blurb: string;
  group: AddonGroupId;
  /** CLI exclusive buckets — only one addon from each bucket may be selected. */
  exclusive?: string[];
};

export type AddonGroup = {
  id: AddonGroupId;
  label: string;
  /** multi = checkboxes; single = radio including “none”. */
  mode: "multi" | "single";
  addons: TanstackAddon[];
};

export const TANSTACK_ADDON_GROUPS: AddonGroup[] = [
  {
    id: "tanstack",
    label: "TanStack libraries",
    mode: "multi",
    addons: [
      {
        id: "tanstack-query",
        name: "Query",
        blurb: "Async state, caching, and server data.",
        group: "tanstack",
      },
      {
        id: "store",
        name: "Store",
        blurb: "Client state with signals-style updates.",
        group: "tanstack",
      },
      {
        id: "db",
        name: "DB",
        blurb: "Reactive client datastore.",
        group: "tanstack",
      },
      {
        id: "form",
        name: "Form",
        blurb: "Headless forms and validation.",
        group: "tanstack",
      },
      {
        id: "table",
        name: "Table",
        blurb: "Headless tables.",
        group: "tanstack",
      },
      {
        id: "ai",
        name: "AI",
        blurb: "Streaming chat UI with a model-agnostic backend.",
        group: "tanstack",
      },
    ],
  },
  {
    id: "database",
    label: "Database",
    mode: "single",
    addons: [
      {
        id: "convex",
        name: "Convex",
        blurb: "Reactive backend and database.",
        group: "database",
        exclusive: ["database", "orm"],
      },
      {
        id: "neon",
        name: "Neon",
        blurb: "Serverless Postgres.",
        group: "database",
        exclusive: ["database"],
      },
      {
        id: "powersync",
        name: "PowerSync",
        blurb: "Sync engine for local-first apps.",
        group: "database",
        exclusive: ["database"],
      },
    ],
  },
  {
    id: "orm",
    label: "ORM",
    mode: "single",
    addons: [
      {
        id: "drizzle",
        name: "Drizzle",
        blurb: "TypeScript ORM / query builder.",
        group: "orm",
        exclusive: ["orm"],
      },
      {
        id: "prisma",
        name: "Prisma",
        blurb: "Schema-first ORM with migrations.",
        group: "orm",
        exclusive: ["orm"],
      },
    ],
  },
  {
    id: "auth",
    label: "Auth",
    mode: "single",
    addons: [
      {
        id: "clerk",
        name: "Clerk",
        blurb: "Hosted auth with prebuilt UI.",
        group: "auth",
        exclusive: ["auth"],
      },
      {
        id: "better-auth",
        name: "Better Auth",
        blurb: "Self-hosted auth framework.",
        group: "auth",
        exclusive: ["auth"],
      },
      {
        id: "workos",
        name: "WorkOS",
        blurb: "Enterprise SSO and directory sync.",
        group: "auth",
        exclusive: ["auth"],
      },
    ],
  },
  {
    id: "deploy",
    label: "Deploy",
    mode: "single",
    addons: [
      {
        id: "cloudflare",
        name: "Cloudflare",
        blurb: "Workers / edge.",
        group: "deploy",
        exclusive: ["deploy"],
      },
      {
        id: "netlify",
        name: "Netlify",
        blurb: "Netlify Functions and Edge.",
        group: "deploy",
        exclusive: ["deploy"],
      },
      {
        id: "nitro",
        name: "Nitro",
        blurb: "Portable server adapter.",
        group: "deploy",
        exclusive: ["deploy"],
      },
      {
        id: "railway",
        name: "Railway",
        blurb: "Full-stack Node hosting.",
        group: "deploy",
        exclusive: ["deploy"],
      },
    ],
  },
];

export const DEFAULT_SELECTED_ADDONS = ["tanstack-query"] as const;

/** Exclusive buckets claimed by the current selection. */
export function claimedExclusiveBuckets(
  selectedIds: readonly string[],
): Set<string> {
  const claimed = new Set<string>();
  for (const group of TANSTACK_ADDON_GROUPS) {
    for (const addon of group.addons) {
      if (!selectedIds.includes(addon.id)) continue;
      for (const bucket of addon.exclusive ?? []) {
        claimed.add(bucket);
      }
    }
  }
  return claimed;
}

/** Whether selecting this addon is allowed given current selection (ignoring itself). */
export function isAddonDisabled(
  addon: TanstackAddon,
  selectedIds: readonly string[],
): boolean {
  if (selectedIds.includes(addon.id)) return false;
  const others = selectedIds.filter((id) => id !== addon.id);
  const claimed = claimedExclusiveBuckets(others);
  for (const bucket of addon.exclusive ?? []) {
    if (claimed.has(bucket)) return true;
  }
  // Convex claims orm — disable all orm addons when convex is selected
  if (addon.group === "orm" && others.includes("convex")) return true;
  return false;
}

export function addonsForCli(selectedIds: readonly string[]): string[] {
  const order = TANSTACK_ADDON_GROUPS.flatMap((g) => g.addons.map((a) => a.id));
  return order.filter((id) => selectedIds.includes(id));
}
