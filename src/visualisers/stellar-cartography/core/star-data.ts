export interface Star {
  ra: number;       // Right Ascension in degrees (0-360)
  dec: number;      // Declination in degrees (-90 to +90)
  bp_rp: number;    // Colour index (blue - red). Range ~-0.5 to 4.5
  abs_mag: number;  // Absolute magnitude. Range ~-5 to +17
  teff: number;     // Effective temperature in Kelvin (~2500–30000)
}

export interface StarData {
  count: number;
  description: string;
  stars: Star[];
}

/**
 * Generate mock stars with realistic HR diagram distribution
 * 80% main sequence, 10% red giants, 5% white dwarfs, 5% scattered
 */
export function generateMockStars(count: number): Star[] {
  const stars: Star[] = [];

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let bp_rp: number, abs_mag: number, teff: number;

    if (roll < 0.80) {
      // Main sequence: diagonal band from hot-bright to cool-dim
      // More stars at the faint/red end (realistic IMF)
      bp_rp = Math.pow(Math.random(), 0.6) * 3.0 + 0.2;
      abs_mag = bp_rp * 3.5 - 1.0 + (Math.random() - 0.5) * 1.5;
    } else if (roll < 0.90) {
      // Red giants: upper right. Red (bp_rp 1-3), bright (abs_mag -2 to 2)
      bp_rp = 1.0 + Math.random() * 2.0;
      abs_mag = -2.0 + Math.random() * 4.0;
    } else if (roll < 0.95) {
      // White dwarfs: lower left. Blue-white (bp_rp -0.3 to 0.8), dim (abs_mag 10-15)
      bp_rp = -0.3 + Math.random() * 1.1;
      abs_mag = 10.0 + Math.random() * 5.0;
    } else {
      // Scattered / subgiants / horizontal branch
      bp_rp = Math.random() * 3.5;
      abs_mag = Math.random() * 18.0 - 3.0;
    }

    // Temperature from colour index (approximate)
    teff = 4600 * (1 / (0.92 * bp_rp + 1.7) + 1 / (0.92 * bp_rp + 0.62));
    teff = Math.max(2500, Math.min(30000, teff));

    // Sky position: random across the sky (uniform on sphere)
    const ra = Math.random() * 360;
    const dec = Math.asin(Math.random() * 2 - 1) * (180 / Math.PI);

    stars.push({ ra, dec, bp_rp, abs_mag, teff });
  }

  return stars;
}

/**
 * Load star data from JSON file, or generate mock data as fallback
 */
export async function loadStarData(count: number = 50000): Promise<StarData> {
  try {
    const response = await fetch('/data/gaia-stars.json');
    if (response.ok) {
      const data: StarData = await response.json();
      return data;
    }
  } catch {
    // File doesn't exist or failed to load - use mock data
  }

  // Generate mock data
  const stars = generateMockStars(count);
  return {
    count: stars.length,
    description: 'Mock data (Gaia-style distribution)',
    stars,
  };
}

/**
 * Convert star data to typed arrays for WebGL
 */
export function prepareStarBuffers(stars: Star[]) {
  const count = stars.length;

  // Sky positions (normalised)
  const skyPositions = new Float32Array(count * 2);
  // HR diagram positions (normalised)
  const hrPositions = new Float32Array(count * 2);
  // Temperatures
  const temperatures = new Float32Array(count);
  // Absolute magnitudes (for sizing)
  const magnitudes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const star = stars[i];

    // Sky position: RA 0-360 → x: -1 to +1, Dec -90 to +90 → y: -0.5 to +0.5
    skyPositions[i * 2] = (star.ra / 360) * 2 - 1;
    skyPositions[i * 2 + 1] = (star.dec / 90) * 0.5;

    // HR diagram position
    // bp_rp: -0.5 to 4.5 → x: -0.9 to +0.9 (blue/hot on left, red/cool on right)
    // abs_mag: -5 to 17 → y: +0.9 to -0.9 (bright on top, dim on bottom)
    const bpRpMin = -0.5, bpRpMax = 4.5;
    const magMin = -5, magMax = 17;

    hrPositions[i * 2] = ((star.bp_rp - bpRpMin) / (bpRpMax - bpRpMin)) * 1.8 - 0.9;
    hrPositions[i * 2 + 1] = 0.9 - ((star.abs_mag - magMin) / (magMax - magMin)) * 1.8;

    temperatures[i] = star.teff;
    magnitudes[i] = star.abs_mag;
  }

  return { skyPositions, hrPositions, temperatures, magnitudes, count };
}
