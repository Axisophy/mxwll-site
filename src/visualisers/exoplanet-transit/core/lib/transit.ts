import { TransitPoint } from './types';

/**
 * Simplified transit model using trapezoid approximation.
 * Good for thumbnail visualisations.
 */
export function simplifiedTransit(
  phase: number,        // -0.5 to 0.5
  depth: number,        // fractional (e.g., 0.015 for 1.5%)
  duration: number,     // as fraction of period
  ingressDuration?: number, // typically duration/10 to duration/5
): number {
  const halfDur = duration / 2;
  const halfIngress = (ingressDuration ?? duration / 6) / 2;
  const absPhase = Math.abs(phase);

  if (absPhase > halfDur) return 1.0;                    // out of transit
  if (absPhase < halfDur - halfIngress) return 1.0 - depth; // full transit

  // Ingress/egress: linear interpolation
  const t = (absPhase - (halfDur - halfIngress)) / (halfIngress * 2);
  return 1.0 - depth * (1.0 - t);
}

/**
 * Generate transit curve points using simplified model.
 */
export function generateTransitCurve(
  depth: number,        // fractional depth (e.g., 0.015 for 1.5%)
  duration: number,     // duration as fraction of period
  numPoints: number = 200,
  phaseRange: number = 0.15,  // phase range to plot (±0.15 = ±15% of period)
): TransitPoint[] {
  const points: TransitPoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const phase = -phaseRange + (2 * phaseRange * i) / (numPoints - 1);
    const flux = simplifiedTransit(phase, depth, duration);
    points.push({ phase, flux });
  }

  return points;
}

/**
 * Full analytic transit model with limb darkening.
 * Based on Mandel & Agol (2002) formalism.
 */
export function analyticTransit(
  phase: number,        // orbital phase, 0 = mid-transit
  rprs: number,         // planet/star radius ratio
  b: number,            // impact parameter
  aRs: number,          // semi-major axis / stellar radius
  u1: number,           // limb darkening coeff 1
  u2: number,           // limb darkening coeff 2
): number {
  // Projected separation between planet and star centres
  const sinPhase = Math.sin(2 * Math.PI * phase);
  const cosPhase = Math.cos(2 * Math.PI * phase);
  const z = aRs * Math.sqrt(sinPhase * sinPhase + (b * cosPhase) * (b * cosPhase));

  const p = rprs;

  // Out of transit
  if (z > 1 + p) return 1.0;

  // Calculate blocked flux with limb darkening
  // Using quadratic limb darkening law: I(mu) = 1 - u1*(1-mu) - u2*(1-mu)^2
  // where mu = cos(theta) = sqrt(1 - r^2)

  // For the uniform disk case (no limb darkening), the blocked fraction is:
  // area of overlap / pi

  let blockedFraction: number;

  if (z >= 1 - p && z <= 1 + p) {
    // Partial transit (ingress/egress)
    // Use circle-circle intersection
    blockedFraction = circleOverlap(z, p);
  } else if (z < 1 - p) {
    // Full transit - planet fully inside stellar disk
    blockedFraction = p * p;
  } else {
    return 1.0;
  }

  // Apply limb darkening correction
  // Approximate: weight by average intensity at the planet's position
  const mu = Math.sqrt(Math.max(0, 1 - z * z));
  const limbDarkeningFactor = 1 - u1 * (1 - mu) - u2 * (1 - mu) * (1 - mu);

  // Normalise by disk-integrated intensity
  const diskIntegral = 1 - u1 / 3 - u2 / 6;

  return 1.0 - (blockedFraction * limbDarkeningFactor) / diskIntegral;
}

/**
 * Calculate overlap area between two circles.
 * Used for partial transit calculation.
 */
function circleOverlap(d: number, r: number): number {
  // d = distance between centres
  // r = planet radius (stellar radius = 1)
  // R = stellar radius = 1

  const R = 1.0;

  if (d >= R + r) return 0;
  if (d <= Math.abs(R - r)) {
    // One circle completely inside the other
    return Math.PI * Math.min(r, R) * Math.min(r, R);
  }

  // Partial overlap
  const d2 = d * d;
  const r2 = r * r;
  const R2 = R * R;

  const part1 = r2 * Math.acos((d2 + r2 - R2) / (2 * d * r));
  const part2 = R2 * Math.acos((d2 + R2 - r2) / (2 * d * R));
  const part3 = 0.5 * Math.sqrt(
    (r + R + d) * (r + R - d) * (d + r - R) * (d - r + R)
  );

  return (part1 + part2 - part3) / Math.PI;
}

/**
 * Generate full analytic transit curve.
 */
export function generateAnalyticCurve(
  rprs: number,
  b: number,
  aRs: number,
  u1: number,
  u2: number,
  numPoints: number = 300,
  phaseRange: number = 0.1,
): TransitPoint[] {
  const points: TransitPoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const phase = -phaseRange + (2 * phaseRange * i) / (numPoints - 1);
    const flux = analyticTransit(phase, rprs, b, aRs, u1, u2);
    points.push({ phase, flux });
  }

  return points;
}

/**
 * Generate synthetic noisy data points.
 */
export function generateNoisyData(
  modelCurve: TransitPoint[],
  photometricNoise: number = 0.001,  // σ in fractional flux
  redNoiseFactor: number = 0.3,
  numPoints: number = 150,
  gapFraction: number = 0.05,
): TransitPoint[] {
  const points: TransitPoint[] = [];
  const phaseRange = modelCurve[modelCurve.length - 1].phase - modelCurve[0].phase;
  const minPhase = modelCurve[0].phase;

  // Generate red noise component
  let redNoise = 0;
  const redNoiseDecay = 0.95;

  for (let i = 0; i < numPoints; i++) {
    // Skip some points for gaps
    if (Math.random() < gapFraction) continue;

    // Slightly irregular phase sampling
    const basePhase = minPhase + (phaseRange * i) / (numPoints - 1);
    const phase = basePhase + (Math.random() - 0.5) * phaseRange * 0.02;

    // Interpolate model flux at this phase
    const modelFlux = interpolateModel(modelCurve, phase);

    // Add white noise
    const whiteNoise = gaussianRandom() * photometricNoise;

    // Add red noise (correlated)
    redNoise = redNoise * redNoiseDecay + gaussianRandom() * photometricNoise * redNoiseFactor;

    // Add slow trend (imperfect baseline removal)
    const trend = 0.0002 * Math.sin(phase * 10);

    const flux = modelFlux + whiteNoise + redNoise + trend;

    points.push({ phase, flux });
  }

  return points;
}

/**
 * Fold multiple transits together (simulates stacking).
 */
export function foldTransits(
  modelCurve: TransitPoint[],
  numTransits: number,
  photometricNoise: number = 0.001,
): TransitPoint[] {
  if (numTransits <= 1) {
    return generateNoisyData(modelCurve, photometricNoise);
  }

  // Generate multiple noisy datasets and average them
  const allPoints: Map<number, number[]> = new Map();

  for (let t = 0; t < numTransits; t++) {
    const noisyData = generateNoisyData(
      modelCurve,
      photometricNoise,
      0.3,
      150,
      0.05
    );

    for (const point of noisyData) {
      // Bin by phase (round to nearest 0.002)
      const binPhase = Math.round(point.phase * 500) / 500;
      if (!allPoints.has(binPhase)) {
        allPoints.set(binPhase, []);
      }
      allPoints.get(binPhase)!.push(point.flux);
    }
  }

  // Average each bin
  const foldedPoints: TransitPoint[] = [];
  for (const [phase, fluxes] of allPoints) {
    const avgFlux = fluxes.reduce((a, b) => a + b, 0) / fluxes.length;
    foldedPoints.push({ phase, flux: avgFlux });
  }

  // Sort by phase
  foldedPoints.sort((a, b) => a.phase - b.phase);

  return foldedPoints;
}

/**
 * Interpolate model flux at a given phase.
 */
function interpolateModel(curve: TransitPoint[], phase: number): number {
  if (phase <= curve[0].phase) return curve[0].flux;
  if (phase >= curve[curve.length - 1].phase) return curve[curve.length - 1].flux;

  for (let i = 0; i < curve.length - 1; i++) {
    if (phase >= curve[i].phase && phase <= curve[i + 1].phase) {
      const t = (phase - curve[i].phase) / (curve[i + 1].phase - curve[i].phase);
      return curve[i].flux + t * (curve[i + 1].flux - curve[i].flux);
    }
  }

  return 1.0;
}

/**
 * Box-Muller transform for Gaussian random numbers.
 */
function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Estimate photometric noise from stellar magnitude.
 */
export function estimateNoise(vmag: number | null): number {
  if (vmag === null) return 0.001; // default

  // Brighter stars have lower noise
  // V=10: ~100 ppm, V=14: ~500 ppm
  const baseNoise = 0.0001;
  const magFactor = Math.pow(10, (vmag - 10) * 0.15);
  return Math.min(0.005, baseNoise * magFactor);
}
