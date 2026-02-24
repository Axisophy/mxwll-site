'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const SolarWavelengthExplorer = dynamic(
  () => import('./components/SolarWavelengthExplorer'),
  { ssr: false }
);

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

export default function SolarWavelengthPage() {
  return (
    <main className='min-h-screen'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              Peeling Back the Sun
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              The same star, seen in ten different lights
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              NASA&apos;s Solar Dynamics Observatory photographs the Sun every 12 seconds
              in ten different wavelengths. Each reveals a different layer &mdash; from the
              cool 5,700&deg;C surface to 10-million-degree flare plasma. Drag the dial
              to peel back the Sun&apos;s atmosphere, layer by layer.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive Visualisation</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>NASA SDO Data</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Explanation Design</span>
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
                <p>Anyone curious about astronomy or how the Sun works. The interaction itself teaches you what each wavelength reveals &mdash; no prior knowledge required.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Real NASA satellite imagery, smooth crossfading between wavelengths, progressive disclosure. Each wavelength tells a different story about the same moment in time.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>Canvas2D, Helioviewer API, NASA SDO/AIA</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Data Source
              </span>
              <span className='text-sm'>
                <a
                  href='https://helioviewer.org'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[var(--color-blue)] hover:text-white transition-colors'
                >
                  Helioviewer.org
                </a>
                {' / '}
                <a
                  href='https://sdo.gsfc.nasa.gov'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[var(--color-blue)] hover:text-white transition-colors'
                >
                  NASA SDO
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Visualisation */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='aspect-[16/10] bg-[#050508] overflow-hidden'>
          <SolarWavelengthExplorer className='w-full h-full' />
        </div>
        <p className='text-xs md:text-sm text-white/50 mt-4 max-w-2xl'>
          Drag the slider or use arrow keys to sweep through wavelengths. Press Space to auto-play. Each wavelength reveals different temperatures and features of the Sun&apos;s atmosphere.
        </p>
      </section>

      {/* Content section */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid lg:grid-cols-[7fr_3fr] gap-12 lg:gap-16'>
          {/* Main content */}
          <div className='space-y-12'>
            <div>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tight mb-6'>
                Why Does the Sun Look Different?
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  Different atoms emit light at specific wavelengths when they reach certain temperatures.
                  Iron ions at 630,000&deg;C emit light at exactly 171 &Aring;ngstr&ouml;ms. At 6 million
                  degrees, the same iron emits at 94 &Aring;. By filtering for these specific wavelengths,
                  SDO&apos;s cameras can isolate plasma at precise temperatures.
                </p>
                <p>
                  The false colours you see aren&apos;t the actual colours of light &mdash; these wavelengths
                  are all in the extreme ultraviolet, invisible to human eyes. Scientists assign colours to
                  make different channels distinguishable and to roughly correspond to temperature
                  (cooler = warmer colours, hotter = cooler colours, counterintuitively).
                </p>
              </div>
            </div>

            <div>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tight mb-6'>
                The Coronal Heating Mystery
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  Here&apos;s a puzzle: the Sun&apos;s surface is 5,700&deg;C. But the corona &mdash; the
                  Sun&apos;s outer atmosphere &mdash; is over a million degrees. That&apos;s like walking away
                  from a campfire and finding it gets hotter the further you go. This shouldn&apos;t happen.
                </p>
                <p>
                  After 80 years, we still don&apos;t fully understand coronal heating. The leading theories
                  involve magnetic field lines that twist, tangle, and violently reconnect, releasing energy
                  in bursts too small to see individually but together maintaining the corona&apos;s extreme
                  temperature. The 171, 193, and 211 &Aring; channels are the workhorses of this research.
                </p>
              </div>
            </div>

            <div>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tight mb-6'>
                What the Channels Reveal
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  <strong className='text-white/90'>Sunspots</strong> appear dark at 4500 &Aring; because
                  they&apos;re cooler than surroundings. But in UV and EUV, they blaze with magnetic activity.
                </p>
                <p>
                  <strong className='text-white/90'>Coronal holes</strong> &mdash; dark patches in the 193
                  &Aring; channel &mdash; are where magnetic field lines open into space. These are the
                  source of the fast solar wind.
                </p>
                <p>
                  <strong className='text-white/90'>Solar flares</strong> light up dramatically in the
                  hottest channels (94, 131 &Aring;) but are barely visible in cooler ones. Watching a
                  flare sweep through the channels shows how the plasma heats and cools.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-8'>
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                About SDO
              </h3>
              <p className='text-sm text-white/60 leading-relaxed'>
                The Solar Dynamics Observatory launched in 2010 and photographs the Sun continuously
                at 4096&times;4096 resolution, capturing 1.5 terabytes of data per day. It has
                revolutionised our understanding of solar activity.
              </p>
            </div>
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Resources
              </h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a
                    href='https://helioviewer.org'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--color-blue)] hover:text-white transition-colors'
                  >
                    Helioviewer.org
                  </a>
                  <span className='text-white/40'> &mdash; Explore the full archive</span>
                </li>
                <li>
                  <a
                    href='https://sdo.gsfc.nasa.gov/data/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--color-blue)] hover:text-white transition-colors'
                  >
                    SDO Data Portal
                  </a>
                  <span className='text-white/40'> &mdash; NASA&apos;s official data access</span>
                </li>
                <li>
                  <a
                    href='https://svs.gsfc.nasa.gov/4124'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--color-blue)] hover:text-white transition-colors'
                  >
                    NASA SVS &quot;Thermonuclear Art&quot;
                  </a>
                  <span className='text-white/40'> &mdash; Ultra-HD solar footage</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
