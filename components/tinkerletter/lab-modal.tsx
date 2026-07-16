"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Full-screen lab overlay. Opens from a prose link so the article can stay
 * a clean Vercel-style column; the toy lives here.
 */
export function LabModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="lab-modal"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <div className="lab-modal-panel">
        <header className="lab-modal-header">
          <h2 id={titleId} className="lab-modal-title">
            {title}
          </h2>
          <button
            type="button"
            className="lab-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            Close
          </button>
        </header>
        <div className="lab-modal-body">{children}</div>
      </div>
    </dialog>
  );
}
