/**
 * GitHub: open PRs on a watched repo, plus Preview deployment URLs
 * (Vercel posts these as GitHub Deployments).
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
    // Always fresh when the route revalidates.
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

/**
 * Latest Preview deployment status for a commit SHA (Vercel → GitHub Deployments).
 */
export async function previewForSha(
  owner: string,
  repo: string,
  sha: string,
): Promise<GithubPreview | null> {
  const deployments = await githubJson<GhDeployment[]>(
    `/repos/${owner}/${repo}/deployments?per_page=30`,
  );
  const match = deployments.find(
    (d) => d.environment === "Preview" && d.sha === sha,
  );
  if (!match) return null;

  const statuses = await githubJson<GhDeploymentStatus[]>(
    `/repos/${owner}/${repo}/deployments/${match.id}/statuses`,
  );
  const latest = statuses[0];
  if (!latest) {
    return {
      state: "pending",
      url: null,
      updatedAt: match.updated_at,
    };
  }

  const raw = latest.state;
  const known = ["success", "pending", "failure", "error", "inactive"] as const;
  const state: GithubPreview["state"] = known.includes(
    raw as (typeof known)[number],
  )
    ? (raw as (typeof known)[number])
    : "unknown";

  return {
    state,
    url: latest.environment_url,
    updatedAt: latest.created_at,
  };
}

/** First readable paragraph from a PR body for the cooking note. */
export function noteFromPrBody(body: string | null | undefined): string {
  if (!body) return "";
  const cleaned = body
    // Agent / Cursor PR wrappers and HTML comments.
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
