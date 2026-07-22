import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { AGENT_COOKIE, AGENT_COOKIE_MAX_AGE } from "@/lib/agent/constants";

function envTrim(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}

export function agentAccessSecret(): string | null {
  return envTrim("AGENT_ACCESS_SECRET");
}

function gateToken(secret: string): string {
  return createHash("sha256").update(`nf-agent:${secret}`).digest("hex");
}

function tokensEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * Accept a valid unlock cookie or a matching access code.
 * On a fresh code match, set the unlock cookie for later visits.
 */
export async function assertAgentAccess(
  accessCode: string | undefined,
): Promise<{ ok: true } | { ok: false; status: 401 | 503; error: string }> {
  const secret = agentAccessSecret();
  if (!secret) {
    return {
      ok: false,
      status: 503,
      error: "Agent gate is not configured.",
    };
  }

  const expected = gateToken(secret);
  const jar = await cookies();
  const cookie = jar.get(AGENT_COOKIE)?.value;
  if (cookie && tokensEqual(cookie, expected)) {
    return { ok: true };
  }

  const code = accessCode?.trim() ?? "";
  if (!code || !tokensEqual(gateToken(code), expected)) {
    return { ok: false, status: 401, error: "Invalid access code." };
  }

  jar.set(AGENT_COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AGENT_COOKIE_MAX_AGE,
  });

  return { ok: true };
}
