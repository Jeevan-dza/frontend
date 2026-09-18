import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  MapPin, 
  Crosshair 
} from 'lucide-react';
import { MapLayerConfig } from '../types';
import { MOCK_GEOJSON_FEATURES } from '../data/mockData';

const BASEMAP_URLS = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
};

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  layers?: MapLayerConfig[];
  highlightScenario?: string;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
  showCoordinatesHUD?: boolean;
  confidenceNum?: number; // 0–100; drives overlay opacity
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center = [26.32, 92.58], // Assam Brahmaputra default
  zoom = 9,
  layers,
  highlightScenario = 'assam',
  onMapClick,
  className = 'w-full h-full min-h-[500px]',
  showCoordinatesHUD = true,
  confidenceNum = 94,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: center[0],
    lng: center[1]
  });
  const [activeBasemap, setActiveBasemap] = useState<'dark' | 'satellite' | 'street'>('satellite');
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);

  const basemapUrls = BASEMAP_URLS;

  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current, {
      center: [center[0], center[1]] as L.LatLngTuple,
      zoom: zoom,
      zoomControl: true,
      attributionControl: false
    });

    const tileLayer = L.tileLayer(basemapUrls[activeBasemap], {
      maxZoom: 19,
      attribution: '&copy; Esri & NASA EarthData',
      subdomains: 'abcd'
    });

    let fallbackTriggered = false;
    tileLayer.on('tileerror', () => {
      if (!fallbackTriggered && activeBasemap === 'satellite') {
        fallbackTriggered = true;
        tileLayer.setUrl(basemapUrls.dark);
      }
    });

    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    map.on('mousemove', (e) => {
      setCurrentCoords({
        lat: Number(e.latlng.lat.toFixed(4)),
        lng: Number(e.latlng.lng.toFixed(4))
      });
    });

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    map.on('click', (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    mapInstanceRef.current = map;

    // Trigger resize to prevent gray tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Basemap Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    tileLayerRef.current.setUrl(basemapUrls[activeBasemap]);
  }, [activeBasemap]);

  // Handle Center & Zoom change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([center[0], center[1]] as L.LatLngTuple, zoom, {
      animate: true,
      duration: 1.5
    });
  }, [center[0], center[1], zoom]);

  // Render Overlays (Flood Polygons, Submerged Roads, Relief Camps)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const isFloodActive = !layers || layers.some(l => l.id === 'sar-flood-mask' && l.active);
    const isRoadsActive = !layers || layers.some(l => l.id === 'flooded-roads' && l.active);
    const isCampsActive = !layers || layers.some(l => l.id === 'relief-camps' && l.active);

    // 1. Flood Polygons — confidence-driven opacity, no dash (more credible)
    const fillOpacity = Math.min(0.65, Math.max(0.25, (confidenceNum / 100) * 0.65));
    if (isFloodActive) {
      MOCK_GEOJSON_FEATURES.assamFloods.floodPolygons.forEach((poly) => {
        // Outer glow ring
        L.polygon(poly.coordinates as L.LatLngExpression[], {
          color: '#06B6D4',
          weight: 6,
          opacity: 0.18,
          fillOpacity: 0,
          interactive: false,
        }).addTo(group);
        // Main fill polygon
        const polygon = L.polygon(poly.coordinates as L.LatLngExpression[], {
          color: '#06B6D4',
          weight: 1.5,
          opacity: 0.9,
          fillColor: '#0369A1',
          fillOpacity,
        }).addTo(group);

        polygon.bindPopup(`
          <div class="p-2 font-sans">
            <div class="flex items-center gap-1.5 text-cyan-400 font-tech font-bold text-sm">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              ${poly.name}
            </div>
            <div class="text-xs text-slate-300 mt-1 font-mono">
              <div>Inundation Depth: <strong class="text-white">${poly.depth}</strong></div>
              <div>Estimated Surface Area: <strong class="text-cyan-300">${poly.areaSqKm} km²</strong></div>
              <div>Sensor: <span class="text-blue-300">Sentinel-1 SAR VV+VH</span></div>
            </div>
          </div>
        `);
      });
    }

    // 2. Flooded Roads — solid with white outline for satellite-processed look
    if (isRoadsActive) {
      MOCK_GEOJSON_FEATURES.assamFloods.floodedRoads.forEach((rd) => {
        // White outline layer (renders below)
        L.polyline(rd.coordinates as L.LatLngExpression[], {
          color: '#ffffff',
          weight: 7,
          opacity: 0.25,
          interactive: false,
        }).addTo(group);
        // Red hazard line
        const polyline = L.polyline(rd.coordinates as L.LatLngExpression[], {
          color: '#EF4444',
          weight: 4,
          opacity: 0.95,
        }).addTo(group);

        polyline.bindPopup(`
          <div class="p-2 font-sans">
            <div class="flex items-center gap-1.5 text-red-400 font-tech font-bold text-sm">
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              ${rd.name}
            </div>
            <div class="text-xs text-slate-300 mt-1 font-mono">
              <div>Status: <strong class="text-red-400 uppercase">${rd.severity}</strong></div>
              <div>Submersion Level: <strong class="text-white">1.8 meters</strong></div>
              <div class="text-amber-300 mt-1">⚠️ Transit corridor severed. Reroute via Sector 9.</div>
            </div>
          </div>
        `);
      });
    }

    // 3. Relief Camps & Evacuation Points (Green markers)
    if (isCampsActive) {
      MOCK_GEOJSON_FEATURES.assamFloods.reliefCamps.forEach((camp) => {
        const customIcon = L.divIcon({
          className: 'custom-camp-icon',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-60"></span>
              <div class="w-5 h-5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-lg">
                <span class="text-[9px] font-bold">H</span>
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(camp.coordinates as L.LatLngExpression, { icon: customIcon }).addTo(group);
        marker.bindPopup(`
          <div class="p-2 font-sans">
            <div class="flex items-center gap-1.5 text-emerald-400 font-tech font-bold text-sm">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              ${camp.name}
            </div>
            <div class="text-xs text-slate-300 mt-1 font-mono">
              <div>Shelter Capacity: <strong class="text-white">${camp.capacity}</strong></div>
              <div>Medical Supplies: <strong class="text-emerald-300">${camp.medicalSupplies}</strong></div>
              <div>Communication: <span class="text-cyan-300">SAT-LINK ISRO GSAT-7A Active</span></div>
            </div>
          </div>
        `);
      });
    }

  }, [layers, confidenceNum, highlightScenario]);

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([center[0], center[1]] as L.LatLngTuple, zoom, { duration: 1 });
  };

  return (
    <div className={`relative ${className} bg-[#050816] overflow-hidden rounded-xl border border-slate-800`}>
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />

      {/* Top Left: Basemap selector pill */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1 bg-[#0F172A]/90 backdrop-blur-md border border-slate-700/80 p-1 rounded-xl shadow-xl">
        <button
          type="button"
          onClick={() => setActiveBasemap('satellite')}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            activeBasemap === 'satellite'
              ? 'bg-cyan-500 text-[#050816] font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          SATELLITE
        </button>
        <button
          type="button"
          onClick={() => setActiveBasemap('dark')}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            activeBasemap === 'dark'
              ? 'bg-cyan-500 text-[#050816] font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          DARK MATTER
        </button>
        <button
          type="button"
          onClick={() => setActiveBasemap('street')}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            activeBasemap === 'street'
              ? 'bg-cyan-500 text-[#050816] font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          HYBRID / STREET
        </button>
      </div>

      {/* Top Right: Compass & Controls */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2">
        <button
          type="button"
          onClick={handleResetView}
          title="Reset Center & Zoom"
          className="p-2 rounded-xl bg-[#0F172A]/90 hover:bg-slate-800 text-cyan-400 border border-slate-700 backdrop-blur-md shadow-lg transition-colors"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 border border-slate-700 backdrop-blur-md text-xs font-mono text-slate-300">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>TRUE NORTH 0°</span>
        </div>
      </div>

      {/* Bottom-Left Coordinates HUD — balanced opposite to the GIS legend */}
      {showCoordinatesHUD && (
        <div className="absolute bottom-3 left-3 z-[400] hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 border border-slate-700/80 backdrop-blur-md text-[11px] font-mono text-slate-300 shadow-xl pointer-events-none">
          <div className="flex items-center gap-1 text-cyan-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>LAT: {currentCoords.lat}° N</span>
            <span>LNG: {currentCoords.lng}° E</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-400">
            ZOOM: <span className="text-white">{currentZoom}x</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            WGS84 EPSG:4326
          </div>
        </div>
      )}

      {/* Bottom Right: Quick Map Legend — sits above coordinates HUD */}
      <div className="absolute bottom-3 right-3 z-[400] bg-[#0F172A]/90 backdrop-blur-md border border-slate-700/80 px-3 py-2 rounded-xl text-[11px] font-mono shadow-xl hidden md:block pointer-events-none">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1.5 font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          GIS OVERLAY LEGEND
        </div>
        <div className="flex flex-col gap-1.5 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#0369A1]/70 border border-cyan-400/70"></span>
            <span>SAR Inundation Zone (Sentinel-1)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 rounded bg-red-500"></span>
            <span>Submerged Road Segments (OSM)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Emergency Relief Camp / Depot</span>
          </div>
        </div>
      </div>
    </div>
  );
};
