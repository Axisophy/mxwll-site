'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import {
  GalaxyData,
  GalaxyFrame,
  mat4Identity,
  mat4Multiply,
  mat4Perspective,
  mat4LookAt,
} from '../lib/types';

interface GalaxyRendererProps {
  data: GalaxyData;
  currentTime: number;
  isPlaying: boolean;
  onTimeChange?: (time: number) => void;
}

// Vertex shader
const VERTEX_SHADER = `#version 300 es
precision highp float;

in vec3 a_position;
in float a_velocity;
in float a_galaxyId;

uniform mat4 u_viewProjection;
uniform float u_pointScale;
uniform float u_time;

out float v_velocity;
out float v_galaxyId;

void main() {
  vec4 viewPos = u_viewProjection * vec4(a_position, 1.0);
  gl_Position = viewPos;

  // Distance-attenuated point size
  float dist = length(viewPos.xyz);
  gl_PointSize = u_pointScale / max(dist, 0.5);
  gl_PointSize = clamp(gl_PointSize, 1.0, 12.0);

  v_velocity = a_velocity;
  v_galaxyId = a_galaxyId;
}
`;

// Fragment shader with OKLCh color mapping
const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in float v_velocity;
in float v_galaxyId;

out vec4 fragColor;

// OKLab to linear sRGB
vec3 oklabToLinearSrgb(vec3 lab) {
  float l_ = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m_ = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s_ = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;

  float l = l_ * l_ * l_;
  float m = m_ * m_ * m_;
  float s = s_ * s_ * s_;

  return vec3(
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
}

vec3 oklchToLinearSrgb(float L, float C, float h) {
  float a = C * cos(h);
  float b = C * sin(h);
  return oklabToLinearSrgb(vec3(L, a, b));
}

void main() {
  // Gaussian point sprite
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  float r2 = dot(cxy, cxy);
  if (r2 > 1.0) discard;

  float alpha = exp(-r2 * 2.5);

  // OKLCh color by velocity and galaxy
  float hue;
  float chroma;
  float lightness;

  float v = clamp(v_velocity, 0.0, 1.0);

  if (v_galaxyId < 0.5) {
    // Milky Way: blue-cyan
    hue = mix(4.4, 3.8, v);
    chroma = mix(0.08, 0.15, v);
    lightness = mix(0.5, 0.85, v);
  } else {
    // Andromeda: blue-white (warmer)
    hue = mix(4.2, 1.5, v);
    chroma = mix(0.06, 0.10, v);
    lightness = mix(0.55, 0.92, v);
  }

  vec3 color = oklchToLinearSrgb(lightness, chroma, hue);
  color = max(color, vec3(0.0));

  // Linear to sRGB gamma
  color = pow(color, vec3(1.0 / 2.2));

  fragColor = vec4(color * alpha, alpha * 0.7);
}
`;

export default function GalaxyRenderer({
  data,
  currentTime,
  isPlaying,
  onTimeChange,
}: GalaxyRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const vaoRef = useRef<WebGLVertexArrayObject | null>(null);
  const buffersRef = useRef<{
    position: WebGLBuffer | null;
    velocity: WebGLBuffer | null;
    galaxyId: WebGLBuffer | null;
  }>({ position: null, velocity: null, galaxyId: null });
  const locationsRef = useRef<{
    position: number;
    velocity: number;
    galaxyId: number;
    viewProjection: WebGLUniformLocation | null;
    pointScale: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
  } | null>(null);

  // Camera state
  const cameraRef = useRef({
    azimuth: 0.3,
    elevation: 0.4,
    distance: 25,
    target: [0, 0, 0] as [number, number, number],
  });

  // Mouse interaction
  const mouseRef = useRef({
    isDown: false,
    lastX: 0,
    lastY: 0,
  });

  // Animation
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Initialize WebGL
  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      premultipliedAlpha: false,
    });

    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    glRef.current = gl;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(vs));
      return;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fs));
      return;
    }

    // Link program
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;

    // Get attribute and uniform locations
    locationsRef.current = {
      position: gl.getAttribLocation(program, 'a_position'),
      velocity: gl.getAttribLocation(program, 'a_velocity'),
      galaxyId: gl.getAttribLocation(program, 'a_galaxyId'),
      viewProjection: gl.getUniformLocation(program, 'u_viewProjection'),
      pointScale: gl.getUniformLocation(program, 'u_pointScale'),
      time: gl.getUniformLocation(program, 'u_time'),
    };

    // Create VAO
    vaoRef.current = gl.createVertexArray();

    // Create buffers
    buffersRef.current = {
      position: gl.createBuffer(),
      velocity: gl.createBuffer(),
      galaxyId: gl.createBuffer(),
    };

    // Upload galaxy IDs (static)
    if (data.galaxyIds) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffersRef.current.galaxyId);
      gl.bufferData(gl.ARRAY_BUFFER, data.galaxyIds, gl.STATIC_DRAW);
    }
  }, [data.galaxyIds]);

  // Upload frame data
  const uploadFrame = useCallback((frame: GalaxyFrame) => {
    const gl = glRef.current;
    const buffers = buffersRef.current;
    const locations = locationsRef.current;
    const vao = vaoRef.current;

    if (!gl || !buffers.position || !locations || !vao) return;

    gl.bindVertexArray(vao);

    // Positions
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, frame.positions, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(locations.position);
    gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, 0, 0);

    // Velocities (normalized uint8)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
    gl.bufferData(gl.ARRAY_BUFFER, frame.velocities, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(locations.velocity);
    gl.vertexAttribPointer(locations.velocity, 1, gl.UNSIGNED_BYTE, true, 0, 0);

    // Galaxy IDs
    if (buffers.galaxyId) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.galaxyId);
      gl.enableVertexAttribArray(locations.galaxyId);
      gl.vertexAttribPointer(locations.galaxyId, 1, gl.UNSIGNED_BYTE, true, 0, 0);
    }

    gl.bindVertexArray(null);
  }, []);

  // Render frame
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const vao = vaoRef.current;
    const locations = locationsRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !vao || !locations || !canvas || !data.metadata) return;

    // Get current frame
    const frame = data.getInterpolatedFrame(currentTime);
    if (!frame) return;

    // Upload frame data
    uploadFrame(frame);

    // Resize canvas
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width * dpr;
    const height = rect.height * dpr;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    gl.viewport(0, 0, width, height);

    // Clear
    gl.clearColor(0.02, 0.02, 0.04, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Camera
    const camera = cameraRef.current;
    const eyeX = camera.distance * Math.sin(camera.azimuth) * Math.cos(camera.elevation);
    const eyeY = camera.distance * Math.sin(camera.elevation);
    const eyeZ = camera.distance * Math.cos(camera.azimuth) * Math.cos(camera.elevation);

    const projection = mat4Identity();
    mat4Perspective(projection, Math.PI / 4, width / height, 0.1, 1000);

    const view = mat4Identity();
    mat4LookAt(
      view,
      [eyeX + camera.target[0], eyeY + camera.target[1], eyeZ + camera.target[2]],
      camera.target,
      [0, 1, 0]
    );

    const viewProjection = mat4Identity();
    mat4Multiply(viewProjection, projection, view);

    // Draw
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.uniformMatrix4fv(locations.viewProjection, false, viewProjection);
    gl.uniform1f(locations.pointScale, 15.0 * (width / 1000));
    gl.uniform1f(locations.time, currentTime);

    // Additive blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.disable(gl.DEPTH_TEST);

    gl.drawArrays(gl.POINTS, 0, data.metadata.n_particles);

    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
  }, [data, currentTime, uploadFrame]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    mouseRef.current = { isDown: true, lastX: e.clientX, lastY: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mouseRef.current.isDown) return;

    const dx = e.clientX - mouseRef.current.lastX;
    const dy = e.clientY - mouseRef.current.lastY;

    cameraRef.current.azimuth -= dx * 0.005;
    cameraRef.current.elevation += dy * 0.005;
    cameraRef.current.elevation = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cameraRef.current.elevation));

    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    cameraRef.current.distance *= 1 + e.deltaY * 0.001;
    cameraRef.current.distance = Math.max(5, Math.min(100, cameraRef.current.distance));
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      mouseRef.current = { isDown: true, lastX: e.touches[0].clientX, lastY: e.touches[0].clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!mouseRef.current.isDown || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const dx = touch.clientX - mouseRef.current.lastX;
    const dy = touch.clientY - mouseRef.current.lastY;

    cameraRef.current.azimuth -= dx * 0.005;
    cameraRef.current.elevation += dy * 0.005;
    cameraRef.current.elevation = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cameraRef.current.elevation));

    mouseRef.current.lastX = touch.clientX;
    mouseRef.current.lastY = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  // Initialize
  useEffect(() => {
    if (data.loaded) {
      initGL();
    }
  }, [data.loaded, initGL]);

  // Animation loop
  useEffect(() => {
    if (!data.loaded) return;

    const animate = () => {
      render();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [data.loaded, render]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      render();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  return (
    <div
      ref={containerRef}
      className='w-full h-full relative cursor-grab active:cursor-grabbing'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        className='w-full h-full'
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
