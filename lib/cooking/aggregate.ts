import {
  type GithubPreview,
  latestRelease,
  listOpenPulls,
  noteFromPrBody,
  previewsForShas,
} from "@/lib/cooking/github";
import { COOKING_REPOS, type CookingTry } from "@/lib/cooking/repos";
import type {
  CookingItem,
  CookingStatus,
  CookingTryLink,
} from "@/lib/cooking/types";

function statusFromPreview(preview: GithubPreview | null): CookingStatus {
  if (preview?.state === "success" && preview.url) return "ready";
  if (preview?.state === "pending") return "building";
  return "cooking";
}

/**
 * Open PRs on allowlisted repos.
 * - `try: preview` → GitHub Preview deployment URL when present
 * - `try: release` → latest GitHub Release (Electron / native)
 */
export async function aggregateCooking(): Promise<CookingItem[]> {
  const perRepo = await Promise.all(
    COOKING_REPOS.map(async (watched) => {
      const pulls = await listOpenPulls(watched.owner, watched.repo);
      const repoFull = `${watched.owner}/${watched.repo}`;
      const mode: CookingTry = watched.try ?? "preview";

      if (mode === "release") {
        const release = await latestRelease(watched.owner, watched.repo);
        const tryLink: CookingTryLink | null = release
          ? { kind: "release", url: release.url }
          : null;

        return pulls.map(
          (pr): CookingItem => ({
            id: `${repoFull}#${pr.number}`,
            repo: repoFull,
            branch: pr.branch,
            title: pr.title,
            note: noteFromPrBody(pr.body),
            status: "cooking",
            tryLink,
            prUrl: pr.prUrl,
            updatedAt: pr.updatedAt,
          }),
        );
      }

      const shas = new Set(pulls.map((p) => p.sha));
      const previews = await previewsForShas(watched.owner, watched.repo, shas);

      return pulls.map((pr): CookingItem => {
        const preview = previews.get(pr.sha) ?? null;
        const tryLink: CookingTryLink | null =
          preview?.url != null ? { kind: "preview", url: preview.url } : null;
        return {
          id: `${repoFull}#${pr.number}`,
          repo: repoFull,
          branch: pr.branch,
          title: pr.title,
          note: noteFromPrBody(pr.body),
          status: statusFromPreview(preview),
          tryLink,
          prUrl: pr.prUrl,
          updatedAt: preview?.updatedAt ?? pr.updatedAt,
        };
      });
    }),
  );

  return perRepo.flat().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}
