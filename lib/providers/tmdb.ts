import { BASE_IMAGE_URL } from "@/lib/constants";
import { uniqueById } from "@/lib/utils";
import { Movie, TmdbGenre, TmdbMovie } from "@/types/movie";

const API_BASE_URL = "https://api.themoviedb.org/3";

function getApiKey() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_TMDB_API_KEY.");
  }

  return apiKey;
}

async function request<T>(path: string) {
  const apiKey = getApiKey();
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(`${API_BASE_URL}${path}${separator}api_key=${apiKey}`, {
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error("TMDB could not be reached right now. Please try again in a moment.");
  }

  return (await response.json()) as T;
}

function normalizeMovie(movie: TmdbMovie, genresById: Map<number, string>) {
  const genres =
    movie.genres?.length
      ? movie.genres.map((genre) => genre.name)
      : (movie.genre_ids ?? []).map((genreId) => genresById.get(genreId)).filter((genre): genre is string => Boolean(genre));

  return {
    id: String(movie.id),
    title: movie.title,
    year: movie.release_date ? movie.release_date.slice(0, 4) : undefined,
    rating: Number.isFinite(movie.vote_average) ? Number(movie.vote_average.toFixed(1)) : undefined,
    posterUrl: movie.poster_path ? `${BASE_IMAGE_URL}${movie.poster_path}` : undefined,
    overview: movie.overview || undefined,
    genres,
    source: "tmdb",
  } satisfies Movie;
}

async function fetchGenres() {
  const data = await request<{ genres: TmdbGenre[] }>("/genre/movie/list?language=en-US");

  return data.genres;
}

export async function fetchTmdbPool(topGenres: string[] = []) {
  const genres = await fetchGenres();
  const genresById = new Map(genres.map((genre) => [genre.id, genre.name]));
  const topGenreIds = genres
    .filter((genre) => topGenres.includes(genre.name))
    .slice(0, 3)
    .map((genre) => genre.id);

  const [popular, topRated, discovered] = await Promise.all([
    request<{ results: TmdbMovie[] }>("/movie/popular?language=en-US&page=1"),
    request<{ results: TmdbMovie[] }>("/movie/top_rated?language=en-US&page=1"),
    topGenreIds.length
      ? request<{ results: TmdbMovie[] }>(
          `/discover/movie?language=en-US&sort_by=popularity.desc&page=1&with_genres=${topGenreIds.join(",")}`,
        )
      : Promise.resolve({ results: [] }),
  ]);

  return uniqueById(
    [...popular.results, ...topRated.results, ...discovered.results]
      .filter((movie) => movie.title)
      .map((movie) => normalizeMovie(movie, genresById)),
  );
}

export async function recommendTmdbMovies(topGenres: string[] = []) {
  return fetchTmdbPool(topGenres);
}
