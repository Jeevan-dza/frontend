# Architecture

**Analysis Date:** 2026-09-17

## Pattern Overview

**Overall:** Single-Page Application (SPA) with Component-Based Architecture

**Key Characteristics:**
- React 19 with TypeScript using functional components and hooks
- File-based routing via React Router v7 (`react-router-dom`)
- Client-side state management via React hooks (`useState`, `useCallback`, `useEffect`, `useRef`)
- No global state library (Redux, Zustand, Context) — state is co-located in components or encapsulated in custom hooks
- Mock-first development: `useAnalysis` hook uses an async `mockResolver` that can be swapped for real API calls without component changes
- Tailwind CSS v4 for utility-first styling with a custom dark "space-tech" design system
- Canvas/WebGL for custom visualizations (EarthGlobe), Leaflet.js for GIS maps
- Chart.js for analytics dashboards

## Layers

### Presentation Layer (Components)
- **Purpose:** Reusable UI primitives and composite widgets
- **Location:** `src/components/`
- **Contains:** 
  - Layout: `Header.tsx`, `Sidebar.tsx`, `MobileNav.tsx`
  - Maps: `LeafletMap.tsx` (interactive GIS), `CompareSwipeMap.tsx` (before/after), `EarthGlobe.tsx` (canvas 3D globe)
  - Diagrams: `ArchitectureDiagram.tsx` (pipeline + tech stack visualization)
- **Depends on:** `src/hooks/`, `src/types.ts`, `src/data/mockData.ts`
- **Used by:** `src/pages/`, `src/App.tsx`

### Page Layer (Routes)
- **Purpose:** Top-level route components composing features
- **Location:** `src/pages/`
- **Contains:**
  - `HomePage.tsx` — landing with search, EarthGlobe, feature cards
  - `DashboardPage.tsx` — main analysis workspace (map + side panel + query bar)
  - `ComparePage.tsx` — before/after swipe comparison (wraps `CompareSwipeMap`)
  - `HistoryPage.tsx` — disaster catalog with navigation to analysis
  - `AnalyticsPage.tsx` — Chart.js dashboards (trends, state vulnerability, river basins, sensor throughput)
  - `SatellitePage.tsx` — sensor selector, band combos, cloud filter, map
  - `AboutPage.tsx` — pipeline infographic + technology cards
  - `SettingsPage.tsx` — theme, map prefs, export format, notifications, profile
- **Depends on:** `src/components/`, `src/hooks/useAnalysis.ts`, `src/data/mockData.ts`, `src/types.ts`
- **Used by:** `src/App.tsx` (routing)

### Data & Logic Layer (Hooks + Types + Mock Data)
- **Purpose:** Domain types, business logic, and test data
- **Location:** `src/hooks/`, `src/types.ts`, `src/data/mockData.ts`
- **Contains:**
  - `useAnalysis.ts` — single data-fetching interface; returns `{ data, isLoading, error, processingStep, execute }`; encapsulates 4-step pipeline simulation (parsing → acquiring → inferencing → rendering)
  - `types.ts` — TypeScript interfaces: `DisasterEvent`, `SatelliteMission`, `AIQueryResponse`, `MapLayerConfig`, `AnalysisResult`, `RoadSegment`, `ProcessingStep`
  - `mockData.ts` — 5 satellite missions, 8 disaster events, 4 preset AI responses, 7 map layers, GeoJSON features for Assam floods, analytics datasets
- **Depends on:** None (leaf layer)
- **Used by:** `src/components/`, `src/pages/`

### Configuration & Entry Points
- **Purpose:** App bootstrap, build config, routing
- **Location:** Root + `src/main.tsx`, `src/App.tsx`
- **Contains:**
  - `main.tsx` — React 19 `createRoot` bootstrap, renders `<App />`
  - `App.tsx` — `BrowserRouter`, routes, global layout (Header, Sidebar, MobileNav, main content)
  - `vite.config.ts` — Vite + React + Tailwind plugins; custom `aistudioMediaPlugin` for serving `/assets/aistudio/` from `public/`
  - `tsconfig.json` — ES2022, bundler module resolution, path alias `@/*` → `./*`
  - `index.html` — entry HTML, loads Google Fonts (Chakra Petch, JetBrains Mono, Plus Jakarta Sans), Leaflet CSS from CDN

## Data Flow

### Query → Analysis → Map Render Flow
1. **User Input:** Query entered in `HomePage` search bar or `DashboardPage` query bar → navigates to `/dashboard?q=...` or `/compare?q=...`
2. **Route Mount:** `DashboardPage` or `ComparePage` mounts, reads `q` from `useSearchParams()`
3. **Hook Execution:** `useAnalysis.execute(query)` called
   - Sets `processingStep`: `'parsing'` → `'acquiring'` → `'inferencing'` → `'rendering'`
   - Calls `mockResolver(query)` — 2.2s simulated delay, returns `AnalysisResult` based on keyword matching (Assam/Kerala/Karnataka)
4. **State Update:** Hook returns `data: AnalysisResult` with confidence, sensor, roads, coordinates, flood trend
5. **Map Render:** `DashboardPage` passes `data.coordinates`, `data.confidenceNum`, `layers` to `LeafletMap`
6. **LeafletMap Effects:**
   - Initializes Leaflet map instance (once)
   - Renders flood polygons, flooded roads, relief camps from `MOCK_GEOJSON_FEATURES.assamFloods` based on active layers
   - Confidence drives polygon fill opacity (0.25–0.65)
7. **Side Panel:** `DashboardPage` renders metric cards, roads list, flood trend sparkline, export buttons

### Compare (Before/After) Flow
1. **Route:** `/compare` mounts `ComparePage` → `CompareSwipeMap`
2. **View Modes:** 
   - Side-by-side: two synchronized Leaflet maps (before/after Kerala 2018)
   - Slider: single container with clipped "after" image over "before" image, draggable handle bound to `sliderPosition` state
3. **AI Summary:** Static banner with exact phrasing: "Flood coverage increased significantly and 12 roads were affected."
4. **Metrics Grid:** 4 stats (Before 0.3 km², After 8.2 km², 12 Roads, 98.2% Confidence)
5. **Export:** GeoJSON download with before/after metadata

### Disaster Catalog Flow
1. **HistoryPage** renders static `disasterList` (4 events: Assam, Bihar, Wayanad, Punjab)
2. **Filter:** Client-side search by title/state/date
3. **Navigation:** "VIEW ANALYSIS" button navigates to `/dashboard?q=...` or `/compare?q=...` with pre-filled query

### Analytics Dashboard Flow
1. **AnalyticsPage** imports `ANALYTICS_DATA` from `mockData.ts`
2. **Charts:** Four Chart.js charts (Line for disaster trends, Bar for state vulnerability, Bar for river basin inundation, Line for monthly sensor throughput)
3. **Theme:** Dark mode Chart.js config with JetBrains Mono fonts, cyan/emerald/amber color palette

## Key Abstractions

### AnalysisResult (Domain Model)
- **Purpose:** Unified result shape for any geospatial query
- **Location:** `src/hooks/useAnalysis.ts` (lines 20-33)
- **Fields:** `query`, `confidence`/`confidenceNum`, `sensor`, `affectedRoadsCount`, `freshness`, `location`, `inundatedArea`, `coordinates`, `roadsList[]`, `scenario`, `floodTrend[]`
- **Pattern:** Discriminated by `scenario` ('assam' | 'karnataka' | 'kerala') for map layer selection

### MapLayerConfig (GIS Layer Toggle)
- **Purpose:** Declarative layer configuration for LeafletMap
- **Location:** `src/types.ts` (lines 74-82)
- **Fields:** `id`, `name`, `description`, `color`, `active`, `opacity`, `type` ('vector'|'raster'|'heatmap'|'marker')
- **Defaults:** `DEFAULT_MAP_LAYERS` in `mockData.ts` (lines 387-394) — satellite base, SAR flood mask, flooded roads, relief camps, critical infra, population density

### ProcessingStep (Pipeline State Machine)
- **Purpose:** Fine-grained loading states for scan overlay UI
- **Location:** `src/hooks/useAnalysis.ts` (lines 35-40)
- **Values:** `'idle'` | `'parsing'` | `'acquiring'` | `'inferencing'` | `'rendering'`
- **Usage:** `DashboardPage` → `ScanOverlay` component shows animated scan line + step label

### DisasterEvent (Historical Catalog)
- **Purpose:** Rich metadata for historical disaster cards
- **Location:** `src/types.ts` (lines 1-30)
- **Fields:** id, title, category, state, region, date, year, severity, affectedAreaSqKm, affectedPopulation, coordinates, satelliteSensors[], thumbnail, description, damageStats{}, beforeImage, afterImage, aiInsights{}

### SatelliteMission (Sensor Registry)
- **Purpose:** Sensor metadata for Satellite Explorer page
- **Location:** `src/types.ts` (lines 32-45)
- **Fields:** id, name, agency (ESA/ISRO/NASA/USGS), type (SAR/Optical/Hyperspectral/Thermal), resolution, revisitTime, swathWidth, status, orbitAltitude, inclination, launchDate, activeBands[]

## Entry Points

### main.tsx
- **Location:** `src/main.tsx`
- **Triggers:** Browser loads `index.html` → `/src/main.tsx` module
- **Responsibilities:** 
  - Import `index.css` (Tailwind v4 + custom globals)
  - `createRoot(document.getElementById('root')!)`
  - Render `<App />` in `<StrictMode>`

### App.tsx
- **Location:** `src/App.tsx`
- **Triggers:** `main.tsx` render
- **Responsibilities:**
  - `BrowserRouter` + `Routes` with 8 routes (`/`, `/dashboard`, `/compare`, `/history`, `/satellite`, `/analytics`, `/about`, `/settings`, `*` → Home)
  - Global layout state: `sidebarCollapsed`, `mobileOpen`
  - Layout composition: `<Header>` → `<Sidebar>` + `<main><Routes/></main>` → `<MobileNav>`
  - Passes toggle callbacks to Header/Sidebar/MobileNav

### Vite Dev Server
- **Location:** `vite.config.ts`
- **Triggers:** `npm run dev`
- **Responsibilities:**
  - Plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`, custom `aistudioMediaPlugin`
  - Alias: `@` → project root
  - HMR controlled by `DISABLE_HMR` env var
  - Serves `public/assets/aistudio/` via custom middleware

## Error Handling

**Strategy:** Graceful degradation with inline error states

**Patterns:**
- **Hook-level:** `useAnalysis` catches resolver errors, sets `error` string, returns `isLoading=false`, `processingStep='idle'`
- **Component-level:** `DashboardPage` renders `ErrorState` component with retry button calling `execute(inputQuery)`
- **Empty State:** `EmptyState` component when `roadsList.length === 0`
- **Skeletons:** `MetricSkeleton`, `RoadSkeleton` during loading (no spinners — pulse animation)
- **Map Initialization:** `LeafletMap` guards with `if (!mapContainerRef.current) return` and cleanup in effect return

## Cross-Cutting Concerns

### Logging
- **Approach:** No formal logging library. Console logs only in development (none observed in source)
- **Debug:** React DevTools + browser console

### Validation
- **Input:** Query strings trimmed, empty check in `handleFormSubmit` and `handleQuickSearch`
- **Types:** TypeScript strict mode (`noEmit: true`, `isolatedModules: true`); runtime validation not used (mock data is trusted)

### Authentication
- **Status:** Not implemented in frontend
- **Settings Page:** Shows mock "CLEARANCE LEVEL: ALPHA-1 TOP SECRET" profile — UI only
- **Backend Ready:** `useAnalysis` comment documents swap point: "replace `mockResolver` with a real fetch() call"

---

*Architecture analysis: 2026-09-17*