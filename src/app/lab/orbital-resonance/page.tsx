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
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Canvas 2D</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astronomy</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Simulation</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="aspect-square max-h-[80vh]">
            <OrbitalResonanceVisualiser />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl space-y-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            Jupiter&apos;s moons Io, Europa, and Ganymede orbit in a precise 1:2:4 ratio known as the Laplace resonance. For every orbit Ganymede completes, Europa completes exactly two and Io exactly four. This is not a coincidence but a dynamical trap: the three moons exchange energy through regular gravitational tugs that maintain the lock over billions of years.
          </p>
          <p>
            Resonance can stabilise or destabilise, depending on the configuration. The Laplace resonance pumps energy into Io&apos;s orbit, keeping it slightly eccentric. That eccentricity drives extreme tidal heating - enough to make Io the most volcanically active body in the solar system. The same mechanism keeps Europa&apos;s subsurface ocean liquid, making it one of the most promising places to search for extraterrestrial life.
          </p>
          <p>
            The same physics operates throughout the solar system. The Kirkwood gaps in the asteroid belt are orbits where asteroids would resonate with Jupiter at simple ratios (3:1, 5:2, 7:3) - these orbits become chaotic over millions of years, ejecting asteroids and leaving empty lanes. Pluto and Neptune share a 2:3 resonance that prevents them from ever colliding despite their crossing orbits. Resonance is the solar system&apos;s organising principle: the invisible hand that sculpts order from gravitational chaos.
          </p>
        </div>
      </section>
    </main>
  )
}
