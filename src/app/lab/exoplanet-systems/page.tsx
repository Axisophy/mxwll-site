'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import MetadataDropdown from '@/components/MetadataDropdown'

const ExoplanetDemo = dynamic(() => import('@/visualisers/exoplanet-transit/demo/ExoplanetDemo'), {
  ssr: false,
})

export default function ExoplanetSystemsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with Metadata Sidebar */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left column - Title and description */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]">
              Exoplanet Systems
            </h1>
            <p className="font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2">
              A three-view exploration of planetary discovery
            </p>
            <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12">
              An autonomous demo showing how exoplanet discovery has accelerated over time, how orbital period relates to planet size, and where discovered planets cluster across the sky. Built from NASA Exoplanet Archive data spanning three decades of discovery.
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
              <MetadataDropdown title="Science communicators, educators">
                <p>For planetarium shows, museum exhibits, and educational content requiring coordinated multi-view displays of exoplanet discovery data. Designed to run autonomously as a looping showcase.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Approach
              </span>
              <MetadataDropdown>
                <p>Three coordinated views show complementary aspects: discovery timeline reveals acceleration, scatter plot shows size-period relationship, sky map reveals clustering. Smooth transitions guide attention between views.</p>
                <p>Autonomous demo mode with timed transitions designed for showcase environments where user interaction isn&apos;t required.</p>
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
              <span className="font-nhg text-sm text-[var(--text-secondary)]">NASA Exoplanet Archive (~5,400 confirmed planets)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="border border-[var(--border)] bg-[#050508] overflow-hidden">
          <div className="aspect-[16/9]">
            <ExoplanetDemo className="w-full h-full" />
          </div>
        </div>
        <p className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mt-4">
          AUTONOMOUS DEMO - THREE COORDINATED VIEWS OF EXOPLANET DISCOVERY
        </p>
      </section>

      {/* Stage 2: ANCHOR */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: Opening Context]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Connect to what the audience knows about exoplanets - perhaps starting with the first discoveries in the 1990s, or the Kepler mission&apos;s revolution in planet-finding.]
            </p>
            <p>
              [Explain why these three views matter - what each reveals that the others don&apos;t.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 3: FOUNDATION */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: Discovery Timeline]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Explain the timeline view - how discovery methods evolved (radial velocity → transits → direct imaging), what caused the acceleration around 2014 (Kepler data release), why the curve flattens recently.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 4: BUILD */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: Size-Period Relationship]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Explain the scatter plot - why hot Jupiters cluster at short periods, why Earth-sized planets are harder to detect at longer periods, what the empty regions tell us about detection bias vs true absence.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 5: REWARD */}
      <section className="px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-[var(--bg-tertiary)]">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: The Full Picture]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Synthesise what the three views reveal together - how detection bias shapes what we see, why coordination between views matters, what we can infer about planetary systems from these patterns.]
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
                      href="https://exoplanetarchive.ipac.caltech.edu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      NASA Exoplanet Archive
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
