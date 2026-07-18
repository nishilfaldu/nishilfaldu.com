/**
 * Vercel: preview deployment for a git branch (when VERCEL_TOKEN is set).
 * Prefer aliases from the API over inventing hostnames.
 */

export type VercelPreview = {
  state: "READY" | "BUILDING" | "QUEUED" | "ERROR" | "CANCELED" | "OTHER";
  url: string | null;
  updatedAt: string | null;
};

type VercelDeploymentListItem = {
  uid: string;
  name: string;
  url: string;
  state?: string;
  readyState?: string;
  createdAt?: number;
  buildingAt?: number;
  ready?: number;
  meta?: Record<string, string>;
};

type VercelDeploymentDetail = {
  alias?: string[];
  aliasAssigned?: string | number | null;
  url?: string;
  readyState?: string;
};

function vercelHeaders(): HeadersInit | null {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function teamQuery(): string {
  const teamId = process.env.VERCEL_TEAM_ID;
  const slug = process.env.VERCEL_TEAM_SLUG ?? "nishil-faldus-projects";
  if (teamId) return `teamId=${encodeURIComponent(teamId)}`;
  return `slug=${encodeURIComponent(slug)}`;
}

function readyStateOf(d: VercelDeploymentListItem): string {
  return (d.readyState ?? d.state ?? "OTHER").toUpperCase();
}

function mapState(raw: string): VercelPreview["state"] {
  if (raw === "READY") return "READY";
  if (raw === "BUILDING" || raw === "INITIALIZING") return "BUILDING";
  if (raw === "QUEUED") return "QUEUED";
  if (raw === "ERROR" || raw === "BLOCKED") return "ERROR";
  if (raw === "CANCELED") return "CANCELED";
  return "OTHER";
}

/**
 * Latest deployment for project + branch. Returns null if no token or no match.
 */
export async function previewForBranch(
  projectIdOrName: string,
  branch: string,
): Promise<VercelPreview | null> {
  const headers = vercelHeaders();
  if (!headers) return null;

  const params = new URLSearchParams({
    projectId: projectIdOrName,
    branch,
    limit: "5",
  });
  // teamQuery adds teamId or slug — merge carefully
  const team = teamQuery();
  const listUrl = `https://api.vercel.com/v6/deployments?${params}&${team}`;

  const listRes = await fetch(listUrl, { headers, cache: "no-store" });
  if (!listRes.ok) {
    const text = await listRes.text().catch(() => "");
    throw new Error(
      `Vercel deployments → ${listRes.status}${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }

  const listJson = (await listRes.json()) as {
    deployments?: VercelDeploymentListItem[];
  };
  const deployments = listJson.deployments ?? [];
  const deployment = deployments[0];
  if (!deployment) return null;

  const state = mapState(readyStateOf(deployment));
  const updatedAt = deployment.ready
    ? new Date(deployment.ready).toISOString()
    : deployment.createdAt
      ? new Date(deployment.createdAt).toISOString()
      : null;

  // Prefer a stable alias from deployment detail when Ready.
  let url: string | null = deployment.url ? `https://${deployment.url}` : null;

  if (state === "READY") {
    try {
      const detailRes = await fetch(
        `https://api.vercel.com/v13/deployments/${encodeURIComponent(deployment.uid)}?${team}`,
        { headers, cache: "no-store" },
      );
      if (detailRes.ok) {
        const detail = (await detailRes.json()) as VercelDeploymentDetail;
        const alias = detail.alias?.find(
          (a) => a.includes("-git-") && a.endsWith(".vercel.app"),
        );
        if (alias) {
          url = alias.startsWith("http") ? alias : `https://${alias}`;
        } else if (detail.url) {
          url = detail.url.startsWith("http")
            ? detail.url
            : `https://${detail.url}`;
        }
      }
    } catch {
      // Keep list URL.
    }
  }

  return { state, url, updatedAt };
}
