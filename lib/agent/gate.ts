import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { agentAccessSecret } from "@/lib/agent/config";
import { AGENT_COOKIE, AGENT_COOKIE_MAX_AGE } from "@/lib/agent/constants";

function gateToken(secret: string): string {
  return createHash("sha256").update(`nf-agent:${secret}`).digest("hex");
}

function secretsEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** True when the request carries a valid unlock cookie. */
export async function hasAgentGateCookie(): Promise<boolean> {
  const secret = agentAccessSecret();
  if (!secret) return false;

  const jar = await cookies();
  const value = jar.get(AGENT_COOKIE)?.value;
  if (!value) return false;

  return secretsEqual(value, gateToken(secret));
}

/**
 * Accept either a valid cookie or a matching access code.
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

  if (await hasAgentGateCookie()) {
    return { ok: true };
  }

  const code = accessCode?.trim() ?? "";
  if (!code || !secretsEqual(code, secret)) {
    return { ok: false, status: 401, error: "Invalid access code." };
  }

  const jar = await cookies();
  jar.set(AGENT_COOKIE, gateToken(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AGENT_COOKIE_MAX_AGE,
  });

  return { ok: true };
}
