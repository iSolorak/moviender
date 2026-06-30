import { Movie } from "@/types/movie";

import { MoviePoster } from "./MoviePoster";

type MovieCardProps = {
  movie: Movie;
  emphasis?: "left" | "right";
  onChoose?: (movie: Movie) => void;
};

export function MovieCard({ movie, emphasis = "left", onChoose }: MovieCardProps) {
  const handleChoose = () => {
    onChoose?.(movie);
  };

  return (
    <article className="group relative mx-auto grid h-[11.5rem] min-[390px]:h-[12.5rem] max-h-[18rem] min-h-[10rem] w-full max-w-[22rem] grid-cols-[5rem_minmax(0,1fr)] overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#11151c]/96 shadow-[0_16px_48px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:shadow-[0_20px_56px_rgba(0,0,0,0.32)] sm:h-auto sm:max-h-none sm:min-h-0 sm:max-w-[22rem] sm:grid-cols-1 sm:rounded-[1.4rem]">
      {onChoose ? (
        <button
          aria-label={`Choose ${movie.title}`}
          className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/65 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06070a] active:scale-[0.99]"
          onClick={handleChoose}
          type="button"
        />
      ) : null}

      <MoviePoster
        src={movie.posterUrl}
        alt={movie.title}
        priority
        className={`h-full ${emphasis === "right" ? "sm:order-2" : ""} sm:aspect-[0.78]`}
      />

      <div className="flex min-w-0 flex-col justify-between gap-1.5 p-2 sm:space-y-3 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <p className="line-clamp-1 text-[0.95rem] font-semibold leading-tight text-white sm:text-[1.35rem] sm:line-clamp-2">
              {movie.title}
            </p>
            <p className="mt-1 text-[0.63rem] uppercase tracking-[0.14em] text-slate-400 sm:text-[0.78rem] sm:tracking-[0.18em]">
              {[movie.year ?? "Year unknown", movie.rating !== undefined ? `${movie.source.toUpperCase()} ${movie.rating}/10` : movie.source.toUpperCase()]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="rounded-full border border-white/10 px-2 py-1 text-[0.55rem] font-medium uppercase tracking-[0.18em] text-slate-300 sm:px-2.5 sm:text-[0.62rem] sm:tracking-[0.22em]">
            {movie.genres[0] ?? "Featured"}
          </div>
        </div>

        <p className="hidden text-sm leading-6 text-slate-300/92 sm:line-clamp-3 sm:block">{movie.overview ?? "No synopsis available yet."}</p>

        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {movie.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="rounded-full border border-white/8 px-2 py-0.5 text-[0.56rem] uppercase tracking-[0.12em] text-slate-400 sm:px-2.5 sm:py-1 sm:text-[0.68rem] sm:tracking-[0.14em]">
              {genre}
            </span>
          ))}
        </div>

        {onChoose ? (
          <span className="mt-auto inline-flex w-full items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-3 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white transition duration-300 group-hover:border-white/24 group-hover:bg-white/[0.08] sm:px-4 sm:py-3 sm:text-[0.72rem] sm:tracking-[0.28em]">
            Pick This
          </span>
        ) : null}
      </div>
    </article>
  );
}
