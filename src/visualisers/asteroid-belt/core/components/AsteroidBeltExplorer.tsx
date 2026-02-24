'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  vertexShaderSource,
  fragmentShaderSource,
  orbitVertexShaderSource,
  orbitFragmentShaderSource,
  createProgram,
  generateCircleVertices,
} from '../lib/shaders';
import { loadAsteroidData, prepareAsteroidBuffers } from '../lib/mock-data';
import { KIRKWOOD_GAPS, PLANET_ORBITS, ASTEROID_FAMILIES } from '../lib/types';

interface AsteroidBeltExplorerProps {
  className?: string;
}

// View definitions
const VIEWS = [
  { id: 'spatial', label: 'Orbits', shortLabel: 'Orb', shortcut: '1' },
  { id: 'histogram', label: 'Gaps', shortLabel: 'Gap', shortcut: '2' },
  { id: 'family', label: 'Families', shortLabel: 'Fam', shortcut: '3' },
  { id: 'danger', label: 'Danger', shortLabel: 'Dnr', shortcut: '4' },
  { id: 'discovery', label: 'Discovery', shortLabel: 'Dis', shortcut: '5' },
] as const;

type ViewId = typeof VIEWS[number]['id'];

// Cubic ease-in-out
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Kirkwood gap explanations
const GAP_EXPLANATIONS: Record<string, string> = {
  '4:1': '4 asteroid orbits per 1 Jupiter orbit',
  '3:1': '3 asteroid orbits per 1 Jupiter orbit',
  '5:2': '5 asteroid orbits per 2 Jupiter orbits',
  '7:3': '7 asteroid orbits per 3 Jupiter orbits',
  '2:1': '2 asteroid orbits per 1 Jupiter orbit',
};

// Histogram axis tick marks
const HISTOGRAM_TICKS = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

// Orbit class legend items
const ORBIT_CLASS_LEGEND = [
  { label: 'Main Belt', color: 'rgb(179, 179, 166)' },
  { label: 'Jupiter Trojans', color: 'rgb(128, 153, 217)' },
  { label: 'Hildas', color: 'rgb(153, 179, 204)' },
  { label: 'Hungarias', color: 'rgb(217, 191, 128)' },
  { label: 'Near-Earth', color: 'rgb(230, 102, 77)' },
];

export default function AsteroidBeltExplorer({ className = '' }: AsteroidBeltExplorerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const orbitProgramRef = useRef<WebGLProgram | null>(null);
  const animationFrameRef = useRef<number>(0);
  const asteroidCountRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // View state - now supports 5 views
  const [activeView, setActiveView] = useState<ViewId>('spatial');
  const [previousView, setPreviousView] = useState<ViewId>('spatial');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef({ value: 0, startTime: 0 });
  const TRANSITION_DURATION = 3000;

  // Camera state
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(0.15);
  const [, setZoom] = useState(0.15);

  // Interaction state
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Auto-play sequence
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef({ active: false, startTime: 0, currentIndex: 0 });

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [fps, setFps] = useState(60);
  const fpsRef = useRef({ frames: 0, lastTime: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);

  // Track transition value for annotations
  const [transitionProgress, setTransitionProgress] = useState(0);

  // Map view IDs to numeric indices for shader
  const viewIdToIndex = useCallback((viewId: ViewId): number => {
    switch (viewId) {
      case 'spatial': return 0;
      case 'histogram': return 1;
      case 'family': return 2;
      case 'danger': return 3;
      case 'discovery': return 4;
      default: return 0;
    }
  }, []);

  // Show toast notification
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  }, []);

  // Transition to a new view
  const transitionToView = useCallback((viewId: ViewId) => {
    if (isTransitioning || activeView === viewId) return;

    setPreviousView(activeView);
    setActiveView(viewId);
    setIsTransitioning(true);
    transitionRef.current = { value: 0, startTime: performance.now() };

    // Set appropriate camera for each view
    panRef.current = { x: 0, y: 0 };
    if (viewId === 'spatial') {
      zoomRef.current = 0.15;
      setZoom(0.15);
    } else {
      // All other views use 1.0 zoom
      zoomRef.current = 1.0;
      setZoom(1.0);
    }
  }, [activeView, isTransitioning]);

  // Auto-play sequence
  const startAutoPlay = useCallback(() => {
    setIsPlaying(true);
    playRef.current = { active: true, startTime: performance.now(), currentIndex: 0 };
    // Start from spatial view
    if (activeView !== 'spatial') {
      transitionToView('spatial');
    }
  }, [activeView, transitionToView]);

  const stopAutoPlay = useCallback(() => {
    setIsPlaying(false);
    playRef.current.active = false;
  }, []);

  // Screenshot
  const takeScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `asteroid-belt-${activeView}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [activeView]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Try to get WebGL2 context
    let gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    // If that fails, try with minimal options
    if (!gl) {
      gl = canvas.getContext('webgl2');
    }

    // If still fails, show error
    if (!gl) {
      const gl1 = canvas.getContext('webgl');
      if (gl1) {
        setWebglError('WebGL2 not supported. Try enabling hardware acceleration in browser settings.');
      } else {
        setWebglError('WebGL not supported. Please enable hardware acceleration or try a different browser.');
      }
      setIsLoading(false);
      return;
    }

    glRef.current = gl;

    const asteroidProgram = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    const orbitProgram = createProgram(gl, orbitVertexShaderSource, orbitFragmentShaderSource);

    if (!asteroidProgram || !orbitProgram) {
      console.error('Failed to create shader programs');
      setIsLoading(false);
      return;
    }

    programRef.current = asteroidProgram;
    orbitProgramRef.current = orbitProgram;

    loadAsteroidData(100000).then((data) => {
      const buffers = prepareAsteroidBuffers(data.asteroids);
      asteroidCountRef.current = buffers.count;

      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

      // Position buffer helper
      const createPosBuffer = (data: Float32Array, attrName: string) => {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(asteroidProgram, attrName);
        if (loc >= 0) {
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        }
        return buffer;
      };

      // Float buffer helper
      const createFloatBuffer = (data: Float32Array, attrName: string) => {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(asteroidProgram, attrName);
        if (loc >= 0) {
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 1, gl.FLOAT, false, 0, 0);
        }
        return buffer;
      };

      // Position buffers for all 5 views
      createPosBuffer(buffers.spatialPositions, 'a_posOrbits');
      createPosBuffer(buffers.histogramPositions, 'a_posGaps');
      createPosBuffer(buffers.familyPositions, 'a_posFamilies');
      createPosBuffer(buffers.dangerPositions, 'a_posDanger');
      createPosBuffer(buffers.discoveryPositions, 'a_posDiscovery');

      // Per-asteroid data buffers
      createFloatBuffer(buffers.semiMajorAxes, 'a_semiMajorAxis');
      createFloatBuffer(buffers.eccentricities, 'a_eccentricity');
      createFloatBuffer(buffers.magnitudes, 'a_magnitude');
      createFloatBuffer(buffers.orbitClasses, 'a_orbitClass');
      createFloatBuffer(buffers.families, 'a_family');
      createFloatBuffer(buffers.discoveryYears, 'a_discoveryYear');
      createFloatBuffer(buffers.perihelions, 'a_perihelion');

      gl.bindVertexArray(null);

      (gl as WebGL2RenderingContext & { asteroidVAO: WebGLVertexArrayObject }).asteroidVAO = vao!;

      // Create orbit circle buffers
      const orbitVAOs: { vao: WebGLVertexArrayObject; count: number; color: number[] }[] = [];
      for (const planet of PLANET_ORBITS) {
        const vertices = generateCircleVertices(planet.a);
        const orbitVao = gl.createVertexArray();
        gl.bindVertexArray(orbitVao);

        const orbitBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, orbitBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const posLoc = gl.getAttribLocation(orbitProgram, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindVertexArray(null);
        orbitVAOs.push({ vao: orbitVao!, count: vertices.length / 2, color: planet.color });
      }

      (gl as WebGL2RenderingContext & { orbitVAOs: typeof orbitVAOs }).orbitVAOs = orbitVAOs;

      setIsLoading(false);
      setTimeout(() => setHasEntered(true), 100);
    }).catch((err) => {
      console.error('[Asteroid] Error loading data:', err);
      setIsLoading(false);
    });

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Render loop
  useEffect(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const orbitProgram = orbitProgramRef.current;
    if (!gl || !program || !orbitProgram || isLoading) return;

    startTimeRef.current = performance.now();

    const render = () => {
      const now = performance.now();
      timeRef.current = (now - startTimeRef.current) / 1000;

      // FPS calculation
      fpsRef.current.frames++;
      if (now - fpsRef.current.lastTime >= 1000) {
        setFps(fpsRef.current.frames);
        fpsRef.current.frames = 0;
        fpsRef.current.lastTime = now;
      }

      // Auto-play sequence - cycles through all 5 views
      if (playRef.current.active) {
        const elapsed = now - playRef.current.startTime;
        const viewDuration = 8000; // 8s per view (includes 3s transition)
        const totalCycle = viewDuration * 5; // 40s for full cycle
        const cyclePosition = elapsed % totalCycle;
        const viewIndex = Math.floor(cyclePosition / viewDuration);
        const viewPhase = (cyclePosition % viewDuration) / viewDuration;

        const viewOrder: ViewId[] = ['spatial', 'histogram', 'family', 'danger', 'discovery'];
        const targetView = viewOrder[viewIndex];

        if (activeView !== targetView && !isTransitioning && viewPhase < 0.1) {
          transitionToView(targetView);
        }

        // Slow zoom animation for spatial view
        if (targetView === 'spatial' && activeView === 'spatial') {
          zoomRef.current = 0.12 + viewPhase * 0.06;
          setZoom(zoomRef.current);
        }
      }

      // Update transition
      if (isTransitioning) {
        const elapsed = now - transitionRef.current.startTime;
        const progress = Math.min(elapsed / TRANSITION_DURATION, 1);
        const eased = easeInOutCubic(progress);

        transitionRef.current.value = eased;
        setTransitionProgress(eased);

        if (progress >= 1) {
          setIsTransitioning(false);
          setTransitionProgress(1);
        }
      }

      // Clear
      gl.clearColor(0.02, 0.02, 0.03, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Enable additive blending
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      const dpr = window.devicePixelRatio || 1;

      // Calculate orbit circle visibility
      // Show orbits when in spatial view or transitioning to/from it
      const inSpatialView = activeView === 'spatial' || previousView === 'spatial';
      const spatialness = activeView === 'spatial'
        ? (isTransitioning ? transitionRef.current.value : 1)
        : (previousView === 'spatial' && isTransitioning ? 1 - transitionRef.current.value : 0);

      // Draw orbit circles (spatial view)
      const orbitVAOs = (gl as WebGL2RenderingContext & { orbitVAOs?: { vao: WebGLVertexArrayObject; count: number; color: number[] }[] }).orbitVAOs;
      if (orbitVAOs && inSpatialView && spatialness > 0.01) {
        gl.useProgram(orbitProgram);

        gl.uniform2f(gl.getUniformLocation(orbitProgram, 'u_pan'), panRef.current.x, panRef.current.y);
        gl.uniform1f(gl.getUniformLocation(orbitProgram, 'u_zoom'), zoomRef.current);
        gl.uniform2f(gl.getUniformLocation(orbitProgram, 'u_resolution'), gl.canvas.width, gl.canvas.height);

        const orbitAlpha = spatialness;

        for (const orbit of orbitVAOs) {
          gl.bindVertexArray(orbit.vao);
          gl.uniform4f(
            gl.getUniformLocation(orbitProgram, 'u_color'),
            orbit.color[0],
            orbit.color[1],
            orbit.color[2],
            orbit.color[3] * orbitAlpha
          );
          gl.drawArrays(gl.LINE_LOOP, 0, orbit.count);
        }
      }

      // Draw asteroids
      gl.useProgram(program);

      const asteroidVAO = (gl as WebGL2RenderingContext & { asteroidVAO?: WebGLVertexArrayObject }).asteroidVAO;
      if (asteroidVAO) {
        gl.bindVertexArray(asteroidVAO);

        // View transition uniforms
        const fromView = viewIdToIndex(previousView);
        const toView = viewIdToIndex(activeView);
        gl.uniform1i(gl.getUniformLocation(program, 'u_viewFrom'), fromView);
        gl.uniform1i(gl.getUniformLocation(program, 'u_viewTo'), toView);
        gl.uniform1f(gl.getUniformLocation(program, 'u_transition'), transitionRef.current.value);

        // Camera uniforms
        gl.uniform2f(gl.getUniformLocation(program, 'u_pan'), panRef.current.x, panRef.current.y);
        gl.uniform1f(gl.getUniformLocation(program, 'u_zoom'), zoomRef.current);
        gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), gl.canvas.width, gl.canvas.height);
        gl.uniform1f(gl.getUniformLocation(program, 'u_pointScale'), dpr);

        // Animation uniforms
        gl.uniform1f(gl.getUniformLocation(program, 'u_time'), timeRef.current);
        gl.uniform1f(gl.getUniformLocation(program, 'u_orbitalSpeed'), 0.02);

        // Discovery view filter (current year shown)
        gl.uniform1f(gl.getUniformLocation(program, 'u_discoveryYear'), 2024.0);

        gl.drawArrays(gl.POINTS, 0, asteroidCountRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoading, isTransitioning, activeView, previousView, viewIdToIndex, transitionToView]);

  // Mouse/touch interactions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (isPlaying) stopAutoPlay();
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;

      const rect = canvas.getBoundingClientRect();
      panRef.current.x += (dx / rect.width) * 2 / zoomRef.current;
      panRef.current.y -= (dy / rect.height) * 2 / zoomRef.current;

      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isPlaying) stopAutoPlay();

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.05, Math.min(5, zoomRef.current * zoomFactor));
      zoomRef.current = newZoom;
      setZoom(newZoom);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        if (isPlaying) stopAutoPlay();
        isDraggingRef.current = true;
        lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;

      const dx = e.touches[0].clientX - lastMouseRef.current.x;
      const dy = e.touches[0].clientY - lastMouseRef.current.y;

      const rect = canvas.getBoundingClientRect();
      panRef.current.x += (dx / rect.width) * 2 / zoomRef.current;
      panRef.current.y -= (dy / rect.height) * 2 / zoomRef.current;

      lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPlaying, stopAutoPlay]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // View shortcuts 1-5
      const viewIndex = parseInt(e.key) - 1;
      if (viewIndex >= 0 && viewIndex < VIEWS.length) {
        e.preventDefault();
        transitionToView(VIEWS[viewIndex].id);
        return;
      }

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (isPlaying) {
          stopAutoPlay();
        } else {
          startAutoPlay();
        }
      } else if (e.key === 's' || e.key === 'S') {
        takeScreenshot();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [transitionToView, isPlaying, startAutoPlay, stopAutoPlay, takeScreenshot, toggleFullscreen]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Helper to map AU to screen X position
  const auToScreenX = (au: number): number => {
    const A_MIN = 1.5;
    const A_MAX = 5.5;
    const xNorm = (au - A_MIN) / (A_MAX - A_MIN);
    return 5 + xNorm * 90;
  };

  // Calculate view-specific opacities for annotations
  const getViewOpacity = (viewId: ViewId): number => {
    if (activeView === viewId && !isTransitioning) return 1;
    if (previousView === viewId && isTransitioning) return 1 - transitionProgress;
    if (activeView === viewId && isTransitioning) return transitionProgress;
    return 0;
  };

  const spatialOpacity = getViewOpacity('spatial');
  const histogramOpacity = getViewOpacity('histogram');
  const familyOpacity = getViewOpacity('family');
  const dangerOpacity = getViewOpacity('danger');
  const discoveryOpacity = getViewOpacity('discovery');

  return (
    <div ref={containerRef} className={`relative bg-[#050508] ${className}`}>
      {/* Loading overlay */}
      {isLoading && !webglError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050508] z-10">
          <div className="text-white/50 text-sm font-mono animate-pulse">
            Loading 100,000 asteroids...
          </div>
        </div>
      )}

      {/* WebGL error overlay */}
      {webglError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050508] z-10">
          <div className="text-center px-8">
            <div className="text-white/70 text-sm font-mono mb-4">
              {webglError}
            </div>
            <div className="text-white/40 text-xs font-mono mb-4">
              Chrome: Settings &gt; System &gt; Use hardware acceleration<br />
              Firefox: about:config &gt; webgl.disabled = false
            </div>
            <a
              href="https://get.webgl.org/webgl2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-blue)] text-xs font-mono hover:text-white transition-colors"
            >
              Test WebGL2 support
            </a>
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-all duration-1000 ${
          hasEntered ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
        }`}
        style={{ touchAction: 'none' }}
      />

      {/* Histogram annotations */}
      {!isLoading && histogramOpacity > 0.5 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: Math.max(0, (histogramOpacity - 0.5) * 2) }}
        >
          {/* X-axis tick marks */}
          <div className="absolute bottom-20 md:bottom-24 left-0 right-0">
            {HISTOGRAM_TICKS.map((tick) => (
              <div
                key={tick}
                className="absolute text-center"
                style={{ left: `${auToScreenX(tick)}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-px h-2 bg-white/30 mx-auto" />
                <div className="text-[9px] font-mono text-white/40 mt-1">{tick.toFixed(1)}</div>
              </div>
            ))}
          </div>

          {/* X-axis label */}
          <div className="absolute bottom-14 md:bottom-16 left-1/2 transform -translate-x-1/2 text-[9px] font-mono text-white/30">
            Distance from the Sun (AU)
          </div>

          {/* Y-axis indicator */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center">
            <div className="text-[9px] font-mono text-white/30 whitespace-nowrap flex items-center gap-2">
              <span>Fewer</span>
              <span className="text-white/20">|</span>
              <span>More asteroids</span>
            </div>
          </div>

          {/* Kirkwood gap annotations */}
          {KIRKWOOD_GAPS.map((gap, i) => {
            const xPercent = auToScreenX(gap.a);

            return (
              <div
                key={i}
                className="absolute text-center"
                style={{ left: `${xPercent}%`, transform: 'translateX(-50%)' }}
              >
                <div
                  className="absolute top-24 md:top-28 w-px"
                  style={{
                    height: 'calc(100% - 10rem)',
                    background: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 4px, transparent 4px, transparent 8px)',
                  }}
                />

                <div className="absolute top-16 md:top-20">
                  <div className="text-xs md:text-sm font-mono text-white/70 font-medium">
                    {gap.ratio}
                  </div>
                  <div className="text-[9px] font-mono text-white/30 mt-1 whitespace-nowrap">
                    {GAP_EXPLANATIONS[gap.ratio]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Spatial view annotations */}
      {!isLoading && spatialOpacity > 0.5 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: Math.max(0, (spatialOpacity - 0.5) * 2) }}
        >
          {/* Sun indicator */}
          <div
            className="absolute text-xs font-mono text-yellow-500/70"
            style={{
              left: `calc(50% + ${panRef.current.x * zoomRef.current * 50}%)`,
              top: `calc(50% - ${panRef.current.y * zoomRef.current * 50}%)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-yellow-400/80 mb-1 mx-auto" />
            <span className="text-[10px]">Sun</span>
          </div>

          {/* Planet labels */}
          {PLANET_ORBITS.map((planet) => {
            const angle = Math.PI * 0.25;
            const labelX = planet.a * Math.cos(angle);
            const labelY = planet.a * Math.sin(angle);

            return (
              <div
                key={planet.name}
                className="absolute text-[8px] font-mono uppercase tracking-wider"
                style={{
                  left: `calc(50% + ${(labelX + panRef.current.x) * zoomRef.current * 50}%)`,
                  top: `calc(50% - ${(labelY + panRef.current.y) * zoomRef.current * 50}%)`,
                  transform: 'translate(-50%, -50%)',
                  color: planet.name === 'Earth' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.20)',
                }}
              >
                {planet.name}
              </div>
            );
          })}

          {/* Main Belt label */}
          <div
            className="absolute text-[10px] font-mono text-white/15 uppercase tracking-widest"
            style={{
              left: `calc(50% + ${(2.7 * Math.cos(Math.PI * 0.6) + panRef.current.x) * zoomRef.current * 50}%)`,
              top: `calc(50% - ${(2.7 * Math.sin(Math.PI * 0.6) + panRef.current.y) * zoomRef.current * 50}%)`,
              transform: 'translate(-50%, -50%) rotate(-30deg)',
            }}
          >
            Main Belt
          </div>
        </div>
      )}

      {/* Legend - bottom left (spatial view) */}
      {!isLoading && spatialOpacity > 0.5 && (
        <div
          className="absolute bottom-20 left-4 pointer-events-none text-[8px] font-mono text-white/40 space-y-1"
          style={{ opacity: Math.max(0, (spatialOpacity - 0.5) * 2) }}
        >
          {ORBIT_CLASS_LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Family view annotations */}
      {!isLoading && familyOpacity > 0.5 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: Math.max(0, (familyOpacity - 0.5) * 2) }}
        >
          {/* Axis labels */}
          <div className="absolute bottom-14 md:bottom-16 left-1/2 transform -translate-x-1/2 text-[9px] font-mono text-white/30">
            Semi-major axis (AU)
          </div>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center">
            <div className="text-[9px] font-mono text-white/30">
              Eccentricity
            </div>
          </div>

          {/* Title */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-mono text-white/60 uppercase tracking-wider">
              Asteroid Families
            </div>
            <div className="text-[9px] font-mono text-white/30 mt-1">
              Collisional fragments cluster in orbital element space
            </div>
          </div>

          {/* Family legend */}
          <div className="absolute bottom-20 left-4 text-[8px] font-mono text-white/40 space-y-1">
            {ASTEROID_FAMILIES.slice(0, 5).map((family) => (
              <div key={family.name} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `rgb(${family.color.join(',')})` }}
                />
                <span>{family.name}</span>
              </div>
            ))}
          </div>
          <div className="absolute bottom-20 left-28 text-[8px] font-mono text-white/40 space-y-1">
            {ASTEROID_FAMILIES.slice(5).map((family) => (
              <div key={family.name} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `rgb(${family.color.join(',')})` }}
                />
                <span>{family.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <span>Background</span>
            </div>
          </div>
        </div>
      )}

      {/* Danger view annotations */}
      {!isLoading && dangerOpacity > 0.5 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: Math.max(0, (dangerOpacity - 0.5) * 2) }}
        >
          {/* Title */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-mono text-[var(--color-pink)] uppercase tracking-wider">
              Near-Earth Objects
            </div>
            <div className="text-[9px] font-mono text-white/30 mt-1">
              Asteroids with perihelion &lt; 1.3 AU
            </div>
          </div>

          {/* X-axis label */}
          <div className="absolute bottom-14 md:bottom-16 left-1/2 transform -translate-x-1/2 text-[9px] font-mono text-white/30">
            Perihelion distance (AU)
          </div>

          {/* Earth orbit marker */}
          <div
            className="absolute text-[9px] font-mono text-[var(--color-blue)]"
            style={{ left: 'calc(5% + 66.67% * 1.0 / 1.5)', bottom: '20%' }}
          >
            <div className="w-px h-12 bg-[var(--color-blue)]/30" />
            <div className="mt-1">Earth</div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-20 left-4 text-[8px] font-mono text-white/40 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Closest approach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span>Earth-crossing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span>Safe (Main Belt)</span>
            </div>
          </div>
        </div>
      )}

      {/* Discovery view annotations */}
      {!isLoading && discoveryOpacity > 0.5 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: Math.max(0, (discoveryOpacity - 0.5) * 2) }}
        >
          {/* Title */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-sm font-mono text-white/60 uppercase tracking-wider">
              Discovery Timeline
            </div>
            <div className="text-[9px] font-mono text-white/30 mt-1">
              From Ceres (1801) to modern surveys
            </div>
          </div>

          {/* X-axis: decade labels */}
          <div className="absolute bottom-20 md:bottom-24 left-0 right-0">
            {[1850, 1900, 1950, 2000].map((year) => {
              const xPercent = 5 + ((year - 1800) / 225) * 90;
              return (
                <div
                  key={year}
                  className="absolute text-center"
                  style={{ left: `${xPercent}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-px h-2 bg-white/30 mx-auto" />
                  <div className="text-[9px] font-mono text-white/40 mt-1">{year}</div>
                </div>
              );
            })}
          </div>

          {/* Key events */}
          <div className="absolute left-4 top-20 text-[8px] font-mono text-white/40 space-y-2">
            <div>
              <span className="text-white/60">1801</span> Ceres discovered
            </div>
            <div>
              <span className="text-white/60">1891</span> Astrophotography begins
            </div>
            <div>
              <span className="text-white/60">1998</span> LINEAR survey
            </div>
            <div>
              <span className="text-white/60">2010</span> WISE/Pan-STARRS
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20
          bg-black/80 backdrop-blur-sm border border-white/10 px-4 py-2
          text-white/70 text-sm font-mono rounded-lg">
          {toastMessage}
        </div>
      )}

      {/* Info panel */}
      {showInfo && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20
          w-72 bg-black/80 backdrop-blur-xl border border-white/10
          rounded-lg p-4 text-[10px] font-mono text-white/50">
          <button
            onClick={() => setShowInfo(false)}
            className="absolute top-2 right-2 text-white/40 hover:text-white/60"
          >
            &times;
          </button>
          <div className="text-[9px] uppercase tracking-wider text-white/30 mb-2">Data</div>
          <div>{asteroidCountRef.current.toLocaleString()} asteroids from Minor Planet Center</div>
          <div>Orbital elements computed at epoch 2025-01-01</div>
          <div className="mt-2 text-white/30">{fps} FPS | WebGL2</div>
          <div className="mt-2 text-[8px] text-white/20">
            Keys 1-5: Switch view | Space: Play | S: Save | F: Fullscreen
          </div>
        </div>
      )}

      {/* Bottom bar - View selector */}
      {!isLoading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10
          flex items-center gap-1
          bg-black/70 backdrop-blur-xl
          border border-white/10 rounded-full
          px-2 py-1.5">

          {/* View buttons - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {VIEWS.map((view) => (
              <button
                key={view.id}
                onClick={() => transitionToView(view.id)}
                disabled={isTransitioning}
                className={`
                  px-3 py-1.5 text-[10px] uppercase tracking-[0.08em] rounded-full
                  transition-all duration-300
                  ${activeView === view.id
                    ? 'bg-white/15 text-white/90'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5'}
                  disabled:opacity-50
                `}
              >
                {view.label}
              </button>
            ))}
          </div>

          {/* View buttons - Mobile (short labels) */}
          <div className="flex md:hidden items-center gap-1">
            {VIEWS.map((view) => (
              <button
                key={view.id}
                onClick={() => transitionToView(view.id)}
                disabled={isTransitioning}
                className={`
                  px-2 py-1.5 text-[9px] uppercase tracking-[0.05em] rounded-full
                  transition-all duration-300
                  ${activeView === view.id
                    ? 'bg-white/15 text-white/90'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/5'}
                  disabled:opacity-50
                `}
              >
                {view.shortLabel}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Utility buttons */}
          <button
            onClick={isPlaying ? stopAutoPlay : startAutoPlay}
            className={`w-7 h-7 flex items-center justify-center rounded-full
              transition-all duration-300
              ${isPlaying ? 'bg-white/15 text-white/90' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
            title={isPlaying ? 'Stop' : 'Play sequence'}
          >
            {isPlaying ? '■' : '▶'}
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`w-7 h-7 flex items-center justify-center rounded-full text-sm
              transition-all duration-300
              ${showInfo ? 'bg-white/15 text-white/90' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
            title="Info"
          >
            ⓘ
          </button>

          <button
            onClick={toggleFullscreen}
            className="w-7 h-7 flex items-center justify-center rounded-full text-xs
              text-white/40 hover:text-white/60 hover:bg-white/5 transition-all duration-300"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? '⛶' : '⛶'}
          </button>
        </div>
      )}
    </div>
  );
}
