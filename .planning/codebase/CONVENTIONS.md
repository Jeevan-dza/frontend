# Coding Conventions

**Analysis Date:** 2026-09-17

## Naming Patterns

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `Header.tsx`, `LeafletMap.tsx`, `CompareSwipeMap.tsx`)
- Pages: PascalCase with `Page` suffix (e.g., `HomePage.tsx`, `DashboardPage.tsx`, `HistoryPage.tsx`)
- Hooks: camelCase with `use` prefix, `.ts` extension (e.g., `useAnalysis.ts`)
- Types: PascalCase in `types.ts` (e.g., `DisasterEvent`, `SatelliteMission`, `AnalysisResult`)
- Data/Constants: PascalCase for exports, camelCase for internal (e.g., `SATELLITE_MISSIONS`, `DEFAULT_MAP_LAYERS`)
- CSS: `index.css` (Tailwind v4)

**Functions:**
- Component functions: PascalCase (e.g., `Header`, `DashboardPage`)
- Hook functions: camelCase with `use` prefix (e.g., `useAnalysis`)
- Helper functions: camelCase (e.g., `delay`, `handleFormSubmit`, `handleToggleLayer`)
- Event handlers: `handle` + EventName (e.g., `handleQuickSearch`, `handleFormSubmit`, `handleDownloadGeoJSON`)
- Callbacks: `on` + EventName (e.g., `onToggleSidebar`, `onCloseMobile`, `onMapClick`)

**Variables:**
- State: camelCase with descriptive names (e.g., `sidebarCollapsed`, `mobileOpen`, `inputQuery`, `processingStep`)
- Constants: UPPER_SNAKE_CASE (e.g., `STEP_LABELS`, `DEFAULT_MAP_LAYERS`, `SATELLITE_MISSIONS`)
- Refs: camelCase with `Ref` suffix (e.g., `mapContainerRef`, `mapInstanceRef`, `layerGroupRef`)
- Booleans: `is`/`has`/`can`/`should` prefix (e.g., `isLoading`, `isActive`, `hasData`)

**Types/Interfaces:**
- Interfaces: PascalCase with descriptive names (e.g., `HeaderProps`, `LeafletMapProps`, `UseAnalysisReturn`)
- Types: PascalCase with `Type` suffix or descriptive (e.g., `ProcessingStep`, `MapLayerConfig`)
- Enums: PascalCase with values as strings (e.g., severity levels in `DisasterEvent`)

## Code Style

**Formatting:**
- Tool: None configured (no Prettier, no ESLint)
- Indentation: 2 spaces
- Line endings: LF
- Max line length: ~120 chars (soft)
- Trailing commas: Used in objects/arrays
- Semicolons: Always used
- Quotes: Single quotes for JS/TS, double quotes for JSX attributes

**TypeScript:**
- Strict mode: Enabled via `tsconfig.json` (`noEmit: true`, `isolatedModules: true`)
- `any`: Avoided; explicit types preferred
- `interface` over `type` for object shapes
- Explicit return types on hooks and exported functions
- Generic type parameters in PascalCase (e.g., `<T>`, `<TData>`)
- Non-null assertions (`!`) used for DOM refs known to exist (`document.getElementById('root')!`)

**React:**
- Functional components with `React.FC<Props>` typing
- Named exports for components (`export const Header: React.FC<HeaderProps> = ...`)
- Default export only for `App.tsx`
- Props interface defined above component
- Destructured props in parameter: `({ prop1, prop2 }) =>`
- Hooks at top of component body
- `useCallback` for stable function references passed as props
- `useEffect` with exhaustive dependency arrays
- Cleanup functions in `useEffect` for subscriptions/timers/animation frames

## Import Organization

**Order:**
1. External libraries (React, React Router, Lucide icons, Chart.js, Leaflet)
2. Internal absolute imports (using `@/` alias - though not consistently used)
3. Internal relative imports (`../components/`, `../hooks/`, `../types`, `../data/`)
4. Types (imported with `import type` where applicable)

**Path Aliases:**
- `@/*` → `./*` (configured in `tsconfig.json` and `vite.config.ts`)
- Usage: Mixed; some files use relative paths, some could use `@/`

**Example from `DashboardPage.tsx`:**
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Layers, ... } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, ... } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LeafletMap } from '../components/LeafletMap';
import { DEFAULT_MAP_LAYERS } from '../data/mockData';
import { MapLayerConfig } from '../types';
import { useAnalysis, ProcessingStep } from '../hooks/useAnalysis';
```

## Error Handling

**Patterns:**
- Try/catch in async functions (e.g., `useAnalysis.ts` line 165-173)
- Error state in hooks: `error: string | null` returned from `useAnalysis`
- Error boundaries: Not used
- API errors: Caught and converted to user-friendly strings (`err instanceof Error ? err.message : 'Satellite feed unavailable. Retrying…'`)
- Form validation: Inline checks (`if (!query.trim()) return;`)

**Component-level:**
- Loading states: `isLoading` boolean
- Error states: Dedicated `ErrorState` component (e.g., `DashboardPage.tsx` line 102-117)
- Empty states: Dedicated `EmptyState` component (e.g., `DashboardPage.tsx` line 119-129)
- Skeleton loaders: `MetricSkeleton`, `RoadSkeleton` components for perceived performance

## Logging

**Framework:** None (console only)

**Patterns:**
- No structured logging observed
- `console.log`/`console.error` not used in source
- Debug via React DevTools and browser console
- Network errors surfaced via UI error states

## Comments

**When to Comment:**
- JSDoc-style block comments for hooks and complex utilities (e.g., `useAnalysis.ts` lines 1-7)
- Inline comments for non-obvious logic (e.g., coordinate calculations in `LeafletMap.tsx`)
- Section comments with `// ─── Section Name ────────────────────────────────────────────────` separators
- Magic numbers explained (e.g., `confidenceNum / 100` in opacity calc)

**JSDoc/TSDoc:**
- Used for hook documentation (`useAnalysis.ts` lines 1-7)
- Not used for components or regular functions
- Type definitions self-document via TypeScript

## Function Design

**Size:**
- Components: 100-600 lines (pages larger, components smaller)
- Hooks: ~180 lines (`useAnalysis.ts`)
- Helpers: Small, single-purpose (e.g., `delay` = 3 lines)

**Parameters:**
- Props as single object with destructuring
- Optional props with `?` and defaults via `=`
- Callbacks typed explicitly in props interface
- Max ~5 props per component; compose for more

**Return Values:**
- Hooks return object with named properties (`UseAnalysisReturn` interface)
- Components return JSX
- Helpers return typed values

## Module Design

**Exports:**
- Named exports for all components, hooks, types, constants
- Default export only for `App.tsx` and entry point `main.tsx`
- Barrel files: Not used (no `index.ts` re-exports)

**File Structure:**
- Colocated types in `types.ts`
- Data/constants in `data/mockData.ts`
- Hooks in `hooks/`
- Components in `components/`
- Pages in `pages/`

**Side Effects:**
- Top-level side effects only in `main.tsx` (root render)
- `useEffect` for all component side effects (timers, listeners, map init)
- Cleanup always provided

## CSS/Styling Conventions

**Tailwind CSS v4:**
- Utility-first classes
- Custom colors: `#050816` (dark bg), `#0F172A` (card bg), `#070D1E` (darker card)
- Brand colors: cyan (`#06B6D4`), blue (`#3B82F6`), emerald (`#10B981`), red (`#EF4444`)
- Custom fonts via `@layer base` in `index.css`:
  - `font-sans`: Plus Jakarta Sans
  - `font-mono`: JetBrains Mono
  - `font-tech`: Chakra Petch

**Patterns:**
- Dark theme throughout
- Gradients for primary actions (`bg-gradient-to-r from-blue-600 to-cyan-500`)
- Borders: `border-slate-800` default, colored borders for active states
- Shadows: `shadow-lg shadow-cyan-900/30` for branded elements
- Animations: Custom keyframes in `index.css` (`scanline`, `radar-sweep`, `pulse-glow`, `float-orbit`)
- Responsive: `md:`, `lg:`, `xl:` breakpoints
- `group-hover` for child animations on parent hover

---

*Convention analysis: 2026-09-17*