/**
 * Everything a card shows beyond what's stored, derived from the URL at render
 * time. Nothing here is written to the database — the day I decide a Substack
 * post should read "essay" instead of "post", that's an edit here, not a
 * migration.
 */

export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^(www|m|mobile)\./, "").toLowerCase();
  } catch {
    return "link";
  }
}

/** A one-word kind, or null when "link" would be the only honest answer. */
export function kindOf(url: string): string | null {
  const host = domainOf(url);
  if (host === "youtube.com" || host === "youtu.be" || host === "vimeo.com") {
    return "video";
  }
  if (host === "x.com" || host === "twitter.com") return "post";
  if (host === "news.ycombinator.com" || host === "reddit.com") return "thread";
  if (host === "arxiv.org") return "paper";
  if (host === "github.com") return "repo";
  if (host.endsWith("substack.com")) return "newsletter";
  return null;
}

function youtubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = domainOf(url);
    if (host === "youtu.be") return parsed.pathname.slice(1) || null;
    if (host !== "youtube.com") return null;
    return (
      parsed.searchParams.get("v") ??
      parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ??
      null
    );
  } catch {
    return null;
  }
}

/**
 * YouTube serves a predictable still for any video id, so a card never has to
 * look empty just because the og: fetch was rate-limited.
 */
export function thumbnailOf(url: string, stored: string | null): string | null {
  if (stored) return stored;
  const id = youtubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * "Wed 30 Jul 2026" from "2026-07-30". Formatted by hand rather than through
 * toLocaleDateString so the server and the browser can't disagree about locale
 * and blow up hydration.
 */
export function dayLabel(dayId: string): string {
  const [year, month, day] = dayId.split("-").map(Number);
  if (!year || !month || !day) return dayId;
  const date = new Date(year, month - 1, day);
  return `${WEEKDAYS[date.getDay()]} ${day} ${MONTHS[month - 1]} ${year}`;
}

/** Local calendar date, not UTC — a link saved at 11pm belongs to today. */
export function todayId(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
