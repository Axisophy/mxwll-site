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
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Canvas 2D</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Mathematics</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Generative</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="aspect-square max-h-[80vh]">
            <LissajousVisualiser />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl space-y-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            Lissajous curves are the paths traced by a point subject to two perpendicular sinusoidal motions. The shape depends entirely on the frequency ratio and phase difference between the two oscillations. When the ratio is a simple fraction - 1:2, 2:3, 3:4 - the curve closes into a stable, repeating figure. When it is irrational, the curve never closes and eventually fills its bounding rectangle.
          </p>
          <p>
            Jules Antoine Lissajous demonstrated these figures in 1857 using a beam of light reflected between two vibrating mirrors set at right angles. The technique made sound waves visible for the first time. The same figures appear on oscilloscopes when comparing two signals: a perfect circle indicates two signals of equal frequency and 90° phase offset; a diagonal line means they are perfectly in phase or antiphase.
          </p>
          <p>
            The connection to music is direct. A frequency ratio of 1:2 is an octave, 2:3 is a perfect fifth, 3:4 is a perfect fourth. The harmonograph - a Victorian drawing machine using coupled pendulums - traces damped Lissajous figures, producing intricate spirographic patterns as energy slowly dissipates. The beauty of the resulting drawings comes from the same mathematics that makes musical intervals sound consonant.
          </p>
        </div>
      </section>
    </main>
  )
}
