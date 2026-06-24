import { Movie } from "@/types/movie";

import { MoviePoster } from "./MoviePoster";

type MovieCardProps = {
  movie: Movie;
  emphasis?: "left" | "right";
  onChoose?: (movie: Movie) => void;
};

export function MovieCard({ movie, emphasis = "left", onChoose }: MovieCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-card shadow-glow transition hover:-translate-y-1">
      <MoviePoster
        src={movie.posterPath}
        alt={movie.title}
        priority
        className={`aspect-[4/5] ${emphasis === "right" ? "sm:order-2" : ""}`}
      />

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold text-white">{movie.title}</p>
            <p className="mt-1 text-sm text-slate-400">{movie.releaseYear} · TMDB {movie.rating}/10</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-highlight">
            {movie.genres.slice(0, 2).map((genre) => genre.name).join(" · ") || "Fresh Pick"}
          </div>
        </div>

        <p className="line-clamp-4 text-sm leading-6 text-slate-300">{movie.overview}</p>

        <div className="flex flex-wrap gap-2">
          {movie.genres.map((genre) => (
            <span key={genre.id} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
              {genre.name}
            </span>
          ))}
        </div>

        {onChoose ? (
          <button
            className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            onClick={() => onChoose(movie)}
          >
            Choose {movie.title}
          </button>
        ) : null}
      </div>
    </article>
  );
}
