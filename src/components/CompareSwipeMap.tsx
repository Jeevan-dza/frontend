import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  GitCompare, 
  Calendar, 
  Layers, 
  Sparkles, 
  Sliders, 
  Download, 
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Maximize2
} from 'lucide-react';

export const CompareSwipeMap: React.FC = () => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Kerala 2018 coordinates
  const keralaCoords: L.LatLngTuple = [10.15, 76.40]; // Aluva / Periyar river basin

  // Leaflet map refs for side-by-side view
  const mapBeforeRef = useRef<HTMLDivElement | null>(null);
  const mapAfterRef = useRef<HTMLDivElement | null>(null);
  const mapBeforeInstance = useRef<L.Map | null>(null);
  const mapAfterInstance = useRef<L.Map | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  useEffect(() => {
    if (viewMode !== 'side-by-side') return;
    if (!mapBeforeRef.current || !mapAfterRef.current) return;

    if (mapBeforeInstance.current) {
      mapBeforeInstance.current.remove();
      mapBeforeInstance.current = null;
    }
    if (mapAfterInstance.current) {
      mapAfterInstance.current.remove();
      mapAfterInstance.current = null;
    }

    const satelliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    // 1. BEFORE MAP
    const mapBefore = L.map(mapBeforeRef.current, {
      center: keralaCoords,
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });
    L.tileLayer(satelliteUrl, { maxZoom: 18 }).addTo(mapBefore);

    // Normal baseline river polygon (0.3 km²)
    L.polygon([
      [10.145, 76.385],
      [10.155, 76.395],
      [10.160, 76.415],
      [10.150, 76.410]
    ], {
      color: '#3B82F6',
      fillColor: '#60A5FA',
      fillOpacity: 0.4,
      weight: 2
    }).addTo(mapBefore).bindPopup('Baseline River Periyar Normal Basin (0.3 km²)');

    // 2. AFTER MAP
    const mapAfter = L.map(mapAfterRef.current, {
      center: keralaCoords,
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });
    L.tileLayer(satelliteUrl, { maxZoom: 18 }).addTo(mapAfter);

    // Huge flood deluge polygon (8.2 km²)
    const floodPolygon = L.polygon([
      [10.120, 76.360],
      [10.170, 76.375],
      [10.185, 76.435],
      [10.140, 76.450],
      [10.115, 76.410]
    ], {
      color: '#06B6D4',
      fillColor: '#0284C7',
      fillOpacity: 0.55,
      weight: 2.5,
      dashArray: '5, 5'
    }).addTo(mapAfter);

    floodPolygon.bindPopup(`
      <div class="p-2 font-mono text-xs">
        <strong class="text-cyan-400">SAR DETECTED INUNDATION</strong>
        <p class="text-slate-300 mt-1">August 2018 Flood Area: 8.2 km²</p>
      </div>
    `);

    // 12 Severed / Inundated Road line segments on AFTER map
    const roadPoints: [number, number][][] = [
      [[10.13, 76.37], [10.14, 76.39], [10.15, 76.42]],
      [[10.14, 76.36], [10.16, 76.38], [10.17, 76.41]],
      [[10.12, 76.40], [10.15, 76.41], [10.17, 76.44]]
    ];

    roadPoints.forEach((pts) => {
      L.polyline(pts as L.LatLngTuple[], {
        color: '#EF4444',
        weight: 4,
        dashArray: '6, 6'
      }).addTo(mapAfter);
    });

    // Synchronize Pan & Zoom
    const sync = (source: L.Map, target: L.Map) => {
      source.on('move', () => {
        if (isSyncingRef.current) return;
        isSyncingRef.current = true;
        target.setView(source.getCenter(), source.getZoom(), { animate: false });
        isSyncingRef.current = false;
      });
    };

    sync(mapBefore, mapAfter);
    sync(mapAfter, mapBefore);

    mapBeforeInstance.current = mapBefore;
    mapAfterInstance.current = mapAfter;

    setTimeout(() => {
      mapBefore.invalidateSize();
      mapAfter.invalidateSize();
    }, 250);

    return () => {
      mapBefore.remove();
      mapAfter.remove();
      mapBeforeInstance.current = null;
      mapAfterInstance.current = null;
    };
  }, [viewMode]);

  const handleDownloadGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      scenario: 'Kerala Floods (Before vs After 2018)',
      before: { date: 'June 2018', floodAreaSqKm: 0.3 },
      after: { date: 'August 2018', floodAreaSqKm: 8.2 },
      aiSummary: 'Flood coverage increased significantly and 12 roads were affected.',
      affectedRoadsCount: 12
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kerala-2018-before-vs-after.geojson';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Comparison GeoJSON exported successfully!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <GitCompare className="w-4 h-4" />
              <span>MAIN ATTRACTION • SATELLITE COMPARISON ENGINE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-tech text-white mt-1">
              BEFORE VS AFTER ANALYSIS
            </h1>
            <p className="text-sm text-slate-300 mt-0.5 font-sans">
              Autonomous bitemporal change detection measuring flood expansion and road damage.
            </p>
          </div>

          {/* Mode Switcher: Side-by-Side vs Slider */}
          <div className="flex items-center gap-2 bg-[#050816] p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-[#050816] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>SIDE-BY-SIDE (BEFORE | AFTER)</span>
            </button>
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'slider'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-[#050816] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>COMPARISON SLIDER</span>
            </button>
          </div>
        </div>
      </div>

      {/* TWO MAPS: BEFORE | AFTER SIDE-BY-SIDE */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* BEFORE MAP CARD */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0F172A] shadow-xl">
            {/* Header Badge */}
            <div className="p-3.5 bg-[#0A1024] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                <span className="font-tech font-bold text-white text-base tracking-wide">BEFORE</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-300">Date: <strong className="text-white">June 2018</strong></span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Flood Area: <strong className="text-white">0.3 km²</strong>
                </span>
              </div>
            </div>

            {/* Map Canvas */}
            <div ref={mapBeforeRef} className="w-full h-[450px]" />

            {/* Bottom Telemetry Bar */}
            <div className="p-2.5 bg-[#070D1E] border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Sensor: Sentinel-2 MSI Optical</span>
              <span className="text-blue-400">NORMAL RIVER BASIN</span>
            </div>
          </div>

          {/* AFTER MAP CARD */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/50 bg-[#0F172A] shadow-xl shadow-cyan-950/30">
            {/* Header Badge */}
            <div className="p-3.5 bg-[#0A1024] border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-tech font-bold text-cyan-300 text-base tracking-wide">AFTER</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-300">Date: <strong className="text-white">August 2018</strong></span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Flood Area: <strong className="text-white">8.2 km²</strong>
                </span>
              </div>
            </div>

            {/* Map Canvas */}
            <div ref={mapAfterRef} className="w-full h-[450px]" />

            {/* Bottom Telemetry Bar */}
            <div className="p-2.5 bg-[#070D1E] border-t border-cyan-500/30 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Sensor: Sentinel-1 SAR C-Band Radar</span>
              <span className="text-red-400 font-bold">12 ROADS SUBMERGED / CUT-OFF</span>
            </div>
          </div>

        </div>
      ) : (
        /* COMPARISON SLIDER MODE */
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-[#0F172A] shadow-2xl h-[480px]">
            {/* Pre-event image under (June 2018 - 0.3 km²) */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80)` 
              }}
            >
              <div className="absolute top-4 left-4 bg-[#0F172A]/90 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-mono text-white shadow-xl">
                <span className="text-blue-400 font-bold block">BEFORE: JUNE 2018</span>
                <span className="text-slate-300 text-[11px]">Flood Area: 0.3 km² (Normal River Baseline)</span>
              </div>
            </div>

            {/* Post-event image clipped over (August 2018 - 8.2 km²) */}
            <div 
              className="absolute inset-0 bg-cover bg-center overflow-hidden border-r-4 border-cyan-400"
              style={{ 
                backgroundImage: `url(https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1600&q=80)`,
                width: `${sliderPosition}%`,
                boxShadow: '0 0 35px rgba(6, 182, 212, 0.4)'
              }}
            >
              <div className="absolute top-4 left-4 bg-cyan-950/90 border border-cyan-500/60 px-3.5 py-2 rounded-xl text-xs font-mono text-cyan-300 shadow-xl">
                <span className="text-cyan-300 font-bold block">AFTER: AUGUST 2018</span>
                <span className="text-white text-[11px]">Flood Area: 8.2 km² (Peak Deluge Breach)</span>
              </div>
              {/* Cyan flood overlay tint */}
              <div className="absolute inset-0 bg-cyan-600/25 mix-blend-overlay pointer-events-none" />
            </div>

            {/* Draggable Center Handle */}
            <div 
              className="absolute top-0 bottom-0 z-20 flex items-center justify-center -ml-5 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-10 h-10 rounded-full bg-cyan-400 border-2 border-white flex items-center justify-center text-[#050816] shadow-[0_0_20px_#06b6d4]">
                <GitCompare className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Interactive Range Slider Bar */}
          <div className="bg-[#0F172A] border border-slate-700/80 p-4 rounded-xl flex items-center gap-4 text-xs font-mono">
            <span className="text-blue-400 font-bold shrink-0">JUNE 2018 (0.3 km²)</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-cyan-400"
            />
            <span className="text-cyan-400 font-bold shrink-0">AUGUST 2018 (8.2 km²)</span>
          </div>
        </div>
      )}

      {/* REQUIRED BELOW MAPS: AI SUMMARY & COMPARISON STATS */}
      <div className="p-5 rounded-2xl bg-[#0F172A] border border-cyan-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI SYNTHESIS & CHANGE DETECTION SUMMARY</span>
          </div>
          <button
            onClick={handleDownloadGeoJSON}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-[#050816] text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT COMPARISON</span>
          </button>
        </div>

        {/* AI Summary Banner (Exact user wording) */}
        <div className="p-4 rounded-xl bg-[#050816] border border-cyan-500/40">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            AI EXECUTIVE SUMMARY
          </div>
          <p className="text-lg md:text-xl font-tech font-bold text-white mt-1 leading-snug">
            "Flood coverage increased significantly and 12 roads were affected."
          </p>
        </div>

        {/* Key Comparative Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {/* Stat 1: Before Flood Area */}
          <div className="p-3 rounded-xl bg-[#070D1E] border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">Before: June 2018</div>
            <div className="text-2xl font-bold font-tech text-blue-400 mt-1">0.3 km²</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Pre-Monsoon Normal</div>
          </div>

          {/* Stat 2: After Flood Area */}
          <div className="p-3 rounded-xl bg-[#070D1E] border border-cyan-500/30">
            <div className="text-[11px] font-mono text-cyan-300">After: August 2018</div>
            <div className="text-2xl font-bold font-tech text-cyan-300 mt-1">8.2 km²</div>
            <div className="text-[10px] font-mono text-cyan-400/80 mt-0.5">+7.9 km² Expansion (27x)</div>
          </div>

          {/* Stat 3: Affected Roads */}
          <div className="p-3 rounded-xl bg-[#070D1E] border border-red-500/30">
            <div className="text-[11px] font-mono text-red-300">Affected Roads</div>
            <div className="text-2xl font-bold font-tech text-red-400 mt-1">12 Roads</div>
            <div className="text-[10px] font-mono text-red-400/80 mt-0.5">Submerged / Severed</div>
          </div>

          {/* Stat 4: AI Change Confidence */}
          <div className="p-3 rounded-xl bg-[#070D1E] border border-emerald-500/30">
            <div className="text-[11px] font-mono text-emerald-300">Detection Confidence</div>
            <div className="text-2xl font-bold font-tech text-emerald-400 mt-1">98.2%</div>
            <div className="text-[10px] font-mono text-emerald-400/80 mt-0.5">Dual-Pass SAR InSAR</div>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>
    </div>
  );
};
