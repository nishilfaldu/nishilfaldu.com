/**
 * GitHub: open PRs on a watched repo, plus Preview deployment URLs
 * (Vercel posts these as GitHub Deployments when the project is linked).
 */

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

async function githubJson<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: githubHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `GitHub ${path} → ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }
  return (await res.json()) as T;
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
      .find((p) => p.length > 0) ?? "";

  if (para.length <= 280) return para;
  return `${para.slice(0, 277).trimEnd()}…`;
}
