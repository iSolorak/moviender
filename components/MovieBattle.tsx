import { MoviePair } from "@/types/movie";

import { MovieCard } from "./MovieCard";

type MovieBattleProps = {
  pair: MoviePair;
  onChoose: (movie: MoviePair["left"]) => void;
};

export function MovieBattle({ pair, onChoose }: MovieBattleProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-surface/80 p-4 shadow-glow backdrop-blur sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-highlight">Movie battle</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Which one would you press play on?</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">Instantly updates your DNA</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
        <MovieCard movie={pair.left} onChoose={onChoose} />
        <div className="flex items-center justify-center">
          <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white">
            VS
          </div>
        </div>
        <MovieCard movie={pair.right} emphasis="right" onChoose={onChoose} />
      </div>
    </section>
  );
}
