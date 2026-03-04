'use client'

import dynamic from 'next/dynamic'

const PenroseTilingVisualiser = dynamic(
  () => import('@/visualisers/penrose-tiling/core/PenroseTilingVisualiser'),
  { ssr: false }
)

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            Penrose Tiling
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            Aperiodic order from two tiles
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Canvas 2D</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Mathematics</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Aperiodic</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="aspect-square max-h-[80vh]">
            <PenroseTilingVisualiser />
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl space-y-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            Roger Penrose discovered in the 1970s that just two tile shapes - kites and darts, with specific matching rules - can cover the infinite plane without ever repeating. The pattern has fivefold rotational symmetry, which was thought impossible in crystallography. No finite region, no matter how large, determines the rest of the tiling: there are uncountably many distinct Penrose tilings, yet all share the same local structure.
          </p>
          <p>
            The tiling is generated through recursive deflation. Each kite and dart can be subdivided into smaller kites and darts according to fixed rules, and the subdivision can be repeated indefinitely. The ratio of kites to darts converges on the golden ratio, and the relative frequency of any local patch is determined by the same constant. The golden ratio is not incidental - it is woven into the geometry at every scale.
          </p>
          <p>
            In 1982, Dan Shechtman discovered a real material - an aluminium-manganese alloy - whose diffraction pattern showed the forbidden fivefold symmetry of a Penrose tiling. The crystallography community was hostile: Linus Pauling declared &quot;there is no such thing as quasicrystals, only quasi-scientists.&quot; Shechtman received the Nobel Prize in Chemistry in 2011. Quasicrystals have since been found in meteorites and are used in non-stick coatings and surgical instruments.
          </p>
        </div>
      </section>
    </main>
  )
}
