'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────

type State = 'quiet' | 'pulsar' | 'magnetar'

interface StateConfig {
  label: string
  particleCount: number
  rotationSpeed: number        // rad/s
  magneticInclination: number  // degrees
  fieldStrength: number        // visual multiplier
  beamIntensity: number
  colour: [number, number, number]
  glowColour: [number, number, number]
  description: string
}

const STATES: Record<State, StateConfig> = {
  quiet: {
    label: 'Quiet Neutron Star',
    particleCount: 10000,
    rotationSpeed: 0.3,
    magneticInclination: 15,
    fieldStrength: 1.0,
    beamIntensity: 0.0,
    colour: [0.4, 0.6, 0.9],
    glowColour: [0.2, 0.3, 0.5],
    description: 'A cooling remnant. No beams, minimal activity.',
  },
  pulsar: {
    label: 'Pulsar',
    particleCount: 35000,
    rotationSpeed: 4.7,
    magneticInclination: 45,
    fieldStrength: 2.0,
    beamIntensity: 1.0,
    colour: [0.0, 0.33, 1.0],   // Electric blue #0055FF
    glowColour: [0.0, 0.2, 0.8],
    description: 'Spinning rapidly. Twin beams sweep through space.',
  },
  magnetar: {
    label: 'Magnetar Starquake',
    particleCount: 60000,
    rotationSpeed: 0.8,
    magneticInclination: 60,
    fieldStrength: 4.0,
    beamIntensity: 0.6,
    colour: [1.0, 0.0, 0.33],   // Hot pink #FF0055
    glowColour: [0.8, 0.0, 0.2],
    description: 'Extreme magnetic field. Crust fractures release energy.',
  },
}

// ─── Constants ──────────────────────────────────────────────────────────────

const MAX_PARTICLES = 60000
const FIELD_LINE_COUNT = 24
const FIELD_LINE_SEGMENTS = 64
const BG_COLOR: [number, number, number] = [0.012, 0.024, 0.059] // #03060f

// Cinematic sequence timing (seconds)
const SEQUENCE = [
  { state: 'quiet' as State, duration: 25 },
  { state: 'pulsar' as State, duration: 35 },
  { state: 'magnetar' as State, duration: 30 },
]
const SEQUENCE_TOTAL = SEQUENCE.reduce((s, e) => s + e.duration, 0)

// ─── Shaders ────────────────────────────────────────────────────────────────

const PARTICLE_VS = `#version 300 es
precision highp float;

in vec3 a_position;
in float a_energy;

uniform mat4 u_viewProjection;
uniform float u_pointScale;
uniform float u_dpr;
uniform float u_time;
uniform vec3 u_colour;
uniform float u_stateBlend;

out float v_energy;
out vec3 v_colour;

void main() {
  vec4 viewPos = u_viewProjection * vec4(a_position, 1.0);
  gl_Position = viewPos;

  float dist = length(viewPos.xyz);
  float size = u_pointScale * u_dpr / max(dist, 0.5);
  gl_PointSize = clamp(size, 1.0, 16.0);

  v_energy = a_energy;
  v_colour = u_colour;
}
`

const PARTICLE_FS = `#version 300 es
precision highp float;

in float v_energy;
in vec3 v_colour;

out vec4 fragColor;

void main() {
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  float r2 = dot(cxy, cxy);
  if (r2 > 1.0) discard;

  float alpha = exp(-r2 * 3.0) * v_energy;
  vec3 col = mix(v_colour * 0.3, v_colour, v_energy);

  fragColor = vec4(col * alpha, alpha * 0.8);
}
`

const FIELD_LINE_VS = `#version 300 es
precision highp float;

in vec3 a_position;
in float a_alpha;

uniform mat4 u_viewProjection;

out float v_alpha;

void main() {
  gl_Position = u_viewProjection * vec4(a_position, 1.0);
  v_alpha = a_alpha;
}
`

const FIELD_LINE_FS = `#version 300 es
precision highp float;

in float v_alpha;

uniform vec3 u_colour;
uniform float u_intensity;

out vec4 fragColor;

void main() {
  float a = v_alpha * u_intensity * 0.4;
  fragColor = vec4(u_colour * a, a);
}
`

// Bloom: full-screen quad
const BLOOM_VS = `#version 300 es
precision highp float;
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const BLUR_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_texture;
uniform vec2 u_direction;
uniform vec2 u_resolution;
out vec4 fragColor;

void main() {
  vec2 texelSize = 1.0 / u_resolution;
  float weights[5] = float[](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

  vec3 result = texture(u_texture, v_uv).rgb * weights[0];
  for (int i = 1; i < 5; i++) {
    vec2 offset = u_direction * texelSize * float(i) * 2.0;
    result += texture(u_texture, v_uv + offset).rgb * weights[i];
    result += texture(u_texture, v_uv - offset).rgb * weights[i];
  }
  fragColor = vec4(result, 1.0);
}
`

const COMPOSITE_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_scene;
uniform sampler2D u_bloom;
uniform float u_bloomStrength;
out vec4 fragColor;

void main() {
  vec3 scene = texture(u_scene, v_uv).rgb;
  vec3 bloom = texture(u_bloom, v_uv).rgb;
  fragColor = vec4(scene + bloom * u_bloomStrength, 1.0);
}
`

// ─── Math Helpers ───────────────────────────────────────────────────────────

function mat4Perspective(fov: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1.0 / Math.tan(fov / 2)
  const nf = 1 / (near - far)
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ])
}

function mat4LookAt(eye: number[], center: number[], up: number[]): Float32Array {
  const zx = eye[0] - center[0], zy = eye[1] - center[1], zz = eye[2] - center[2]
  let len = 1 / Math.sqrt(zx * zx + zy * zy + zz * zz)
  const z0 = zx * len, z1 = zy * len, z2 = zz * len
  const xx = up[1] * z2 - up[2] * z1
  const xy = up[2] * z0 - up[0] * z2
  const xz = up[0] * z1 - up[1] * z0
  len = 1 / Math.sqrt(xx * xx + xy * xy + xz * xz)
  const x0 = xx * len, x1 = xy * len, x2 = xz * len
  const y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0
  return new Float32Array([
    x0, y0, z0, 0,
    x1, y1, z1, 0,
    x2, y2, z2, 0,
    -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]),
    -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]),
    -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]),
    1,
  ])
}

function mat4Multiply(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(16)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      out[j * 4 + i] = a[i] * b[j * 4] + a[4 + i] * b[j * 4 + 1] + a[8 + i] * b[j * 4 + 2] + a[12 + i] * b[j * 4 + 3]
    }
  }
  return out
}

// Seeded PRNG
function seeded(seed: number) {
  let s = Math.abs(seed) + 1
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647 }
}

// ─── Magnetic Dipole Field ──────────────────────────────────────────────────

function generateFieldLineVertices(
  lineCount: number,
  segments: number,
  inclination: number,
  fieldStrength: number,
): { positions: Float32Array; alphas: Float32Array } {
  const inc = (inclination * Math.PI) / 180
  const totalVerts = lineCount * segments
  const positions = new Float32Array(totalVerts * 3)
  const alphas = new Float32Array(totalVerts)

  const R0_values = [2.5, 4.0, 6.0]
  const azimuths = lineCount / R0_values.length

  let vi = 0
  for (let ri = 0; ri < R0_values.length; ri++) {
    const R0 = R0_values[ri] * fieldStrength * 0.5
    for (let ai = 0; ai < azimuths; ai++) {
      const phi = (ai / azimuths) * Math.PI * 2
      for (let si = 0; si < segments; si++) {
        const t = si / (segments - 1)
        const theta = t * Math.PI // 0 to PI

        const r = R0 * Math.sin(theta) * Math.sin(theta)
        // Dipole coords then rotate by inclination
        const x0 = r * Math.sin(theta) * Math.cos(phi)
        const y0 = r * Math.cos(theta)
        const z0 = r * Math.sin(theta) * Math.sin(phi)

        // Rotate around X axis by inclination
        const y1 = y0 * Math.cos(inc) - z0 * Math.sin(inc)
        const z1 = y0 * Math.sin(inc) + z0 * Math.cos(inc)

        positions[vi * 3] = x0
        positions[vi * 3 + 1] = y1
        positions[vi * 3 + 2] = z1

        // Alpha fades at poles and with distance
        const poleFade = Math.sin(theta)
        const distFade = 1.0 - (r / (R0 + 0.1)) * 0.5
        alphas[vi] = poleFade * distFade

        vi++
      }
    }
  }

  return { positions, alphas }
}

// ─── Particle Simulation ────────────────────────────────────────────────────

function initParticles(
  count: number,
  state: StateConfig,
  rng: () => number,
): { positions: Float32Array; velocities: Float32Array; energies: Float32Array; seeds: Float32Array } {
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)
  const energies = new Float32Array(count)
  const seeds = new Float32Array(count * 4) // theta0, phi, R0, speed

  const inc = (state.magneticInclination * Math.PI) / 180

  for (let i = 0; i < count; i++) {
    const zone = rng()
    let theta: number, phi: number, r: number, R0: number

    if (zone < 0.3) {
      // Near surface - magnetosphere
      R0 = 1.2 + rng() * 1.5
      theta = rng() * Math.PI
      phi = rng() * Math.PI * 2
      r = R0 * Math.sin(theta) * Math.sin(theta)
    } else if (zone < 0.7) {
      // Field lines
      R0 = 2.0 + rng() * 5.0
      theta = rng() * Math.PI
      phi = rng() * Math.PI * 2
      r = R0 * Math.sin(theta) * Math.sin(theta)
    } else {
      // Beam particles (polar regions)
      const pole = rng() > 0.5 ? 0 : 1
      theta = pole === 0 ? rng() * 0.3 : Math.PI - rng() * 0.3
      phi = rng() * Math.PI * 2
      R0 = 0.5 + rng() * 8.0
      r = R0 * (0.2 + rng() * 0.8)
    }

    const x0 = r * Math.sin(theta) * Math.cos(phi)
    const y0 = r * Math.cos(theta)
    const z0 = r * Math.sin(theta) * Math.sin(phi)

    // Apply magnetic inclination
    positions[i * 3] = x0
    positions[i * 3 + 1] = y0 * Math.cos(inc) - z0 * Math.sin(inc)
    positions[i * 3 + 2] = y0 * Math.sin(inc) + z0 * Math.cos(inc)

    // Speed along field line
    const speed = 0.2 + rng() * 0.8
    velocities[i * 3] = 0
    velocities[i * 3 + 1] = speed * (theta < Math.PI / 2 ? 1 : -1)
    velocities[i * 3 + 2] = 0

    energies[i] = 0.2 + rng() * 0.8
    seeds[i * 4] = theta
    seeds[i * 4 + 1] = phi
    seeds[i * 4 + 2] = R0
    seeds[i * 4 + 3] = speed
  }

  return { positions, velocities, energies, seeds }
}

function updateParticles(
  positions: Float32Array,
  seeds: Float32Array,
  energies: Float32Array,
  count: number,
  time: number,
  dt: number,
  state: StateConfig,
  rotation: number,
  quakeIntensity: number,
) {
  const inc = (state.magneticInclination * Math.PI) / 180
  const cosInc = Math.cos(inc)
  const sinInc = Math.sin(inc)
  const cosRot = Math.cos(rotation)
  const sinRot = Math.sin(rotation)

  for (let i = 0; i < count; i++) {
    let theta = seeds[i * 4]
    const phi = seeds[i * 4 + 1]
    const R0 = seeds[i * 4 + 2]
    const speed = seeds[i * 4 + 3]

    // Advance theta along field line
    theta += speed * dt * state.rotationSpeed * 0.3
    if (theta > Math.PI) theta -= Math.PI
    if (theta < 0) theta += Math.PI
    seeds[i * 4] = theta

    const r = R0 * Math.sin(theta) * Math.sin(theta)

    // Dipole position
    let x0 = r * Math.sin(theta) * Math.cos(phi)
    let y0 = r * Math.cos(theta)
    let z0 = r * Math.sin(theta) * Math.sin(phi)

    // Apply magnetic inclination
    const y1 = y0 * cosInc - z0 * sinInc
    const z1 = y0 * sinInc + z0 * cosInc

    // Apply rotation around Y axis
    const x2 = x0 * cosRot - z1 * sinRot
    const z2 = x0 * sinRot + z1 * cosRot

    // Magnetar quake perturbation
    if (quakeIntensity > 0) {
      const shake = quakeIntensity * 0.3
      const t2 = time * 8.0 + i * 0.01
      positions[i * 3] = x2 + Math.sin(t2) * shake * r * 0.1
      positions[i * 3 + 1] = y1 + Math.cos(t2 * 1.3) * shake * r * 0.1
      positions[i * 3 + 2] = z2 + Math.sin(t2 * 0.7) * shake * r * 0.1
    } else {
      positions[i * 3] = x2
      positions[i * 3 + 1] = y1
      positions[i * 3 + 2] = z2
    }

    // Energy pulse for beam particles
    const nearPole = Math.min(theta, Math.PI - theta) < 0.4
    energies[i] = nearPole
      ? 0.5 + 0.5 * Math.abs(Math.sin(time * state.rotationSpeed * 2 + i * 0.1))
      : 0.15 + seeds[i * 4 + 3] * 0.35 + quakeIntensity * 0.3
  }
}

// ─── WebGL Helpers ──────────────────────────────────────────────────────────

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram | null {
  const v = compileShader(gl, gl.VERTEX_SHADER, vs)
  const f = compileShader(gl, gl.FRAGMENT_SHADER, fs)
  if (!v || !f) return null
  const prog = gl.createProgram()!
  gl.attachShader(prog, v)
  gl.attachShader(prog, f)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Link error:', gl.getProgramInfoLog(prog))
    return null
  }
  return prog
}

function createFBO(gl: WebGL2RenderingContext, w: number, h: number) {
  const fb = gl.createFramebuffer()!
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { framebuffer: fb, texture: tex }
}

// ─── Data Readout Values ────────────────────────────────────────────────────

const READOUT: Record<State, { mass: string; radius: string; density: string; bField: string; period: string }> = {
  quiet: {
    mass: '1.4 M☉',
    radius: '10 km',
    density: '3.7 × 10¹⁷ kg/m³',
    bField: '10⁸ T',
    period: '-',
  },
  pulsar: {
    mass: '1.4 M☉',
    radius: '10 km',
    density: '3.7 × 10¹⁷ kg/m³',
    bField: '10⁸ T',
    period: '1.337 s',
  },
  magnetar: {
    mass: '1.4 M☉',
    radius: '10 km',
    density: '3.7 × 10¹⁷ kg/m³',
    bField: '10¹¹ T',
    period: '7.56 s',
  },
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
  className?: string
}

export default function NeutronStarVisualiser({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const stateRef = useRef<State>('quiet')
  const targetStateRef = useRef<State>('quiet')
  const blendRef = useRef(0) // 0 = fully current state
  const sequenceTimeRef = useRef(0)
  const interactiveRef = useRef(false)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rotationRef = useRef(0)
  const quakeRef = useRef(0)
  const quakeTimerRef = useRef(0)

  // Particle data refs
  const particleDataRef = useRef<{
    positions: Float32Array
    energies: Float32Array
    seeds: Float32Array
    velocities: Float32Array
    count: number
  } | null>(null)

  const [currentState, setCurrentState] = useState<State>('quiet')
  const [readout, setReadout] = useState(READOUT.quiet)

  const switchState = useCallback((newState: State) => {
    targetStateRef.current = newState
    blendRef.current = 0
    setCurrentState(newState)
    setReadout(READOUT[newState])

    // Re-initialise particles for new state
    const config = STATES[newState]
    const rng = seeded(42 + newState.charCodeAt(0))
    const count = typeof window !== 'undefined' && window.innerWidth < 768
      ? Math.min(config.particleCount, 20000)
      : config.particleCount
    particleDataRef.current = {
      ...initParticles(count, config, rng),
      count,
    }

    if (newState === 'magnetar') {
      quakeRef.current = 1.0
      quakeTimerRef.current = 0
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // ─── WebGL2 Init ──────────────────────────────────────────────────
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      preserveDrawingBuffer: true,
    })
    if (!gl) return

    // Check float texture support
    const ext = gl.getExtension('EXT_color_buffer_half_float')
    if (!ext) gl.getExtension('EXT_color_buffer_float')

    // ─── Programs ──────────────────────────────────────────────────────
    const particleProg = createProgram(gl, PARTICLE_VS, PARTICLE_FS)
    const fieldProg = createProgram(gl, FIELD_LINE_VS, FIELD_LINE_FS)
    const blurProg = createProgram(gl, BLOOM_VS, BLUR_FS)
    const compositeProg = createProgram(gl, BLOOM_VS, COMPOSITE_FS)
    if (!particleProg || !fieldProg || !blurProg || !compositeProg) return

    // ─── Particle Locations ────────────────────────────────────────────
    const pLoc = {
      position: gl.getAttribLocation(particleProg, 'a_position'),
      energy: gl.getAttribLocation(particleProg, 'a_energy'),
      viewProjection: gl.getUniformLocation(particleProg, 'u_viewProjection'),
      pointScale: gl.getUniformLocation(particleProg, 'u_pointScale'),
      dpr: gl.getUniformLocation(particleProg, 'u_dpr'),
      time: gl.getUniformLocation(particleProg, 'u_time'),
      colour: gl.getUniformLocation(particleProg, 'u_colour'),
      stateBlend: gl.getUniformLocation(particleProg, 'u_stateBlend'),
    }

    // ─── Field Line Locations ──────────────────────────────────────────
    const fLoc = {
      position: gl.getAttribLocation(fieldProg, 'a_position'),
      alpha: gl.getAttribLocation(fieldProg, 'a_alpha'),
      viewProjection: gl.getUniformLocation(fieldProg, 'u_viewProjection'),
      colour: gl.getUniformLocation(fieldProg, 'u_colour'),
      intensity: gl.getUniformLocation(fieldProg, 'u_intensity'),
    }

    // ─── Blur Locations ─────────────────────────────────────────────────
    const bLoc = {
      texture: gl.getUniformLocation(blurProg, 'u_texture'),
      direction: gl.getUniformLocation(blurProg, 'u_direction'),
      resolution: gl.getUniformLocation(blurProg, 'u_resolution'),
    }

    // ─── Composite Locations ────────────────────────────────────────────
    const cLoc = {
      scene: gl.getUniformLocation(compositeProg, 'u_scene'),
      bloom: gl.getUniformLocation(compositeProg, 'u_bloom'),
      bloomStrength: gl.getUniformLocation(compositeProg, 'u_bloomStrength'),
    }

    // ─── Buffers & VAOs ────────────────────────────────────────────────
    const particleVAO = gl.createVertexArray()!
    const posBuffer = gl.createBuffer()!
    const energyBuffer = gl.createBuffer()!

    gl.bindVertexArray(particleVAO)
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, MAX_PARTICLES * 3 * 4, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(pLoc.position)
    gl.vertexAttribPointer(pLoc.position, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, energyBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, MAX_PARTICLES * 4, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(pLoc.energy)
    gl.vertexAttribPointer(pLoc.energy, 1, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)

    // Field lines
    const fieldVAO = gl.createVertexArray()!
    const fieldPosBuffer = gl.createBuffer()!
    const fieldAlphaBuffer = gl.createBuffer()!

    gl.bindVertexArray(fieldVAO)
    gl.bindBuffer(gl.ARRAY_BUFFER, fieldPosBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, FIELD_LINE_COUNT * FIELD_LINE_SEGMENTS * 3 * 4, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(fLoc.position)
    gl.vertexAttribPointer(fLoc.position, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, fieldAlphaBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, FIELD_LINE_COUNT * FIELD_LINE_SEGMENTS * 4, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(fLoc.alpha)
    gl.vertexAttribPointer(fLoc.alpha, 1, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)

    // Full-screen quad for bloom
    const quadVAO = gl.createVertexArray()!
    const quadBuf = gl.createBuffer()!
    gl.bindVertexArray(quadVAO)
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    // Bind to both programs' a_position (location 0)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)

    // ─── FBOs for bloom ─────────────────────────────────────────────────
    let width = 0, height = 0
    let sceneFBO: ReturnType<typeof createFBO>
    let pingFBO: ReturnType<typeof createFBO>
    let pongFBO: ReturnType<typeof createFBO>

    function resizeFBOs(w: number, h: number) {
      // Use half res for bloom
      const bw = Math.max(1, Math.floor(w / 2))
      const bh = Math.max(1, Math.floor(h / 2))
      sceneFBO = createFBO(gl!, w, h)
      pingFBO = createFBO(gl!, bw, bh)
      pongFBO = createFBO(gl!, bw, bh)
    }

    // ─── Resize ─────────────────────────────────────────────────────────
    function handleResize() {
      if (!container || !canvas || !gl) return
      const rect = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.floor(rect.width * dpr)
      height = Math.floor(rect.height * dpr)
      if (width === 0 || height === 0) return
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      gl.viewport(0, 0, width, height)
      resizeFBOs(width, height)
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(container)
    handleResize()

    // ─── Init Particles ─────────────────────────────────────────────────
    const initConfig = STATES.quiet
    const rng = seeded(42)
    const initCount = window.innerWidth < 768
      ? Math.min(initConfig.particleCount, 20000)
      : initConfig.particleCount
    particleDataRef.current = {
      ...initParticles(initCount, initConfig, rng),
      count: initCount,
    }

    // ─── Mouse Parallax ─────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect()
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    container.addEventListener('mousemove', onMouseMove)

    // ─── Animation Loop ─────────────────────────────────────────────────
    let lastTime = 0
    let totalTime = 0

    function render(timestamp: number) {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05)
      lastTime = timestamp
      totalTime += dt

      if (!gl || width === 0 || height === 0) {
        rafRef.current = requestAnimationFrame(render)
        return
      }

      const particles = particleDataRef.current
      if (!particles) {
        rafRef.current = requestAnimationFrame(render)
        return
      }

      // ─── Cinematic Sequence ─────────────────────────────────────────
      if (!interactiveRef.current) {
        sequenceTimeRef.current += dt
        const t = sequenceTimeRef.current % SEQUENCE_TOTAL
        let elapsed = 0
        for (const step of SEQUENCE) {
          if (t < elapsed + step.duration) {
            if (stateRef.current !== step.state) {
              stateRef.current = step.state
              switchState(step.state)
            }
            break
          }
          elapsed += step.duration
        }
      }

      // ─── Magnetar quake decay ───────────────────────────────────────
      if (quakeRef.current > 0) {
        quakeTimerRef.current += dt
        if (quakeTimerRef.current > 3) {
          quakeRef.current = Math.max(0, quakeRef.current - dt * 0.5)
        }
      }

      // ─── Current config ─────────────────────────────────────────────
      const config = STATES[stateRef.current]

      // ─── Update Rotation ────────────────────────────────────────────
      rotationRef.current += config.rotationSpeed * dt

      // ─── Update Particles ───────────────────────────────────────────
      updateParticles(
        particles.positions,
        particles.seeds,
        particles.energies,
        particles.count,
        totalTime,
        dt,
        config,
        rotationRef.current,
        quakeRef.current,
      )

      // ─── Camera with parallax ───────────────────────────────────────
      const parallaxX = mouseRef.current.x * 0.15
      const parallaxY = mouseRef.current.y * 0.1
      const camDist = 18
      const eye = [
        Math.sin(parallaxX * 0.5) * camDist,
        parallaxY * 3,
        Math.cos(parallaxX * 0.5) * camDist,
      ]
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const aspect = width / height
      const proj = mat4Perspective(Math.PI / 4, aspect, 0.1, 100)
      const view = mat4LookAt(eye, [0, 0, 0], [0, 1, 0])
      const vp = mat4Multiply(proj, view)

      // ─── Render to Scene FBO ────────────────────────────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFBO.framebuffer)
      gl.viewport(0, 0, width, height)
      gl.clearColor(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2], 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE) // Additive

      // ─── Draw Field Lines ───────────────────────────────────────────
      const rotation = rotationRef.current
      const fieldData = generateFieldLineVertices(
        FIELD_LINE_COUNT,
        FIELD_LINE_SEGMENTS,
        config.magneticInclination,
        config.fieldStrength,
      )

      // Apply rotation to field line positions
      const cosR = Math.cos(rotation)
      const sinR = Math.sin(rotation)
      for (let i = 0; i < fieldData.positions.length / 3; i++) {
        const x = fieldData.positions[i * 3]
        const z = fieldData.positions[i * 3 + 2]
        fieldData.positions[i * 3] = x * cosR - z * sinR
        fieldData.positions[i * 3 + 2] = x * sinR + z * cosR
      }

      gl.useProgram(fieldProg)
      gl.uniformMatrix4fv(fLoc.viewProjection, false, vp)
      gl.uniform3fv(fLoc.colour, config.colour)
      gl.uniform1f(fLoc.intensity, config.fieldStrength * 0.5)

      gl.bindVertexArray(fieldVAO)
      gl.bindBuffer(gl.ARRAY_BUFFER, fieldPosBuffer)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, fieldData.positions)
      gl.bindBuffer(gl.ARRAY_BUFFER, fieldAlphaBuffer)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, fieldData.alphas)

      // Draw each field line as LINE_STRIP
      for (let i = 0; i < FIELD_LINE_COUNT; i++) {
        gl.drawArrays(gl.LINE_STRIP, i * FIELD_LINE_SEGMENTS, FIELD_LINE_SEGMENTS)
      }

      // ─── Draw Particles ─────────────────────────────────────────────
      gl.useProgram(particleProg)
      gl.uniformMatrix4fv(pLoc.viewProjection, false, vp)
      gl.uniform1f(pLoc.pointScale, 3.5)
      gl.uniform1f(pLoc.dpr, dpr)
      gl.uniform1f(pLoc.time, totalTime)
      gl.uniform3fv(pLoc.colour, config.colour)
      gl.uniform1f(pLoc.stateBlend, blendRef.current)

      gl.bindVertexArray(particleVAO)
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, particles.positions.subarray(0, particles.count * 3))
      gl.bindBuffer(gl.ARRAY_BUFFER, energyBuffer)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, particles.energies.subarray(0, particles.count))

      gl.drawArrays(gl.POINTS, 0, particles.count)

      gl.bindVertexArray(null)

      // ─── Bloom Pass ─────────────────────────────────────────────────
      const bw = Math.max(1, Math.floor(width / 2))
      const bh = Math.max(1, Math.floor(height / 2))

      // Horizontal blur: scene → ping
      gl.bindFramebuffer(gl.FRAMEBUFFER, pingFBO.framebuffer)
      gl.viewport(0, 0, bw, bh)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.disable(gl.BLEND)

      gl.useProgram(blurProg)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, sceneFBO.texture)
      gl.uniform1i(bLoc.texture, 0)
      gl.uniform2f(bLoc.direction, 1.0, 0.0)
      gl.uniform2f(bLoc.resolution, bw, bh)

      gl.bindVertexArray(quadVAO)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      // Vertical blur: ping → pong
      gl.bindFramebuffer(gl.FRAMEBUFFER, pongFBO.framebuffer)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.bindTexture(gl.TEXTURE_2D, pingFBO.texture)
      gl.uniform2f(bLoc.direction, 0.0, 1.0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      // Second pass for wider bloom
      gl.bindFramebuffer(gl.FRAMEBUFFER, pingFBO.framebuffer)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.bindTexture(gl.TEXTURE_2D, pongFBO.texture)
      gl.uniform2f(bLoc.direction, 1.0, 0.0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      gl.bindFramebuffer(gl.FRAMEBUFFER, pongFBO.framebuffer)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.bindTexture(gl.TEXTURE_2D, pingFBO.texture)
      gl.uniform2f(bLoc.direction, 0.0, 1.0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      // ─── Composite ──────────────────────────────────────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, width, height)
      gl.clearColor(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2], 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.disable(gl.BLEND)

      gl.useProgram(compositeProg)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, sceneFBO.texture)
      gl.uniform1i(cLoc.scene, 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, pongFBO.texture)
      gl.uniform1i(cLoc.bloom, 1)
      gl.uniform1f(cLoc.bloomStrength, stateRef.current === 'magnetar' ? 1.5 : 0.8)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      gl.bindVertexArray(null)
      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      container.removeEventListener('mousemove', onMouseMove)
      gl.deleteProgram(particleProg)
      gl.deleteProgram(fieldProg)
      gl.deleteProgram(blurProg)
      gl.deleteProgram(compositeProg)
    }
  }, [switchState])

  const enterInteractive = useCallback(() => {
    interactiveRef.current = true
  }, [])

  const handleStateChange = useCallback((state: State) => {
    enterInteractive()
    stateRef.current = state
    switchState(state)
  }, [enterInteractive, switchState])

  return (
    <div className={className}>
      {/* Visualiser Container */}
      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden"
        style={{ aspectRatio: '16/9', background: '#03060f' }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Data Readout */}
        <div className="absolute top-4 left-4 space-y-1 pointer-events-none">
          <p className="font-label text-[10px] text-white/60">
            {STATES[currentState].label.toUpperCase()}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            <span className="font-label text-[9px] text-white/60">MASS</span>
            <span className="font-label text-[9px] text-white/70">{readout.mass}</span>
            <span className="font-label text-[9px] text-white/60">RADIUS</span>
            <span className="font-label text-[9px] text-white/70">{readout.radius}</span>
            <span className="font-label text-[9px] text-white/60">DENSITY</span>
            <span className="font-label text-[9px] text-white/70">{readout.density}</span>
            <span className="font-label text-[9px] text-white/60">B FIELD</span>
            <span className="font-label text-[9px] text-white/70">{readout.bField}</span>
            {readout.period !== '-' && (
              <>
                <span className="font-label text-[9px] text-white/60">PERIOD</span>
                <span className="font-label text-[9px] text-white/70">{readout.period}</span>
              </>
            )}
          </div>
        </div>

        {/* State description */}
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <p className="font-nhg text-xs text-white/70 max-w-xs">
            {STATES[currentState].description}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mt-4">
        {(Object.keys(STATES) as State[]).map((state) => (
          <button
            key={state}
            onClick={() => handleStateChange(state)}
            className={`font-label text-xs px-4 py-2 transition-colors ${
              currentState === state
                ? 'bg-[var(--text-primary)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {STATES[state].label}
          </button>
        ))}
      </div>
    </div>
  )
}
