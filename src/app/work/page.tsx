'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import WorkCard from '@/components/WorkCard'
import WorkFilter from '@/components/WorkFilter'

const StellarDemo = dynamic(
  () => import('@/visualisers/stellar-cartography/demo/StellarDemo'),
  { ssr: false }
)

const SolarWorkDemo = dynamic(
  () => import('@/visualisers/solar-wavelength/demo/SolarWorkDemo'),
  { ssr: false }
)

const allWork = [
  {
    title: 'Stellar Cartography',
    description: '50,000 stars from the Gaia catalogue in four coordinated views - showing the same data arranged by position, temperature, galactic structure, and observer perspective. The transitions teach you what each view reveals.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'stellar-cartography',
    label: 'Four ways to see the same stars',
    tags: ['Astronomy', 'Data Visualisation', 'WebGL'],
  },
  {
    title: 'Gravitational Wave Detection',
    description: 'On 14 September 2015, two black holes collided. LIGO caught the signal - barely. This interactive recreates the moment of discovery, from raw noise to the chirp that confirmed Einstein was right.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'gravitational-wave',
    label: 'How LIGO found a whisper from 1.3 billion years ago',
    tags: ['Astronomy', 'Interactive', 'WebAudio'],
  },
  {
    title: 'Chart of Nuclides',
    description: 'From the familiar periodic table to the vast landscape of 3,300+ atomic species. An interactive explorer that reveals what makes atoms stable or unstable - and why it matters.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'nuclide-chart',
    label: '3,352 ways to build an atom',
    tags: ['Nuclear Physics', 'Interactive', 'Explanation Design'],
  },
  {
    title: 'Stellar Evolution',
    description: 'Using the Hertzsprung-Russell diagram to explore how every star in the night sky is on a journey through the same cosmic story - from birth in a nebula to death as a white dwarf, neutron star, or black hole.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'stellar-evolution',
    label: 'A map of how stars live and die',
    tags: ['Astronomy', 'Interactive', 'Explanation Design'],
  },
  {
    title: 'Exoplanet Systems',
    description: 'Real exoplanetary systems from the NASA archive, with transit depth visualisations and a discovery timeline. TRAPPIST-1 as the primary showcase - seven Earth-sized planets orbiting a single star.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'exoplanet-systems',
    label: 'A gallery of alien solar systems',
    tags: ['Astronomy', 'NASA Data', 'Interactive'],
  },
  {
    title: 'Solar Wavelength',
    description: 'The same solar moment across multiple wavelengths. A demo loop that crossfades between extreme ultraviolet channels to reveal changing solar structure and temperature layers.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'solar-wavelength',
    label: 'One moment, eight wavelengths',
    tags: ['Astronomy', 'Data Visualisation', 'Canvas'],
  },
]

// Map slugs to demo components for animated card backgrounds
const DEMO_CARDS: Record<string, React.ReactNode> = {
  'stellar-cartography': <StellarDemo className="w-full h-full" />,
  'stellar-evolution': <StellarDemo className="w-full h-full" />,
  'solar-wavelength': <SolarWorkDemo className="w-full h-full" />,
}

const categories = ['ALL', 'EXPLANATION DESIGN', 'STRATEGY']

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState('ALL')

  const filteredWork =
    activeCategory === 'ALL'
      ? allWork
      : allWork.filter((work) => work.category === activeCategory)

  return (
    <>
      {/* Intro */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8">
        <div className="max-w-3xl">
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
            Work across explanation design, data visualisation, interactive systems, and scientific illustration. Each project starts with the same question: what does the audience need to understand, and what&apos;s the clearest path to get them there?
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <WorkFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </section>

      {/* Work Grid */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        {filteredWork.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {filteredWork.map((work) => (
              <WorkCard key={work.slug} {...work} demoElement={DEMO_CARDS[work.slug]} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-lg text-[var(--text-secondary)]">
              No work found in this category.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
