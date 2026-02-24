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

type ViewWeights4 = [number, number, number, number];

function skyCamera(phaseSeconds: number): CameraState {
  const progress = phaseSeconds / 5;
  return {
    panX: 0,
    panY: Math.sin(progress * Math.PI * 2) * 0.02,
    zoom: 1.0,
  };
}

function hrCamera(phaseSeconds: number): CameraState {
  const progress = phaseSeconds / 5;
  return {
    panX: 0,
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
        console.log(
          `[StellarDemoDesktop] galactic lat range ${renderData.minGalacticLat.toFixed(2)}..${renderData.maxGalacticLat.toFixed(2)}`,
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
      const loopSeconds = 26;
      const loopPhase = elapsedSeconds % loopSeconds;

      let transition = 0;
      let skyOffset = 0;
      let galacticOffset = 0;
      let camera: CameraState;
      let fromWeights: ViewWeights4 = [1, 0, 0, 0];
      let toWeights: ViewWeights4 = [1, 0, 0, 0];

      if (loopPhase < 5) {
        fromWeights = [1, 0, 0, 0];
        toWeights = [1, 0, 0, 0];
        transition = 0;
        skyOffset = (loopPhase / 5) * 0.25;
        camera = skyCamera(loopPhase);
      } else if (loopPhase < 6.5) {
        fromWeights = [1, 0, 0, 0];
        toWeights = [0, 1, 0, 0];
        const t = easeInOutCubic((loopPhase - 5) / 1.5);
        transition = t;
        skyOffset = 0.25;
        camera = interpolateCamera(skyCamera(5), hrCamera(0), t);
      } else if (loopPhase < 11.5) {
        fromWeights = [0, 1, 0, 0];
        toWeights = [0, 1, 0, 0];
        transition = 0;
        skyOffset = 0.25;
        camera = hrCamera(loopPhase - 6.5);
      } else if (loopPhase < 13) {
        fromWeights = [0, 1, 0, 0];
        toWeights = [0, 0, 1, 0];
        const t = easeInOutCubic((loopPhase - 11.5) / 1.5);
        transition = t;
        skyOffset = 0.25;
        camera = interpolateCamera(hrCamera(5), { panX: 0, panY: 0, zoom: 1.0 }, t);
      } else if (loopPhase < 18) {
        fromWeights = [0, 0, 1, 0];
        toWeights = [0, 0, 1, 0];
        transition = 0;
        skyOffset = 0.25;
        galacticOffset = -((loopPhase - 13) / 5) * 0.125;
        camera = { panX: 0, panY: 0, zoom: 1.0 };
      } else if (loopPhase < 19.5) {
        fromWeights = [0, 0, 1, 0];
        toWeights = [0, 0, 0, 1];
        const t = easeInOutCubic((loopPhase - 18) / 1.5);
        transition = t;
        skyOffset = 0.25;
        galacticOffset = -0.125;
        camera = { panX: 0, panY: 0, zoom: 1.0 };
      } else if (loopPhase < 24.5) {
        fromWeights = [0, 0, 0, 1];
        toWeights = [0, 0, 0, 1];
        transition = 0;
        skyOffset = 0.25;
        galacticOffset = -0.125;
        camera = { panX: 0, panY: 0, zoom: 1.0 };
      } else {
        fromWeights = [0, 0, 0, 1];
        toWeights = [1, 0, 0, 0];
        const t = easeInOutCubic((loopPhase - 24.5) / 1.5);
        transition = t;
        skyOffset = 0;
        galacticOffset = -0.125;
        camera = interpolateCamera({ panX: 0, panY: 0, zoom: 1.0 }, skyCamera(0), t);
      }

      const galacticMix = fromWeights[2] * (1 - transition) + toWeights[2] * transition;
      const observerMix = fromWeights[3] * (1 - transition) + toWeights[3] * transition;

      gl.clearColor(SKY_BG[0], SKY_BG[1], SKY_BG[2], SKY_BG[3]);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uTransition, transition);
      gl.uniform2f(uPan, camera.panX, camera.panY);
      gl.uniform1f(uZoom, camera.zoom);
      gl.uniform1f(uDpr, dprRef.current);
      gl.uniform1f(uSkyOffset, skyOffset);
      gl.uniform1f(uGalacticOffset, galacticOffset);
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
