"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { INITIAL_PROFILE } from "@/lib/constants";
import { getPersonalityLabel } from "@/lib/personality";
import { clearProfile, readProfile, writeProfile } from "@/lib/storage";
import { clampPercent, shuffleArray, uniqueById } from "@/lib/utils";
import { Movie, MoviePair, MovieProfile, MovieProviderName } from "@/types/movie";

type Status = "idle" | "loading" | "ready" | "error";

type MoviesResponse = {
  movies: Movie[];
  provider: MovieProviderName;
};

function createPair(pool: Movie[], viewedIds: string[]) {
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

function topGenres(profile: MovieProfile) {
  return Object.entries(profile.genreScores)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([genre]) => genre);
}

function applySelection(profile: MovieProfile, movie: Movie, pair: MoviePair) {
  const nextGenreScores = { ...profile.genreScores };

  movie.genres.forEach((genre) => {
    nextGenreScores[genre] = (nextGenreScores[genre] ?? 0) + 1;
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
        posterUrl: movie.posterUrl,
        year: movie.year,
      },
      ...profile.history,
    ].slice(0, 10),
  } satisfies MovieProfile;
}

async function requestMovies(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const data = (await response.json()) as Partial<MoviesResponse> & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Something went wrong while loading movies.");
  }

  return {
    movies: uniqueById(data.movies ?? []),
    provider: data.provider ?? "tmdb",
  } satisfies MoviesResponse;
}

export function useMovieinder() {
  const [profile, setProfile] = useState<MovieProfile>(INITIAL_PROFILE);
  const [pair, setPair] = useState<MoviePair | null>(null);
  const [provider, setProvider] = useState<MovieProviderName | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [recommendationsStatus, setRecommendationsStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const lastRecommendationsSignature = useRef<string>("");

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
    async (sourceProfile: MovieProfile, selectedTitles: string[] = []) => {
      setStatus("loading");
      setError(null);

      try {
        const strongestGenres = topGenres(sourceProfile);
        const response = selectedTitles.length
          ? await requestMovies("/api/movies/recommend", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                items: selectedTitles,
                genres: strongestGenres,
              }),
            })
          : await requestMovies(`/api/movies?genres=${encodeURIComponent(strongestGenres.join(","))}`);
        const viewedIds = sourceProfile.viewedMovieIds;
        const nextPair = createPair(response.movies, viewedIds);

        if (!nextPair) {
          throw new Error("Movieinder couldn't assemble a fresh matchup just yet.");
        }

        setProvider(response.provider);
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

    return Object.entries(profile.genreScores)
      .map(([genre, score]) => ({
        genreId: genre,
        name: genre,
        score,
        percent: total ? clampPercent(Math.round((score / total) * 100)) : 0,
      }))
      .sort((left, right) => right.score - left.score);
  }, [profile.genreScores]);

  const history = useMemo(() => profile.history, [profile.history]);
  const selectedCount = profile.selectedMovieIds.length;
  const latestSelectedTitles = useMemo(
    () => history.map((entry) => entry.title).filter(Boolean).slice(0, 10),
    [history],
  );

  const filteredRecommendations = useMemo(() => {
    const selectedIds = new Set(profile.selectedMovieIds);
    const selectedTitles = new Set(history.map((entry) => entry.title.toLowerCase()));
    const currentPairIds = new Set([pair?.left.id, pair?.right.id].filter(Boolean));
    const currentPairTitles = new Set(
      [pair?.left.title, pair?.right.title]
        .filter((title): title is string => Boolean(title))
        .map((title) => title.toLowerCase()),
    );
    const seen = new Set<string>();

    return recommendations.filter((movie) => {
      const titleKey = movie.title.toLowerCase();
      const identityKey = `${movie.id}:${titleKey}`;

      if (selectedIds.has(movie.id) || selectedTitles.has(titleKey)) {
        return false;
      }

      if (currentPairIds.has(movie.id) || currentPairTitles.has(titleKey)) {
        return false;
      }

      if (seen.has(identityKey) || seen.has(titleKey) || seen.has(movie.id)) {
        return false;
      }

      seen.add(identityKey);
      seen.add(titleKey);
      seen.add(movie.id);
      return true;
    });
  }, [history, pair, profile.selectedMovieIds, recommendations]);

  const personalityLabel = getPersonalityLabel(genreBreakdown.slice(0, 3).map((genre) => genre.name));

  const loadRecommendations = useCallback(
    async (selectedTitles: string[]) => {
      const trimmedTitles = selectedTitles.map((title) => title.trim()).filter(Boolean).slice(0, 10);
      const signature = trimmedTitles.join("::");

      if (signature.length === 0 || lastRecommendationsSignature.current === signature) {
        return;
      }

      lastRecommendationsSignature.current = signature;
      setRecommendationsStatus("loading");
      setRecommendationsError(null);

      try {
        const response = await requestMovies("/api/movies/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedTitles: trimmedTitles,
            limit: 20,
          }),
        });

        setProvider(response.provider);
        setRecommendations(response.movies);
        setRecommendationsStatus("ready");
      } catch (loadError) {
        lastRecommendationsSignature.current = "";
        setRecommendationsStatus("error");
        setRecommendationsError(loadError instanceof Error ? loadError.message : "Unable to load recommendations right now.");
      }
    },
    [],
  );

  useEffect(() => {
    if (!isStarted || !isHydrated) {
      return;
    }

    if (provider !== "mooremetrics") {
      setRecommendations([]);
      setRecommendationsError(null);
      setRecommendationsStatus("idle");
      lastRecommendationsSignature.current = "";
      return;
    }

    if (selectedCount < 10) {
      setRecommendations([]);
      setRecommendationsError(null);
      setRecommendationsStatus("idle");
      lastRecommendationsSignature.current = "";
      return;
    }

    void loadRecommendations(latestSelectedTitles);
  }, [isStarted, isHydrated, provider, selectedCount, latestSelectedTitles, loadRecommendations]);

  const selectMovie = useCallback(
    async (movie: Movie) => {
      if (!pair) {
        return;
      }

      const nextProfile = applySelection(profile, movie, pair);
      setProfile(nextProfile);
      await loadPool(
        nextProfile,
        nextProfile.history.map((entry) => entry.title).filter(Boolean).slice(0, 10),
      );
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
    setProvider(null);
    setRecommendations([]);
    setRecommendationsError(null);
    setRecommendationsStatus("idle");
    lastRecommendationsSignature.current = "";
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
    provider,
    recommendations: filteredRecommendations,
    recommendationsError,
    recommendationsStatus,
    start,
    reset,
    selectedCount,
    selectMovie,
    status,
  };
}
