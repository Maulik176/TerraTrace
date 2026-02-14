# TerraTrace

TerraTrace is a frontend-only geography game inspired by GeoGuessr: players navigate Street View, place a map guess, and get scored by distance accuracy over 5 rounds.

## Highlights
- Fully static app (no backend, no database)
- Street View exploration + Google Maps guess panel
- Deterministic seeded rounds for repeatable games
- Difficulty-aware exponential scoring with Haversine distance
- Round recap with guess vs target line
- Local leaderboard persisted in `localStorage`
- Shareable run links (seed + score metadata)

## Tech Stack
- React 18 + TypeScript + Vite
- Zustand for game state
- TailwindCSS for UI styling
- Google Maps JavaScript API + Maps Embed API
- Vitest + React Testing Library
- ESLint + Prettier

## Project Structure
```text
src/
  components/      UI components (map, street view, summaries, actions)
  data/            Curated location dataset
  lib/             Pure logic (seeding, scoring, setup, share helpers)
  pages/           Route-level screens (Home, Play, Results)
  store/           Zustand game store
  types/           Shared TypeScript domain types
```

## Scoring Model
- Distance is computed using Haversine formula (km).
- Per-round score is capped `0..5000`.
- Difficulty decay:
  - `EASY: 2500`
  - `MEDIUM: 1500`
  - `HARD: 900`
- Formula:
  - `score = round(5000 * exp(-distanceKm / decayKm))`
  - `< 0.05km` is treated as perfect (`5000`)

## Local Development
### Prerequisites
- Node.js 18+
- npm 9+

### Setup
```bash
npm install
cp .env.example .env
```

Add values in `.env`:
```bash
VITE_GOOGLE_MAPS_EMBED_API_KEY=your_key_here
VITE_GOOGLE_MAPS_MAP_ID=your_map_id_or_DEMO_MAP_ID
```

Run locally:
```bash
npm run dev
```

## Google Maps Configuration
Enable these APIs on your Google Cloud project:
- Maps Embed API
- Maps JavaScript API

Recommended key restrictions:
- Application restriction: `HTTP referrers`
- Allowed referrers:
  - `http://localhost:5173/*`
  - `http://127.0.0.1:5173/*`
  - your production domain(s)
- API restriction: only required Maps APIs

Important: `VITE_*` variables are shipped to the browser bundle. Treat the key as public and rely on strict referrer/API restrictions, quotas, and billing alerts.

## Scripts
- `npm run dev` start local dev server
- `npm run build` create production bundle
- `npm run preview` preview production bundle locally
- `npm run test` run tests
- `npm run lint` run ESLint
- `npm run format` run Prettier
- `npm run deploy` build and publish to `gh-pages`

## Testing
Current automated coverage focuses on:
- scoring behavior
- seeded deterministic sampling
- confirm action gating in UI

Run:
```bash
npm run test
```

## Deployment (GitHub Pages)
1. Ensure `base` in `vite.config.ts` matches repo path (for this repo: `/TerraTrace/`).
2. In GitHub repo settings, set Pages source to `gh-pages` branch, root folder.
3. Deploy:
```bash
npm run deploy
```

## Status
This repository is actively iterated and production-deployed as a static web app.
