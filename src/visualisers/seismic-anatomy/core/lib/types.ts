// Earth model types
export interface EarthLayer {
  name: string;
  r_inner: number;
  r_outer: number;
  vp: number;
  vs: number;
  rho: number;
  color: string;
}

export interface Discontinuity {
  name: string;
  depth_km: number;
  radius_km: number;
}

export interface ShadowZone {
  start_deg: number;
  end_deg: number;
  cause: string;
}

export interface EarthModel {
  radius_km: number;
  layers: EarthLayer[];
  discontinuities: Discontinuity[];
  shadow_zones: {
    s_wave: ShadowZone;
    p_wave: ShadowZone;
  };
}

// Ray path types
export interface RayPathPoint {
  theta: number;  // radians from source
  r: number;      // normalized radius (0-1)
  t: number;      // time in seconds
}

export interface RayPath {
  phase: string;
  distance_deg: number;
  time_s: number;
  ray_param: number;
  takeoff_angle: number;
  incident_angle: number;
  wave_type: 'P' | 'S';
  path: RayPathPoint[];
}

// Travel time types
export interface TravelTimePoint {
  d: number;  // distance in degrees
  t: number;  // time in seconds
}

export type TravelTimes = Record<string, TravelTimePoint[]>;

// Velocity profile types
export interface VelocityPoint {
  depth: number;
  vp: number;
  vs: number;
}

// Station types
export interface PhaseArrival {
  phase: string;
  time_s: number;
}

export interface Station {
  network: string;
  station: string;
  latitude: number;
  longitude: number;
  distance_deg: number;
  in_p_shadow: boolean;
  in_s_shadow: boolean;
  arrivals: PhaseArrival[];
}

// Seismogram types
export interface Seismogram {
  station: string;
  distance_deg: number;
  sample_rate: number;
  start_time_offset_s: number;
  data: number[];
  arrivals: PhaseArrival[];
}

// Event types
export interface SeismicEvent {
  name: string;
  time_utc: string;
  latitude: number;
  longitude: number;
  depth_km: number;
  magnitude: number;
  type: string;
}

// Animation state
export interface AnimationState {
  currentTime: number;  // seconds since earthquake
  isPlaying: boolean;
  speed: number;        // 1x, 2x, 5x, etc.
}

// Phase colours
export const PHASE_COLORS: Record<string, string> = {
  P: '#0055FF',       // Electric blue
  S: '#FF0055',       // Hot pink
  PcP: '#4488FF',
  ScS: '#FF4488',
  PP: '#66AAFF',
  SS: '#FF66AA',
  PKP: '#9933FF',     // Purple for core phases
  PKIKP: '#CC66FF',
  Pdiff: '#3366CC',
  Sdiff: '#CC3366',
};

// Get wave type from phase name
export function getWaveType(phase: string): 'P' | 'S' {
  const first = phase[0].toUpperCase();
  if (first === 'P') return 'P';
  if (first === 'S') return 'S';
  return 'P';
}

// Get phase colour
export function getPhaseColor(phase: string): string {
  return PHASE_COLORS[phase] ?? (getWaveType(phase) === 'P' ? '#0055FF' : '#FF0055');
}

// Format time as mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Convert polar (theta, r) to canvas coordinates
export function polarToCanvas(
  theta: number,
  r: number,
  centerX: number,
  centerY: number,
  radius: number,
  sourceAngle: number = 0
): { x: number; y: number } {
  // theta is radians from source, r is normalized radius
  const angle = theta + sourceAngle - Math.PI / 2;  // Adjust so source is at top
  const x = centerX + r * radius * Math.sin(angle);
  const y = centerY - r * radius * Math.cos(angle);
  return { x, y };
}
