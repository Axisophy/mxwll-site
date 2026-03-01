'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface ExoplanetRecord {
  disc_year: number | null;
  pl_orbper: number | null;
  pl_rade: number | null;
  ra: number | null;
  dec: number | null;
  discoverymethod: string | null;
}

type DiscoveryLabel = 'Transit' | 'Radial Velocity' | 'Other';

interface DemoPoint {
  discoveryYear: number;
  method: DiscoveryLabel;
  skyX: number;
  skyY: number;
  scatterX: number;
  scatterY: number;
}

interface ExoplanetDemoProps {
  className?: string;
}

const YEAR_MIN = 1992;
const YEAR_MAX = 2025;
const YEAR_RANGE = YEAR_MAX - YEAR_MIN;

const PERIOD_MIN = 0.1;
const PERIOD_MAX = 10000;
const RADIUS_MIN = 0.1;
const RADIUS_MAX = 25;

const BASE_DURATIONS = {
  timelineSweep: 8,
  timelineHold: 2,
  transitionOne: 2,
  scatterHold: 6,
  transitionTwo: 2,
  skyHold: 6,
  reset: 2,
};

const AXIS_YEARS = [1992, 1995, 2000, 2005, 2009, 2015, 2020, 2025];

const easeInOutCubic = (t: number) => {
  if (t < 0.5) {
    return 4 * t * t * t;
  }
  return 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const mapDiscoveryMethod = (method: string | null): DiscoveryLabel => {
  if (method === 'Transit') {
    return 'Transit';
  }

  if (method === 'Radial Velocity') {
    return 'Radial Velocity';
  }

  return 'Other';
};

const colourForMethod = (method: DiscoveryLabel) => {
  if (method === 'Transit') {
    return '#0055FF';
  }

  if (method === 'Radial Velocity') {
    return '#FF0055';
  }

  return 'rgba(255,255,255,0.6)';
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const getSkyPosition = (record: ExoplanetRecord, index: number) => {
  if (typeof record.ra === 'number' && typeof record.dec === 'number') {
    return {
      x: clamp01(record.ra / 360),
      y: clamp01(1 - (record.dec + 90) / 180),
    };
  }

  return {
    x: seededRandom(index + 1),
    y: seededRandom(index + 10007),
  };
};

const getScatterPosition = (record: ExoplanetRecord) => {
  const period = record.pl_orbper ?? PERIOD_MIN;
  const radius = record.pl_rade ?? RADIUS_MIN;

  let normX = 0;
  if (period <= PERIOD_MIN) {
    normX = 0;
  } else if (period >= PERIOD_MAX) {
    normX = 1;
  } else {
    normX = Math.log10(period / PERIOD_MIN) / Math.log10(PERIOD_MAX / PERIOD_MIN);
  }

  const normYRaw = 1 - (radius - RADIUS_MIN) / (RADIUS_MAX - RADIUS_MIN);

  return {
    x: clamp01(normX),
    y: clamp01(normYRaw),
  };
};

const getYearNorm = (year: number) => clamp01((year - YEAR_MIN) / YEAR_RANGE);

const getPhaseOpacity = (elapsed: number, start: number, end: number, fadeIn = 0.5, fadeOutLead = 0.5) => {
  if (elapsed < start || elapsed >= end) {
    return 0;
  }

  const fadeInOpacity = clamp01((elapsed - start) / fadeIn);
  const fadeOutStart = Math.max(start, end - fadeOutLead);
  const fadeOutOpacity = elapsed > fadeOutStart ? clamp01((end - elapsed) / fadeOutLead) : 1;
  return Math.min(fadeInOpacity, fadeOutOpacity);
};

export default function ExoplanetDemo({ className }: ExoplanetDemoProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const scatterBottomLabelRef = useRef<HTMLDivElement>(null);
  const scatterLeftLabelRef = useRef<HTMLDivElement>(null);
  const skyAnnotationRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [points, setPoints] = useState<DemoPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const durations = useMemo(() => {
    const scale = isMobile ? 0.75 : 1;
    return {
      timelineSweep: BASE_DURATIONS.timelineSweep * scale,
      timelineHold: BASE_DURATIONS.timelineHold * scale,
      transitionOne: BASE_DURATIONS.transitionOne * scale,
      scatterHold: BASE_DURATIONS.scatterHold * scale,
      transitionTwo: BASE_DURATIONS.transitionTwo * scale,
      skyHold: BASE_DURATIONS.skyHold * scale,
      reset: BASE_DURATIONS.reset * scale,
    };
  }, [isMobile]);

  const loopSeconds = useMemo(() => {
    return (
      durations.timelineSweep +
      durations.timelineHold +
      durations.transitionOne +
      durations.scatterHold +
      durations.transitionTwo +
      durations.skyHold +
      durations.reset
    );
  }, [durations]);

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateMobile();
    window.addEventListener('resize', updateMobile);

    return () => {
      window.removeEventListener('resize', updateMobile);
    };
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      const outer = outerRef.current;
      if (!outer) {
        return;
      }

      const rect = outer.getBoundingClientRect();
      setCanvasSize({
        width: Math.max(1, Math.floor(rect.width)),
        height: window.innerWidth < 768 ? 320 : 500,
      });
    };

    updateCanvasSize();

    const observer = new ResizeObserver(updateCanvasSize);
    if (outerRef.current) {
      observer.observe(outerRef.current);
    }

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    let isDisposed = false;

    const loadData = async () => {
      try {
        const response = await fetch('/data/exoplanets/planets.json');
        if (!response.ok) {
          throw new Error(`Failed to load data (${response.status})`);
        }

        const allData = (await response.json()) as ExoplanetRecord[];

        const filtered = allData.filter((record): record is ExoplanetRecord => {
          return record.pl_orbper !== null && record.pl_orbper !== undefined && record.pl_rade !== null && record.pl_rade !== undefined;
        });

        const mapped = filtered.map((record, index) => {
          const sky = getSkyPosition(record, index);
          const scatter = getScatterPosition(record);
          const rawYear = typeof record.disc_year === 'number' ? record.disc_year : YEAR_MAX;

          return {
            discoveryYear: Math.min(YEAR_MAX, Math.max(YEAR_MIN, rawYear)),
            method: mapDiscoveryMethod(record.discoverymethod),
            skyX: sky.x,
            skyY: sky.y,
            scatterX: scatter.x,
            scatterY: scatter.y,
          };
        });

        if (!isDisposed) {
          setPoints(mapped);
          setIsLoading(false);
        }
      } catch {
        if (!isDisposed) {
          setError('Failed to load exoplanet demo data');
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isDisposed = true;
    };
  }, []);

  const timelineAxisHeight = 40;
  const timelineSkyHeight = Math.max(0, canvasSize.height - timelineAxisHeight);

  const timelineEnd = durations.timelineSweep + durations.timelineHold;
  const transitionOneEnd = timelineEnd + durations.transitionOne;
  const scatterEnd = transitionOneEnd + durations.scatterHold;
  const transitionTwoEnd = scatterEnd + durations.transitionTwo;
  const skyEnd = transitionTwoEnd + durations.skyHold;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0 || canvasSize.width === 0 || canvasSize.height === 0) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(canvasSize.width * dpr);
    canvas.height = Math.floor(canvasSize.height * dpr);
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pointSize = isMobile ? 1.5 : 2;
    const timelineFlashDuration = Math.max(0.3 * (isMobile ? 0.75 : 1), 0.225);
    const startTime = performance.now();

    const keplerSkyX = clamp01(300 / 360);
    const keplerSkyY = clamp01(1 - (45 + 90) / 180);

    const drawPoint = (x: number, y: number, colour: string, opacity: number) => {
      if (opacity <= 0) {
        return;
      }

      context.globalAlpha = opacity;
      context.fillStyle = colour;
      context.beginPath();
      context.arc(x, y, pointSize, 0, Math.PI * 2);
      context.fill();
    };

    const drawFrame = (now: number) => {
      const elapsed = ((now - startTime) / 1000) % loopSeconds;
      context.clearRect(0, 0, canvasSize.width, canvasSize.height);

      let phaseOpacity = 1;
      let showTimelineAxis = false;
      let timelineProgress = 0;

      points.forEach((point) => {
        let xNorm = point.skyX;
        let yNorm = point.skyY;
        let opacity = 1;

        if (elapsed < timelineEnd) {
          showTimelineAxis = true;
          const timelineElapsed = Math.min(elapsed, durations.timelineSweep);
          timelineProgress = clamp01(timelineElapsed / durations.timelineSweep);

          xNorm = point.skyX;
          yNorm = point.skyY;

          if (elapsed <= durations.timelineSweep) {
            const discoveryTime = getYearNorm(point.discoveryYear) * durations.timelineSweep;
            if (timelineElapsed < discoveryTime) {
              opacity = 0;
            } else {
              opacity = clamp01((timelineElapsed - discoveryTime) / timelineFlashDuration);
            }
          }

          drawPoint(
            xNorm * canvasSize.width,
            yNorm * timelineSkyHeight,
            colourForMethod(point.method),
            opacity
          );
          return;
        }

        if (elapsed < transitionOneEnd) {
          const eased = easeInOutCubic(clamp01((elapsed - timelineEnd) / durations.transitionOne));
          xNorm = point.skyX + (point.scatterX - point.skyX) * eased;
          yNorm = point.skyY + (point.scatterY - point.skyY) * eased;
        } else if (elapsed < scatterEnd) {
          xNorm = point.scatterX;
          yNorm = point.scatterY;
        } else if (elapsed < transitionTwoEnd) {
          const eased = easeInOutCubic(clamp01((elapsed - scatterEnd) / durations.transitionTwo));
          xNorm = point.scatterX + (point.skyX - point.scatterX) * eased;
          yNorm = point.scatterY + (point.skyY - point.scatterY) * eased;
        } else if (elapsed < skyEnd) {
          xNorm = point.skyX;
          yNorm = point.skyY;
        } else {
          const eased = easeInOutCubic(clamp01((elapsed - skyEnd) / durations.reset));
          phaseOpacity = 1 - eased;
          xNorm = point.skyX;
          yNorm = point.skyY;
        }

        drawPoint(
          xNorm * canvasSize.width,
          yNorm * canvasSize.height,
          colourForMethod(point.method),
          opacity * phaseOpacity
        );
      });

      if (showTimelineAxis) {
        const axisTop = canvasSize.height - timelineAxisHeight;
        const axisY = axisTop + 12;

        context.globalAlpha = 1;
        context.strokeStyle = 'rgba(255,255,255,0.24)';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, axisY);
        context.lineTo(canvasSize.width, axisY);
        context.stroke();

        const currentYear = YEAR_MIN + YEAR_RANGE * timelineProgress;
        const sweepX = getYearNorm(currentYear) * canvasSize.width;

        context.strokeStyle = 'rgba(255,255,255,0.65)';
        context.beginPath();
        context.moveTo(sweepX, 0);
        context.lineTo(sweepX, axisY + 6);
        context.stroke();

        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillStyle = 'rgba(255,255,255,0.4)';
        context.font = '9px monospace';

        AXIS_YEARS.forEach((year) => {
          const x = getYearNorm(year) * canvasSize.width;
          context.fillText(String(year), x, axisY + 8);
        });

        const keplerX = getYearNorm(2009) * canvasSize.width;
        context.strokeStyle = 'rgba(255,255,255,0.55)';
        context.beginPath();
        context.moveTo(keplerX, axisY - 6);
        context.lineTo(keplerX, axisY);
        context.stroke();

        context.fillStyle = 'rgba(255,255,255,0.55)';
        context.font = '9px monospace';
        context.fillText('Kepler 2009', keplerX, axisY - 18);
        context.font = '8px monospace';
        context.fillText('discoveries accelerate', keplerX, axisY + 20);
      }

      const timelineTitleOpacity = getPhaseOpacity(elapsed, 0, timelineEnd);
      const scatterOpacity = getPhaseOpacity(elapsed, transitionOneEnd, scatterEnd);
      const skyTitleOpacity = getPhaseOpacity(elapsed, transitionTwoEnd, skyEnd);

      let titleText = '';
      let titleOpacity = 0;

      if (timelineTitleOpacity > 0) {
        titleText = 'DISCOVERY TIMELINE';
        titleOpacity = timelineTitleOpacity;
      } else if (scatterOpacity > 0) {
        titleText = 'SIZE & ORBIT';
        titleOpacity = scatterOpacity;
      } else if (skyTitleOpacity > 0) {
        titleText = 'WHERE IN THE SKY';
        titleOpacity = skyTitleOpacity;
      }

      if (titleRef.current) {
        titleRef.current.textContent = titleText;
        titleRef.current.style.opacity = titleOpacity.toFixed(3);
      }

      if (scatterBottomLabelRef.current) {
        scatterBottomLabelRef.current.style.opacity = scatterOpacity.toFixed(3);
      }

      if (scatterLeftLabelRef.current) {
        scatterLeftLabelRef.current.style.opacity = scatterOpacity.toFixed(3);
      }

      const skyAnnotationFadeInStart = transitionTwoEnd + 1;
      const skyAnnotationBaseOpacity = getPhaseOpacity(elapsed, transitionTwoEnd, skyEnd);
      const skyAnnotationFade = clamp01((elapsed - skyAnnotationFadeInStart) / 0.6);
      const skyAnnotationOpacity = skyAnnotationBaseOpacity * skyAnnotationFade;

      if (skyAnnotationRef.current) {
        skyAnnotationRef.current.style.opacity = skyAnnotationOpacity.toFixed(3);
        skyAnnotationRef.current.style.left = `${keplerSkyX * canvasSize.width}px`;
        skyAnnotationRef.current.style.top = `${keplerSkyY * canvasSize.height}px`;
      }

      rafRef.current = window.requestAnimationFrame(drawFrame);
    };

    rafRef.current = window.requestAnimationFrame(drawFrame);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [
    canvasSize.height,
    canvasSize.width,
    durations.reset,
    durations.scatterHold,
    durations.skyHold,
    durations.timelineHold,
    durations.timelineSweep,
    durations.transitionOne,
    durations.transitionTwo,
    isMobile,
    loopSeconds,
    points,
    scatterEnd,
    skyEnd,
    timelineEnd,
    timelineSkyHeight,
    transitionOneEnd,
    transitionTwoEnd,
  ]);

  return (
    <div className={className}>
      <div className='w-full bg-[#03060f] p-4 md:p-6'>
        <div ref={outerRef} className='relative w-full' style={{ height: `${isMobile ? 320 : 500}px` }}>
          <canvas
            ref={canvasRef}
            className='block h-full w-full bg-[#050508]'
            aria-label='Exoplanet discovery demo'
          />

          <div
            ref={titleRef}
            className='pointer-events-none absolute left-3 top-3 font-nhg text-[11px] uppercase tracking-[0.08em] text-white/50 opacity-0'
          />

          <div
            ref={scatterBottomLabelRef}
            className='pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-input text-[9px] text-white/[0.35] opacity-0'
          >
            ← shorter orbit · orbital period · longer orbit →
          </div>

          <div
            ref={scatterLeftLabelRef}
            className='pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap font-input text-[9px] text-white/[0.35] opacity-0 origin-left'
          >
            ↑ larger · planet size · smaller ↓
          </div>

          <div
            ref={skyAnnotationRef}
            className='pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 opacity-0'
          >
            <div className='flex items-center gap-2'>
              <span className='relative block h-2 w-2 rounded-full border border-white/45'>
                <span className='absolute left-1/2 top-[-4px] h-[3px] w-px -translate-x-1/2 bg-white/45' />
                <span className='absolute left-1/2 bottom-[-4px] h-[3px] w-px -translate-x-1/2 bg-white/45' />
                <span className='absolute top-1/2 left-[-4px] h-px w-[3px] -translate-y-1/2 bg-white/45' />
                <span className='absolute top-1/2 right-[-4px] h-px w-[3px] -translate-y-1/2 bg-white/45' />
              </span>
              <span className='whitespace-nowrap font-input text-[9px] text-white/45'>Kepler field</span>
            </div>
          </div>

          <div className='pointer-events-none absolute right-3 top-3 bg-black/40 p-2'>
            <div className='flex items-center gap-2 font-input text-[10px] text-white/70'>
              <span className='h-[6px] w-[6px] rounded-full bg-[#0055FF]' />
              <span>Transit</span>
            </div>
            <div className='mt-1 flex items-center gap-2 font-input text-[10px] text-white/70'>
              <span className='h-[6px] w-[6px] rounded-full bg-[#FF0055]' />
              <span>Radial Velocity</span>
            </div>
            <div className='mt-1 flex items-center gap-2 font-input text-[10px] text-white/70'>
              <span className='h-[6px] w-[6px] rounded-full bg-white/60' />
              <span>Other</span>
            </div>
          </div>

          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
              <p className='font-input text-[11px] uppercase tracking-[0.08em] text-white/60'>
                Loading exoplanet data
              </p>
            </div>
          )}

          {error && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/70'>
              <p className='font-input text-[11px] uppercase tracking-[0.08em] text-white/70'>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
