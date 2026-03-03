'use client'

import dynamic from 'next/dynamic'

const SpaceFillingCurvesVisualiser = dynamic(
  () => import('@/visualisers/space-filling-curves/core/SpaceFillingCurvesVisualiser'),
  { ssr: false }
)

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            Space-filling Curves
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            One-dimensional lines that fill two-dimensional space
          </p>
          <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6">
            Hilbert and Peano curves are continuous paths that pass through every point in a square. Built recursively, each level of subdivision quadruples the detail. They preserve locality - nearby points on the curve stay nearby in 2D - making them essential tools for database indexing, image compression, and computational geometry.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Canvas 2D</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Mathematics</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Recursive</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="h-[500px] md:h-[700px] lg:h-[800px]">
            <SpaceFillingCurvesVisualiser />
          </div>
        </div>
        <div className="md:hidden mt-4 text-center">
          <p className="font-nhg text-xs italic text-[var(--text-tertiary)]">
            Higher recursion levels are best viewed on a larger screen.
          </p>
        </div>
      </section>
    </main>
  )
}
