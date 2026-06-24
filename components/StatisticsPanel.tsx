type StatisticsPanelProps = {
  totalMatches: number;
  viewedMovies: number;
  favoriteGenre: string;
  personalityLabel: string;
  genresDiscovered: number;
};

export function StatisticsPanel({
  totalMatches,
  viewedMovies,
  favoriteGenre,
  personalityLabel,
  genresDiscovered,
}: StatisticsPanelProps) {
  const stats = [
    ["Total matches", String(totalMatches).padStart(2, "0")],
    ["Movies viewed", String(viewedMovies).padStart(2, "0")],
    ["Favorite genre", favoriteGenre],
    ["Personality", personalityLabel],
    ["Genres discovered", String(genresDiscovered)],
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-highlight">Statistics</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Your discovery dashboard</h3>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
