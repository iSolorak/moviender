type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title = "Something went off script", message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-[2rem] border border-rose-400/30 bg-rose-500/10 p-8 shadow-glow">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-200">Unable to continue</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-4 text-sm leading-6 text-rose-100">{message}</p>

      {onRetry ? (
        <button className="mt-6 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
