'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const AsteroidBeltExplorer = dynamic(() => import('./components/AsteroidBeltExplorer'), { ssr: false });

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

export default function AsteroidBeltPage() {
  return (
    <main className='min-h-screen'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              The Forbidden Orbits
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              100,000 asteroids reveal the invisible hand of Jupiter&apos;s gravity
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              Between Mars and Jupiter, over a million known asteroids orbit the Sun. But they&apos;re not everywhere — certain orbits are empty, swept clean by gravitational resonance with Jupiter. This interactive explores the hidden architecture of the asteroid belt using real orbital data from the Minor Planet Center.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive Visualisation</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Scientific Data</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>WebGL</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Astronomy</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>GPGPU</span>
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
                <p>Anyone curious about astronomy or orbital mechanics. The transition from spatial view to histogram reveals structure that&apos;s invisible in static images — the Kirkwood gaps carved by Jupiter&apos;s gravity over billions of years.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Real orbital data from the Minor Planet Center, animated transitions between views, multi-view exploration. The same asteroids shown in different arrangements to reveal different aspects of the belt&apos;s structure.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>WebGL2, GPGPU, Minor Planet Center</span>
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
          <AsteroidBeltExplorer className='w-full h-full' />
        </div>
        <p className='text-xs md:text-sm text-white/50 mt-4 max-w-2xl'>
          100,000 asteroids from the Minor Planet Center catalogue. Press Space to toggle between solar system view and Kirkwood gaps histogram. Scroll to zoom, drag to pan.
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
                  The asteroid belt looks like a uniform ring of debris. But it isn&apos;t — Jupiter&apos;s gravity has carved invisible channels through it, forbidding certain orbits from existing. The challenge is making this invisible structure visible, and explaining why it exists.
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
                  In 1866, Daniel Kirkwood noticed that asteroids weren&apos;t uniformly distributed. At certain orbital distances — where an asteroid would orbit the Sun exactly 3 times for every 1 Jupiter orbit, or 5 times for every 2 — almost no asteroids exist. These orbital resonances make trajectories chaotic over millions of years, gradually ejecting asteroids from those zones.
                </p>
                <p>
                  The gaps are named after Kirkwood, and they&apos;re one of the clearest examples of how gravitational resonance shapes the solar system. The same physics creates gaps in Saturn&apos;s rings and explains why certain exoplanets have stable orbits while others don&apos;t.
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
                  We plot 100,000 real asteroids from the Minor Planet Center&apos;s orbital database, first in their spatial positions around the Sun, then reorganised into a histogram by orbital distance. The transition between views is the explanatory moment: a dense ring becomes a landscape of peaks and valleys, revealing structure carved by gravity over billions of years.
                </p>
                <p>
                  Each asteroid is rendered as an individual particle using WebGL2. The same data is shown in different arrangements — the transition itself is the explanation.
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
                <li>WebGL2 (GPGPU)</li>
                <li>MPC MPCORB data</li>
                <li>Python pipeline</li>
                <li>Next.js</li>
              </ul>
            </div>

            {/* Data */}
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Data
              </h3>
              <ul className='space-y-2 text-sm text-white/70'>
                <li>~100,000 asteroids</li>
                <li>MPC orbital elements</li>
                <li>Keplerian orbits</li>
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
                    href='/work/stellar-cartography'
                    className='text-white/70 hover:text-[var(--color-blue)] transition-colors'
                  >
                    Stellar Cartography →
                  </Link>
                </li>
                <li>
                  <Link
                    href='/work/orbital-mechanics'
                    className='text-white/70 hover:text-[var(--color-blue)] transition-colors'
                  >
                    Orbital Mechanics →
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
