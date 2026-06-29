"use client";

import { useState } from "react";

type ResetDialogProps = {
  onConfirm: () => void;
};

export function ResetDialog({ onConfirm }: ResetDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-stretch gap-3 sm:items-end">
      <button
        className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Reset Movie DNA
      </button>

      {isOpen ? (
        <div
          aria-labelledby="reset-dialog-title"
          className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-[#0f1319]/96 p-5 shadow-[0_18px_56px_rgba(0,0,0,0.24)] backdrop-blur-sm"
          role="dialog"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-300">Reset profile</p>
          <h3 className="mt-3 text-2xl font-semibold text-white" id="reset-dialog-title">
            Start over from a blank slate?
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            This clears local storage, match history, recommendations, and your entire taste profile.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex-1 rounded-full bg-rose-400 px-4 py-3 text-sm font-semibold text-slate-950"
              onClick={() => {
                onConfirm();
                setIsOpen(false);
              }}
              type="button"
            >
              Yes, reset
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
