// Radioactive Decay Chain Types

export interface ChainIsotope {
  step: number;
  isotope: string;
  element: string;
  symbol: string;
  Z: number;  // Proton number
  A: number;  // Mass number
  N: number;  // Neutron number
  is_metastable: boolean;
  is_stable: boolean;
  half_life_seconds: number | null;
  half_life_readable: string;
  log10_half_life: number | null;
  decay_mode: string | null;  // 'α', 'β⁻', etc.
  decay_type: 'alpha' | 'beta_minus' | null;
  daughter: string | null;
  delta_Z?: number;
  delta_N?: number;
  q_value_keV?: number;
  alpha_energy_keV?: number;
  branching_fraction?: number;
}

export interface InventorySnapshot {
  time_seconds: number;
  log10_time: number;
  isotopes: Record<string, number>;
}

export interface ColourEntry {
  oklch: string;
  lightness: number;
  chroma: number;
  hue: number;
  label: string;
}

export interface ChartContext {
  viewport: {
    z_min: number;
    z_max: number;
    n_min: number;
    n_max: number;
  };
  chain_path: Array<{
    N: number;
    Z: number;
    isotope: string;
  }>;
  transitions: Array<{
    from: string;
    to: string;
    type: string;
    half_life: string;
  }>;
}

export interface GeigerNuttallPoint {
  isotope: string;
  alpha_energy_keV: number;
  log10_half_life: number;
}

export interface NarrativeStep {
  isotope: string;
  title: string;
  content: string;
  highlight: string;
}

export interface TimeComparison {
  isotope: string;
  comparison: string;
}

// Half-life formatting
export function formatHalfLife(seconds: number | null): string {
  if (seconds === null) return 'stable';
  if (seconds < 1e-6) return `${(seconds * 1e9).toFixed(0)} ns`;
  if (seconds < 1e-3) return `${(seconds * 1e6).toFixed(0)} μs`;
  if (seconds < 1) return `${(seconds * 1e3).toFixed(1)} ms`;
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} h`;
  if (seconds < 3.156e7) return `${(seconds / 86400).toFixed(1)} d`;
  if (seconds < 3.156e10) return `${(seconds / 3.156e7).toFixed(1)} y`;
  if (seconds < 3.156e13) return `${(seconds / 3.156e10).toFixed(1)} ky`;
  if (seconds < 3.156e16) return `${(seconds / 3.156e13).toFixed(1)} My`;
  return `${(seconds / 3.156e16).toFixed(2)} By`;
}

// Format time in seconds to human-readable
export function formatTime(seconds: number): string {
  if (seconds < 1e-6) return `${(seconds * 1e9).toFixed(1)} ns`;
  if (seconds < 1e-3) return `${(seconds * 1e6).toFixed(1)} μs`;
  if (seconds < 1) return `${(seconds * 1e3).toFixed(1)} ms`;
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} h`;
  if (seconds < 3.156e7) return `${(seconds / 86400).toFixed(1)} d`;
  if (seconds < 3.156e10) return `${(seconds / 3.156e7).toFixed(2)} y`;
  if (seconds < 3.156e13) return `${(seconds / 3.156e10).toFixed(1)} ky`;
  if (seconds < 3.156e16) return `${(seconds / 3.156e13).toFixed(1)} My`;
  return `${(seconds / 3.156e16).toFixed(2)} By`;
}

// Half-life to OKLCh colour
export function halfLifeToOKLCh(halfLifeSeconds: number | null): {
  l: number;
  c: number;
  h: number;
  css: string;
} {
  const LOG_MIN = -3.78;   // Po-214: 164 μs
  const LOG_MAX = 17.15;   // U-238: 4.468 By
  const LOG_RANGE = LOG_MAX - LOG_MIN;

  if (halfLifeSeconds === null || halfLifeSeconds === 0) {
    return { l: 0.50, c: 0, h: 0, css: 'oklch(0.50 0 0)' };
  }

  const logHl = Math.log10(halfLifeSeconds);
  const t = Math.max(0, Math.min(1, (logHl - LOG_MIN) / LOG_RANGE));
  const hue = 30 + t * 240;  // 30° (hot/fast) to 270° (cool/slow)

  return {
    l: 0.65,
    c: 0.20,
    h: hue,
    css: `oklch(0.65 0.20 ${hue.toFixed(0)})`,
  };
}

// Chart coordinate conversion
export function chartCoords(
  Z: number,
  N: number,
  cellSize: number = 40,
  gap: number = 2,
  originN: number = 123,
  originZ: number = 81
): { x: number; y: number } {
  return {
    x: (N - originN) * (cellSize + gap),
    y: (12 - (Z - originZ)) * (cellSize + gap),
  };
}

// Interpolate inventory data for a given log10(time)
export function interpolateInventory(
  snapshots: InventorySnapshot[],
  targetLogTime: number
): Record<string, number> {
  if (!snapshots.length) return {};
  if (targetLogTime <= snapshots[0].log10_time) return snapshots[0].isotopes;
  if (targetLogTime >= snapshots[snapshots.length - 1].log10_time) {
    return snapshots[snapshots.length - 1].isotopes;
  }

  // Binary search
  let lo = 0;
  let hi = snapshots.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (snapshots[mid].log10_time <= targetLogTime) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  // Linear interpolation
  const t =
    (targetLogTime - snapshots[lo].log10_time) /
    (snapshots[hi].log10_time - snapshots[lo].log10_time);

  const result: Record<string, number> = {};
  const allKeys = new Set([
    ...Object.keys(snapshots[lo].isotopes),
    ...Object.keys(snapshots[hi].isotopes),
  ]);

  for (const key of allKeys) {
    const v0 = snapshots[lo].isotopes[key] || 0;
    const v1 = snapshots[hi].isotopes[key] || 0;
    const v = v0 * (1 - t) + v1 * t;
    if (v > 1e-30) {
      result[key] = v;
    }
  }

  return result;
}

// Get decay arrow direction
export function getDecayDirection(decayType: string | null): { dx: number; dy: number } {
  if (decayType === 'alpha') {
    // Alpha: ΔZ = -2, ΔN = -2 (diagonal down-left on chart)
    return { dx: -2, dy: -2 };
  } else if (decayType === 'beta_minus') {
    // Beta-minus: ΔZ = +1, ΔN = -1 (up-left on chart)
    return { dx: -1, dy: 1 };
  }
  return { dx: 0, dy: 0 };
}

// Element colours for visual distinction
export const ELEMENT_COLOURS: Record<string, string> = {
  U: '#4A90D9',   // Uranium - blue
  Th: '#7B68EE',  // Thorium - purple
  Pa: '#9370DB',  // Protactinium - medium purple
  Ra: '#FFD700',  // Radium - gold (Marie Curie)
  Rn: '#87CEEB',  // Radon - sky blue (gas)
  Po: '#FF6347',  // Polonium - tomato red (dangerous)
  Pb: '#708090',  // Lead - slate grey
  Bi: '#DDA0DD',  // Bismuth - plum
};

// Decay type colours
export const DECAY_COLOURS = {
  alpha: '#0055FF',     // Electric Blue
  beta_minus: '#FF0055', // Hot Pink
  stable: '#808080',    // Grey
};

// Log time markers for scrubber
export const LOG_TIME_MARKERS = [
  { log: -4, label: '100 μs', note: 'Po-214 half-life' },
  { log: 0, label: '1 s', note: '' },
  { log: 2, label: '100 s', note: '' },
  { log: 5, label: '1 day', note: '' },
  { log: 7, label: '1 year', note: '' },
  { log: 10, label: '1000 y', note: 'Ra-226 half-life' },
  { log: 13, label: '100 ky', note: '' },
  { log: 17, label: '4.5 By', note: 'Age of Earth' },
];
