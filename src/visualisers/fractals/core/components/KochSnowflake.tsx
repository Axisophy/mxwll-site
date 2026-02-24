'use client';

import React, { useMemo, useState } from 'react';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import { generateKochSnowflake, kochSnowflakeStats } from '../lib/fractal-math';

export function KochSnowflake() {
  const [iterations, setIterations] = useState(2);

  const { points, stats } = useMemo(() => {
    const pts = generateKochSnowflake(250, 260, 400, iterations);
    const st = kochSnowflakeStats(iterations);
    return { points: pts, stats: st };
  }, [iterations]);

  const pathData = useMemo(() => {
    if (points.length === 0) return '';
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    return d + ' Z';
  }, [points]);

  const sidebar = (
    <div className='space-y-6'>
      <div>
        <label className='block text-sm text-black/60 mb-2'>
          Iterations: {iterations}
        </label>
        <input
          type='range'
          min={0}
          max={6}
          value={iterations}
          onChange={(e) => setIterations(parseInt(e.target.value))}
          className='w-full'
        />
        <div className='flex justify-between text-xs text-black/40 mt-1'>
          <span>0</span>
          <span>6</span>
        </div>
      </div>

      <div className='space-y-4 pt-4 border-t border-black/10'>
        <div>
          <span className='text-xs text-black/40 block mb-1'>Segments</span>
          <span className='text-lg font-bold'>{stats.segments.toLocaleString()}</span>
        </div>
        <div>
          <span className='text-xs text-black/40 block mb-1'>Perimeter growth</span>
          <span className='text-lg font-bold'>{stats.perimeterRatio.toFixed(2)}x</span>
        </div>
        <div>
          <span className='text-xs text-black/40 block mb-1'>Fractal dimension</span>
          <span className='text-lg font-bold'>{stats.dimension}</span>
        </div>
      </div>

      <div className='pt-4 border-t border-black/10'>
        <p className='text-xs text-black/50 leading-relaxed'>
          Each iteration replaces every straight edge with four smaller edges.
          The perimeter grows by 4/3 each time, approaching infinity, while
          the area remains finite.
        </p>
      </div>
    </div>
  );

  return (
    <InteractiveFrame
      layout='sidebar'
      sidebar={sidebar}
      caption='The Koch snowflake has infinite perimeter but finite area. Its fractal dimension of ~1.26 means it fills more space than a line but less than a plane.'
    >
      <div className='bg-white p-4 flex items-center justify-center min-h-[400px]'>
        <svg
          viewBox='0 0 500 500'
          className='w-full h-full max-w-[500px]'
          style={{ maxHeight: '450px' }}
        >
          {/* Background grid */}
          <defs>
            <pattern id='koch-grid' width='25' height='25' patternUnits='userSpaceOnUse'>
              <path d='M 25 0 L 0 0 0 25' fill='none' stroke='#f0f0f0' strokeWidth='0.5' />
            </pattern>
          </defs>
          <rect width='500' height='500' fill='url(#koch-grid)' />

          {/* Koch snowflake */}
          <path
            d={pathData}
            fill='none'
            stroke='#0055FF'
            strokeWidth={iterations > 4 ? 0.5 : iterations > 2 ? 1 : 1.5}
            strokeLinejoin='miter'
          />

        </svg>
      </div>
    </InteractiveFrame>
  );
}
