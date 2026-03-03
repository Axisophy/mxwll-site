'use client'

import dynamic from 'next/dynamic'

const OrbitalResonanceVisualiser = dynamic(
  () => import('@/visualisers/orbital-resonance/core/OrbitalResonanceVisualiser'),
  { ssr: false }
)

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            Orbital Resonance
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            When orbits lock into harmony
          </p>
          <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6">
            Orbital resonance occurs when orbiting bodies exert regular gravitational influence on each other, locking their periods into simple ratios. Jupiter's moons Io, Europa, and Ganymede orbit in a precise 1:2:4 pattern - the Laplace resonance. This isn't coincidence but a dynamical trap: the same mechanism that drives Io's extreme volcanism and keeps Europa's ocean liquid.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Canvas 2D</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Astronomy</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Simulation</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="h-[500px] md:h-[700px] lg:h-[800px]">
            <OrbitalResonanceVisualiser />
          </div>
        </div>
      </section>
    </main>
  )
}
