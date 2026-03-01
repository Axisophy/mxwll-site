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

interface DemoPoint {
  discoveryYear: number;
  orbitalPeriod: number;
  radiusEarth: number;
  method: string;
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

const colourForMethod = (method: string) => {
  if (method === 'Transit') {
    return '#0055FF';
  }
  if (method === 'Radial Velocity') {
    return '#FF0055';
  }
  if (method === 'Direct Imaging') {
    return '#CCFF00';
  }
  return 'rgba(255,255,255,0.6)';
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const getSkyPosition = (record: ExoplanetRecord, index: number) => {
  if (typeof record.ra === 'number' && typeof record.dec === 'number') {
    const x = clamp01(record.ra / 360);
    const y = clamp01(1 - (record.dec + 90) / 180);
    return { x, y };
  }

  const x = seededRandom(index + 1);
  const y = seededRandom(index + 10007);
  return { x, y };
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
  const normY = clamp01(normYRaw);

  return { x: clamp01(normX), y: normY };
};

const getYearNorm = (year: number) => clamp01((year - YEAR_MIN) / YEAR_RANGE);

export default function ExoplanetDemo({ className }: ExoplanetDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    return durations.timelineSweep + durations.timelineHold + durations.transitionOne + durations.scatterHold + durations.transitionTwo + durations.skyHold + durations.reset;
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
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const height = window.innerWidth < 768 ? 320 : 500;
      setCanvasSize({ width: Math.max(1, Math.floor(rect.width)), height });
    };

    updateCanvasSize();

    const observer = new ResizeObserver(updateCanvasSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
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
          const discoveryYear = Math.min(YEAR_MAX, Math.max(YEAR_MIN, rawYear));

          return {
            discoveryYear,
            orbitalPeriod: record.pl_orbper ?? PERIOD_MIN,
            radiusEarth: record.pl_rade ?? RADIUS_MIN,
            method: record.discoverymethod ?? 'Other',
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
      } catch (err) {
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

  const timelineSweepDuration = durations.timelineSweep;
  const timelineFlashDuration = Math.max(0.3 * (isMobile ? 0.75 : 1), 0.225);

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
    const startTime = performance.now();

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
          const timelineElapsed = Math.min(elapsed, timelineSweepDuration);
          timelineProgress = clamp01(timelineElapsed / timelineSweepDuration);

          const currentYear = YEAR_MIN + YEAR_RANGE * timelineProgress;

          xNorm = point.skyX;
          yNorm = point.skyY;

          if (elapsed <= timelineSweepDuration) {
            const discoveryNorm = getYearNorm(point.discoveryYear);
            const discoveryTime = discoveryNorm * timelineSweepDuration;
            if (timelineElapsed < discoveryTime) {
              opacity = 0;
            } else {
              opacity = clamp01((timelineElapsed - discoveryTime) / timelineFlashDuration);
            }
          } else {
            opacity = 1;
          }

          const xPx = xNorm * canvasSize.width;
          const yPx = yNorm * timelineSkyHeight;
          drawPoint(xPx, yPx, colourForMethod(point.method), opacity);

          if (point.discoveryYear > currentYear) {
            return;
          }

          return;
        }

        if (elapsed < transitionOneEnd) {
          const t = clamp01((elapsed - timelineEnd) / durations.transitionOne);
          const eased = easeInOutCubic(t);
          xNorm = point.skyX + (point.scatterX - point.skyX) * eased;
          yNorm = point.skyY + (point.scatterY - point.skyY) * eased;
        } else if (elapsed < scatterEnd) {
          xNorm = point.scatterX;
          yNorm = point.scatterY;
        } else if (elapsed < transitionTwoEnd) {
          const t = clamp01((elapsed - scatterEnd) / durations.transitionTwo);
          const eased = easeInOutCubic(t);
          xNorm = point.scatterX + (point.skyX - point.scatterX) * eased;
          yNorm = point.scatterY + (point.skyY - point.scatterY) * eased;
        } else if (elapsed < skyEnd) {
          xNorm = point.skyX;
          yNorm = point.skyY;
        } else {
          const t = clamp01((elapsed - skyEnd) / durations.reset);
          const eased = easeInOutCubic(t);
          xNorm = point.skyX;
          yNorm = point.skyY;
          phaseOpacity = 1 - eased;
        }

        const xPx = xNorm * canvasSize.width;
        const yPx = yNorm * canvasSize.height;
        drawPoint(xPx, yPx, colourForMethod(point.method), opacity * phaseOpacity);
      });

      if (showTimelineAxis) {
        const axisY = canvasSize.height - timelineAxisHeight;
        const lineY = axisY + 12;

        context.globalAlpha = 1;
        context.strokeStyle = 'rgba(255,255,255,0.24)';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, lineY);
        context.lineTo(canvasSize.width, lineY);
        context.stroke();

        const currentYear = YEAR_MIN + YEAR_RANGE * timelineProgress;
        const sweepNorm = getYearNorm(currentYear);
        const sweepX = sweepNorm * canvasSize.width;

        context.strokeStyle = 'rgba(255,255,255,0.65)';
        context.beginPath();
        context.moveTo(sweepX, 0);
        context.lineTo(sweepX, lineY + 6);
        context.stroke();
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
    durations.transitionOne,
    durations.transitionTwo,
    isMobile,
    loopSeconds,
    points,
    scatterEnd,
    skyEnd,
    timelineEnd,
    timelineFlashDuration,
    timelineSkyHeight,
    timelineSweepDuration,
    transitionOneEnd,
    transitionTwoEnd,
  ]);

  const methodLegend = useMemo(() => {
    const methods = new Set(points.map((point) => point.method));
    return Array.from(methods).sort();
  }, [points]);

  return (
    <div ref={containerRef} className={className}>
      <div className='relative w-full' style={{ height: `${isMobile ? 320 : 500}px` }}>
        <canvas
          ref={canvasRef}
          className='block w-full h-full bg-[#050508]'
          aria-label='Exoplanet discovery demo'
        />

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

        <div className='pointer-events-none absolute left-0 right-0 bottom-0 h-10'>
          <div className='relative h-full'>
            {AXIS_YEARS.map((year) => {
              const left = `${getYearNorm(year) * 100}%`;
              return (
                <span
                  key={year}
                  className='absolute bottom-1 -translate-x-1/2 font-input text-[9px] text-white/40'
                  style={{ left }}
                >
                  {year}
                </span>
              );
            })}

            <span
              className='absolute bottom-5 -translate-x-1/2 font-input text-[9px] text-white/60'
              style={{ left: `${getYearNorm(2009) * 100}%` }}
            >
              Kepler -&gt;
            </span>
          </div>
        </div>
      </div>

      <div className='mt-3 flex flex-wrap gap-2'>
        {methodLegend.map((method) => (
          <span
            key={method}
            className='font-input text-[9px] uppercase tracking-[0.08em]'
            style={{ color: colourForMethod(method) }}
          >
            {method}
          </span>
        ))}
      </div>
    </div>
  );
}
