'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import WorkCard from '@/components/WorkCard'

const StellarDemo = dynamic(() => import('@/visualisers/stellar-cartography/demo/StellarDemo'), { ssr: false })

const selectedWork = [
  {
    title: 'Chart of Nuclides',
    description: 'From the familiar periodic table to the vast landscape of 3,300+ atomic species. An interactive explorer that reveals what makes atoms stable or unstable - and why it matters.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'chart-of-nuclides',
    label: 'A Beginner\'s Guide',
  },
  {
    title: 'Stellar Evolution',
    description: 'Using the Hertzsprung-Russell diagram to explore how every star in the night sky is on a journey through the same cosmic story - from birth in a nebula to death as a white dwarf, neutron star, or black hole.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'stellar-evolution',
    label: 'A map of how stars live and die',
  },
  {
    title: 'Gravitational Wave Detection',
    description: 'On 14 September 2015, two black holes collided. LIGO caught the signal - barely. This interactive recreates the moment of discovery, from raw noise to the chirp that confirmed Einstein was right.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'gravitational-wave',
    label: 'How LIGO found a whisper from 1.3 billion years ago',
  },
  {
    title: 'Network Effects and Market Timing',
    description: 'Google wasn\'t first. Facebook wasn\'t first. iPhone wasn\'t first. A strategic framework explaining why they won - designed for business leaders who need to understand network dynamics.',
    category: 'STRATEGY',
    year: '2025',
    slug: 'network-effects',
    label: 'Why your competitor\'s head start doesn\'t matter',
  },
  {
    title: 'Orbital Mechanics',
    description: 'How spacecraft navigate - from the counterintuitive physics of orbits to the elegant mathematics of getting to the Moon. Why slowing down makes you go faster, and why the shortest path is never a straight line.',
    category: 'EXPLANATION DESIGN',
    year: '2025',
    slug: 'orbital-mechanics',
    label: 'A Beginner\'s Guide',
  },
  {
    title: 'What\'s Inside Your Console?',
    description: 'You use it every day to play games. But what\'s actually happening inside that box? An explanation designed to make computing hardware genuinely interesting to kids.',
    category: 'EXPLANATION DESIGN',
    year: '2025',
    slug: 'whats-inside-your-console',
    label: 'A guide for gamers aged 8-12',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          A digital laboratory for science, maths, and explanation design
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl">
          We make complex things visible - through interactive visualisation, illustration, and systematic design.
        </p>
      </section>

      {/* Stellar Cartography Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="bg-[#050508] overflow-hidden border border-[var(--border-light)]">
          <StellarDemo className="w-full h-full" />
        </div>
        <p className="font-mono text-[var(--text-xs)] text-[var(--text-tertiary)] mt-4 uppercase tracking-wider">
          STELLAR CARTOGRAPHY - 50,000 STARS FROM THE GAIA CATALOGUE
        </p>
      </section>

      {/* Selected Work */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-8">
          Selected Work
        </h2>
        <div className="grid grid-cols-1 gap-px">
          {selectedWork.map((work) => (
            <WorkCard key={work.slug} {...work} />
          ))}
        </div>
      </section>

      {/* Methodology Teaser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
            How we think about explanation
          </h2>
          <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            Most explanation fails not because the designer lacks skill, but because they&apos;ve forgotten what it&apos;s like not to understand. We start with the information gap - what your audience already knows versus what they need to - and design the shortest path between those two states.
          </p>
          <Link
            href="/method"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Read our methodology →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-3xl border-t border-[var(--border)] pt-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Have something complex to communicate?
          </h2>
          <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
            We work with research institutions, publishers, museums, and organisations who need to make difficult ideas clear. Start with a conversation.
          </p>
          <Link href="/contact" className="btn text-base px-8 py-3">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  )
}
