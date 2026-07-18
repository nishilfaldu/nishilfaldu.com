import type { CookingItem, CookingStatus } from "@/components/cooking";
import {
  listOpenPulls,
  noteFromPrBody,
  previewForSha,
} from "@/lib/cooking/github";
import { COOKING_REPOS } from "@/lib/cooking/repos";
import { previewForBranch, projectIdForGithubRepo } from "@/lib/cooking/vercel";

function statusFromSources(input: {
  vercelState: string | null;
  githubState: string | null;
  hasUrl: boolean;
}): CookingStatus {
  const v = input.vercelState?.toUpperCase() ?? null;
  if (v === "READY" && input.hasUrl) return "ready";
  if (v === "BUILDING" || v === "QUEUED" || v === "INITIALIZING") {
    return "building";
  }
  if (input.githubState === "success" && input.hasUrl) return "ready";
  if (input.githubState === "pending") return "building";
  return "cooking";
}

/**
 * Open PRs on allowlisted repos, enriched with Vercel (if token) and/or
 * GitHub Preview deployment URLs.
 *
 * Access: COOKING_REPOS ∩ fine-grained GITHUB_TOKEN. Optional VERCEL_TOKEN +
 * VERCEL_TEAM_ID resolve each project from the GitHub repo link — no
 * per-project env vars.
 */
export async function aggregateCooking(): Promise<CookingItem[]> {
  const items: CookingItem[] = [];

  for (const watched of COOKING_REPOS) {
    const pulls = await listOpenPulls(watched.owner, watched.repo);
    const repoFull = `${watched.owner}/${watched.repo}`;

    let vercelProjectId: string | null = null;
    try {
      vercelProjectId = await projectIdForGithubRepo(
        watched.owner,
        watched.repo,
      );
    } catch {
      // Vercel optional — GitHub preview URLs still work.
    }

    for (const pr of pulls) {
      let url: string | null = null;
      let vercelState: string | null = null;
      let githubState: string | null = null;
      let updatedAt = pr.updatedAt;

      if (vercelProjectId) {
        try {
          const vercel = await previewForBranch(vercelProjectId, pr.branch);
          if (vercel) {
            vercelState = vercel.state;
            if (vercel.url) url = vercel.url;
            if (vercel.updatedAt) updatedAt = vercel.updatedAt;
          }
        } catch {
          // Fall through to GitHub deployments.
        }
      }

      try {
        const gh = await previewForSha(watched.owner, watched.repo, pr.sha);
        if (gh) {
          githubState = gh.state;
          if (!url && gh.url) url = gh.url;
          if (gh.updatedAt && (!vercelState || githubState === "success")) {
            if (gh.updatedAt > updatedAt) updatedAt = gh.updatedAt;
          }
        }
      } catch {
        // PR still shows as cooking without a preview URL.
      }

      const status = statusFromSources({
        vercelState,
        githubState,
        hasUrl: Boolean(url),
      });

      items.push({
        id: `${repoFull}#${pr.number}`,
        project: watched.label,
        repo: repoFull,
        branch: pr.branch,
        title: pr.title,
        note: noteFromPrBody(pr.body),
        status,
        url,
        prUrl: pr.prUrl,
        updatedAt,
      });
    }
  }

  items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return items;
}
