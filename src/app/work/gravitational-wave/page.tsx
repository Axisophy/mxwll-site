'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import MetadataDropdown from '@/components/MetadataDropdown'

const GravitationalWaveExplorer = dynamic(
  () => import('@/visualisers/gravitational-wave/core/components/GravitationalWaveExplorer'),
  { ssr: false }
)

export default function GravitationalWavePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with Metadata Sidebar */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left column - Title and description */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]">
              Gravitational Wave Detection
            </h1>
            <p className="font-sabon text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2">
              How LIGO found a whisper from 1.3 billion years ago
            </p>
            <p className="font-sabon text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12">
              On 14 September 2015, two black holes collided. LIGO caught the signal - barely. This interactive recreates the moment of discovery, from raw noise to the chirp that confirmed Einstein was right.
            </p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8">
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Interactive</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Scientific Data</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">WebAudio</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astronomy</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className="space-y-6">
            <div>
              <span className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Category
              </span>
              <span className="font-sabon text-sm">Scientific Data Visualisation</span>
            </div>
            <div>
              <span className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Audience
              </span>
              <MetadataDropdown title="General / Science-curious">
                <p>For people who know black holes exist and have heard of gravitational waves, but don&apos;t understand how detection works or why it&apos;s significant. The interactive shows the actual discovery process - how LIGO finds signals buried in noise.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Approach
              </span>
              <MetadataDropdown>
                <p>Progressive revelation through multi-representation. Start with raw detector readings (pure noise), reveal the predicted template, show the correlation process, then present the physical interpretation. Each stage builds understanding of how matched filtering works.</p>
                <p>Audio sonification makes the &quot;chirp&quot; visceral - you can hear the frequency rise as the black holes spiral inward. This transforms abstract data into something immediate and real.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Technology
              </span>
              <span className="font-sabon text-sm">React, Canvas 2D, Web Audio API, TypeScript</span>
            </div>
            <div>
              <span className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Data
              </span>
              <span className="font-sabon text-sm text-[var(--text-secondary)]">Gravitational Wave Open Science Center (GWOSC)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="border border-[var(--border)] bg-[#050508] overflow-hidden">
          <div className="h-[500px] md:h-[750px] lg:h-[875px]">
            <GravitationalWaveExplorer />
          </div>
        </div>
        <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mt-4">
          INTERACTIVE GRAVITATIONAL WAVE DETECTION - FOUR STAGES FROM RAW DATA TO INTERPRETATION
        </p>
      </section>

      {/* Stage 2: ANCHOR - The Challenge */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            The Challenge
          </h2>
          <div className="space-y-4 font-sabon text-[var(--text-secondary)] leading-relaxed">
            <p>
              Gravitational waves compress and stretch spacetime by infinitesimal amounts. When GW150914 arrived, LIGO&apos;s 4-kilometre laser arms shifted by less than one-thousandth of a proton&apos;s diameter.
            </p>
            <p>
              Raw detector readings resembled pure noise - the signal remained invisible to direct observation.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 3: FOUNDATION - Matched Filtering */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Matched Filtering
          </h2>
          <div className="space-y-4 font-sabon text-[var(--text-secondary)] leading-relaxed">
            <p>
              LIGO employs matched filtering methodology. Einstein&apos;s equations precisely predict gravitational wave characteristics for merging black hole pairs. The distinctive &quot;chirp&quot; signal - frequency and amplitude increasing together - follows exact mathematical patterns.
            </p>
            <p>
              By correlating predicted templates against noisy measurements, LIGO isolates buried signals. GW150914&apos;s correlation strength suggested occurrence probability below 1 in 200,000 years of random data.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 4: BUILD - The Event */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            The Event
          </h2>
          <div className="space-y-4 font-sabon text-[var(--text-secondary)] leading-relaxed">
            <p>
              Two black holes - 36 and 29 solar masses - spiralled inward over millions of years. During their final fractional second, orbital speed approached half light-speed, completing dozens of cycles before merger.
            </p>
            <p>
              The resulting 62-solar-mass object released three solar masses as gravitational energy (more than 10⁴⁷ joules) - momentarily outshining all observable universe stars combined.
            </p>
            <p>
              After travelling 1.3 billion years while expanding with the universe, the wave reached Earth on 14 September 2015.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 5: REWARD */}
      <section className="px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-[var(--bg-tertiary)]">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            What This Means
          </h2>
          <div className="space-y-4 font-sabon text-[var(--text-secondary)] leading-relaxed">
            <p>
              GW150914 was the first direct detection of gravitational waves - confirming a century-old prediction by Einstein. But it also opened a new way of observing the universe. Light can&apos;t escape black holes. Gravitational waves can.
            </p>
            <p className="text-[var(--text-primary)]">
              We can now &quot;hear&quot; events that were previously invisible. LIGO has since detected dozens of black hole mergers and neutron star collisions. Each one reveals physics that was inaccessible before September 2015.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 6: EXTEND - Going Deeper */}
      <section className="px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Going Deeper
          </h2>
          <p className="font-sabon text-[var(--text-tertiary)] text-sm">
            For the curious - you&apos;ve got the main idea, this is extra.
          </p>
        </div>
      </section>

      {/* 6a: How LIGO Works */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            How LIGO Achieves Sub-Atomic Precision
          </h3>
          <div className="space-y-4 font-sabon text-[var(--text-secondary)] leading-relaxed">
            <p>
              LIGO uses laser interferometry. A single laser beam splits and travels down two perpendicular 4-kilometre arms. Mirrors reflect the beams back and forth about 280 times, effectively creating 1,120-kilometre paths.
            </p>
            <p>
              When the beams recombine, they interfere. If both arms are exactly the same length, they cancel perfectly. A gravitational wave passing through stretches one arm while compressing the other - the interference pattern changes.
            </p>
            <p>
              The sensitivity required to detect GW150914 means isolating the detector from every conceivable noise source: seismic activity, thermal fluctuations, quantum shot noise, even traffic on nearby roads. The detectors are among the most sensitive instruments ever built.
            </p>
          </div>
        </div>
      </section>

      {/* 6b: The Chirp */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Why It&apos;s Called a Chirp
          </h3>
          <div className="space-y-4 font-sabon text-[var(--text-secondary)] leading-relaxed">
            <p>
              As two black holes spiral closer, they orbit faster. Faster orbits produce higher-frequency gravitational waves. The amplitude also increases as the black holes approach merger.
            </p>
            <p>
              The result is a distinctive signal: frequency and amplitude rising together over a fraction of a second. When converted to sound (the actual signal is below human hearing), it sounds like a bird chirp - hence the name.
            </p>
            <p>
              The exact shape of the chirp encodes information about the black holes: their masses, spins, orbital parameters, and distance. Matched filtering doesn&apos;t just detect the signal - it measures the event.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 7: LAUNCH */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24 pt-16 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Further Exploration
          </h2>
          <div>
            <div className="space-y-8">
              <div>
                <h3 className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Data Source
                </h3>
                <ul className="space-y-2 text-sm font-sabon">
                  <li>
                    <a
                      href="https://www.gwosc.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      Gravitational Wave Open Science Center
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">GW150914 data release</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Recommended Reading
                </h3>
                <ul className="space-y-2 text-sm font-sabon">
                  <li>
                    <a
                      href="https://arxiv.org/abs/1602.03837"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      Observation of Gravitational Waves from a Binary Black Hole Merger
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">Original discovery paper (arXiv)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Related Work
                </h3>
                <ul className="space-y-2 text-sm font-sabon">
                  <li>
                    <a
                      href="/work/stellar-cartography"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Stellar Cartography →
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
