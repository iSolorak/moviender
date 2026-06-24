export function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-surface/80 p-10 text-center shadow-glow backdrop-blur">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-white" />
      <h2 className="mt-6 text-2xl font-semibold text-white">Tuning your next matchup</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        We&apos;re pulling fresh contenders from TMDB and aligning them to your evolving taste profile.
      </p>
    </div>
  );
}
