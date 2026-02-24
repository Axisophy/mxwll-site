'use client';

import dynamic from 'next/dynamic';

const GaiaExplorer = dynamic(() => import('./GaiaExplorer'), { ssr: false });

export default function StellarCartographyPage() {
  return (
    <main className='min-h-screen'>
      {/* Header */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4'>
          Stellar Cartography
        </h1>
        <p className='text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-4'>
          50,000 stars from the Gaia catalogue, two views of the same data
        </p>
        <p className='text-base text-[var(--text-secondary)] max-w-3xl mt-8'>
          The European Space Agency's Gaia satellite has measured the positions, distances, and colours of over a billion stars. This interactive explores 50,000 nearby stars - first as they appear in the sky, then rearranged by temperature and brightness to reveal the hidden structure of stellar evolution.
        </p>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 mt-8'>
          <span className='px-3 py-1 font-mono text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider'>Interactive Visualisation</span>
          <span className='px-3 py-1 font-mono text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider'>Scientific Data</span>
          <span className='px-3 py-1 font-mono text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider'>WebGL</span>
          <span className='px-3 py-1 font-mono text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider'>Astronomy</span>
        </div>
      </section>

      {/* Interactive Visualiser */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='aspect-square md:aspect-[16/10] bg-[#050508] overflow-hidden border border-[var(--border-light)]'>
          <GaiaExplorer className='w-full h-full' />
        </div>
        <p className='font-mono text-xs text-[var(--text-tertiary)] mt-4 max-w-2xl uppercase tracking-wider'>
          50,000 STARS FROM THE GAIA DR3 CATALOGUE WITHIN 200 PARSECS. PRESS SPACE TO TOGGLE BETWEEN SKY VIEW AND HR DIAGRAM. SCROLL TO ZOOM, DRAG TO PAN.
        </p>
      </section>

      {/* Content Grid */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-12 lg:gap-16'>
          {/* Left column - Metadata */}
          <div className='space-y-8'>
            <div>
              <h3 className='font-mono text-xs text-[var(--text-tertiary)] mb-3 uppercase tracking-wider'>
                Category
              </h3>
              <p className='text-sm'>Scientific Data Visualisation</p>
            </div>
            <div>
              <h3 className='font-mono text-xs text-[var(--text-tertiary)] mb-3 uppercase tracking-wider'>
                Audience
              </h3>
              <p className='text-sm text-[var(--text-secondary)]'>
                General / Science-curious. Anyone curious about astronomy or data visualisation. No prior knowledge required - the transition itself teaches you what the HR diagram reveals.
              </p>
            </div>
            <div>
              <h3 className='font-mono text-xs text-[var(--text-tertiary)] mb-3 uppercase tracking-wider'>
                Technology
              </h3>
              <ul className='space-y-2 text-sm text-[var(--text-secondary)]'>
                <li>WebGL (GL_POINTS)</li>
                <li>Gaia DR3 Archive</li>
                <li>Python (data processing)</li>
                <li>Next.js</li>
              </ul>
            </div>
            <div>
              <h3 className='font-mono text-xs text-[var(--text-tertiary)] mb-3 uppercase tracking-wider'>
                Data
              </h3>
              <ul className='space-y-2 text-sm text-[var(--text-secondary)]'>
                <li>~50,000 stars</li>
                <li>Within 200 parsecs</li>
                <li>Gaia DR3 release</li>
              </ul>
            </div>
          </div>

          {/* Right column - Main content */}
          <div className='space-y-12'>
            {/* The Challenge */}
            <div>
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-6'>
                The Challenge
              </h2>
              <div className='space-y-4 text-[var(--text-secondary)] leading-relaxed'>
                <p>
                  How do you make a billion-star catalogue comprehensible? Gaia DR3 contains precise measurements of 1.8 billion stars, but raw data at this scale is meaningless without structure. We needed to find the visual arrangement that reveals the hidden physics.
                </p>
              </div>
            </div>

            {/* Background */}
            <div>
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-6'>
                Background
              </h2>
              <div className='space-y-4 text-[var(--text-secondary)] leading-relaxed'>
                <p>
                  The Hertzsprung-Russell diagram is astronomy's most powerful classification tool - it plots stars by temperature against brightness. When you do this, stars don't scatter randomly. They fall into distinct regions that correspond to different stages of stellar evolution.
                </p>
                <p>
                  The diagonal band is the main sequence, where stars spend most of their lives fusing hydrogen. Above it are the red giants - stars that have exhausted their core hydrogen and expanded. Below and to the left are white dwarfs - the dense remnants of dead stars.
                </p>
              </div>
            </div>

            {/* Approach */}
            <div>
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-6'>
                Approach
              </h2>
              <div className='space-y-4 text-[var(--text-secondary)] leading-relaxed'>
                <p>
                  We query 50,000 nearby stars from the Gaia archive, compute their absolute magnitudes from parallax measurements, and present them in two views: as they appear in the sky, and as they sit on the HR diagram. The animated transition between these views is the key explanatory moment.
                </p>
                <p>
                  Each star is coloured by its temperature - blue-white for the hottest, yellow for Sun-like stars, orange and red for cooler stars. The size reflects brightness. These visual encodings remain consistent across both views, so you can track individual stars as they move.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
