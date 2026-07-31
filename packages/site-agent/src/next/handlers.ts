import { NextResponse } from "next/server";
import {
  type AgentLaunchError,
  type AgentLaunchSuccess,
  MAX_PAGE_PATH_CHARS,
  MAX_PROMPT_CHARS,
  resolveRepo,
  type SiteAgentConfig,
} from "../constants";
import { createCloudAgent, cursorApiKey } from "../cursor";
import { requireGateCookie, unlockWithCode } from "../gate";
import { unlockFormHtml } from "./unlock-form";

type ParsedBody = {
  prompt: string;
  pagePath: string;
};

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseBody(value: unknown): ParsedBody | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  return {
    prompt: readString(record.prompt),
    pagePath: readString(record.pagePath).slice(0, MAX_PAGE_PATH_CHARS),
  };
}

function jsonError(error: string, status: number) {
  const body: AgentLaunchError = { error };
  return NextResponse.json(body, { status });
}

function html(body: string, status: number) {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Next.js App Router handlers for launch + unlock.
 *
 * ```ts
 * const agent = createSiteAgent(config);
 * // app/api/agent/route.ts
 * export const { POST, runtime } = agent.launch;
 * // app/api/agent/unlock/route.ts
 * export const { GET, POST, runtime } = agent.unlock;
 * ```
 */
export function createSiteAgent(config: SiteAgentConfig) {
  const { repoUrl, startingRef } = resolveRepo(config);
  const runtime = "nodejs" as const;

  async function launchPost(request: Request) {
    // The gate answers first, before anything else can. Checking CURSOR_API_KEY
    // ahead of it let a stranger tell a misconfigured deployment from a working
    // one, and a 400 on a malformed body told them the route was real.
    const gate = await requireGateCookie();
    if (!gate.ok) {
      return jsonError(gate.error, gate.status);
    }

    const apiKey = cursorApiKey();
    if (!apiKey) {
      return jsonError("CURSOR_API_KEY is not configured.", 503);
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return jsonError("Invalid JSON body.", 400);
    }

    const parsed = parseBody(json);
    if (!parsed) {
      return jsonError("Invalid JSON body.", 400);
    }

    if (!parsed.prompt) {
      return jsonError("Prompt is required.", 400);
    }
    if (parsed.prompt.length > MAX_PROMPT_CHARS) {
      return jsonError(
        `Prompt must be at most ${MAX_PROMPT_CHARS} characters.`,
        400,
      );
    }

    const fullPrompt = parsed.pagePath
      ? `${parsed.prompt}\n\n(Launched from site path: ${parsed.pagePath})`
      : parsed.prompt;

    try {
      const agent = await createCloudAgent({
        apiKey,
        prompt: fullPrompt,
        repoUrl,
        startingRef,
      });
      const body: AgentLaunchSuccess = agent;
      return NextResponse.json(body, {
        headers: { "Cache-Control": "no-store" },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create agent.";
      console.error("Cloud agent create failed:", message);
      return jsonError("Could not start the cloud agent.", 502);
    }
  }

  function home(request: Request) {
    // 303, not the default 307: a 307 replays the POST at "/", and the browser
    // would ask to resubmit the code on every back-button press.
    return NextResponse.redirect(new URL("/", request.url), {
      status: 303,
      headers: { "Cache-Control": "no-store" },
    });
  }

  /**
   * The code arrives in a form body, never in the query string. A `?code=`
   * lands in browser history, in the Referer of the next request, and in every
   * access log between here and the edge — which is a long life for the one
   * secret that unlocks the site.
   */
  async function unlockGet(request: Request) {
    if ((await requireGateCookie()).ok) return home(request);
    return html(unlockFormHtml(), 200);
  }

  async function unlockPost(request: Request) {
    const form = await request.formData().catch(() => null);
    const code = form?.get("code");
    const gate = await unlockWithCode(typeof code === "string" ? code : "");
    if (!gate.ok) {
      return html(unlockFormHtml(gate.error), gate.status);
    }

    return home(request);
  }

  return {
    launch: { POST: launchPost, runtime },
    unlock: { GET: unlockGet, POST: unlockPost, runtime },
  };
}
