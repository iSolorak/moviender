import { uniqueById } from "@/lib/utils";
import { Movie } from "@/types/movie";

const API_BASE_URL = "https://www.mooremetrics.com/wp-json/mooremetrics/v1";
const DOMAIN = "moviedive";

function getApiKey() {
  const apiKey = process.env.MOOREMETRICS_API_KEY;

  if (!apiKey) {
    throw new Error("Missing MOOREMETRICS_API_KEY.");
  }

  return apiKey;
}

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": getApiKey(),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("MooreMetrics could not be reached right now. Please try again in a moment.");
  }

  return (await response.json()) as T;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === "string") {
          return entry;
        }

        if (entry && typeof entry === "object") {
          const record = entry as Record<string, unknown>;
          return [record.name, record.title, record.label, record.value].find((item): item is string => typeof item === "string");
        }

        return null;
      })
      .filter((entry): entry is string => Boolean(entry));
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => Boolean(entry))
      .map(([key]) => key);
  }

  return [];
}

function extractGenres(item: Record<string, unknown>) {
  return uniqueById(
    ["genres", "characteristics", "tags", "categories"]
      .flatMap((key) => toStringArray(item[key]))
      .filter(Boolean)
      .map((name) => ({ id: name, name })),
  ).map((entry) => entry.name);
}

function extractTitle(item: Record<string, unknown>) {
  const value = [item.title, item.name, item.label, item.movie_title, item.original_title].find((entry) => typeof entry === "string");
  return typeof value === "string" ? value : null;
}

function extractId(item: Record<string, unknown>, fallbackTitle: string, index: number) {
  const value = [item.id, item.slug, item.item_id, item.uuid].find(
    (entry) => typeof entry === "string" || typeof entry === "number",
  );

  return value ? String(value) : `${fallbackTitle}-${index}`;
}

function extractYear(item: Record<string, unknown>) {
  const value = [item.year, item.release_year, item.releaseDate, item.release_date].find(
    (entry) => typeof entry === "string" || typeof entry === "number",
  );

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    const match = value.match(/\b(19|20)\d{2}\b/);
    return match?.[0];
  }

  return undefined;
}

function extractRating(item: Record<string, unknown>) {
  const value = [item.rating, item.score, item.vote_average, item.tmdb_rating].find(
    (entry) => typeof entry === "number" || typeof entry === "string",
  );

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function extractPosterUrl(item: Record<string, unknown>) {
  const value = [item.posterUrl, item.poster_url, item.poster, item.image, item.image_url].find((entry) => typeof entry === "string");
  return typeof value === "string" ? value : undefined;
}

function extractOverview(item: Record<string, unknown>) {
  const value = [item.overview, item.description, item.summary, item.excerpt].find((entry) => typeof entry === "string");
  return typeof value === "string" ? value : undefined;
}

function normalizeMovie(item: Record<string, unknown>, index: number): Movie | null {
  const title = extractTitle(item);

  if (!title) {
    return null;
  }

  return {
    id: extractId(item, title, index),
    title,
    year: extractYear(item),
    rating: extractRating(item),
    posterUrl: extractPosterUrl(item),
    genres: extractGenres(item),
    overview: extractOverview(item),
    source: "mooremetrics",
  } satisfies Movie;
}

function isMovie(value: Movie | null): value is Movie {
  return Boolean(value);
}

function pickItems(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    for (const key of ["items", "results", "recommendations", "data"]) {
      if (Array.isArray(record[key])) {
        return record[key] as unknown[];
      }
    }
  }

  return [];
}

export async function fetchMooreMetricsPool(limit = 50, offset = 0) {
  const payload = await request<unknown>(`/domains/${DOMAIN}/items?limit=${limit}&offset=${offset}`);
  const movies = pickItems(payload)
    .map((item, index) => (item && typeof item === "object" ? normalizeMovie(item as Record<string, unknown>, index) : null))
    .filter(isMovie);

  return uniqueById<Movie>(movies);
}

export async function recommendMooreMetricsMovies(items: string[], limit = 20) {
  const payload = await request<unknown>("/recommend", {
    method: "POST",
    body: JSON.stringify({
      domain: DOMAIN,
      items,
      limit,
      include_characteristics: true,
    }),
  });
  const movies = pickItems(payload)
    .map((item, index) => (item && typeof item === "object" ? normalizeMovie(item as Record<string, unknown>, index) : null))
    .filter(isMovie);

  return uniqueById<Movie>(movies);
}
