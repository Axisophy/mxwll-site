export interface Asteroid {
  a: number;          // Semi-major axis in AU
  e: number;          // Eccentricity (0 = circle, 1 = parabola)
  i: number;          // Inclination in degrees
  node: number;       // Longitude of ascending node in degrees
  peri: number;       // Argument of perihelion in degrees
  M: number;          // Mean anomaly at epoch in degrees
  x: number;          // Heliocentric x position in AU
  y: number;          // Heliocentric y position in AU
  class: OrbitClass;  // Orbit classification
  H: number;          // Absolute magnitude (brightness/size proxy)
  family: AsteroidFamily;  // Collisional family membership
  discoveryYear: number;   // Year of discovery (1801-2024)
}

// Major asteroid families (collisional fragments)
export enum AsteroidFamily {
  NONE = 0,          // Background population
  FLORA = 1,         // Flora family (inner belt)
  VESTA = 2,         // Vesta family (inner belt, basaltic)
  NYSA = 3,          // Nysa-Polana complex
  EUNOMIA = 4,       // Eunomia family (middle belt)
  GEFION = 5,        // Gefion family
  KORONIS = 6,       // Koronis family (middle belt)
  EOS = 7,           // Eos family (outer belt)
  THEMIS = 8,        // Themis family (outer belt, carbonaceous)
  HYGIEA = 9,        // Hygiea family (outer belt)
}

export enum OrbitClass {
  MBA = 0,           // Main Belt Asteroid
  HUNGARIA = 1,      // Hungarias (inner edge, high inclination)
  PHOCAEA = 2,       // Phocaeas
  HILDA = 3,         // Hildas (3:2 resonance with Jupiter)
  TROJAN = 4,        // Jupiter Trojans (L4/L5 Lagrange points)
  NEO = 5,           // Near-Earth Object
  ATIRA = 6,         // Interior to Earth's orbit
  ATEN = 7,          // Earth-crossing, a < 1 AU
  APOLLO = 8,        // Earth-crossing, a > 1 AU
  AMOR = 9,          // Mars-crossing, approaching Earth
}

export interface Planet {
  name: string;
  a: number;         // Semi-major axis in AU
  x: number;         // Current x position
  y: number;         // Current y position
  color: [number, number, number, number];  // RGBA
}

export interface AsteroidData {
  count: number;
  epoch: string;
  description: string;
  planets: Record<string, { a: number; x: number; y: number }>;
  asteroids: Asteroid[];
}

export const KIRKWOOD_GAPS = [
  { a: 2.065, ratio: '4:1', strength: 'weak' as const, halfWidth: 0.015 },
  { a: 2.502, ratio: '3:1', strength: 'strong' as const, halfWidth: 0.02, note: 'Strongest gap — source of many near-Earth asteroids' },
  { a: 2.825, ratio: '5:2', strength: 'strong' as const, halfWidth: 0.015 },
  { a: 2.958, ratio: '7:3', strength: 'moderate' as const, halfWidth: 0.01 },
  { a: 3.279, ratio: '2:1', strength: 'strong' as const, halfWidth: 0.025, note: 'Outer edge of the main belt' },
];

export const PLANET_ORBITS: Planet[] = [
  { name: 'Mercury', a: 0.387, x: 0.35, y: 0.15, color: [0.5, 0.5, 0.5, 0.15] },
  { name: 'Venus', a: 0.723, x: -0.51, y: 0.52, color: [0.6, 0.5, 0.4, 0.15] },
  { name: 'Earth', a: 1.000, x: -0.17, y: 0.98, color: [0.3, 0.5, 0.8, 0.25] },
  { name: 'Mars', a: 1.524, x: 1.38, y: -0.64, color: [0.8, 0.4, 0.3, 0.20] },
  { name: 'Jupiter', a: 5.203, x: 4.95, y: 1.61, color: [0.7, 0.6, 0.5, 0.30] },
];

// Asteroid family definitions with orbital element ranges
// Families are defined by clustered proper elements (a, e, i)
export interface FamilyDefinition {
  id: AsteroidFamily;
  name: string;
  a: { min: number; max: number };  // Semi-major axis range (AU)
  e: { min: number; max: number };  // Eccentricity range
  i: { min: number; max: number };  // Inclination range (degrees)
  color: [number, number, number];  // RGB color for visualization
}

export const ASTEROID_FAMILIES: FamilyDefinition[] = [
  {
    id: AsteroidFamily.FLORA,
    name: 'Flora',
    a: { min: 2.15, max: 2.35 },
    e: { min: 0.10, max: 0.20 },
    i: { min: 2, max: 8 },
    color: [255, 180, 100],  // Orange
  },
  {
    id: AsteroidFamily.VESTA,
    name: 'Vesta',
    a: { min: 2.26, max: 2.48 },
    e: { min: 0.08, max: 0.14 },
    i: { min: 5, max: 8 },
    color: [200, 100, 255],  // Purple (basaltic)
  },
  {
    id: AsteroidFamily.NYSA,
    name: 'Nysa-Polana',
    a: { min: 2.38, max: 2.48 },
    e: { min: 0.14, max: 0.22 },
    i: { min: 1, max: 4 },
    color: [100, 200, 150],  // Teal
  },
  {
    id: AsteroidFamily.EUNOMIA,
    name: 'Eunomia',
    a: { min: 2.53, max: 2.72 },
    e: { min: 0.12, max: 0.18 },
    i: { min: 11, max: 15 },
    color: [255, 220, 100],  // Gold
  },
  {
    id: AsteroidFamily.GEFION,
    name: 'Gefion',
    a: { min: 2.74, max: 2.82 },
    e: { min: 0.10, max: 0.16 },
    i: { min: 8, max: 11 },
    color: [150, 255, 150],  // Light green
  },
  {
    id: AsteroidFamily.KORONIS,
    name: 'Koronis',
    a: { min: 2.83, max: 2.95 },
    e: { min: 0.04, max: 0.10 },
    i: { min: 1, max: 3.5 },
    color: [100, 180, 255],  // Light blue
  },
  {
    id: AsteroidFamily.EOS,
    name: 'Eos',
    a: { min: 2.99, max: 3.12 },
    e: { min: 0.04, max: 0.12 },
    i: { min: 8, max: 12 },
    color: [255, 150, 180],  // Pink
  },
  {
    id: AsteroidFamily.THEMIS,
    name: 'Themis',
    a: { min: 3.08, max: 3.24 },
    e: { min: 0.12, max: 0.19 },
    i: { min: 0, max: 3 },
    color: [80, 100, 180],   // Dark blue (carbonaceous)
  },
  {
    id: AsteroidFamily.HYGIEA,
    name: 'Hygiea',
    a: { min: 3.06, max: 3.24 },
    e: { min: 0.10, max: 0.16 },
    i: { min: 3, max: 6 },
    color: [120, 80, 160],   // Dark purple
  },
];
