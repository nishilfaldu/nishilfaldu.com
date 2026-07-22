import { NextResponse } from "next/server";
import { aggregateCooking } from "@/lib/cooking/aggregate";
import type { CookingResponse } from "@/lib/cooking/types";

export const revalidate = 60;

/**
 * Live WIP: open PRs on repos the GITHUB_TOKEN can read + Preview / Release
 * try-links. Server-only secret: GITHUB_TOKEN. See .env.example.
 */
export async function GET() {
  try {
    const { items, watching } = await aggregateCooking();
    const body: CookingResponse = { items, watching };
    return NextResponse.json(body, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    // Empty list hides pulse; watching stays empty. No client error UI.
    const body: CookingResponse = { items: [], watching: [] };
    return NextResponse.json(body, {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
