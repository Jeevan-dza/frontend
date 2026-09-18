/**
 * useAnalysis — The single data-fetching interface for SatQuery.
 *
 * Components call `execute(query)` and read from `{ data, isLoading, error, processingStep }`.
 * To switch from mock to a real backend: replace `mockResolver` with a real fetch() call.
 * Zero component changes required.
 */

import { useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RoadSegment {
  id: string;
  name: string;
  status: string;
  waterDepth: string;
}

export interface AnalysisResult {
  query: string;
  confidence: string;
  confidenceNum: number; // 0–100 for visual rendering
  sensor: string;
  affectedRoadsCount: number;
  freshness: string;
  location: string;
  inundatedArea: string;
  coordinates: [number, number];
  roadsList: RoadSegment[];
  scenario: 'assam' | 'karnataka' | 'kerala';
  floodTrend: { month: string; areaSqKm: number }[];
}

export type ProcessingStep =
  | 'idle'
  | 'parsing'
  | 'acquiring'
  | 'inferencing'
  | 'rendering';

export interface UseAnalysisReturn {
  data: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  processingStep: ProcessingStep;
  execute: (query: string) => void;
}

// ─── Mock resolver ─────────────────────────────────────────────────────────
// Swap the body of this function for `fetch('/api/analyze?q=...')` to go live.

async function mockResolver(query: string): Promise<AnalysisResult> {
  const q = query.toLowerCase();
  await delay(2200);

  if (q.includes('karnataka') || q.includes('forest') || q.includes('deforest')) {
    return {
      query,
      confidence: '91%', confidenceNum: 91,
      sensor: 'Sentinel-2 MSI',
      affectedRoadsCount: 4,
      freshness: '8 hours ago',
      location: 'Western Ghats, Karnataka',
      inundatedArea: '88.4 km² canopy loss',
      coordinates: [14.12, 75.15],
      scenario: 'karnataka',
      roadsList: [
        { id: 'SH-27', name: 'Shimoga – Thirthahalli Arterial', status: 'Encroachment Corridor', waterDepth: 'N/A' },
        { id: 'NH-206', name: 'Honnavar Forest Accessway', status: 'Logging Route Flagged', waterDepth: 'N/A' },
        { id: 'FR-09', name: 'Kudremukh Buffer Zone Track', status: 'Illegal Clearance', waterDepth: 'N/A' },
        { id: 'SH-48', name: 'Sirsi Forest Perimeter Link', status: 'Canopy Thinning', waterDepth: 'N/A' },
      ],
      floodTrend: [
        { month: 'Jan', areaSqKm: 12 }, { month: 'Feb', areaSqKm: 18 },
        { month: 'Mar', areaSqKm: 31 }, { month: 'Apr', areaSqKm: 54 },
        { month: 'May', areaSqKm: 71 }, { month: 'Jun', areaSqKm: 82 },
        { month: 'Jul', areaSqKm: 88 },
      ],
    };
  }

  if (q.includes('kerala') || q.includes('wayanad')) {
    return {
      query,
      confidence: '97%', confidenceNum: 97,
      sensor: 'Sentinel-1 SAR + RISAT-2BR1',
      affectedRoadsCount: 16,
      freshness: '3 hours ago',
      location: 'Idukki & Ernakulam, Kerala',
      inundatedArea: '418.2 km²',
      coordinates: [9.93, 76.26],
      scenario: 'kerala',
      roadsList: [
        { id: 'NH-85',  name: 'Kochi – Munnar Hill Highway', status: 'Landslide Blockade', waterDepth: '2.3m' },
        { id: 'SH-1',  name: 'Main Central Road (Aluva)', status: 'Periyar River Spill', waterDepth: '1.9m' },
        { id: 'NH-544', name: 'Edappally – Angamaly Toll Corridor', status: 'Waterlogging Critical', waterDepth: '1.2m' },
        { id: 'SH-16', name: 'Aluva – Munnar State Highway', status: 'Bridge Approaching Water', waterDepth: '1.5m' },
      ],
      floodTrend: [
        { month: 'Jan', areaSqKm: 42 }, { month: 'Feb', areaSqKm: 38 },
        { month: 'Mar', areaSqKm: 51 }, { month: 'Apr', areaSqKm: 120 },
        { month: 'May', areaSqKm: 260 }, { month: 'Jun', areaSqKm: 390 },
        { month: 'Jul', areaSqKm: 418 },
      ],
    };
  }

  // Default: Assam Floods
  return {
    query,
    confidence: '94%', confidenceNum: 94,
    sensor: 'Sentinel-1 SAR',
    affectedRoadsCount: 12,
    freshness: '5 hours ago',
    location: 'Assam (Brahmaputra Valley)',
    inundatedArea: '342.6 km²',
    coordinates: [26.32, 92.58],
    scenario: 'assam',
    roadsList: [
      { id: 'NH-37',  name: 'National Highway 37 (Nagaon – Jakhalabandha)', status: 'Severely Inundated', waterDepth: '1.4m' },
      { id: 'SH-12',  name: 'State Highway 12 (Morigaon Sector)', status: 'Cut-off / Impassable', waterDepth: '1.8m' },
      { id: 'MDR-4',  name: 'Moran–Naharkatia Major District Road', status: 'Partially Submerged', waterDepth: '0.6m' },
      { id: 'NH-715', name: 'NH-715 Kaziranga Bypass Section', status: 'Traffic Halted', waterDepth: '1.1m' },
      { id: 'RR-102', name: 'Bhuragaon Rural Link Road', status: 'Embankment Breach', waterDepth: '2.1m' },
      { id: 'SH-03',  name: 'Barpeta – Hajo Highway Link', status: 'Under Water', waterDepth: '0.9m' },
    ],
    floodTrend: [
      { month: 'Jan', areaSqKm: 18 }, { month: 'Feb', areaSqKm: 22 },
      { month: 'Mar', areaSqKm: 35 }, { month: 'Apr', areaSqKm: 89 },
      { month: 'May', areaSqKm: 178 }, { month: 'Jun', areaSqKm: 290 },
      { month: 'Jul', areaSqKm: 342 },
    ],
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAnalysis(): UseAnalysisReturn {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle');

  const execute = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setData(null);

    setProcessingStep('parsing');
    await delay(400);
    setProcessingStep('acquiring');
    await delay(800);
    setProcessingStep('inferencing');
    await delay(700);
    setProcessingStep('rendering');

    try {
      const result = await mockResolver(query);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Satellite feed unavailable. Retrying…');
    } finally {
      setIsLoading(false);
      setProcessingStep('idle');
    }
  }, []);

  return { data, isLoading, error, processingStep, execute };
}

