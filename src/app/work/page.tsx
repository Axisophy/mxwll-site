'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import WorkCard from '@/components/WorkCard'
import TagFilter from '@/components/TagFilter'

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
    tags: ['WebGL', 'Astronomy', 'Data Visualisation', 'Interactive', 'Gaia'],
    date: '2026-02',
  },
  {
    title: 'The Chirp',
    description: 'On 14 September 2015, two black holes collided 1.3 billion light-years away. LIGO caught the signal - barely. This interactive recreates the moment of discovery, from raw noise to the chirp that confirmed Einstein was right.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'gravitational-wave',
    label: 'How LIGO found a whisper from 1.3 billion years ago',
    tags: ['Canvas 2D', 'Web Audio', 'Physics', 'Interactive', 'Simulation'],
    date: '2026-02',
  },
  {
    title: 'Chart of Nuclides',
    description: 'From the familiar periodic table to the vast landscape of 3,300+ atomic species. An interactive explorer that reveals what makes atoms stable or unstable - and why it matters.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'nuclide-chart',
    label: '3,352 ways to build an atom',
    tags: ['SVG', 'Nuclear Physics', 'Interactive', 'Data Visualisation', 'IAEA'],
    date: '2026-02',
  },
  {
    title: 'Stellar Evolution',
    description: 'Using the Hertzsprung-Russell diagram to explore how every star in the night sky is on a journey through the same cosmic story - from birth in a nebula to death as a white dwarf, neutron star, or black hole.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'stellar-evolution',
    label: 'A map of how stars live and die',
    tags: ['SVG', 'Astronomy', 'Interactive', 'Data Visualisation', 'Gaia'],
    videoUrl: '/video/hr_animation.mp4',
    date: '2026-02',
  },
  {
    title: 'Exoplanet Systems',
    description: 'Real exoplanetary systems from the NASA archive, with transit depth visualisations and a discovery timeline. TRAPPIST-1 as the primary showcase - seven Earth-sized planets orbiting a single star.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'exoplanet-systems',
    label: 'A gallery of alien solar systems',
    tags: ['Canvas 2D', 'Astronomy', 'NASA Data', 'Interactive', 'Data Visualisation'],
    date: '2026-02',
  },
  {
    title: 'Solar Wavelength',
    description: 'The same solar moment across multiple wavelengths. A demo loop that crossfades between extreme ultraviolet channels to reveal changing solar structure and temperature layers.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'solar-wavelength',
    label: 'One moment, eight wavelengths',
    tags: ['Canvas 2D', 'Astronomy', 'SDO', 'Data Visualisation'],
    date: '2026-02',
  },
  {
    title: 'Space Mission Timeline',
    description: 'Seven decades of reaching beyond Earth. A scrollytelling timeline of over 120 missions from Sputnik to the James Webb Space Telescope, colour-coded by destination with filterable views.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'space-missions',
    label: 'Seven decades of reaching beyond Earth',
    tags: ['Scrollytelling', 'Space', 'NASA Data', 'Interactive', 'Data Visualisation'],
    date: '2026-03',
  },
  {
    title: 'Solar Activity',
    description: 'An interactive solar activity viewer spanning two solar cycles. Scrub through time to watch sunspots wax and wane, switch wavelength channels, and explore major flares and geomagnetic storms.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'solar-activity',
    label: 'The Sun in action across two solar cycles',
    tags: ['Canvas 2D', 'Astronomy', 'SDO', 'Interactive'],
    date: '2026-03',
  },
]

// Map slugs to demo components for animated card backgrounds
const DEMO_CARDS: Record<string, React.ReactNode> = {
  'stellar-cartography': <StellarDemo className="w-full h-full" />,
  'solar-wavelength': <SolarWorkDemo className="w-full h-full" />,
}

/** Build tag list with counts from project data */
function buildTagCounts(items: { tags: string[] }[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }))
}

export default function WorkPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const tagCounts = useMemo(() => buildTagCounts(allWork), [])

  const filteredWork = useMemo(() => {
    if (selectedTags.length === 0) return allWork
    // OR logic: show projects matching ANY selected tag
    return allWork.filter(work =>
      selectedTags.some(tag => work.tags.includes(tag))
    )
  }, [selectedTags])

  return (
    <>
      {/* Title + Filter */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-6">Work</h1>
        <TagFilter
          tags={tagCounts}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
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
              No work matches these tags.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
