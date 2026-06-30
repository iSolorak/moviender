# Movieinder

Movieinder is a movie discovery app built with Next.js 15, TypeScript, Tailwind CSS, and a provider-backed movie service that prefers TMDB and falls back to MooreMetrics MovieDive.

Tagline: _Discover your movie taste, one choice at a time._

Users are shown two movies, choose the one they prefer, and the app keeps refining recommendations using a lightweight local profile stored in `localStorage`.

## Features

- Cinematic landing page and focused movie battle flow
- TMDB as the primary provider when `NEXT_PUBLIC_TMDB_API_KEY` is configured
- MooreMetrics MovieDive as fallback when TMDB is missing and `MOOREMETRICS_API_KEY` is configured
- Next.js API routes that hide the MooreMetrics secret from the browser
- Client-side matching profile, Movie DNA, history, and stats
- Duplicate filtering before presenting the next pair
- Graceful handling of missing posters, ratings, and overviews

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- TMDB API
- MooreMetrics MovieDive API
- Next.js Route Handlers
- localStorage

## Recommendation Engine

Movieinder keeps a local user profile with:

- selected movies
- viewed movies
- recent match history
- genre scores
- total matches completed

How it works:

1. The client starts matching and requests movies from `/api/movies`.
2. The server chooses TMDB first if `NEXT_PUBLIC_TMDB_API_KEY` exists.
3. If TMDB is missing, the server falls back to MooreMetrics when `MOOREMETRICS_API_KEY` exists.
4. If neither key exists, the API returns a clear setup error.
5. As the user chooses winners, each winning movie boosts its genres in local storage.
6. TMDB keeps the existing genre-based refresh logic.
7. MooreMetrics uses selected movie titles with `/recommend`.
8. Movies are de-duplicated and randomized before the next pair is shown.

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
MOOREMETRICS_API_KEY=your_mooremetrics_api_key
```

Provider priority:

1. `NEXT_PUBLIC_TMDB_API_KEY`
2. `MOOREMETRICS_API_KEY`
3. If both are missing, Movieinder shows a setup error

Notes:

- `NEXT_PUBLIC_TMDB_API_KEY` may be exposed to the browser, as intended by TMDB’s public key model.
- `MOOREMETRICS_API_KEY` stays server-side only and is used from `app/api/movies/*`.
- The frontend always calls the same internal routes regardless of provider:
  - `GET /api/movies`
  - `POST /api/movies/recommend`

## Deployment

This project is ready for Vercel or PM2-backed Node deployment.

### Deploy on Vercel

1. Push the repo to GitHub
2. Import the repository into Vercel
3. Add `NEXT_PUBLIC_TMDB_API_KEY` and/or `MOOREMETRICS_API_KEY`
4. Deploy

## Project Structure

```text
app/
  api/
components/
hooks/
lib/
  providers/
types/
public/
```

## Future Improvements

- Add swipe gestures for mobile battles
- Introduce mood-based recommendation filters
- Expand Movie DNA with director and decade preferences
- Add richer MooreMetrics metadata normalization if more fields become available
- Add shareable taste cards for social posting
