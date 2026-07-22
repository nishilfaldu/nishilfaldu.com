import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { AGENT_COOKIE, AGENT_COOKIE_MAX_AGE } from "./constants";

function envTrim(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}

function agentAccessSecret(): string | null {
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

async function expectedGateToken(): Promise<string | null> {
  const secret = agentAccessSecret();
  if (!secret) return null;
  return gateToken(secret);
}

type GateFail = { ok: false; status: 401 | 503; error: string };
type GateOk = { ok: true };

/** True when the request carries a valid unlock cookie. */
export async function hasAgentGateCookie(): Promise<boolean> {
  const expected = await expectedGateToken();
  if (!expected) return false;

  const jar = await cookies();
  const cookie = jar.get(AGENT_COOKIE)?.value;
  if (!cookie) return false;

  return tokensEqual(cookie, expected);
}

async function setUnlockCookie(expected: string): Promise<void> {
  const jar = await cookies();
  jar.set(AGENT_COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AGENT_COOKIE_MAX_AGE,
  });
}

/** Cookie-only check for launch. */
export async function requireGateCookie(): Promise<GateOk | GateFail> {
  const expected = await expectedGateToken();
  if (!expected) {
    return {
      ok: false,
      status: 503,
      error: "Agent gate is not configured.",
    };
  }

  const jar = await cookies();
  const cookie = jar.get(AGENT_COOKIE)?.value;
  if (!cookie || !tokensEqual(cookie, expected)) {
    return { ok: false, status: 401, error: "Agent unlock required." };
  }

  return { ok: true };
}

/** Unlock via access code (sets cookie) or accept an existing cookie. */
export async function unlockWithCode(
  accessCode: string,
): Promise<GateOk | GateFail> {
  const expected = await expectedGateToken();
  if (!expected) {
    return {
      ok: false,
      status: 503,
      error: "Agent gate is not configured.",
    };
  }

  const jar = await cookies();
  const cookie = jar.get(AGENT_COOKIE)?.value;
  if (cookie && tokensEqual(cookie, expected)) {
    return { ok: true };
  }

  const code = accessCode.trim();
  if (!code || !tokensEqual(gateToken(code), expected)) {
    return { ok: false, status: 401, error: "Invalid access code." };
  }

  await setUnlockCookie(expected);
  return { ok: true };
}
