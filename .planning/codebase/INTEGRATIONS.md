# External Integrations

**Analysis Date:** 2026-09-17

## APIs & External Services

**AI/ML Services:**
- **Google Gemini AI** (`@google/genai` 2.4.0)
  - Purpose: Natural language satellite query processing, flood/forest change detection, SAR image analysis
  - Auth: `GEMINI_API_KEY` environment variable (injected by AI Studio at runtime)
  - Integration point: `src/hooks/useAnalysis.ts` - `mockResolver()` function designed to be swapped with real API call
  - Current state: Mock implementation returns simulated results for Assam, Karnataka, Kerala scenarios

**Satellite Imagery & Map Tile Providers:**
- **Esri World Imagery** (ArcGIS REST)
  - URL: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
  - Purpose: High-resolution satellite basemap (0.5m)
  - Integration: `src/components/LeafletMap.tsx:52` - `basemapUrls.satellite`

- **CartoDB Dark Matter**
  - URL: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
  - Purpose: Dark-themed vector basemap for operational use
  - Integration: `src/components/LeafletMap.tsx:51` - `basemapUrls.dark`

- **OpenStreetMap**
  - URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  - Purpose: Street/hybrid basemap fallback
  - Integration: `src/components/LeafletMap.tsx:53` - `basemapUrls.street`

**Satellite Missions Referenced (Data Sources):**
- Sentinel-1 (ESA) - SAR C-Band radar, 6-day revisit
- Sentinel-2 (ESA) - Multispectral optical, 13 bands, 5-day revisit
- Cartosat-3 (ISRO) - 0.28m PAN / 1.12m multispectral
- RISAT-2BR1 (ISRO) - X-Band SAR, all-weather 24/7
- Landsat-9 (NASA/USGS) - Thermal IR, 16-day revisit
- INSAT-3D/3DR (ISRO) - Weather monitoring
- ScatSat-1 (ISRO) - Scatterometer for ocean winds
- Suomi NPP VIIRS / Aqua MODIS (NASA) - Fire detection

## Data Storage

**Databases:**
- None - Fully client-side application
- All disaster events, satellite missions, and analytics data embedded in `src/data/mockData.ts`
- User preferences stored in localStorage (implied by SettingsPage UI)

**File Storage:**
- **AI Studio Assets** - Served via custom Vite plugin (`vite.config.ts:8-64`)
  - Path: `/assets/aistudio/` → `public/assets/aistudio/`
  - Handles images, video, audio, PDFs with MIME type detection
  - Used for satellite imagery assets in AI Studio environment

**Caching:**
- Browser HTTP caching via tile server headers
- No explicit caching layer (Redis, etc.)
- Vite dev server cache disabled when `DISABLE_HMR=true` (AI Studio)

## Authentication & Identity

**Auth Provider:**
- **AI Studio / Google Cloud** - No custom auth implementation
- AI Studio injects `GEMINI_API_KEY` and `APP_URL` at runtime
- No user login/logout, session management, or OAuth flows in codebase
- Settings page shows mock "CLEARANCE LEVEL: ALPHA-1 TOP SECRET" user profile (`src/pages/SettingsPage.tsx:246-248`)

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, LogRocket, or similar integration

**Logs:**
- Console logging only (development)
- No structured logging framework

**Performance:**
- No Web Vitals, RUM, or APM integration

## CI/CD & Deployment

**Hosting:**
- **AI Studio / Google Cloud Run** - Primary deployment target
  - `APP_URL` auto-injected by AI Studio
  - `GEMINI_API_KEY` auto-injected from user secrets
  - Static assets served from `dist/` after `vite build`

**CI Pipeline:**
- None detected in repository
- No GitHub Actions, GitLab CI, or similar configuration files

**Build Commands:**
```bash
npm run dev      # Development server on port 3000
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # TypeScript type check (tsc --noEmit)
npm run clean    # Remove dist/ and server.js
```

## Environment Configuration

**Required env vars:**
| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI analysis |
| `APP_URL` | Yes | Hosted application URL (Cloud Run service URL) |
| `DISABLE_HMR` | No | Set to `true` in AI Studio to disable HMR/file watching |

**Secrets location:**
- AI Studio Secrets Panel (UI) - Not in repository
- `.env.local` for local development (gitignored)
- `.env.example` documents required variables

## Webhooks & Callbacks

**Incoming:**
- None implemented
- Settings page has "REAL-TIME INUNDATION WEBHOOKS" toggle (`src/pages/SettingsPage.tsx:198-208`) but no backend endpoint exists

**Outgoing:**
- None implemented
- Settings page references "Push flood vector updates to emergency dispatch API" but no implementation
- `ndmaFeedSync` setting references "Harmonize live meteorological advisories" from NDMA (National Disaster Management Authority) but no integration code

## Future Integration Points (Identified in Code)

**From `useAnalysis.ts` comments:**
- Line 51-52: "Swap the body of this function for `fetch('/api/analyze?q=...')` to go live"
- Designed for backend API at `/api/analyze` endpoint

**From SettingsPage:**
- Webhook endpoint for real-time inundation alerts
- Satellite overpass notification system (Sentinel-1/RISAT passes)
- NDMA RSS feed synchronization for meteorological advisories

**From Mock Data:**
- GeoJSON export formats: GeoJSON, COG GeoTIFF, ESRI Shapefile, NDMA PDF
- CRS: EPSG:4326 (WGS84) primary, EPSG:32643 (UTM Zone 43N India) alternate

---

*Integration audit: 2026-09-17*