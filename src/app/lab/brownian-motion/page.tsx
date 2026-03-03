'use client'

import dynamic from 'next/dynamic'

const BrownianMotionVisualiser = dynamic(
  () => import('@/visualisers/brownian-motion/core/BrownianMotionVisualiser'),
  { ssr: false }
)

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            Brownian Motion
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            The random walk that proved atoms exist
          </p>
          <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6">
            In 1905, Einstein showed that the erratic jittering of pollen grains in water could be explained by invisible molecular collisions. His prediction - that mean squared displacement grows linearly with time - was confirmed experimentally and became key evidence for atomic theory. Watch microscale collisions produce a macroscale random walk, then see the MSD law emerge.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Canvas 2D</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Physics</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Simulation</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="h-[500px] md:h-[700px] lg:h-[800px]">
            <BrownianMotionVisualiser />
          </div>
        </div>
        <div className="md:hidden mt-4 text-center">
          <p className="font-nhg text-xs italic text-[var(--text-tertiary)]">
            Best experienced on a larger screen for the split-panel view.
          </p>
        </div>
      </section>
    </main>
  )
}
