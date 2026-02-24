'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Exoplanet, ViewMode, getFacilityColour } from '../lib/types';

interface ExoplanetVisualizationProps {
  planets: Exoplanet[];
  view: ViewMode;
  highlightedPlanet: string | null;
  onPlanetHover: (name: string | null) => void;
  onPlanetClick: (name: string) => void;
}

// Vertex shader
const VERTEX_SHADER = `#version 300 es
precision highp float;

// Per-vertex attributes
in vec2 a_skyPosition;    // Mollweide-projected RA/Dec
in vec2 a_scatterPosition; // Log(period) vs Log(radius)
in float a_size;
in vec3 a_colour;
in float a_featured;
in float a_highlight;

uniform float u_transition;  // 0 = sky, 1 = scatter
uniform vec2 u_resolution;
uniform float u_pointScale;
uniform float u_time;

out vec3 v_colour;
out float v_featured;
out float v_highlight;

void main() {
  vec2 position = mix(a_skyPosition, a_scatterPosition, u_transition);

  // Aspect ratio correction
  float aspect = u_resolution.x / u_resolution.y;
  vec2 pos = position;
  if (aspect > 1.0) {
    pos.x /= aspect;
  } else {
    pos.y *= aspect;
  }

  gl_Position = vec4(pos, 0.0, 1.0);

  // Point size with highlight pulse
  float highlightPulse = a_highlight > 0.5 ? 1.0 + 0.3 * sin(u_time * 4.0) : 1.0;
  gl_PointSize = a_size * u_pointScale * highlightPulse;

  v_colour = a_colour;
  v_featured = a_featured;
  v_highlight = a_highlight;
}
`;

// Fragment shader
const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec3 v_colour;
in float v_featured;
in float v_highlight;

out vec4 fragColor;

void main() {
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  float r = dot(cxy, cxy);

  // Smooth circle
  float alpha = 1.0 - smoothstep(0.8, 1.0, r);

  // Featured planets get a ring
  if (v_featured > 0.5 && r > 0.5 && r < 0.7) {
    alpha = max(alpha, 0.6);
  }

  // Highlighted planets glow
  if (v_highlight > 0.5) {
    alpha = min(1.0, alpha * 1.5);
  }

  fragColor = vec4(v_colour, alpha * 0.9);
}
`;

// Mollweide projection
function mollweideProjection(ra: number, dec: number): [number, number] {
  // RA: 0-360 -> -PI to PI (centred at 180)
  const lambda = ((ra - 180) * Math.PI) / 180;
  const phi = (dec * Math.PI) / 180;

  // Newton-Raphson to find theta
  let theta = phi;
  for (let i = 0; i < 10; i++) {
    const dTheta = -(2 * theta + Math.sin(2 * theta) - Math.PI * Math.sin(phi)) /
                    (2 + 2 * Math.cos(2 * theta));
    theta += dTheta;
    if (Math.abs(dTheta) < 0.0001) break;
  }

  const x = (2 * Math.SQRT2 / Math.PI) * lambda * Math.cos(theta);
  const y = Math.SQRT2 * Math.sin(theta);

  // Normalise to [-1, 1]
  return [x / 2.8, y / 1.5];
}

// Scatter plot position (log-log)
function scatterPosition(period: number | null, radius: number | null): [number, number] {
  // X: log10(period), range 0.1 to 1000 days -> -1 to 3
  // Y: log10(radius), range 0.3 to 25 R_Earth -> -0.5 to 1.4
  const logPeriod = period && period > 0 ? Math.log10(period) : 0;
  const logRadius = radius && radius > 0 ? Math.log10(radius) : 0;

  // Map to [-0.9, 0.9]
  const x = ((logPeriod + 1) / 4) * 1.8 - 0.9;  // -1 to 3 -> -0.9 to 0.9
  const y = ((logRadius + 0.5) / 2) * 1.8 - 0.9; // -0.5 to 1.5 -> -0.9 to 0.9

  return [
    Math.max(-0.9, Math.min(0.9, x)),
    Math.max(-0.9, Math.min(0.9, y))
  ];
}

// Parse hex colour to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0.5, 0.5, 0.5];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ];
}

export default function ExoplanetVisualization({
  planets,
  view,
  highlightedPlanet,
  onPlanetHover,
  onPlanetClick,
}: ExoplanetVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);
  const transitionRef = useRef(0);
  const targetTransitionRef = useRef(0);
  const startTimeRef = useRef(0);

  const [error, setError] = useState<string | null>(null);

  // Initialise WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: false,
    });

    if (!gl) {
      setError('WebGL2 not supported');
      return;
    }

    glRef.current = gl;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(vs));
      setError('Shader compilation failed');
      return;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fs));
      setError('Shader compilation failed');
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      setError('Shader link failed');
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Enable blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    startTimeRef.current = performance.now();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update target transition when view changes
  useEffect(() => {
    targetTransitionRef.current = view === 'scatter' ? 1 : 0;
  }, [view]);

  // Build and upload buffers
  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program || planets.length === 0) return;

    // Build attribute arrays
    const skyPositions: number[] = [];
    const scatterPositions: number[] = [];
    const sizes: number[] = [];
    const colours: number[] = [];
    const featured: number[] = [];
    const highlights: number[] = [];

    for (const planet of planets) {
      // Sky position (Mollweide)
      if (planet.ra !== null && planet.dec !== null) {
        const [sx, sy] = mollweideProjection(planet.ra, planet.dec);
        skyPositions.push(sx, sy);
      } else {
        skyPositions.push(0, 0);
      }

      // Scatter position
      const [px, py] = scatterPosition(planet.pl_orbper, planet.pl_rade);
      scatterPositions.push(px, py);

      // Size based on transit depth
      const depth = planet.pl_trandep ?? 0.01;
      const size = Math.max(3, Math.min(20, 2 + Math.log10(depth + 0.001) * 4 + 8));
      sizes.push(size);

      // Colour by facility
      const colour = hexToRgb(getFacilityColour(planet.disc_facility));
      colours.push(...colour);

      // Featured flag
      featured.push(planet.featured ? 1 : 0);

      // Highlight flag
      highlights.push(planet.pl_name === highlightedPlanet ? 1 : 0);
    }

    // Create VAO
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Sky positions
    const skyBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, skyBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyPositions), gl.STATIC_DRAW);
    const skyLoc = gl.getAttribLocation(program, 'a_skyPosition');
    gl.enableVertexAttribArray(skyLoc);
    gl.vertexAttribPointer(skyLoc, 2, gl.FLOAT, false, 0, 0);

    // Scatter positions
    const scatterBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, scatterBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scatterPositions), gl.STATIC_DRAW);
    const scatterLoc = gl.getAttribLocation(program, 'a_scatterPosition');
    gl.enableVertexAttribArray(scatterLoc);
    gl.vertexAttribPointer(scatterLoc, 2, gl.FLOAT, false, 0, 0);

    // Sizes
    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.STATIC_DRAW);
    const sizeLoc = gl.getAttribLocation(program, 'a_size');
    gl.enableVertexAttribArray(sizeLoc);
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);

    // Colours
    const colourBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW);
    const colourLoc = gl.getAttribLocation(program, 'a_colour');
    gl.enableVertexAttribArray(colourLoc);
    gl.vertexAttribPointer(colourLoc, 3, gl.FLOAT, false, 0, 0);

    // Featured
    const featuredBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, featuredBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(featured), gl.STATIC_DRAW);
    const featuredLoc = gl.getAttribLocation(program, 'a_featured');
    gl.enableVertexAttribArray(featuredLoc);
    gl.vertexAttribPointer(featuredLoc, 1, gl.FLOAT, false, 0, 0);

    // Highlights (dynamic - update each frame)
    const highlightBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, highlightBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(highlights), gl.DYNAMIC_DRAW);
    const highlightLoc = gl.getAttribLocation(program, 'a_highlight');
    gl.enableVertexAttribArray(highlightLoc);
    gl.vertexAttribPointer(highlightLoc, 1, gl.FLOAT, false, 0, 0);

    // Store for updates
    (gl as any)._highlightBuffer = highlightBuffer;
    (gl as any)._vao = vao;
    (gl as any)._numPlanets = planets.length;

  }, [planets, highlightedPlanet]);

  // Update highlight buffer when highlighted planet changes
  useEffect(() => {
    const gl = glRef.current;
    if (!gl || !(gl as any)._highlightBuffer) return;

    const highlights = planets.map(p => p.pl_name === highlightedPlanet ? 1 : 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, (gl as any)._highlightBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(highlights));
  }, [planets, highlightedPlanet]);

  // Animation loop
  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program) return;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Resize canvas
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      // Animate transition
      const transitionSpeed = 0.03;
      if (transitionRef.current < targetTransitionRef.current) {
        transitionRef.current = Math.min(targetTransitionRef.current, transitionRef.current + transitionSpeed);
      } else if (transitionRef.current > targetTransitionRef.current) {
        transitionRef.current = Math.max(targetTransitionRef.current, transitionRef.current - transitionSpeed);
      }

      // Ease function
      const t = transitionRef.current;
      const easedTransition = t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

      // Clear
      gl.clearColor(0.02, 0.02, 0.03, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!(gl as any)._vao) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      gl.useProgram(program);
      gl.bindVertexArray((gl as any)._vao);

      // Set uniforms
      const transitionLoc = gl.getUniformLocation(program, 'u_transition');
      gl.uniform1f(transitionLoc, easedTransition);

      const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);

      const pointScaleLoc = gl.getUniformLocation(program, 'u_pointScale');
      gl.uniform1f(pointScaleLoc, Math.min(dpr, 2));

      const timeLoc = gl.getUniformLocation(program, 'u_time');
      gl.uniform1f(timeLoc, (performance.now() - startTimeRef.current) / 1000);

      // Draw
      gl.drawArrays(gl.POINTS, 0, (gl as any)._numPlanets);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Handle mouse events for hover/click
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || planets.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    // Aspect ratio correction
    const aspect = rect.width / rect.height;
    const correctedX = aspect > 1 ? x * aspect : x;
    const correctedY = aspect > 1 ? y : y / aspect;

    // Find nearest planet
    const t = transitionRef.current;
    let nearestDist = Infinity;
    let nearestPlanet: string | null = null;

    for (const planet of planets) {
      let px: number, py: number;

      if (planet.ra !== null && planet.dec !== null) {
        const [sx, sy] = mollweideProjection(planet.ra, planet.dec);
        const [scx, scy] = scatterPosition(planet.pl_orbper, planet.pl_rade);
        px = sx * (1 - t) + scx * t;
        py = sy * (1 - t) + scy * t;
      } else {
        const [scx, scy] = scatterPosition(planet.pl_orbper, planet.pl_rade);
        px = scx;
        py = scy;
      }

      const dist = Math.sqrt((correctedX - px) ** 2 + (correctedY - py) ** 2);
      if (dist < 0.03 && dist < nearestDist) {
        nearestDist = dist;
        nearestPlanet = planet.pl_name;
      }
    }

    onPlanetHover(nearestPlanet);
  }, [planets, onPlanetHover]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (highlightedPlanet) {
      onPlanetClick(highlightedPlanet);
    }
  }, [highlightedPlanet, onPlanetClick]);

  if (error) {
    return (
      <div className='w-full h-full flex items-center justify-center bg-[#050508] text-white/50'>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className='relative w-full h-full'>
      <canvas
        ref={canvasRef}
        className='w-full h-full cursor-crosshair'
        onMouseMove={handleMouseMove}
        onMouseLeave={() => onPlanetHover(null)}
        onClick={handleClick}
      />

      {/* Tooltip */}
      {highlightedPlanet && (
        <Tooltip planets={planets} name={highlightedPlanet} />
      )}

      {/* Axis labels for scatter view */}
      {view === 'scatter' && (
        <>
          <div className='absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/40 pointer-events-none'>
            Orbital Period (days) →
          </div>
          <div className='absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white/40 -rotate-90 origin-left pointer-events-none'>
            Planet Radius (R⊕) →
          </div>

          {/* Habitable zone band */}
          <div
            className='absolute bg-[#5ECE7B]/10 border-l border-r border-[#5ECE7B]/30 pointer-events-none'
            style={{
              left: '60%',
              right: '15%',
              top: '10%',
              bottom: '10%',
            }}
          >
            <span className='absolute top-1 left-1 text-[10px] text-[#5ECE7B]/60'>
              Habitable Zone
            </span>
          </div>
        </>
      )}

      {/* Sky map annotations */}
      {view === 'sky' && (
        <div
          className='absolute text-[10px] text-[#F5A623]/70 pointer-events-none'
          style={{ left: '65%', top: '35%' }}
        >
          Kepler field ↗
        </div>
      )}
    </div>
  );
}

function Tooltip({ planets, name }: { planets: Exoplanet[]; name: string }) {
  const planet = planets.find(p => p.pl_name === name);
  if (!planet) return null;

  return (
    <div className='absolute top-4 right-4 bg-black/90 border border-white/20 p-3 pointer-events-none max-w-xs'>
      <h4 className='text-sm font-medium text-white mb-1'>{planet.pl_name}</h4>
      <div className='text-xs text-white/60 space-y-0.5'>
        {planet.pl_rade && <p>Radius: {planet.pl_rade.toFixed(2)} R⊕</p>}
        {planet.pl_orbper && <p>Period: {planet.pl_orbper.toFixed(2)} days</p>}
        {planet.pl_trandep && <p>Transit depth: {planet.pl_trandep.toFixed(3)}%</p>}
        {planet.disc_facility && <p>Discovery: {planet.disc_facility}</p>}
      </div>
    </div>
  );
}
