import { NextResponse } from "next/server";
import { aggregateCooking } from "@/lib/cooking/aggregate";
import type { CookingResponse } from "@/lib/cooking/types";

export const revalidate = 60;

/**
 * Live WIP: open PRs on allowlisted repos + GitHub Preview deployment URLs.
 * Server-only secret: GITHUB_TOKEN. See .env.example.
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
  } catch {
    // Empty list hides the cooking tool; no client error UI.
    const body: CookingResponse = { items: [] };
    return NextResponse.json(body, {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
