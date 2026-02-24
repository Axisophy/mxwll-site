export interface Exoplanet {
  pl_name: string;
  hostname: string;
  pl_letter: string;
  pl_rade: number | null;      // Planet radius (Earth radii)
  pl_radj: number | null;      // Planet radius (Jupiter radii)
  pl_bmasse: number | null;    // Planet mass (Earth masses)
  pl_orbper: number | null;    // Orbital period (days)
  pl_trandep: number | null;   // Transit depth (%)
  pl_trandur: number | null;   // Transit duration (hours)
  pl_tranmid: number | null;   // Transit midpoint (BJD)
  pl_ratdor: number | null;    // Semi-major axis / stellar radius
  pl_ratror: number | null;    // Planet radius / stellar radius
  pl_imppar: number | null;    // Impact parameter
  pl_eqt: number | null;       // Equilibrium temperature (K)
  pl_insol: number | null;     // Insolation flux (Earth flux)
  pl_orbsmax: number | null;   // Semi-major axis (AU)
  pl_orbeccen: number | null;  // Orbital eccentricity
  st_teff: number | null;      // Stellar effective temperature (K)
  st_rad: number | null;       // Stellar radius (Solar radii)
  st_mass: number | null;      // Stellar mass (Solar masses)
  ra: number | null;           // Right ascension (degrees)
  dec: number | null;          // Declination (degrees)
  sy_dist: number | null;      // Distance (parsecs)
  sy_vmag: number | null;      // V-band magnitude
  disc_year: number | null;    // Discovery year
  discoverymethod: string | null;
  disc_facility: string | null;
  ld_u1: number;               // Limb darkening coefficient 1
  ld_u2: number;               // Limb darkening coefficient 2
  featured: boolean;
}

export type ViewMode = 'sky' | 'scatter';

export type SortOption = 'depth' | 'radius' | 'period' | 'year' | 'temperature';

export interface FilterState {
  facility: string | null;
  type: string | null;
}

export interface TransitPoint {
  phase: number;
  flux: number;
}

// Facility colours
export const FACILITY_COLOURS: Record<string, string> = {
  'Kepler': '#F5A623',
  'TESS': '#4A9EF5',
  'K2': '#E8854A',
  'Ground': '#5ECE7B',
  'default': '#888888',
};

// Get facility colour
export function getFacilityColour(facility: string | null): string {
  if (!facility) return FACILITY_COLOURS.default;
  if (facility.includes('Kepler')) return FACILITY_COLOURS.Kepler;
  if (facility.includes('TESS')) return FACILITY_COLOURS.TESS;
  if (facility.includes('K2')) return FACILITY_COLOURS.K2;
  return FACILITY_COLOURS.Ground;
}

// Planet type classification
export function getPlanetType(radius: number | null): string {
  if (radius === null) return 'Unknown';
  if (radius < 1.25) return 'Terrestrial';
  if (radius < 2.0) return 'Super-Earth';
  if (radius < 4.0) return 'Sub-Neptune';
  if (radius < 10.0) return 'Neptune-like';
  return 'Gas Giant';
}

// Check if in habitable zone (simplified: based on equilibrium temperature)
export function isInHabitableZone(eqTemp: number | null): boolean {
  if (eqTemp === null) return false;
  return eqTemp >= 200 && eqTemp <= 320;
}
