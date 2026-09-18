export interface DisasterEvent {
  id: string;
  title: string;
  category: 'Floods' | 'Cyclones' | 'Landslides' | 'Earthquakes' | 'Forest Fires';
  state: string;
  region: string;
  date: string;
  year: number;
  severity: 'Critical' | 'Severe' | 'Moderate' | 'Low';
  affectedAreaSqKm: number;
  affectedPopulation: string;
  coordinates: [number, number]; // [lat, lng]
  satelliteSensors: string[];
  thumbnail: string;
  description: string;
  damageStats: {
    submergedRoadsKm: number;
    displacedPersons: number;
    agriculturalLossHa: number;
    criticalInfraRisk: number;
  };
  beforeImage: string;
  afterImage: string;
  aiInsights: {
    confidence: number;
    floodExpansion: string;
    riskLevel: string;
    summary: string;
  };
}

export interface SatelliteMission {
  id: string;
  name: string;
  agency: 'ESA' | 'ISRO' | 'NASA' | 'USGS';
  type: 'SAR Radar' | 'Multispectral Optical' | 'Hyperspectral' | 'Thermal IR';
  resolution: string;
  revisitTime: string;
  swathWidth: string;
  status: 'Operational' | 'Active Acquisition' | 'Standby';
  orbitAltitude: string;
  inclination: string;
  launchDate: string;
  activeBands: string[];
}

export interface AIQueryResponse {
  id: string;
  query: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'synthesizing';
  location: string;
  coordinates: [number, number];
  zoom: number;
  sensors: string[];
  confidence: number;
  summary: string;
  detectedMetrics: {
    label: string;
    value: string;
    change: string;
    isAlert?: boolean;
  }[];
  steps: {
    step: string;
    description: string;
    status: 'completed' | 'active' | 'queued';
    timeMs: number;
  }[];
  suggestedPrompts: string[];
  geojsonLayer?: string;
}

export interface MapLayerConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  active: boolean;
  opacity: number;
  type: 'vector' | 'raster' | 'heatmap' | 'marker';
}
