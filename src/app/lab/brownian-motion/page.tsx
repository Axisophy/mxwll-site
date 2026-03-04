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
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Canvas 2D</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Physics</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Simulation</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="aspect-[4/3] max-h-[80vh]">
            <BrownianMotionVisualiser />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl space-y-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            In 1827, Robert Brown observed pollen grains jittering erratically in water under a microscope. The motion appeared spontaneous and perpetual, and no one could explain it. Nearly eighty years later, in 1905, Einstein published a theoretical explanation: the visible grains were being bombarded by invisible water molecules, and their erratic path was a statistical consequence of millions of random collisions per second.
          </p>
          <p>
            Einstein&apos;s key prediction was quantitative: the mean squared displacement of a Brownian particle grows linearly with time. This relationship - MSD = 2dDt, where d is the number of dimensions and D the diffusion coefficient - gave experimentalists something measurable. In 1908, Jean Perrin confirmed the prediction with painstaking microscope observations, providing decisive evidence that atoms and molecules were real physical objects, not merely useful fictions. He received the Nobel Prize in 1926 for this work.
          </p>
          <p>
            Brownian motion now underpins fields far beyond physics. In finance, it models stock price fluctuations (the Black-Scholes equation). In biology, it describes molecular diffusion inside cells. In computer science, random walks solve problems from network routing to Monte Carlo simulation. The same mathematics connects pollen grains in a water droplet to option pricing on Wall Street.
          </p>
        </div>
      </section>
    </main>
  )
}
