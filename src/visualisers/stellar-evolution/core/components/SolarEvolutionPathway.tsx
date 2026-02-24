'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import { HR_EVOLUTION_CONFIG, SPECTRAL_CLASSES } from '../lib/stars-data';
import { SOLAR_EVOLUTION, SOLAR_NOW_INDEX } from '../lib/pathways-data';

const TEMP_TICKS = [40000, 20000, 10000, 5000, 3000];
const LUM_TICKS = [100000, 1000, 10, 1, 0.01, 0.0001];

function formatLum(l: number): string {
  if (l >= 1) return l.toLocaleString();
  if (l === 0.01) return '0.01';
  if (l === 0.0001) return '10\u207B\u2074';
  return String(l);
}

export function SolarEvolutionPathway() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(SOLAR_NOW_INDEX);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animation logic
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let lastTime = 0;
    const interval = 1500; // ms between steps

    const animate = (time: number) => {
      if (time - lastTime > interval) {
        setCurrentIndex(prev => {
          const next = prev + 1;
          if (next >= SOLAR_EVOLUTION.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const { margin } = HR_EVOLUTION_CONFIG;
  const vw = dims?.width ?? 800;
  const vh = dims?.height ?? 500;
  const pw = vw - margin.left - margin.right;
  const ph = vh - margin.top - margin.bottom;

  const toX = useCallback((temp: number) => {
    const logMin = Math.log10(HR_EVOLUTION_CONFIG.tempMin);
    const logMax = Math.log10(HR_EVOLUTION_CONFIG.tempMax);
    const logTemp = Math.log10(temp);
    return margin.left + ((logMax - logTemp) / (logMax - logMin)) * pw;
  }, [pw, margin.left]);

  const toY = useCallback((lum: number) => {
    const logMin = Math.log10(HR_EVOLUTION_CONFIG.lumMin);
    const logMax = Math.log10(HR_EVOLUTION_CONFIG.lumMax);
    const logLum = Math.log10(lum);
    return margin.top + ((logMax - logLum) / (logMax - logMin)) * ph;
  }, [ph, margin.top]);

  const evolutionPoints = useMemo(
    () => SOLAR_EVOLUTION.map(pt => ({
      ...pt,
      x: toX(pt.temperature),
      y: toY(pt.luminosity),
    })),
    [toX, toY]
  );

  // Path up to current point
  const pathD = useMemo(() => {
    const pts = evolutionPoints.slice(0, currentIndex + 1);
    return pts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
  }, [evolutionPoints, currentIndex]);

  // Full path (faint)
  const fullPathD = useMemo(() => {
    return evolutionPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
  }, [evolutionPoints]);

  const currentPoint = evolutionPoints[currentIndex];
  const currentData = SOLAR_EVOLUTION[currentIndex];

  // Size comparison (rough approximation)
  const getSizeRatio = (index: number) => {
    const labels = ['Zero-age main sequence', 'Early main sequence', 'Present Sun', 'Mid main sequence', 'Late main sequence', 'Subgiant', 'Early red giant', 'Red giant branch', 'RGB tip', 'Horizontal branch', 'Early AGB', 'AGB tip', 'Planetary nebula', 'Hot white dwarf', 'Cooling white dwarf', 'Cold white dwarf'];
    const sizes = [0.9, 0.95, 1, 1.1, 1.2, 2, 10, 50, 200, 10, 100, 200, 0.5, 0.01, 0.01, 0.01];
    return sizes[index] || 1;
  };

  const sizeRatio = getSizeRatio(currentIndex);
  const sizeDescription = sizeRatio >= 1
    ? `${sizeRatio.toFixed(sizeRatio < 10 ? 1 : 0)}x current size`
    : `${(sizeRatio * 100).toFixed(0)}% current size`;

  const togglePlay = () => {
    if (currentIndex >= SOLAR_EVOLUTION.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const sidebar = (
    <div className='space-y-4'>
      {/* Controls */}
      <div>
        <button
          onClick={togglePlay}
          className='inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-[var(--color-blue)] transition-colors w-full justify-center'
        >
          {isPlaying ? (
            <>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                <rect x='6' y='4' width='4' height='16' />
                <rect x='14' y='4' width='4' height='16' />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                <polygon points='5,3 19,12 5,21' />
              </svg>
              {currentIndex >= SOLAR_EVOLUTION.length - 1 ? 'Replay' : 'Play'}
            </>
          )}
        </button>
      </div>

      {/* Timeline slider */}
      <div>
        <label className='text-xs text-black/40 uppercase tracking-wider block mb-2'>
          Timeline
        </label>
        <input
          type='range'
          min={0}
          max={SOLAR_EVOLUTION.length - 1}
          value={currentIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentIndex(parseInt(e.target.value));
          }}
          className='w-full'
        />
        <div className='flex justify-between text-xs text-black/40 mt-1'>
          <span>0 Gyr</span>
          <span>15+ Gyr</span>
        </div>
      </div>

      {/* Current phase info */}
      <div className='pt-4 border-t border-black/10'>
        <span className='text-xs text-black/40 uppercase tracking-wider block mb-2'>
          Current Phase
        </span>
        <h4 className='font-bold text-sm mb-1'>{currentData.label}</h4>
        <span className='text-xs font-mono text-black/40 block mb-2'>
          Age: {currentData.age}
        </span>
        {currentData.description && (
          <p className='text-xs text-black/60 leading-relaxed'>
            {currentData.description}
          </p>
        )}
      </div>

      {/* Size indicator */}
      <div className='pt-4 border-t border-black/10'>
        <span className='text-xs text-black/40 uppercase tracking-wider block mb-2'>
          Relative Size
        </span>
        <div className='flex items-center gap-3'>
          <div
            className='bg-[var(--color-blue)] transition-all duration-300'
            style={{
              width: Math.min(Math.max(sizeRatio * 8, 4), 60),
              height: Math.min(Math.max(sizeRatio * 8, 4), 60),
              borderRadius: '50%',
            }}
          />
          <span className='text-sm text-black/60'>{sizeDescription}</span>
        </div>
      </div>
    </div>
  );

  return (
    <InteractiveFrame
      layout='sidebar'
      sidebar={sidebar}
      caption="The Sun's evolutionary path through the HR diagram. Press play to watch 12+ billion years unfold, or drag the slider to explore different phases."
    >
      <div ref={containerRef} className='bg-white min-h-[400px] md:min-h-[500px]'>
        {dims && (
          <svg
            viewBox={`0 0 ${vw} ${vh}`}
            className='w-full h-full'
            style={{ minHeight: '400px' }}
          >
            {/* Background */}
            <rect width={vw} height={vh} fill='white' />

            {/* Grid lines */}
            {TEMP_TICKS.map(t => {
              const x = toX(t);
              return (
                <line
                  key={`gt-${t}`}
                  x1={x} y1={margin.top}
                  x2={x} y2={vh - margin.bottom}
                  stroke='black' strokeOpacity={0.05} strokeWidth={1}
                />
              );
            })}
            {LUM_TICKS.map(l => {
              const y = toY(l);
              return (
                <line
                  key={`gl-${l}`}
                  x1={margin.left} y1={y}
                  x2={vw - margin.right} y2={y}
                  stroke='black' strokeOpacity={0.05} strokeWidth={1}
                />
              );
            })}

            {/* Full path (faint preview) */}
            <path
              d={fullPathD}
              fill='none'
              stroke='black'
              strokeOpacity={0.08}
              strokeWidth={1}
              strokeDasharray='4 4'
            />

            {/* Travelled path */}
            <path
              d={pathD}
              fill='none'
              stroke='#0055FF'
              strokeOpacity={0.6}
              strokeWidth={2}
            />

            {/* All points (faint) */}
            {evolutionPoints.map((pt, i) => (
              <circle
                key={`pt-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={i === SOLAR_NOW_INDEX ? 4 : 2}
                fill={i <= currentIndex ? '#0055FF' : 'black'}
                fillOpacity={i <= currentIndex ? (i === SOLAR_NOW_INDEX ? 0.8 : 0.4) : 0.1}
              />
            ))}

            {/* Current position marker */}
            <g>
              <circle
                cx={currentPoint.x}
                cy={currentPoint.y}
                r={12}
                fill='#0055FF'
                fillOpacity={0.15}
              />
              <circle
                cx={currentPoint.x}
                cy={currentPoint.y}
                r={6}
                fill='#0055FF'
              />
            </g>

            {/* "Now" marker if visible */}
            {currentIndex !== SOLAR_NOW_INDEX && (
              <g>
                <circle
                  cx={evolutionPoints[SOLAR_NOW_INDEX].x}
                  cy={evolutionPoints[SOLAR_NOW_INDEX].y}
                  r={3}
                  fill='#0055FF'
                  fillOpacity={0.5}
                />
                <text
                  x={evolutionPoints[SOLAR_NOW_INDEX].x + 8}
                  y={evolutionPoints[SOLAR_NOW_INDEX].y + 4}
                  style={{ fontSize: '9px', fontFamily: 'input-mono, monospace', fill: 'rgba(0,85,255,0.5)' }}
                >
                  Now
                </text>
              </g>
            )}

            {/* Current label */}
            <text
              x={currentPoint.x}
              y={currentPoint.y - 18}
              textAnchor='middle'
              style={{ fontSize: '11px', fontFamily: 'neue-haas-grotesk-text, sans-serif', fontWeight: 700, fill: '#0055FF' }}
            >
              {currentData.label}
            </text>

            {/* Axes */}
            <line
              x1={margin.left} y1={margin.top}
              x2={margin.left} y2={vh - margin.bottom}
              stroke='black' strokeOpacity={0.2} strokeWidth={1}
            />
            <line
              x1={margin.left} y1={vh - margin.bottom}
              x2={vw - margin.right} y2={vh - margin.bottom}
              stroke='black' strokeOpacity={0.2} strokeWidth={1}
            />

            {/* Temperature ticks + labels */}
            {TEMP_TICKS.map(t => {
              const x = toX(t);
              return (
                <g key={`tt-${t}`}>
                  <line
                    x1={x} y1={vh - margin.bottom}
                    x2={x} y2={vh - margin.bottom + 5}
                    stroke='black' strokeOpacity={0.3} strokeWidth={1}
                  />
                  <text
                    x={x} y={vh - margin.bottom + 18}
                    textAnchor='middle'
                    style={{ fontSize: '10px', fontFamily: 'input-mono, monospace', fill: 'rgba(0,0,0,0.35)' }}
                  >
                    {t.toLocaleString()}
                  </text>
                </g>
              );
            })}
            <text
              x={margin.left + pw / 2}
              y={vh - 4}
              textAnchor='middle'
              style={{ fontSize: '10px', fontFamily: 'input-mono, monospace', fill: 'rgba(0,0,0,0.3)' }}
            >
              Surface Temperature (K)
            </text>

            {/* Luminosity ticks + labels */}
            {LUM_TICKS.map(l => {
              const y = toY(l);
              return (
                <g key={`lt-${l}`}>
                  <line
                    x1={margin.left - 5} y1={y}
                    x2={margin.left} y2={y}
                    stroke='black' strokeOpacity={0.3} strokeWidth={1}
                  />
                  <text
                    x={margin.left - 8} y={y + 3}
                    textAnchor='end'
                    style={{ fontSize: '10px', fontFamily: 'input-mono, monospace', fill: 'rgba(0,0,0,0.35)' }}
                  >
                    {formatLum(l)}
                  </text>
                </g>
              );
            })}
            <text
              x={14}
              y={margin.top + ph / 2}
              textAnchor='middle'
              transform={`rotate(-90, 14, ${margin.top + ph / 2})`}
              style={{ fontSize: '10px', fontFamily: 'input-mono, monospace', fill: 'rgba(0,0,0,0.3)' }}
            >
              {'Luminosity (L☉)'}
            </text>

            {/* Spectral class labels */}
            {SPECTRAL_CLASSES.map(sc => {
              const x = toX(sc.temp);
              if (x < margin.left || x > vw - margin.right) return null;
              return (
                <text
                  key={sc.label}
                  x={x}
                  y={margin.top - 10}
                  textAnchor='middle'
                  style={{ fontSize: '11px', fontFamily: 'neue-haas-grotesk-display, sans-serif', fontWeight: 700, fill: 'rgba(0,0,0,0.2)' }}
                >
                  {sc.label}
                </text>
              );
            })}
          </svg>
        )}
      </div>
    </InteractiveFrame>
  );
}
