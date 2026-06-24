# Movieinder

Movieinder is a portfolio-quality movie discovery app built with Next.js 15, TypeScript, Tailwind CSS, and the TMDB API.

Tagline: _Discover your movie taste, one choice at a time._

Users are shown two movies, choose the one they prefer, and the app continuously refines recommendations using a lightweight client-side recommendation engine powered by localStorage.

## Features

- Startup-style landing page with a premium dark UI
- Head-to-head movie battles with instant feedback
- TMDB integration for popular, top-rated, and genre-based discovery
- Client-side recommendation engine that learns from genre choices
- Your Movie DNA panel with genre percentages and a generated personality label
- Match history for the last 10 winning picks
- Statistics dashboard for matches, viewed titles, and genre discovery
- Reset flow with confirmation dialog
- Fully client-side architecture with no backend or database
- Ready for deployment on Vercel

## Screenshots

- `docs/screenshots/landing-page.png`
- `docs/screenshots/movie-battle.png`
- `docs/screenshots/movie-dna.png`

Add your screenshots after local setup or deployment.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- TMDB API
- localStorage

## Recommendation Engine

Movieinder keeps a local user profile with:

- selected movies
- viewed movies
- recent match history
- genre scores
- total matches completed

How it works:

1. The app loads popular and top-rated movies from TMDB.
2. As the user chooses winners, each winning movie boosts its genres.
3. Dominant genres are recalculated after every selection.
4. The app fetches fresh discovery results using the strongest genres.
5. Movies are randomized and de-duplicated before presenting the next pair.
6. The Movie DNA panel turns those genre weights into percentages and a personality label.

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
```

You can generate a TMDB API key from your TMDB account settings.

## Deployment

This project is ready for Vercel.

### Deploy on Vercel

1. Push the repo to GitHub
2. Import the repository into Vercel
3. Add `NEXT_PUBLIC_TMDB_API_KEY` in the project environment variables
4. Deploy

## Project Structure

```text
app/
components/
hooks/
lib/
types/
public/
```

## Future Improvements

- Add swipe gestures for mobile battles
- Introduce mood-based recommendation filters
- Expand Movie DNA with director and decade preferences
- Cache TMDB responses more aggressively for offline feel
- Add shareable taste cards for social posting
