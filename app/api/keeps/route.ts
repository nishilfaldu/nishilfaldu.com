import { requireGateCookie } from "@nishilfaldu/site-agent/gate";
import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import { todayId } from "@/components/reading/presentation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

/**
 * The only way anything is written to the reading list.
 *
 * Two independent locks, because either one alone is thin. The cookie proves
 * it's me at this browser; the shared secret proves the call came from this
 * server. The secret never leaves the server, so a stranger holding the public
 * Convex URL still can't write — and a stolen cookie can only reach this route,
 * which is rate-limited by being one person's laptop.
 */

export const runtime = "nodejs";

function client(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  return url ? new ConvexHttpClient(url) : null;
}

type Guarded = {
  convex: ConvexHttpClient;
  secret: string;
};

async function authorize(): Promise<Guarded | NextResponse> {
  const gate = await requireGateCookie();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const convex = client();
  const secret = process.env.KEEPS_WRITE_SECRET;
  if (!convex || !secret) {
    return NextResponse.json(
      { error: "Reading list is not configured." },
      { status: 503 },
    );
  }

  return { convex, secret };
}

/**
 * The day a link belongs to is the browser's local date, sent with the request.
 * Calling todayId() here would use this server's clock, and Vercel runs in UTC —
 * so anything kept after ~8pm would file under tomorrow, which is the exact
 * failure convex/schema.ts is written to avoid. The fallback only covers a
 * caller that sends nothing at all.
 */
function dayIdFrom(value: unknown): string {
  const looksLikeADay =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  return looksLikeADay ? value : todayId();
}

/**
 * Convex throws on a secret mismatch. That's a misconfiguration, not a crash:
 * a thrown route returns an HTML 500 that the form can't read, so catch it and
 * answer in the JSON shape the client already handles.
 */
async function mutate<T>(run: () => Promise<T>): Promise<T | NextResponse> {
  try {
    return await run();
  } catch (error) {
    console.error(
      "keeps: mutation failed:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "The reading list refused that." },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const guard = await authorize();
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  const note = typeof body?.note === "string" ? body.note.trim() : null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Not a URL." }, { status: 400 });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Not a URL." }, { status: 400 });
  }

  const result = await mutate(() =>
    guard.convex.mutation(api.keeps.add, {
      secret: guard.secret,
      url: parsed.toString(),
      dayId: dayIdFrom(body?.dayId),
      note: note || null,
    }),
  );
  if (result instanceof NextResponse) return result;

  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const guard = await authorize();
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  if (typeof body?.id !== "string") {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const result = await mutate(() =>
    guard.convex.mutation(api.keeps.remove, {
      secret: guard.secret,
      id: body.id as Id<"links">,
    }),
  );
  if (result instanceof NextResponse) return result;

  return NextResponse.json({ status: "removed" });
}
