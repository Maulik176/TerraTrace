# PhotoGuessr

PhotoGuessr is a frontend-only GeoGuessr-like game that uses Google Street View for exploration and OpenStreetMap for final guessing.

## Features
- Classic mode (5 rounds)
- Street View exploration panel for each mystery location
- Difficulty presets (`EASY`, `MEDIUM`, `HARD`)
- Deterministic seeded sampling
- Haversine distance scoring with difficulty decay
- Round recap mini-map (guess vs target)
- Local leaderboard (localStorage)
- Shareable result code/link
- Mobile-first UI with collapsible guess map panel

## Stack
- Vite + React + TypeScript
- TailwindCSS
- Zustand
- Leaflet + react-leaflet
- Vitest + React Testing Library
- ESLint + Prettier

## Getting started
```bash
npm install
npm run dev
```

### Street View setup (required for inline embed)
1. Create a Google Maps API key with **Maps Embed API** enabled.
2. Ensure billing is enabled on your Google Cloud project.
3. Restrict the key to your allowed origins (for local dev, include `http://localhost:5173/*`).
4. Add an `.env` file:

```bash
VITE_GOOGLE_MAPS_EMBED_API_KEY=your_key_here
```

If no key is configured, the app shows an "Open Street View in new tab" fallback link.

## Scripts
- `npm run dev` start local dev server
- `npm run build` production build
- `npm run preview` preview built app
- `npm run test` run unit/component tests
- `npm run lint` run eslint
- `npm run format` run prettier
- `npm run deploy` publish `dist/` to GitHub Pages with `gh-pages`

## GitHub Pages deploy
1. Set repository Pages source to `gh-pages` branch.
2. If your repo is served from a subpath, set Vite `base` in `/vite.config.ts` to `/<repo-name>/`.
3. Run:
```bash
npm run build
npm run deploy
```

## Notes
- Gameplay now focuses on Street View exploration + map guessing.
- The location dataset remains local in `/src/data/locations.ts` and still includes attribution metadata.
