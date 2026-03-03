'use client';

import { useEffect, useRef, useState } from 'react';
import {
  DESKTOP_POINT_STOPS,
  SKY_BG,
  buildRenderData,
  createProgram,
  easeInOutCubic,
  loadGaiaData,
} from '../demo/demo-utils';

interface StellarCartographyExplorerProps {
  className?: string;
}

type ViewName = 'sky' | 'hr' | 'galactic' | 'observer';
type ViewWeights4 = [number, number, number, number];

const VIEW_WEIGHTS: Record<ViewName, ViewWeights4> = {
  sky: [1, 0, 0, 0],
  hr: [0, 1, 0, 0],
  galactic: [0, 0, 1, 0],
  observer: [0, 0, 0, 1],
};

interface AnnotationData {
  label: string;
  x: number; // NDC coordinates
  y: number;
}

// HR Diagram region labels (approximate positions in NDC)
const HR_ANNOTATIONS: AnnotationData[] = [
  { label: 'Main Sequence', x: 0.0, y: -0.1 },
  { label: 'Red Giants', x: 0.5, y: 0.4 },
  { label: 'Red Supergiants', x: 0.6, y: 0.7 },
  { label: 'Horizontal Branch', x: -0.1, y: 0.3 },
  { label: 'White Dwarfs', x: -0.6, y: -0.7 },
  { label: 'Blue Stragglers', x: -0.4, y: 0.2 },
];

// Named stars for Observer view - positioned by real bp_rp and abs_mag values
// NDC coordinates computed from dataset ranges (bp_rp: -0.45..4.48, abs_mag: -2.89..14.11)
// Stars chosen for good spacing across the chart and recognisability
const OBSERVER_ANNOTATIONS: AnnotationData[] = [
  { label: 'Sirius', x: -0.82, y: 0.49 },         // A-type, abs_mag 1.42, brightest star
  { label: 'Capella', x: -0.49, y: 0.65 },         // Yellow giant, abs_mag 0.08
  { label: 'Aldebaran', x: -0.25, y: 0.74 },       // Orange giant, abs_mag -0.65
  { label: 'Procyon', x: -0.63, y: 0.35 },         // F-type, abs_mag 2.66
  { label: 'Sun', x: -0.48, y: 0.09 },             // G-type main sequence reference
  { label: '61 Cygni', x: -0.15, y: -0.22 },       // K-type dwarf, first parallax star
  { label: 'Mira', x: 0.40, y: 0.31 },             // Red giant variable, bp_rp 1.5
  { label: "Barnard's Star", x: 0.28, y: -0.89 },  // Red dwarf, bp_rp 2.7, abs_mag 13.2
];

export default function StellarCartographyExplorer({ className }: StellarCartographyExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const dprRef = useRef<number>(1);
  const cssWidthRef = useRef<number>(0);
  const cssHeightRef = useRef<number>(0);
  const transitionStartRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);
  const currentViewRef = useRef<ViewName>('sky');
  const targetViewRef = useRef<ViewName>('sky');

  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewName>('sky');

  // Handle view button clicks
  const handleViewChange = (view: ViewName) => {
    if (view === currentViewRef.current || isTransitioningRef.current) {
      return;
    }
    targetViewRef.current = view;
    isTransitioningRef.current = true;
    transitionStartRef.current = performance.now();
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });

    if (!gl) {
      console.error('WebGL2 is unavailable');
      return;
    }

    const program = createProgram(gl);
    if (!program) {
      console.error('Failed to compile shaders');
      return;
    }

    gl.useProgram(program);

    const aSkyPos = gl.getAttribLocation(program, 'a_skyPos');
    const aHrPos = gl.getAttribLocation(program, 'a_hrPos');
    const aGalPos = gl.getAttribLocation(program, 'a_galPos');
    const aMagPos = gl.getAttribLocation(program, 'a_magPos');
    const aGalLatAbs = gl.getAttribLocation(program, 'a_galLatAbs');
    const aSubtleColour = gl.getAttribLocation(program, 'a_subtleColour');
    const aObserverColour = gl.getAttribLocation(program, 'a_observerColour');
    const aBaseSize = gl.getAttribLocation(program, 'a_baseSize');
    const aHrSize = gl.getAttribLocation(program, 'a_hrSize');
    const aObserverSize = gl.getAttribLocation(program, 'a_observerSize');

    const uTransition = gl.getUniformLocation(program, 'u_transition');
    const uPan = gl.getUniformLocation(program, 'u_pan');
    const uZoom = gl.getUniformLocation(program, 'u_zoom');
    const uDpr = gl.getUniformLocation(program, 'u_dpr');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uSkyOffset = gl.getUniformLocation(program, 'u_skyOffset');
    const uGalacticOffset = gl.getUniformLocation(program, 'u_galacticOffset');
    const uFromWeights = gl.getUniformLocation(program, 'u_fromWeights');
    const uToWeights = gl.getUniformLocation(program, 'u_toWeights');
    const uGalacticMix = gl.getUniformLocation(program, 'u_galacticMix');
    const uObserverMix = gl.getUniformLocation(program, 'u_observerMix');

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const skyPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, skyPosBuffer);
    gl.enableVertexAttribArray(aSkyPos);
    gl.vertexAttribPointer(aSkyPos, 2, gl.FLOAT, false, 0, 0);

    const hrPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hrPosBuffer);
    gl.enableVertexAttribArray(aHrPos);
    gl.vertexAttribPointer(aHrPos, 2, gl.FLOAT, false, 0, 0);

    const galPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, galPosBuffer);
    gl.enableVertexAttribArray(aGalPos);
    gl.vertexAttribPointer(aGalPos, 2, gl.FLOAT, false, 0, 0);

    const magPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, magPosBuffer);
    gl.enableVertexAttribArray(aMagPos);
    gl.vertexAttribPointer(aMagPos, 2, gl.FLOAT, false, 0, 0);

    const galLatBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, galLatBuffer);
    gl.enableVertexAttribArray(aGalLatAbs);
    gl.vertexAttribPointer(aGalLatAbs, 1, gl.FLOAT, false, 0, 0);

    const subtleColourBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, subtleColourBuffer);
    gl.enableVertexAttribArray(aSubtleColour);
    gl.vertexAttribPointer(aSubtleColour, 3, gl.FLOAT, false, 0, 0);

    const observerColourBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, observerColourBuffer);
    gl.enableVertexAttribArray(aObserverColour);
    gl.vertexAttribPointer(aObserverColour, 3, gl.FLOAT, false, 0, 0);

    const baseSizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, baseSizeBuffer);
    gl.enableVertexAttribArray(aBaseSize);
    gl.vertexAttribPointer(aBaseSize, 1, gl.FLOAT, false, 0, 0);

    const hrSizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hrSizeBuffer);
    gl.enableVertexAttribArray(aHrSize);
    gl.vertexAttribPointer(aHrSize, 1, gl.FLOAT, false, 0, 0);

    const observerSizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, observerSizeBuffer);
    gl.enableVertexAttribArray(aObserverSize);
    gl.vertexAttribPointer(aObserverSize, 1, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let starCount = 0;
    let disposed = false;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const cssWidth = Math.max(1, rect.width);
      const cssHeight = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      dprRef.current = dpr;
      cssWidthRef.current = cssWidth;
      cssHeightRef.current = cssHeight;

      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(resize, 120);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', onResize);
    resize();

    loadGaiaData()
      .then((data) => {
        if (disposed) {
          return;
        }

        const renderData = buildRenderData(data.stars, DESKTOP_POINT_STOPS, { hrUniformSize: 1.5 });
        starCount = renderData.count;

        gl.bindBuffer(gl.ARRAY_BUFFER, skyPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.skyPositions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, hrPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.hrPositions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, galPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.galacticPositions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, magPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.magnitudePositions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, galLatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.galacticLatitudes, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, subtleColourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.subtleColours, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, observerColourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.observerColours, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, baseSizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.baseSizes, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, hrSizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.hrSizes, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, observerSizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.observerSizes, gl.STATIC_DRAW);

        setIsLoading(false);
      })
      .catch((error: unknown) => {
        console.error('Failed to load stellar data', error);
      });

    const renderFrame = (now: number) => {
      frameRef.current = window.requestAnimationFrame(renderFrame);

      if (starCount === 0) {
        return;
      }

      let transition = 0;
      const fromWeights = VIEW_WEIGHTS[currentViewRef.current];
      const toWeights = VIEW_WEIGHTS[targetViewRef.current];

      if (isTransitioningRef.current) {
        const elapsed = (now - transitionStartRef.current) / 1000;
        const duration = 1.5; // seconds
        const progress = Math.min(elapsed / duration, 1.0);
        transition = easeInOutCubic(progress);

        if (progress >= 1.0) {
          isTransitioningRef.current = false;
          currentViewRef.current = targetViewRef.current;
          setCurrentView(targetViewRef.current); // sync UI state
          transition = 0;
        }
      }

      const galacticMix = fromWeights[2] * (1 - transition) + toWeights[2] * transition;
      const observerMix = fromWeights[3] * (1 - transition) + toWeights[3] * transition;

      gl.clearColor(SKY_BG[0], SKY_BG[1], SKY_BG[2], SKY_BG[3]);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uTransition, transition);
      gl.uniform2f(uPan, 0, 0);
      gl.uniform1f(uZoom, 1.0);
      gl.uniform1f(uDpr, dprRef.current);
      if (uResolution) {
        gl.uniform2f(uResolution, cssWidthRef.current, cssHeightRef.current);
      }
      gl.uniform1f(uSkyOffset, 0);
      gl.uniform1f(uGalacticOffset, 0);
      gl.uniform4f(uFromWeights, fromWeights[0], fromWeights[1], fromWeights[2], fromWeights[3]);
      gl.uniform4f(uToWeights, toWeights[0], toWeights[1], toWeights[2], toWeights[3]);
      gl.uniform1f(uGalacticMix, galacticMix);
      gl.uniform1f(uObserverMix, observerMix);

      gl.drawArrays(gl.POINTS, 0, starCount);
    };

    frameRef.current = window.requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Convert NDC to pixel coordinates
  const ndcToPixel = (ndcX: number, ndcY: number) => {
    const x = ((ndcX + 1) / 2) * cssWidthRef.current;
    const y = ((1 - ndcY) / 2) * cssHeightRef.current;
    return { x, y };
  };

  const renderAnnotations = () => {
    if (currentView === 'hr' && !isTransitioningRef.current) {
      return HR_ANNOTATIONS.map((annotation, idx) => {
        const { x, y } = ndcToPixel(annotation.x, annotation.y);
        return (
          <div
            key={idx}
            className="absolute pointer-events-none"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className="font-nhg text-[11px] text-white/50 uppercase tracking-wider whitespace-nowrap">
              {annotation.label}
            </span>
          </div>
        );
      });
    }

    if (currentView === 'observer' && !isTransitioningRef.current) {
      return OBSERVER_ANNOTATIONS.map((annotation, idx) => {
        const { x, y } = ndcToPixel(annotation.x, annotation.y);
        return (
          <div
            key={idx}
            className="absolute pointer-events-none"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className="font-nhg text-[11px] text-white/50 uppercase tracking-wider whitespace-nowrap">
              {annotation.label}
            </span>
          </div>
        );
      });
    }

    return null;
  };

  return (
    <div className={`relative ${className ?? ''}`}>
      <div ref={containerRef} className="relative overflow-hidden bg-[#03060f]" style={{ aspectRatio: '16 / 10' }}>
        <canvas ref={canvasRef} className="block w-full h-full" />
        {renderAnnotations()}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-nhg text-xs uppercase tracking-[0.05em] text-white/45">Loading stars...</span>
          </div>
        )}
      </div>

      {/* View buttons */}
      <div className="flex gap-2 mt-6 justify-center flex-wrap">
        {(['sky', 'hr', 'galactic', 'observer'] as const).map((view) => (
          <button
            key={view}
            onClick={() => handleViewChange(view)}
            disabled={isLoading}
            className={`font-label text-xs px-4 py-2 rounded-xl transition-colors ${
              currentView === view
                ? 'bg-[#0055FF] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {view === 'hr' ? 'HR Diagram' : view === 'sky' ? 'Sky' : view === 'galactic' ? 'Galactic' : 'Observer'}
          </button>
        ))}
      </div>

      {/* Mobile note */}
      <div className="md:hidden mt-4 text-center">
        <p className="font-nhg text-xs italic text-[var(--text-tertiary)]">
          This visualiser renders 50,000 stars in real-time and is best experienced on a larger screen.
        </p>
      </div>
    </div>
  );
}
