# Tankstelle (PWA)

Austria fuel prices PWA using the official E-Control Spritpreisrechner API. Ultra-fast UX with caching, request dedupe, debounce, and an offline shell.

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- PWA: next-pwa
- State: Zustand
- Validation: Zod
- Map: Leaflet + OpenStreetMap
- Testing: Vitest

## Run
```bash
npm install
npm run dev
```

Build & test:
```bash
npm run build
npm test
```

## Caching & Performance
- In-memory + localStorage cache
- TTL:
  - searches: 5 minutes
  - regions: 7 days
- Request deduping: in-flight requests share a single Promise
- Debounce: 300ms on search/filter input
- Offline: app shell served by service worker, last cached results shown when available

## API Limitation (IMPORTANT)
E-Control returns an official **cheapest list** only (often top 5 near-me and top 10 by region). It does **not** return all stations in a radius. The UI explicitly labels this: “Official cheapest list (E-Control)” and shows the count returned.

## Privacy
User location is used **only** for the current session and is not stored.

## Architecture (Future API Extraction)
- `src/domain`: pure logic + types
- `src/data`: client + caching
- `src/app/api/econtrol/*`: server route wrappers

UI calls internal routes only:
- `/api/econtrol/nearby`
- `/api/econtrol/regions`
- `/api/econtrol/by-region`

To extract a standalone API later:
1. Move `src/app/api/econtrol` into a separate Next.js app or Node server.
2. Keep `src/data` + `src/domain` intact.
3. Point the UI to the new base URL (one change in `src/data/econtrol.api.ts`).

## Notes
- Map uses Leaflet with OpenStreetMap tiles.
- Dark mode supported via system preference.
