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
          <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6">
            Plants pack seeds using a single angle - approximately 137.5°. This golden angle, derived from the golden ratio, produces the most efficient packing and creates the spiral patterns visible in sunflowers, pine cones, and succulents. Watch the pattern emerge, then see why non-golden angles fail.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Canvas 2D</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Mathematics</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Generative</span>
          </div>
        </div>
      </section>

      {/* Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="h-[500px] md:h-[700px] lg:h-[800px]">
            <PhyllotaxisVisualiser />
          </div>
        </div>
        <div className="md:hidden mt-4 text-center">
          <p className="font-nhg text-xs italic text-[var(--text-tertiary)]">
            Best experienced on a larger screen for full seed count.
          </p>
        </div>
      </section>
    </main>
  )
}
