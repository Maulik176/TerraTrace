# AGENTS.md — Codex build rules for PhotoGuessr

This repo is built by an AI coding agent (Codex). Follow these rules strictly.

## 1) North Star
Ship a polished, static, frontend-only GeoGuessr-style game using curated Unsplash photos + an open map. No backend. No paid APIs.

## 2) Non-negotiables
- Frontend-only: no server, no database, no serverless functions.
- No Google Maps/Street View APIs.
- Do not call the Unsplash API at runtime (avoid key confidentiality issues). Prefer a curated dataset in `src/data/locations.ts`.
- Always show photo attribution overlay with working links.

## 3) Repo hygiene
- TypeScript everywhere.
- Keep components small and focused.
- Prefer pure functions for scoring/PRNG/sampling.
- Minimal dependencies; justify any new library.
- Add ESLint + Prettier and keep the codebase formatted.

## 4) Architecture expectations
- `src/lib/` for pure logic:
  - `geo.ts` (haversine, formatting)
  - `scoring.ts`
  - `seed.ts` (PRNG)
  - `sampling.ts` (deterministic location selection)
- `src/data/locations.ts` for dataset
- `src/components/` for UI primitives
- `src/features/game/` for game flow state + screens
- `src/routes/` (or React Router pages) for Home / Play / Results

## 5) Dataset rules
- Each location must include:
  - lat/lng, countryCode, and photos[1..3] with attribution fields
- Never show location title/country before guess confirmation.
- Ensure global variety (continents, climates, urban/rural mix).
- Image URLs should be hotlinked and include size params for performance.

## 6) UX rules
- Confirm button disabled until a guess pin exists.
- Results view must clearly show:
  - distance in km
  - score for the round
  - map with guess + target + line
- Mobile UX: map should be collapsible so photos remain primary.

## 7) Testing requirements (minimum)
Write tests for:
- scoring across difficulties (distance 0 -> 5000, large distance -> low score)
- deterministic sampling: same seed -> same 5 location IDs
- UI: confirm disabled until pin placed

## 8) Accessibility checklist
- Keyboard reachable controls
- Focus styles
- ARIA labels for map interaction hints
- No critical info conveyed by color alone

## 9) Build & deploy
- `npm run build` must produce static assets.
- Include README deploy steps (GitHub Pages recommended).
- Keep environment variables optional (prefer none).

## 10) Work style (how to iterate)
1. Implement pure logic first (seed, sampling, scoring).
2. Build round flow UI next.
3. Add results + leaderboard.
4. Add tests.
5. Polish responsive UI and accessibility.
