# Codebase Structure

**Analysis Date:** 2026-09-17

## Directory Layout

```
satquery-ai/
├── public/
│   └── assets/
│       └── aistudio/          # Static assets served by custom Vite plugin
├── src/
│   ├── components/            # Reusable UI components (9 files)
│   ├── data/                  # Mock data & constants (1 file)
│   ├── hooks/                 # Custom React hooks (1 file)
│   ├── pages/                 # Route-level page components (8 files)
│   ├── App.tsx                # Root component + routing + global layout
│   ├── main.tsx               # React 19 bootstrap entry point
│   ├── index.css              # Tailwind v4 + global styles
│   └── types.ts               # TypeScript domain interfaces
├── index.html                 # HTML entry point (loads fonts, Leaflet CSS)
├── package.json               # Dependencies + scripts
├── tsconfig.json              # TypeScript config (ES2022, bundler, path aliases)
├── vite.config.ts             # Vite + React + Tailwind + custom media plugin
├── bun.lock                   # Bun lockfile (also package-lock.json present)
├── README.md                  # AI Studio deployment instructions
├── .env.example               # Env template (GEMINI_API_KEY)
├── .gitignore
└── metadata.json              # Project metadata
```

## Directory Purposes

### src/components/
- **Purpose:** Reusable, composable UI components used across pages
- **Contains:** 9 `.tsx` files
- **Key files:**
  - `Header.tsx` — Top mission header with logo, quick search, telemetry clocks, mission view button, active alert banner
  - `Sidebar.tsx` — Collapsible desktop + mobile drawer navigation with 8 nav items, badges, system telemetry footer
  - `MobileNav.tsx` — Fixed bottom tab bar for mobile (7 items)
  - `LeafletMap.tsx` — Core GIS map component (350 lines); initializes Leaflet, handles basemap switching, renders flood polygons/roads/camps from GeoJSON, coordinate HUD, legend
  - `CompareSwipeMap.tsx` — Before/after comparison (400 lines); dual Leaflet maps (synced) + CSS clip slider mode; AI summary banner; metrics grid; GeoJSON export
  - `EarthGlobe.tsx` — Canvas/WebGL animated 3D globe with orbiting satellites, ground targets, atmospheric glow
  - `ArchitectureDiagram.tsx` — Interactive pipeline flowchart (8 steps) + 5-tier technology node diagram
  - `ArchitectureDiagram.tsx` — (duplicate reference, single file)
  - `MobileNav.tsx` — (already listed)

### src/pages/
- **Purpose:** Top-level route components; each owns a full screen view
- **Contains:** 8 `.tsx` files
- **Key files:**
  - `HomePage.tsx` — Landing: hero, search bar, example queries, EarthGlobe, 3 feature cards
  - `DashboardPage.tsx` — Main workspace (591 lines): query bar, layer chips, split map/panel, scan overlay, metric cards, roads list, flood trend chart, export modal
  - `ComparePage.tsx` — Thin wrapper (10 lines) around `CompareSwipeMap`
  - `HistoryPage.tsx` — Disaster catalog cards (4 events) with search filter, navigate to analysis
  - `AnalyticsPage.tsx` — 4 Chart.js charts (disaster trends, state vulnerability, river basins, sensor throughput) + metric cards
  - `SatellitePage.tsx` — Sensor selector, band combos, cloud filter, telemetry matrix, LeafletMap
  - `AboutPage.tsx` — Pipeline infographic (5 steps) + 5 technology cards (React, FastAPI, PyTorch, PostGIS, Sentinel)
  - `SettingsPage.tsx` — Theme, basemap, coordinates, 3D terrain, export format, notifications, profile

### src/hooks/
- **Purpose:** Encapsulated reusable logic
- **Contains:** 1 file
- **Key file:**
  - `useAnalysis.ts` — Single data-fetching interface; `mockResolver` simulates 4-step pipeline; returns `{ data, isLoading, error, processingStep, execute }`; documented swap point for real API

### src/data/
- **Purpose:** Static mock data, constants, test fixtures
- **Contains:** 1 file
- **Key file:**
  - `mockData.ts` (530 lines) — `SATELLITE_MISSIONS[]`, `DISASTER_EVENTS[]`, `PRESET_AI_RESPONSES{}`, `DEFAULT_MAP_LAYERS[]`, `MOCK_GEOJSON_FEATURES.assamFloods{}`, `ANALYTICS_DATA{}`

### src/types.ts
- **Purpose:** Shared TypeScript domain interfaces
- **Contains:** 8 interfaces: `DisasterEvent`, `SatelliteMission`, `AIQueryResponse`, `MapLayerConfig`, plus types re-exported from `useAnalysis.ts` (`AnalysisResult`, `RoadSegment`, `ProcessingStep`, `UseAnalysisReturn`)

## Key File Locations

### Entry Points
- `src/main.tsx` — React bootstrap (`createRoot` + `<App />`)
- `src/App.tsx` — Routing (`BrowserRouter` + 8 routes), global layout (Header, Sidebar, MobileNav)
- `index.html` — HTML shell, Google Fonts, Leaflet CSS CDN
- `vite.config.ts` — Build/dev config, plugins, alias `@` → root, custom media plugin

### Configuration
- `tsconfig.json` — Target ES2022, module ESNext, bundler resolution, `@/*` alias, noEmit
- `package.json` — Scripts: `dev` (Vite port 3000), `build`, `preview`, `clean`, `lint` (tsc --noEmit)
- `tailwindcss` — v4 via `@tailwindcss/vite` plugin (no separate config file; configured in CSS)

### Core Logic
- `src/hooks/useAnalysis.ts` — Analysis pipeline hook (mock → real API swap point)
- `src/components/LeafletMap.tsx` — GIS map rendering, layer management, GeoJSON visualization
- `src/components/CompareSwipeMap.tsx` — Dual-map + slider comparison engine
- `src/data/mockData.ts` — All mock data (missions, disasters, AI responses, layers, GeoJSON, analytics)

### Testing
- **Not detected** — No test files (`*.test.ts`, `*.spec.ts`), no Jest/Vitest config, no test script in package.json

## Naming Conventions

### Files
- **Components:** PascalCase, suffix `.tsx` — `LeafletMap.tsx`, `CompareSwipeMap.tsx`, `EarthGlobe.tsx`
- **Pages:** PascalCase + `Page` suffix — `HomePage.tsx`, `DashboardPage.tsx`, `SettingsPage.tsx`
- **Hooks:** camelCase, prefix `use` — `useAnalysis.ts`
- **Types:** Single file `types.ts` exporting interfaces
- **Data:** camelCase — `mockData.ts`
- **Config:** lowercase with dots — `vite.config.ts`, `tsconfig.json`

### Directories
- **kebab-case** — `components/`, `pages/`, `hooks/`, `data/`, `public/assets/aistudio/`

### Code (TypeScript/React)
- **Components:** PascalCase function declarations — `export const LeafletMap: React.FC<LeafletMapProps> = ({ ... }) => {`
- **Interfaces:** PascalCase — `interface LeafletMapProps`, `interface AnalysisResult`
- **Types:** PascalCase — `type ProcessingStep = 'idle' | 'parsing' | ...`
- **Variables/Functions:** camelCase — `const [sidebarCollapsed, setSidebarCollapsed]`, `const handleFormSubmit = () =>`
- **Constants:** UPPER_SNAKE_CASE — `DEFAULT_MAP_LAYERS`, `SATELLITE_MISSIONS`, `STEP_LABELS`
- **CSS Classes:** Tailwind utility classes; custom design tokens via arbitrary values (`bg-[#050816]`, `text-cyan-400`)

### Path Aliases
- `@/*` → project root (configured in `tsconfig.json` and `vite.config.ts`)
- Usage: Not observed in current source; imports use relative paths (`../components/LeafletMap`, `../hooks/useAnalysis`)

## Where to Add New Code

### New Feature (Full Page)
1. **Create page:** `src/pages/NewFeaturePage.tsx`
2. **Add route:** In `src/App.tsx`, import and add `<Route path="/new-feature" element={<NewFeaturePage />} />`
3. **Add nav item:** In `src/components/Sidebar.tsx`, add to `navItems` array (include icon, badge, description)
4. **Add mobile nav:** In `src/components/MobileNav.tsx`, add to `items` array

### New Reusable Component
1. **Create:** `src/components/NewComponent.tsx`
2. **Export:** `export const NewComponent: React.FC<NewComponentProps> = ({ ... }) => {`
3. **Import:** Use relative path: `import { NewComponent } from '../components/NewComponent'`

### New Data Type
1. **Add interface:** In `src/types.ts` (or co-locate in hook if hook-specific)
2. **Export:** `export interface NewType { ... }`

### New Mock Data
1. **Extend:** `src/data/mockData.ts` — add to existing arrays/objects or create new exports
2. **Type:** Import types from `../types`

### New Analysis Scenario
1. **Extend `mockResolver`:** In `src/hooks/useAnalysis.ts`, add new `if (q.includes(...))` branch returning `AnalysisResult`
2. **Add GeoJSON:** In `src/data/mockData.ts`, extend `MOCK_GEOJSON_FEATURES` with new scenario key
3. **Update `LeafletMap`:** Handle new `highlightScenario` in overlay rendering effect

### New Chart/Visualization
1. **Page:** Add to `src/pages/AnalyticsPage.tsx` or new page
2. **Data:** Extend `ANALYTICS_DATA` in `mockData.ts`
3. **Component:** Use `react-chartjs-2` (`Line`, `Bar`) with shared `baseChartOptions`

## Special Directories

### public/assets/aistudio/
- **Purpose:** Static media assets served by custom Vite plugin (`aistudioMediaPlugin` in `vite.config.ts`)
- **Generated:** No (committed assets)
- **Committed:** Yes
- **Serving:** Requests to `/assets/aistudio/*` resolved to `public/assets/aistudio/*` with MIME type detection

### dist/
- **Purpose:** Production build output (`npm run build`)
- **Generated:** Yes
- **Committed:** Yes (currently present with `index.html`, `assets/`)
- **Note:** Should be in `.gitignore` for typical workflows

### node_modules/
- **Purpose:** Dependencies
- **Generated:** Yes
- **Committed:** No (in `.gitignore`)

---

*Structure analysis: 2026-09-17*