export type Genre = {
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
  genres?: Genre[];
  popularity?: number;
};

export type Movie = {
  id: number;
  title: string;
  releaseYear: string;
  rating: number;
  posterPath: string | null;
  overview: string;
  genres: Genre[];
};

export type HistoryEntry = {
  movieId: number;
  selectedAt: string;
  title: string;
  posterPath: string | null;
  releaseYear: string;
};

export type MovieProfile = {
  viewedMovieIds: number[];
  selectedMovieIds: number[];
  history: HistoryEntry[];
  genreScores: Record<number, number>;
  totalMatches: number;
};

export type MoviePair = {
  left: Movie;
  right: Movie;
};
