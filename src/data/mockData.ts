import { DisasterEvent, SatelliteMission, AIQueryResponse, MapLayerConfig } from '../types';

export const SATELLITE_MISSIONS: SatelliteMission[] = [
  {
    id: 'sentinel-1',
    name: 'Sentinel-1 (SAR C-Band)',
    agency: 'ESA',
    type: 'SAR Radar',
    resolution: '5m - 20m',
    revisitTime: '6 days (Constellation)',
    swathWidth: '250 km',
    status: 'Operational',
    orbitAltitude: '693 km Sun-synchronous',
    inclination: '98.18°',
    launchDate: '2014 & 2016',
    activeBands: ['VV (Vertical Co-Pol)', 'VH (Cross-Pol)', 'Interferometric Wide Swath']
  },
  {
    id: 'sentinel-2',
    name: 'Sentinel-2 (MSI Multispectral)',
    agency: 'ESA',
    type: 'Multispectral Optical',
    resolution: '10m - 60m (13 Bands)',
    revisitTime: '5 days',
    swathWidth: '290 km',
    status: 'Active Acquisition',
    orbitAltitude: '786 km',
    inclination: '98.62°',
    launchDate: '2015 & 2017',
    activeBands: ['B02 Blue', 'B03 Green', 'B04 Red', 'B08 NIR', 'B11 SWIR-1', 'B12 SWIR-2']
  },
  {
    id: 'cartosat-3',
    name: 'ISRO Cartosat-3',
    agency: 'ISRO',
    type: 'Multispectral Optical',
    resolution: '0.28m PAN / 1.12m 4-Band MX',
    revisitTime: '4 days (Steerable)',
    swathWidth: '17 km',
    status: 'Operational',
    orbitAltitude: '505 km Polar Sun-sync',
    inclination: '97.5°',
    launchDate: 'Nov 27, 2019 (PSLV-C47)',
    activeBands: ['Panchromatic Sub-0.3m', 'B1 Blue', 'B2 Green', 'B3 Red', 'B4 Near-IR']
  },
  {
    id: 'risat-2br1',
    name: 'ISRO RISAT-2BR1 (Radar)',
    agency: 'ISRO',
    type: 'SAR Radar',
    resolution: '0.35m Spotlight / 1m Stripmap',
    revisitTime: 'All-weather, 24/7',
    swathWidth: '10 - 25 km',
    status: 'Operational',
    orbitAltitude: '576 km Inclined',
    inclination: '37° Low-inclination',
    launchDate: 'Dec 11, 2019 (PSLV-C48)',
    activeBands: ['X-Band Active Array', 'Circular Polarization', 'High-Penetration Cloud/Canopy']
  },
  {
    id: 'landsat-9',
    name: 'NASA / USGS Landsat-9',
    agency: 'NASA',
    type: 'Thermal IR',
    resolution: '15m PAN / 30m Multi / 100m TIRS',
    revisitTime: '16 days',
    swathWidth: '185 km',
    status: 'Operational',
    orbitAltitude: '705 km',
    inclination: '98.2°',
    launchDate: 'Sep 27, 2021 (Atlas V)',
    activeBands: ['OLI-2 9 Spectral Bands', 'TIRS-2 Thermal Infrared split bands']
  }
];

export const DISASTER_EVENTS: DisasterEvent[] = [
  {
    id: 'assam-floods-2026',
    title: 'Assam Brahmaputra Basin Floods 2026',
    category: 'Floods',
    state: 'Assam',
    region: 'Barpeta, Kaziranga & Morigaon',
    date: 'June 18 - July 04, 2026',
    year: 2026,
    severity: 'Critical',
    affectedAreaSqKm: 4210,
    affectedPopulation: '2.45 Million',
    coordinates: [26.32, 92.58], // Brahmaputra Valley
    satelliteSensors: ['Sentinel-1 SAR C-Band', 'ISRO RISAT-2BR1', 'Cartosat-3'],
    thumbnail: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    description: 'Catastrophic monsoon deluge caused the Brahmaputra and 14 tributaries to breach embankments across 28 districts, submerging Kaziranga National Park and vital NH-715 transit corridors.',
    damageStats: {
      submergedRoadsKm: 342,
      displacedPersons: 184000,
      agriculturalLossHa: 198500,
      criticalInfraRisk: 86
    },
    beforeImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
    aiInsights: {
      confidence: 96.8,
      floodExpansion: '+284.5 sq km in 48 hours',
      riskLevel: 'SEVERITY TIER-1 (NDRF Immediate Mobilization)',
      summary: 'Automated SAR backscatter analysis indicates severe riverine expansion across Kaziranga lowlands and Morigaon agricultural belts. Over 42 village-connecting causeways severed.'
    }
  },
  {
    id: 'bihar-floods-2025',
    title: 'North Bihar Kosi Breach & Deluge',
    category: 'Floods',
    state: 'Bihar',
    region: 'Supaul, Saharsa & Darbhanga',
    date: 'August 12, 2025',
    year: 2025,
    severity: 'Severe',
    affectedAreaSqKm: 3120,
    affectedPopulation: '1.92 Million',
    coordinates: [26.15, 86.60],
    satelliteSensors: ['Sentinel-1 SAR', 'Sentinel-2 MSI', 'ISRO Resourcesat-2A'],
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80',
    description: 'Excessive Himalayan discharge into the Kosi and Bagmati river basins triggered overtopping of spurs, submerging fertile paddy tracts across Darbhanga and Madhubani.',
    damageStats: {
      submergedRoadsKm: 278,
      displacedPersons: 129000,
      agriculturalLossHa: 142000,
      criticalInfraRisk: 74
    },
    beforeImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    aiInsights: {
      confidence: 94.2,
      floodExpansion: '+188.0 sq km in 36 hours',
      riskLevel: 'SEVERE ALERT (Red Tier)',
      summary: 'Multi-temporal NDWI difference mapping reveals 89 breach zones along secondary bunds. 16 health sub-centers isolated requiring airborne watercraft drops.'
    }
  },
  {
    id: 'wayanad-landslide',
    title: 'Wayanad Mass Debris Flow & Landslide',
    category: 'Landslides',
    state: 'Kerala',
    region: 'Chooralmala & Meppadi, Wayanad',
    date: 'July 30, 2024',
    year: 2024,
    severity: 'Critical',
    affectedAreaSqKm: 86,
    affectedPopulation: '38,000 Direct Impact',
    coordinates: [11.53, 76.15],
    satelliteSensors: ['Cartosat-3 Stereo Pair', 'RISAT-2B SAR', 'Sentinel-2'],
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    description: 'Extreme orographic precipitation triggered catastrophic multi-slope failures along the Western Ghats escarpment, sending boulders and slurry over 8 km downstream.',
    damageStats: {
      submergedRoadsKm: 42,
      displacedPersons: 9400,
      agriculturalLossHa: 2800,
      criticalInfraRisk: 95
    },
    beforeImage: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    aiInsights: {
      confidence: 98.1,
      floodExpansion: '8.4 km runout debris corridor',
      riskLevel: 'DISASTER CATASTROPHIC',
      summary: 'InSAR coherence loss and sub-meter Cartosat-3 elevation differential show 3.2 million cubic meters of earth movement. Bridge linking Chooralmala completely severed.'
    }
  },
  {
    id: 'punjab-floods',
    title: 'Punjab Sutlej & Beas Spate Inundation',
    category: 'Floods',
    state: 'Punjab',
    region: 'Rupnagar, Patiala & Ferozepur',
    date: 'July 2023 - Recurring 2025',
    year: 2025,
    severity: 'Severe',
    affectedAreaSqKm: 1850,
    affectedPopulation: '840,000',
    coordinates: [30.90, 75.85],
    satelliteSensors: ['Sentinel-1A SAR', 'Landsat-9', 'ISRO EOS-04'],
    thumbnail: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80',
    description: 'High inflow from Bhakra and Pong reservoirs combined with cloudbursts inundated agricultural breadbaskets and border districts with silt-laden waters.',
    damageStats: {
      submergedRoadsKm: 194,
      displacedPersons: 48000,
      agriculturalLossHa: 98000,
      criticalInfraRisk: 62
    },
    beforeImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1200&q=80',
    aiInsights: {
      confidence: 93.6,
      floodExpansion: '+112.4 sq km basin runoff',
      riskLevel: 'ORANGE WARNING',
      summary: 'SAR cross-polarization (VH) differentiation confirms standing water depth of 1.2 to 2.4 meters across 48 agrarian villages.'
    }
  },
  {
    id: 'cyclone-biparjoy',
    title: 'Very Severe Cyclonic Storm Biparjoy',
    category: 'Cyclones',
    state: 'Gujarat',
    region: 'Kutch & Saurashtra Coastline',
    date: 'June 15, 2023',
    year: 2023,
    severity: 'Severe',
    affectedAreaSqKm: 2600,
    affectedPopulation: '1.20 Million',
    coordinates: [23.24, 69.66],
    satelliteSensors: ['INSAT-3D/3DR', 'ScatSat-1', 'Sentinel-1'],
    thumbnail: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80',
    description: 'Storm surge reaching 3-4 meters accompanied by sustained 140 km/h wind squalls battered coastal mangrove belts, ports, and power distribution grids.',
    damageStats: {
      submergedRoadsKm: 165,
      displacedPersons: 108000,
      agriculturalLossHa: 45000,
      criticalInfraRisk: 82
    },
    beforeImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=1200&q=80',
    aiInsights: {
      confidence: 97.5,
      floodExpansion: '120 km coastal saline intrusion',
      riskLevel: 'HIGH SURGE ALERT',
      summary: 'Thermal IR and scatterometer data logged maximum sea surface anomaly. Substantial erosion of tidal barrier dunes in Mandvi sector.'
    }
  },
  {
    id: 'similipal-forest-fires',
    title: 'Similipal Biosphere Active Wildfires',
    category: 'Forest Fires',
    state: 'Odisha',
    region: 'Mayurbhanj Core Reserve',
    date: 'March 2024',
    year: 2024,
    severity: 'Moderate',
    affectedAreaSqKm: 420,
    affectedPopulation: '15,000 Fringe Inhabitants',
    coordinates: [21.85, 86.35],
    satelliteSensors: ['Suomi NPP VIIRS', 'Aqua MODIS', 'Sentinel-2 MSI'],
    thumbnail: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    description: 'Prolonged dry heatwave ignited leaf litter across 24 forest ranges within the tiger reserve, challenging ground ranger deployment.',
    damageStats: {
      submergedRoadsKm: 0,
      displacedPersons: 3200,
      agriculturalLossHa: 12000,
      criticalInfraRisk: 45
    },
    beforeImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    aiInsights: {
      confidence: 95.1,
      floodExpansion: 'Burn area expansion 42 sq km/day',
      riskLevel: 'ECOLOGICAL EMERGENCY',
      summary: 'Shortwave Infrared (SWIR B12/B11) thermal hotspots registered radiative power of 185 MW. Containment perimeter established using active wind vector forecasting.'
    }
  }
];

export const PRESET_AI_RESPONSES: Record<string, AIQueryResponse> = {
  'assam': {
    id: 'res-assam-floods',
    query: 'Find flooded roads in Assam',
    timestamp: 'Just now • Satellite pass 18m ago',
    status: 'completed',
    location: 'Brahmaputra Valley, Barpeta & Morigaon (Assam)',
    coordinates: [26.32, 92.58],
    zoom: 10,
    sensors: ['Sentinel-1 SAR C-Band (10m)', 'RISAT-2BR1 X-Band (0.5m)', 'Cartosat-3 Optical (0.28m)'],
    confidence: 96.8,
    summary: 'Satellite Synthetic Aperture Radar (SAR) backscatter analysis indicates severe flood inundation across 342 km of roadways and 4,210 sq km of terrain. 18 critical bridges are currently flanked by water depths exceeding 1.4m.',
    detectedMetrics: [
      { label: 'Submerged Roadways', value: '342.6 km', change: '+78 km in 24h', isAlert: true },
      { label: 'Inundated Area', value: '4,210 sq km', change: '+14.2%', isAlert: true },
      { label: 'Severed Highway Links', value: '14 junctions', change: 'NH-715 Blocked', isAlert: true },
      { label: 'Evacuation Camp Distance', value: '3.4 km avg', change: '82% Accessible' }
    ],
    steps: [
      { step: 'Natural Language Understanding', description: 'Extracted intent: Flood hazard detection in Assam state road networks', status: 'completed', timeMs: 140 },
      { step: 'Satellite Tasking & Query', description: 'Fetched Sentinel-1 SAR GRD VV/VH and ISRO RISAT-2BR1 radar tiles', status: 'completed', timeMs: 380 },
      { step: 'PyTorch Deep Learning Segmentation', description: 'Applied UNet++ with ResNet-101 backbone for SAR water masking', status: 'completed', timeMs: 620 },
      { step: 'OpenStreetMap Overlay & GIS Validation', description: 'Intersected flood mask polygons with OSM highway vector layer', status: 'completed', timeMs: 290 },
      { step: 'Confidence & Damage Telemetry Synthesis', description: 'Calculated 96.8% F1-score with ground validation sensors', status: 'completed', timeMs: 110 }
    ],
    suggestedPrompts: [
      'Show safe detour corridors for relief convoys',
      'Compare Assam water levels with June 2024 peak',
      'Estimate agricultural crop loss in Morigaon district',
      'Export high-resolution GeoJSON shapefile'
    ],
    geojsonLayer: 'assam-floods'
  },
  'karnataka': {
    id: 'res-karnataka-forest',
    query: 'Detect deforestation in Karnataka',
    timestamp: 'Just now • Multispectral NDVI analysis',
    status: 'completed',
    location: 'Western Ghats, Kodagu & Shimoga (Karnataka)',
    coordinates: [12.42, 75.73],
    zoom: 10,
    sensors: ['Sentinel-2 MSI (10m)', 'Landsat-9 OLI-2', 'Cartosat-3'],
    confidence: 94.7,
    summary: 'Bitemporal canopy difference mapping reveals 1,480 hectares of canopy degradation along the Western Ghats periphery over the last 18 months, predominantly driven by infrastructure expansion and illegal quarrying.',
    detectedMetrics: [
      { label: 'Canopy Loss', value: '1,480 Hectares', change: '+340 Ha YoY', isAlert: true },
      { label: 'NDVI Vegetation Drop', value: '-0.38 index', change: 'Dense to Sparse', isAlert: true },
      { label: 'Forest Patch Fragmentation', value: '28 new clearings', change: 'Critical Corridor', isAlert: true },
      { label: 'Estimated Biomass Loss', value: '185,000 Tons', change: 'Carbon Sink Impact' }
    ],
    steps: [
      { step: 'Natural Language Understanding', description: 'Extracted intent: Forest canopy reduction & NDVI change detection', status: 'completed', timeMs: 120 },
      { step: 'Cloud-Free Optical Mosaic', description: 'Generated cloud-free composite from Sentinel-2 L2A BOA tiles', status: 'completed', timeMs: 440 },
      { step: 'Bitemporal Change Vector Analysis', description: 'Computed (NIR - Red) / (NIR + Red) differential indices', status: 'completed', timeMs: 510 },
      { step: 'AI Morphological Filtering', description: 'Removed seasonal deciduity artifacts using spatio-temporal RNN', status: 'completed', timeMs: 330 },
      { step: 'Cadastral Boundary Mapping', description: 'Validated against Forest Survey of India (FSI) reserve boundaries', status: 'completed', timeMs: 190 }
    ],
    suggestedPrompts: [
      'Compare Kodagu forest cover with 2020 baseline',
      'Highlight unauthorized road cuts inside reserve zones',
      'Predict landslide susceptibility based on steep slope clearing'
    ],
    geojsonLayer: 'karnataka-forest'
  },
  'kerala': {
    id: 'res-kerala-floods',
    query: 'Compare Kerala before and after floods',
    timestamp: 'Just now • Dual-sensor InSAR & Optical',
    status: 'completed',
    location: 'Wayanad & Periyar Basin (Kerala)',
    coordinates: [11.53, 76.15],
    zoom: 11,
    sensors: ['Cartosat-3 Stereo (0.28m)', 'Sentinel-1 SAR C-Band', 'Sentinel-2'],
    confidence: 98.2,
    summary: 'Synchronized before-and-after change detection reveals an 8.4 km continuous landslide runout corridor in Chooralmala-Meppadi and a 145 sq km riverine flood surge along the Chaliyar and Periyar basins.',
    detectedMetrics: [
      { label: 'Mass Movement Volume', value: '3.2M cu meters', change: 'Catastrophic Runout', isAlert: true },
      { label: 'Inundated Lowlands', value: '284.2 sq km', change: '+210% vs Pre-event', isAlert: true },
      { label: 'Structures Impacted', value: '620+ Buildings', change: 'Complete/Partial Loss', isAlert: true },
      { label: 'Evacuation Priority', value: 'Red Sector Alpha', change: 'Immediate' }
    ],
    steps: [
      { step: 'Natural Language Understanding', description: 'Extracted intent: Comparative temporal change detection for Kerala event', status: 'completed', timeMs: 110 },
      { step: 'Bitemporal Archive Co-Registration', description: 'Sub-pixel co-registered pre-event (July 15) and post-event (Aug 01)', status: 'completed', timeMs: 480 },
      { step: 'Digital Elevation Difference (DEM)', description: 'Derived 3D volumetric displacement from Cartosat-3 stereo pairs', status: 'completed', timeMs: 720 },
      { step: 'Multi-Class Damage Classification', description: 'Classified flood (blue), debris (red), and severed access points', status: 'completed', timeMs: 410 },
      { step: 'Interactive Comparison Canvas Render', description: 'Ready for synchronized swipe analysis in Compare mode', status: 'completed', timeMs: 90 }
    ],
    suggestedPrompts: [
      'Open in Flagship Compare View with Swipe Slider',
      'Assess remaining bridge stability on Meppadi road',
      'Identify flat safe zones for emergency helicopter landings'
    ],
    geojsonLayer: 'kerala-compare'
  },
  'bengaluru': {
    id: 'res-bengaluru-urban',
    query: 'Show urban expansion in Bengaluru',
    timestamp: 'Just now • Built-up Surface Index (NDBI)',
    status: 'completed',
    location: 'Greater Bengaluru Metropolitan Area (Karnataka)',
    coordinates: [12.97, 77.59],
    zoom: 11,
    sensors: ['Sentinel-2 MSI (10m)', 'Landsat-8/9 (30m)', 'Cartosat-2/3'],
    confidence: 95.9,
    summary: 'Decadal urban expansion analysis shows a 312% increase in impervious concrete and built-up land surfaces around the Sarjapur, Whitefield, and Electronic City tech corridors, with a concurrent 64% decline in water body retention areas.',
    detectedMetrics: [
      { label: 'Impervious Surface Expansion', value: '+312% (15 yrs)', change: 'East/North Corridors', isAlert: true },
      { label: 'Waterbody Retention Loss', value: '-64% Lake Area', change: 'Severe Encroachment', isAlert: true },
      { label: 'Heat Island Thermal Delta', value: '+3.8°C LST', change: 'Concrete Heat Sink' },
      { label: 'Green Canopy Fraction', value: 'Down to 14.8%', change: 'Dense Urban Matrix' }
    ],
    steps: [
      { step: 'Natural Language Understanding', description: 'Extracted intent: Urban sprawl, built-up surface dynamics & lake shrinkage', status: 'completed', timeMs: 130 },
      { step: 'Decadal Landsat/Sentinel Timeseries', description: 'Loaded multi-epoch composite mosaics from 2010 to 2026', status: 'completed', timeMs: 510 },
      { step: 'Normalized Difference Built-up Index (NDBI)', description: 'Calculated (SWIR - NIR) / (SWIR + NIR) raster transforms', status: 'completed', timeMs: 440 },
      { step: 'Lake Contour Vector Extraction', description: 'Extracted historical lake boundaries vs current water extents', status: 'completed', timeMs: 380 },
      { step: 'Synthesis of Growth Trajectory', description: 'Identified primary growth vectors towards Kempegowda Intl Airport', status: 'completed', timeMs: 120 }
    ],
    suggestedPrompts: [
      'Overlay historical 1990 lake boundaries with 2026 built area',
      'Calculate rainwater runoff risk during heavy 100mm/hr rains',
      'Identify heat island hotspots in Bellandur & Whitefield'
    ],
    geojsonLayer: 'bengaluru-urban'
  }
};

export const DEFAULT_MAP_LAYERS: MapLayerConfig[] = [
  { id: 'satellite-base', name: 'High-Res Satellite (Optical)', description: 'True-color 0.5m hybrid imagery', color: '#38BDF8', active: true, opacity: 1, type: 'raster' },
  { id: 'sar-flood-mask', name: 'SAR Water Inundation Mask', description: 'Sentinel-1 C-Band backscatter water delineation', color: '#06B6D4', active: true, opacity: 0.75, type: 'vector' },
  { id: 'flooded-roads', name: 'Submerged Road Corridors', description: 'OpenStreetMap highway vector intersection', color: '#EF4444', active: true, opacity: 0.9, type: 'vector' },
  { id: 'relief-camps', name: 'Emergency Relief Camps', description: 'Active NDRF / SDRF shelter points', color: '#10B981', active: true, opacity: 1, type: 'marker' },
  { id: 'critical-infra', name: 'Critical Infrastructure', description: 'Hospitals, power substations, airports', color: '#F59E0B', active: false, opacity: 0.85, type: 'marker' },
  { id: 'population-density', name: 'Vulnerable Population Grid', description: 'High-resolution population density at risk', color: '#8B5CF6', active: false, opacity: 0.55, type: 'heatmap' }
];

export const MOCK_GEOJSON_FEATURES = {
  // Assam flood polygons & flooded roads
  assamFloods: {
    floodPolygons: [
      {
        coordinates: [
          [26.15, 92.20], [26.25, 92.45], [26.45, 92.70], [26.55, 93.10],
          [26.40, 93.30], [26.20, 93.00], [26.10, 92.50], [26.15, 92.20]
        ],
        name: 'Brahmaputra Main Overflow Zone',
        depth: '2.8m - 4.2m',
        areaSqKm: '1,420'
      },
      {
        coordinates: [
          [26.25, 91.00], [26.35, 91.20], [26.45, 91.45], [26.30, 91.60],
          [26.18, 91.35], [26.25, 91.00]
        ],
        name: 'Barpeta Wetland Surcharge',
        depth: '1.6m - 2.5m',
        areaSqKm: '680'
      }
    ],
    floodedRoads: [
      {
        coordinates: [[26.18, 92.25], [26.22, 92.38], [26.28, 92.52], [26.35, 92.75]],
        name: 'NH-715 Sector 4 (Inundated 1.8m)',
        severity: 'Closed'
      },
      {
        coordinates: [[26.30, 92.80], [26.38, 93.00], [26.42, 93.20]],
        name: 'State Highway 3 (Bridge Breach at Km 48)',
        severity: 'Severed'
      },
      {
        coordinates: [[26.25, 91.05], [26.28, 91.15], [26.33, 91.30]],
        name: 'Barpeta Rural Link Corridor',
        severity: 'Submerged'
      }
    ],
    reliefCamps: [
      { coordinates: [26.38, 92.68], name: 'NDRF Base Camp 04 - Morigaon High School', capacity: '2,400 persons', medicalSupplies: 'Ready' },
      { coordinates: [26.20, 92.15], name: 'Guwahati Outpost Relief Depot', capacity: '5,000 persons', medicalSupplies: 'Dispatched' },
      { coordinates: [26.32, 91.02], name: 'Barpeta Stadium Shelter', capacity: '3,200 persons', medicalSupplies: 'Ready' },
      { coordinates: [26.58, 93.18], name: 'Kaziranga High Ground Transit Hub', capacity: '1,500 persons', medicalSupplies: 'High Alert' }
    ]
  }
};

export const ANALYTICS_DATA = {
  summary: {
    totalDisasters: 142,
    floodEvents: 68,
    imagesProcessed: 18420,
    monitoringRegions: 28,
    activeAlerts: 7,
    sarCoverageSqKm: '4.8M',
    modelAccuracyAvg: '95.4%'
  },
  disasterTrends: {
    labels: ['2021', '2022', '2023', '2024', '2025', '2026 (YTD)'],
    datasets: [
      {
        label: 'Floods & Inundation Events',
        data: [28, 34, 42, 49, 58, 68],
        borderColor: '#06B6D4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Landslides & Mass Movement',
        data: [12, 15, 19, 26, 31, 38],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Cyclones & Storm Surges',
        data: [6, 8, 9, 11, 14, 16],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  },
  stateWiseVulnerability: {
    labels: ['Assam', 'Bihar', 'Kerala', 'Odisha', 'Gujarat', 'Uttarakhand', 'West Bengal', 'Andhra Pradesh'],
    datasets: [
      {
        label: 'High Severity Incidents Tracked',
        data: [38, 31, 24, 22, 18, 16, 15, 12],
        backgroundColor: [
          '#3B82F6', '#06B6D4', '#10B981', '#F59E0B',
          '#EC4899', '#8B5CF6', '#6366F1', '#14B8A6'
        ],
        borderRadius: 6
      }
    ]
  },
  riverBasinInundation: {
    labels: ['Brahmaputra', 'Ganga / Kosi', 'Godavari', 'Mahanadi', 'Periyar / Chaliyar', 'Indus / Sutlej'],
    datasets: [
      {
        label: 'Peak Inundation Extent (sq km)',
        data: [8420, 6890, 3120, 2480, 1450, 2180],
        backgroundColor: 'rgba(56, 189, 248, 0.8)',
        borderColor: '#0284c7',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  },
  monthlyAcquisitions: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sentinel-1 SAR Radar Tiles',
        data: [1200, 1150, 1340, 1420, 1680, 2480, 2920, 2810, 2150, 1540, 1310, 1290],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.25)',
        tension: 0.3
      },
      {
        label: 'Sentinel-2 Multispectral Tiles',
        data: [980, 1020, 1190, 1280, 1450, 1890, 2150, 2090, 1720, 1380, 1120, 1050],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.25)',
        tension: 0.3
      }
    ]
  }
};
