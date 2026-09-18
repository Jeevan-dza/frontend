import React, { useState } from 'react';
import { 
  Satellite, 
  Layers, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  CheckCircle2 
} from 'lucide-react';
import { LeafletMap } from '../components/LeafletMap';
import { SATELLITE_MISSIONS } from '../data/mockData';

// Each mission defaults to its primary operational theatre
const MISSION_CENTERS: Record<string, [number, number]> = {
  'sentinel-1':  [26.32, 92.58],  // Assam Brahmaputra — primary flood zone
  'sentinel-2':  [12.42, 75.73],  // Karnataka Western Ghats — optical/NDVI
  'cartosat-3':  [28.61, 77.20],  // Delhi NCR — high-res urban mapping
  'risat-2br1':  [26.32, 92.58],  // Assam — all-weather radar
  'landsat-9':   [23.26, 77.41],  // Bhopal — thermal IR mid-India
};

const BAND_COMBINATIONS = [
  { id: 'sar-flood', label: 'SAR Dual-Pol (VV + VH)', desc: 'Penetrates cloud cover & night; optimal for flood boundaries.' },
  { id: 'true-color', label: 'True Color (RGB 4-3-2)', desc: 'Natural color composite mimicking human eye vision.' },
  { id: 'false-color-nir', label: 'False Color NIR (8-4-3)', desc: 'Vegetation reflects in vibrant infrared red; water appears dark.' },
  { id: 'ndwi-water', label: 'NDWI Water Index', desc: 'Normalized difference (Green - NIR) / (Green + NIR).' },
  { id: 'ndvi-veg', label: 'NDVI Vegetation Health', desc: 'Canopy density & photosynthetic vitality measurement.' },
];

export const SatellitePage: React.FC = () => {
  const [selectedMissionId, setSelectedMissionId] = useState<string>('sentinel-1');
  const [activeBandCombo, setActiveBandCombo] = useState<string>('sar-flood');
  const [cloudFilter, setCloudFilter] = useState<number>(15); // max cloud %
  const [activeDate, setActiveDate] = useState<string>('2026-07-02');

  const missionCenters = MISSION_CENTERS;
  const mission = SATELLITE_MISSIONS.find(m => m.id === selectedMissionId) || SATELLITE_MISSIONS[0];
  const mapCenter: [number, number] = missionCenters[selectedMissionId] ?? [26.32, 92.58];
  const bandCombinations = BAND_COMBINATIONS;

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row overflow-hidden bg-[#050816]">
      {/* LEFT ORBITAL CONTROL PANEL */}
      <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#070D1E] flex flex-col shrink-0 overflow-y-auto p-4 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Earth Observation Constellations</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-tech text-white mt-1">
            SATELLITE EXPLORER
          </h1>
          <p className="text-xs text-slate-400">
            Multi-mission tasking for Sentinel, Cartosat-3, and RISAT-2BR1 radar.
          </p>
        </div>

        {/* Constellation Selector */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            SELECT MISSION SENSOR:
          </div>
          <div className="space-y-1.5">
            {SATELLITE_MISSIONS.map((sat) => (
              <button
                key={sat.id}
                onClick={() => setSelectedMissionId(sat.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  selectedMissionId === sat.id
                    ? 'bg-[#0F172A] border-cyan-400 shadow-md shadow-cyan-900/30 text-white'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="font-tech font-bold text-xs text-slate-200">{sat.name}</div>
                  <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                    {sat.agency} • {sat.type}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800">
                  {sat.resolution}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sensor Telemetry Matrix */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 space-y-2.5 font-mono text-xs">
          <div className="text-cyan-400 font-bold border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>ORBITAL TELEMETRY</span>
            <span className="text-emerald-400 text-[10px]">{mission.status}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Orbit Altitude:</span>
            <span className="text-slate-200">{mission.orbitAltitude}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Swath Width:</span>
            <span className="text-slate-200">{mission.swathWidth}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Revisit Period:</span>
            <span className="text-cyan-300">{mission.revisitTime}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Inclination:</span>
            <span className="text-slate-200">{mission.inclination}</span>
          </div>
        </div>

        {/* Band Combination Switcher */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            SPECTRAL BAND COMPOSITES:
          </div>
          <div className="space-y-1.5">
            {bandCombinations.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBandCombo(b.id)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  activeBandCombo === b.id
                    ? 'bg-[#0F172A] border-cyan-400 text-white'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-tech font-bold text-slate-200">{b.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{b.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cloud Cover Filter */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 space-y-2 font-mono text-xs">
          <div className="flex justify-between text-slate-400">
            <span>MAX CLOUD COVERAGE:</span>
            <span className="text-cyan-400 font-bold">{cloudFilter}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={cloudFilter}
            onChange={(e) => setCloudFilter(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-[10px] text-slate-400 block">
            Radar SAR sensors are impervious to cloud obstruction.
          </span>
        </div>
      </div>

      {/* RIGHT LARGE MAP DISPLAY */}
      <div className="flex-1 relative flex flex-col h-full">
        {/* Top Floating Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-[400] bg-[#0F172A]/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl shadow-2xl flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-white font-bold">{mission.name}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-cyan-300">
            BAND: <span className="text-white uppercase">{activeBandCombo}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-emerald-400">
            DOWNLINK PASS: 18 MINUTES AGO
          </div>
        </div>

        {/* Interactive Leaflet Map */}
        <LeafletMap
          center={mapCenter}
          zoom={10}
          className="w-full h-full"
          showCoordinatesHUD={true}
        />
      </div>
    </div>
  );
};
