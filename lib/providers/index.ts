import { fetchMooreMetricsPool, recommendMooreMetricsMovies } from "@/lib/providers/mooremetrics";
import { fetchTmdbPool, recommendTmdbMovies } from "@/lib/providers/tmdb";
import { Movie, MovieProviderName } from "@/types/movie";

type MovieProvider = {
  name: MovieProviderName;
  getMovies: (topGenres?: string[]) => Promise<Movie[]>;
  recommend: (items: string[], topGenres?: string[], limit?: number) => Promise<Movie[]>;
};

function resolveProvider(): MovieProvider {
  if (process.env.NEXT_PUBLIC_TMDB_API_KEY) {
    return {
      name: "tmdb",
      getMovies: (topGenres = []) => fetchTmdbPool(topGenres),
      recommend: (_items, topGenres = []) => recommendTmdbMovies(topGenres),
    };
  }

  if (process.env.MOOREMETRICS_API_KEY) {
    return {
      name: "mooremetrics",
      getMovies: () => fetchMooreMetricsPool(),
      recommend: async (items, _topGenres = [], limit = 20) => {
        const movies = items.length ? await recommendMooreMetricsMovies(items, limit) : [];
        return movies.length >= 2 ? movies : fetchMooreMetricsPool();
      },
    };
  }

  throw new Error(
    "No movie provider is configured. Add NEXT_PUBLIC_TMDB_API_KEY or MOOREMETRICS_API_KEY to continue.",
  );
}

export async function getMovies(topGenres: string[] = []) {
  const provider = resolveProvider();
  const movies = await provider.getMovies(topGenres);

  return {
    provider: provider.name,
    movies,
  };
}

export async function recommendMovies(items: string[], topGenres: string[] = [], limit = 20) {
  const provider = resolveProvider();
  const movies = await provider.recommend(items, topGenres, limit);

  return {
    provider: provider.name,
    movies,
  };
}
