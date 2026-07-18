import {
  type GithubPreview,
  listOpenPulls,
  noteFromPrBody,
  previewsForShas,
} from "@/lib/cooking/github";
import { COOKING_REPOS } from "@/lib/cooking/repos";
import type { CookingItem, CookingStatus } from "@/lib/cooking/types";

function statusFromPreview(preview: GithubPreview | null): CookingStatus {
  if (preview?.state === "success" && preview.url) return "ready";
  if (preview?.state === "pending") return "building";
  return "cooking";
}

/**
 * Open PRs on allowlisted repos. Preview URL comes from GitHub Deployments
 * (Vercel posts these when the project is linked) — no Vercel API.
 */
export async function aggregateCooking(): Promise<CookingItem[]> {
  const perRepo = await Promise.all(
    COOKING_REPOS.map(async (watched) => {
      const pulls = await listOpenPulls(watched.owner, watched.repo);
      const repoFull = `${watched.owner}/${watched.repo}`;
      const shas = new Set(pulls.map((p) => p.sha));
      const previews = await previewsForShas(watched.owner, watched.repo, shas);

      return pulls.map((pr): CookingItem => {
        const preview = previews.get(pr.sha) ?? null;
        return {
          id: `${repoFull}#${pr.number}`,
          repo: repoFull,
          branch: pr.branch,
          title: pr.title,
          note: noteFromPrBody(pr.body),
          status: statusFromPreview(preview),
          url: preview?.url ?? null,
          prUrl: pr.prUrl,
          updatedAt: preview?.updatedAt ?? pr.updatedAt,
        };
      });
    }),
  );

  return perRepo.flat().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}
