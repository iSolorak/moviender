export type TmdbGenre = {
  id: number;
  name: string;
};

export type TmdbMovie = {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  overview: string;
  genre_ids?: number[];
  genres?: TmdbGenre[];
  popularity?: number;
};

export type Movie = {
  id: string;
  title: string;
  year?: string;
  rating?: number;
  posterUrl?: string;
  overview?: string;
  genres: string[];
  source: "tmdb" | "mooremetrics";
};

export type MovieProviderName = "tmdb" | "mooremetrics";

export type HistoryEntry = {
  movieId: string;
  selectedAt: string;
  title: string;
  posterUrl?: string;
  year?: string;
};

export type MovieProfile = {
  viewedMovieIds: string[];
  selectedMovieIds: string[];
  history: HistoryEntry[];
  genreScores: Record<string, number>;
  totalMatches: number;
};

export type MoviePair = {
  left: Movie;
  right: Movie;
};
