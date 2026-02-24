export interface GWData {
  H1: DetectorData;
  L1: DetectorData;
  template: WaveformData;
  spectrogram: SpectrogramData;
  orbital: OrbitalData;
  event: EventMetadata;
}

export interface DetectorData {
  times: number[];      // Seconds relative to merger
  strain: number[];     // Normalised whitened strain
  sampleRate: number;
}

export interface WaveformData {
  times: number[];
  strain: number[];
}

export interface SpectrogramData {
  data: number[][];     // 2D array [time][freq], values 0-1
  timeRange: [number, number];
  freqRange: [number, number];
  timeBins: number;
  freqBins: number;
}

export interface OrbitalData {
  times: number[];
  frequency: number[];
  separation: number[];
  chirpMass: number;
  totalMass: number;
}

export interface EventMetadata {
  name: string;
  utcTime: string;
  mass1: number;
  mass2: number;
  finalMass: number;
  energyRadiated: number;
  distance: number;
  distanceLy: number;
  snr: number;
  timeLag: number;
}

export type Stage = 1 | 2 | 3 | 4;

export interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

// Time range: -350ms to +50ms relative to merger
export const TIME_RANGE: [number, number] = [-0.35, 0.05];
export const MERGER_TIME = 0;

// Colour palette
export const COLOURS = {
  // Waveform traces
  H1_STRAIN: 'rgba(255, 120, 100, 0.6)',      // Warm red/coral for Hanford
  L1_STRAIN: 'rgba(100, 160, 255, 0.6)',       // Cool blue for Livingston
  TEMPLATE: 'rgba(255, 200, 50, 0.8)',         // Gold for the theoretical template

  // Spectrogram colourmap
  SPEC_LOW: [10, 10, 30] as [number, number, number],
  SPEC_MID: [40, 80, 200] as [number, number, number],
  SPEC_HIGH: [100, 200, 255] as [number, number, number],
  SPEC_PEAK: [255, 255, 255] as [number, number, number],

  // Orbital diagram
  BH_FILL: 'rgba(10, 10, 20, 1)',
  BH_GLOW: 'rgba(60, 80, 160, 0.3)',
  TRAIL: 'rgba(100, 140, 255, 0.15)',
  RIPPLE: 'rgba(100, 140, 255, 0.08)',

  // UI
  BACKGROUND: 'rgba(5, 5, 8, 1)',
  TEXT_PRIMARY: 'rgba(255, 255, 255, 0.7)',
  TEXT_SECONDARY: 'rgba(255, 255, 255, 0.3)',
  TEXT_DIM: 'rgba(255, 255, 255, 0.15)',
  PANEL_BG: 'rgba(8, 8, 12, 0.8)',
  PANEL_BORDER: 'rgba(255, 255, 255, 0.05)',
};
