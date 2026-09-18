# Technology Stack

**Analysis Date:** 2026-09-17

## Languages

**Primary:**
- TypeScript 5.8.2 - Full type safety across all source files (`src/**/*.ts`, `src/**/*.tsx`)
- React 19.0.1 - Component framework with JSX (React 19 features: `useOptimistic`, concurrent features)

**Secondary:**
- CSS - Tailwind CSS v4 with custom design system (`src/index.css`)
- JavaScript (ES2022) - For Vite config (`vite.config.ts`)

## Runtime

**Environment:**
- Node.js (implied by package.json) - Development/build environment
- Browser - Production runtime (ES2022 target, ESNext modules)

**Package Manager:**
- npm v10+ - Lockfile: `package-lock.json` present
- Bun lockfile also present: `bun.lock` (for Bun runtime alternative)

## Frameworks

**Core:**
- React 19.0.1 - UI library with hooks, context, concurrent rendering
- React Router 7.18.3 - Client-side routing (`src/App.tsx` routes 8 pages)
- Vite 6.2.3 - Build tool, dev server, HMR (`vite.config.ts`)

**Styling:**
- Tailwind CSS 4.1.14 - Utility-first CSS with Vite plugin (`@tailwindcss/vite`)
- Custom design system in `src/index.css` - CSS variables, animations, dark theme

**Visualization:**
- Chart.js 4.5.1 + react-chartjs-2 5.3.1 - Analytics charts (`src/pages/AnalyticsPage.tsx`)
- Leaflet 1.9.4 + @types/leaflet 1.9.22 - Interactive maps (`src/components/LeafletMap.tsx`)
- Motion 12.23.24 - Animation library
- HTML5 Canvas - Custom Earth globe visualization (`src/components/EarthGlobe.tsx`)

**AI/ML Integration:**
- @google/genai 2.4.0 - Google Gemini AI SDK for satellite analysis

**Icons:**
- Lucide React 0.546.0 - Icon system (`lucide-react`)

**Development:**
- TypeScript 5.8.2 - Static type checking (`tsc --noEmit` lint script)
- ESBuild 0.25.0 - Fast bundling (used by Vite internally)
- tsx 4.21.0 - TypeScript execution for scripts
- autoprefixer 10.4.21 - CSS vendor prefixing

## Key Dependencies

**Critical:**
- `@google/genai` 2.4.0 - Google Gemini API client for AI-powered satellite imagery analysis
- `react` 19.0.1 / `react-dom` 19.0.1 - Core UI framework
- `react-router-dom` 7.18.3 - SPA routing with 8 routes
- `leaflet` 1.9.4 - Map rendering with tile layers (Esri, CartoDB, OSM)
- `chart.js` 4.5.1 + `react-chartjs-2` 5.3.1 - Analytics dashboards

**Infrastructure:**
- `express` 4.21.2 - Backend server (present in deps, likely for API proxy)
- `dotenv` 17.2.3 - Environment variable loading
- `@tailwindcss/vite` 4.1.14 - Tailwind v4 Vite integration

## Configuration

**Environment:**
- `.env.example` - Template for required variables
- `.env.local` (not committed) - Actual values
- Vite reads `process.env.DISABLE_HMR` for AI Studio compatibility (`vite.config.ts:76-80`)

**Required Environment Variables:**
| Variable | Purpose | Source |
|----------|---------|--------|
| `GEMINI_API_KEY` | Google Gemini AI API key for satellite analysis | AI Studio secrets panel |
| `APP_URL` | Hosted app URL for OAuth callbacks, self-referential links | AI Studio Cloud Run URL |

**Build:**
- `vite.config.ts` - Main build config with:
  - React plugin (`@vitejs/plugin-react`)
  - Tailwind v4 plugin
  - Custom `aistudioMediaPlugin` for serving AI Studio assets from `/assets/aistudio/`
  - Path alias `@/*` → `./*`
  - HMR conditional on `DISABLE_HMR` env var

**TypeScript:**
- `tsconfig.json` - ES2022 target, bundler module resolution, React JSX, path aliases

## Platform Requirements

**Development:**
- Node.js 18+ (for Vite 6, React 19)
- npm or Bun
- Port 3000 for dev server (`vite --port=3000 --host=0.0.0.0`)

**Production:**
- Static hosting (Vite builds to `dist/`)
- AI Studio / Google Cloud Run deployment target
- HTTPS required for geolocation/map features
- Environment variables injected by AI Studio at runtime

---

*Stack analysis: 2026-09-17*