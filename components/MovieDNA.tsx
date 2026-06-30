type MovieDNAProps = {
  personalityLabel: string;
  genreBreakdown: Array<{
    genreId: string;
    name: string;
    score: number;
    percent: number;
  }>;
};

export function MovieDNA({ personalityLabel, genreBreakdown }: MovieDNAProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-highlight">Your Movie DNA</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{personalityLabel}</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          Personalized live
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {genreBreakdown.length ? (
          genreBreakdown.slice(0, 6).map((genre) => (
            <div key={genre.genreId}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-white">{genre.name}</span>
                <span className="text-slate-300">{genre.percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-accentSoft to-highlight"
                  style={{ width: `${genre.percent}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
            Start matching to reveal your taste signature, genre percentages, and personality label.
          </p>
        )}
      </div>
    </section>
  );
}
