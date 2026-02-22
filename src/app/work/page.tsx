'use client'

import { useState } from 'react'
import WorkCard from '@/components/WorkCard'
import WorkFilter from '@/components/WorkFilter'

// Sample work data - will be replaced with CMS/database later
const allWork = [
  {
    title: 'Stellar Cartography',
    description: '50,000 stars from the Gaia catalogue, animated between sky view and HR diagram.',
    category: 'VISUALISERS',
    year: '2026',
    slug: 'stellar-cartography',
  },
  {
    title: 'Lorenz Attractor Visualisation',
    description: 'An interactive exploration of chaotic systems through the classic Lorenz attractor.',
    category: 'VISUALISERS',
    year: '2026',
    slug: 'lorenz-attractor',
  },
  {
    title: 'Reaction-Diffusion Systems',
    description: 'Exploring pattern formation in nature through simulation.',
    category: 'VISUALISERS',
    year: '2026',
    slug: 'reaction-diffusion',
  },
  {
    title: 'HR Diagram Interactive',
    description: 'Exploring stellar evolution through data visualisation.',
    category: 'VISUALISERS',
    year: '2025',
    slug: 'hr-diagram',
  },
  {
    title: 'Quantum Mechanics Visual Guide',
    description: 'Making quantum mechanics comprehensible through systematic illustration.',
    category: 'ILLUSTRATION',
    year: '2025',
    slug: 'quantum-guide',
  },
  {
    title: 'Cosmic Microwave Background',
    description: 'Visualising the oldest light in the universe.',
    category: 'ILLUSTRATION',
    year: '2025',
    slug: 'cmb',
  },
  {
    title: 'Periodic Table Redesign',
    description: 'A systematic approach to presenting the elements.',
    category: 'SYSTEMS',
    year: '2024',
    slug: 'periodic-table',
  },
  {
    title: 'Perlin Flow Fields',
    description: 'Experimenting with noise-based particle systems.',
    category: 'EXPERIMENTS',
    year: '2024',
    slug: 'perlin-flow',
  },
]

const categories = ['ALL', 'VISUALISERS', 'ILLUSTRATION', 'SYSTEMS', 'EXPERIMENTS']

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState('ALL')

  const filteredWork =
    activeCategory === 'ALL'
      ? allWork
      : allWork.filter((work) => work.category === activeCategory)

  return (
    <>
      {/* Filter Section */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
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
