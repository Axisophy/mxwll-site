'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import MetadataDropdown from '@/components/MetadataDropdown';

const AsteroidBeltExplorer = dynamic(() => import('./components/AsteroidBeltExplorer'), { ssr: false });

export default function AsteroidBeltPage() {
  return (
    <main className='min-h-screen'>
      {/* Header */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <h1 className='font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]'>
          The Forbidden Orbits
        </h1>
        <p className='font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2'>
          100,000 asteroids reveal the invisible hand of Jupiter&apos;s gravity
        </p>
        <p className='font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12'>
          Between Mars and Jupiter, over a million known asteroids orbit the Sun. But they&apos;re not everywhere - certain orbits are empty, swept clean by gravitational resonance with Jupiter. This interactive explores the hidden architecture of the asteroid belt using real orbital data from the Minor Planet Center.
        </p>
        {/* Tags */}
        <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
          <span className='px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'>WebGL</span>
          <span className='px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'>Astronomy</span>
          <span className='px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'>Interactive</span>
          <span className='px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'>Simulation</span>
        </div>
        {/* Metadata */}
        <div className='flex flex-wrap gap-x-12 gap-y-6 mt-8 md:mt-12'>
          <div>
            <span className='font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2'>Category</span>
            <span className='font-nhg text-sm'>Scientific Data Visualisation</span>
          </div>
          <div>
            <span className='font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2'>Audience</span>
            <MetadataDropdown title='General / Science-curious'>
              <p>Anyone curious about astronomy or orbital mechanics. The transition from spatial view to histogram reveals structure that&apos;s invisible in static images - the Kirkwood gaps carved by Jupiter&apos;s gravity over billions of years.</p>
            </MetadataDropdown>
          </div>
          <div>
            <span className='font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2'>Approach</span>
            <MetadataDropdown>
              <p>Real orbital data from the Minor Planet Center, animated transitions between views, multi-view exploration. The same asteroids shown in different arrangements to reveal different aspects of the belt&apos;s structure.</p>
            </MetadataDropdown>
          </div>
          <div>
            <span className='font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2'>Technology</span>
            <span className='font-nhg text-sm'>WebGL2, GPGPU, Minor Planet Center</span>
          </div>
        </div>
      </section>

      {/* Interactive Visualiser */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='aspect-[16/10] bg-[#050508] rounded-xl overflow-hidden'>
          <AsteroidBeltExplorer className='w-full h-full' />
        </div>
        <p className='text-xs md:text-sm text-[var(--text-tertiary)] mt-4 max-w-2xl'>
          100,000 asteroids from the Minor Planet Center catalogue. Use the buttons below to switch views. Scroll to zoom, drag to pan. Press Space to auto-play through all views.
        </p>
      </section>

      {/* Content */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='max-w-3xl space-y-12'>
          {/* The Challenge */}
          <div>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] mb-6'>
              The Challenge
            </h2>
            <div className='space-y-4 text-[var(--text-secondary)] leading-relaxed'>
              <p>
                The asteroid belt looks like a uniform ring of debris. But it isn&apos;t - Jupiter&apos;s gravity has carved invisible channels through it, forbidding certain orbits from existing. The challenge is making this invisible structure visible, and explaining why it exists.
              </p>
            </div>
          </div>

          {/* Background */}
          <div>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] mb-6'>
              Background
            </h2>
            <div className='space-y-4 text-[var(--text-secondary)] leading-relaxed'>
              <p>
                In 1866, Daniel Kirkwood noticed that asteroids weren&apos;t uniformly distributed. At certain orbital distances - where an asteroid would orbit the Sun exactly 3 times for every 1 Jupiter orbit, or 5 times for every 2 - almost no asteroids exist. These orbital resonances make trajectories chaotic over millions of years, gradually ejecting asteroids from those zones.
              </p>
              <p>
                The gaps are named after Kirkwood, and they&apos;re one of the clearest examples of how gravitational resonance shapes the solar system. The same physics creates gaps in Saturn&apos;s rings and explains why certain exoplanets have stable orbits while others don&apos;t.
              </p>
            </div>
          </div>

          {/* Approach */}
          <div>
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] mb-6'>
              Approach
            </h2>
            <div className='space-y-4 text-[var(--text-secondary)] leading-relaxed'>
              <p>
                We plot 100,000 real asteroids from the Minor Planet Center&apos;s orbital database, first in their spatial positions around the Sun, then reorganised into a histogram by orbital distance. The transition between views is the explanatory moment: a dense ring becomes a landscape of peaks and valleys, revealing structure carved by gravity over billions of years.
              </p>
              <p>
                Each asteroid is rendered as an individual particle using WebGL2. The same data is shown in different arrangements - the transition itself is the explanation.
              </p>
            </div>
          </div>

          {/* Related Projects */}
          <div>
            <h3 className='text-xs font-nhg uppercase tracking-wider text-[var(--text-tertiary)] mb-4'>
              Related Projects
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/work/stellar-cartography'
                  className='text-[var(--text-secondary)] hover:text-[var(--color-blue)] transition-colors'
                >
                  Stellar Cartography →
                </Link>
              </li>
              <li>
                <Link
                  href='/work/orbital-mechanics'
                  className='text-[var(--text-secondary)] hover:text-[var(--color-blue)] transition-colors'
                >
                  Orbital Mechanics →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
