'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import MetadataDropdown from '@/components/MetadataDropdown'

const SolarDemo = dynamic(() => import('@/visualisers/solar-wavelength/demo'), {
  ssr: false,
})

export default function SolarWavelengthPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with Metadata Sidebar */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left column - Title and description */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]">
              Solar Wavelength
            </h1>
            <p className="font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2">
              One solar moment across the electromagnetic spectrum
            </p>
            <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12">
              The same solar moment seen through different wavelengths reveals changing structure and temperature layers across the Sun. A crossfading demo loop showing extreme ultraviolet channels from NASA&apos;s Solar Dynamics Observatory, with wavelength indicator showing where each view sits on the spectrum.
            </p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8">
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Data Visualisation</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astronomy</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Canvas 2D</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className="space-y-6">
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Category
              </span>
              <span className="font-nhg text-sm">Data Visualisation</span>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Audience
              </span>
              <MetadataDropdown title="Educators, science communicators">
                <p>Designed for homepage showcases, educational displays, and museum exhibits where automated looping content is needed. Demonstrates how different wavelengths reveal different solar structures without requiring user interaction.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Approach
              </span>
              <MetadataDropdown>
                <p>Smooth crossfades between wavelength channels with synchronized wavelength indicator. Each channel reveals temperature-specific structures - coronal loops, active regions, chromospheric detail. The indicator bar maps position on the electromagnetic spectrum.</p>
                <p>Loop timing designed to allow sufficient viewing time per wavelength while maintaining engagement.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Technology
              </span>
              <span className="font-nhg text-sm">React, Canvas 2D, TypeScript</span>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Data
              </span>
              <span className="font-nhg text-sm text-[var(--text-secondary)]">NASA Solar Dynamics Observatory (SDO) imagery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="border border-[var(--border)] bg-[#050508] overflow-hidden flex items-center justify-center">
          <div className="w-full max-w-[600px] aspect-square">
            <SolarDemo className="w-full h-full" showLabel />
          </div>
        </div>
        <p className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mt-4">
          AUTONOMOUS DEMO - CROSSFADING SOLAR WAVELENGTH CHANNELS WITH SPECTRUM INDICATOR
        </p>
      </section>

      {/* Stage 2: ANCHOR */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: The Same Moment, Different Views]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Explain why the same solar moment looks completely different at different wavelengths - each wavelength reveals a different temperature layer, different structures become visible.]
            </p>
            <p>
              [Connect to something familiar - perhaps how X-ray airport scanners reveal different information than visible light photos.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 3: FOUNDATION */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: Temperature Layers]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Explain how different wavelengths correspond to different temperatures - EUV channels reveal coronal structures at millions of degrees, while other channels show cooler chromospheric features.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 4: BUILD */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: What SDO Reveals]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Explain why SDO observes in multiple wavelengths simultaneously - tracking solar activity, flare prediction, space weather monitoring. Why multi-wavelength observation matters for understanding solar dynamics.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 5: REWARD */}
      <section className="px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-[var(--bg-tertiary)]">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: Beyond Visible Light]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Consolidate the lesson - the Sun (and universe) reveals different information at different wavelengths. Visible light is just one narrow slice. Multi-wavelength astronomy is essential for complete understanding.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 7: LAUNCH */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24 pt-16 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Further Exploration
          </h2>
          <div>
            <div className="space-y-8">
              <div>
                <h3 className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Data Source
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="https://sdo.gsfc.nasa.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      NASA Solar Dynamics Observatory
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Related Work
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
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
