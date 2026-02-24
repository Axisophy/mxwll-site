'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import { HR_CONFIG, SPECTRAL_CLASSES } from '../lib/stars-data';

interface Region {
  id: string;
  name: string;
  description: string;
  // Approximate position on diagram (percentage)
  x: number;
  y: number;
  // For hover highlight path
  pathD: string;
}

const REGIONS: Region[] = [
  {
    id: 'main_sequence',
    name: 'Main Sequence',
    description: 'Where stars spend most of their lives, steadily burning hydrogen. Our Sun is here.',
    x: 55,
    y: 55,
    pathD: 'M 15 90 Q 30 70 45 55 Q 60 40 85 10',
  },
  {
    id: 'red_giants',
    name: 'Red Giants',
    description: 'Cool but enormous stars. Bright because of their huge size, not their temperature.',
    x: 78,
    y: 25,
    pathD: 'M 65 15 Q 80 20 88 30 Q 90 40 85 45 Q 75 40 65 35 Q 60 25 65 15',
  },
  {
    id: 'white_dwarfs',
    name: 'White Dwarfs',
    description: 'Hot but tiny stellar corpses. The end state for stars like our Sun.',
    x: 25,
    y: 85,
    pathD: 'M 10 75 Q 20 75 30 80 Q 35 85 30 90 Q 20 92 10 88 Q 8 82 10 75',
  },
  {
    id: 'supergiants',
    name: 'Supergiants',
    description: 'The most luminous stars. Massive stars at the end of their short, brilliant lives.',
    x: 50,
    y: 8,
    pathD: 'M 10 5 Q 50 3 90 8 Q 90 15 85 18 Q 50 12 15 15 Q 10 10 10 5',
  },
];

// Axis tick values
const TEMP_TICKS = [40000, 20000, 10000, 5000, 3000];
const LUM_TICKS = [100000, 1000, 10, 1, 0.01, 0.0001];

function formatLum(l: number): string {
  if (l >= 1) return l.toLocaleString();
  if (l === 0.01) return '0.01';
  if (l === 0.0001) return '10\u207B\u2074';
  return String(l);
}

export function AnnotatedHRDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

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

  const { margin } = HR_CONFIG;
  const vw = dims?.width ?? 800;
  const vh = dims?.height ?? 500;
  const pw = vw - margin.left - margin.right;
  const ph = vh - margin.top - margin.bottom;

  // Log scale transformations
  const toX = useCallback((temp: number) => {
    const logMin = Math.log10(HR_CONFIG.tempMin);
    const logMax = Math.log10(HR_CONFIG.tempMax);
    const logTemp = Math.log10(temp);
    // Reversed: hot (high temp) on left
    return margin.left + ((logMax - logTemp) / (logMax - logMin)) * pw;
  }, [pw, margin.left]);

  const toY = useCallback((lum: number) => {
    const logMin = Math.log10(HR_CONFIG.lumMin);
    const logMax = Math.log10(HR_CONFIG.lumMax);
    const logLum = Math.log10(lum);
    // Bright at top
    return margin.top + ((logMax - logLum) / (logMax - logMin)) * ph;
  }, [ph, margin.top]);

  // Sun position
  const sunX = toX(5778);
  const sunY = toY(1);

  const selectedRegion = REGIONS.find(r => r.id === hoveredRegion);

  const sidebar = (
    <div className='space-y-4'>
      <div>
        <h3 className='text-sm font-bold mb-2'>Regions</h3>
        <div className='space-y-2'>
          {REGIONS.map(region => (
            <button
              key={region.id}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                hoveredRegion === region.id
                  ? 'bg-[var(--color-blue)]/10 text-black'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>

      {selectedRegion && (
        <div className='pt-4 border-t border-black/10'>
          <h4 className='font-bold text-sm mb-1'>{selectedRegion.name}</h4>
          <p className='text-xs text-black/60 leading-relaxed'>
            {selectedRegion.description}
          </p>
        </div>
      )}

      <div className='pt-4 border-t border-black/10'>
        <h4 className='text-xs text-black/40 uppercase tracking-wider mb-2'>How to read it</h4>
        <p className='text-xs text-black/60 leading-relaxed'>
          <strong>Left to right:</strong> Temperature (hot blue stars on left, cool red stars on right)
        </p>
        <p className='text-xs text-black/60 leading-relaxed mt-2'>
          <strong>Bottom to top:</strong> Brightness (dim stars at bottom, luminous stars at top)
        </p>
      </div>
    </div>
  );

  return (
    <InteractiveFrame
      layout='sidebar'
      sidebar={sidebar}
      caption='The Hertzsprung-Russell diagram plots stars by temperature and brightness. Hover over regions to learn what different positions mean.'
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

            {/* Main sequence band (subtle background) */}
            <path
              d={`M ${toX(30000)} ${toY(10000)}
                  Q ${toX(10000)} ${toY(100)} ${toX(6000)} ${toY(1)}
                  Q ${toX(4000)} ${toY(0.1)} ${toX(3000)} ${toY(0.01)}
                  L ${toX(2800)} ${toY(0.001)}
                  Q ${toX(3500)} ${toY(0.005)} ${toX(5500)} ${toY(0.5)}
                  Q ${toX(8000)} ${toY(5)} ${toX(15000)} ${toY(100)}
                  Q ${toX(25000)} ${toY(3000)} ${toX(35000)} ${toY(20000)}
                  Z`}
              fill='#0055FF'
              fillOpacity={hoveredRegion === 'main_sequence' ? 0.15 : 0.05}
              className='transition-all duration-200'
            />

            {/* Red giant region */}
            <ellipse
              cx={toX(4000)}
              cy={toY(500)}
              rx={pw * 0.12}
              ry={ph * 0.18}
              fill='#FF0055'
              fillOpacity={hoveredRegion === 'red_giants' ? 0.15 : 0.05}
              className='transition-all duration-200'
            />

            {/* White dwarf region */}
            <ellipse
              cx={toX(15000)}
              cy={toY(0.01)}
              rx={pw * 0.15}
              ry={ph * 0.08}
              fill='#666666'
              fillOpacity={hoveredRegion === 'white_dwarfs' ? 0.15 : 0.05}
              className='transition-all duration-200'
            />

            {/* Supergiant region */}
            <rect
              x={margin.left}
              y={margin.top}
              width={pw}
              height={ph * 0.12}
              fill='#000000'
              fillOpacity={hoveredRegion === 'supergiants' ? 0.08 : 0.02}
              className='transition-all duration-200'
            />

            {/* Region labels */}
            <text
              x={toX(5500)}
              y={toY(0.3)}
              textAnchor='middle'
              transform={`rotate(-50, ${toX(5500)}, ${toY(0.3)})`}
              style={{ fontSize: '14px', fontFamily: 'neue-haas-grotesk-display, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}
              fill='black'
              fillOpacity={hoveredRegion === 'main_sequence' ? 0.3 : 0.08}
              className='transition-all duration-200'
            >
              MAIN SEQUENCE
            </text>

            <text
              x={toX(3800)}
              y={toY(300)}
              textAnchor='middle'
              style={{ fontSize: '12px', fontFamily: 'neue-haas-grotesk-display, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}
              fill='black'
              fillOpacity={hoveredRegion === 'red_giants' ? 0.4 : 0.1}
              className='transition-all duration-200'
            >
              RED GIANTS
            </text>

            <text
              x={toX(15000)}
              y={toY(0.003)}
              textAnchor='middle'
              style={{ fontSize: '10px', fontFamily: 'neue-haas-grotesk-display, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}
              fill='black'
              fillOpacity={hoveredRegion === 'white_dwarfs' ? 0.4 : 0.1}
              className='transition-all duration-200'
            >
              WHITE DWARFS
            </text>

            <text
              x={vw / 2}
              y={margin.top + 20}
              textAnchor='middle'
              style={{ fontSize: '11px', fontFamily: 'neue-haas-grotesk-display, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}
              fill='black'
              fillOpacity={hoveredRegion === 'supergiants' ? 0.4 : 0.1}
              className='transition-all duration-200'
            >
              SUPERGIANTS
            </text>

            {/* Sun marker */}
            <g>
              <circle
                cx={sunX}
                cy={sunY}
                r={8}
                fill='#0055FF'
                fillOpacity={0.2}
              />
              <circle
                cx={sunX}
                cy={sunY}
                r={5}
                fill='#0055FF'
              />
              <text
                x={sunX + 12}
                y={sunY + 4}
                style={{ fontSize: '11px', fontFamily: 'neue-haas-grotesk-text, sans-serif', fontWeight: 700 }}
                fill='#0055FF'
              >
                Sun
              </text>
            </g>

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
                    {t.toLocaleString()}K
                  </text>
                </g>
              );
            })}

            {/* Temperature axis label */}
            <text
              x={margin.left + pw / 2}
              y={vh - 4}
              textAnchor='middle'
              style={{ fontSize: '10px', fontFamily: 'input-mono, monospace', fill: 'rgba(0,0,0,0.3)' }}
            >
              ← Hotter · Temperature · Cooler →
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

            {/* Luminosity axis label */}
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
                  style={{ fontSize: '11px', fontFamily: 'neue-haas-grotesk-display, sans-serif', fontWeight: 700, fill: 'rgba(0,0,0,0.25)' }}
                >
                  {sc.label}
                </text>
              );
            })}

            {/* Colour gradient indicator */}
            <defs>
              <linearGradient id='tempGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                <stop offset='0%' stopColor='#9bb0ff' />
                <stop offset='25%' stopColor='#cad7ff' />
                <stop offset='50%' stopColor='#fff4e8' />
                <stop offset='75%' stopColor='#ffd2a1' />
                <stop offset='100%' stopColor='#ffaa6e' />
              </linearGradient>
            </defs>
            <rect
              x={margin.left}
              y={vh - margin.bottom + 28}
              width={pw}
              height={4}
              fill='url(#tempGradient)'
              rx={0}
            />
          </svg>
        )}
      </div>
    </InteractiveFrame>
  );
}
