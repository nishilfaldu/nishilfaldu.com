"use client";

import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import {
  MAX_PROMPT_CHARS,
  parseAgentLaunchResponse,
} from "@/lib/agent/constants";

type LaunchState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "done"; name: string; url: string };

const fieldClass =
  "w-full rounded-[10px] border border-rule bg-paper px-3 py-2 font-sans text-[1rem] leading-snug text-ink placeholder:text-ink-muted/60 focus-visible:outline-none disabled:opacity-65";

const submitClass =
  "cursor-pointer rounded-[10px] border border-rule bg-paper px-3 py-1.5 text-[0.92rem] text-accent hover:border-accent disabled:cursor-default disabled:opacity-60";

/**
 * Owner-only cloud agent launcher. Mounted only when the unlock cookie is
 * present (see OwnerAgentLauncher). Prompt modal → POST /api/agent.
 */
export function AgentLauncher() {
  const pathname = usePathname();
  const titleId = useId();
  const promptId = useId();
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const dismissRef = useRef<() => void>(() => {});

  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState<LaunchState>({ status: "idle" });

  function cancelInFlight() {
    abortRef.current?.abort();
    abortRef.current = null;
  }

  function resetForm() {
    setPrompt("");
    setState({ status: "idle" });
  }

  function close() {
    cancelInFlight();
    setOpen(false);
    resetForm();
  }

  dismissRef.current = close;

  function openLauncher() {
    cancelInFlight();
    resetForm();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismissRef.current();
    }
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (state.status !== "idle" && state.status !== "error") return;
    promptRef.current?.focus();
  }, [open, state.status]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) {
      promptRef.current?.focus();
      return;
    }

    cancelInFlight();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "submitting" });

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          prompt: trimmed,
          pagePath: pathname,
        }),
      });

      if (controller.signal.aborted) return;

      let raw: unknown;
      try {
        raw = await res.json();
      } catch {
        setState({
          status: "error",
          message: "Could not start the agent.",
        });
        return;
      }

      const data = parseAgentLaunchResponse(raw);

      if (!res.ok) {
        setState({
          status: "error",
          message:
            data && "error" in data ? data.error : "Could not start the agent.",
        });
        return;
      }

      if (!data || !("url" in data)) {
        setState({
          status: "error",
          message: "Agent started, but no URL came back.",
        });
        return;
      }

      setPrompt("");
      setState({
        status: "done",
        name: data.name,
        url: data.url,
      });
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error instanceof DOMException && error.name === "AbortError") return;
      setState({
        status: "error",
        message: "Network error — try again.",
      });
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }

  const busy = state.status === "submitting";

  return (
    <div
      data-agent-launcher
      className="fixed right-[1.35rem] bottom-[1.35rem] z-30 max-[40rem]:right-4 max-[40rem]:bottom-4"
    >
      <button
        type="button"
        className={`cursor-pointer rounded-[12px] border border-rule bg-paper px-[0.95rem] py-[0.7rem] font-sans text-[0.82rem] leading-none tracking-[0.01em] shadow-[0_2px_12px_rgb(0_0_0/0.10)] transition-colors hover:border-accent/35 hover:text-accent ${
          open ? "text-accent" : "text-ink-muted"
        }`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? close() : openLauncher())}
      >
        agent
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-3">
          <button
            type="button"
            aria-label="Dismiss"
            className="absolute inset-0 cursor-default border-0 bg-black/55 p-0"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex w-[min(28rem,calc(100vw-1.5rem))] max-h-[min(90vh,36rem)] flex-col overflow-hidden rounded-[14px] border border-rule bg-paper font-sans text-ink shadow-[0_24px_80px_rgb(0_0_0/0.28)]"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-rule px-5 py-4">
              <h2
                id={titleId}
                className="m-0 text-[1.05rem] font-semibold tracking-[-0.03em]"
              >
                Spin a cloud agent
              </h2>
              <button
                type="button"
                className="cursor-pointer border-0 bg-transparent p-1 font-sans text-[0.9rem] font-medium tracking-[-0.01em] text-ink-muted hover:text-ink"
                onClick={close}
                aria-label="Close"
              >
                Close
              </button>
            </header>

            <div className="overflow-auto px-5 pt-[1.15rem] pb-[1.35rem]">
              {state.status === "done" ? (
                <div className="flex flex-col gap-3">
                  <p className="m-0">
                    Started <span className="text-accent">{state.name}</span>.
                  </p>
                  <p className="m-0 text-[0.82rem] text-ink-muted">
                    Opened in a new tab. If it didn’t,{" "}
                    <a
                      href={state.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline-offset-[0.12em]"
                    >
                      open the agent
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    className={`${submitClass} mt-1 self-start`}
                    onClick={() => setState({ status: "idle" })}
                  >
                    New prompt
                  </button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="mb-4">
                    <label
                      htmlFor={promptId}
                      className="mb-2 block text-[0.92rem] text-ink-muted"
                    >
                      Prompt
                    </label>
                    <textarea
                      ref={promptRef}
                      id={promptId}
                      name="prompt"
                      rows={7}
                      maxLength={MAX_PROMPT_CHARS}
                      value={prompt}
                      disabled={busy}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="What should the agent do on this repo?"
                      className={`${fieldClass} resize-y`}
                    />
                    <p className="mt-2 mb-0 text-[0.82rem] text-ink-muted">
                      Starts a cloud agent on this site’s repo. Launch context:{" "}
                      <code className="font-mono text-[0.78rem]">
                        {pathname}
                      </code>
                      .
                    </p>
                  </div>

                  {state.status === "error" ? (
                    <p
                      className="mb-[0.9rem] text-[0.9rem] text-accent"
                      role="alert"
                    >
                      {state.message}
                    </p>
                  ) : null}

                  <div className="mt-1 flex justify-end gap-2">
                    <button
                      type="button"
                      className="cursor-pointer rounded-[10px] border-0 bg-transparent px-3 py-1.5 font-sans text-[0.92rem] text-ink-muted hover:text-ink disabled:cursor-default disabled:opacity-60"
                      onClick={close}
                      disabled={busy}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={submitClass}
                      disabled={busy}
                    >
                      {busy ? "Starting…" : "Start agent"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
