import { formatDateTime } from "@/lib/utils";

import { MoviePoster } from "./MoviePoster";

type MatchHistoryProps = {
  history: Array<{
    movieId: number;
    selectedAt: string;
    title: string;
    posterPath: string | null;
    releaseYear: string;
  }>;
};

export function MatchHistory({ history }: MatchHistoryProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-highlight">Match history</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Last 10 picks</h3>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {history.length ? (
          history.map((entry) => (
            <div
              key={`${entry.movieId}-${entry.selectedAt}`}
              className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-3"
            >
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-2xl">
                <MoviePoster src={entry.posterPath} alt={entry.title} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{entry.title}</p>
                <p className="mt-1 text-xs text-slate-400">{entry.releaseYear}</p>
                <p className="mt-2 text-xs text-slate-300">Selected {formatDateTime(entry.selectedAt)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
            Your recent winners appear here once you start choosing between matchups.
          </p>
        )}
      </div>
    </section>
  );
}
