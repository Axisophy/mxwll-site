'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  EARTH, MOON, hohmannTransfer, getTransferState,
  formatTime, formatVelocity, formatDistance
} from '../lib/physics';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import {
  Button, Slider, Toggle, ReadoutGrid, ControlGroup
} from '@/components/Controls';

export function TransferAnimation() {
  const [timeProgress, setTimeProgress] = useState(0);  // 0 to 1
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNaivePath, setShowNaivePath] = useState(false);

  // Mission parameters
  const LEO_ALTITUDE = 400;
  const r1 = EARTH.radius + LEO_ALTITUDE;
  const r2 = MOON.orbitRadius!;

  const transfer = useMemo(() => hohmannTransfer(r1, r2, EARTH.mu), [r1, r2]);

  // Animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeProgress(prev => {
        if (prev >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return prev + 0.002;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Spacecraft state
  const spacecraft = useMemo(() => {
    const t = timeProgress * transfer.transferTime;
    const state = getTransferState(transfer, t, EARTH.mu);

    // Calculate distance to Moon (simplified - Moon at fixed position)
    const moonX = -MOON.orbitRadius!;
    const moonY = 0;
    const distanceToMoon = Math.sqrt(
      Math.pow(state.x - moonX, 2) + Math.pow(state.y - moonY, 2)
    );

    return {
      ...state,
      distanceToMoon,
      altitude: state.r - EARTH.radius,
    };
  }, [timeProgress, transfer]);

  // Visualization scale
  const scale = 280 / MOON.orbitRadius!;
  const width = 650;
  const height = 500;
  const cx = width / 2 + 50;
  const cy = height / 2;

  const earthR = Math.max(EARTH.radius * scale, 12);
  const moonR = Math.max(MOON.radius * scale, 6);
  const moonOrbitR = MOON.orbitRadius! * scale;

  const sidebarContent = (
    <>
      <ControlGroup title='Playback'>
        <div className='flex gap-2'>
          <Button
            variant='primary'
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            variant='secondary'
            onClick={() => { setTimeProgress(0); setIsPlaying(false); }}
          >
            Reset
          </Button>
        </div>
        <Slider
          label='Time'
          value={timeProgress}
          onChange={setTimeProgress}
          min={0}
          max={1}
          step={0.001}
          formatValue={(v) => `${Math.round(v * 100)}%`}
        />
      </ControlGroup>

      <ControlGroup title='Display'>
        <Toggle
          label='Show naive path'
          checked={showNaivePath}
          onChange={setShowNaivePath}
          description='Compare with straight-line trajectory'
        />
      </ControlGroup>

      <ControlGroup title='Telemetry'>
        <ReadoutGrid
          columns={2}
          size='sm'
          items={[
            { label: 'Velocity', value: formatVelocity(spacecraft.v) },
            { label: 'Altitude', value: formatDistance(spacecraft.altitude) },
            { label: 'Distance to Moon', value: formatDistance(spacecraft.distanceToMoon) },
            { label: 'Mission Time', value: `T+${formatTime(timeProgress * transfer.transferTime)}` },
          ]}
        />
      </ControlGroup>
    </>
  );

  return (
    <InteractiveFrame layout='sidebar' sidebar={sidebarContent}>
      <svg viewBox={`0 0 ${width} ${height}`} className='w-full h-auto bg-[#0a0a0a]'>
        {/* Moon&apos;s orbit */}
        <circle
          cx={cx}
          cy={cy}
          r={moonOrbitR}
          fill='none'
          stroke='#222'
          strokeWidth={1}
          strokeDasharray='4,4'
        />

        {/* LEO orbit */}
        <circle
          cx={cx}
          cy={cy}
          r={r1 * scale}
          fill='none'
          stroke='#4A90D9'
          strokeWidth={1}
          opacity={0.5}
        />

        {/* Naive straight path (optional) */}
        {showNaivePath && (
          <line
            x1={cx + r1 * scale}
            y1={cy}
            x2={cx - moonOrbitR}
            y2={cy}
            stroke='#FF0055'
            strokeWidth={1}
            strokeDasharray='4,4'
            opacity={0.5}
          />
        )}

        {/* Transfer trajectory (drawn portion) */}
        <path
          d={(() => {
            const points: string[] = [];
            const steps = 100;
            for (let i = 0; i <= steps; i++) {
              const frac = i / steps;
              const t = frac * transfer.transferTime;
              const state = getTransferState(transfer, t, EARTH.mu);
              const x = cx + state.x * scale;
              const y = cy - state.y * scale;
              points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
            }
            return points.join(' ');
          })()}
          fill='none'
          stroke='#FF6B35'
          strokeWidth={2}
          opacity={0.3}
        />

        {/* Traveled portion */}
        <path
          d={(() => {
            const points: string[] = [];
            const steps = Math.floor(timeProgress * 100);
            for (let i = 0; i <= steps; i++) {
              const frac = i / 100;
              const t = frac * transfer.transferTime;
              const state = getTransferState(transfer, t, EARTH.mu);
              const x = cx + state.x * scale;
              const y = cy - state.y * scale;
              points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
            }
            return points.join(' ');
          })()}
          fill='none'
          stroke='#FF6B35'
          strokeWidth={2}
        />

        {/* Earth */}
        <circle cx={cx} cy={cy} r={earthR} fill='#4A90D9' />

        {/* Moon */}
        <circle cx={cx - moonOrbitR} cy={cy} r={moonR} fill='#C4C4C4' />

        {/* Spacecraft */}
        <g transform={`translate(${cx + spacecraft.x * scale}, ${cy - spacecraft.y * scale})`}>
          <circle r={5} fill='#FFD700' />
          <circle r={8} fill='none' stroke='#FFD700' strokeWidth={1} opacity={0.5} />
        </g>

        {/* Distance line to Moon */}
        <line
          x1={cx + spacecraft.x * scale}
          y1={cy - spacecraft.y * scale}
          x2={cx - moonOrbitR}
          y2={cy}
          stroke='#666'
          strokeWidth={0.5}
          strokeDasharray='2,2'
        />

        {/* TLI marker */}
        <g transform={`translate(${cx + r1 * scale + 5}, ${cy - 15})`}>
          <text fill='#FF6B35' fontSize='9' fontFamily='monospace'>TLI</text>
        </g>

        {/* LOI marker */}
        <g transform={`translate(${cx - moonOrbitR + 15}, ${cy - 15})`}>
          <text fill='#00D4AA' fontSize='9' fontFamily='monospace'>LOI</text>
        </g>
      </svg>
    </InteractiveFrame>
  );
}
