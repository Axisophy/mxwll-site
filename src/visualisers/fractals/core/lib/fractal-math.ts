// Shared fractal computation functions

// Complex number operations
export interface Complex {
  re: number;
  im: number;
}

export function complexAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function complexMul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

export function complexMagnitudeSquared(z: Complex): number {
  return z.re * z.re + z.im * z.im;
}

// Mandelbrot iteration: z = z^2 + c
// Returns number of iterations before escape, or maxIter if bounded
export function mandelbrotIteration(
  c: Complex,
  maxIter: number
): number {
  let z: Complex = { re: 0, im: 0 };

  for (let i = 0; i < maxIter; i++) {
    z = complexAdd(complexMul(z, z), c);
    if (complexMagnitudeSquared(z) > 4) {
      // Smooth coloring using continuous potential
      const log_zn = Math.log(z.re * z.re + z.im * z.im) / 2;
      const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
      return i + 1 - nu;
    }
  }

  return maxIter;
}

// Julia iteration: z = z^2 + c (where z starts at the pixel position)
export function juliaIteration(
  z: Complex,
  c: Complex,
  maxIter: number
): number {
  for (let i = 0; i < maxIter; i++) {
    z = complexAdd(complexMul(z, z), c);
    if (complexMagnitudeSquared(z) > 4) {
      const log_zn = Math.log(z.re * z.re + z.im * z.im) / 2;
      const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
      return i + 1 - nu;
    }
  }

  return maxIter;
}

// Koch snowflake point generation
export interface Point {
  x: number;
  y: number;
}

function rotatePoint(p: Point, origin: Point, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = p.x - origin.x;
  const dy = p.y - origin.y;
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  };
}

// Generate Koch curve points between two points
function kochSegment(p1: Point, p2: Point, depth: number): Point[] {
  if (depth === 0) {
    return [p1];
  }

  // Divide segment into thirds
  const dx = (p2.x - p1.x) / 3;
  const dy = (p2.y - p1.y) / 3;

  const a = p1;
  const b = { x: p1.x + dx, y: p1.y + dy };
  const d = { x: p1.x + 2 * dx, y: p1.y + 2 * dy };

  // Peak point (rotated 60 degrees from b)
  const c = rotatePoint(d, b, -Math.PI / 3);

  // Recursively generate points for each segment
  return [
    ...kochSegment(a, b, depth - 1),
    ...kochSegment(b, c, depth - 1),
    ...kochSegment(c, d, depth - 1),
    ...kochSegment(d, p2, depth - 1),
  ];
}

// Generate complete Koch snowflake
export function generateKochSnowflake(
  centerX: number,
  centerY: number,
  size: number,
  iterations: number
): Point[] {
  // Start with equilateral triangle (pointing up)
  const height = size * Math.sqrt(3) / 2;
  const p1: Point = { x: centerX, y: centerY - height * 2 / 3 };
  const p2: Point = { x: centerX + size / 2, y: centerY + height / 3 };
  const p3: Point = { x: centerX - size / 2, y: centerY + height / 3 };

  // Generate Koch curve for each edge
  const points = [
    ...kochSegment(p1, p2, iterations),
    ...kochSegment(p2, p3, iterations),
    ...kochSegment(p3, p1, iterations),
  ];

  return points;
}

// Calculate Koch snowflake statistics
export function kochSnowflakeStats(iterations: number) {
  const segments = 3 * Math.pow(4, iterations);
  const segmentLength = Math.pow(1 / 3, iterations);
  const perimeter = segments * segmentLength; // Relative to original triangle perimeter
  const dimension = Math.log(4) / Math.log(3); // ~1.2619

  return {
    segments,
    perimeterRatio: perimeter,
    dimension: dimension.toFixed(4),
  };
}

// Preset Julia set c-values
export const JULIA_PRESETS: Record<string, Complex> = {
  'Dendrite': { re: -0.8, im: 0.156 },
  'Douady Rabbit': { re: -0.123, im: 0.745 },
  'San Marco': { re: -0.75, im: 0 },
  'Siegel Disk': { re: -0.391, im: -0.587 },
  'Dragon': { re: -0.8, im: 0 },
  'Spiral': { re: 0.285, im: 0.01 },
  'Starfish': { re: -0.4, im: 0.6 },
};

export const JULIA_PRESET_NAMES = Object.keys(JULIA_PRESETS);
