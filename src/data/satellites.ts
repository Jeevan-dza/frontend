export interface Satellite {
  id: string;
  name: string;
  type: 'SAR Radar' | 'Optical High-Res' | 'Oceanographic' | 'Multispectral';
  altitudeKm: number;
  inclinationDeg: number;
  orbitRadius: number; // radius in Three.js units relative to Earth sphere radius
  color: string;
  speed: number;
  initialAngle: number;
  tiltAxis: [number, number, number]; // custom orbital plane normal or tilt
}

export interface GroundTarget {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  description: string;
}

// Mock active constellation for SatQuery AI platform
// Note: Coordinates and orbital parameters are representative simulations for mission monitoring
export const SATELLITE_CONSTELLATION: Satellite[] = [
  {
    id: 'risat-2br1',
    name: 'RISAT-2BR1 (Radar)',
    type: 'SAR Radar',
    altitudeKm: 576,
    inclinationDeg: 37.0,
    orbitRadius: 1.32,
    color: '#06B6D4', // cyan
    speed: 0.35,
    initialAngle: 0.4,
    tiltAxis: [0.35, 0.9, 0.2]
  },
  {
    id: 'sentinel-1a',
    name: 'SENTINEL-1A (SAR)',
    type: 'SAR Radar',
    altitudeKm: 693,
    inclinationDeg: 98.18,
    orbitRadius: 1.42,
    color: '#38BDF8', // sky blue
    speed: 0.28,
    initialAngle: 1.8,
    tiltAxis: [0.15, 0.98, -0.1]
  },
  {
    id: 'cartosat-3',
    name: 'CARTOSAT-3 (0.28m)',
    type: 'Optical High-Res',
    altitudeKm: 505,
    inclinationDeg: 97.5,
    orbitRadius: 1.25,
    color: '#10B981', // emerald
    speed: 0.42,
    initialAngle: 3.2,
    tiltAxis: [-0.3, 0.95, 0.1]
  },
  {
    id: 'oceansat-3',
    name: 'EOS-06 (Oceansat-3)',
    type: 'Oceanographic',
    altitudeKm: 742,
    inclinationDeg: 98.28,
    orbitRadius: 1.5,
    color: '#818CF8', // indigo
    speed: 0.22,
    initialAngle: 4.6,
    tiltAxis: [0.2, 0.92, 0.3]
  }
];

// Ground observation nodes and ground telemetry stations (India centric)
export const GROUND_TARGETS: GroundTarget[] = [
  {
    id: 'assam-floods',
    name: 'Assam Flood Basin',
    lat: 26.2,
    lng: 92.5,
    color: '#06B6D4',
    description: 'Active SAR flood inundation monitoring'
  },
  {
    id: 'wayanad-slopes',
    name: 'Wayanad Landslide Zone',
    lat: 11.5,
    lng: 76.1,
    color: '#EF4444',
    description: 'Slope stability & moisture radar scan'
  },
  {
    id: 'isro-telemetry',
    name: 'ISRO ISTRAC Master',
    lat: 13.0,
    lng: 77.5,
    color: '#10B981',
    description: 'Primary satellite ground telemetry link'
  }
];

/**
 * Converts spherical geographic coordinates (lat, lng in degrees) to 3D Cartesian coordinates
 * on a sphere of radius R.
 * In standard equirectangular textures:
 * latitude: -90 (South Pole) to +90 (North Pole) -> y axis
 * longitude: -180 to +180 -> rotation around y axis
 */
export function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  // Add 90 deg offset to match standard equirectangular texture projection in Three.js
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}
