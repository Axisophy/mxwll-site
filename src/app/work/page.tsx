'use client'

import { useState } from 'react'
import WorkCard from '@/components/WorkCard'
import WorkFilter from '@/components/WorkFilter'

// Sample work data - will be replaced with CMS/database later
const allWork = [
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
    <div className="min-h-screen py-16">
      <div className="container">
        {/* Large typographic filter */}
        <WorkFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Work grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWork.map((work) => (
            <WorkCard key={work.slug} {...work} />
          ))}
        </div>

        {/* No results message */}
        {filteredWork.length === 0 && (
          <div className="text-center py-24">
            <p className="text-xl text-[var(--text-secondary)]">
              No work found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
