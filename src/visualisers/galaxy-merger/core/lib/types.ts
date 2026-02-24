// Galaxy Merger Types and Data Loader

export interface GalaxyMetadata {
  n_particles: number;
  n_frames: number;
  n_mw: number;
  n_m31: number;
  time_unit_myr: number;
  length_unit_kpc: number;
  velocity_unit_kms: number;
  t_max: number;
  t_max_gyr: number;
  softening: number;
  v_max_normalized: number;
  times_natural: number[];
  has_rebound: boolean;
  has_galpy: boolean;
  events: GalaxyEvent[];
}

export interface GalaxyEvent {
  t: number;           // Time in natural units
  label: string;       // Short label
  description: string; // Full description
}

export interface GalaxyNarrative {
  title: string;
  subtitle: string;
  intro: {
    hook: string;
    stakes: string;
  };
  sections: Array<{
    title: string;
    content: string;
  }>;
  physics: {
    title: string;
    barnes_hut: string;
    softening: string;
    leapfrog: string;
  };
  science: {
    title: string;
    probability: string;
    dating: string;
  };
}

export interface GalaxyFrame {
  t: number;
  positions: Float32Array;  // N * 3 floats (x, y, z)
  velocities: Uint8Array;   // N uint8 (normalized 0-255)
}

/**
 * Galaxy data container with streaming frame access.
 */
export class GalaxyData {
  metadata: GalaxyMetadata | null = null;
  narrative: GalaxyNarrative | null = null;
  galaxyIds: Uint8Array | null = null;

  private framesBuffer: ArrayBuffer | null = null;
  private frameOffsets: number[] = [];
  private headerSize = 0;

  public loaded = false;
  public loadProgress = 0;

  /**
   * Load all galaxy data from the server.
   */
  async load(basePath: string, onProgress?: (progress: number) => void): Promise<void> {
    // Load metadata and narrative in parallel
    const [metaResp, narrativeResp] = await Promise.all([
      fetch(`${basePath}/metadata.json`),
      fetch(`${basePath}/narrative.json`),
    ]);

    this.metadata = await metaResp.json();
    this.narrative = await narrativeResp.json();

    if (!this.metadata) throw new Error('Failed to load metadata');

    // Load galaxy IDs
    const idsResp = await fetch(`${basePath}/galaxy_ids.bin`);
    this.galaxyIds = new Uint8Array(await idsResp.arrayBuffer());

    // Load frames with progress tracking
    const framesResp = await fetch(`${basePath}/frames.bin`);
    const contentLength = framesResp.headers.get('Content-Length');
    const total = contentLength ? parseInt(contentLength) : 0;

    if (framesResp.body && total > 0) {
      // Stream with progress
      const reader = framesResp.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        this.loadProgress = received / total;
        onProgress?.(this.loadProgress);
      }

      // Combine chunks
      const combined = new Uint8Array(received);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      this.framesBuffer = combined.buffer;
    } else {
      // Fallback: load all at once
      this.framesBuffer = await framesResp.arrayBuffer();
    }

    // Parse header and compute frame offsets
    this.parseFramesHeader();

    this.loaded = true;
    this.loadProgress = 1;
  }

  private parseFramesHeader(): void {
    if (!this.framesBuffer || !this.metadata) return;

    const view = new DataView(this.framesBuffer);
    const nParticles = view.getUint32(0, true);
    const nFrames = view.getUint32(4, true);

    // Header: 8 bytes + nFrames * 4 bytes (times)
    this.headerSize = 8 + nFrames * 4;

    // Each frame: positions (N * 3 * 4) + velocities (N * 1)
    const bytesPerFrame = nParticles * 13;

    this.frameOffsets = [];
    for (let i = 0; i < nFrames; i++) {
      this.frameOffsets.push(this.headerSize + i * bytesPerFrame);
    }
  }

  /**
   * Get frame data at a specific index.
   */
  getFrame(index: number): GalaxyFrame | null {
    if (!this.framesBuffer || !this.metadata || index < 0 || index >= this.metadata.n_frames) {
      return null;
    }

    const offset = this.frameOffsets[index];
    const nParticles = this.metadata.n_particles;

    // Read times from header
    const view = new DataView(this.framesBuffer);
    const t = view.getFloat32(8 + index * 4, true);

    // Positions: N * 3 * float32
    const positionsOffset = offset;
    const positions = new Float32Array(this.framesBuffer, positionsOffset, nParticles * 3);

    // Velocities: N * uint8
    const velocitiesOffset = positionsOffset + nParticles * 12;
    const velocities = new Uint8Array(this.framesBuffer, velocitiesOffset, nParticles);

    return { t, positions, velocities };
  }

  /**
   * Get interpolated positions between frames.
   */
  getInterpolatedFrame(t: number): GalaxyFrame | null {
    if (!this.metadata) return null;

    const times = this.metadata.times_natural;

    // Find bracketing frames
    let i0 = 0;
    for (let i = 0; i < times.length - 1; i++) {
      if (times[i + 1] > t) break;
      i0 = i;
    }
    const i1 = Math.min(i0 + 1, times.length - 1);

    const f0 = this.getFrame(i0);
    const f1 = this.getFrame(i1);
    if (!f0 || !f1) return null;

    // Interpolation factor
    const dt = times[i1] - times[i0];
    const alpha = dt > 0 ? Math.max(0, Math.min(1, (t - times[i0]) / dt)) : 0;

    // Linear interpolation of positions
    const nParticles = this.metadata.n_particles;
    const positions = new Float32Array(nParticles * 3);
    const velocities = new Uint8Array(nParticles);

    for (let j = 0; j < nParticles * 3; j++) {
      positions[j] = f0.positions[j] + alpha * (f1.positions[j] - f0.positions[j]);
    }

    // Interpolate velocities too
    for (let j = 0; j < nParticles; j++) {
      velocities[j] = Math.round(f0.velocities[j] + alpha * (f1.velocities[j] - f0.velocities[j]));
    }

    return { t, positions, velocities };
  }

  /**
   * Get time in billions of years.
   */
  timeToGyr(t: number): number {
    if (!this.metadata) return 0;
    return t * this.metadata.time_unit_myr / 1000;
  }

  /**
   * Find the nearest event to a given time.
   */
  getNearestEvent(t: number): GalaxyEvent | null {
    if (!this.metadata) return null;

    let nearest: GalaxyEvent | null = null;
    let minDist = Infinity;

    for (const event of this.metadata.events) {
      const dist = Math.abs(event.t - t);
      if (dist < minDist && dist < 10) { // Within 10 time units
        minDist = dist;
        nearest = event;
      }
    }

    return nearest;
  }
}


// ============================================================
// MATRIX UTILITIES
// ============================================================

/**
 * Create a 4x4 identity matrix.
 */
export function mat4Identity(): Float32Array {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

/**
 * Multiply two 4x4 matrices (column-major).
 */
export function mat4Multiply(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array {
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  return out;
}

/**
 * Create a perspective projection matrix.
 */
export function mat4Perspective(
  out: Float32Array,
  fovY: number,
  aspect: number,
  near: number,
  far: number
): Float32Array {
  const f = 1.0 / Math.tan(fovY / 2);
  const nf = 1 / (near - far);

  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;

  return out;
}

/**
 * Create a look-at view matrix.
 */
export function mat4LookAt(
  out: Float32Array,
  eye: [number, number, number],
  center: [number, number, number],
  up: [number, number, number]
): Float32Array {
  const eyeX = eye[0], eyeY = eye[1], eyeZ = eye[2];
  const centerX = center[0], centerY = center[1], centerZ = center[2];
  const upX = up[0], upY = up[1], upZ = up[2];

  let z0 = eyeX - centerX;
  let z1 = eyeY - centerY;
  let z2 = eyeZ - centerZ;
  let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  let x0 = upY * z2 - upZ * z1;
  let x1 = upZ * z0 - upX * z2;
  let x2 = upX * z1 - upY * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (len > 0) {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  let y0 = z1 * x2 - z2 * x1;
  let y1 = z2 * x0 - z0 * x2;
  let y2 = z0 * x1 - z1 * x0;
  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (len > 0) {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
  out[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
  out[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
  out[15] = 1;

  return out;
}


// ============================================================
// COLOR UTILITIES
// ============================================================

/**
 * Convert OKLab to linear sRGB.
 */
export function oklabToLinearSrgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    Math.max(0, +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    Math.max(0, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    Math.max(0, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ];
}

/**
 * Convert OKLCh to CSS color string.
 */
export function oklchToCss(L: number, C: number, h: number): string {
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const [r, g, blue] = oklabToLinearSrgb(L, a, b);

  // Linear to sRGB gamma
  const toSrgb = (c: number) => c <= 0.0031308
    ? c * 12.92
    : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

  const sr = Math.round(Math.max(0, Math.min(1, toSrgb(r))) * 255);
  const sg = Math.round(Math.max(0, Math.min(1, toSrgb(g))) * 255);
  const sb = Math.round(Math.max(0, Math.min(1, toSrgb(blue))) * 255);

  return `rgb(${sr}, ${sg}, ${sb})`;
}

/**
 * Get color for Milky Way particles based on velocity.
 * Slow = deep blue, Fast = bright cyan
 */
export function getMWColor(velocity: number): string {
  const t = Math.max(0, Math.min(1, velocity));
  const L = 0.5 + t * 0.35;
  const C = 0.08 + t * 0.07;
  const h = 4.4 - t * 0.6; // Blue to cyan
  return oklchToCss(L, C, h);
}

/**
 * Get color for Andromeda particles based on velocity.
 * Slow = blue-white, Fast = warm white
 */
export function getM31Color(velocity: number): string {
  const t = Math.max(0, Math.min(1, velocity));
  const L = 0.55 + t * 0.35;
  const C = 0.06 + t * 0.06;
  const h = 4.2 - t * 3.0; // Blue to warm
  return oklchToCss(L, C, h);
}
