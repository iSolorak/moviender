import { MovieProfile } from "@/types/movie";

export const APP_NAME = "Movieinder";
export const STORAGE_KEY = "movieinder-profile-v1";
export const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
export const FALLBACK_POSTER = "/poster-fallback.svg";

export const INITIAL_PROFILE: MovieProfile = {
  viewedMovieIds: [],
  selectedMovieIds: [],
  history: [],
  genreScores: {},
  totalMatches: 0,
};

export const HERO_POSTERS = [
  "/poster-a.svg",
  "/poster-b.svg",
  "/poster-c.svg",
];
