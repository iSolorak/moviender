"use client";

import { useMemo } from "react";

import { ErrorState } from "@/components/ErrorState";
import { LandingHero } from "@/components/LandingHero";
import { LoadingState } from "@/components/LoadingState";
import { MatchHistory } from "@/components/MatchHistory";
import { MovieBattle } from "@/components/MovieBattle";
import { MovieDNA } from "@/components/MovieDNA";
import { ResetDialog } from "@/components/ResetDialog";
import { SectionHeading } from "@/components/SectionHeading";
import { StatisticsPanel } from "@/components/StatisticsPanel";
import { useMovieinder } from "@/hooks/useMovieinder";

export function MovieinderApp() {
  const { error, genreBreakdown, history, isHydrated, isStarted, pair, personalityLabel, profile, reset, selectMovie, start, status } =
    useMovieinder();

  const favoriteGenre = useMemo(() => genreBreakdown[0]?.name ?? "Undecided", [genreBreakdown]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.15),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.09),_transparent_25%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-highlight">Movieinder</p>
            <p className="mt-2 text-sm text-slate-300">Discover your movie taste, one choice at a time.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              Matches completed: <span className="font-semibold text-white">{profile.totalMatches}</span>
            </div>
            {isStarted ? <ResetDialog onConfirm={reset} /> : null}
          </div>
        </header>

        {!isStarted ? (
          <>
            <LandingHero onStart={start} />

            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-glow">
                <SectionHeading
                  badge="How it works"
                  title="A faster way to learn your cinematic taste"
                  description="Every head-to-head choice teaches the recommendation engine which genres, tones, and styles pull you in."
                />

                <div className="mt-8 space-y-4">
                  {[
                    ["01", "Choose between two movies.", "Simple, fast, and addictive from the first tap."],
                    ["02", "Movieinder learns your preferences.", "Genre scores update instantly after every winner."],
                    ["03", "Discover better recommendations.", "Top genres steer the next set of personalized pairings."],
                  ].map(([step, title, copy]) => (
                    <div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <p className="text-sm font-semibold text-highlight">{step}</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  ["Smart Recommendations", "Adaptive movie discovery built from your actual choices."],
                  ["Movie DNA Analysis", "See favorite genres, percentages, and your personality label."],
                  ["Instant Discovery", "Fast TMDB-powered browsing with fresh contenders every round."],
                  ["No Sign-Up Required", "Your taste profile lives locally, privately, and instantly."],
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-glow">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {isStarted ? (
          !isHydrated || status === "loading" ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={start} />
          ) : pair ? (
            <>
              <MovieBattle pair={pair} onChoose={selectMovie} />

              <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <StatisticsPanel
                    totalMatches={profile.totalMatches}
                    viewedMovies={profile.viewedMovieIds.length}
                    favoriteGenre={favoriteGenre}
                    personalityLabel={personalityLabel}
                    genresDiscovered={genreBreakdown.length}
                  />
                  <MovieDNA personalityLabel={personalityLabel} genreBreakdown={genreBreakdown} />
                </div>

                <MatchHistory history={history} />
              </section>
            </>
          ) : (
            <ErrorState message="We couldn't create a movie matchup. Reset and try again." />
          )
        ) : null}
      </div>
    </main>
  );
}
