import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Layers,
  Sparkles,
  Cpu,
  MapPin,
  AlertTriangle,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  Radio,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Eye,
  RefreshCw,
  X,
  WifiOff,
  ScanLine,
  TrendingUp,
  Satellite,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LeafletMap } from '../components/LeafletMap';
import { DEFAULT_MAP_LAYERS } from '../data/mockData';
import { MapLayerConfig } from '../types';
import { useAnalysis, ProcessingStep } from '../hooks/useAnalysis';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

// --- Processing step label map ------------------------------------------
const STEP_LABELS: Record<ProcessingStep, string> = {
  idle:        'Ready',
  parsing:     'Parsing natural language query…',
  acquiring:   'Acquiring satellite feed from ESA STAC…',
  inferencing: 'Running UNet++ flood segmentation model…',
  rendering:   'Projecting GeoJSON to map canvas…',
};

// --- Skeleton components ------------------------------------------------
const MetricSkeleton: React.FC = () => (
  <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="h-2.5 w-16 bg-slate-800 rounded" />
      <div className="h-3 w-3 bg-slate-800 rounded" />
    </div>
    <div className="h-7 w-12 bg-slate-700 rounded mt-1 mb-2" />
    <div className="h-1.5 w-full bg-slate-800 rounded-full" />
  </div>
);

const RoadSkeleton: React.FC = () => (
  <div className="p-2.5 rounded-xl bg-[#0F172A]/80 border border-slate-800/80 animate-pulse flex items-center justify-between">
    <div className="space-y-1.5 flex-1">
      <div className="h-3 w-3/4 bg-slate-700 rounded" />
      <div className="h-2.5 w-1/2 bg-slate-800 rounded" />
    </div>
    <div className="h-5 w-20 bg-slate-800 rounded ml-2 shrink-0" />
  </div>
);

// --- Scan Overlay -------------------------------------------------------
const ScanOverlay: React.FC<{ step: ProcessingStep }> = ({ step }) => (
  <div className="absolute inset-0 z-[1001] pointer-events-none overflow-hidden">
    {/* Darkening vignette */}
    <div className="absolute inset-0 bg-[#050816]/40" />
    {/* Moving scan line */}
    <div
      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90"
      style={{ animation: 'scanline 1.8s ease-in-out infinite', top: '0%' }}
    />
    {/* Corner brackets */}
    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-70" />
    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400 opacity-70" />
    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400 opacity-70" />
    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-70" />
    {/* Status label */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A]/95 border border-cyan-500/50 backdrop-blur-md shadow-xl">
        <ScanLine className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="text-xs font-mono text-cyan-300 font-semibold">
          {STEP_LABELS[step]}
        </span>
      </div>
    </div>
  </div>
);

// --- Error / Empty states ------------------------------------------------
const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
    <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)]">
      <WifiOff className="w-6 h-6 text-red-400" />
    </div>
    <div className="text-sm font-semibold text-red-300 font-mono">SATELLITE FEED ERROR</div>
    <p className="text-xs text-slate-400 max-w-xs">{message}</p>
    <button
      onClick={onRetry}
      className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-mono hover:border-red-400/60 transition-colors"
    >
      <RefreshCw className="w-3 h-3" />
      Retry Query
    </button>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
    <div className="w-14 h-14 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center">
      <Satellite className="w-6 h-6 text-slate-500" />
    </div>
    <div className="text-sm font-semibold text-slate-400 font-mono">NO FEATURES DETECTED</div>
    <p className="text-xs text-slate-500 max-w-xs">
      No infrastructure impact detected for this region in the current acquisition window. Try a different area or time range.
    </p>
  </div>
);

// --- Flood Trend Sparkline ------------------------------------------------
const FloodTrendChart: React.FC<{ trend: { month: string; areaSqKm: number }[]; label: string }> = ({ trend, label }) => {
  const data = {
    labels: trend.map((d) => d.month),
    datasets: [
      {
        data: trend.map((d) => d.areaSqKm),
        borderColor: '#06B6D4',
        borderWidth: 2,
        pointBackgroundColor: '#06B6D4',
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
        backgroundColor: (ctx: any) => {
          const canvas = ctx.chart.canvas;
          const gradient = canvas.getContext('2d').createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, 'rgba(6,182,212,0.25)');
          gradient.addColorStop(1, 'rgba(6,182,212,0)');
          return gradient;
        },
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: '#0F172A',
      borderColor: 'rgba(6,182,212,0.4)',
      borderWidth: 1,
      titleColor: '#94A3B8',
      bodyColor: '#06B6D4',
      callbacks: { label: (ctx: any) => ` ${ctx.raw} km²` },
    }},
    scales: {
      x: { grid: { display: false }, ticks: { color: '#475569', font: { size: 10, family: 'JetBrains Mono' } } },
      y: { grid: { color: 'rgba(51,65,85,0.5)', lineWidth: 0.5 }, ticks: { color: '#475569', font: { size: 9, family: 'JetBrains Mono' }, maxTicksLimit: 4 }, border: { dash: [2, 4] } },
    },
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase tracking-wider">{label} — 7 MONTH TREND</span>
        </div>
        <span className="text-cyan-400 font-semibold">{trend[trend.length - 1]?.areaSqKm} km²</span>
      </div>
      <div className="rounded-xl bg-[#0A1020] border border-slate-800 p-3" style={{ height: '100px' }}>
        <Line data={data} options={options as any} />
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---------------------------------------------
export const DashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q');

  const [inputQuery, setInputQuery] = useState<string>(queryParam || 'Find flooded roads in Assam');
  const [layers, setLayers] = useState<MapLayerConfig[]>(DEFAULT_MAP_LAYERS);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  const { data, isLoading, error, processingStep, execute } = useAnalysis();

  // Trigger initial query
  useEffect(() => {
    const q = queryParam || 'Find flooded roads in Assam';
    setInputQuery(q);
    execute(q);
  }, [queryParam]);

  // Stagger card reveal after data arrives
  useEffect(() => {
    if (data) {
      setCardsVisible(false);
      const t = setTimeout(() => setCardsVisible(true), 80);
      return () => clearTimeout(t);
    }
  }, [data]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    execute(inputQuery);
  };

  const handleToggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, active: !l.active } : l));
  };

  const handleDownloadGeoJSON = () => {
    if (!data) return;
    const geojson = {
      type: 'FeatureCollection',
      metadata: {
        platform: 'SatQuery AI — SIH Prototype',
        query: data.query,
        sensor: data.sensor,
        confidence: data.confidence,
        timestamp: new Date().toISOString(),
      },
      features: [
        {
          type: 'Feature',
          properties: { name: 'Inundation Area', area_sq_km: parseFloat(data.inundatedArea), satellite: data.sensor, severity: 'CRITICAL' },
          geometry: { type: 'Polygon', coordinates: [[[data.coordinates[1]-0.2, data.coordinates[0]-0.07],[data.coordinates[1]+0.12, data.coordinates[0]+0.03],[data.coordinates[1]+0.27, data.coordinates[0]+0.10],[data.coordinates[1]+0.17, data.coordinates[0]-0.05],[data.coordinates[1]-0.2, data.coordinates[0]-0.07]]] },
        },
        ...data.roadsList.map((road, idx) => ({
          type: 'Feature',
          properties: { road_id: road.id, road_name: road.name, status: road.status, flood_depth: road.waterDepth, hazard_level: 'HIGH' },
          geometry: { type: 'LineString', coordinates: [[data.coordinates[1]-0.15+idx*0.04, data.coordinates[0]-0.08+idx*0.02],[data.coordinates[1]-0.05+idx*0.04, data.coordinates[0]+idx*0.03],[data.coordinates[1]+0.08+idx*0.04, data.coordinates[0]+0.08+idx*0.04]] },
        })),
      ],
    };
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `satquery-${data.query.toLowerCase().replace(/[^a-z0-9]/g, '-')}.geojson`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadSuccess('GeoJSON downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const trendLabel = data?.scenario === 'karnataka' ? 'Canopy Loss' : 'Inundated Area';

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden bg-[#050816]">
      {/* --- Search Bar Row ------------------------------------------------- */}
      <div className="h-14 border-b border-slate-800 bg-[#070D1E]/95 px-4 flex items-center justify-between gap-4 z-20 shrink-0">
        <form onSubmit={handleFormSubmit} className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about Earth… (e.g. Find flooded roads in Assam)"
            className="w-full pl-10 pr-24 py-2 bg-[#0F172A] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-sans"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-[#050816] rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50 flex items-center gap-1"
          >
            {isLoading ? (
              <><ScanLine className="w-3 h-3 animate-pulse" /> SCANNING</>
            ) : (
              'AI SCAN'
            )}
          </button>
        </form>

        {/* Quick Presets */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">QUICK:</span>
          {[
            { label: 'Assam Floods', q: 'Find flooded roads in Assam' },
            { label: 'Karnataka Forest', q: 'Detect deforestation in Karnataka' },
            { label: 'Kerala 2018', q: 'Compare Kerala before and after floods' },
          ].map(({ label, q }) => (
            <button
              key={label}
              onClick={() => { setInputQuery(q); execute(q); }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* --- Layer Chip Strip (ABOVE map — no overlap possible) ------------- */}
      <div className="shrink-0 border-b border-slate-800/60 bg-[#060C1A] px-4 py-1.5 flex items-center gap-2 overflow-x-auto z-10 scrollbar-none">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Layers className="w-3 h-3" /> LAYERS:
        </span>
        {layers.map(layer => (
          <button
            key={layer.id}
            onClick={() => handleToggleLayer(layer.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all flex items-center gap-1.5 shrink-0 border ${
              layer.active
                ? 'bg-[#0F172A] text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-950/50'
                : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.active ? layer.color : '#475569' }} />
            {layer.name}
          </button>
        ))}
      </div>

      {/* --- Main Split: Map | Analysis Panel ------------------------------- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT: Map */}
        <div className="flex-1 h-[55vh] lg:h-full relative overflow-hidden bg-[#02040A]">
          <LeafletMap
            center={data?.coordinates ?? [26.32, 92.58]}
            zoom={10}
            layers={layers}
            confidenceNum={data?.confidenceNum ?? 94}
            className="w-full h-full"
          />

          {/* Scan overlay during loading */}
          {isLoading && <ScanOverlay step={processingStep} />}

          {/* Map Top-Center HUD: radar status — centered so it doesn't collide with basemap or compass */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] pointer-events-none hidden md:flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-[#0F172A]/90 backdrop-blur-md border border-slate-700/80 text-xs font-mono text-slate-300 shadow-xl flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-cyan-400 animate-ping'}`}></span>
              <span className={`font-bold ${isLoading ? 'text-amber-300' : 'text-cyan-300'}`}>
                {isLoading ? STEP_LABELS[processingStep].toUpperCase() : 'RADAR OVERLAY ACTIVE'}
              </span>
              {data && (
                <>
                  <span className="text-slate-600">|</span>
                  <span>LAT: {data.coordinates[0].toFixed(2)}°N</span>
                  <span>LON: {data.coordinates[1].toFixed(2)}°E</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Analysis Panel */}
        <div className="w-full lg:w-[440px] xl:w-[480px] h-[45vh] lg:h-full bg-[#070D1E] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto z-10">

          {/* Panel Header */}
          <div className="p-4 border-b border-slate-800/80 bg-[#0F172A]/50 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI GEOSPATIAL INTELLIGENCE</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                isLoading
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {isLoading ? 'PROCESSING' : 'ACTIVE INFERENCE'}
              </span>
            </div>
            {/* Query display */}
            <div className="mt-3 p-3 rounded-xl bg-[#050816] border border-cyan-500/30">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">PROCESSED USER QUERY</div>
              <div className="text-base font-bold font-tech text-white mt-0.5 flex items-center justify-between">
                <span>{data?.query ?? inputQuery}</span>
                {data && <span className="text-xs text-emerald-400 font-mono font-bold">✓</span>}
              </div>
              {data && (
                <div className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{data.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Panel Body */}
          <div className="p-4 space-y-4 flex-1">

            {/* --- Metric Cards ----------------------------------------------- */}
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between mb-3">
                <span>INFERENCE RESULTS</span>
                {data && <span className="text-cyan-400 font-semibold">4 KEY TELEMETRICS</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {isLoading ? (
                  <><MetricSkeleton /><MetricSkeleton /><MetricSkeleton /><MetricSkeleton /></>
                ) : data ? (
                  <>
                    {/* Confidence */}
                    <div className={`p-3 rounded-xl bg-[#0F172A] border border-slate-800 transition-all duration-500 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ transitionDelay: '0ms' }}>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Confidence</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold font-tech text-emerald-400 mt-1">{data.confidence}</div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-full rounded-full transition-all duration-1000" style={{ width: data.confidence }} />
                      </div>
                    </div>

                    {/* Sensor */}
                    <div className={`p-3 rounded-xl bg-[#0F172A] border border-slate-800 transition-all duration-500 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ transitionDelay: '80ms' }}>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Sensor</span>
                        <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <div className="text-sm font-bold font-tech text-cyan-300 mt-1 leading-tight">{data.sensor}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1.5">C-Band Radar Active</div>
                    </div>

                    {/* Affected Roads */}
                    <div className={`p-3 rounded-xl bg-[#0F172A] border border-red-500/30 transition-all duration-500 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ transitionDelay: '160ms' }}>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Affected Roads</span>
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <div className="text-2xl font-bold font-tech text-red-400 mt-1">{data.affectedRoadsCount}</div>
                      <div className="text-[10px] font-mono text-red-300/80 mt-1.5">Submerged or cut-off</div>
                    </div>

                    {/* Freshness */}
                    <div className={`p-3 rounded-xl bg-[#0F172A] border border-slate-800 transition-all duration-500 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ transitionDelay: '240ms' }}>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Freshness</span>
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <div className="text-sm font-bold font-tech text-blue-300 mt-1">{data.freshness}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1.5">Overpass: 05:42 IST</div>
                    </div>
                  </>
                ) : error ? null : null}
              </div>
            </div>

            {/* --- Roads List or Error/Empty ---------------------------------- */}
            {isLoading ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                  <span className="animate-pulse">IDENTIFYING CORRIDORS…</span>
                </div>
                <RoadSkeleton /><RoadSkeleton /><RoadSkeleton />
              </div>
            ) : error ? (
              <ErrorState message={error} onRetry={() => execute(inputQuery)} />
            ) : data ? (
              data.roadsList.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>IDENTIFIED CUT-OFF CORRIDORS</span>
                    <span className="text-red-400">{data.roadsList.length} SHOWN</span>
                  </div>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {data.roadsList.map((road, i) => (
                      <div
                        key={road.id}
                        className="p-2.5 rounded-xl bg-[#0F172A]/80 border border-slate-800/80 hover:border-red-500/40 text-xs flex items-center justify-between transition-all"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div>
                          <div className="font-semibold text-slate-200">{road.name}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            Code: {road.id} • Max Depth: <span className="text-cyan-300">{road.waterDepth}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-red-950/80 text-red-300 border border-red-800/50 font-medium shrink-0 ml-2">
                          {road.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : null}

            {/* --- Dead whitespace -> Flood Trend Chart ------------------------ */}
            {data && !isLoading && (
              <FloodTrendChart trend={data.floodTrend} label={trendLabel} />
            )}

            {/* --- Download success toast -------------------------------------- */}
            {downloadSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{downloadSuccess}</span>
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-[#0F172A]/60 space-y-2 shrink-0">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowExportModal(true)}
                disabled={!data}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-white text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                EXPORT REPORT
              </button>
              <button
                onClick={handleDownloadGeoJSON}
                disabled={!data}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-[#050816] text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/50 transition-all active:scale-95 disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD GEOJSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Export Modal ---------------------------------------------------- */}
      {showExportModal && data && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0F172A] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-bold">
                <FileText className="w-4 h-4" />
                <span>SITREP INCIDENT INTELLIGENCE REPORT</span>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 font-mono bg-[#050816] p-4 rounded-xl border border-slate-800">
              {[
                ['MISSION / QUERY', data.query, 'text-white'],
                ['CONFIDENCE', `${data.confidence} (PyTorch UNet++)`, 'text-emerald-400'],
                ['PRIMARY SENSOR', data.sensor, 'text-cyan-300'],
                ['AFFECTED ROADS', `${data.affectedRoadsCount} Key Corridors`, 'text-red-400'],
                ['DATA FRESHNESS', data.freshness, 'text-blue-300'],
                ['TOTAL INUNDATION', data.inundatedArea, 'text-cyan-400'],
              ].map(([label, value, cls]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-500">{label}:</span>
                  <span className={`font-bold ${cls}`}>{value}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400">
              Report validated against ISRO Bhuvan STAC standards. Suitable for transmission to NDRF and State Emergency Operation Centers.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono hover:text-white">
                CLOSE
              </button>
              <button
                onClick={() => { setShowExportModal(false); handleDownloadGeoJSON(); }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050816] text-xs font-mono font-bold"
              >
                DOWNLOAD ATTACHED GEOJSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

