'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import { HR_EVOLUTION_CONFIG, SPECTRAL_CLASSES } from '../lib/stars-data';
import { ALL_PATHS, EvolutionPath } from '../lib/pathways-data';

const TEMP_TICKS = [40000, 20000, 10000, 5000, 3000];
const LUM_TICKS = [100000, 1000, 10, 1, 0.01, 0.0001];

function formatLum(l: number): string {
  if (l >= 1) return l.toLocaleString();
  if (l === 0.01) return '0.01';
  if (l === 0.0001) return '10\u207B\u2074';
  return String(l);
}

const ENDPOINT_ICONS: Record<string, { color: string; symbol: string }> = {
  white_dwarf: { color: '#666666', symbol: '○' },
  neutron_star: { color: '#9B59B6', symbol: '◉' },
  black_hole: { color: '#000000', symbol: '●' },
};

export function StellarPathways() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [activePaths, setActivePaths] = useState<Set<string>>(
    new Set(['sun_like'])
  );
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

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
    const logLum = Math.log10(Math.max(lum, 0.000001));
    return margin.top + ((logMax - logLum) / (logMax - logMin)) * ph;
  }, [ph, margin.top]);

  const togglePath = useCallback((pathId: string) => {
    setActivePaths(prev => {
      const next = new Set(prev);
      if (next.has(pathId)) next.delete(pathId);
      else next.add(pathId);
      return next;
    });
  }, []);

  const showAll = () => {
    setActivePaths(new Set(ALL_PATHS.map(p => p.id)));
  };

  const pathsWithCoords = useMemo(() => {
    return ALL_PATHS.map(path => ({
      ...path,
      coords: path.points.map(pt => ({
        ...pt,
        x: toX(pt.temperature),
        y: toY(pt.luminosity),
      })),
    }));
  }, [toX, toY]);

  const selectedPathInfo = hoveredPath
    ? ALL_PATHS.find(p => p.id === hoveredPath)
    : activePaths.size === 1
    ? ALL_PATHS.find(p => activePaths.has(p.id))
    : null;

  const sidebar = (
    <div className='space-y-4'>
      {/* Path toggles */}
      <div>
        <h3 className='text-xs text-black/40 uppercase tracking-wider mb-3'>Stellar Mass</h3>
        <div className='space-y-2'>
          {ALL_PATHS.map(path => (
            <button
              key={path.id}
              onClick={() => togglePath(path.id)}
              onMouseEnter={() => setHoveredPath(path.id)}
              onMouseLeave={() => setHoveredPath(null)}
              className={`flex items-center gap-2 text-sm w-full text-left transition-colors ${
                activePaths.has(path.id) ? 'text-black' : 'text-black/30'
              }`}
            >
              <span
                className='w-3 h-0.5 inline-block shrink-0'
                style={{
                  backgroundColor: path.color,
                  opacity: activePaths.has(path.id) ? 1 : 0.3,
                }}
              />
              <span>{path.mass}</span>
              <span className='text-xs text-black/40 ml-auto'>{path.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={showAll}
          className='text-xs text-[var(--color-blue)] hover:text-black transition-colors mt-3'
        >
          Show all paths
        </button>
      </div>

      {/* Selected path info */}
      {selectedPathInfo && (
        <div className='pt-4 border-t border-black/10'>
          <h4 className='font-bold text-sm mb-1'>{selectedPathInfo.name}</h4>
          <span className='text-sm text-black/60 block mb-2'>
            Mass: {selectedPathInfo.mass}
          </span>
          <div className='space-y-2 text-xs text-black/60'>
            <div>
              <span className='text-black/40'>Lifetime:</span>{' '}
              {selectedPathInfo.lifetime}
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-black/40'>End state:</span>
              <span
                className='inline-block'
                style={{ color: ENDPOINT_ICONS[selectedPathInfo.endpoint].color }}
              >
                {ENDPOINT_ICONS[selectedPathInfo.endpoint].symbol}
              </span>
              {selectedPathInfo.endpointLabel}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className='pt-4 border-t border-black/10'>
        <h3 className='text-xs text-black/40 uppercase tracking-wider mb-3'>End States</h3>
        <div className='space-y-2 text-xs'>
          <div className='flex items-center gap-2'>
            <span style={{ color: ENDPOINT_ICONS.white_dwarf.color }}>{ENDPOINT_ICONS.white_dwarf.symbol}</span>
            <span className='text-black/60'>White Dwarf</span>
          </div>
          <div className='flex items-center gap-2'>
            <span style={{ color: ENDPOINT_ICONS.neutron_star.color }}>{ENDPOINT_ICONS.neutron_star.symbol}</span>
            <span className='text-black/60'>Neutron Star</span>
          </div>
          <div className='flex items-center gap-2'>
            <span style={{ color: ENDPOINT_ICONS.black_hole.color }}>{ENDPOINT_ICONS.black_hole.symbol}</span>
            <span className='text-black/60'>Black Hole</span>
          </div>
        </div>
      </div>

      <div className='pt-4 border-t border-black/10'>
        <p className='text-xs text-black/50 leading-relaxed'>
          More massive stars burn brighter but die younger. The most massive stars live only millions of years before exploding as supernovae.
        </p>
      </div>
    </div>
  );

  return (
    <InteractiveFrame
      layout='sidebar'
      sidebar={sidebar}
      caption='Different stellar masses follow different evolutionary paths. Toggle paths to compare how mass determines destiny.'
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

            {/* Evolution paths */}
            {pathsWithCoords.map(path => {
              const isActive = activePaths.has(path.id);
              const isHovered = hoveredPath === path.id;
              const isBlackHole = path.endpoint === 'black_hole';

              // For black holes, exclude the final point (they don't emit light)
              const visibleCoords = isBlackHole
                ? path.coords.slice(0, -1)
                : path.coords;
              const pathD = visibleCoords.map((pt, i) =>
                `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
              ).join(' ');

              // For black hole arrow: start from the last visible point
              const lastVisiblePoint = visibleCoords[visibleCoords.length - 1];

              return (
                <g
                  key={path.id}
                  opacity={isActive || isHovered ? 1 : 0.1}
                  className='transition-opacity duration-200'
                >
                  {/* Path line */}
                  <path
                    d={pathD}
                    fill='none'
                    stroke={path.color}
                    strokeWidth={isHovered ? 3 : 2}
                    strokeOpacity={isActive || isHovered ? 0.7 : 0.2}
                  />

                  {/* Start point */}
                  <circle
                    cx={path.coords[0].x}
                    cy={path.coords[0].y}
                    r={4}
                    fill={path.color}
                    fillOpacity={isActive || isHovered ? 0.8 : 0.2}
                  />

                  {/* End point - different handling for black holes */}
                  {isBlackHole ? (
                    // Black hole: downward arrow indicating collapse
                    <g>
                      <line
                        x1={lastVisiblePoint.x}
                        y1={lastVisiblePoint.y}
                        x2={lastVisiblePoint.x}
                        y2={lastVisiblePoint.y + 40}
                        stroke={ENDPOINT_ICONS.black_hole.color}
                        strokeWidth={2}
                        strokeOpacity={isActive || isHovered ? 0.6 : 0.2}
                        strokeDasharray='4 3'
                      />
                      {/* Arrow head */}
                      <polygon
                        points={`${lastVisiblePoint.x},${lastVisiblePoint.y + 48} ${lastVisiblePoint.x - 5},${lastVisiblePoint.y + 38} ${lastVisiblePoint.x + 5},${lastVisiblePoint.y + 38}`}
                        fill={ENDPOINT_ICONS.black_hole.color}
                        fillOpacity={isActive || isHovered ? 0.6 : 0.2}
                      />
                    </g>
                  ) : (
                    // Normal endpoint circle
                    <circle
                      cx={path.coords[path.coords.length - 1].x}
                      cy={path.coords[path.coords.length - 1].y}
                      r={4}
                      fill={ENDPOINT_ICONS[path.endpoint].color}
                      fillOpacity={isActive || isHovered ? 0.8 : 0.2}
                    />
                  )}

                  {/* Path label at start */}
                  {(isActive || isHovered) && (
                    <text
                      x={path.coords[0].x}
                      y={path.coords[0].y - 10}
                      textAnchor='middle'
                      style={{
                        fontSize: '10px',
                        fontFamily: 'input-mono, monospace',
                        fill: path.color,
                        fontWeight: isHovered ? 700 : 400,
                      }}
                    >
                      {path.mass}
                    </text>
                  )}

                  {/* Endpoint label */}
                  {(isActive || isHovered) && (
                    <text
                      x={isBlackHole ? lastVisiblePoint.x + 8 : path.coords[path.coords.length - 1].x + 8}
                      y={isBlackHole ? lastVisiblePoint.y + 56 : path.coords[path.coords.length - 1].y + 4}
                      style={{
                        fontSize: '9px',
                        fontFamily: 'input-mono, monospace',
                        fill: ENDPOINT_ICONS[path.endpoint].color,
                        opacity: 0.7,
                      }}
                    >
                      {isBlackHole ? 'Collapses to black hole' : path.endpointLabel}
                    </text>
                  )}
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
