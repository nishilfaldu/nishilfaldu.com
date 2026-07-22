import {
  type AccessibleRepo,
  type GithubPreview,
  latestRelease,
  listAccessibleRepos,
  listOpenPulls,
  noteFromPrBody,
  previewsForShas,
} from "@/lib/cooking/github";
import { type CookingTry, tryModeFor } from "@/lib/cooking/repos";
import type {
  CookingItem,
  CookingStatus,
  CookingTryLink,
  CookingWatchedRepo,
} from "@/lib/cooking/types";

function statusFromPreview(preview: GithubPreview | null): CookingStatus {
  if (preview?.state === "success" && preview.url) return "ready";
  if (preview?.state === "pending") return "building";
  return "cooking";
}

export type CookingAggregate = {
  items: CookingItem[];
  watching: CookingWatchedRepo[];
};

/**
 * Open PRs on every repo the GITHUB_TOKEN can read.
 * - default / override `preview` → GitHub Preview deployment URL when present
 * - override `release` → latest GitHub Release (Electron / native)
 *
 * One unreachable repo (404 / token scope) must not empty the whole tray.
 */
export async function aggregateCooking(): Promise<CookingAggregate> {
  const repos = await listAccessibleRepos();
  const watching: CookingWatchedRepo[] = repos.map((r) => ({
    owner: r.owner,
    repo: r.repo,
  }));

  const perRepo = await Promise.all(
    repos.map(async (watched) => {
      try {
        return await cookingItemsForRepo(watched);
      } catch (err) {
        console.error(
          `cooking: skip ${watched.owner}/${watched.repo}`,
          err instanceof Error ? err.message : err,
        );
        return [] as CookingItem[];
      }
    }),
  );

  return {
    items: perRepo.flat().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    watching,
  };
}

async function cookingItemsForRepo(
  watched: AccessibleRepo,
): Promise<CookingItem[]> {
  const pulls = await listOpenPulls(watched.owner, watched.repo);
  const repoFull = `${watched.owner}/${watched.repo}`;
  const mode: CookingTry = tryModeFor(watched.owner, watched.repo);

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
}
