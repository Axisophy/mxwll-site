'use client'

import { useState } from 'react'
import WorkCard from '@/components/WorkCard'
import WorkFilter from '@/components/WorkFilter'

const allWork = [
  {
    title: 'Solar Wavelength',
    description: 'The same solar moment across multiple wavelengths. A demo loop that crossfades between extreme ultraviolet channels to reveal changing solar structure and temperature layers.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'solar-wavelength',
    label: 'In Development',
    tags: ['Astronomy', 'Data Visualisation', 'Canvas'],
  },
  {
    title: 'The Permissible Universe',
    description: 'A map of everything that can exist - from quarks to supermassive black holes. Explore 200+ cosmic objects positioned according to fundamental physical limits. The boundaries show where nature draws the line.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'permissible-universe',
    label: 'In Development',
    tags: ['Astrophysics', 'Interactive', 'Systems Thinking'],
  },
  {
    title: 'Chart of Nuclides',
    description: 'From the familiar periodic table to the vast landscape of 3,300+ atomic species. An interactive explorer that reveals what makes atoms stable or unstable - and why it matters.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'chart-of-nuclides',
    label: 'A Beginner\'s Guide',
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
    title: 'Gravitational Wave Detection',
    description: 'On 14 September 2015, two black holes collided. LIGO caught the signal - barely. This interactive recreates the moment of discovery, from raw noise to the chirp that confirmed Einstein was right.',
    category: 'EXPLANATION DESIGN',
    year: '2026',
    slug: 'gravitational-wave',
    label: 'How LIGO found a whisper from 1.3 billion years ago',
    tags: ['Astronomy', 'Interactive', 'WebAudio'],
  },
  {
    title: 'Network Effects and Market Timing',
    description: 'Google wasn\'t first. Facebook wasn\'t first. iPhone wasn\'t first. A strategic framework explaining why they won - designed for business leaders who need to understand network dynamics.',
    category: 'STRATEGY',
    year: '2025',
    slug: 'network-effects',
    label: 'Why your competitor\'s head start doesn\'t matter',
    tags: ['Strategy', 'Interactive', 'Explanation Design'],
  },
  {
    title: 'Orbital Mechanics',
    description: 'How spacecraft navigate - from the counterintuitive physics of orbits to the elegant mathematics of getting to the Moon. Why slowing down makes you go faster, and why the shortest path is never a straight line.',
    category: 'EXPLANATION DESIGN',
    year: '2025',
    slug: 'orbital-mechanics',
    label: 'A Beginner\'s Guide',
    tags: ['Space', 'Interactive', 'Explanation Design'],
  },
  {
    title: 'What\'s Inside Your Console?',
    description: 'You use it every day to play games. But what\'s actually happening inside that box? An explanation designed to make computing hardware genuinely interesting to kids.',
    category: 'EXPLANATION DESIGN',
    year: '2025',
    slug: 'whats-inside-your-console',
    label: 'A guide for gamers aged 8-12',
    tags: ['Technology', 'Interactive', 'Kids (8-12)'],
  },
]

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
          <p className="font-sabon text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
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
          <div className="grid grid-cols-1 gap-px">
            {filteredWork.map((work) => (
              <WorkCard key={work.slug} {...work} />
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
