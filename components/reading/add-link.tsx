"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { todayId } from "@/components/reading/presentation";

/**
 * A route that answered normally sends `{ error }`; a route that crashed sends
 * an HTML page. Parsing before checking `ok` would throw on the second and lose
 * the first, so read the body only once we know which we're holding.
 */
async function errorFrom(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  return typeof body?.error === "string" ? body.error : "Didn't save.";
}

/**
 * Owner-only capture, on the page itself.
 *
 * This replaces Sediment's clipboard watcher: paste a URL, optionally say why
 * it's worth keeping, done. The title, description and thumbnail are fetched
 * server-side after the insert, so the row appears immediately and fills in a
 * moment later.
 */
export function AddLink() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!url.trim() || state === "saving") return;

    setState("saving");
    setMessage(null);

    try {
      const response = await fetch("/api/keeps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          note: note.trim() || null,
          // My date, not the server's — Vercel keeps its clock in UTC.
          dayId: todayId(),
        }),
      });

      if (!response.ok) {
        setState("error");
        setMessage(await errorFrom(response));
        return;
      }
      const body = await response.json();

      setUrl("");
      setNote("");
      setState("idle");
      setMessage(body.status === "duplicate" ? "Already kept that one." : null);

      // Once for the row, once for the metadata the OG fetch is still chasing.
      router.refresh();
      setTimeout(() => router.refresh(), 2500);
    } catch {
      setState("error");
      setMessage("Didn't save.");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mb-12 rounded-md border border-rule bg-paper-raised p-4"
    >
      <p className="m-0 mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        Keep a link
      </p>

      <input
        type="url"
        required
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://"
        aria-label="URL"
        className="mb-2 w-full border-0 border-b border-rule bg-transparent pb-2 text-ink outline-none placeholder:text-ink-muted focus:border-accent"
      />

      <input
        type="text"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Why you kept it — shown on the page"
        aria-label="Note, shown publicly"
        className="mb-3 w-full border-0 border-b border-rule bg-transparent pb-2 text-ink outline-none placeholder:text-ink-muted focus:border-accent"
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={state === "saving"}
          className="cursor-pointer rounded-sm border border-rule bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {state === "saving" ? "saving" : "keep"}
        </button>
        {message ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
