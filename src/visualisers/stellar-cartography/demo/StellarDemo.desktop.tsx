'use client';

import { useEffect, useRef, useState } from 'react';
import {
  DESKTOP_POINT_STOPS,
  SKY_BG,
  buildRenderData,
  createProgram,
  easeInOutCubic,
  getCanvasMappedY,
  lerp,
  loadGaiaData,
} from './demo-utils';

interface StellarDemoDesktopProps {
  className?: string;
}

interface CameraState {
  panX: number;
  panY: number;
  zoom: number;
}

function skyCamera(phaseSeconds: number): CameraState {
  const progress = phaseSeconds / 15;
  return {
    panX: lerp(0.25, 0.0, progress),
    panY: Math.sin(progress * Math.PI * 2) * 0.02,
    zoom: 1.0,
  };
}

function hrCamera(phaseSeconds: number): CameraState {
  const progress = phaseSeconds / 15;
  return {
    panX: Math.sin(progress * Math.PI * 2) * 0.01,
    panY: Math.cos(progress * Math.PI * 2) * 0.01,
    zoom: 1.02 + Math.sin(progress * Math.PI * 2) * 0.015,
  };
}

function interpolateCamera(a: CameraState, b: CameraState, t: number): CameraState {
  return {
    panX: lerp(a.panX, b.panX, t),
    panY: lerp(a.panY, b.panY, t),
    zoom: lerp(a.zoom, b.zoom, t),
  };
}

export default function StellarDemoDesktop({ className }: StellarDemoDesktopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const dprRef = useRef<number>(1);
  const cssHeightRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error('WebGL2 is unavailable for StellarDemoDesktop');
      return;
    }

    const program = createProgram(gl);
    if (!program) {
      console.error('Failed to compile StellarDemoDesktop shaders');
      return;
    }

    gl.useProgram(program);

    const aSkyPos = gl.getAttribLocation(program, 'a_skyPos');
    const aHrPos = gl.getAttribLocation(program, 'a_hrPos');
    const aColour = gl.getAttribLocation(program, 'a_colour');
    const aSize = gl.getAttribLocation(program, 'a_size');

    const uTransition = gl.getUniformLocation(program, 'u_transition');
    const uPan = gl.getUniformLocation(program, 'u_pan');
    const uZoom = gl.getUniformLocation(program, 'u_zoom');
    const uDpr = gl.getUniformLocation(program, 'u_dpr');

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

    const colourBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
    gl.enableVertexAttribArray(aColour);
    gl.vertexAttribPointer(aColour, 3, gl.FLOAT, false, 0, 0);

    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.enableVertexAttribArray(aSize);
    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let starCount = 0;
    let disposed = false;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const cssWidth = Math.max(1, rect.width);
      const cssHeight = Math.max(1, window.innerHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      dprRef.current = dpr;
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
    document.addEventListener('fullscreenchange', onResize);
    resize();

    loadGaiaData()
      .then((data) => {
        if (disposed) {
          return;
        }

        const renderData = buildRenderData(data.stars, DESKTOP_POINT_STOPS);
        starCount = renderData.count;

        gl.bindBuffer(gl.ARRAY_BUFFER, skyPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.skyPositions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, hrPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.hrPositions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.colours, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.sizes, gl.STATIC_DRAW);

        const h = cssHeightRef.current || window.innerHeight;
        const mappedMin = getCanvasMappedY(renderData.minDec, h);
        const mappedMax = getCanvasMappedY(renderData.maxDec, h);
        const mappedNeg90 = getCanvasMappedY(-90, h);
        const mappedPos90 = getCanvasMappedY(90, h);

        console.log(
          `[StellarDemoDesktop] Dec range ${renderData.minDec.toFixed(4)}..${renderData.maxDec.toFixed(4)} | mapped y ${mappedMax.toFixed(2)}..${mappedMin.toFixed(2)} | -90=>${mappedNeg90.toFixed(2)} +90=>${mappedPos90.toFixed(2)} h=${h}`,
        );

        console.log(
          `[StellarDemoDesktop] magnitude range ${renderData.minMagnitude.toFixed(2)}..${renderData.maxMagnitude.toFixed(2)} | stars=${renderData.count}`,
        );

        setIsLoading(false);
      })
      .catch((error: unknown) => {
        console.error('Failed to load stellar demo data', error);
      });

    const renderFrame = (now: number) => {
      frameRef.current = window.requestAnimationFrame(renderFrame);

      if (starCount === 0) {
        return;
      }

      if (startTimeRef.current === 0) {
        startTimeRef.current = now;
      }

      const elapsedSeconds = (now - startTimeRef.current) / 1000;
      const loopSeconds = 36;
      const loopPhase = elapsedSeconds % loopSeconds;

      let transition = 0;
      let camera: CameraState;

      if (loopPhase < 15) {
        transition = 0;
        camera = skyCamera(loopPhase);
      } else if (loopPhase < 18) {
        const t = easeInOutCubic((loopPhase - 15) / 3);
        transition = t;
        camera = interpolateCamera(skyCamera(15), hrCamera(0), t);
      } else if (loopPhase < 33) {
        transition = 1;
        camera = hrCamera(loopPhase - 18);
      } else {
        const t = easeInOutCubic((loopPhase - 33) / 3);
        transition = 1 - t;
        camera = interpolateCamera(hrCamera(15), skyCamera(0), t);
      }

      gl.clearColor(SKY_BG[0], SKY_BG[1], SKY_BG[2], SKY_BG[3]);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uTransition, transition);
      gl.uniform2f(uPan, camera.panX, camera.panY);
      gl.uniform1f(uZoom, camera.zoom);
      gl.uniform1f(uDpr, dprRef.current);

      gl.drawArrays(gl.POINTS, 0, starCount);
    };

    frameRef.current = window.requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('fullscreenchange', onResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-[#050508] ${className ?? ''}`} style={{ height: '100vh' }}>
      <canvas ref={canvasRef} className='block h-full w-full' />
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='font-input text-xs uppercase tracking-[0.12em] text-white/45'>Loading stars...</span>
        </div>
      )}
    </div>
  );
}
