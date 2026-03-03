'use client'

import dynamic from 'next/dynamic'

const LissajousVisualiser = dynamic(
  () => import('@/visualisers/lissajous/core/LissajousVisualiser'),
  { ssr: false }
)

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            Lissajous
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            Harmonograph and parametric curves
          </p>
          <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6">
            Two perpendicular oscillations trace geometric figures determined entirely by their frequency ratio. Simple ratios like 1:2 and 2:3 produce closed curves with musical interval equivalents - the octave and the perfect fifth. Add damping and you get a harmonograph: a mechanical drawing instrument that creates slowly decaying spirographic patterns.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Canvas 2D</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Mathematics</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Generative</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="h-[500px] md:h-[700px] lg:h-[800px]">
            <LissajousVisualiser />
          </div>
        </div>
      </section>
    </main>
  )
}
