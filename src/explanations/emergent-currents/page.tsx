'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const FlowFieldVisualiser = dynamic(() => import('@/widgets/flow-field-visualiser/FlowFieldVisualiser'), { ssr: false });

function MetadataDropdown({ title, children }: { title?: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center ${title ? 'justify-between w-full' : ''} text-left`}
      >
        {title && <span className='text-sm'>{title}</span>}
        <svg
          className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='square' strokeLinejoin='miter' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>
      {isOpen && (
        <div className='text-xs text-white/60 mt-2 leading-relaxed space-y-2'>
          {children}
        </div>
      )}
    </div>
  );
}

export default function EmergentCurrentsPage() {
  return (
    <main className='min-h-screen'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              Emergent Currents
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              Particles tracing a divergence-free noise field
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              Curl noise produces divergence-free vector fields — particles flowing through them never converge or diverge, creating organic, fluid-like motion. This interactive visualiser lets you explore how layered fractal noise shapes emergent flow patterns.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive Visualisation</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Generative</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Canvas2D</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Curl Noise</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className='space-y-6'>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Category
              </span>
              <span className='text-sm'>Generative Art</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Audience
              </span>
              <MetadataDropdown title='Creative technologists'>
                <p>Developers and designers interested in generative systems, particle simulations, and procedural techniques. Also general audiences who enjoy watching mesmerising flow patterns.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Curl noise is computed by taking the curl of a potential field (typically Perlin or Simplex noise). The resulting vector field is guaranteed to be divergence-free, meaning particles following it will never bunch up or spread apart unnaturally.</p>
                <p>The visualisation uses layered octaves of noise at different scales to create complex, organic flow patterns.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>React, Canvas2D, Simplex Noise</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Placeholder */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='w-full aspect-video bg-black' />
      </section>

      {/* Interactive Visualiser */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <FlowFieldVisualiser />
      </section>

      {/* Content Grid */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-12 lg:gap-16'>
          {/* Left column - Main content */}
          <div className='space-y-12'>
            {/* The Challenge */}
            <div>
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6'>
                The Challenge
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  Placeholder text for the challenge section. This will describe the creative and technical goals of the visualisation — why curl noise, what aesthetic we&apos;re aiming for, and what makes this approach interesting.
                </p>
              </div>
            </div>

            {/* Background */}
            <div>
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6'>
                Background
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  Placeholder text for the background section. This will cover the mathematics of curl noise, divergence-free vector fields, and their applications in computer graphics and simulations.
                </p>
              </div>
            </div>

            {/* Approach */}
            <div>
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6'>
                Approach
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  Placeholder text for the approach section. This will explain the implementation details — how the noise field is computed, how particles are advected, and how the visual parameters affect the output.
                </p>
              </div>
            </div>
          </div>

          {/* Right column - Sidebar */}
          <div className='space-y-12'>
            {/* Technology */}
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Technology
              </h3>
              <ul className='space-y-2 text-sm text-white/70'>
                <li>React</li>
                <li>Canvas 2D API</li>
                <li>Simplex Noise</li>
                <li>RequestAnimationFrame</li>
              </ul>
            </div>

            {/* Related Projects */}
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Related Projects
              </h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link
                    href='/work/fractals'
                    className='text-white/70 hover:text-[var(--color-blue)] transition-colors'
                  >
                    What are Fractals? →
                  </Link>
                </li>
                <li>
                  <Link
                    href='/work/stellar-evolution'
                    className='text-white/70 hover:text-[var(--color-blue)] transition-colors'
                  >
                    Stellar Evolution →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
