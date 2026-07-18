"use client";

import { BreatheSession } from "@/components/breathe/breathe-session";

/**
 * Full-screen quiet room around a breathe session. Backdrop dismisses.
 */
export function BreatheRoom({
  id,
  onClose,
  reducedMotion,
}: {
  id: string;
  onClose: () => void;
  reducedMotion: boolean;
}) {
  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Breathe"
      className="fixed inset-0 z-40 flex items-center justify-center bg-paper/92 p-6 backdrop-blur-[2px]"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default border-0 bg-transparent p-0"
      />
      <div
        className={`relative w-full max-w-sm${
          reducedMotion ? "" : " breathe-room-enter"
        }`}
      >
        <BreatheSession onClose={onClose} />
      </div>
    </div>
  );
}
