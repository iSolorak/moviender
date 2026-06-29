import { MoviePair } from "@/types/movie";

import { MovieCard } from "./MovieCard";

type MovieBattleProps = {
  pair: MoviePair;
  onChoose: (movie: MoviePair["left"]) => void;
  isRefreshing?: boolean;
};

export function MovieBattle({ pair, onChoose, isRefreshing = false }: MovieBattleProps) {
  return (
    <div className="relative mx-auto w-full max-w-6xl rounded-[1.35rem] border border-white/8 bg-[#0f1319]/86 p-2.5 shadow-[0_18px_56px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:rounded-[1.75rem] sm:p-6">
      <div className="mb-2 flex shrink-0 items-start justify-between gap-3 sm:mb-5 sm:items-center sm:gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-slate-400">Movie Matchup</p>
          <h2 className="mt-1.5 text-base font-semibold text-white sm:mt-2 sm:text-2xl">Which one would you press play on?</h2>
        </div>
        <div className="hidden rounded-full border border-white/10 px-3 py-1 text-[0.64rem] uppercase tracking-[0.22em] text-slate-400 sm:block">
          Updates Your DNA
        </div>
      </div>

      <div className="grid justify-center gap-1.5 min-[420px]:gap-2.5 md:gap-6 xl:grid-cols-[minmax(0,22rem)_auto_minmax(0,22rem)] xl:items-center">
        <MovieCard movie={pair.left} onChoose={onChoose} />
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-slate-500 sm:gap-3 sm:text-[0.65rem] sm:tracking-[0.32em]">
            <span className="h-px w-6 bg-white/10 sm:w-8" />
            <span>VS</span>
            <span className="h-px w-6 bg-white/10 sm:w-8" />
          </div>
        </div>
        <MovieCard movie={pair.right} emphasis="right" onChoose={onChoose} />
      </div>

      {isRefreshing ? (
        <div className="pointer-events-none mt-3 flex items-center justify-center sm:mt-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0b0f14]/88 px-3 py-2 text-[0.64rem] font-medium uppercase tracking-[0.24em] text-slate-300 shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white/70" />
            Loading next pair
          </div>
        </div>
      ) : null}
    </div>
  );
}
