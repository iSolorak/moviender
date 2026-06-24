"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { INITIAL_PROFILE } from "@/lib/constants";
import { getPersonalityLabel } from "@/lib/personality";
import { clearProfile, readProfile, writeProfile } from "@/lib/storage";
import { fetchMoviePools } from "@/lib/tmdb";
import { clampPercent, shuffleArray } from "@/lib/utils";
import { Genre, Movie, MoviePair, MovieProfile } from "@/types/movie";

type Status = "idle" | "loading" | "ready" | "error";

function createPair(pool: Movie[], viewedIds: number[]) {
  const available = pool.filter((movie) => !viewedIds.includes(movie.id));

  if (available.length >= 2) {
    const [left, right] = shuffleArray(available).slice(0, 2);
    return { left, right } satisfies MoviePair;
  }

  if (pool.length >= 2) {
    const [left, right] = shuffleArray(pool).slice(0, 2);
    return { left, right } satisfies MoviePair;
  }

  return null;
}

function topGenreIds(profile: MovieProfile) {
  return Object.entries(profile.genreScores)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([genreId]) => Number(genreId));
}

function applySelection(profile: MovieProfile, movie: Movie, pair: MoviePair) {
  const nextGenreScores = { ...profile.genreScores };

  movie.genres.forEach((genre) => {
    nextGenreScores[genre.id] = (nextGenreScores[genre.id] ?? 0) + 1;
  });

  const viewedIds = Array.from(new Set([...profile.viewedMovieIds, pair.left.id, pair.right.id]));
  const selectedIds = Array.from(new Set([...profile.selectedMovieIds, movie.id]));

  return {
    ...profile,
    genreScores: nextGenreScores,
    viewedMovieIds: viewedIds,
    selectedMovieIds: selectedIds,
    totalMatches: profile.totalMatches + 1,
    history: [
      {
        movieId: movie.id,
        selectedAt: new Date().toISOString(),
        title: movie.title,
        posterPath: movie.posterPath,
        releaseYear: movie.releaseYear,
      },
      ...profile.history,
    ].slice(0, 10),
  } satisfies MovieProfile;
}

export function useMovieinder() {
  const [profile, setProfile] = useState<MovieProfile>(INITIAL_PROFILE);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [pair, setPair] = useState<MoviePair | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedProfile = readProfile();
    setProfile(storedProfile);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeProfile(profile);
  }, [isHydrated, profile]);

  const loadPool = useCallback(
    async (sourceProfile: MovieProfile) => {
      setStatus("loading");
      setError(null);

      try {
        const response = await fetchMoviePools(topGenreIds(sourceProfile));
        const viewedIds = sourceProfile.viewedMovieIds;
        const nextPair = createPair(response.pool, viewedIds);

        if (!nextPair) {
          throw new Error("Movieinder couldn't assemble a fresh matchup just yet.");
        }

        setGenres(response.genres);
        setPair(nextPair);
        setStatus("ready");
      } catch (loadError) {
        setStatus("error");
        setError(loadError instanceof Error ? loadError.message : "Something went wrong while loading movies.");
      }
    },
    [],
  );

  useEffect(() => {
    if (!isStarted || !isHydrated) {
      return;
    }

    if (status === "idle") {
      void loadPool(profile);
    }
  }, [isStarted, isHydrated, loadPool, profile, status]);

  const genreBreakdown = useMemo(() => {
    const total = Object.values(profile.genreScores).reduce((sum, value) => sum + value, 0);
    const indexedGenres = new Map(genres.map((genre) => [genre.id, genre.name]));

    return Object.entries(profile.genreScores)
      .map(([genreId, score]) => ({
        genreId: Number(genreId),
        name: indexedGenres.get(Number(genreId)) ?? "Unknown",
        score,
        percent: total ? clampPercent(Math.round((score / total) * 100)) : 0,
      }))
      .sort((left, right) => right.score - left.score);
  }, [genres, profile.genreScores]);

  const history = useMemo(() => profile.history, [profile.history]);

  const personalityLabel = getPersonalityLabel(genreBreakdown.slice(0, 3).map((genre) => genre.name));

  const selectMovie = useCallback(
    async (movie: Movie) => {
      if (!pair) {
        return;
      }

      const nextProfile = applySelection(profile, movie, pair);
      setProfile(nextProfile);
      await loadPool(nextProfile);
    },
    [loadPool, pair, profile],
  );

  const start = useCallback(async () => {
    setIsStarted(true);
    setStatus("idle");
  }, []);

  const reset = useCallback(() => {
    clearProfile();
    setProfile(INITIAL_PROFILE);
    setPair(null);
    setError(null);
    setStatus("idle");
    setIsStarted(false);
  }, []);

  return {
    error,
    genreBreakdown,
    history,
    isHydrated,
    isStarted,
    pair,
    personalityLabel,
    profile,
    start,
    reset,
    selectMovie,
    status,
  };
}
