'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MOBILE_POINT_STOPS,
  SKY_BG,
  buildRenderData,
  createProgram,
  easeInOutCubic,
  getCanvasMappedY,
  loadGaiaData,
  selectBrightestStars,
} from './demo-utils';

interface StellarDemoMobileProps {
  className?: string;
}

type ViewWeights4 = [number, number, number, number];

export default function StellarDemoMobile({ className }: StellarDemoMobileProps) {
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
      console.error('WebGL2 is unavailable for StellarDemoMobile');
      return;
    }

    const program = createProgram(gl);
    if (!program) {
      console.error('Failed to compile StellarDemoMobile shaders');
      return;
    }

    gl.useProgram(program);

    const aSkyPos = gl.getAttribLocation(program, 'a_skyPos');
    const aHrPos = gl.getAttribLocation(program, 'a_hrPos');
    const aGalPos = gl.getAttribLocation(program, 'a_galPos');
    const aMagPos = gl.getAttribLocation(program, 'a_magPos');
    const aGalLatAbs = gl.getAttribLocation(program, 'a_galLatAbs');
    const aColour = gl.getAttribLocation(program, 'a_colour');
    const aSize = gl.getAttribLocation(program, 'a_size');

    const uTransition = gl.getUniformLocation(program, 'u_transition');
    const uPan = gl.getUniformLocation(program, 'u_pan');
    const uZoom = gl.getUniformLocation(program, 'u_zoom');
    const uDpr = gl.getUniformLocation(program, 'u_dpr');
    const uSkyOffset = gl.getUniformLocation(program, 'u_skyOffset');
    const uGalacticOffset = gl.getUniformLocation(program, 'u_galacticOffset');
    const uFromWeights = gl.getUniformLocation(program, 'u_fromWeights');
    const uToWeights = gl.getUniformLocation(program, 'u_toWeights');
    const uGalacticMix = gl.getUniformLocation(program, 'u_galacticMix');

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
      const cssWidth = Math.max(1, window.innerWidth);
      const cssHeight = Math.max(1, Math.floor(window.innerHeight * 0.6));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

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

        const stars = selectBrightestStars(data.stars, 15000);
        const renderData = buildRenderData(stars, MOBILE_POINT_STOPS);
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

        gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.colours, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, renderData.sizes, gl.STATIC_DRAW);

        const h = cssHeightRef.current || Math.floor(window.innerHeight * 0.6);
        const mappedMin = getCanvasMappedY(renderData.minDec, h);
        const mappedMax = getCanvasMappedY(renderData.maxDec, h);
        const mappedNeg90 = getCanvasMappedY(-90, h);
        const mappedPos90 = getCanvasMappedY(90, h);

        console.log(
          `[StellarDemoMobile] Dec range ${renderData.minDec.toFixed(4)}..${renderData.maxDec.toFixed(4)} | mapped y ${mappedMax.toFixed(2)}..${mappedMin.toFixed(2)} | -90=>${mappedNeg90.toFixed(2)} +90=>${mappedPos90.toFixed(2)} h=${h}`,
        );

        console.log(
          `[StellarDemoMobile] magnitude range ${renderData.minMagnitude.toFixed(2)}..${renderData.maxMagnitude.toFixed(2)} | stars=${renderData.count}`,
        );
        console.log(
          `[StellarDemoMobile] galactic lat range ${renderData.minGalacticLat.toFixed(2)}..${renderData.maxGalacticLat.toFixed(2)}`,
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
      const loopSeconds = 22;
      const loopPhase = elapsedSeconds % loopSeconds;

      let transition = 0;
      let galacticOffset = 0;
      let fromWeights: ViewWeights4 = [1, 0, 0, 0];
      let toWeights: ViewWeights4 = [1, 0, 0, 0];

      if (loopPhase < 4) {
        fromWeights = [1, 0, 0, 0];
        toWeights = [1, 0, 0, 0];
        transition = 0;
      } else if (loopPhase < 5.5) {
        fromWeights = [1, 0, 0, 0];
        toWeights = [0, 1, 0, 0];
        transition = easeInOutCubic((loopPhase - 4) / 1.5);
      } else if (loopPhase < 9.5) {
        fromWeights = [0, 1, 0, 0];
        toWeights = [0, 1, 0, 0];
        transition = 0;
      } else if (loopPhase < 11.0) {
        fromWeights = [0, 1, 0, 0];
        toWeights = [0, 0, 1, 0];
        transition = easeInOutCubic((loopPhase - 9.5) / 1.5);
      } else if (loopPhase < 15.0) {
        fromWeights = [0, 0, 1, 0];
        toWeights = [0, 0, 1, 0];
        transition = 0;
        galacticOffset = -((loopPhase - 11.0) / 4) * 0.1;
      } else if (loopPhase < 16.5) {
        fromWeights = [0, 0, 1, 0];
        toWeights = [0, 0, 0, 1];
        transition = easeInOutCubic((loopPhase - 15.0) / 1.5);
        galacticOffset = -0.1;
      } else if (loopPhase < 20.5) {
        fromWeights = [0, 0, 0, 1];
        toWeights = [0, 0, 0, 1];
        transition = 0;
        galacticOffset = -0.1;
      } else {
        fromWeights = [0, 0, 0, 1];
        toWeights = [1, 0, 0, 0];
        transition = easeInOutCubic((loopPhase - 20.5) / 1.5);
        galacticOffset = -0.1;
      }

      const galacticMix = fromWeights[2] * (1 - transition) + toWeights[2] * transition;

      gl.clearColor(SKY_BG[0], SKY_BG[1], SKY_BG[2], SKY_BG[3]);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uTransition, transition);
      gl.uniform2f(uPan, 0, 0);
      gl.uniform1f(uZoom, 1);
      gl.uniform1f(uDpr, dprRef.current);
      gl.uniform1f(uSkyOffset, 0);
      gl.uniform1f(uGalacticOffset, galacticOffset);
      gl.uniform4f(uFromWeights, fromWeights[0], fromWeights[1], fromWeights[2], fromWeights[3]);
      gl.uniform4f(uToWeights, toWeights[0], toWeights[1], toWeights[2], toWeights[3]);
      gl.uniform1f(uGalacticMix, galacticMix);

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
    <div ref={containerRef} className={`relative overflow-hidden bg-[#050508] ${className ?? ''}`} style={{ width: '100vw', height: '60vh' }}>
      <canvas ref={canvasRef} className='block h-full w-full' />
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='font-input text-xs uppercase tracking-[0.12em] text-white/45'>Loading stars...</span>
        </div>
      )}
    </div>
  );
}
