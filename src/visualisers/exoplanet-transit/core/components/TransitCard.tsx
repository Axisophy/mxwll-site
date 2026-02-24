'use client';

import { useEffect, useRef } from 'react';
import { Exoplanet, getFacilityColour, getPlanetType } from '../lib/types';
import { generateTransitCurve } from '../lib/transit';

interface TransitCardProps {
  planet: Exoplanet;
  onClick: () => void;
  isHighlighted: boolean;
}

export default function TransitCard({ planet, onClick, isHighlighted }: TransitCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const depth = planet.pl_trandep ?? 0.1;
  const depthFrac = depth / 100; // Convert from % to fraction
  const duration = planet.pl_trandur && planet.pl_orbper
    ? (planet.pl_trandur / 24) / planet.pl_orbper // hours to days, then fraction of period
    : 0.02; // default

  const facilityColour = getFacilityColour(planet.disc_facility);

  // Draw transit curve on canvas
  useEffect(() => {
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

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Generate curve
    const phaseRange = 0.1;
    const curve = generateTransitCurve(depthFrac, duration, 150, phaseRange);

    // Determine Y scale based on transit depth
    // Deep transits (>0.5%): show full range 0.96-1.005
    // Shallow transits (<0.5%): zoom in 0.998-1.002
    const isDeep = depthFrac > 0.005;
    const yMin = isDeep ? 0.96 : 0.998;
    const yMax = 1.005;
    const yRange = yMax - yMin;

    // Map phase/flux to canvas coordinates
    const toX = (phase: number) => ((phase + phaseRange) / (2 * phaseRange)) * width;
    const toY = (flux: number) => height - ((flux - yMin) / yRange) * height;

    // Draw subtle baseline at flux=1
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, toY(1.0));
    ctx.lineTo(width, toY(1.0));
    ctx.stroke();

    // Draw filled area under curve (the dip)
    const gradient = ctx.createLinearGradient(0, toY(1.0), 0, toY(1.0 - depthFrac));
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, facilityColour + '40');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(toX(curve[0].phase), toY(1.0));
    for (const point of curve) {
      ctx.lineTo(toX(point.phase), toY(point.flux));
    }
    ctx.lineTo(toX(curve[curve.length - 1].phase), toY(1.0));
    ctx.closePath();
    ctx.fill();

    // Draw curve
    ctx.strokeStyle = facilityColour;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < curve.length; i++) {
      const x = toX(curve[i].phase);
      const y = toY(curve[i].flux);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // If shallow transit, add "zoomed" indicator
    if (!isDeep) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '9px monospace';
      ctx.fillText('10×', 4, 12);
    }
  }, [depthFrac, duration, facilityColour]);

  const planetType = getPlanetType(planet.pl_rade);
  const radiusStr = planet.pl_radj && planet.pl_radj > 0.3
    ? `${planet.pl_radj.toFixed(2)} Rj`
    : planet.pl_rade
    ? `${planet.pl_rade.toFixed(2)} Re`
    : '?';

  const periodStr = planet.pl_orbper
    ? planet.pl_orbper < 1
      ? `${(planet.pl_orbper * 24).toFixed(1)}h`
      : planet.pl_orbper < 100
      ? `${planet.pl_orbper.toFixed(1)}d`
      : `${planet.pl_orbper.toFixed(0)}d`
    : '?';

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full text-left p-3 bg-[#0a0a12] border transition-all
        hover:bg-[#0f0f1a] hover:border-white/30
        ${isHighlighted ? 'border-white/50 ring-1 ring-white/20' : 'border-[#1a1a2e]'}
      `}
    >
      {/* Header */}
      <div className='flex justify-between items-start mb-2'>
        <span className='text-sm font-medium text-white/90 truncate flex-1 mr-2'>
          {planet.pl_name}
        </span>
        <span className='text-xs font-mono text-white/50'>
          {depth.toFixed(depth < 0.1 ? 3 : 2)}%
        </span>
      </div>

      {/* Transit curve canvas */}
      <div className='w-full h-16 mb-2'>
        <canvas
          ref={canvasRef}
          className='w-full h-full'
          style={{ display: 'block' }}
        />
      </div>

      {/* Stats row */}
      <div className='flex items-center justify-between text-xs'>
        <span className='text-white/50 font-mono'>
          {radiusStr} · {periodStr}
        </span>
        <div className='flex items-center gap-1'>
          <div
            className='w-2 h-2 rounded-full'
            style={{ backgroundColor: facilityColour }}
            title={planet.disc_facility ?? 'Unknown'}
          />
          <span className='text-white/40 text-[10px]'>
            {planet.disc_facility?.split(' ')[0] ?? ''}
          </span>
        </div>
      </div>

      {/* Planet type badge (for featured planets) */}
      {planet.featured && (
        <div className='absolute top-2 right-2'>
          <div className='w-1.5 h-1.5 rounded-full bg-white/60' title='Featured' />
        </div>
      )}
    </button>
  );
}
