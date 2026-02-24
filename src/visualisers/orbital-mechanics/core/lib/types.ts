export interface OrbitalBody {
  name: string;
  radius: number;          // km
  mass: number;            // kg
  mu: number;              // gravitational parameter (GM) km^3/s^2
  color: string;
  orbitRadius?: number;    // km (for moons/planets)
  orbitPeriod?: number;    // seconds
}

export interface Orbit {
  semiMajorAxis: number;   // km
  eccentricity: number;
  periapsis: number;       // km from center
  apoapsis: number;        // km from center
  period: number;          // seconds
}

export interface TransferResult {
  departureOrbit: Orbit;
  arrivalOrbit: Orbit;
  transferOrbit: Orbit;
  deltaV1: number;         // km/s (departure burn)
  deltaV2: number;         // km/s (arrival burn)
  totalDeltaV: number;     // km/s
  transferTime: number;    // seconds
  departureVelocity: number;
  arrivalVelocity: number;
}

export interface MissionPhase {
  id: string;
  name: string;
  duration: string;
  deltaV?: number;
  description: string;
  details: string;
}

export interface SpacecraftState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  altitude: number;
  speed: number;
  distanceToTarget: number;
  phase: 'parking' | 'transfer' | 'arrival';
  timeElapsed: number;
}
