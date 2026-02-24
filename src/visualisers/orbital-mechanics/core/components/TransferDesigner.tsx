'use client';

import React, { useState, useMemo } from 'react';
import {
  hohmannTransfer, biellipticTransfer,
  formatTime, formatVelocity, formatDistance,
  EARTH, SUN
} from '../lib/physics';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import {
  Button,
  Slider,
  Select,
  Toggle,
  ReadoutGrid,
  ControlGroup,
} from '@/components/Controls';

type CentralBody = 'earth' | 'sun';

const PRESETS = {
  'leo-geo': { name: 'LEO \u2192 GEO', r1: 6771, r2: 42164, body: 'earth' as CentralBody },
  'leo-moon': { name: 'LEO \u2192 Moon', r1: 6771, r2: 384400, body: 'earth' as CentralBody },
  'earth-mars': { name: 'Earth \u2192 Mars', r1: 149598023, r2: 227939366, body: 'sun' as CentralBody },
  'earth-jupiter': { name: 'Earth \u2192 Jupiter', r1: 149598023, r2: 778479000, body: 'sun' as CentralBody },
};

export function TransferDesigner() {
  const [r1, setR1] = useState(6771);  // km (LEO)
  const [r2, setR2] = useState(42164); // km (GEO)
  const [centralBody, setCentralBody] = useState<CentralBody>('earth');
  const [showBielliptic, setShowBielliptic] = useState(false);

  const mu = centralBody === 'earth' ? EARTH.mu : SUN.mu;
  const bodyRadius = centralBody === 'earth' ? EARTH.radius : SUN.radius;

  // Calculate transfers
  const hohmann = useMemo(() => hohmannTransfer(r1, r2, mu), [r1, r2, mu]);

  const bielliptic = useMemo(() => {
    const rInt = r2 * 1.5;
    return biellipticTransfer(r1, r2, rInt, mu);
  }, [r1, r2, mu]);

  const ratio = r2 / r1;
  const biellipticBetter = ratio > 11.94;

  // Apply preset
  const applyPreset = (key: keyof typeof PRESETS) => {
    const preset = PRESETS[key];
    setR1(preset.r1);
    setR2(preset.r2);
    setCentralBody(preset.body);
  };

  // Visualization
  const scale = 180 / Math.max(r1, r2);
  const viewSize = 400;
  const vcx = viewSize / 2;
  const vcy = viewSize / 2;

  const sidebarContent = (
    <div className='space-y-4'>
      {/* Presets */}
      <ControlGroup title='Presets'>
        <div className='flex flex-wrap gap-2'>
          {Object.entries(PRESETS).map(([key, preset]) => (
            <Button
              key={key}
              variant='secondary'
              size='sm'
              onClick={() => applyPreset(key as keyof typeof PRESETS)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </ControlGroup>

      {/* Orbits */}
      <ControlGroup title='Orbits'>
        <Slider
          label='Departure orbit'
          value={r1}
          onChange={setR1}
          min={bodyRadius + 200}
          max={centralBody === 'earth' ? 100000 : 300000000}
          step={centralBody === 'earth' ? 100 : 1000000}
          formatValue={(v) => `${formatDistance(v)} (${formatDistance(v - bodyRadius)} alt)`}
        />
        <Slider
          label='Arrival orbit'
          value={r2}
          onChange={setR2}
          min={r1 * 1.1}
          max={centralBody === 'earth' ? 500000 : 800000000}
          step={centralBody === 'earth' ? 1000 : 10000000}
          formatValue={(v) => formatDistance(v)}
        />
      </ControlGroup>

      {/* Central body */}
      <Select
        label='Central body'
        value={centralBody}
        onChange={setCentralBody}
        options={[
          { value: 'earth', label: 'Earth' },
          { value: 'sun', label: 'Sun' },
        ]}
      />

      {/* Bi-elliptic toggle */}
      <Toggle
        label='Compare bi-elliptic transfer'
        checked={showBielliptic}
        onChange={setShowBielliptic}
        description={biellipticBetter ? 'More efficient for this orbit ratio' : undefined}
      />
    </div>
  );

  return (
    <div className='space-y-8'>
      <InteractiveFrame layout='sidebar' sidebar={sidebarContent}>
        {/* SVG visualization */}
        <div className='bg-[#0a0a0a] aspect-square'>
          <svg viewBox={`0 0 ${viewSize} ${viewSize}`} className='w-full h-full'>
            {/* Departure orbit */}
            <circle
              cx={vcx}
              cy={vcy}
              r={r1 * scale}
              fill='none'
              stroke='#4A90D9'
              strokeWidth={1.5}
            />

            {/* Arrival orbit */}
            <circle
              cx={vcx}
              cy={vcy}
              r={r2 * scale}
              fill='none'
              stroke='#00D4AA'
              strokeWidth={1.5}
            />

            {/* Hohmann transfer ellipse */}
            <ellipse
              cx={vcx + (r2 - hohmann.transferOrbit.semiMajorAxis) * scale}
              cy={vcy}
              rx={hohmann.transferOrbit.semiMajorAxis * scale}
              ry={hohmann.transferOrbit.semiMajorAxis * Math.sqrt(1 - hohmann.transferOrbit.eccentricity ** 2) * scale}
              fill='none'
              stroke='#FF6B35'
              strokeWidth={2}
              transform={`rotate(180, ${vcx}, ${vcy})`}
              opacity={0.8}
            />

            {/* Bi-elliptic (if shown) */}
            {showBielliptic && (
              <ellipse
                cx={vcx + (bielliptic.transferOrbit.apoapsis - bielliptic.transferOrbit.semiMajorAxis) * scale}
                cy={vcy}
                rx={bielliptic.transferOrbit.semiMajorAxis * scale}
                ry={bielliptic.transferOrbit.semiMajorAxis * Math.sqrt(1 - bielliptic.transferOrbit.eccentricity ** 2) * scale}
                fill='none'
                stroke='#FF0055'
                strokeWidth={1.5}
                strokeDasharray='4,2'
                transform={`rotate(180, ${vcx}, ${vcy})`}
                opacity={0.6}
              />
            )}

            {/* Central body */}
            <circle cx={vcx} cy={vcy} r={Math.max(bodyRadius * scale, 4)} fill='#FDB813' />
          </svg>
        </div>
      </InteractiveFrame>

      {/* Results */}
      <div className='grid md:grid-cols-2 gap-4'>
        <div className='border border-black/10 p-4 bg-black/5'>
          <h3 className='font-bold text-sm mb-4'>Hohmann Transfer</h3>
          <ReadoutGrid
            columns={2}
            size='sm'
            items={[
              { label: `Departure \u0394v`, value: formatVelocity(hohmann.deltaV1) },
              { label: `Arrival \u0394v`, value: formatVelocity(hohmann.deltaV2) },
              { label: `Total \u0394v`, value: formatVelocity(hohmann.totalDeltaV) },
              { label: 'Transfer time', value: formatTime(hohmann.transferTime) },
            ]}
          />
        </div>

        {showBielliptic && (
          <div className={`border p-4 ${biellipticBetter ? 'border-[var(--color-lime)] bg-[var(--color-lime)]' : 'border-black/10 bg-black/5'}`}>
            <h3 className='font-bold text-sm mb-4'>
              Bi-elliptic Transfer
              {biellipticBetter && <span className='text-black text-xs ml-2'>RECOMMENDED</span>}
            </h3>
            <ReadoutGrid
              columns={2}
              size='sm'
              items={[
                { label: `Burn 1 \u0394v`, value: formatVelocity(bielliptic.deltaV1) },
                { label: `Burn 2 \u0394v`, value: formatVelocity(bielliptic.deltaV2) },
                { label: `Burn 3 \u0394v`, value: formatVelocity(bielliptic.deltaV3) },
                { label: `Total \u0394v`, value: formatVelocity(bielliptic.totalDeltaV) },
              ]}
            />
            <div className='mt-2 text-xs text-black/50'>
              Transfer time: {formatTime(bielliptic.transferTime)}
            </div>
          </div>
        )}
      </div>

      <div className='text-xs text-black/50'>
        Orbit ratio: {ratio.toFixed(1)}:1.
        {ratio > 11.94
          ? ' Bi-elliptic transfer requires less \u0394v than Hohmann (at the cost of longer travel time).'
          : ' Hohmann transfer is optimal for this ratio.'}
      </div>
    </div>
  );
}
