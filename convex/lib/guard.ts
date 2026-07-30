/*
 * Every public Convex mutation is callable by anyone who knows the deployment
 * URL, and that URL is not a secret — it ships in the site's env. The cookie
 * gate that fronts these writes lives on the site (app/api/keeps), not here, so
 * it protects the route and nothing else. This is the check that protects the
 * database: the site's server passes a shared secret that only it and this
 * deployment know.
 */

/**
 * node:crypto's timingSafeEqual is only available inside "use node" actions,
 * and this runs in the default runtime — so compare by hand. Length is allowed
 * to leak; that's true of timingSafeEqual too.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Throws unless the caller proved it's the site's server. */
export function assertOwner(secret: string): void {
  const expected = process.env.KEEPS_WRITE_SECRET;
  if (!expected) {
    // Fail closed. An unset secret must never mean "everyone is the owner".
    throw new Error("KEEPS_WRITE_SECRET is not set on this deployment.");
  }
  if (!constantTimeEqual(secret, expected)) {
    throw new Error("Not authorized.");
  }
}
