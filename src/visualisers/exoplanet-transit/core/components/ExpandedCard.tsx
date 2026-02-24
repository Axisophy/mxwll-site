'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Exoplanet, getFacilityColour, getPlanetType, isInHabitableZone } from '../lib/types';
import {
  generateAnalyticCurve,
  foldTransits,
  estimateNoise,
} from '../lib/transit';

interface ExpandedCardProps {
  planet: Exoplanet;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Planet description data
const PLANET_DESCRIPTIONS: Record<string, string> = {
  'HD 209458 b': 'The first exoplanet ever detected by the transit method (1999). Nicknamed "Osiris" after the Egyptian god of the underworld, it was also the first to have its atmosphere detected.',
  'Kepler-22 b': 'The first planet found by Kepler in the habitable zone of a Sun-like star. At 2.4 Earth radii, it could be a "water world" or a mini-Neptune.',
  'TRAPPIST-1 e': 'One of seven Earth-sized planets orbiting an ultracool red dwarf. TRAPPIST-1 e sits squarely in the habitable zone and is considered one of the best candidates for habitability.',
  'WASP-12 b': 'An extreme hot Jupiter being tidally destroyed by its star. It completes an orbit in just 26 hours and is so close that the star is literally pulling it apart.',
  '55 Cnc e': 'A "super-Earth" that might be covered in flowing lava. It orbits so close to its star that a year lasts only 18 hours, with surface temperatures reaching 2400°C.',
  'Kepler-16 b': 'The first confirmed circumbinary planet — it orbits two stars, like Tatooine in Star Wars. Both suns would be visible from its surface.',
  'TOI-700 d': 'The first Earth-sized planet in the habitable zone discovered by TESS. Only 100 light-years away, it is a prime target for atmospheric characterisation.',
  'K2-18 b': 'A sub-Neptune where JWST detected hints of dimethyl sulphide, a molecule that on Earth is only produced by living organisms. The biosignature claim remains controversial.',
};

export default function ExpandedCard({
  planet,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: ExpandedCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showRawData, setShowRawData] = useState(false);
  const [numTransits, setNumTransits] = useState(1);

  const depth = (planet.pl_trandep ?? 0.1) / 100;
  const duration = planet.pl_trandur && planet.pl_orbper
    ? (planet.pl_trandur / 24) / planet.pl_orbper
    : 0.02;

  const rprs = planet.pl_ratror ?? Math.sqrt(depth);
  const b = planet.pl_imppar ?? 0.3;
  const aRs = planet.pl_ratdor ?? 10;
  const u1 = planet.ld_u1;
  const u2 = planet.ld_u2;

  const facilityColour = getFacilityColour(planet.disc_facility);
  const noise = estimateNoise(planet.sy_vmag);

  // Draw the light curve
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { left: 50, right: 20, top: 20, bottom: 40 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Clear
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, width, height);

    // Generate curves
    const phaseRange = 0.08;
    const modelCurve = generateAnalyticCurve(rprs, b, aRs, u1, u2, 300, phaseRange);

    // Y scale
    const isDeep = depth > 0.005;
    const yMin = isDeep ? Math.max(0.95, 1 - depth * 1.5) : 0.997;
    const yMax = 1.003;
    const yRange = yMax - yMin;

    // Transform functions
    const toX = (phase: number) => padding.left + ((phase + phaseRange) / (2 * phaseRange)) * plotWidth;
    const toY = (flux: number) => padding.top + (1 - (flux - yMin) / yRange) * plotHeight;

    // Draw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    const yTicks = isDeep ? [0.96, 0.97, 0.98, 0.99, 1.0] : [0.998, 0.999, 1.0, 1.001, 1.002];
    for (const tick of yTicks) {
      if (tick >= yMin && tick <= yMax) {
        ctx.beginPath();
        ctx.moveTo(padding.left, toY(tick));
        ctx.lineTo(width - padding.right, toY(tick));
        ctx.stroke();
      }
    }

    // Baseline at 1.0
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(padding.left, toY(1.0));
    ctx.lineTo(width - padding.right, toY(1.0));
    ctx.stroke();

    // Draw raw data if enabled
    if (showRawData) {
      const rawData = foldTransits(modelCurve, numTransits, noise);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';

      for (const point of rawData) {
        const x = toX(point.phase);
        const y = toY(point.flux);
        if (x >= padding.left && x <= width - padding.right) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw model curve
    ctx.strokeStyle = facilityColour;
    ctx.lineWidth = showRawData ? 3 : 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < modelCurve.length; i++) {
      const x = toX(modelCurve[i].phase);
      const y = toY(modelCurve[i].flux);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (const tick of yTicks) {
      if (tick >= yMin && tick <= yMax) {
        ctx.fillText(tick.toFixed(3), padding.left - 8, toY(tick));
      }
    }

    // X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xTicks = [-0.06, -0.03, 0, 0.03, 0.06];
    for (const tick of xTicks) {
      if (tick >= -phaseRange && tick <= phaseRange) {
        ctx.fillText(tick.toFixed(2), toX(tick), height - padding.bottom + 8);
      }
    }

    // Axis titles
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Orbital Phase', width / 2, height - 8);

    ctx.save();
    ctx.translate(12, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Relative Flux', 0, 0);
    ctx.restore();

    // Transit depth indicator
    ctx.fillStyle = facilityColour;
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`Depth: ${(depth * 100).toFixed(depth < 0.001 ? 4 : 2)}%`, width - padding.right, padding.top);
  }, [depth, duration, rprs, b, aRs, u1, u2, facilityColour, noise, showRawData, numTransits]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrevious) onPrevious();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'r' || e.key === 'R') setShowRawData(prev => !prev);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrevious, onNext, hasPrevious, hasNext]);

  const planetType = getPlanetType(planet.pl_rade);
  const habitable = isInHabitableZone(planet.pl_eqt);
  const description = PLANET_DESCRIPTIONS[planet.pl_name];

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
      <div className='relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a12] border border-[#1a1a2e]'>
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors'
          aria-label='Close'
        >
          <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>

        {/* Navigation arrows */}
        {hasPrevious && (
          <button
            onClick={onPrevious}
            className='absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors'
            aria-label='Previous planet'
          >
            <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className='absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors'
            aria-label='Next planet'
          >
            <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        )}

        {/* Content */}
        <div className='p-6'>
          {/* Header */}
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-white'>{planet.pl_name}</h2>
            <p className='text-white/50 text-sm mt-1'>
              Host star: {planet.hostname} · {planet.sy_dist?.toFixed(1) ?? '?'} parsecs away
            </p>
          </div>

          {/* Light curve canvas */}
          <div className='bg-[#050508] border border-white/10 mb-4'>
            <canvas
              ref={canvasRef}
              className='w-full h-64 md:h-80'
              style={{ display: 'block' }}
            />
          </div>

          {/* Controls */}
          <div className='flex flex-wrap items-center gap-4 mb-6'>
            <button
              onClick={() => setShowRawData(!showRawData)}
              className={`
                px-4 py-2 text-sm font-mono border transition-colors
                ${showRawData
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                }
              `}
            >
              {showRawData ? 'Hide Raw Data' : 'Show Raw Data'} (R)
            </button>

            {showRawData && (
              <div className='flex items-center gap-2'>
                <span className='text-xs text-white/50'>Transits folded:</span>
                <input
                  type='range'
                  min='1'
                  max='50'
                  value={numTransits}
                  onChange={(e) => setNumTransits(parseInt(e.target.value))}
                  className='w-24 h-1 bg-white/20 rounded appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white'
                />
                <span className='text-xs font-mono text-white/70 w-6'>{numTransits}</span>
              </div>
            )}
          </div>

          {/* Planet info grid */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
            <InfoItem
              label='Radius'
              value={planet.pl_rade ? `${planet.pl_rade.toFixed(2)} R⊕` : '—'}
              subvalue={planet.pl_radj ? `${planet.pl_radj.toFixed(2)} Rj` : undefined}
            />
            <InfoItem
              label='Orbital Period'
              value={planet.pl_orbper ? formatPeriod(planet.pl_orbper) : '—'}
            />
            <InfoItem
              label='Transit Depth'
              value={planet.pl_trandep ? `${planet.pl_trandep.toFixed(planet.pl_trandep < 0.1 ? 4 : 3)}%` : '—'}
            />
            <InfoItem
              label='Eq. Temperature'
              value={planet.pl_eqt ? `${planet.pl_eqt.toFixed(0)} K` : '—'}
              highlight={habitable}
            />
            <InfoItem
              label='Mass'
              value={planet.pl_bmasse ? `${planet.pl_bmasse.toFixed(1)} M⊕` : '—'}
            />
            <InfoItem
              label='Discovery'
              value={planet.disc_year?.toString() ?? '—'}
              subvalue={planet.disc_facility?.split(' ')[0]}
            />
            <InfoItem
              label='Type'
              value={planetType}
            />
            <InfoItem
              label='Star Temp'
              value={planet.st_teff ? `${planet.st_teff.toFixed(0)} K` : '—'}
            />
          </div>

          {/* Description if available */}
          {description && (
            <div className='border-l-2 border-white/20 pl-4 mb-6'>
              <p className='text-white/70 text-sm leading-relaxed'>{description}</p>
            </div>
          )}

          {/* Habitable zone badge */}
          {habitable && (
            <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-[#5ECE7B]/20 border border-[#5ECE7B]/40'>
              <div className='w-2 h-2 rounded-full bg-[#5ECE7B]' />
              <span className='text-xs text-[#5ECE7B]'>In the Habitable Zone</span>
            </div>
          )}

          {/* Size comparison */}
          <div className='mt-6 pt-6 border-t border-white/10'>
            <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
              Size Comparison
            </h3>
            <SizeComparison radius={planet.pl_rade} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  subvalue,
  highlight,
}: {
  label: string;
  value: string;
  subvalue?: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-1'>
        {label}
      </span>
      <span className={`text-sm ${highlight ? 'text-[#5ECE7B]' : 'text-white/90'}`}>
        {value}
      </span>
      {subvalue && (
        <span className='text-xs text-white/50 block'>{subvalue}</span>
      )}
    </div>
  );
}

function SizeComparison({ radius }: { radius: number | null }) {
  if (!radius) return null;

  // Scale: 1 R⊕ = 16px
  const earthSize = 16;
  const jupiterSize = earthSize * 11.2;
  const planetSize = Math.min(earthSize * radius, 200);

  return (
    <div className='flex items-end gap-4'>
      {/* Earth */}
      <div className='flex flex-col items-center'>
        <div
          className='rounded-full bg-[#6BA3D6]'
          style={{ width: earthSize, height: earthSize }}
        />
        <span className='text-[10px] text-white/40 mt-1'>Earth</span>
      </div>

      {/* Planet */}
      <div className='flex flex-col items-center'>
        <div
          className='rounded-full'
          style={{
            width: planetSize,
            height: planetSize,
            backgroundColor: radius > 4 ? '#C4956A' : radius > 1.5 ? '#7B9E5E' : '#6BA3D6',
          }}
        />
        <span className='text-[10px] text-white/40 mt-1'>{radius.toFixed(1)} R⊕</span>
      </div>

      {/* Jupiter (if planet is large enough) */}
      {radius > 3 && (
        <div className='flex flex-col items-center'>
          <div
            className='rounded-full bg-[#C4956A]'
            style={{ width: Math.min(jupiterSize, 100), height: Math.min(jupiterSize, 100) }}
          />
          <span className='text-[10px] text-white/40 mt-1'>Jupiter</span>
        </div>
      )}
    </div>
  );
}

function formatPeriod(days: number): string {
  if (days < 1) return `${(days * 24).toFixed(1)} hours`;
  if (days < 100) return `${days.toFixed(2)} days`;
  return `${days.toFixed(0)} days`;
}
