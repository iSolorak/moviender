import { INITIAL_PROFILE, STORAGE_KEY } from "@/lib/constants";
import { MovieProfile } from "@/types/movie";

export function readProfile() {
  if (typeof window === "undefined") {
    return INITIAL_PROFILE;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return INITIAL_PROFILE;
    }

    const parsed = JSON.parse(raw) as MovieProfile;

    return {
      ...INITIAL_PROFILE,
      ...parsed,
      genreScores: Object.fromEntries(
        Object.entries(parsed.genreScores ?? {}).map(([key, value]) => [String(key), Number(value) || 0]),
      ),
      history: parsed.history ?? [],
      selectedMovieIds: (parsed.selectedMovieIds ?? []).map((id) => String(id)),
      viewedMovieIds: (parsed.viewedMovieIds ?? []).map((id) => String(id)),
    };
  } catch {
    return INITIAL_PROFILE;
  }
}

export function writeProfile(profile: MovieProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearProfile() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
