'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import MetadataDropdown from '@/components/MetadataDropdown'

const StellarCartographyExplorer = dynamic(
  () => import('@/visualisers/stellar-cartography/core/StellarCartographyExplorer'),
  { ssr: false }
)

export default function StellarCartographyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with Metadata Sidebar */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left column - Title and description */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]">
              Stellar Cartography
            </h1>
            <p className="font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2">
              Four ways to see the same 50,000 stars
            </p>
            <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12">
              The European Space Agency&apos;s Gaia satellite has measured the positions, distances, and colours of over a billion stars. This interactive explores 50,000 nearby stars - presenting them in four views that reveal different aspects of stellar structure and evolution.
            </p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8">
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Interactive</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Scientific Data</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">WebGL</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astronomy</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className="space-y-6">
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Category
              </span>
              <span className="font-nhg text-sm">Scientific Data Visualisation</span>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Audience
              </span>
              <MetadataDropdown title="General / Science-curious">
                <p>Anyone curious about astronomy or data visualisation. No prior knowledge required - the transitions between views teach you what each arrangement reveals about stellar physics.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Approach
              </span>
              <MetadataDropdown>
                <p>Multi-view presentation of identical data. Each view rearranges the same stars to emphasise different properties: position on the sky, temperature and luminosity (HR Diagram), galactic structure, or observer-centric magnitude relationships.</p>
                <p>The animated transitions are the key teaching moment - they let you track individual stars as they move, making the relationship between views visceral and immediate.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Technology
              </span>
              <span className="font-nhg text-sm">React, WebGL2, TypeScript</span>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Data
              </span>
              <span className="font-nhg text-sm text-[var(--text-secondary)]">Gaia DR3 (50,000 stars within 200 parsecs)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="border border-[var(--border)] bg-[#050508] overflow-hidden">
          <StellarCartographyExplorer />
        </div>
        <p className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mt-4">
          INTERACTIVE STELLAR CARTOGRAPHY - FOUR VIEWS OF 50,000 STARS FROM GAIA DR3
        </p>
      </section>

      {/* The Challenge */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Challenge
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              How do you make a billion-star catalogue comprehensible? Gaia DR3 contains precise measurements of 1.8 billion stars, but raw data at this scale is meaningless without structure. We needed to find the visual arrangements that reveal the hidden physics.
            </p>
            <p>
              Each view answers a different question. The sky view shows where stars appear from Earth. The HR diagram reveals evolutionary state. The galactic view exposes the Milky Way&apos;s structure. The observer view emphasises colour and brightness relationships.
            </p>
          </div>
        </div>
      </section>

      {/* The HR Diagram */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The HR Diagram
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              The Hertzsprung-Russell diagram is astronomy&apos;s most powerful classification tool. It plots stars by temperature (colour index) against brightness (absolute magnitude). When you do this, stars don&apos;t scatter randomly - they fall into distinct regions.
            </p>
            <p>
              The diagonal band is the main sequence, where stars spend most of their lives fusing hydrogen. Above it are the red giants - stars that have exhausted their core hydrogen and expanded. Below and to the left are white dwarfs - the dense remnants of dead stars.
            </p>
            <p>
              The HR diagram isn&apos;t just a classification system - it&apos;s a map of stellar evolution. Every star in the night sky is somewhere on this diagram, at some stage of the same cosmic journey.
            </p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Approach
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              We query 50,000 nearby stars from the Gaia archive, compute their absolute magnitudes from parallax measurements, and present them in four coordinated views. Each star is coloured by temperature - blue-white for the hottest, yellow for Sun-like stars, orange and red for cooler stars.
            </p>
            <p>
              The visual encodings remain consistent across all views, so you can track individual stars as they move. The transitions are the key explanatory device - they show the relationship between position on the sky and position on the HR diagram, or between galactic structure and observer perspective.
            </p>
            <p>
              All rendering happens in WebGL on the GPU. 50,000 points updating 60 times per second, with smooth transitions and stable colour mapping. The performance headroom means the visualisation feels immediate - no lag, no stuttering.
            </p>
          </div>
        </div>
      </section>

      {/* The Data */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Data
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Gaia is an ESA space observatory launched in 2013. It measures stellar positions with microarcsecond precision, along with distances (via parallax), proper motions, radial velocities, and photometry. The mission&apos;s goal is to create the most accurate 3D map of the Milky Way.
            </p>
            <p>
              Data Release 3 (DR3), published in 2022, contains measurements for 1.8 billion stars. This visualisation uses a subset of approximately 50,000 stars within 200 parsecs of the Sun - close enough for accurate distance measurements, numerous enough to show clear structure.
            </p>
            <p>
              Each star&apos;s position on the HR diagram is computed from its BP-RP colour index (a proxy for temperature) and absolute magnitude (intrinsic brightness). Galactic coordinates are derived from right ascension and declination using standard coordinate transformations.
            </p>
          </div>
        </div>
      </section>

      {/* Going Deeper */}
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

      {/* Why Four Views? */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em]">
            Why Four Views?
          </h3>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Each view emphasises a different aspect of stellar properties. The sky view shows apparent position - where stars sit on the celestial sphere as seen from Earth. This is the view familiar to naked-eye observers.
            </p>
            <p>
              The HR diagram breaks free from apparent position and plots by intrinsic properties - temperature and luminosity. This reveals evolutionary state and physical structure that position alone can&apos;t show.
            </p>
            <p>
              The galactic view shows stars in galactic longitude and latitude, revealing the Milky Way&apos;s planar structure. Stars near the galactic plane (latitude near zero) form a horizontal concentration - we&apos;re looking along the disc.
            </p>
            <p>
              The observer view returns to an apparent perspective but emphasises colour and brightness with stronger visual encoding. It&apos;s designed to feel visceral - to make temperature differences immediately obvious.
            </p>
          </div>
        </div>
      </section>

      {/* Colour Mapping */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em]">
            Colour Mapping
          </h3>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Star colours are derived from Gaia&apos;s BP-RP colour index - the difference between blue and red photometry. This is a proxy for temperature: hot stars have negative BP-RP (more blue than red), cool stars have positive BP-RP (more red than blue).
            </p>
            <p>
              We use two colour mappings. The subtle map (used in sky, HR, and galactic views) preserves scientific accuracy but stays muted - it won&apos;t blow out your retinas. The observer map uses stronger saturation to make temperature differences more obvious.
            </p>
            <p>
              The galactic view adds a subtle tint based on latitude - warmer tones near the galactic plane (rich with young, hot stars), cooler tones at high latitudes. This is aesthetic, not data-driven, but it helps the eye parse structure.
            </p>
          </div>
        </div>
      </section>

      {/* Further Exploration */}
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
                      href="https://www.cosmos.esa.int/web/gaia/data-release-3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      Gaia Data Release 3
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">European Space Agency</span>
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
                      href="/work/gravitational-wave"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Gravitational Wave Detection →
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
