'use client';

import React, { useState } from 'react';
import { ARTEMIS_PHASES, APOLLO_PHASES } from '../lib/missions';
import { ButtonGroup, Button, InfoPanel } from '@/components/Controls';
import { InteractiveFrame } from '@/components/InteractiveFrame';

type Mission = 'artemis' | 'apollo';

const missionOptions = [
  { value: 'artemis' as const, label: 'Artemis (2024+)' },
  { value: 'apollo' as const, label: 'Apollo (1969-72)' },
];

export function MissionStoryboard() {
  const [mission, setMission] = useState<Mission>('artemis');
  const [activePhase, setActivePhase] = useState(0);

  const phases = mission === 'artemis' ? ARTEMIS_PHASES : APOLLO_PHASES;
  const phase = phases[activePhase];

  const handleMissionChange = (value: Mission) => {
    setMission(value);
    setActivePhase(0);
  };

  return (
    <InteractiveFrame
      layout='compact'
      controls={
        <ButtonGroup
          options={missionOptions}
          value={mission}
          onChange={handleMissionChange}
        />
      }
    >
      {/* Phase timeline */}
      <div className='flex items-center gap-1 overflow-x-auto px-4 py-4 border-b border-black/10'>
        {phases.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActivePhase(i)}
            className={`flex-shrink-0 px-4 py-2 text-xs font-mono transition-colors ${
              activePhase === i
                ? 'bg-[var(--color-blue)] text-white'
                : activePhase > i
                  ? 'bg-[var(--color-blue)]/20 text-[var(--color-blue)]'
                  : 'bg-black/5 hover:bg-black/10'
            }`}
          >
            {i + 1}. {p.name}
          </button>
        ))}
      </div>

      {/* Phase detail */}
      <div className='grid md:grid-cols-2 gap-8 p-4'>
        {/* Trajectory visualization */}
        <div className='border border-black/10 bg-[#0a0a0a] aspect-square flex items-center justify-center'>
          <PhaseVisualization phaseIndex={activePhase} mission={mission} />
        </div>

        {/* Phase info */}
        <div className='space-y-4'>
          <div>
            <h3 className='text-xl font-bold'>{phase.name}</h3>
            <div className='text-sm text-black/50 font-mono mt-1'>
              Duration: {phase.duration}
              {phase.deltaV && ` \u2022 \u0394v \u2248 ${phase.deltaV} km/s`}
            </div>
          </div>

          <p className='text-black/70 leading-relaxed'>{phase.description}</p>

          <InfoPanel title='Technical Detail' variant='default'>
            {phase.details}
          </InfoPanel>

          {/* Navigation */}
          <div className='flex gap-2 pt-4'>
            <Button
              variant='secondary'
              onClick={() => setActivePhase(Math.max(0, activePhase - 1))}
              disabled={activePhase === 0}
            >
              Previous
            </Button>
            <Button
              variant='secondary'
              onClick={() => setActivePhase(Math.min(phases.length - 1, activePhase + 1))}
              disabled={activePhase === phases.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </InteractiveFrame>
  );
}

// Simplified trajectory visualization for each phase
function PhaseVisualization({ phaseIndex, mission }: {
  phaseIndex: number;
  mission: Mission;
}) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;

  const earthR = 25;
  const moonOrbitR = 120;
  const moonR = 8;

  // Highlight segment based on phase
  const getPhaseHighlight = () => {
    switch (phaseIndex) {
      case 0: // Launch
        return <circle cx={cx} cy={cy} r={earthR + 10} fill='none' stroke='#FF6B35' strokeWidth={3} />;
      case 1: // TLI
        return (
          <g>
            <circle cx={cx + earthR + 5} cy={cy} r={6} fill='#FF6B35' />
            <line x1={cx + earthR + 10} y1={cy} x2={cx + earthR + 40} y2={cy} stroke='#FF6B35' strokeWidth={3} />
          </g>
        );
      case 2: // Coast
        return (
          <path
            d={`M ${cx + earthR + 5} ${cy} Q ${cx + 60} ${cy - 80} ${cx - moonOrbitR + 20} ${cy}`}
            fill='none'
            stroke='#FF6B35'
            strokeWidth={3}
            strokeDasharray='8,4'
          />
        );
      case 3: // LOI
        return (
          <g>
            <circle cx={cx - moonOrbitR + 10} cy={cy} r={6} fill='#00D4AA' />
            <line x1={cx - moonOrbitR + 15} y1={cy} x2={cx - moonOrbitR - 15} y2={cy} stroke='#00D4AA' strokeWidth={3} />
          </g>
        );
      case 4: // Orbit / NRHO
        return (
          <ellipse
            cx={cx - moonOrbitR}
            cy={cy}
            rx={30}
            ry={50}
            fill='none'
            stroke='#FF6B35'
            strokeWidth={2}
          />
        );
      case 5: // Return
        return (
          <path
            d={`M ${cx - moonOrbitR + 20} ${cy} Q ${cx - 60} ${cy + 80} ${cx + earthR + 5} ${cy}`}
            fill='none'
            stroke='#FF6B35'
            strokeWidth={3}
            strokeDasharray='8,4'
          />
        );
      default:
        return null;
    }
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className='w-full h-full max-w-[300px]'>
      {/* Moon&apos;s orbit */}
      <circle cx={cx} cy={cy} r={moonOrbitR} fill='none' stroke='#333' strokeWidth={1} strokeDasharray='4,4' />

      {/* Transfer trajectory (background) */}
      <path
        d={`M ${cx + earthR + 5} ${cy} Q ${cx + 60} ${cy - 80} ${cx - moonOrbitR + 20} ${cy}`}
        fill='none'
        stroke='#444'
        strokeWidth={1}
      />

      {/* Phase highlight */}
      {getPhaseHighlight()}

      {/* Earth */}
      <circle cx={cx} cy={cy} r={earthR} fill='#4A90D9' />

      {/* Moon */}
      <circle cx={cx - moonOrbitR} cy={cy} r={moonR} fill='#C4C4C4' />

      {/* Labels */}
      <text x={cx} y={cy + earthR + 18} textAnchor='middle' fill='#888' fontSize='10' fontFamily='monospace'>
        Earth
      </text>
      <text x={cx - moonOrbitR} y={cy + moonR + 15} textAnchor='middle' fill='#888' fontSize='10' fontFamily='monospace'>
        Moon
      </text>
    </svg>
  );
}
