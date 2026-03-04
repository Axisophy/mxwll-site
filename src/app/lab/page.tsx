'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import TagFilter from '@/components/TagFilter'

const labItems = [
  // --- Live ---
  {
    title: 'The Permissible Universe',
    description: 'A map of everything that can exist - from quarks to supermassive black holes. ~200 cosmic objects positioned on a mass-radius diagram according to fundamental physical limits.',
    tags: ['SVG', 'Astrophysics', 'Interactive', 'Data Visualisation'],
    slug: '/lab/permissible-universe',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Cosmic Distance Ladder',
    description: 'A scrollytelling journey through the methods astronomers use to measure cosmic distances - from parallax to Cepheid variables to Type Ia supernovae to Hubble expansion.',
    tags: ['Canvas 2D', 'Astronomy', 'Scrollytelling', 'Interactive'],
    slug: '/lab/cosmic-distance-ladder',
    status: 'Live',
    date: '2026-03',
  },
  {
    title: 'Asteroid Belt',
    description: '50,000 asteroids rendered in real-time. Five views reveal orbital structure, Kirkwood gaps, asteroid families, near-Earth objects, and the history of discovery.',
    tags: ['WebGL', 'Astronomy', 'Simulation', 'NASA Data'],
    slug: '/lab/asteroid-belt',
    status: 'Live',
    date: '2026-03',
  },
  {
    title: 'Orbital Mechanics',
    description: 'How spacecraft navigate - from the counterintuitive physics of orbits to Hohmann transfers and gravity assists. An interactive transfer designer with real mission profiles.',
    tags: ['Canvas 2D', 'Physics', 'Simulation', 'Interactive', 'Space'],
    slug: '/lab/orbital-mechanics',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Fractals',
    description: 'Interactive Mandelbrot and Julia set explorers with real-time iteration, zoom, and multiple colour maps. Plus Koch snowflake construction and a natural fractals gallery.',
    tags: ['Canvas 2D', 'Mathematics', 'Generative', 'Interactive'],
    slug: '/lab/fractals',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Galaxy Merger',
    description: 'N-body simulation of two galaxies colliding. 100,000 particles with timeline scrubbing, speed control, and narrative event markers through the merger process.',
    tags: ['Three.js', 'Astronomy', 'Simulation', 'Generative'],
    slug: '/lab/galaxy-merger',
    status: 'Live',
    date: '2026-03',
  },
  {
    title: 'Decay Chain',
    description: 'Radioactive decay chain visualisation with a logarithmic time scrubber spanning femtoseconds to billions of years. Guided narrative mode and free exploration of isotope populations.',
    tags: ['Canvas 2D', 'Nuclear Physics', 'Interactive', 'Simulation'],
    slug: '/lab/decay-chain',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Network Theory',
    description: 'Interactive network topology comparison, epidemic spread simulation, and attack resilience testing. Force-directed graph layout with random vs scale-free network generation.',
    tags: ['SVG', 'Mathematics', 'Simulation', 'Interactive'],
    slug: '/lab/network-theory',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Seismic Anatomy',
    description: 'Earth cross-section with animated seismic wave propagation, synchronised seismograms across five stations, velocity profiles, and shadow zone visualisation.',
    tags: ['Canvas 2D', 'Earth Science', 'Interactive', 'Simulation'],
    slug: '/lab/seismic-anatomy',
    status: 'Live',
    date: '2026-03',
  },
  {
    title: 'Braess Paradox',
    description: 'The counterintuitive result where adding road capacity makes traffic worse. Case studies from Seoul, Stuttgart, and New York with interactive network flow simulation.',
    tags: ['Interactive', 'Game Theory', 'Mathematics', 'Simulation'],
    slug: '/lab/braess-paradox',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Network Effects',
    description: 'Why first-movers lose. A strategic framework for understanding network dynamics - from AltaVista to Google, MySpace to Facebook, Nokia to iPhone.',
    tags: ['Interactive', 'Economics', 'Data Visualisation'],
    slug: '/lab/network-effects',
    status: 'Live',
    date: '2025-11',
  },
  {
    title: 'Phyllotaxis',
    description: 'Golden angle seed packing - watch 1,200 seeds arrange themselves into the same spiral patterns found in sunflowers, pine cones, and succulents. Fibonacci spiral arms emerge naturally.',
    tags: ['Canvas 2D', 'Mathematics', 'Generative'],
    slug: '/lab/phyllotaxis',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Brownian Motion',
    description: 'The random walk that proved atoms exist. Dual-scale simulation showing microscale molecular collisions producing macroscale random walks, with live mean squared displacement verification.',
    tags: ['Canvas 2D', 'Physics', 'Simulation'],
    slug: '/lab/brownian-motion',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Penrose Tiling',
    description: 'Aperiodic order from two tiles. Watch recursive deflation build a pattern that has fivefold symmetry but never repeats - the same structure found in quasicrystals.',
    tags: ['Canvas 2D', 'Mathematics', 'Generative'],
    slug: '/lab/penrose-tiling',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Lissajous',
    description: 'Harmonograph and parametric curves. Two perpendicular oscillations trace geometric figures determined by their frequency ratio, from simple ratios to damped harmonograph decay.',
    tags: ['Canvas 2D', 'Mathematics', 'Generative'],
    slug: '/lab/lissajous',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Space-filling Curves',
    description: 'Hilbert and Peano curves - one-dimensional paths that visit every point in two-dimensional space. Watch recursive construction and see why they preserve locality.',
    tags: ['Canvas 2D', 'Mathematics', 'Generative'],
    slug: '/lab/space-filling-curves',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Orbital Resonance',
    description: 'When orbits lock into harmony. From Jupiter\'s Galilean moons in 1:2:4 resonance to TRAPPIST-1\'s seven-planet chain - see how simple period ratios create stable, repeating geometric patterns.',
    tags: ['Canvas 2D', 'Astronomy', 'Simulation'],
    slug: '/lab/orbital-resonance',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Solar System to Scale',
    description: 'Every planet drawn to its true relative size. Swipe through the solar system and feel the difference between Jupiter and Earth. Mercury is a speck.',
    tags: ['SVG', 'Astronomy', 'Interactive'],
    slug: '/lab/solar-system-scale',
    status: 'Live',
    date: '2026-03',
  },
  {
    title: 'Pulsar',
    description: 'A rotating neutron star with its radio beam sweeping past like a lighthouse. Drag to change spin speed, tilt to lose the signal. Three presets: normal pulsar, millisecond pulsar, magnetar.',
    tags: ['Three.js', 'Web Audio', 'Astrophysics', 'Simulation', 'Interactive'],
    slug: '/lab/pulsar',
    status: 'Live',
    date: '2026-03',
  },
  {
    title: 'Neutron Stars & Magnetars',
    description: 'The densest objects in the visible universe rendered as a WebGL2 particle system. Three states: quiet neutron star, active pulsar, and magnetar starquake with bloom post-processing.',
    tags: ['WebGL', 'Astrophysics', 'Simulation', 'GLSL'],
    slug: '/lab/neutron-stars',
    status: 'Live',
    date: '2026-03',
  },
  {
    title: 'Earth\'s Orbital Neighbourhood',
    description: 'Thousands of real satellites tracked in real time on a 3D globe. SGP4 propagation from CelesTrak TLE data, colour-coded by purpose, with constellation highlights and density view.',
    tags: ['Three.js', 'Space', 'NASA Data', 'Data Visualisation', 'Interactive'],
    slug: '/lab/satellite-tracker',
    status: 'Live',
    date: '2026-03',
  },
  // --- In Development ---
  {
    title: 'What\'s Inside Your Console?',
    description: 'You use it every day to play games. But what\'s actually happening inside that box? An explanation designed to make computing hardware genuinely interesting to kids aged 8-12.',
    tags: ['Interactive', 'Illustration'],
    slug: '#',
    status: 'In Development',
    date: '2026-03',
  },
  {
    title: 'Stellar Cartography',
    description: '50,000 stars from the ESA Gaia catalogue in four coordinated views. The transitions between sky, HR diagram, galactic, and observer views are the explanatory moment.',
    tags: ['WebGL', 'Gaia', 'Astronomy', 'Data Visualisation'],
    slug: '/work/stellar-cartography',
    status: 'Live',
    date: '2026-02',
  },
  {
    title: 'Emergent Currents',
    description: 'Particles tracing a divergence-free noise field. Curl noise produces organic, fluid-like motion - particles flowing through it never converge or diverge.',
    tags: ['WebGL', 'Generative', 'GLSL'],
    slug: '#',
    status: 'In Development',
    date: '2026-02',
  },
  {
    title: 'Lorenz Attractor',
    description: 'The butterfly effect made visible. A deterministic system that produces chaos - two trajectories starting a hair\'s breadth apart diverge completely.',
    tags: ['WebGL', 'Mathematics', 'Simulation', 'Generative'],
    slug: '#',
    status: 'In Development',
    date: '2026-02',
  },
  {
    title: 'Physarum',
    description: 'High-density slime mould simulation where agents deposit and follow chemical trails. Emergent networks resemble veins, rivers, and cosmic web structure.',
    tags: ['WebGL', 'Biology', 'Simulation', 'Generative', 'GLSL'],
    slug: '#',
    status: 'In Development',
    date: '2026-01',
  },
  {
    title: 'CMB Explorer',
    description: 'Planck Legacy CMB map rendered as an interactive sky globe with harmonic decomposition.',
    tags: ['Three.js', 'Astronomy', 'ESA', 'Data Visualisation'],
    slug: '#',
    status: 'In Development',
    date: '2026-01',
  },
]

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

/** Sort: Live first (newest first), then In Development (newest first) */
function sortedItems(items: typeof labItems) {
  return [...items].sort((a, b) => {
    // Status grouping: Live before In Development
    if (a.status !== b.status) {
      return a.status === 'Live' ? -1 : 1
    }
    // Within same status: newest date first
    return b.date.localeCompare(a.date)
  })
}

export default function LabPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const tagCounts = useMemo(() => buildTagCounts(labItems), [])

  const filteredItems = useMemo(() => {
    const base = selectedTags.length === 0
      ? labItems
      : labItems.filter(item =>
          selectedTags.some(tag => item.tags.includes(tag))
        )
    return sortedItems(base)
  }, [selectedTags])

  return (
    <div className="min-h-screen">
      {/* Title + Filter */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-6">Lab</h1>
        <TagFilter
          tags={tagCounts}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />
      </section>

      {/* Lab Items */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isLinked = item.slug !== '#'
              const leftContent = (
                <div
                  className={`
                    bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8
                    transition-colors duration-200
                    ${isLinked ? 'group-hover:bg-[#0055FF]' : ''}
                  `}
                >
                  <h2 className={`
                    font-nhg text-xl md:text-2xl font-medium text-[var(--text-primary)]
                    transition-colors duration-200
                    ${isLinked ? 'group-hover:text-white' : ''}
                  `}>
                    {item.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.status === 'Live' && (
                      <span className={`
                        font-label text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full
                        transition-colors duration-200
                        text-white bg-green-500
                        ${isLinked ? 'group-hover:bg-white/20 group-hover:text-white' : ''}
                      `}>
                        Live
                      </span>
                    )}
                    {item.status === 'In Development' && (
                      <span className="font-label text-[10px] uppercase tracking-wider text-white bg-orange-400 px-2.5 py-0.5 rounded-full">
                        In Development
                      </span>
                    )}
                  </div>
                </div>
              )

              return (
                <div
                  key={item.title}
                  className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4"
                >
                  {/* Left frame - Title and status */}
                  {isLinked ? (
                    <Link href={item.slug} className="group">
                      {leftContent}
                    </Link>
                  ) : (
                    <div>{leftContent}</div>
                  )}
                  {/* Right frame - Description and tags */}
                  <div className="bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
                    <p className="font-nhg text-[var(--text-secondary)] leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-label text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-lg text-[var(--text-secondary)]">
              No experiments match these tags.
            </p>
          </div>
        )}
      </section>

      {/* Note */}
      <section className="px-4 md:px-8 lg:px-12 pb-16">
        <div className="max-w-3xl">
          <p className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed">
            Lab projects are works in progress. Some will become client-ready tools. Some will remain experiments. All are built with real data and real science.
          </p>
        </div>
      </section>
    </div>
  )
}
