import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Map, 
  Download, 
  Bell, 
  User, 
  Check, 
  ShieldCheck, 
  Save, 
  CheckCircle2 
} from 'lucide-react';

// ── Custom Toggle Switch ─────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
  id: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, description, id }) => (
  <div className="flex items-center justify-between p-2 rounded-xl bg-[#050816] border border-slate-800">
    <div>
      <div className="text-slate-200 text-xs font-mono">{label}</div>
      {description && <div className="text-[10px] text-slate-400 mt-0.5">{description}</div>}
    </div>
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]
        ${checked ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-700 border-slate-600'}
      `}
    >
      <span
        className={`
          inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200
          ${checked ? 'translate-x-[17px]' : 'translate-x-[2px]'}
        `}
      />
    </button>
  </div>
);

// ── Main Settings Page ───────────────────────────────────────────────────────
export const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState<'dark-futuristic' | 'tactical-contrast' | 'obsidian'>('dark-futuristic');
  const [defaultBasemap, setDefaultBasemap] = useState<'satellite' | 'dark' | 'hybrid'>('satellite');
  const [coordFormat, setCoordFormat] = useState<'decimal' | 'dms'>('decimal');
  const [enable3dTerrain, setEnable3dTerrain] = useState<boolean>(true);
  const [exportFormat, setExportFormat] = useState<'geojson' | 'geotiff' | 'shapefile' | 'pdf'>('geojson');
  const [alertWebhooks, setAlertWebhooks] = useState<boolean>(true);
  const [satellitePassAlerts, setSatellitePassAlerts] = useState<boolean>(true);
  const [ndmaFeedSync, setNdmaFeedSync] = useState<boolean>(true);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration &amp; GIS Preferences</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-tech text-white mt-1">
            SETTINGS &amp; USER PROFILE
          </h1>
          <p className="text-sm text-slate-400">
            Tailor telemetry pipelines, export codecs, and operational clearance parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 text-[#050816] font-tech font-bold text-xs tracking-wider shadow-lg shadow-cyan-950 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>SAVE PREFERENCES</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Configuration preferences updated and stored to local mission storage.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Theme Settings */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-white font-tech font-bold text-base border-b border-slate-800 pb-3">
            <Palette className="w-5 h-5 text-cyan-400" />
            <span>THEME SETTINGS</span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'dark-futuristic', label: 'Dark Futuristic (ISRO / Space-Tech)', desc: 'Deep cosmic slate (#050816) with cyan & blue neon accents.' },
              { id: 'tactical-contrast', label: 'High-Contrast Tactical (Defense Ops)', desc: 'Pure monochrome high-visibility grid with amber status indicators.' },
              { id: 'obsidian', label: 'Obsidian Night (OLED Energy Saver)', desc: 'Zero-nit deep pitch black for low-light field command tents.' }
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setTheme(th.id as typeof theme)}
                className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  theme === th.id
                    ? 'bg-cyan-950/30 border-cyan-400 text-white'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-tech text-xs font-semibold text-slate-200">{th.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{th.desc}</div>
                </div>
                {theme === th.id && <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Map Preferences */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-white font-tech font-bold text-base border-b border-slate-800 pb-3">
            <Map className="w-5 h-5 text-cyan-400" />
            <span>MAP &amp; GIS PREFERENCES</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label htmlFor="basemap-select" className="text-slate-400 block mb-1">DEFAULT SATELLITE BASEMAP:</label>
              <select
                id="basemap-select"
                value={defaultBasemap}
                onChange={(e) => setDefaultBasemap(e.target.value as typeof defaultBasemap)}
                className="w-full px-3 py-2 rounded-xl bg-[#050816] border border-slate-700 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:border-cyan-500 cursor-pointer"
              >
                <option value="satellite">Esri World Imagery (High-Res 0.5m)</option>
                <option value="dark">CartoDB Dark Matter (High Contrast)</option>
                <option value="hybrid">OpenStreetMap / Carto Hybrid</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">COORDINATE FORMAT:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCoordFormat('decimal')}
                  className={`p-2 rounded-xl border text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    coordFormat === 'decimal' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-[#050816] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Decimal Degrees (DD)
                </button>
                <button
                  type="button"
                  onClick={() => setCoordFormat('dms')}
                  className={`p-2 rounded-xl border text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    coordFormat === 'dms' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-[#050816] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Deg/Min/Sec (DMS)
                </button>
              </div>
            </div>

            <Toggle
              id="toggle-3d-terrain"
              label="ENABLE 3D TERRAIN MESH"
              description="Cartosat & SRTM 30m Digital Elevation Model"
              checked={enable3dTerrain}
              onChange={setEnable3dTerrain}
            />
          </div>
        </div>

        {/* 3. Download Preferences */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-white font-tech font-bold text-base border-b border-slate-800 pb-3">
            <Download className="w-5 h-5 text-cyan-400" />
            <span>DOWNLOAD &amp; EXPORT PREFERENCES</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label htmlFor="export-format-select" className="text-slate-400 block mb-1">DEFAULT VECTOR &amp; SITREP FORMAT:</label>
              <select
                id="export-format-select"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                className="w-full px-3 py-2 rounded-xl bg-[#050816] border border-slate-700 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:border-cyan-500 cursor-pointer"
              >
                <option value="geojson">GeoJSON FeatureCollection (.geojson)</option>
                <option value="geotiff">Cloud Optimized GeoTIFF (.tif COG)</option>
                <option value="shapefile">ESRI Shapefile Bundle (.shp / .zip)</option>
                <option value="pdf">NDMA Standard PDF Situation Report (.pdf)</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-[#050816] border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px]">CRS PROJECTION SYSTEM:</div>
              <div className="text-cyan-300 font-bold">EPSG:4326 — WGS 84 (Global Geographic)</div>
              <div className="text-slate-400 text-[10px]">Alternate: EPSG:32643 — UTM Zone 43N (India)</div>
            </div>
          </div>
        </div>

        {/* 4. Notification Settings */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-white font-tech font-bold text-base border-b border-slate-800 pb-3">
            <Bell className="w-5 h-5 text-cyan-400" />
            <span>NOTIFICATION SETTINGS</span>
          </div>

          <div className="space-y-3">
            <Toggle
              id="toggle-webhooks"
              label="REAL-TIME INUNDATION WEBHOOKS"
              description="Push flood vector updates to emergency dispatch API"
              checked={alertWebhooks}
              onChange={setAlertWebhooks}
            />
            <Toggle
              id="toggle-satellite-alerts"
              label="SATELLITE OVERPASS ALERTS"
              description="Notify 15 min prior to Sentinel-1 / RISAT passes"
              checked={satellitePassAlerts}
              onChange={setSatellitePassAlerts}
            />
            <Toggle
              id="toggle-ndma-sync"
              label="NDMA RSS DISASTER SYNC"
              description="Harmonize live meteorological advisories"
              checked={ndmaFeedSync}
              onChange={setNdmaFeedSync}
            />
          </div>
        </div>

        {/* 5. User Profile — spans full width */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-[#0F172A] border border-cyan-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-white font-tech font-bold text-base">
              <User className="w-5 h-5 text-cyan-400" />
              <span>OPERATIONAL USER PROFILE</span>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono">
              CLEARANCE LEVEL: ALPHA-1 TOP SECRET
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-2xl font-tech font-bold text-[#050816] shadow-lg shadow-cyan-900/40 shrink-0">
              SQ
            </div>
            <div className="space-y-1">
              <h3 className="font-tech font-bold text-lg text-white">Commander A. Singhania</h3>
              <p className="text-xs font-mono text-cyan-300">
                Disaster Operations Command • National Disaster Response Force (NDRF) / ISRO Liaison
              </p>
              <p className="text-xs font-mono text-slate-400">
                Authorized Node: HQ-NEWDELHI-SAT04 • STAC Session Active (Token Valid 72h)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
