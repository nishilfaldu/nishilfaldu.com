"use client";

import { useState } from "react";

const DOWNLOAD_API = "https://friendly-firefly-933.convex.site/download";

/**
 * Email → welcome note → Mac DMG. Same Convex gate as getsediment.vercel.app.
 */
export function SedimentDownload() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    kind: "" | "ok" | "error";
    msg: string;
  }>({ kind: "", msg: "" });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus({ kind: "error", msg: "enter a valid email" });
      return;
    }

    setBusy(true);
    setStatus({ kind: "", msg: "sending…" });

    try {
      const res = await fetch(DOWNLOAD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        downloads?: {
          arm64?: string | null;
          x64?: string | null;
          page?: string;
        };
      };
      if (!res.ok) {
        setStatus({
          kind: "error",
          msg: data.error || "something went wrong — try again",
        });
        return;
      }

      const preferred = data.downloads?.arm64 || data.downloads?.x64 || null;
      if (preferred) {
        setStatus({
          kind: "ok",
          msg: "check your inbox — download starting…",
        });
        const a = document.createElement("a");
        a.href = preferred;
        a.rel = "noopener";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else if (data.downloads?.page) {
        setStatus({
          kind: "ok",
          msg: "check your inbox — opening the release page…",
        });
        window.open(data.downloads.page, "_blank", "noopener");
      } else {
        setStatus({
          kind: "ok",
          msg: "check your inbox — then grab the latest release on GitHub",
        });
      }
    } catch {
      setStatus({
        kind: "error",
        msg: "network error — try again in a moment",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 border-t border-rule pt-8">
      <p className="mb-4 text-ink-muted">
        Enter your email and we’ll send a short note, then start the latest
        macOS build.
      </p>
      <form onSubmit={onSubmit} className="flex flex-wrap gap-2" noValidate>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@email.com"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          className="min-w-[12rem] flex-1 border border-rule bg-transparent px-3 py-2.5 text-[1rem] text-ink outline-none placeholder:text-ink-muted/60 focus:border-ink"
        />
        <button
          type="submit"
          disabled={busy}
          className="border border-ink bg-ink px-4 py-2.5 text-[0.95rem] font-medium text-paper transition-opacity disabled:opacity-55"
        >
          Download for Mac
        </button>
      </form>
      <output
        className={`mt-3 block min-h-[1.2em] text-[0.92rem] ${
          status.kind === "error"
            ? "text-accent"
            : status.kind === "ok"
              ? "text-ink-muted"
              : "text-ink-muted"
        }`}
        aria-live="polite"
      >
        {status.msg}
      </output>
      <p className="mt-3 text-[0.92rem] text-ink-muted">
        First launch blocked?{" "}
        <span className="text-ink">
          System Settings → Privacy & Security → Open Anyway
        </span>
      </p>
    </div>
  );
}
