'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import { FAMOUS_STARS, CATEGORY_CONFIG, HR_CONFIG, SPECTRAL_CLASSES, Star, StarCategory } from '../lib/stars-data';

const TEMP_TICKS = [40000, 20000, 10000, 5000, 3000];
const LUM_TICKS = [100000, 1000, 10, 1, 0.01, 0.0001];

function formatLum(l: number): string {
  if (l >= 1) return l.toLocaleString();
  if (l === 0.01) return '0.01';
  if (l === 0.0001) return '10\u207B\u2074';
  return String(l);
}

export function FamousStarsExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<StarCategory>>(
    new Set<StarCategory>(['main_sequence', 'giant', 'supergiant', 'white_dwarf'])
  );
  const [selected, setSelected] = useState<Star | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

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

  const toX = useCallback((temp: number) => {
    const logMin = Math.log10(HR_CONFIG.tempMin);
    const logMax = Math.log10(HR_CONFIG.tempMax);
    const logTemp = Math.log10(temp);
    return margin.left + ((logMax - logTemp) / (logMax - logMin)) * pw;
  }, [pw, margin.left]);

  const toY = useCallback((lum: number) => {
    const logMin = Math.log10(HR_CONFIG.lumMin);
    const logMax = Math.log10(HR_CONFIG.lumMax);
    const logLum = Math.log10(lum);
    return margin.top + ((logMax - logLum) / (logMax - logMin)) * ph;
  }, [ph, margin.top]);

  const toggleCategory = useCallback((cat: StarCategory) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const visibleStars = useMemo(
    () => FAMOUS_STARS.filter(s => activeCategories.has(s.type)),
    [activeCategories]
  );

  const sidebar = (
    <div className='space-y-4'>
      {/* Category toggles */}
      <div>
        <h3 className='text-xs text-black/40 uppercase tracking-wider mb-3'>Categories</h3>
        <div className='space-y-2'>
          {(Object.entries(CATEGORY_CONFIG) as [StarCategory, typeof CATEGORY_CONFIG[StarCategory]][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className={`flex items-center gap-2 text-sm w-full text-left transition-colors ${
                activeCategories.has(key) ? 'text-black' : 'text-black/30'
              }`}
            >
              <span
                className='w-3 h-3 inline-block shrink-0'
                style={{
                  backgroundColor: config.color,
                  opacity: activeCategories.has(key) ? 1 : 0.3,
                }}
              />
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected star info */}
      {selected ? (
        <div className='pt-4 border-t border-black/10'>
          <div className='flex items-center gap-2 mb-2'>
            <span
              className='w-3 h-3 inline-block shrink-0'
              style={{ backgroundColor: CATEGORY_CONFIG[selected.type].color }}
            />
            <span className='font-bold text-sm'>{selected.name}</span>
          </div>
          <span className='text-xs font-mono text-black/40 block mb-2'>{selected.spectralType}</span>
          <p className='text-xs text-black/60 leading-relaxed mb-3'>
            {selected.facts}
          </p>
          <div className='space-y-1 text-xs font-mono text-black/40'>
            <div>T = {selected.temperature.toLocaleString()} K</div>
            <div>L = {selected.luminosity.toLocaleString()} L☉</div>
            {selected.distance && <div>Distance: {selected.distance}</div>}
            {selected.constellation && <div>Constellation: {selected.constellation}</div>}
          </div>
        </div>
      ) : (
        <div className='pt-4 border-t border-black/10'>
          <p className='text-xs text-black/50 leading-relaxed'>
            Click any star to see its details. Try finding the Sun, Betelgeuse, or Sirius.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <InteractiveFrame
      layout='sidebar'
      sidebar={sidebar}
      caption='Famous stars plotted on the HR diagram. Click any star for details. Toggle categories to isolate different stellar types.'
    >
      <div ref={containerRef} className='bg-white min-h-[400px] md:min-h-[500px]'>
        {dims && (
          <svg
            viewBox={`0 0 ${vw} ${vh}`}
            className='w-full h-full'
            style={{ minHeight: '400px' }}
            onClick={() => setSelected(null)}
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

            {/* Region labels (faint) */}
            <text
              x={toX(5500)}
              y={toY(0.3)}
              textAnchor='middle'
              transform={`rotate(-50, ${toX(5500)}, ${toY(0.3)})`}
              style={{ fontSize: '16px', fontFamily: 'neue-haas-grotesk-display, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}
              fill='black'
              fillOpacity={0.04}
            >
              MAIN SEQUENCE
            </text>
            <text
              x={toX(3800)}
              y={toY(200)}
              textAnchor='middle'
              style={{ fontSize: '12px', fontFamily: 'neue-haas-grotesk-display, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}
              fill='black'
              fillOpacity={0.04}
            >
              GIANTS
            </text>
            <text
              x={toX(6000)}
              y={toY(80000)}
              textAnchor='middle'
              style={{ fontSize: '12px', fontFamily: 'neue-haas-grotesk-display, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}
              fill='black'
              fillOpacity={0.04}
            >
              SUPERGIANTS
            </text>
            <text
              x={toX(15000)}
              y={toY(0.005)}
              textAnchor='middle'
              style={{ fontSize: '10px', fontFamily: 'neue-haas-grotesk-display, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}
              fill='black'
              fillOpacity={0.04}
            >
              WHITE DWARFS
            </text>

            {/* Stars */}
            {visibleStars.map(star => {
              const cx = toX(star.temperature);
              const cy = toY(star.luminosity);
              const config = CATEGORY_CONFIG[star.type];
              const isHovered = hovered === star.name;
              const isSelected = selected?.name === star.name;
              const baseRadius = config.radius;
              const r = baseRadius + (isHovered ? 2 : 0) + (isSelected ? 3 : 0);

              // Label positioning
              const labelOffset = baseRadius + 6;
              const labelX = star.name === 'Betelgeuse' || star.name === 'Antares' || star.name === 'Arcturus' || star.name === 'Aldebaran' || star.name === 'Proxima Centauri' || star.name === "Barnard's Star" || star.name === 'Alpha Centauri A'
                ? cx - labelOffset
                : cx + labelOffset;
              const labelAnchor = labelX < cx ? 'end' : 'start';

              return (
                <g
                  key={star.name}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(star.name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(prev => prev?.name === star.name ? null : star);
                  }}
                >
                  {/* Selection ring */}
                  {isSelected && (
                    <circle
                      cx={cx} cy={cy}
                      r={r + 4}
                      fill='none'
                      stroke={config.color}
                      strokeOpacity={0.3}
                      strokeWidth={2}
                    />
                  )}
                  {/* Star dot */}
                  <circle
                    cx={cx} cy={cy}
                    r={r}
                    fill={config.color}
                    className='transition-all duration-150'
                  />
                  {/* Label */}
                  <text
                    x={labelX}
                    y={cy + 4}
                    textAnchor={labelAnchor}
                    style={{
                      fontSize: '10px',
                      fontFamily: 'neue-haas-grotesk-text, sans-serif',
                      fill: isSelected || isHovered ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.4)',
                    }}
                    className='transition-all duration-150'
                  >
                    {star.name}
                  </text>
                </g>
              );
            })}

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
