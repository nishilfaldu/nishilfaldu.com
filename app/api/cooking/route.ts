import { NextResponse } from "next/server";
import type { CookingResponse } from "@/components/cooking";
import { aggregateCooking } from "@/lib/cooking/aggregate";

export const revalidate = 60;

/**
 * Live WIP: open PRs on allowlisted repos + preview deploy status.
 * Secrets stay server-side (GITHUB_TOKEN, VERCEL_TOKEN, VERCEL_TEAM_ID).
 * See .env.example. Vercel project ids are resolved from GitHub repos at runtime.
 */
export async function GET() {
  try {
    const items = await aggregateCooking();
    const body: CookingResponse = { items };
    return NextResponse.json(body, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load cooking status";
    const body: CookingResponse = { items: [], error: message };
    return NextResponse.json(body, {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
