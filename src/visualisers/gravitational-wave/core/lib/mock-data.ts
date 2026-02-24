import { GWData, DetectorData, WaveformData, SpectrogramData, OrbitalData, EventMetadata, TIME_RANGE } from './types';

/**
 * Box-Muller transform for Gaussian random numbers
 */
function gaussianRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Generate a realistic chirp signal
 */
function generateChirpSignal(
  duration: number,
  sampleRate: number,
): { times: number[], strain: number[] } {
  const n = Math.floor(duration * sampleRate);
  const times: number[] = [];
  const strain: number[] = [];

  const mergerTime = duration * 0.875;  // Merger at 87.5% through

  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const tRel = t - mergerTime;  // Time relative to merger
    times.push(TIME_RANGE[0] + t);

    if (tRel < 0) {
      // INSPIRAL: frequency increases as f(t) ~ (-t)^(-3/8)
      const tau = Math.max(-tRel, 0.0005);  // Time to merger
      const freq = 35 * Math.pow(tau / 0.35, -3 / 8);  // Starting freq ~35Hz
      const amplitude = Math.pow(tau / 0.35, -1 / 4);   // Amplitude grows

      // Accumulated phase (integral of frequency)
      const phase = -2 * Math.PI * 35 * 0.35 * (8 / 5) *
        (Math.pow(tau / 0.35, 5 / 8) - 1);

      strain.push(amplitude * Math.sin(phase));
    } else if (tRel < 0.008) {
      // MERGER: peak amplitude, highest frequency
      const decay = Math.exp(-tRel / 0.004);
      const freq = 250;
      strain.push(decay * Math.sin(2 * Math.PI * freq * tRel));
    } else {
      // RINGDOWN: exponential decay
      const decay = Math.exp(-(tRel - 0.008) / 0.003);
      const freq = 250 * 0.88;
      strain.push(decay * Math.sin(2 * Math.PI * freq * tRel) * 0.4);
    }
  }

  // Normalise
  const peak = Math.max(...strain.map(Math.abs));
  return {
    times,
    strain: strain.map(v => v / peak),
  };
}

/**
 * Add noise to a signal
 */
function addNoise(signal: number[], snrTarget: number = 4): number[] {
  const signalPower = signal.reduce((sum, v) => sum + v * v, 0) / signal.length;
  const noisePower = signalPower / (snrTarget * snrTarget);
  const noiseStd = Math.sqrt(noisePower);

  return signal.map(v => v + gaussianRandom() * noiseStd * 4);
}

/**
 * Generate mock spectrogram showing the chirp track
 */
function generateMockSpectrogram(
  timeBins: number,
  freqBins: number,
  mergerFrac: number,
): SpectrogramData {
  const data: number[][] = [];
  const fMin = 30, fMax = 350;

  for (let ti = 0; ti < timeBins; ti++) {
    const row: number[] = [];
    const tNorm = ti / timeBins;

    // Chirp frequency at this time
    let chirpFreq = 0;
    if (tNorm < mergerFrac) {
      const tau = Math.max(mergerFrac - tNorm, 0.005);
      chirpFreq = 35 * Math.pow(tau / mergerFrac, -3 / 8);
      chirpFreq = Math.min(chirpFreq, 280);
    } else {
      chirpFreq = 250 * Math.exp(-(tNorm - mergerFrac) * 25);
    }

    for (let fi = 0; fi < freqBins; fi++) {
      const freq = fMin + (fi / freqBins) * (fMax - fMin);

      // Gaussian peak at chirp frequency
      const df = freq - chirpFreq;
      const width = 12 + freq * 0.04;
      const power = Math.exp(-(df * df) / (2 * width * width));

      // Noise floor
      const noise = Math.random() * 0.03;

      // Chirp intensity increases toward merger
      const intensity = tNorm < mergerFrac
        ? Math.pow(tNorm / mergerFrac, 2.5)
        : Math.exp(-(tNorm - mergerFrac) * 35);

      row.push(power * intensity + noise);
    }
    data.push(row);
  }

  return {
    data,
    timeRange: TIME_RANGE,
    freqRange: [fMin, fMax],
    timeBins,
    freqBins,
  };
}

/**
 * Generate orbital parameters from template
 */
function generateOrbitalData(template: WaveformData): OrbitalData {
  const n = 200;
  const times: number[] = [];
  const frequency: number[] = [];
  const separation: number[] = [];

  const duration = TIME_RANGE[1] - TIME_RANGE[0];
  const mergerFrac = 0.875;

  for (let i = 0; i < n; i++) {
    const tNorm = i / n;
    const t = TIME_RANGE[0] + tNorm * duration;
    times.push(t);

    // Frequency evolution
    let freq: number;
    if (tNorm < mergerFrac) {
      const tau = Math.max(mergerFrac - tNorm, 0.005);
      freq = 35 * Math.pow(tau / mergerFrac, -3 / 8);
      freq = Math.min(freq, 280);
    } else {
      freq = 250 * Math.exp(-(tNorm - mergerFrac) * 20);
    }
    frequency.push(freq);

    // Separation from frequency (Kepler: r ∝ f^(-2/3))
    const fMax = 280;
    let sep = Math.pow(freq / fMax, -2 / 3);
    sep = Math.max(1, Math.min(sep, 25));
    separation.push(sep);
  }

  return {
    times,
    frequency,
    separation,
    chirpMass: 28.3,
    totalMass: 66.2,
  };
}

/**
 * Generate complete mock GW150914 data
 */
export function generateMockGWData(): GWData {
  const sampleRate = 1024;  // Hz
  const duration = TIME_RANGE[1] - TIME_RANGE[0];

  // Generate clean template
  const template = generateChirpSignal(duration, sampleRate);

  // Generate noisy detector data
  const h1Strain = addNoise(template.strain, 4);
  const l1Strain = addNoise(template.strain, 4);

  // L1 is shifted by 6.9ms (wave hit Livingston first)
  const timeLag = 0.0069;
  const lagSamples = Math.round(timeLag * sampleRate);

  // Shift L1 times (or equivalently, shift its apparent merger time)
  const l1Times = template.times.map(t => t + timeLag);

  const H1: DetectorData = {
    times: template.times,
    strain: h1Strain,
    sampleRate,
  };

  const L1: DetectorData = {
    times: l1Times,
    strain: l1Strain,
    sampleRate,
  };

  const templateData: WaveformData = {
    times: template.times,
    strain: template.strain,
  };

  const spectrogram = generateMockSpectrogram(200, 100, 0.875);
  const orbital = generateOrbitalData(templateData);

  const event: EventMetadata = {
    name: 'GW150914',
    utcTime: '2015-09-14T09:50:45.4Z',
    mass1: 35.6,
    mass2: 30.6,
    finalMass: 62.2,
    energyRadiated: 3.0,
    distance: 410,
    distanceLy: 1.3e9,
    snr: 24.0,
    timeLag: 0.0069,
  };

  return {
    H1,
    L1,
    template: templateData,
    spectrogram,
    orbital,
    event,
  };
}

/**
 * Find nearest index in sorted array
 */
export function findNearestIndex(arr: number[], target: number): number {
  let lo = 0;
  let hi = arr.length - 1;

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  if (lo > 0 && Math.abs(arr[lo - 1] - target) < Math.abs(arr[lo] - target)) {
    return lo - 1;
  }
  return lo;
}

/**
 * Ease in-out cubic
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
