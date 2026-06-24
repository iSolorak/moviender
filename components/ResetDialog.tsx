"use client";

import { useState } from "react";

type ResetDialogProps = {
  onConfirm: () => void;
};

export function ResetDialog({ onConfirm }: ResetDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
        onClick={() => setIsOpen(true)}
      >
        Reset Movie DNA
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-surface p-6 shadow-glow">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-300">Reset profile</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Start over from a blank slate?</h3>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              This clears local storage, match history, recommendations, and your entire taste profile.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-full bg-rose-400 px-4 py-3 text-sm font-semibold text-slate-950"
                onClick={() => {
                  onConfirm();
                  setIsOpen(false);
                }}
              >
                Yes, reset
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
