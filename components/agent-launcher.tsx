"use client";

import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import {
  type AgentLaunchError,
  type AgentLaunchSuccess,
  MAX_PROMPT_CHARS,
} from "@/lib/agent/constants";
import "./agent-launcher.css";

type LaunchState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "done"; name: string; url: string };

/**
 * Owner-only cloud agent launcher. Separate from the public site toolbar —
 * fixed bottom-right, modal, posts to /api/agent.
 *
 * Dialog open state is React-controlled (same pattern as LabModal). Calling
 * showModal() alone does not survive re-renders — React clears the native
 * open flag unless `open` is kept in sync.
 */
export function AgentLauncher() {
  const pathname = usePathname();
  const titleId = useId();
  const promptId = useId();
  const accessId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const accessRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [access, setAccess] = useState("");
  const [state, setState] = useState<LaunchState>({ status: "idle" });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      promptRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function close() {
    setOpen(false);
    setPrompt("");
    setAccess("");
    setState({ status: "idle" });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) {
      promptRef.current?.focus();
      return;
    }

    setState({ status: "submitting" });

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmed,
          access: access.trim() || undefined,
          pagePath: pathname,
        }),
      });

      const data = (await res.json()) as AgentLaunchSuccess | AgentLaunchError;

      if (!res.ok) {
        const message =
          "error" in data && data.error
            ? data.error
            : "Could not start the agent.";
        if (res.status === 401) {
          accessRef.current?.focus();
        }
        setState({ status: "error", message });
        return;
      }

      if (!("url" in data) || !data.url) {
        setState({
          status: "error",
          message: "Agent started, but no URL came back.",
        });
        return;
      }

      setAccess("");
      setPrompt("");
      setState({
        status: "done",
        name: data.name.trim() || "Cloud agent",
        url: data.url,
      });
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      setState({
        status: "error",
        message: "Network error — try again.",
      });
    }
  }

  const busy = state.status === "submitting";

  return (
    <div data-agent-launcher className="agent-launcher">
      <button
        type="button"
        className="agent-launcher-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setState({ status: "idle" });
          setOpen(true);
        }}
      >
        agent
      </button>

      <dialog
        ref={dialogRef}
        className="agent-launcher-modal"
        aria-labelledby={titleId}
        onClose={close}
      >
        <form className="agent-launcher-panel" onSubmit={submit}>
          <header className="agent-launcher-header">
            <h2 id={titleId} className="agent-launcher-title">
              Spin a cloud agent
            </h2>
            <button
              type="button"
              className="agent-launcher-close"
              onClick={close}
              aria-label="Close"
            >
              Close
            </button>
          </header>

          <div className="agent-launcher-body">
            {state.status === "done" ? (
              <div className="agent-launcher-done">
                <p>
                  Started{" "}
                  <span className="agent-launcher-name">{state.name}</span>.
                </p>
                <p className="agent-launcher-muted">
                  Opened in a new tab. If it didn’t,{" "}
                  <a href={state.url} target="_blank" rel="noopener noreferrer">
                    open the agent
                  </a>
                  .
                </p>
                <button
                  type="button"
                  className="agent-launcher-submit"
                  onClick={() => {
                    setState({ status: "idle" });
                    promptRef.current?.focus();
                  }}
                >
                  New prompt
                </button>
              </div>
            ) : (
              <>
                <div className="agent-launcher-field">
                  <label htmlFor={accessId}>Access code</label>
                  <input
                    ref={accessRef}
                    id={accessId}
                    name="access"
                    type="password"
                    autoComplete="current-password"
                    value={access}
                    disabled={busy}
                    onChange={(e) => setAccess(e.target.value)}
                    placeholder="Leave blank if already unlocked"
                  />
                </div>

                <div className="agent-launcher-field">
                  <label htmlFor={promptId}>Prompt</label>
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
                  />
                  <p className="agent-launcher-muted">
                    Starts a cloud agent on this site’s repo. Launch context:{" "}
                    <code className="agent-launcher-code">{pathname}</code>.
                  </p>
                </div>

                {state.status === "error" ? (
                  <p className="agent-launcher-error" role="alert">
                    {state.message}
                  </p>
                ) : null}

                <div className="agent-launcher-actions">
                  <button
                    type="button"
                    className="agent-launcher-cancel"
                    onClick={close}
                    disabled={busy}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="agent-launcher-submit"
                    disabled={busy}
                  >
                    {busy ? "Starting…" : "Start agent"}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </dialog>
    </div>
  );
}
