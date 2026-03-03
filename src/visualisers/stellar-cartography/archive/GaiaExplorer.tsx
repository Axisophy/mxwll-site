'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { loadStarData, prepareStarBuffers } from './star-data';
import { createProgram } from './shaders';

interface GaiaExplorerProps {
  className?: string;
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

export default function GaiaExplorer({ className }: GaiaExplorerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  // UI state
  const [showControls, setShowControls] = useState(true);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [view, setView] = useState<'sky' | 'hr'>('sky');
  const [pointScale, setPointScale] = useState(1.0);
  const [transitionSpeed, setTransitionSpeed] = useState(1.0);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [fps, setFps] = useState(60);
  const [starCount, setStarCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [currentTransition, setCurrentTransition] = useState(0);

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
  const zoomRef = useRef(1);
  const panRef = useRef<[number, number]>([0, 0]);
  const pointScaleRef = useRef(1.0);
  const transitionSpeedRef = useRef(1.0);

  // Demo mode refs
  const demoModeRef = useRef(false);
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
    zoomRef.current = 1;
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
        demoDriftStartZoomRef.current = 1;
        zoomRef.current = 1;
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
    loadStarData(50000).then((data) => {
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
      const dpr = window.devicePixelRatio || 1;
      W = Math.floor(rect.width * dpr);
      H = Math.floor(rect.height * dpr);
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, W, H);
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
            zoomRef.current = 1;
            panRef.current = [0, 0];
            transitionRef.current = 0;
            demoDriftStartZoomRef.current = 1;
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
            zoomRef.current = 1;
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
      const dpr = window.devicePixelRatio || 1;
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

    // Mouse interactions (disabled during demo mode)
    const onWheel = (e: WheelEvent) => {
      if (demoModeRef.current) return;
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
      zoomRef.current *= zoomDelta;
      zoomRef.current = Math.max(0.5, Math.min(20, zoomRef.current));
    };

    const onMouseDown = (e: MouseEvent) => {
      if (demoModeRef.current) return;
      isDraggingRef.current = true;
      lastMouseRef.current = [e.clientX, e.clientY];
    };

    const onMouseMove = (e: MouseEvent) => {
      if (demoModeRef.current) return;
      if (!isDraggingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const dx = ((e.clientX - lastMouseRef.current[0]) / rect.width) * 2 / zoomRef.current;
      const dy = (-(e.clientY - lastMouseRef.current[1]) / rect.height) * 2 / zoomRef.current;
      panRef.current[0] += dx;
      panRef.current[1] += dy;
      lastMouseRef.current = [e.clientX, e.clientY];
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onDblClick = () => {
      if (demoModeRef.current) return;
      zoomRef.current = 1;
      panRef.current = [0, 0];
    };

    // Touch interactions
    const onTouchStart = (e: TouchEvent) => {
      if (demoModeRef.current) return;
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastMouseRef.current = [e.touches[0].clientX, e.touches[0].clientY];
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (demoModeRef.current) return;
      e.preventDefault();
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const rect = canvas.getBoundingClientRect();
      const dx = ((e.touches[0].clientX - lastMouseRef.current[0]) / rect.width) * 2 / zoomRef.current;
      const dy = (-(e.touches[0].clientY - lastMouseRef.current[1]) / rect.height) * 2 / zoomRef.current;
      panRef.current[0] += dx;
      panRef.current[1] += dy;
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

  // Keyboard shortcuts
  useEffect(() => {
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
      } else if (key === 'd') {
        toggleDemoMode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [playFullTransition, resetView, saveScreenshot, toggleFullscreen, toggleDemoMode]);

  // Calculate annotation opacity
  const annotationOpacity = Math.max(0, (currentTransition - 0.85) / 0.15);

  return (
    <div ref={containerRef} className={`relative bg-[#050508] overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className='block w-full h-full cursor-crosshair' />

      {/* Loading indicator */}
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-white/40 text-sm font-mono'>Loading stars...</span>
        </div>
      )}

      {/* Annotations overlay */}
      {showAnnotations && !isLoading && !demoMode && (
        <div
          className='absolute inset-0 pointer-events-none'
          style={{ opacity: annotationOpacity, transition: 'opacity 0.3s ease' }}
        >
          {HR_ANNOTATIONS.map((ann) => (
            <div
              key={ann.id}
              className='absolute'
              style={{
                left: ann.left,
                top: ann.top,
                transform: `translate(-50%, -50%) rotate(${ann.rotate}deg)`,
              }}
            >
              {ann.isSun ? (
                <div className='flex items-center gap-2'>
                  <div
                    className='w-[10px] h-[10px] rounded-full'
                    style={{ border: '1px solid rgba(255, 200, 50, 0.6)' }}
                  />
                  <span
                    className='text-[10px] uppercase tracking-[0.1em]'
                    style={{ color: 'rgba(255, 200, 50, 0.7)' }}
                  >
                    Sun
                  </span>
                </div>
              ) : (
                <div className='text-center'>
                  <div
                    className='text-[10px] uppercase tracking-[0.1em]'
                    style={{ color: 'rgba(255, 255, 255, 0.55)' }}
                  >
                    {ann.label}
                  </div>
                  {ann.description && (
                    <div
                      className='text-[9px] tracking-[0.02em] mt-0.5'
                      style={{ color: 'rgba(255, 255, 255, 0.30)' }}
                    >
                      {ann.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Axis labels */}
          <div
            className='absolute text-[10px] uppercase tracking-[0.1em]'
            style={{ left: '10%', bottom: '4%', color: 'rgba(255, 255, 255, 0.35)' }}
          >
            Hot (Blue)
          </div>
          <div
            className='absolute text-[10px] uppercase tracking-[0.1em]'
            style={{ right: '10%', bottom: '4%', color: 'rgba(255, 255, 255, 0.35)' }}
          >
            Cool (Red)
          </div>
          <div
            className='absolute text-[10px] tracking-[0.08em]'
            style={{
              left: '50%',
              bottom: '4%',
              transform: 'translateX(-50%)',
              color: 'rgba(255, 255, 255, 0.25)',
            }}
          >
            Surface Temperature
          </div>
          <div
            className='absolute text-[10px] uppercase tracking-[0.1em]'
            style={{ left: '3%', top: '10%', color: 'rgba(255, 255, 255, 0.35)' }}
          >
            Brighter
          </div>
          <div
            className='absolute text-[10px] uppercase tracking-[0.1em]'
            style={{ left: '3%', bottom: '10%', color: 'rgba(255, 255, 255, 0.35)' }}
          >
            Dimmer
          </div>
        </div>
      )}

      {/* Demo mode indicator */}
      {demoMode && (
        <div className='absolute top-4 left-4 z-10'>
          <div
            className='px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] rounded-sm'
            style={{
              background: 'rgba(255, 0, 85, 0.2)',
              border: '1px solid rgba(255, 0, 85, 0.4)',
              color: '#FF0055',
            }}
          >
            ● Demo Mode — Press D to exit
          </div>
        </div>
      )}

      {/* Desktop controls - floating overlay */}
      {!demoMode && (
        <div
          className={`hidden lg:block absolute top-4 right-4 w-[220px] p-4 rounded-md transition-all duration-300 z-10
            ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none translate-x-2'}`}
          style={{
            background: 'rgba(5, 5, 8, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <h2 className='text-[10px] font-medium tracking-[0.12em] uppercase text-white/40 mb-4'>
            Stellar Cartography
          </h2>

          {/* View toggle */}
          <div className='text-[8px] font-medium tracking-[0.1em] uppercase text-white/25 mb-1.5'>View</div>
          <div className='flex gap-1 mb-3'>
            <button
              className={`flex-1 px-2 py-1.5 text-[9px] font-medium tracking-[0.08em] uppercase border rounded-sm transition-all duration-200
                ${view === 'sky' ? 'border-white/40 text-white/80' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'}`}
              onClick={() => setViewDirect('sky')}
            >
              Sky
            </button>
            <button
              className={`flex-1 px-2 py-1.5 text-[9px] font-medium tracking-[0.08em] uppercase border rounded-sm transition-all duration-200
                ${view === 'hr' ? 'border-white/40 text-white/80' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'}`}
              onClick={() => setViewDirect('hr')}
            >
              HR Diagram
            </button>
          </div>

          {/* Transition button */}
          <button
            className={`w-full px-2 py-2 text-[9px] font-medium tracking-[0.08em] uppercase border rounded-sm transition-all duration-200 mb-4
              ${isTransitioning ? 'border-white/30 text-white/50' : 'border-[#0055FF]/50 text-[#0055FF] hover:bg-[#0055FF]/10'}`}
            onClick={playFullTransition}
            disabled={isTransitioning}
          >
            {isTransitioning ? '● Transitioning...' : '▶ Transition'}
          </button>

          {/* Speed slider */}
          <div className='flex justify-between items-baseline mb-0.5'>
            <span className='text-[9px] font-medium tracking-[0.08em] uppercase text-white/65'>Speed</span>
            <span className='text-[10px] tabular-nums text-white/45 font-mono'>{transitionSpeed.toFixed(1)}×</span>
          </div>
          <input
            type='range'
            className='w-full mb-3'
            min={0.5}
            max={3}
            step={0.1}
            value={transitionSpeed}
            onChange={(e) => setTransitionSpeed(parseFloat(e.target.value))}
            style={{ height: '1px', accentColor: 'rgba(255,255,255,0.55)' }}
          />

          {/* Point size slider */}
          <div className='flex justify-between items-baseline mb-0.5'>
            <span className='text-[9px] font-medium tracking-[0.08em] uppercase text-white/65'>Point Size</span>
            <span className='text-[10px] tabular-nums text-white/45 font-mono'>{pointScale.toFixed(1)}×</span>
          </div>
          <input
            type='range'
            className='w-full mb-3'
            min={0.5}
            max={2}
            step={0.1}
            value={pointScale}
            onChange={(e) => setPointScale(parseFloat(e.target.value))}
            style={{ height: '1px', accentColor: 'rgba(255,255,255,0.55)' }}
          />

          {/* Annotations toggle */}
          <button
            className={`w-full px-2 py-1.5 text-[9px] font-medium tracking-[0.08em] uppercase border rounded-sm transition-all duration-200 mb-3
              ${showAnnotations ? 'border-white/30 text-white/60' : 'border-white/10 text-white/30'}`}
            onClick={() => setShowAnnotations(!showAnnotations)}
          >
            Annotations {showAnnotations ? 'On' : 'Off'}
          </button>

          {/* Demo mode button */}
          <button
            className='w-full px-2 py-1.5 text-[9px] font-medium tracking-[0.08em] uppercase border border-white/10 text-white/40 rounded-sm hover:border-white/20 hover:text-white/60 transition-all duration-200 mb-4'
            onClick={toggleDemoMode}
          >
            ⏵ Demo Mode
          </button>

          {/* Stats */}
          <div
            className='p-2 rounded-sm font-mono text-[9px] leading-relaxed text-white/30'
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            stars: {starCount.toLocaleString()}
            <br />
            fps: {fps}
            <br />
            data: Gaia DR3
          </div>

          {/* Keyboard hints */}
          <div className='flex flex-wrap gap-2 mt-2.5'>
            {[
              ['H', 'hide'],
              ['R', 'reset'],
              ['S', 'save'],
              ['F', 'full'],
              ['D', 'demo'],
            ].map(([k, label]) => (
              <span key={k} className='text-[9px] text-white/30 flex items-center gap-1'>
                <code className='px-1 py-px border border-white/10 rounded-sm font-mono text-[9px] text-white/35'>
                  {k}
                </code>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mobile toggle button */}
      {!demoMode && (
        <button
          className='lg:hidden fixed bottom-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white/50 text-sm'
          style={{
            background: 'rgba(5, 5, 8, 0.88)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          onClick={() => setMobileControlsOpen(!mobileControlsOpen)}
        >
          ★
        </button>
      )}

      {/* Mobile controls panel */}
      {!demoMode && mobileControlsOpen && (
        <div
          className='lg:hidden fixed bottom-16 right-4 left-4 z-20 p-4 rounded-md'
          style={{
            background: 'rgba(5, 5, 8, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className='flex gap-2 mb-4'>
            <button
              className={`flex-1 px-3 py-2 text-[10px] font-medium uppercase border rounded-sm transition-all
                ${view === 'sky' ? 'border-white/40 text-white/80' : 'border-white/10 text-white/40'}`}
              onClick={() => setViewDirect('sky')}
            >
              Sky
            </button>
            <button
              className={`flex-1 px-3 py-2 text-[10px] font-medium uppercase border rounded-sm transition-all
                ${view === 'hr' ? 'border-white/40 text-white/80' : 'border-white/10 text-white/40'}`}
              onClick={() => setViewDirect('hr')}
            >
              HR Diagram
            </button>
          </div>
          <button
            className='w-full px-3 py-2.5 text-[10px] font-medium uppercase rounded-sm mb-3'
            style={{
              background: 'rgba(0, 85, 255, 0.2)',
              border: '1px solid rgba(0, 85, 255, 0.4)',
              color: '#0055FF',
            }}
            onClick={() => {
              playFullTransition();
              setMobileControlsOpen(false);
            }}
          >
            {isTransitioning ? '● Transitioning...' : '▶ Transition'}
          </button>
          <div className='flex gap-2'>
            <button
              className='flex-1 px-2 py-1.5 text-[9px] uppercase border border-white/10 text-white/40 rounded-sm'
              onClick={resetView}
            >
              Reset
            </button>
            <button
              className='flex-1 px-2 py-1.5 text-[9px] uppercase border border-white/10 text-white/40 rounded-sm'
              onClick={toggleDemoMode}
            >
              Demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
