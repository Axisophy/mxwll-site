'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const StellarDemo = dynamic(() => import('@/visualisers/stellar-cartography/demo/StellarDemo'), { ssr: false })

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] lg:max-w-[75%]">
          MXWLL makes complex things comprehensible.
          We&apos;re an independent design studio working at the intersection of data, science, and visual storytelling - building interactive visualisations, illustrations, and design systems for the ideas that are hardest to explain.
        </h1>
      </section>

      {/* Stellar Cartography */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <Link href="/work/stellar-cartography" className="block">
          <div className="relative bg-[#050508] overflow-hidden border border-[var(--border-light)] transition-colors hover:border-white/30">
            <StellarDemo className="w-full h-full" />
            <div className="absolute top-6 left-6">
              <h2 className="font-nhg text-2xl md:text-3xl font-bold text-white mb-1">
                Stellar Cartography
              </h2>
              <p className="font-nhg text-sm md:text-base text-white/70">
                50,000 stars from the GAIA catalogue
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* Chart of Nuclides */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <Link href="/work/nuclide-chart" className="block">
          <div className="relative bg-[#050508] overflow-hidden border border-[var(--border-light)] aspect-[16/9] transition-colors hover:border-white/30">
            <div className="absolute top-6 left-6">
              <h2 className="font-nhg text-2xl md:text-3xl font-bold text-white mb-1">
                Chart of Nuclides
              </h2>
              <p className="font-nhg text-sm md:text-base text-white/70">
                From the familiar periodic table to the vast landscape of 3,300+ atomic species. An interactive explorer that reveals what makes atoms stable or unstable - and why it matters.
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* Gravitational Wave Detection */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <Link href="/work/gravitational-wave" className="block">
          <div className="relative bg-[#050508] overflow-hidden border border-[var(--border-light)] aspect-[16/9] transition-colors hover:border-white/30">
            <div className="absolute top-6 left-6">
              <h2 className="font-nhg text-2xl md:text-3xl font-bold text-white mb-1">
                Gravitational Wave Detection
              </h2>
              <p className="font-nhg text-sm md:text-base text-white/70">
                On 14 September 2015, two black holes collided. LIGO caught the signal - barely. This interactive recreates the moment of discovery, from raw noise to the chirp that confirmed Einstein was right.
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* Permissible Universe */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <Link href="/work/permissible-universe" className="block">
          <div className="relative bg-[#050508] overflow-hidden border border-[var(--border-light)] aspect-[16/9] transition-colors hover:border-white/30">
            <div className="absolute top-6 left-6">
              <h2 className="font-nhg text-2xl md:text-3xl font-bold text-white mb-1">
                The Permissible Universe
              </h2>
              <p className="font-nhg text-sm md:text-base text-white/70">
                A map of everything that can exist - from quarks to supermassive black holes. Explore 200+ cosmic objects positioned according to fundamental physical limits. The boundaries show where nature draws the line.
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* Phylogenetic Trees */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="relative bg-[#050508] overflow-hidden border border-[var(--border-light)] aspect-[16/9]">
          <div className="absolute top-6 left-6">
            <h2 className="font-nhg text-2xl md:text-3xl font-bold text-white mb-1">
              Phylogenetic Trees
            </h2>
            <p className="font-nhg text-sm md:text-base text-white/70">
              Placeholder secondary text for phylogenetic trees visualisation
            </p>
          </div>
        </div>
      </section>

      {/* Illustrations */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="relative bg-[#050508] overflow-hidden border border-[var(--border-light)] aspect-[16/9]">
          <div className="absolute top-6 left-6">
            <h2 className="font-nhg text-2xl md:text-3xl font-bold text-white mb-1">
              Illustrations
            </h2>
            <p className="font-nhg text-sm md:text-base text-white/70">
              Placeholder secondary text for illustrations showcase
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
