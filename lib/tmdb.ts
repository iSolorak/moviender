import { BASE_IMAGE_URL } from "@/lib/constants";
import { shuffleArray, uniqueById } from "@/lib/utils";
import { Genre, Movie, TmdbMovie } from "@/types/movie";

const API_BASE_URL = "https://api.themoviedb.org/3";

function getApiKey() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_TMDB_API_KEY. Add it to .env.local to start matching.");
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
    console.log(response)
    throw new Error("TMDB could not be reached right now. Please try again in a moment.");
  }

  return (await response.json()) as T;
}

function mapMovie(movie: TmdbMovie, genresById: Map<number, Genre>) {
  const genres =
    movie.genres?.length
      ? movie.genres
      : (movie.genre_ids ?? [])
          .map((genreId) => genresById.get(genreId))
          .filter((genre): genre is Genre => Boolean(genre));

  return {
    id: movie.id,
    title: movie.title,
    releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : "TBA",
    rating: Number(movie.vote_average.toFixed(1)),
    posterPath: movie.poster_path ? `${BASE_IMAGE_URL}${movie.poster_path}` : null,
    overview: movie.overview,
    genres,
  } satisfies Movie;
}

export async function fetchGenres() {
  const data = await request<{ genres: Genre[] }>("/genre/movie/list?language=en-US");

  return data.genres;
}

export async function fetchMoviePools(topGenreIds: number[]) {
  const genres = await fetchGenres();
  const genresById = new Map(genres.map((genre) => [genre.id, genre]));

  const [popular, topRated, discovered] = await Promise.all([
    request<{ results: TmdbMovie[] }>("/movie/popular?language=en-US&page=1"),
    request<{ results: TmdbMovie[] }>("/movie/top_rated?language=en-US&page=1"),
    topGenreIds.length
      ? request<{ results: TmdbMovie[] }>(
          `/discover/movie?language=en-US&sort_by=popularity.desc&page=1&with_genres=${topGenreIds
            .slice(0, 3)
            .join(",")}`,
        )
      : Promise.resolve({ results: [] }),
  ]);

  const pool = uniqueById(
    [...popular.results, ...topRated.results, ...discovered.results]
      .filter((movie) => movie.poster_path && movie.overview)
      .map((movie) => mapMovie(movie, genresById)),
  );

  return {
    genres,
    pool: shuffleArray(pool),
  };
}
