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
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Canvas 2D</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Mathematics</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Recursive</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="aspect-square max-h-[80vh]">
            <SpaceFillingCurvesVisualiser />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl space-y-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            In 1890, Giuseppe Peano constructed a continuous curve that passes through every point in a unit square - a one-dimensional object that fills two-dimensional space. The result scandalised mathematicians who had assumed dimension was a straightforward concept. David Hilbert published a simpler variant in 1891, and the family of space-filling curves has grown to include dozens of variants, each with different properties.
          </p>
          <p>
            The key practical property is locality preservation. Nearby points on the Hilbert curve tend to stay nearby in two-dimensional space. This makes Hilbert curves valuable for mapping multidimensional data onto one dimension while keeping related items close together. Google&apos;s S2 geometry library uses Hilbert curves to index the surface of the Earth, enabling efficient spatial queries. Database systems use them for range queries on geospatial data.
          </p>
          <p>
            Space-filling curves also challenge our intuition about dimension. A curve is one-dimensional, a square two-dimensional - yet one can perfectly fill the other. The resolution comes from fractal geometry: the Hausdorff dimension of a space-filling curve is 2, not 1. It is topologically a curve but metrically a surface. This distinction, formalised by Hausdorff in 1918, was one of the insights that led to fractal geometry as a discipline.
          </p>
        </div>
      </section>
    </main>
  )
}
