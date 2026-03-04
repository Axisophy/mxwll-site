'use client'

import dynamic from 'next/dynamic'

const PhyllotaxisVisualiser = dynamic(
  () => import('@/visualisers/phyllotaxis/core/PhyllotaxisVisualiser'),
  { ssr: false }
)

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            Phyllotaxis
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            Golden angle seed packing
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Canvas 2D</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Mathematics</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Generative</span>
          </div>
        </div>
      </section>

      {/* Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="aspect-square max-h-[80vh]">
            <PhyllotaxisVisualiser />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl space-y-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            Plants pack seeds using a single angle - approximately 137.507764°. This is the golden angle: 360° divided by the golden ratio squared. It produces the most efficient packing because it is the most irrational number - the hardest to approximate with simple fractions - meaning seeds never line up in wasteful radial spokes.
          </p>
          <p>
            The Fibonacci connection isn&apos;t a coincidence. Count the spirals in a sunflower head and you&apos;ll find consecutive Fibonacci numbers - 34 clockwise and 55 anticlockwise, or 55 and 89. These spirals are an emergent consequence of golden-angle packing, not a template the plant follows. The numbers appear because Fibonacci ratios are the best rational approximations to the golden ratio.
          </p>
          <p>
            The biological mechanism is remarkably simple. New primordia (seed buds) form at the growth tip and are pushed outward by subsequent growth. Chemical inhibitors ensure each new primordium forms as far as possible from existing ones. This greedy algorithm, iterated thousands of times, converges on the golden angle without any global plan - an example of how local rules produce global order.
          </p>
        </div>
      </section>
    </main>
  )
}
