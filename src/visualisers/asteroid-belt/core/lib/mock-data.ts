import { Asteroid, AsteroidData, OrbitClass, AsteroidFamily, KIRKWOOD_GAPS, PLANET_ORBITS, ASTEROID_FAMILIES } from './types';

/**
 * Box-Muller transform for Gaussian random numbers
 */
function gaussRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Check if a semi-major axis falls within a Kirkwood gap
 */
function isInGap(a: number): boolean {
  for (const gap of KIRKWOOD_GAPS) {
    if (Math.abs(a - gap.a) < gap.halfWidth) {
      return true;
    }
  }
  return false;
}

/**
 * Assign asteroid to a family based on orbital elements
 * Returns the family if the asteroid falls within a family's element space
 */
function assignFamily(a: number, e: number, i: number): AsteroidFamily {
  // Check each family - ~30% of MBAs belong to families
  for (const family of ASTEROID_FAMILIES) {
    if (
      a >= family.a.min && a <= family.a.max &&
      e >= family.e.min && e <= family.e.max &&
      i >= family.i.min && i <= family.i.max
    ) {
      // Probability of belonging to family (not all in the region are members)
      if (Math.random() < 0.6) {
        return family.id;
      }
    }
  }
  return AsteroidFamily.NONE;
}

/**
 * Generate a realistic discovery year for an asteroid
 * Follows historical discovery rate: slow before 1900, exponential after 1990
 */
function generateDiscoveryYear(H: number): number {
  // Brighter asteroids (lower H) discovered earlier
  // Fainter asteroids (higher H) mostly discovered after CCD surveys (1990s+)
  const roll = Math.random();

  if (H < 12) {
    // Very bright - discovered early
    if (roll < 0.3) return 1801 + Math.floor(Math.random() * 50);      // 1801-1850
    if (roll < 0.6) return 1850 + Math.floor(Math.random() * 50);      // 1850-1900
    if (roll < 0.9) return 1900 + Math.floor(Math.random() * 90);      // 1900-1990
    return 1990 + Math.floor(Math.random() * 34);                       // 1990-2024
  } else if (H < 16) {
    // Moderately bright
    if (roll < 0.05) return 1850 + Math.floor(Math.random() * 50);     // 1850-1900
    if (roll < 0.15) return 1900 + Math.floor(Math.random() * 90);     // 1900-1990
    if (roll < 0.6) return 1990 + Math.floor(Math.random() * 10);      // 1990-2000
    return 2000 + Math.floor(Math.random() * 24);                       // 2000-2024
  } else {
    // Faint - modern surveys only
    if (roll < 0.02) return 1990 + Math.floor(Math.random() * 10);     // 1990-2000
    if (roll < 0.3) return 2000 + Math.floor(Math.random() * 10);      // 2000-2010
    return 2010 + Math.floor(Math.random() * 14);                       // 2010-2024
  }
}

/**
 * Solve Kepler's equation M = E - e*sin(E) for eccentric anomaly E
 * Then compute true anomaly
 */
function solveKepler(M_deg: number, e: number): number {
  let E = M_deg * Math.PI / 180;
  // Newton-Raphson iteration
  for (let iter = 0; iter < 10; iter++) {
    const dE = (E - e * Math.sin(E) - M_deg * Math.PI / 180) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-8) break;
  }
  // True anomaly from eccentric anomaly
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);
  const cosV = (cosE - e) / (1 - e * cosE);
  const sinV = Math.sqrt(1 - e * e) * sinE / (1 - e * cosE);
  return Math.atan2(sinV, cosV) * 180 / Math.PI;
}

/**
 * Generate mock asteroid data with realistic Kirkwood gaps
 */
export function generateMockAsteroids(count: number): Asteroid[] {
  const asteroids: Asteroid[] = [];

  for (let i = 0; i < count; i++) {
    let a: number, e: number, inc: number, orbitClass: OrbitClass;
    const roll = Math.random();

    if (roll < 0.85) {
      // Main Belt: a between 2.1 and 3.3 AU, with Kirkwood gaps
      let attempts = 0;
      do {
        a = 2.1 + Math.random() * 1.2;
        attempts++;
      } while (isInGap(a) && attempts < 100);

      e = Math.random() * 0.3;
      inc = Math.abs(gaussRandom() * 8);
      orbitClass = OrbitClass.MBA;

    } else if (roll < 0.90) {
      // Jupiter Trojans: a ≈ 5.2 AU, clustered at L4 and L5
      a = 5.15 + Math.random() * 0.1;
      e = Math.random() * 0.15;
      inc = Math.abs(gaussRandom() * 15);
      orbitClass = OrbitClass.TROJAN;

    } else if (roll < 0.93) {
      // Hildas: a ≈ 3.97 AU (3:2 resonance — they STAY in resonance)
      a = 3.90 + Math.random() * 0.15;
      e = Math.random() * 0.25;
      inc = Math.abs(gaussRandom() * 10);
      orbitClass = OrbitClass.HILDA;

    } else if (roll < 0.96) {
      // Hungarias: a ≈ 1.8-2.0 AU, high inclination
      a = 1.78 + Math.random() * 0.22;
      e = Math.random() * 0.15;
      inc = 16 + Math.random() * 10;
      orbitClass = OrbitClass.HUNGARIA;

    } else {
      // NEOs: a < 3.5, perihelion < 1.3 AU
      a = 0.5 + Math.random() * 2.5;
      e = 0.2 + Math.random() * 0.6;
      inc = Math.abs(gaussRandom() * 20);
      orbitClass = a < 1.0 ? OrbitClass.ATEN : OrbitClass.APOLLO;
    }

    // Orbital angles
    const node = Math.random() * 360;
    const peri = Math.random() * 360;
    const meanAnomaly = Math.random() * 360;

    // Compute true anomaly and radius
    const trueAnomaly = solveKepler(meanAnomaly, e);
    const r = a * (1 - e * e) / (1 + e * Math.cos(trueAnomaly * Math.PI / 180));

    // Position in orbital plane, then rotate to ecliptic
    const nodeRad = node * Math.PI / 180;
    const periRad = peri * Math.PI / 180;
    const incRad = inc * Math.PI / 180;
    const argRad = (peri + trueAnomaly) * Math.PI / 180;

    const cosNode = Math.cos(nodeRad);
    const sinNode = Math.sin(nodeRad);
    const cosArg = Math.cos(argRad);
    const sinArg = Math.sin(argRad);
    const cosInc = Math.cos(incRad);

    const x = r * (cosNode * cosArg - sinNode * sinArg * cosInc);
    const y = r * (sinNode * cosArg + cosNode * sinArg * cosInc);

    // Absolute magnitude (brightness/size)
    const H = 10 + Math.random() * 12;

    // Assign family (only for MBAs)
    const family = orbitClass === OrbitClass.MBA ? assignFamily(a, e, inc) : AsteroidFamily.NONE;

    // Generate discovery year based on brightness
    const discoveryYear = generateDiscoveryYear(H);

    asteroids.push({
      a,
      e,
      i: inc,
      node,
      peri,
      M: meanAnomaly,
      x,
      y,
      class: orbitClass,
      H,
      family,
      discoveryYear,
    });
  }

  return asteroids;
}

/**
 * Load asteroid data from JSON file or generate mock data
 */
export async function loadAsteroidData(count: number = 100000): Promise<AsteroidData> {
  // Generate mock data
  const asteroids = generateMockAsteroids(count);

  // Convert planets to the expected format
  const planets: Record<string, { a: number; x: number; y: number }> = {};
  for (const planet of PLANET_ORBITS) {
    planets[planet.name.toLowerCase()] = { a: planet.a, x: planet.x, y: planet.y };
  }

  return {
    count: asteroids.length,
    epoch: '2025-01-01',
    description: 'Mock asteroid data with Kirkwood gaps',
    planets,
    asteroids,
  };
}

/**
 * Compute histogram positions for asteroids
 */
export function computeHistogramPositions(asteroids: Asteroid[]): Float32Array {
  const BIN_COUNT = 200;
  const A_MIN = 1.5;
  const A_MAX = 5.5;
  const BIN_WIDTH = (A_MAX - A_MIN) / BIN_COUNT;

  // First pass: count per bin and assign bins
  const binCounts = new Int32Array(BIN_COUNT);
  const binAssignment = new Int32Array(asteroids.length);

  for (let i = 0; i < asteroids.length; i++) {
    const bin = Math.floor((asteroids[i].a - A_MIN) / BIN_WIDTH);
    if (bin >= 0 && bin < BIN_COUNT) {
      binAssignment[i] = bin;
      binCounts[bin]++;
    } else {
      binAssignment[i] = -1; // Outside range
    }
  }

  // Find max bin count for normalisation
  let maxCount = 0;
  for (let b = 0; b < BIN_COUNT; b++) {
    if (binCounts[b] > maxCount) maxCount = binCounts[b];
  }

  // Second pass: assign histogram (x, y) positions
  const currentStack = new Int32Array(BIN_COUNT);
  const positions = new Float32Array(asteroids.length * 2);

  for (let i = 0; i < asteroids.length; i++) {
    const bin = binAssignment[i];
    if (bin < 0) {
      // Outside range — park off-screen
      positions[i * 2] = -2.0;
      positions[i * 2 + 1] = -2.0;
      continue;
    }

    // X: bin centre, mapped to NDC range
    const binCentreAU = A_MIN + (bin + 0.5) * BIN_WIDTH;
    const x = ((binCentreAU - A_MIN) / (A_MAX - A_MIN)) * 1.8 - 0.9;

    // Y: stack position within this bin
    const stackIdx = currentStack[bin]++;
    const y = -0.8 + (stackIdx / maxCount) * 1.5;

    // Add small random jitter
    positions[i * 2] = x + (Math.random() - 0.5) * 0.003;
    positions[i * 2 + 1] = y + (Math.random() - 0.5) * 0.002;
  }

  return positions;
}

/**
 * Compute Family view positions - scatter plot of (a, e) with family clustering
 * X = semi-major axis, Y = eccentricity
 */
export function computeFamilyPositions(asteroids: Asteroid[]): Float32Array {
  const A_MIN = 1.8;
  const A_MAX = 3.5;
  const E_MIN = 0.0;
  const E_MAX = 0.4;

  const positions = new Float32Array(asteroids.length * 2);

  for (let i = 0; i < asteroids.length; i++) {
    const asteroid = asteroids[i];

    // Map (a, e) to normalized coordinates
    const xNorm = (asteroid.a - A_MIN) / (A_MAX - A_MIN);
    const yNorm = (asteroid.e - E_MIN) / (E_MAX - E_MIN);

    // Map to NDC space (-0.9 to 0.9)
    const x = xNorm * 1.8 - 0.9;
    const y = yNorm * 1.6 - 0.8;

    // Add small jitter based on family membership
    const jitterScale = asteroid.family !== AsteroidFamily.NONE ? 0.002 : 0.004;
    positions[i * 2] = x + (Math.random() - 0.5) * jitterScale;
    positions[i * 2 + 1] = y + (Math.random() - 0.5) * jitterScale;
  }

  return positions;
}

/**
 * Compute Danger view positions - focused on NEOs
 * Similar to histogram but emphasizes perihelion < 1.3 AU
 */
export function computeDangerPositions(asteroids: Asteroid[]): Float32Array {
  const positions = new Float32Array(asteroids.length * 2);

  // Separate NEOs from the rest
  const neoIndices: number[] = [];
  const safeIndices: number[] = [];

  for (let i = 0; i < asteroids.length; i++) {
    const perihelion = asteroids[i].a * (1 - asteroids[i].e);
    const isNEO = perihelion < 1.3 ||
      asteroids[i].class === OrbitClass.NEO ||
      asteroids[i].class === OrbitClass.ATIRA ||
      asteroids[i].class === OrbitClass.ATEN ||
      asteroids[i].class === OrbitClass.APOLLO ||
      asteroids[i].class === OrbitClass.AMOR;

    if (isNEO) {
      neoIndices.push(i);
    } else {
      safeIndices.push(i);
    }
  }

  // Layout safe asteroids as a dim background (compressed)
  const safePerRow = Math.ceil(Math.sqrt(safeIndices.length));
  for (let j = 0; j < safeIndices.length; j++) {
    const i = safeIndices[j];
    const row = Math.floor(j / safePerRow);
    const col = j % safePerRow;
    // Compact them into the top portion
    positions[i * 2] = (col / safePerRow) * 1.8 - 0.9;
    positions[i * 2 + 1] = 0.2 + (row / safePerRow) * 0.5;
  }

  // Layout NEOs prominently in the lower portion
  // Sort by perihelion distance (closest first)
  neoIndices.sort((a, b) => {
    const pA = asteroids[a].a * (1 - asteroids[a].e);
    const pB = asteroids[b].a * (1 - asteroids[b].e);
    return pA - pB;
  });

  // Create a perihelion histogram for NEOs
  const Q_MIN = 0.0;
  const Q_MAX = 1.5;
  const BIN_COUNT = 60;
  const BIN_WIDTH = (Q_MAX - Q_MIN) / BIN_COUNT;

  const binCounts = new Int32Array(BIN_COUNT);
  const binAssignment = new Int32Array(neoIndices.length);

  for (let j = 0; j < neoIndices.length; j++) {
    const i = neoIndices[j];
    const q = asteroids[i].a * (1 - asteroids[i].e);
    const bin = Math.floor((q - Q_MIN) / BIN_WIDTH);
    if (bin >= 0 && bin < BIN_COUNT) {
      binAssignment[j] = bin;
      binCounts[bin]++;
    } else {
      binAssignment[j] = -1;
    }
  }

  let maxCount = 0;
  for (let b = 0; b < BIN_COUNT; b++) {
    if (binCounts[b] > maxCount) maxCount = binCounts[b];
  }

  const currentStack = new Int32Array(BIN_COUNT);
  for (let j = 0; j < neoIndices.length; j++) {
    const i = neoIndices[j];
    const bin = binAssignment[j];
    if (bin < 0) {
      positions[i * 2] = 0;
      positions[i * 2 + 1] = -0.8;
      continue;
    }

    const binCentreQ = Q_MIN + (bin + 0.5) * BIN_WIDTH;
    const x = ((binCentreQ - Q_MIN) / (Q_MAX - Q_MIN)) * 1.6 - 0.8;
    const stackIdx = currentStack[bin]++;
    const y = -0.8 + (stackIdx / Math.max(maxCount, 1)) * 0.9;

    positions[i * 2] = x + (Math.random() - 0.5) * 0.005;
    positions[i * 2 + 1] = y + (Math.random() - 0.5) * 0.003;
  }

  return positions;
}

/**
 * Compute Discovery view positions - timeline by year
 * X = discovery year, Y = stacked histogram
 */
export function computeDiscoveryPositions(asteroids: Asteroid[]): Float32Array {
  const positions = new Float32Array(asteroids.length * 2);

  const YEAR_MIN = 1800;
  const YEAR_MAX = 2025;
  const BIN_COUNT = 225; // One bin per year
  const BIN_WIDTH = 1;

  // First pass: count per bin
  const binCounts = new Int32Array(BIN_COUNT);
  const binAssignment = new Int32Array(asteroids.length);

  for (let i = 0; i < asteroids.length; i++) {
    const year = asteroids[i].discoveryYear;
    const bin = Math.floor(year - YEAR_MIN);
    if (bin >= 0 && bin < BIN_COUNT) {
      binAssignment[i] = bin;
      binCounts[bin]++;
    } else {
      binAssignment[i] = -1;
    }
  }

  // Find max bin count for normalization
  let maxCount = 0;
  for (let b = 0; b < BIN_COUNT; b++) {
    if (binCounts[b] > maxCount) maxCount = binCounts[b];
  }

  // Second pass: assign positions
  const currentStack = new Int32Array(BIN_COUNT);

  for (let i = 0; i < asteroids.length; i++) {
    const bin = binAssignment[i];
    if (bin < 0) {
      positions[i * 2] = -2.0;
      positions[i * 2 + 1] = -2.0;
      continue;
    }

    // X: year mapped to NDC
    const year = YEAR_MIN + bin + 0.5;
    const x = ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 1.8 - 0.9;

    // Y: stack position
    const stackIdx = currentStack[bin]++;
    const y = -0.8 + (stackIdx / maxCount) * 1.5;

    positions[i * 2] = x + (Math.random() - 0.5) * 0.002;
    positions[i * 2 + 1] = y + (Math.random() - 0.5) * 0.001;
  }

  return positions;
}

/**
 * Prepare typed arrays for WebGL buffers - all 5 view positions
 */
export function prepareAsteroidBuffers(asteroids: Asteroid[]) {
  const count = asteroids.length;

  // Per-asteroid attributes
  const semiMajorAxes = new Float32Array(count);
  const eccentricities = new Float32Array(count);
  const magnitudes = new Float32Array(count);
  const orbitClasses = new Float32Array(count);
  const families = new Float32Array(count);
  const discoveryYears = new Float32Array(count);
  const perihelions = new Float32Array(count);

  // Spatial (orbital) positions
  const spatialPositions = new Float32Array(count * 2);

  for (let i = 0; i < count; i++) {
    const asteroid = asteroids[i];
    spatialPositions[i * 2] = asteroid.x;
    spatialPositions[i * 2 + 1] = asteroid.y;
    semiMajorAxes[i] = asteroid.a;
    eccentricities[i] = asteroid.e;
    magnitudes[i] = asteroid.H;
    orbitClasses[i] = asteroid.class;
    families[i] = asteroid.family;
    discoveryYears[i] = asteroid.discoveryYear;
    perihelions[i] = asteroid.a * (1 - asteroid.e);
  }

  // Compute positions for all 5 views
  const histogramPositions = computeHistogramPositions(asteroids);
  const familyPositions = computeFamilyPositions(asteroids);
  const dangerPositions = computeDangerPositions(asteroids);
  const discoveryPositions = computeDiscoveryPositions(asteroids);

  return {
    // Position buffers for each view
    spatialPositions,      // View 0: Orbits
    histogramPositions,    // View 1: Gaps
    familyPositions,       // View 2: Families
    dangerPositions,       // View 3: Danger
    discoveryPositions,    // View 4: Discovery
    // Per-asteroid data
    semiMajorAxes,
    eccentricities,
    magnitudes,
    orbitClasses,
    families,
    discoveryYears,
    perihelions,
    count,
  };
}
