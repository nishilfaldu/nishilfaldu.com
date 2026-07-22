import { NextResponse } from "next/server";
import { assertAgentAccess } from "@/lib/agent/gate";

export const runtime = "nodejs";

/**
 * One-shot unlock for the owner-only agent control.
 * Visit `/api/agent/unlock?code=AGENT_ACCESS_SECRET` — sets the httpOnly
 * cookie (30 days) and redirects home. The agent button only mounts when
 * that cookie is present.
 */
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code") ?? "";
  const gate = await assertAgentAccess(code || undefined);
  if (!gate.ok) {
    return new NextResponse(gate.error, {
      status: gate.status,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.redirect(new URL("/", request.url), {
    headers: { "Cache-Control": "no-store" },
  });
}
