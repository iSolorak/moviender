"use client";

import { Movie } from "@/types/movie";

import { MoviePoster } from "./MoviePoster";

type RecommendationsPanelProps = {
  error?: string | null;
  movies: Movie[];
  selectedCount: number;
  status: "idle" | "loading" | "ready" | "error";
};

export function RecommendationsPanel({ error, movies, selectedCount, status }: RecommendationsPanelProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-highlight">MooreMetrics</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Recommended For You</h3>
        </div>
      </div>

      {selectedCount < 10 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
          Pick 10 movies to unlock personalized MooreMetrics recommendations.
        </p>
      ) : null}

      {selectedCount >= 10 && status === "loading" ? (
        <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
          Building your latest MooreMetrics recommendations...
        </p>
      ) : null}

      {selectedCount >= 10 && status === "error" ? (
        <p className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100">
          {error ?? "Unable to load personalized recommendations right now."}
        </p>
      ) : null}

      {selectedCount >= 10 && status === "ready" ? (
        movies.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {movies.slice(0, 20).map((movie) => (
              <article
                key={movie.id}
                className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-3"
              >
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-2xl">
                  <MoviePoster src={movie.posterUrl} alt={movie.title} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{movie.title}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {[movie.year ?? "Year unknown", movie.rating !== undefined ? `${movie.rating}/10` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-slate-300">
                    {(movie.overview ?? movie.genres.slice(0, 3).join(" • ")) || "Recommended from your recent picks."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
            No fresh recommendations yet. Keep picking to refine your latest list.
          </p>
        )
      ) : null}
    </section>
  );
}
