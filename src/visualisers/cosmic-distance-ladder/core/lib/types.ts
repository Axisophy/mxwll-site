// Cosmic Distance Ladder Types

// Rung 1: Parallax
export interface ParallaxStar {
  id: string;
  name: string;
  ra: number;
  dec: number;
  parallax_mas: number;
  parallax_error_mas: number;
  distance_pc: number;
  distance_ly: number;
  mag_g: number;
  color_bp_rp: number;
}

// Rung 2: Cepheids
export interface CepheidLightCurvePoint {
  phase: number;
  mag: number;
}

export interface Cepheid {
  id: string;
  name?: string;
  ra: number;
  dec: number;
  period_days: number;
  log_period: number;
  apparent_mag: number;
  absolute_mag: number;
  parallax_mas: number;
  distance_pc: number;
  distance_kpc: number;
  amplitude: number;
  lightcurve?: CepheidLightCurvePoint[];
  featured?: boolean;
}

export interface PLRelation {
  slope: number;
  intercept: number;
  scatter: number;
  description: string;
}

// Rung 3: Supernovae
export interface SNLightCurvePoint {
  day: number;
  mag: number;
}

export interface Supernova {
  id: string;
  name?: string;
  host?: string;
  redshift: number;
  distance_Mpc: number;
  mu: number;  // Distance modulus
  peak_mag: number;
  x1: number;  // Stretch parameter
  c: number;   // Color
  log_host_mass: number;
  ra: number;
  dec: number;
  lightcurve?: SNLightCurvePoint[];
  featured?: boolean;
}

// Rung 4: Hubble Flow
export interface HubblePoint {
  z: number;
  v: number;
  d_Mpc: number;
  d_err?: number;
}

export interface HubbleDiagram {
  models: {
    shoes: HubblePoint[];
    planck: HubblePoint[];
  };
  observations: HubblePoint[];
  H0_shoes: number;
  H0_planck: number;
  H0_shoes_err: number;
  H0_planck_err: number;
  tension_sigma: number;
}

// Redshift Spectrum
export interface SpectralLine {
  wavelength: number;
  type: 'absorption' | 'emission' | 'both';
  name: string;
}

export interface SpectralLinePosition {
  id: string;
  name: string;
  rest_wavelength: number;
  observed_wavelength: number;
  type: string;
}

export interface SpectrumData {
  wavelengths: number[];
  flux: number[];
  lines: SpectralLinePosition[];
}

export interface RedshiftSpectrum {
  spectral_lines: Record<string, SpectralLine>;
  spectra: Record<string, SpectrumData>;
}

// Scrollytelling
export interface ScrollSection {
  id: string;
  title: string;
  rung: 1 | 2 | 3 | 4;
  steps: ScrollStep[];
}

export interface ScrollStep {
  id: string;
  content: string;
  visualState: string;
}

// Distance units
export const DISTANCE_UNITS = {
  AU: 1,
  pc: 206265,        // AU per parsec
  ly: 63241,         // AU per light year
  kpc: 206265000,    // AU per kiloparsec
  Mpc: 206265000000, // AU per megaparsec
  Gpc: 206265000000000, // AU per gigaparsec
} as const;

// Convert between distance units
export function convertDistance(
  value: number,
  from: keyof typeof DISTANCE_UNITS,
  to: keyof typeof DISTANCE_UNITS
): number {
  const inAU = value * DISTANCE_UNITS[from];
  return inAU / DISTANCE_UNITS[to];
}

// Format distance with appropriate units
export function formatDistance(parsecs: number): string {
  if (parsecs < 1) {
    const au = parsecs * 206265;
    return `${au.toFixed(1)} AU`;
  } else if (parsecs < 1000) {
    return `${parsecs.toFixed(1)} pc`;
  } else if (parsecs < 1000000) {
    const kpc = parsecs / 1000;
    return `${kpc.toFixed(2)} kpc`;
  } else if (parsecs < 1000000000) {
    const Mpc = parsecs / 1000000;
    return `${Mpc.toFixed(1)} Mpc`;
  } else {
    const Gpc = parsecs / 1000000000;
    return `${Gpc.toFixed(2)} Gpc`;
  }
}

// Format redshift
export function formatRedshift(z: number): string {
  if (z < 0.01) {
    return `z = ${(z * 299792).toFixed(0)} km/s`;
  } else {
    return `z = ${z.toFixed(3)}`;
  }
}

// Calculate lookback time from redshift (simplified)
export function lookbackTime(z: number): number {
  // Simplified approximation for flat ΛCDM with H0=70, Ωm=0.3
  // Returns time in billions of years
  const H0 = 70 / 3.086e19; // Convert to 1/s
  const t_H = 1 / H0 / (3.154e16); // Hubble time in Gyr

  // Simplified formula for lookback time
  if (z < 0.1) {
    return z * t_H * 0.96;
  } else {
    // More accurate for higher z
    return t_H * (1 - 1 / Math.sqrt(1 + z)) * 0.96;
  }
}

// Rung colors
export const RUNG_COLORS = {
  parallax: '#00AAFF',   // Blue
  cepheid: '#FFD700',    // Gold
  supernova: '#FF6B6B',  // Red
  hubble: '#9B59B6',     // Purple
} as const;

// Get color for distance scale
export function getDistanceColor(distance_pc: number): string {
  if (distance_pc < 100) {
    return RUNG_COLORS.parallax;
  } else if (distance_pc < 50000000) {
    return RUNG_COLORS.cepheid;
  } else if (distance_pc < 1000000000) {
    return RUNG_COLORS.supernova;
  } else {
    return RUNG_COLORS.hubble;
  }
}

// Spectral line colors
export function getSpectralLineColor(type: string): string {
  switch (type) {
    case 'emission':
      return '#FF6B6B';
    case 'absorption':
      return '#6B9FFF';
    default:
      return '#FFFFFF';
  }
}

// Star color from B-V or BP-RP
export function getStarColor(colorIndex: number): string {
  // BP-RP ranges from about -0.5 (blue) to 4.0 (red)
  // Map to visual color
  if (colorIndex < 0) {
    return '#9BB0FF';  // Blue
  } else if (colorIndex < 0.5) {
    return '#AABFFF';  // Blue-white
  } else if (colorIndex < 1.0) {
    return '#CAD7FF';  // White
  } else if (colorIndex < 1.5) {
    return '#F8F7FF';  // Yellow-white
  } else if (colorIndex < 2.0) {
    return '#FFF4E8';  // Yellow
  } else if (colorIndex < 2.5) {
    return '#FFD2A1';  // Orange
  } else {
    return '#FFAA6B';  // Red
  }
}
