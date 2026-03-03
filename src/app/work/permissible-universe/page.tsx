'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import MetadataDropdown from '@/components/MetadataDropdown'

const PermissibleUniverse = dynamic(
  () => import('@/visualisers/permissible-universe/core/PermissibleUniverse'),
  { ssr: false }
)

export default function PermissibleUniversePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with Metadata Sidebar */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left column - Title and description */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]">
              The Permissible Universe
            </h1>
            <p className="font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2">
              A map of everything that can exist
            </p>
            <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12">
              An interactive mass-radius diagram showing ~200 cosmic objects from quarks to supermassive black holes. Objects are positioned according to fundamental physical limits - the Schwarzschild radius, electron degeneracy pressure, Compton wavelength, and Hubble radius. The boundaries show where nature draws the line.
            </p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8">
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Interactive</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astrophysics</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Canvas 2D</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className="space-y-6">
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Category
              </span>
              <span className="font-nhg text-sm">Explanation Design</span>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Audience
              </span>
              <MetadataDropdown title="Generally interested adults">
                <p>For people curious about the fundamental limits of physical reality. No physics background required - the four-tier explanation system adapts from accessible to advanced based on reader preference.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Approach
              </span>
              <MetadataDropdown>
                <p>Log-log scatter plot spanning 80+ orders of magnitude. Physical boundaries show the impossible regions - matter can&apos;t exist above the Schwarzschild radius, quantum effects dominate below the Compton wavelength.</p>
                <p>Click any object for four-tier explanations: child → student → undergraduate → expert. Each explanation is tailored to that audience&apos;s existing knowledge.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Adaptability
              </span>
              <MetadataDropdown>
                <p>The four-tier explanation pattern works for any subject where audiences have widely varying expertise. Medical procedures for patients, clinicians, and surgeons. Financial instruments for consumers, advisors, and traders.</p>
                <p>The log-log diagram pattern works for any dataset spanning multiple orders of magnitude - earthquake magnitudes, population densities, chemical concentrations.</p>
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
              <span className="font-nhg text-sm text-[var(--text-secondary)]">Curated dataset (~200 cosmic objects with four-tier explanations)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="border border-[var(--border)] overflow-hidden">
          <PermissibleUniverse />
        </div>
        <p className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mt-4">
          INTERACTIVE MASS-RADIUS DIAGRAM - CLICK ANY OBJECT FOR DETAILED EXPLANATIONS
        </p>
      </section>

      {/* Stage 2: ANCHOR */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: Nature Has Rules]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Explain the central idea - not everything is possible. Physics imposes boundaries on what can exist. You can&apos;t have an object denser than a black hole. Quantum mechanics prevents structures below a certain size.]
            </p>
            <p>
              [Connect to familiar constraints - perhaps building codes limiting building height, or material strength limiting bridge spans.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 3: FOUNDATION */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: The Schwarzschild Boundary]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Explain the black hole line - above this boundary, gravity overwhelms all other forces. Nothing can exist here without collapsing into a black hole. This is the ultimate density limit.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 4a: BUILD */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: Electron Degeneracy]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Explain the white dwarf limit - quantum pressure from electrons prevents further collapse. This creates the diagonal stripe of white dwarfs and neutron stars. Without this, all stars would become black holes.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 4b: BUILD */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: The Quantum Limit]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Explain the Compton wavelength - below this scale, quantum mechanics dominates. You can&apos;t localise a particle more precisely without creating new particles. This is why fundamental particles cluster at the bottom left.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 5: REWARD */}
      <section className="px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-[var(--bg-tertiary)]">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            [Placeholder: The Map of Possibility]
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Consolidate - this diagram is a map of physical possibility. The empty regions aren&apos;t empty because we haven&apos;t found objects there - they&apos;re empty because the laws of physics forbid them. Understanding these boundaries is understanding the universe&apos;s operating system.]
            </p>
          </div>
        </div>
      </section>

      {/* Stage 6: EXTEND */}
      <section className="px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Going Deeper
          </h2>
          <p className="font-nhg text-[var(--text-tertiary)] text-sm">
            For the curious - you&apos;ve got the main idea, this is extra.
          </p>
        </div>
      </section>

      {/* 6a: The Hubble Radius */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em]">
            [Placeholder: The Hubble Radius]
          </h3>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              [Content pending: Explain the cosmological limit - the Hubble radius marks the edge of the observable universe. Objects larger than this would have horizons receding faster than light. This boundary is dynamic - it grows as the universe ages.]
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
