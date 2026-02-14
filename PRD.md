# PRD — PhotoGuessr (Frontend-only GeoGuessr-style)

## 1. Overview
PhotoGuessr is a GeoGuessr-inspired geography guessing game that runs entirely in the browser. Instead of Street View, each round presents 1-3 curated Unsplash photos representing a real-world location. The player drops a pin on a world map to guess where the photos were taken. The game scores accuracy using distance-based scoring (0-5000 per round) across 5 rounds.

**Inspiration reference:** GeoGuessr classic gameplay is 5 rounds with up to 5,000 points each. :contentReference[oaicite:3]{index=3}

## 2. Goals
- Deliver a fun, polished, replayable location-guessing experience with fast startup and no login.
- Be fully static-hostable (GitHub Pages / Netlify static) with no backend.
- Avoid paid mapping imagery APIs; use open map tiles for guessing.
- Use Unsplash photos with clear attribution.

## 3. Non-goals
- True Street View navigation ("move"/pan along roads).
- Real-time multiplayer (Duels/Battle Royale).
- Global leaderboards (requires backend).
- Anti-cheat beyond basic obfuscation.

## 4. Target users
- Casual geography fans who want quick rounds.
- Friends sharing "daily challenge" links (local-only deterministic).
- Students learning countries/regions visually.

## 5. Core user loop
1) Choose mode + difficulty
2) Round starts -> view photos -> place guess pin
3) Confirm -> see distance + score + target reveal
4) Next round (x5)
5) Final results -> save locally -> share link

## 6. Modes & features

### 6.1 MVP: Classic (must ship)
- 5 rounds per game.
- Each round uses 1-3 photos (carousel).
- Guess by placing a pin on a Leaflet/OSM map.
- "Confirm Guess" locks the selection.
- Post-confirm results:
  - Distance (km)
  - Score (0-5000)
  - Map view showing guess + target markers and connecting line
  - Location reveal (title + country) AFTER confirm
- Final results:
  - Total score (0-25,000)
  - Per-round breakdown
  - Local leaderboard saved to localStorage

### 6.2 Difficulty presets (MVP)
- EASY: famous landmarks + generous scoring decay
- MEDIUM: mixed
- HARD: less iconic photos + stricter scoring decay

### 6.3 Shareable result (MVP)
- A share link includes:
  - seed
  - difficulty
  - per-round scores + distances (optional)
- Note: Frontend-only share links can't be "secure"; treat as casual sharing.

### 6.4 Stretch
- Daily Challenge (seeded by local date) with local best score
- Country-only multiple choice mode (uses dataset.countryCode)
- Practice mode (infinite random rounds)
- "Hints" toggle:
  - e.g., continent/biome hint revealed after 30 seconds

## 7. Content strategy (location dataset)
### 7.1 Dataset approach
Because frontend-only cannot safely use Unsplash API keys (their guidelines require keeping keys confidential, often implying a proxy), PhotoGuessr uses a curated local dataset containing:
- coordinates (lat/lng)
- 1-3 Unsplash hotlinked image URLs
- photographer attribution + links

Unsplash API guideline notes on hotlinking/attribution/key confidentiality inform this approach. :contentReference[oaicite:4]{index=4}

### 7.2 Dataset schema
Each location:
- id
- title (internal; only reveal after guess)
- lat/lng
- countryCode
- optional hints (continent/biome/urban)
- photos[] with:
  - url
  - photographerName
  - photographerProfileUrl
  - unsplashPhotoUrl

### 7.3 Attribution requirements
Always show attribution overlay:
- "Photo by {Photographer} (Unsplash)" with links.
(Unsplash license says attribution is appreciated; API-based uses require it. We do it regardless for good practice.) :contentReference[oaicite:5]{index=5}

## 8. Scoring
### 8.1 Distance calculation
Use Haversine distance in kilometers between:
- target (lat/lng)
- guess (lat/lng)

### 8.2 Score model (approximation)
Per-round max = 5000.

Exponential decay by difficulty:
- EASY decayKm = 2500
- MEDIUM decayKm = 1500
- HARD decayKm = 900

Formula:
- score = round(5000 * exp(-distanceKm / decayKm))
- if distanceKm < 0.05 (50m) -> score = 5000
- clamp 0..5000

Total score = sum of 5 rounds (0..25,000).

## 9. UX / UI requirements
### 9.1 Layout
- Mobile-first:
  - Photo viewer dominant
  - Map in bottom drawer/accordion
- Desktop:
  - Split layout: photo left, map right

### 9.2 Controls
- Place pin by clicking map
- Confirm Guess disabled until pin placed
- Next Round button after results

### 9.3 Loading / errors
- Skeleton while images load
- If image fails: show fallback photo from same location or a generic placeholder + allow continue.

## 10. Accessibility
- Keyboard: tab through controls; Enter/Space triggers primary actions
- Visible focus states
- ARIA labels for map controls and buttons
- Color contrast compliant

## 11. Performance targets
- First load under ~2s on average broadband (bundle optimized)
- Lazy-load map and images where possible
- Use responsive image parameters in Unsplash URLs (w=, q=)

## 12. Telemetry (optional, frontend-only)
- No user tracking by default.
- Optional: basic event counters stored locally (games played, avg score).

## 13. Risks & mitigations
- **Licensing / Terms:** Ensure Unsplash photos are used per license and attribution is present. Avoid representing as an Unsplash competitor service. :contentReference[oaicite:6]{index=6}
- **Map tile usage:** Use OSM responsibly (rate-limit requests; consider a public tile provider with usage guidance if needed).
- **Cheating:** Frontend-only means users can inspect source; accept and position as casual.
- **Dataset quality:** Curate diverse global locations; avoid ambiguous generic landscapes for EASY.

## 14. Acceptance criteria (MVP)
- User can complete a 5-round game end-to-end.
- Each round:
  - photos display with attribution
  - user can place a pin, confirm, see result with both markers and score
- Final results show total + per-round and save to local leaderboard
- Deterministic seeding works and share link reproduces same set of locations
- Tests cover scoring + seeding + confirm disabled state
- Build outputs static deployable site
