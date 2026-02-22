'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { loadStarData, prepareStarBuffers } from './star-data';
import { createProgram } from './shaders';

interface GaiaExplorerProps {
  className?: string;
  demoMode?: boolean;
  showControls?: boolean;
  disableInteraction?: boolean; // For homepage embed
}

// Easing function for smooth transitions
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Linear interpolation
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Annotation data
const HR_ANNOTATIONS = [
  {
    id: 'main-sequence',
    label: 'Main Sequence',
    description: 'Where stars spend most of their lives',
    left: '52%',
    top: '50%',
    rotate: -35,
  },
  {
    id: 'red-giants',
    label: 'Red Giants',
    description: 'Cool but enormous — expanded old stars',
    left: '72%',
    top: '22%',
    rotate: 0,
  },
  {
    id: 'white-dwarfs',
    label: 'White Dwarfs',
    description: 'Hot but tiny — stellar remnants',
    left: '28%',
    top: '82%',
    rotate: 0,
  },
  {
    id: 'sun',
    label: 'Sun',
    description: null,
    left: '46%',
    top: '52%',
    rotate: 0,
    isSun: true,
  },
];

// Demo mode sequence
const DEMO_STEPS = [
  { at: 0, action: 'reset' },
  { at: 500, action: 'start_drift' },
  { at: 3500, action: 'transition_to_hr' },
  { at: 7500, action: 'hold' },
  { at: 11500, action: 'transition_to_sky' },
  { at: 15000, action: 'loop' },
];

export default function GaiaExplorer({ className, demoMode: propDemoMode = false, showControls: propShowControls = true, disableInteraction = false }: GaiaExplorerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  // UI state
  const [showControls, setShowControls] = useState(propShowControls);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [view, setView] = useState<'sky' | 'hr'>('sky');
  const [pointScale, setPointScale] = useState(1.0);
  const [transitionSpeed, setTransitionSpeed] = useState(1.0);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [fps, setFps] = useState(60);
  const [starCount, setStarCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [demoMode, setDemoMode] = useState(propDemoMode);
  const [currentTransition, setCurrentTransition] = useState(0);
  // Debug state
  const [debugInfo, setDebugInfo] = useState({ canvasW: 0, canvasH: 0, dpr: 1, aspect: 1 });

  // WebGL refs
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});

  // Animation state refs
  const transitionRef = useRef(0);
  const targetTransitionRef = useRef(0);
  const transitionStartRef = useRef(0);
  const transitionStartValueRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const zoomRef = useRef(1.0);
  const panRef = useRef<[number, number]>([0, 0]);
  const pointScaleRef = useRef(1.0);
  const transitionSpeedRef = useRef(1.0);

  // Demo mode refs
  const demoModeRef = useRef(propDemoMode);
  const demoStartTimeRef = useRef(0);
  const demoDriftStartZoomRef = useRef(1);

  // Interaction refs
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef<[number, number]>([0, 0]);

  // FPS tracking refs
  const frameTimesRef = useRef<number[]>([]);
  const fpsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep refs in sync with state
  pointScaleRef.current = pointScale;
  transitionSpeedRef.current = transitionSpeed;
  demoModeRef.current = demoMode;

  // Play full transition sequence (sky → HR → hold → HR → sky)
  const playFullTransition = useCallback(() => {
    const currentVal = transitionRef.current;
    const newTarget = currentVal < 0.5 ? 1 : 0;
    targetTransitionRef.current = newTarget;
    transitionStartRef.current = performance.now();
    transitionStartValueRef.current = currentVal;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setView(newTarget > 0.5 ? 'hr' : 'sky');
  }, []);

  // Set view directly (for buttons)
  const setViewDirect = useCallback((newView: 'sky' | 'hr') => {
    const newTarget = newView === 'hr' ? 1 : 0;
    if (Math.abs(targetTransitionRef.current - newTarget) > 0.01) {
      targetTransitionRef.current = newTarget;
      transitionStartRef.current = performance.now();
      transitionStartValueRef.current = transitionRef.current;
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setView(newView);
    }
  }, []);

  // Reset view
  const resetView = useCallback(() => {
    zoomRef.current = 1.0;
    panRef.current = [0, 0];
  }, []);

  // Save screenshot
  const saveScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `stellar-cartography-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, []);

  // Toggle demo mode
  const toggleDemoMode = useCallback(() => {
    setDemoMode((d) => {
      if (!d) {
        // Starting demo mode
        demoStartTimeRef.current = performance.now();
        demoDriftStartZoomRef.current = 1.0;
        zoomRef.current = 1.0;
        panRef.current = [0, 0];
        transitionRef.current = 0;
        targetTransitionRef.current = 0;
        setView('sky');
      }
      return !d;
    });
  }, []);

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true, // Required for screenshots
    });
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }
    glRef.current = gl;

    // Create shader program
    const program = createProgram(gl);
    if (!program) {
      console.error('Failed to create shader program');
      return;
    }
    programRef.current = program;
    gl.useProgram(program);

    // Get uniform locations
    uniformsRef.current = {
      u_transition: gl.getUniformLocation(program, 'u_transition'),
      u_pan: gl.getUniformLocation(program, 'u_pan'),
      u_zoom: gl.getUniformLocation(program, 'u_zoom'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_pointScale: gl.getUniformLocation(program, 'u_pointScale'),
    };

    // Get attribute locations
    const a_skyPos = gl.getAttribLocation(program, 'a_skyPos');
    const a_hrPos = gl.getAttribLocation(program, 'a_hrPos');
    const a_temperature = gl.getAttribLocation(program, 'a_temperature');
    const a_absMag = gl.getAttribLocation(program, 'a_absMag');

    let starCountLocal = 0;

    // Load star data and set up buffers
    // Reduce star count on mobile for performance
    const isMobile = window.innerWidth < 768;
    const targetStarCount = isMobile ? 25000 : 50000;

    loadStarData(targetStarCount).then((data) => {
      const buffers = prepareStarBuffers(data.stars);
      starCountLocal = buffers.count;
      setStarCount(buffers.count);
      setIsLoading(false);

      // Create VAO
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

      // Sky positions buffer
      const skyPosBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, skyPosBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, buffers.skyPositions, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(a_skyPos);
      gl.vertexAttribPointer(a_skyPos, 2, gl.FLOAT, false, 0, 0);

      // HR positions buffer
      const hrPosBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, hrPosBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, buffers.hrPositions, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(a_hrPos);
      gl.vertexAttribPointer(a_hrPos, 2, gl.FLOAT, false, 0, 0);

      // Temperature buffer
      const tempBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, tempBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, buffers.temperatures, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(a_temperature);
      gl.vertexAttribPointer(a_temperature, 1, gl.FLOAT, false, 0, 0);

      // Magnitude buffer
      const magBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, magBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, buffers.magnitudes, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(a_absMag);
      gl.vertexAttribPointer(a_absMag, 1, gl.FLOAT, false, 0, 0);
    });

    // Set up blending for additive starfield glow
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    // Resize handler
    let W = 0,
      H = 0;
    function handleResize() {
      if (!container || !canvas || !gl) return;
      const rect = container.getBoundingClientRect();
      // Cap DPR at 2 for mobile performance
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.floor(rect.width * dpr);
      H = Math.floor(rect.height * dpr);
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, W, H);
      // Update debug info
      setDebugInfo({ canvasW: W, canvasH: H, dpr, aspect: W / H });
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // Also handle fullscreen changes
    const onFullscreenChange = () => {
      setTimeout(handleResize, 100);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);

    // Animation loop
    function frame(now: number) {
      animRef.current = requestAnimationFrame(frame);
      if (!gl || !programRef.current || starCountLocal === 0) return;

      // Track frame times for FPS
      frameTimesRef.current.push(now);
      if (frameTimesRef.current.length > 30) frameTimesRef.current.shift();

      // Demo mode logic
      if (demoModeRef.current) {
        const elapsed = now - demoStartTimeRef.current;
        const loopDuration = DEMO_STEPS[DEMO_STEPS.length - 1].at;

        // Find current step
        let currentStep = DEMO_STEPS[0];
        for (let i = DEMO_STEPS.length - 1; i >= 0; i--) {
          if (elapsed >= DEMO_STEPS[i].at) {
            currentStep = DEMO_STEPS[i];
            break;
          }
        }

        switch (currentStep.action) {
          case 'reset':
            zoomRef.current = 1.0;
            panRef.current = [0, 0];
            transitionRef.current = 0;
            demoDriftStartZoomRef.current = 1.0;
            break;
          case 'start_drift':
            // Drift zoom from 1.0 to 1.15 over 3 seconds
            const driftProgress = Math.min((elapsed - 500) / 3000, 1);
            zoomRef.current = lerp(1.0, 1.15, driftProgress);
            break;
          case 'transition_to_hr':
            if (!isTransitioningRef.current && transitionRef.current < 0.99) {
              targetTransitionRef.current = 1;
              transitionStartRef.current = now;
              transitionStartValueRef.current = transitionRef.current;
              isTransitioningRef.current = true;
            }
            break;
          case 'transition_to_sky':
            if (!isTransitioningRef.current && transitionRef.current > 0.01) {
              targetTransitionRef.current = 0;
              transitionStartRef.current = now;
              transitionStartValueRef.current = transitionRef.current;
              isTransitioningRef.current = true;
            }
            break;
          case 'loop':
            demoStartTimeRef.current = now;
            zoomRef.current = 1.0;
            panRef.current = [0, 0];
            transitionRef.current = 0;
            isTransitioningRef.current = false;
            break;
        }
      }

      // Update transition
      if (isTransitioningRef.current) {
        const DURATION = 3000 / transitionSpeedRef.current;
        const elapsed = now - transitionStartRef.current;
        const rawProgress = Math.min(elapsed / DURATION, 1.0);
        const easedProgress = easeInOutCubic(rawProgress);

        const startVal = transitionStartValueRef.current;
        const targetVal = targetTransitionRef.current;
        transitionRef.current = startVal + (targetVal - startVal) * easedProgress;

        if (rawProgress >= 1.0) {
          isTransitioningRef.current = false;
          transitionRef.current = targetVal;
          setIsTransitioning(false);
        }
      }

      // Update current transition state for annotations
      setCurrentTransition(transitionRef.current);

      // Clear with dark blue-black
      gl.clearColor(0.02, 0.02, 0.03, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Set uniforms
      const uniforms = uniformsRef.current;
      // Cap DPR at 2 for mobile performance
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      gl.uniform1f(uniforms.u_transition, transitionRef.current);
      gl.uniform2f(uniforms.u_pan, panRef.current[0], panRef.current[1]);
      gl.uniform1f(uniforms.u_zoom, zoomRef.current);
      gl.uniform2f(uniforms.u_resolution, W, H);
      gl.uniform1f(uniforms.u_pointScale, pointScaleRef.current * dpr);

      // Draw stars
      gl.drawArrays(gl.POINTS, 0, starCountLocal);
    }

    animRef.current = requestAnimationFrame(frame);

    // FPS calculation interval
    fpsIntervalRef.current = setInterval(() => {
      const times = frameTimesRef.current;
      if (times.length < 2) return;
      const elapsed = times[times.length - 1] - times[0];
      const avgFps = Math.round(((times.length - 1) / elapsed) * 1000);
      setFps(avgFps);
    }, 500);

    // Mouse interactions (disabled during demo mode or when interaction disabled)
    const onWheel = (e: WheelEvent) => {
      if (demoModeRef.current || disableInteraction) return;
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
      zoomRef.current = Math.max(1.0, Math.min(20, zoomRef.current * zoomDelta));
    };

    // Clamp pan to keep content visible
    const clampPan = () => {
      const maxPan = Math.max(0, (zoomRef.current - 1) / zoomRef.current);
      panRef.current[0] = Math.max(-maxPan, Math.min(maxPan, panRef.current[0]));
      panRef.current[1] = Math.max(-maxPan, Math.min(maxPan, panRef.current[1]));
    };

    const onMouseDown = (e: MouseEvent) => {
      if (demoModeRef.current || disableInteraction) return;
      isDraggingRef.current = true;
      lastMouseRef.current = [e.clientX, e.clientY];
    };

    const onMouseMove = (e: MouseEvent) => {
      if (demoModeRef.current || disableInteraction) return;
      if (!isDraggingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const dx = ((e.clientX - lastMouseRef.current[0]) / rect.width) * 2 / zoomRef.current;
      const dy = (-(e.clientY - lastMouseRef.current[1]) / rect.height) * 2 / zoomRef.current;
      panRef.current[0] += dx;
      panRef.current[1] += dy;
      clampPan();
      lastMouseRef.current = [e.clientX, e.clientY];
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onDblClick = () => {
      if (demoModeRef.current || disableInteraction) return;
      zoomRef.current = 1.0;
      panRef.current = [0, 0];
    };

    // Touch interactions
    const onTouchStart = (e: TouchEvent) => {
      if (demoModeRef.current || disableInteraction) return;
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastMouseRef.current = [e.touches[0].clientX, e.touches[0].clientY];
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (demoModeRef.current || disableInteraction) return;
      // Only prevent default if we're actually dragging (not scrolling)
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const dx = ((e.touches[0].clientX - lastMouseRef.current[0]) / rect.width) * 2 / zoomRef.current;
      const dy = (-(e.touches[0].clientY - lastMouseRef.current[1]) / rect.height) * 2 / zoomRef.current;
      panRef.current[0] += dx;
      panRef.current[1] += dy;
      clampPan();
      lastMouseRef.current = [e.touches[0].clientX, e.touches[0].clientY];
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.addEventListener('dblclick', onDblClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      if (fpsIntervalRef.current) clearInterval(fpsIntervalRef.current);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      canvas.removeEventListener('dblclick', onDblClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Keyboard shortcuts (only when controls are shown)
  useEffect(() => {
    if (!showControls && !propShowControls) return;

    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === ' ') {
        e.preventDefault();
        playFullTransition();
      } else if (key === 'h') {
        setShowControls((s) => !s);
      } else if (key === 'r') {
        resetView();
      } else if (key === 's') {
        saveScreenshot();
      } else if (key === 'f') {
        toggleFullscreen();
      } else if (key === 'd' && propShowControls) {
        toggleDemoMode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [playFullTransition, resetView, saveScreenshot, toggleFullscreen, toggleDemoMode, showControls, propShowControls]);

  // Calculate annotation opacity
  const annotationOpacity = Math.max(0, (currentTransition - 0.85) / 0.15);

  return (
    <div ref={containerRef} className={`relative bg-[#050508] overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className='block w-full h-full cursor-crosshair' />

      {/* TEMPORARY DEBUG - remove when fixed */}
      {propShowControls && (
        <div className='absolute top-0 left-0 text-[10px] font-mono text-red-500 z-50 bg-black/80 p-2 pointer-events-none'>
          <div>canvas: {debugInfo.canvasW}×{debugInfo.canvasH}</div>
          <div>dpr: {debugInfo.dpr.toFixed(2)}</div>
          <div>zoom: {zoomRef.current.toFixed(2)}</div>
          <div>pan: [{panRef.current[0].toFixed(3)}, {panRef.current[1].toFixed(3)}]</div>
          <div>aspect: {debugInfo.aspect.toFixed(2)}</div>
          <div>transition: {currentTransition.toFixed(2)}</div>
          <div>stars: {starCount}</div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-[var(--text-tertiary)] text-sm font-mono'>LOADING STARS...</span>
        </div>
      )}

      {/* Annotations overlay */}
      {showAnnotations && !isLoading && !demoMode && propShowControls && (
        <div
          className='absolute inset-0 pointer-events-none'
          style={{ opacity: annotationOpacity, transition: 'opacity 0.3s ease' }}
        >
          {HR_ANNOTATIONS.filter((ann) => !ann.isSun).map((ann) => (
            <div
              key={ann.id}
              className='absolute'
              style={{
                left: ann.left,
                top: ann.top,
                transform: `translate(-50%, -50%) rotate(${ann.rotate}deg)`,
              }}
            >
              <div className='text-center'>
                <div
                  className='font-mono text-[11px] md:text-[10px] uppercase tracking-[0.08em]'
                  style={{ color: 'rgba(255, 255, 255, 0.55)' }}
                >
                  {ann.label}
                </div>
                {ann.description && (
                  <div
                    className='hidden md:block text-[9px] tracking-[0.02em] mt-0.5'
                    style={{ color: 'rgba(255, 255, 255, 0.30)' }}
                  >
                    {ann.description}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Axis labels - hidden on mobile */}
          <div
            className='hidden md:block absolute font-mono text-[10px] uppercase tracking-[0.08em]'
            style={{ left: '10%', bottom: '4%', color: 'rgba(255, 255, 255, 0.35)' }}
          >
            HOT (BLUE)
          </div>
          <div
            className='hidden md:block absolute font-mono text-[10px] uppercase tracking-[0.08em]'
            style={{ right: '10%', bottom: '4%', color: 'rgba(255, 255, 255, 0.35)' }}
          >
            COOL (RED)
          </div>
          <div
            className='hidden md:block absolute font-mono text-[10px] tracking-[0.08em]'
            style={{
              left: '50%',
              bottom: '4%',
              transform: 'translateX(-50%)',
              color: 'rgba(255, 255, 255, 0.25)',
            }}
          >
            SURFACE TEMPERATURE
          </div>
          <div
            className='hidden md:block absolute font-mono text-[10px] uppercase tracking-[0.08em]'
            style={{ left: '3%', top: '10%', color: 'rgba(255, 255, 255, 0.35)' }}
          >
            BRIGHTER
          </div>
          <div
            className='hidden md:block absolute font-mono text-[10px] uppercase tracking-[0.08em]'
            style={{ left: '3%', bottom: '10%', color: 'rgba(255, 255, 255, 0.35)' }}
          >
            DIMMER
          </div>
        </div>
      )}

      {/* Desktop controls - MXWLL control panel */}
      {!demoMode && propShowControls && (
        <div
          className={`hidden lg:block absolute top-4 right-4 w-[220px] transition-all duration-300 z-10 control-panel
            ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none translate-x-2'}`}
        >
          <div className='space-y-4'>
            <div className='pb-2 border-b border-white/10'>
              <label className='block mb-3'>STELLAR CARTOGRAPHY</label>
            </div>

            {/* View toggle */}
            <div>
              <label className='block mb-2'>VIEW</label>
              <div className='flex gap-1'>
                <button
                  className={`flex-1 px-2 py-1.5 text-[9px] border border-white/20 transition-all duration-200
                    ${view === 'sky' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  onClick={() => setViewDirect('sky')}
                >
                  SKY
                </button>
                <button
                  className={`flex-1 px-2 py-1.5 text-[9px] border border-white/20 transition-all duration-200
                    ${view === 'hr' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  onClick={() => setViewDirect('hr')}
                >
                  HR DIAGRAM
                </button>
              </div>
            </div>

            {/* Transition button */}
            <button
              className={`w-full px-2 py-2 text-[9px] border border-white/20 transition-all duration-200
                ${isTransitioning ? 'opacity-50' : 'hover:bg-white/5'}`}
              onClick={playFullTransition}
              disabled={isTransitioning}
            >
              {isTransitioning ? 'TRANSITIONING...' : 'TRANSITION'}
            </button>

            {/* Speed slider */}
            <div>
              <div className='flex justify-between items-baseline mb-1'>
                <label>SPEED</label>
                <span className='tabular-nums'>{transitionSpeed.toFixed(1)}×</span>
              </div>
              <input
                type='range'
                className='w-full'
                min={0.5}
                max={3}
                step={0.1}
                value={transitionSpeed}
                onChange={(e) => setTransitionSpeed(parseFloat(e.target.value))}
              />
            </div>

            {/* Point size slider */}
            <div>
              <div className='flex justify-between items-baseline mb-1'>
                <label>POINT SIZE</label>
                <span className='tabular-nums'>{pointScale.toFixed(1)}×</span>
              </div>
              <input
                type='range'
                className='w-full'
                min={0.5}
                max={2}
                step={0.1}
                value={pointScale}
                onChange={(e) => setPointScale(parseFloat(e.target.value))}
              />
            </div>

            {/* Annotations toggle */}
            <button
              className='w-full px-2 py-1.5 text-[9px] border border-white/20 transition-all duration-200 hover:bg-white/5'
              onClick={() => setShowAnnotations(!showAnnotations)}
            >
              ANNOTATIONS {showAnnotations ? 'ON' : 'OFF'}
            </button>

            {/* Stats */}
            <div className='pt-2 border-t border-white/10 space-y-1'>
              <div className='flex justify-between tabular-nums'>
                <span>STARS:</span>
                <span>{starCount.toLocaleString()}</span>
              </div>
              <div className='flex justify-between tabular-nums'>
                <span>FPS:</span>
                <span>{fps}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile controls - bottom sheet */}
      {!demoMode && propShowControls && (
        <div className='lg:hidden fixed bottom-0 left-0 right-0 z-20 control-panel'>
          {/* Always visible controls */}
          <div className='px-4 py-3 border-t border-white/10'>
            <div className='flex gap-2 mb-2'>
              <button
                className={`flex-1 px-3 py-2 text-[10px] border border-white/20 transition-all
                  ${view === 'sky' ? 'bg-white/10' : ''}`}
                onClick={() => setViewDirect('sky')}
              >
                SKY
              </button>
              <button
                className={`flex-1 px-3 py-2 text-[10px] border border-white/20 transition-all
                  ${view === 'hr' ? 'bg-white/10' : ''}`}
                onClick={() => setViewDirect('hr')}
              >
                HR DIAGRAM
              </button>
            </div>
            <button
              className='w-full px-3 py-2.5 text-[10px] border border-white/20 transition-all'
              onClick={playFullTransition}
              disabled={isTransitioning}
            >
              {isTransitioning ? 'TRANSITIONING...' : 'TRANSITION'}
            </button>
          </div>

          {/* Expandable controls */}
          {mobileControlsOpen && (
            <div className='px-4 pb-3 border-t border-white/10 space-y-2'>
              <div>
                <div className='flex justify-between items-baseline mb-1'>
                  <label className='text-[9px]'>SPEED</label>
                  <span className='text-[9px] tabular-nums'>{transitionSpeed.toFixed(1)}×</span>
                </div>
                <input
                  type='range'
                  className='w-full'
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={transitionSpeed}
                  onChange={(e) => setTransitionSpeed(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <div className='flex justify-between items-baseline mb-1'>
                  <label className='text-[9px]'>POINT SIZE</label>
                  <span className='text-[9px] tabular-nums'>{pointScale.toFixed(1)}×</span>
                </div>
                <input
                  type='range'
                  className='w-full'
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={pointScale}
                  onChange={(e) => setPointScale(parseFloat(e.target.value))}
                />
              </div>
              <button
                className='w-full px-2 py-1.5 text-[9px] border border-white/20'
                onClick={resetView}
              >
                RESET VIEW
              </button>
            </div>
          )}

          {/* Expand/collapse toggle */}
          <button
            className='w-full py-1 border-t border-white/10 flex items-center justify-center'
            onClick={() => setMobileControlsOpen(!mobileControlsOpen)}
          >
            <span className='text-[10px] text-white/40'>
              {mobileControlsOpen ? '▼' : '▲'} {mobileControlsOpen ? 'HIDE' : 'MORE'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
