"use client";

import { useMemo } from "react";

import { ErrorState } from "@/components/ErrorState";
import { LandingHero } from "@/components/LandingHero";
import { LoadingState } from "@/components/LoadingState";
import { MatchHistory } from "@/components/MatchHistory";
import { MovieBattle } from "@/components/MovieBattle";
import { MovieDNA } from "@/components/MovieDNA";
import { MoviePoster } from "@/components/MoviePoster";
import { ResetDialog } from "@/components/ResetDialog";
import { StatisticsPanel } from "@/components/StatisticsPanel";
import { useMovieinder } from "@/hooks/useMovieinder";

export function MovieinderApp() {
  const {
    error,
    genreBreakdown,
    history,
    isHydrated,
    isStarted,
    pair,
    personalityLabel,
    profile,
    provider,
    recommendations,
    recommendationsError,
    recommendationsStatus,
    reset,
    selectMovie,
    selectedCount,
    start,
    status,
  } = useMovieinder();

  const favoriteGenre = useMemo(() => genreBreakdown[0]?.name ?? "Undecided", [genreBreakdown]);
  const isInitialLoading = !isHydrated || (status === "loading" && !pair);
  const isRefreshingPair = status === "loading" && Boolean(pair);

  return (
    <main className="relative min-h-screen overflow-x-hidden overflow-y-visible bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.15),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.09),_transparent_25%)]"
      />
      {isStarted ? (
        <>
          <div aria-hidden="true" className="match-screen-vignette absolute inset-0" />
          <div aria-hidden="true" className="match-screen-texture absolute inset-0" />
        </>
      ) : null}

      {!isStarted ? <LandingHero onStart={start} /> : null}

      {isStarted ? (
        <>
          <section className="relative min-h-screen overflow-y-visible px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:gap-6">
              <header className="relative flex flex-col gap-2 rounded-[1.2rem] border border-white/8 bg-[#0f1319]/76 px-4 py-3 backdrop-blur-sm sm:gap-4 sm:rounded-[1.5rem] sm:px-6 sm:py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-slate-400">Movieinder</p>
                  <p className="mt-1 text-xs text-slate-300 sm:mt-2 sm:text-sm">Discover your movie taste, one choice at a time.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 sm:px-4 sm:py-2 sm:text-sm">
                    Matches completed: <span className="font-semibold text-white">{profile.totalMatches}</span>
                  </div>
                  <ResetDialog onConfirm={reset} />
                </div>
              </header>

              {isInitialLoading ? (
                <div className="pt-2 sm:pt-4">
                  <LoadingState />
                </div>
              ) : error && !pair ? (
                <div className="pt-2 sm:pt-4">
                  <ErrorState message={error} onRetry={start} />
                </div>
              ) : pair ? (
                <MovieBattle pair={pair} onChoose={selectMovie} isRefreshing={isRefreshingPair} />
              ) : (
                <div className="pt-2 sm:pt-4">
                  <ErrorState message="We couldn&apos;t create a movie matchup. Reset and try again." />
                </div>
              )}
            </div>
          </section>

          <section className="relative overflow-y-visible px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
              <div className="space-y-6">
                <StatisticsPanel
                  totalMatches={profile.totalMatches}
                  viewedMovies={profile.viewedMovieIds.length}
                  favoriteGenre={favoriteGenre}
                  personalityLabel={personalityLabel}
                  genresDiscovered={genreBreakdown.length}
                />
                <MovieDNA personalityLabel={personalityLabel} genreBreakdown={genreBreakdown} />
                {provider === "mooremetrics" ? (
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

                    {selectedCount >= 10 && recommendationsStatus === "loading" ? (
                      <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                        Building your latest MooreMetrics recommendations...
                      </p>
                    ) : null}

                    {selectedCount >= 10 && recommendationsStatus === "error" ? (
                      <p className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100">
                        {recommendationsError ?? "Unable to load personalized recommendations right now."}
                      </p>
                    ) : null}

                    {selectedCount >= 10 && recommendationsStatus === "ready" ? (
                      recommendations.length ? (
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                          {recommendations.slice(0, 20).map((movie) => (
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
                ) : null}
              </div>

              <MatchHistory history={history} />
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
