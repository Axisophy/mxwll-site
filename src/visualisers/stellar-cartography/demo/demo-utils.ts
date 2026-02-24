export interface GaiaStar {
  ra: number;
  dec: number;
  bp_rp?: number;
  abs_mag?: number;
  phot_g_mean_mag?: number;
  parallax?: number;
}

export interface GaiaData {
  count: number;
  description: string;
  stars: GaiaStar[];
}

export interface PointSizeStops {
  bright: number;
  mag3: number;
  mag5: number;
  mag7: number;
  faint: number;
}

export interface RenderData {
  skyPositions: Float32Array;
  hrPositions: Float32Array;
  colours: Float32Array;
  sizes: Float32Array;
  count: number;
  minDec: number;
  maxDec: number;
  minMagnitude: number;
  maxMagnitude: number;
}

export const SKY_BG: [number, number, number, number] = [0.02, 0.02, 0.03, 1.0];

export const DESKTOP_POINT_STOPS: PointSizeStops = {
  bright: 3.5,
  mag3: 2.5,
  mag5: 1.8,
  mag7: 1.2,
  faint: 1.0,
};

export const MOBILE_POINT_STOPS: PointSizeStops = {
  bright: 2.0,
  mag3: 1.5,
  mag5: 1.2,
  mag7: 0.8,
  faint: 0.6,
};

export const HR_X_MIN = -0.5;
export const HR_X_MAX = 3.5;
export const HR_Y_MIN = -5;
export const HR_Y_MAX = 15;

export const vertexShaderSource = `#version 300 es
precision highp float;

in vec2 a_skyPos;
in vec2 a_hrPos;
in vec3 a_colour;
in float a_size;

uniform float u_transition;
uniform vec2 u_pan;
uniform float u_zoom;
uniform float u_dpr;

out vec3 v_colour;

void main() {
  vec2 pos = mix(a_skyPos, a_hrPos, u_transition);
  pos = (pos + u_pan) * u_zoom;
  gl_Position = vec4(pos, 0.0, 1.0);
  gl_PointSize = a_size * u_dpr;
  v_colour = a_colour;
}
`;

export const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 v_colour;
out vec4 fragColor;

void main() {
  vec2 coord = gl_PointCoord * 2.0 - 1.0;
  float dist = length(coord);
  if (dist > 1.0) discard;

  float alpha = 1.0 - smoothstep(0.1, 1.0, dist);
  fragColor = vec4(v_colour, alpha);
}
`;

export function easeInOutCubic(t: number): number {
  if (t < 0.5) {
    return 4 * t * t * t;
  }
  return 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function createProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export async function loadGaiaData(): Promise<GaiaData> {
  const response = await fetch('/data/gaia-stars.json');
  if (!response.ok) {
    throw new Error('Failed to load Gaia dataset');
  }
  const data = (await response.json()) as GaiaData;
  return data;
}

export function getMagnitude(star: GaiaStar): number {
  if (typeof star.phot_g_mean_mag === 'number') {
    return star.phot_g_mean_mag;
  }
  if (typeof star.abs_mag === 'number') {
    return star.abs_mag;
  }
  return 8;
}

export function getAbsoluteMagnitude(star: GaiaStar): number {
  if (typeof star.parallax === 'number' && star.parallax > 0 && typeof star.phot_g_mean_mag === 'number') {
    return star.phot_g_mean_mag + 5 * Math.log10(star.parallax) - 10;
  }
  if (typeof star.abs_mag === 'number') {
    return star.abs_mag;
  }
  return getMagnitude(star);
}

export function mapMagnitudeToSize(magnitude: number, stops: PointSizeStops): number {
  if (magnitude <= 0) {
    return stops.bright;
  }
  if (magnitude <= 3) {
    return lerp(stops.bright, stops.mag3, magnitude / 3);
  }
  if (magnitude <= 5) {
    return lerp(stops.mag3, stops.mag5, (magnitude - 3) / 2);
  }
  if (magnitude <= 7) {
    return lerp(stops.mag5, stops.mag7, (magnitude - 5) / 2);
  }
  if (magnitude <= 8) {
    return lerp(stops.mag7, stops.faint, magnitude - 7);
  }
  return stops.faint;
}

export function mapBpRpToColour(bpRp?: number): [number, number, number] {
  if (typeof bpRp !== 'number') {
    return [0.95, 0.92, 0.88];
  }
  if (bpRp < 0.5) {
    return [0.74, 0.82, 1.0];
  }
  if (bpRp < 1.0) {
    return [1.0, 0.96, 0.82];
  }
  if (bpRp < 1.5) {
    return [1.0, 0.78, 0.54];
  }
  return [1.0, 0.58, 0.52];
}

export function selectBrightestStars(stars: GaiaStar[], maxCount: number): GaiaStar[] {
  if (stars.length <= maxCount) {
    return stars;
  }

  const sorted = [...stars].sort((a, b) => getMagnitude(a) - getMagnitude(b));
  return sorted.slice(0, maxCount);
}

export function buildRenderData(stars: GaiaStar[], stops: PointSizeStops): RenderData {
  const count = stars.length;
  const skyPositions = new Float32Array(count * 2);
  const hrPositions = new Float32Array(count * 2);
  const colours = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  let minDec = Number.POSITIVE_INFINITY;
  let maxDec = Number.NEGATIVE_INFINITY;
  let minMagnitude = Number.POSITIVE_INFINITY;
  let maxMagnitude = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < count; i += 1) {
    const star = stars[i];
    const magnitude = getMagnitude(star);
    const absoluteMagnitude = getAbsoluteMagnitude(star);
    const colour = mapBpRpToColour(star.bp_rp);

    const skyX = (star.ra / 360) * 2 - 1;
    const skyY = star.dec / 90;

    const hrXNorm = (clamp(star.bp_rp ?? 1.0, HR_X_MIN, HR_X_MAX) - HR_X_MIN) / (HR_X_MAX - HR_X_MIN);
    const hrYNorm = (clamp(absoluteMagnitude, HR_Y_MIN, HR_Y_MAX) - HR_Y_MIN) / (HR_Y_MAX - HR_Y_MIN);

    const hrX = hrXNorm * 2 - 1;
    const hrY = 1 - hrYNorm * 2;

    skyPositions[i * 2] = skyX;
    skyPositions[i * 2 + 1] = skyY;
    hrPositions[i * 2] = hrX;
    hrPositions[i * 2 + 1] = hrY;

    colours[i * 3] = colour[0];
    colours[i * 3 + 1] = colour[1];
    colours[i * 3 + 2] = colour[2];

    sizes[i] = mapMagnitudeToSize(magnitude, stops);

    if (star.dec < minDec) minDec = star.dec;
    if (star.dec > maxDec) maxDec = star.dec;
    if (magnitude < minMagnitude) minMagnitude = magnitude;
    if (magnitude > maxMagnitude) maxMagnitude = magnitude;
  }

  return {
    skyPositions,
    hrPositions,
    colours,
    sizes,
    count,
    minDec,
    maxDec,
    minMagnitude,
    maxMagnitude,
  };
}

export function getCanvasMappedY(dec: number, height: number): number {
  return ((90 - dec) / 180) * height;
}
