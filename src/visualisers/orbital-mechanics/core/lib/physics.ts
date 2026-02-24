import { Orbit, TransferResult, OrbitalBody } from './types';

// Physical constants
export const G = 6.67430e-20;  // km^3/(kg*s^2)

// Celestial bodies
export const EARTH: OrbitalBody = {
  name: 'Earth',
  radius: 6371,
  mass: 5.972e24,
  mu: 398600.4418,  // km^3/s^2
  color: '#4A90D9',
};

export const MOON: OrbitalBody = {
  name: 'Moon',
  radius: 1737.4,
  mass: 7.342e22,
  mu: 4902.8,
  color: '#C4C4C4',
  orbitRadius: 384400,
  orbitPeriod: 27.3 * 24 * 3600,  // ~27.3 days in seconds
};

export const SUN: OrbitalBody = {
  name: 'Sun',
  radius: 696340,
  mass: 1.989e30,
  mu: 132712440018,
  color: '#FDB813',
};

// Calculate circular orbit velocity
export function circularVelocity(mu: number, radius: number): number {
  return Math.sqrt(mu / radius);
}

// Calculate orbital period
export function orbitalPeriod(mu: number, semiMajorAxis: number): number {
  return 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / mu);
}

// Calculate vis-viva velocity at a point in an orbit
export function visViva(mu: number, r: number, a: number): number {
  return Math.sqrt(mu * (2 / r - 1 / a));
}

// Create circular orbit
export function circularOrbit(radius: number, mu: number): Orbit {
  return {
    semiMajorAxis: radius,
    eccentricity: 0,
    periapsis: radius,
    apoapsis: radius,
    period: orbitalPeriod(mu, radius),
  };
}

// Calculate Hohmann transfer
export function hohmannTransfer(
  r1: number,           // departure orbit radius (km)
  r2: number,           // arrival orbit radius (km)
  mu: number            // gravitational parameter
): TransferResult {
  // Transfer orbit semi-major axis
  const aTransfer = (r1 + r2) / 2;

  // Velocities in circular orbits
  const v1Circular = circularVelocity(mu, r1);
  const v2Circular = circularVelocity(mu, r2);

  // Velocities at transfer orbit periapsis and apoapsis
  const v1Transfer = visViva(mu, r1, aTransfer);
  const v2Transfer = visViva(mu, r2, aTransfer);

  // Delta-v for each burn
  const deltaV1 = Math.abs(v1Transfer - v1Circular);
  const deltaV2 = Math.abs(v2Circular - v2Transfer);

  // Transfer time (half the period of transfer orbit)
  const transferTime = orbitalPeriod(mu, aTransfer) / 2;

  // Transfer orbit eccentricity
  const eTransfer = (r2 - r1) / (r2 + r1);

  return {
    departureOrbit: circularOrbit(r1, mu),
    arrivalOrbit: circularOrbit(r2, mu),
    transferOrbit: {
      semiMajorAxis: aTransfer,
      eccentricity: eTransfer,
      periapsis: r1,
      apoapsis: r2,
      period: orbitalPeriod(mu, aTransfer),
    },
    deltaV1,
    deltaV2,
    totalDeltaV: deltaV1 + deltaV2,
    transferTime,
    departureVelocity: v1Transfer,
    arrivalVelocity: v2Transfer,
  };
}

// Calculate bi-elliptic transfer
export function biellipticTransfer(
  r1: number,
  r2: number,
  rIntermediate: number,
  mu: number
): TransferResult & { deltaV3: number } {
  // First transfer ellipse: r1 to rIntermediate
  const a1 = (r1 + rIntermediate) / 2;
  const v1Circular = circularVelocity(mu, r1);
  const v1Transfer = visViva(mu, r1, a1);
  const vAtIntermediate1 = visViva(mu, rIntermediate, a1);

  // Second transfer ellipse: rIntermediate to r2
  const a2 = (rIntermediate + r2) / 2;
  const vAtIntermediate2 = visViva(mu, rIntermediate, a2);
  const v2Transfer = visViva(mu, r2, a2);
  const v2Circular = circularVelocity(mu, r2);

  const deltaV1 = Math.abs(v1Transfer - v1Circular);
  const deltaV2 = Math.abs(vAtIntermediate2 - vAtIntermediate1);
  const deltaV3 = Math.abs(v2Circular - v2Transfer);

  const transferTime = orbitalPeriod(mu, a1) / 2 + orbitalPeriod(mu, a2) / 2;

  return {
    departureOrbit: circularOrbit(r1, mu),
    arrivalOrbit: circularOrbit(r2, mu),
    transferOrbit: {
      semiMajorAxis: a1,
      eccentricity: (rIntermediate - r1) / (rIntermediate + r1),
      periapsis: r1,
      apoapsis: rIntermediate,
      period: orbitalPeriod(mu, a1),
    },
    deltaV1,
    deltaV2,
    deltaV3,
    totalDeltaV: deltaV1 + deltaV2 + deltaV3,
    transferTime,
    departureVelocity: v1Transfer,
    arrivalVelocity: v2Transfer,
  };
}

// Get position on elliptical orbit at given true anomaly
export function orbitPosition(
  semiMajorAxis: number,
  eccentricity: number,
  trueAnomaly: number  // radians
): { x: number; y: number; r: number } {
  const r = semiMajorAxis * (1 - eccentricity * eccentricity) /
            (1 + eccentricity * Math.cos(trueAnomaly));
  return {
    x: r * Math.cos(trueAnomaly),
    y: r * Math.sin(trueAnomaly),
    r,
  };
}

// Convert mean anomaly to true anomaly (Newton-Raphson)
export function meanToTrueAnomaly(M: number, e: number, tolerance: number = 1e-8): number {
  // Solve Kepler&apos;s equation: M = E - e*sin(E)
  let E = M;  // Initial guess
  for (let i = 0; i < 100; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < tolerance) break;
  }

  // Convert eccentric anomaly to true anomaly
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );

  return nu;
}

// Get spacecraft state at time t along transfer
export function getTransferState(
  transfer: TransferResult,
  t: number,  // seconds since departure
  mu: number
): { x: number; y: number; r: number; v: number; trueAnomaly: number } {
  const { transferOrbit } = transfer;
  const { semiMajorAxis: a, eccentricity: e, period } = transferOrbit;

  // Mean anomaly (starts at 0 = periapsis)
  const n = 2 * Math.PI / period;  // mean motion
  const M = n * t;

  // True anomaly
  const nu = meanToTrueAnomaly(M, e);

  // Position
  const pos = orbitPosition(a, e, nu);

  // Velocity (vis-viva)
  const v = visViva(mu, pos.r, a);

  return { ...pos, v, trueAnomaly: nu };
}

// Format time as days, hours, minutes
export function formatTime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

// Format velocity
export function formatVelocity(kmPerSec: number): string {
  return `${(kmPerSec).toFixed(2)} km/s`;
}

// Format distance
export function formatDistance(km: number): string {
  if (km > 100000) {
    return `${(km / 1000).toFixed(0)}k km`;
  }
  return `${km.toFixed(0)} km`;
}
