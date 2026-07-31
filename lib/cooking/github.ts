/**
 * GitHub: repos the token can read, open PRs, Preview deployment URLs
 * (Vercel posts these as GitHub Deployments when the project is linked).
 */

export type AccessibleRepo = {
  owner: string;
  repo: string;
};

export type OpenPull = {
  number: number;
  title: string;
  body: string | null;
  branch: string;
  sha: string;
  prUrl: string;
  updatedAt: string;
};

export type GithubPreview = {
  state: "success" | "pending" | "failure" | "error" | "inactive" | "unknown";
  url: string | null;
  updatedAt: string | null;
};

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "nishilfaldu-site-cooking",
  };
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** Carries the status so callers can tell "no such thing" from "couldn't ask". */
class GithubHttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "GithubHttpError";
    this.status = status;
  }
}

async function githubJson<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: githubHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new GithubHttpError(
      res.status,
      `GitHub ${path} → ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }
  return (await res.json()) as T;
}

type GhRepo = {
  name: string;
  full_name: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  pushed_at: string | null;
  owner: { login: string };
};

/** Drop long-idle repos so a broad PAT doesn’t flood the tray. */
const MAX_IDLE_MS = 540 * 24 * 60 * 60 * 1000; // ~18 months

/**
 * Repos the GITHUB_TOKEN can see, minus the ones that have no business on a
 * public page. Skips private repos, forks, archived repos, and long-idle ones.
 *
 * Private is the load-bearing one: /api/cooking is unauthenticated, so repo
 * names, PR titles and PR body text go to anyone who asks. The token's grant
 * list is a convenience, not an allowlist — widen the token by one repo and it
 * would publish without a deploy. This filter is the allowlist.
 */
export async function listAccessibleRepos(): Promise<AccessibleRepo[]> {
  const out: AccessibleRepo[] = [];
  const now = Date.now();
  // Cap pages so a broad classic PAT cannot turn every request into a crawl.
  const maxPages = 3;
  for (let page = 1; page <= maxPages; page++) {
    const batch = await githubJson<GhRepo[]>(
      `/user/repos?per_page=100&page=${page}&affiliation=owner,collaborator&sort=pushed`,
    );
    for (const r of batch) {
      if (r.private || r.fork || r.archived) continue;
      if (r.pushed_at) {
        const pushed = Date.parse(r.pushed_at);
        if (!Number.isNaN(pushed) && now - pushed > MAX_IDLE_MS) continue;
      }
      out.push({ owner: r.owner.login, repo: r.name });
    }
    if (batch.length < 100) break;
  }
  return out;
}

type GhPull = {
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  updated_at: string;
  head: { ref: string; sha: string };
};

export async function listOpenPulls(
  owner: string,
  repo: string,
): Promise<OpenPull[]> {
  const pulls = await githubJson<GhPull[]>(
    `/repos/${owner}/${repo}/pulls?state=open&per_page=20&sort=updated&direction=desc`,
  );
  return pulls.map((p) => ({
    number: p.number,
    title: p.title,
    body: p.body,
    branch: p.head.ref,
    sha: p.head.sha,
    prUrl: p.html_url,
    updatedAt: p.updated_at,
  }));
}

type GhDeployment = {
  id: number;
  sha: string;
  environment: string;
  updated_at: string;
};

type GhDeploymentStatus = {
  state: string;
  environment_url: string | null;
  created_at: string;
};

const KNOWN_STATES = [
  "success",
  "pending",
  "failure",
  "error",
  "inactive",
] as const;

function mapState(raw: string): GithubPreview["state"] {
  return KNOWN_STATES.includes(raw as (typeof KNOWN_STATES)[number])
    ? (raw as (typeof KNOWN_STATES)[number])
    : "unknown";
}

/**
 * Latest Preview deployment per commit SHA (one list request, then statuses
 * only for SHAs we care about).
 */
export async function previewsForShas(
  owner: string,
  repo: string,
  shas: ReadonlySet<string>,
): Promise<Map<string, GithubPreview>> {
  const out = new Map<string, GithubPreview>();
  if (shas.size === 0) return out;

  const deployments = await githubJson<GhDeployment[]>(
    `/repos/${owner}/${repo}/deployments?per_page=30`,
  );

  const matched: GhDeployment[] = [];
  const seenSha = new Set<string>();
  for (const d of deployments) {
    if (d.environment !== "Preview" || !shas.has(d.sha) || seenSha.has(d.sha)) {
      continue;
    }
    seenSha.add(d.sha);
    matched.push(d);
  }

  await Promise.all(
    matched.map(async (d) => {
      const statuses = await githubJson<GhDeploymentStatus[]>(
        `/repos/${owner}/${repo}/deployments/${d.id}/statuses`,
      );
      const latest = statuses[0];
      if (!latest) {
        out.set(d.sha, {
          state: "pending",
          url: null,
          updatedAt: d.updated_at,
        });
        return;
      }
      out.set(d.sha, {
        state: mapState(latest.state),
        url: latest.environment_url,
        updatedAt: latest.created_at,
      });
    }),
  );

  return out;
}

type GhRelease = {
  html_url: string;
  tag_name: string;
  published_at: string | null;
};

/**
 * Latest published release for a native app.
 *
 * A 404 is real knowledge — the repo exists and has published nothing yet — so
 * the releases index is a fair link. A rate limit or a network failure is not
 * knowledge, and inventing a link for it hands out a dead end dressed as a
 * download. Those return null and the card simply has no try-link.
 */
export async function latestRelease(
  owner: string,
  repo: string,
): Promise<{ url: string; updatedAt: string | null } | null> {
  try {
    const release = await githubJson<GhRelease>(
      `/repos/${owner}/${repo}/releases/latest`,
    );
    return {
      url: release.html_url,
      updatedAt: release.published_at,
    };
  } catch (error) {
    if (error instanceof GithubHttpError && error.status === 404) {
      return {
        url: `https://github.com/${owner}/${repo}/releases`,
        updatedAt: null,
      };
    }
    return null;
  }
}

/** First readable paragraph from a PR body for the cooking note. */
export function noteFromPrBody(body: string | null | undefined): string {
  if (!body) return "";
  const cleaned = body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
  if (!cleaned) return "";

  const para =
    cleaned
      .split(/\n{2,}/)
      .map((p) =>
        p
          .replace(/^#+\s+/gm, "")
          .replace(/^\*\*[^*]+\*\*\s*/gm, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/[*_`]/g, "")
          .replace(/\s+/g, " ")
          .trim(),
      )
      .find((p) => {
        if (!p.length) return false;
        // Skip lone section headings from PR templates.
        if (/^(summary|test plan|overview)$/i.test(p)) return false;
        return true;
      }) ?? "";

  if (para.length <= 280) return para;
  return `${para.slice(0, 277).trimEnd()}…`;
}
