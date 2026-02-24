'use client';

import React, { useState } from 'react';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import { ControlGroup } from '@/components/Controls';

interface Step {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  visual: 'logic' | 'tree' | 'neural';
  properties: { label: string; active: boolean }[];
}

const STEPS: Step[] = [
  {
    id: 'logic',
    title: 'Boolean Logic',
    subtitle: 'Fixed rules, explicit boundaries',
    description: 'Logic gates implement exact functions. AND, OR, NOT combine to create any computable function. The decision boundary is perfectly sharp — a point is either in or out. You write the rules by hand.',
    visual: 'logic',
    properties: [
      { label: 'Explicit rules', active: true },
      { label: 'Learned from data', active: false },
      { label: 'Handles uncertainty', active: false },
    ],
  },
  {
    id: 'tree',
    title: 'Decision Trees',
    subtitle: 'Learned IF/THEN rules',
    description: 'Decision trees learn axis-aligned splits from data. Each node asks "is feature X above a threshold?" The result is a piecewise-constant function — still sharp boundaries, but automatically discovered from examples.',
    visual: 'tree',
    properties: [
      { label: 'Explicit rules', active: true },
      { label: 'Learned from data', active: true },
      { label: 'Handles uncertainty', active: false },
    ],
  },
  {
    id: 'neural',
    title: 'Neural Networks',
    subtitle: 'Smooth, learned compositions',
    description: 'Neural networks compose nonlinear functions (like sigmoids or ReLUs). The decision boundary becomes smooth and can approximate any shape. Points near the boundary have intermediate predictions — the model expresses uncertainty.',
    visual: 'neural',
    properties: [
      { label: 'Explicit rules', active: true },
      { label: 'Learned from data', active: true },
      { label: 'Handles uncertainty', active: true },
    ],
  },
];

export function LogicToMLBridge() {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];

  const sidebarContent = (
    <>
      <ControlGroup title='Progression'>
        <div className='flex flex-col gap-2'>
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(i)}
              className={`p-4 text-left border transition-colors ${
                activeStep === i
                  ? 'border-[var(--color-blue)] bg-[var(--color-blue)]/5'
                  : 'border-black/10 hover:border-black/20'
              }`}
            >
              <div className='text-xs font-mono text-black/40 mb-1'>Step {i + 1}</div>
              <div className='font-bold text-sm'>{s.title}</div>
              <div className='text-xs text-black/50 mt-1'>{s.subtitle}</div>
            </button>
          ))}
        </div>
      </ControlGroup>

      <ControlGroup title={step.title}>
        <p className='text-sm text-black/60 leading-relaxed'>
          {step.description}
        </p>
      </ControlGroup>

      <ControlGroup title='Key properties'>
        <div className='space-y-2'>
          {step.properties.map(prop => (
            <div key={prop.label} className='flex items-center gap-2'>
              <div className={`w-4 h-4 ${prop.active ? 'bg-[var(--color-blue)]' : 'bg-black/10'}`} />
              <span className={`text-sm ${prop.active ? 'text-black' : 'text-black/40'}`}>
                {prop.label}
              </span>
            </div>
          ))}
        </div>
      </ControlGroup>
    </>
  );

  return (
    <InteractiveFrame
      layout='sidebar'
      sidebar={sidebarContent}
      caption='The progression from Boolean logic to neural networks is one of increasing flexibility. Logic gates implement fixed rules. Decision trees learn axis-aligned splits. Neural networks learn smooth, arbitrary boundaries — but the core operation (combining inputs to produce outputs) remains the same.'
    >
      <div className='bg-white p-4 flex items-center justify-center min-h-[300px]'>
        <BoundaryVisualization type={step.visual} />
      </div>
    </InteractiveFrame>
  );
}

function BoundaryVisualization({ type }: { type: 'logic' | 'tree' | 'neural' }) {
  const size = 300;
  const padding = 20;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className='w-full h-full max-w-[400px]'>
      {/* Background grid */}
      <defs>
        <pattern id='grid' width='30' height='30' patternUnits='userSpaceOnUse'>
          <path d='M 30 0 L 0 0 0 30' fill='none' stroke='#eee' strokeWidth='0.5' />
        </pattern>
      </defs>
      <rect x={padding} y={padding} width={size - 2*padding} height={size - 2*padding} fill='url(#grid)' />

      {type === 'logic' && (
        <>
          {/* Sharp XOR regions */}
          <rect x={padding} y={padding} width={(size-2*padding)/2} height={(size-2*padding)/2} fill='var(--color-pink)' opacity={0.3} />
          <rect x={padding + (size-2*padding)/2} y={padding + (size-2*padding)/2} width={(size-2*padding)/2} height={(size-2*padding)/2} fill='var(--color-pink)' opacity={0.3} />
          <rect x={padding + (size-2*padding)/2} y={padding} width={(size-2*padding)/2} height={(size-2*padding)/2} fill='var(--color-blue)' opacity={0.3} />
          <rect x={padding} y={padding + (size-2*padding)/2} width={(size-2*padding)/2} height={(size-2*padding)/2} fill='var(--color-blue)' opacity={0.3} />

          {/* Sharp boundary lines */}
          <line x1={size/2} y1={padding} x2={size/2} y2={size-padding} stroke='#333' strokeWidth={2} />
          <line x1={padding} y1={size/2} x2={size-padding} y2={size/2} stroke='#333' strokeWidth={2} />

          <text x={size/2} y={size - 5} textAnchor='middle' fontSize='10' fill='#666' fontFamily='monospace'>
            XOR: Sharp quadrants
          </text>
        </>
      )}

      {type === 'tree' && (
        <>
          {/* Axis-aligned splits */}
          <rect x={padding} y={padding} width={(size-2*padding)*0.4} height={size-2*padding} fill='var(--color-pink)' opacity={0.3} />
          <rect x={padding + (size-2*padding)*0.4} y={padding} width={(size-2*padding)*0.6} height={(size-2*padding)*0.6} fill='var(--color-blue)' opacity={0.3} />
          <rect x={padding + (size-2*padding)*0.4} y={padding + (size-2*padding)*0.6} width={(size-2*padding)*0.6} height={(size-2*padding)*0.4} fill='var(--color-pink)' opacity={0.3} />

          {/* Split lines */}
          <line x1={padding + (size-2*padding)*0.4} y1={padding} x2={padding + (size-2*padding)*0.4} y2={size-padding} stroke='#333' strokeWidth={2} strokeDasharray='4,2' />
          <line x1={padding + (size-2*padding)*0.4} y1={padding + (size-2*padding)*0.6} x2={size-padding} y2={padding + (size-2*padding)*0.6} stroke='#333' strokeWidth={2} strokeDasharray='4,2' />

          <text x={size/2} y={size - 5} textAnchor='middle' fontSize='10' fill='#666' fontFamily='monospace'>
            Decision tree: Axis-aligned splits
          </text>
        </>
      )}

      {type === 'neural' && (
        <>
          {/* Gradient regions (smooth) */}
          <defs>
            <radialGradient id='neuralGrad1' cx='30%' cy='30%'>
              <stop offset='0%' stopColor='var(--color-blue)' stopOpacity='0.5' />
              <stop offset='100%' stopColor='var(--color-blue)' stopOpacity='0' />
            </radialGradient>
            <radialGradient id='neuralGrad2' cx='70%' cy='70%'>
              <stop offset='0%' stopColor='var(--color-pink)' stopOpacity='0.5' />
              <stop offset='100%' stopColor='var(--color-pink)' stopOpacity='0' />
            </radialGradient>
          </defs>

          <rect x={padding} y={padding} width={size-2*padding} height={size-2*padding} fill='url(#neuralGrad1)' />
          <rect x={padding} y={padding} width={size-2*padding} height={size-2*padding} fill='url(#neuralGrad2)' />

          {/* Smooth boundary */}
          <path
            d={`M ${padding + 20} ${size/2 + 40} Q ${size/2} ${padding + 60}, ${size - padding - 20} ${size/2 - 30}`}
            fill='none'
            stroke='#333'
            strokeWidth={2}
            opacity={0.6}
          />

          <text x={size/2} y={size - 5} textAnchor='middle' fontSize='10' fill='#666' fontFamily='monospace'>
            Neural network: Smooth boundary
          </text>
        </>
      )}

      {/* Axes */}
      <line x1={padding} y1={size-padding} x2={size-padding} y2={size-padding} stroke='#999' />
      <line x1={padding} y1={padding} x2={padding} y2={size-padding} stroke='#999' />
    </svg>
  );
}
