'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const GaiaExplorer = dynamic(() => import('./GaiaExplorer'), { ssr: false });

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

export default function StellarCartographyPage() {
  return (
    <main className='min-h-screen'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              Stellar Cartography
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              50,000 stars from the Gaia catalogue, two views of the same data
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              The European Space Agency&apos;s Gaia satellite has measured the positions, distances, and colours of over a billion stars. This interactive explores 50,000 nearby stars — first as they appear in the sky, then rearranged by temperature and brightness to reveal the hidden structure of stellar evolution.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive Visualisation</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Scientific Data</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>WebGL</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Astronomy</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className='space-y-6'>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Category
              </span>
              <span className='text-sm'>Scientific Data Visualisation</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Audience
              </span>
              <MetadataDropdown title='General / Science-curious'>
                <p>Anyone curious about astronomy or data visualisation. No prior knowledge required — the transition itself teaches you what the HR diagram reveals.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Real satellite data, animated transitions between coordinate systems, progressive disclosure of structure. The key insight emerges from watching the same points rearrange.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>WebGL, Gaia DR3, Python</span>
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
        <div className='aspect-[16/10] bg-[#050508] overflow-hidden'>
          <GaiaExplorer className='w-full h-full' />
        </div>
        <p className='text-xs md:text-sm text-white/50 mt-4 max-w-2xl'>
          50,000 stars from the Gaia DR3 catalogue within 200 parsecs. Press Space to toggle between sky view and HR diagram. Scroll to zoom, drag to pan.
        </p>
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
                  How do you make a billion-star catalogue comprehensible? Gaia DR3 contains precise measurements of 1.8 billion stars, but raw data at this scale is meaningless without structure. We needed to find the visual arrangement that reveals the hidden physics.
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
                  The Hertzsprung-Russell diagram is astronomy&apos;s most powerful classification tool — it plots stars by temperature against brightness. When you do this, stars don&apos;t scatter randomly. They fall into distinct regions that correspond to different stages of stellar evolution.
                </p>
                <p>
                  The diagonal band is the main sequence, where stars spend most of their lives fusing hydrogen. Above it are the red giants — stars that have exhausted their core hydrogen and expanded. Below and to the left are white dwarfs — the dense remnants of dead stars.
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
                  We query 50,000 nearby stars from the Gaia archive, compute their absolute magnitudes from parallax measurements, and present them in two views: as they appear in the sky, and as they sit on the HR diagram. The animated transition between these views is the key explanatory moment.
                </p>
                <p>
                  Each star is coloured by its temperature — blue-white for the hottest, yellow for Sun-like stars, orange and red for cooler stars. The size reflects brightness. These visual encodings remain consistent across both views, so you can track individual stars as they move.
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
                <li>WebGL (GL_POINTS)</li>
                <li>Gaia DR3 Archive</li>
                <li>Python (data processing)</li>
                <li>Next.js</li>
              </ul>
            </div>

            {/* Data */}
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Data
              </h3>
              <ul className='space-y-2 text-sm text-white/70'>
                <li>~50,000 stars</li>
                <li>Within 200 parsecs</li>
                <li>Gaia DR3 release</li>
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
                    href='/work/stellar-evolution'
                    className='text-white/70 hover:text-[var(--color-blue)] transition-colors'
                  >
                    Stellar Evolution →
                  </Link>
                </li>
                <li>
                  <Link
                    href='/work/nuclide-chart'
                    className='text-white/70 hover:text-[var(--color-blue)] transition-colors'
                  >
                    Nuclide Chart →
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
