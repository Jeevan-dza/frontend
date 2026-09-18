# Testing Patterns

**Analysis Date:** 2026-09-17

## Test Framework

**Runner:** Not configured

**Assertion Library:** Not configured

**Config Files:** None present

**Run Commands:**
```bash
# No test commands configured in package.json
# Only available script: "lint": "tsc --noEmit"
```

## Test File Organization

**Location:** No test files exist in the codebase

**Naming:** N/A

**Structure:** N/A

**Search Results:**
- `**/*.test.*` → Only node_modules files
- `**/*.spec.*` → No matches
- `**/__tests__/**` → No matches
- `**/test/**` → No matches

## Test Structure

**Suite Organization:** Not applicable

**Patterns:** Not applicable

## Mocking

**Framework:** Not configured

**Patterns:** Not applicable

**What to Mock:** Not applicable

**What NOT to Mock:** Not applicable

## Fixtures and Factories

**Test Data:** Not applicable

**Location:** Not applicable

## Coverage

**Requirements:** None enforced

**View Coverage:** Not available

## Test Types

**Unit Tests:** Not implemented

**Integration Tests:** Not implemented

**E2E Tests:** Not implemented

## Common Patterns

**Async Testing:** Not applicable

**Error Testing:** Not applicable

---

## Recommendations for Adding Tests

Given the codebase structure, here are recommended patterns when tests are introduced:

### Suggested Framework: Vitest
- Native Vite integration
- Fast execution with ES modules
- Compatible with React Testing Library

### Suggested Setup Files:
```
vitest.config.ts          # Vitest configuration
src/test/setup.ts         # Global test setup (React Testing Library, jest-dom)
src/test/utils.tsx        # Render helpers, providers
```

### Component Testing Patterns:

**Unit Test Example (Hook):**
```typescript
// src/hooks/__tests__/useAnalysis.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAnalysis } from '../useAnalysis';

describe('useAnalysis', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useAnalysis());
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.processingStep).toBe('idle');
  });

  it('executes query and sets loading states', async () => {
    const { result } = renderHook(() => useAnalysis());
    
    await act(async () => {
      result.current.execute('Find floods in Assam');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).not.toBeNull();
    expect(result.current.data?.query).toBe('Find floods in Assam');
  });
});
```

**Component Test Example:**
```typescript
// src/components/__tests__/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';

const renderWithRouter = (ui: React.ReactElement) => 
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Header', () => {
  it('renders logo and navigation', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('SATQUERY.AI')).toBeInTheDocument();
    expect(screen.getByText('AUTONOMOUS GEOSPATIAL INTELLIGENCE PLATFORM')).toBeInTheDocument();
  });

  it('calls onToggleSidebar when menu button clicked', () => {
    const mockToggle = vi.fn();
    renderWithRouter(<Header onToggleSidebar={mockToggle} />);
    fireEvent.click(screen.getByLabelText('Toggle navigation menu'));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
```

**Integration Test Example (Page):**
```typescript
// src/pages/__tests__/DashboardPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../DashboardPage';
import { useAnalysis } from '../../hooks/useAnalysis';

vi.mock('../../hooks/useAnalysis');

describe('DashboardPage', () => {
  it('shows loading skeleton then results', async () => {
    (useAnalysis as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      processingStep: 'parsing',
      execute: vi.fn(),
    });

    render(<BrowserRouter><DashboardPage /></BrowserRouter>);
    expect(screen.getByText('IDENTIFYING CORRIDORS…')).toBeInTheDocument();
  });
});
```

### Map Component Testing (Leaflet):
```typescript
// src/components/__tests__/LeafletMap.test.tsx
import { render, screen } from '@testing-library/react';
import { LeafletMap } from '../LeafletMap';

// Mock Leaflet
vi.mock('leaflet', () => ({
  map: vi.fn(() => ({
    setView: vi.fn(),
    on: vi.fn(),
    remove: vi.fn(),
    invalidateSize: vi.fn(),
    flyTo: vi.fn(),
    getZoom: vi.fn(() => 10),
    getCenter: vi.fn(() => ({ lat: 0, lng: 0 })),
  })),
  tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
  layerGroup: vi.fn(() => ({ addTo: vi.fn(), clearLayers: vi.fn() })),
  polygon: vi.fn(() => ({ addTo: vi.fn(), bindPopup: vi.fn() })),
  polyline: vi.fn(() => ({ addTo: vi.fn(), bindPopup: vi.fn() })),
  marker: vi.fn(() => ({ addTo: vi.fn(), bindPopup: vi.fn() })),
  divIcon: vi.fn(() => ({})),
}));

describe('LeafletMap', () => {
  it('renders map container', () => {
    render(<LeafletMap center={[26.32, 92.58]} zoom={10} />);
    expect(screen.getByRole('application')).toBeInTheDocument();
  });
});
```

### Recommended Test Commands (to add to package.json):
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### Recommended Dependencies (devDependencies):
```json
{
  "vitest": "^2.0.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "@testing-library/user-event": "^14.0.0",
  "jsdom": "^25.0.0",
  "@vitest/coverage-v8": "^2.0.0"
}
```

### Coverage Targets (when established):
- **Unit tests:** 80%+ for hooks and utilities
- **Component tests:** 70%+ for presentational components
- **Integration tests:** Critical user flows (search → results → export)
- **Exclude:** `main.tsx`, `vite.config.ts`, `types.ts`, `mockData.ts`

---

*Testing analysis: 2026-09-17*