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
  galacticPositions: Float32Array;
  magnitudePositions: Float32Array;
  galacticLatitudes: Float32Array;
  subtleColours: Float32Array;
  observerColours: Float32Array;
  baseSizes: Float32Array;
  hrSizes: Float32Array;
  observerSizes: Float32Array;
  count: number;
  minDec: number;
  maxDec: number;
  minGalacticLat: number;
  maxGalacticLat: number;
  minMagnitude: number;
  maxMagnitude: number;
}

export interface RenderOptions {
  hrUniformSize: number;
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

const RANGE_PADDING_RATIO = 0.05;
const MAGNITUDE_Y_JITTER = 0.008;

export const vertexShaderSource = `#version 300 es
precision highp float;

in vec2 a_skyPos;
in vec2 a_hrPos;
in vec2 a_galPos;
in vec2 a_magPos;
in float a_galLatAbs;
in vec3 a_subtleColour;
in vec3 a_observerColour;
in float a_baseSize;
in float a_hrSize;
in float a_observerSize;

uniform float u_transition;
uniform vec2 u_pan;
uniform float u_zoom;
uniform float u_dpr;
uniform float u_skyOffset;
uniform float u_galacticOffset;
uniform vec4 u_fromWeights;
uniform vec4 u_toWeights;
uniform float u_galacticMix;
uniform float u_observerMix;

out vec3 v_colour;
out float v_alphaScale;

void main() {
  vec2 skyPos = a_skyPos;
  float skyRa01 = fract(((skyPos.x + 1.0) * 0.5) + u_skyOffset);
  skyPos.x = skyRa01 * 2.0 - 1.0;

  vec2 galPos = a_galPos;
  float galLon01 = fract(((galPos.x + 1.0) * 0.5) + u_galacticOffset);
  galPos.x = galLon01 * 2.0 - 1.0;

  vec2 fromPos =
    skyPos * u_fromWeights.x +
    a_hrPos * u_fromWeights.y +
    galPos * u_fromWeights.z +
    a_magPos * u_fromWeights.w;
  vec2 toPos =
    skyPos * u_toWeights.x +
    a_hrPos * u_toWeights.y +
    galPos * u_toWeights.z +
    a_magPos * u_toWeights.w;
  vec2 pos = mix(fromPos, toPos, u_transition);
  vec4 viewMix = mix(u_fromWeights, u_toWeights, u_transition);

  vec3 color = a_subtleColour;
  float alphaScale = 1.0;

  float planeAlpha = 1.0;
  if (a_galLatAbs > 5.0 && a_galLatAbs <= 20.0) {
    planeAlpha = mix(1.0, 0.7, (a_galLatAbs - 5.0) / 15.0);
  } else if (a_galLatAbs > 20.0) {
    planeAlpha = 0.4;
  }

  vec3 warmTint = vec3(1.05, 1.0, 0.95);
  vec3 coolTint = vec3(0.95, 0.97, 1.05);
  float warmMix = 1.0 - smoothstep(10.0, 30.0, a_galLatAbs);
  float coolMix = smoothstep(30.0, 90.0, a_galLatAbs);
  vec3 tint = mix(vec3(1.0), warmTint, warmMix);
  tint = mix(tint, coolTint, coolMix);

  color *= tint;
  alphaScale = planeAlpha;
  color = mix(a_subtleColour, color, u_galacticMix);
  alphaScale = mix(1.0, alphaScale, u_galacticMix);

  color = mix(color, a_observerColour, u_observerMix);
  alphaScale = mix(alphaScale, 1.0, u_observerMix);

  pos = (pos + u_pan) * u_zoom;
  gl_Position = vec4(pos, 0.0, 1.0);
  float pointSize =
    a_baseSize * viewMix.x +
    a_hrSize * viewMix.y +
    a_baseSize * viewMix.z +
    a_observerSize * viewMix.w;
  gl_PointSize = pointSize * u_dpr;
  v_colour = color;
  v_alphaScale = alphaScale;
}
`;

export const fragmentShaderSource = `#version 300 es
precision highp float;

in vec3 v_colour;
in float v_alphaScale;
out vec4 fragColor;

void main() {
  vec2 coord = gl_PointCoord * 2.0 - 1.0;
  float dist = length(coord);
  if (dist > 1.0) discard;

  float alpha = (1.0 - smoothstep(0.1, 1.0, dist)) * v_alphaScale;
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

function mapBpRpToObserverColour(bpRp?: number): [number, number, number] {
  const b = clamp(bpRp ?? 1.0, -0.5, 3.5);
  const stops: Array<{ bp: number; rgb: [number, number, number] }> = [
    { bp: -0.5, rgb: [120 / 255, 160 / 255, 255 / 255] },
    { bp: 0.0, rgb: [180 / 255, 200 / 255, 255 / 255] },
    { bp: 0.5, rgb: [255 / 255, 248 / 255, 220 / 255] },
    { bp: 1.5, rgb: [255 / 255, 210 / 255, 140 / 255] },
    { bp: 2.5, rgb: [255 / 255, 160 / 255, 80 / 255] },
    { bp: 3.5, rgb: [220 / 255, 80 / 255, 60 / 255] },
  ];

  for (let i = 0; i < stops.length - 1; i += 1) {
    const a = stops[i];
    const c = stops[i + 1];
    if (b >= a.bp && b <= c.bp) {
      const t = (b - a.bp) / (c.bp - a.bp);
      return [
        lerp(a.rgb[0], c.rgb[0], t),
        lerp(a.rgb[1], c.rgb[1], t),
        lerp(a.rgb[2], c.rgb[2], t),
      ];
    }
  }

  return stops[stops.length - 1].rgb;
}

function mapObserverSize(absMag: number): number {
  if (absMag < 0) {
    return 5.0;
  }
  if (absMag < 3) {
    return 3.5;
  }
  if (absMag < 6) {
    return 2.0;
  }
  if (absMag < 9) {
    return 1.2;
  }
  return 0.7;
}

function computePaddedRange(values: number[], fallbackMin: number, fallbackMax: number): { min: number; max: number } {
  if (values.length === 0) {
    return { min: fallbackMin, max: fallbackMax };
  }

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: fallbackMin, max: fallbackMax };
  }

  const span = max - min;
  const padding = span > 0 ? span * RANGE_PADDING_RATIO : 1;
  return {
    min: min - padding,
    max: max + padding,
  };
}

export function selectBrightestStars(stars: GaiaStar[], maxCount: number): GaiaStar[] {
  if (stars.length <= maxCount) {
    return stars;
  }

  const sorted = [...stars].sort((a, b) => getMagnitude(a) - getMagnitude(b));
  return sorted.slice(0, maxCount);
}

const RA_NGP_RAD = (192.85948 * Math.PI) / 180;
const DEC_NGP_RAD = (27.12825 * Math.PI) / 180;
const L_NCP_RAD = (122.93192 * Math.PI) / 180;
const RAD_TO_DEG = 180 / Math.PI;

function toGalacticCoordinates(raDeg: number, decDeg: number): { lDeg: number; bDeg: number } {
  const ra = (raDeg * Math.PI) / 180;
  const dec = (decDeg * Math.PI) / 180;

  const sinDec = Math.sin(dec);
  const cosDec = Math.cos(dec);
  const deltaRa = ra - RA_NGP_RAD;

  const b = Math.asin(
    sinDec * Math.sin(DEC_NGP_RAD) + cosDec * Math.cos(DEC_NGP_RAD) * Math.cos(deltaRa),
  );

  const y = cosDec * Math.sin(deltaRa);
  const x = sinDec * Math.cos(DEC_NGP_RAD) - cosDec * Math.sin(DEC_NGP_RAD) * Math.cos(deltaRa);
  const lRaw = L_NCP_RAD - Math.atan2(y, x);

  let lDeg = lRaw * RAD_TO_DEG;
  lDeg %= 360;
  if (lDeg < 0) {
    lDeg += 360;
  }

  return { lDeg, bDeg: b * RAD_TO_DEG };
}

function positiveModulo(value: number, modulo: number): number {
  return ((value % modulo) + modulo) % modulo;
}

function mapGalacticToNdc(lDeg: number, bDeg: number): { x: number; y: number } {
  const xNorm = positiveModulo(lDeg + 180, 360) / 360;
  const yNorm = 1 - (clamp(bDeg, -90, 90) + 90) / 180;

  return {
    x: xNorm * 2 - 1,
    y: 1 - yNorm * 2,
  };
}

export function buildRenderData(stars: GaiaStar[], stops: PointSizeStops, options: RenderOptions): RenderData {
  const count = stars.length;
  const skyPositions = new Float32Array(count * 2);
  const hrPositions = new Float32Array(count * 2);
  const galacticPositions = new Float32Array(count * 2);
  const magnitudePositions = new Float32Array(count * 2);
  const galacticLatitudes = new Float32Array(count);
  const subtleColours = new Float32Array(count * 3);
  const observerColours = new Float32Array(count * 3);
  const baseSizes = new Float32Array(count);
  const hrSizes = new Float32Array(count);
  const observerSizes = new Float32Array(count);

  let minDec = Number.POSITIVE_INFINITY;
  let maxDec = Number.NEGATIVE_INFINITY;
  let minGalacticLat = Number.POSITIVE_INFINITY;
  let maxGalacticLat = Number.NEGATIVE_INFINITY;
  let minMagnitude = Number.POSITIVE_INFINITY;
  let maxMagnitude = Number.NEGATIVE_INFINITY;

  const absMags = stars
    .map((star) => getAbsoluteMagnitude(star))
    .filter((value) => Number.isFinite(value));
  const bpRps = stars
    .map((star) => star.bp_rp)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

  const magRange = computePaddedRange(absMags, -3, 14);
  const bpRpRange = computePaddedRange(bpRps, -0.5, 3.5);

  for (let i = 0; i < count; i += 1) {
    const star = stars[i];
    const magnitude = getMagnitude(star);
    const absoluteMagnitude = getAbsoluteMagnitude(star);
    const subtleColour = mapBpRpToColour(star.bp_rp);
    const observerColour = mapBpRpToObserverColour(star.bp_rp);

    const skyXNorm = clamp(star.ra / 360, 0, 1);
    const skyYNorm = clamp((star.dec + 90) / 180, 0, 1);

    const hrXNorm =
      (clamp(star.bp_rp ?? 1.0, bpRpRange.min, bpRpRange.max) - bpRpRange.min) / (bpRpRange.max - bpRpRange.min);
    const hrYNorm =
      (clamp(absoluteMagnitude, magRange.min, magRange.max) - magRange.min) / (magRange.max - magRange.min);
    const { lDeg, bDeg } = toGalacticCoordinates(star.ra, star.dec);
    const galacticPos = mapGalacticToNdc(lDeg, bDeg);
    const magXNorm =
      (clamp(star.bp_rp ?? 1.0, bpRpRange.min, bpRpRange.max) - bpRpRange.min) / (bpRpRange.max - bpRpRange.min);
    const magYNorm =
      (clamp(absoluteMagnitude, magRange.min, magRange.max) - magRange.min) / (magRange.max - magRange.min);

    const hrXNormClamped = clamp(hrXNorm, 0, 1);
    const hrYNormJittered = clamp(hrYNorm + (Math.random() - 0.5) * MAGNITUDE_Y_JITTER, 0, 1);
    const magXNormClamped = clamp(magXNorm, 0, 1);
    const magYNormJittered = clamp(magYNorm + (Math.random() - 0.5) * MAGNITUDE_Y_JITTER, 0, 1);
    const galXNorm = clamp((galacticPos.x + 1) * 0.5, 0, 1);
    const galYNorm = clamp((galacticPos.y + 1) * 0.5, 0, 1);

    const skyX = skyXNorm * 2 - 1;
    const skyY = skyYNorm * 2 - 1;
    const hrX = hrXNormClamped * 2 - 1;
    const hrY = 1 - hrYNormJittered * 2;
    const magX = magXNormClamped * 2 - 1;
    const magY = magYNormJittered * 2 - 1;
    const galX = galXNorm * 2 - 1;
    const galY = galYNorm * 2 - 1;

    skyPositions[i * 2] = skyX;
    skyPositions[i * 2 + 1] = skyY;
    hrPositions[i * 2] = hrX;
    hrPositions[i * 2 + 1] = hrY;
    galacticPositions[i * 2] = galX;
    galacticPositions[i * 2 + 1] = galY;
    magnitudePositions[i * 2] = magX;
    magnitudePositions[i * 2 + 1] = magY;
    galacticLatitudes[i] = Math.abs(bDeg);

    subtleColours[i * 3] = subtleColour[0];
    subtleColours[i * 3 + 1] = subtleColour[1];
    subtleColours[i * 3 + 2] = subtleColour[2];
    observerColours[i * 3] = observerColour[0];
    observerColours[i * 3 + 1] = observerColour[1];
    observerColours[i * 3 + 2] = observerColour[2];

    baseSizes[i] = mapMagnitudeToSize(magnitude, stops);
    hrSizes[i] = options.hrUniformSize;
    observerSizes[i] = mapObserverSize(absoluteMagnitude);

    if (star.dec < minDec) minDec = star.dec;
    if (star.dec > maxDec) maxDec = star.dec;
    if (bDeg < minGalacticLat) minGalacticLat = bDeg;
    if (bDeg > maxGalacticLat) maxGalacticLat = bDeg;
    if (magnitude < minMagnitude) minMagnitude = magnitude;
    if (magnitude > maxMagnitude) maxMagnitude = magnitude;
  }

  return {
    skyPositions,
    hrPositions,
    galacticPositions,
    magnitudePositions,
    galacticLatitudes,
    subtleColours,
    observerColours,
    baseSizes,
    hrSizes,
    observerSizes,
    count,
    minDec,
    maxDec,
    minGalacticLat,
    maxGalacticLat,
    minMagnitude,
    maxMagnitude,
  };
}

export function getCanvasMappedY(dec: number, height: number): number {
  return ((90 - dec) / 180) * height;
}
