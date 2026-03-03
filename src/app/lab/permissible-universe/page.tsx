'use client'

import dynamic from 'next/dynamic'

const PermissibleUniversePage = dynamic(
  () => import('@/visualisers/permissible-universe/core/PermissibleUniverse'),
  { ssr: false }
)

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            The Permissible Universe
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            A map of everything that can exist
          </p>
          <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6">
            An interactive mass-radius diagram showing ~200 cosmic objects from quarks to supermassive black holes, positioned according to fundamental physical limits.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astrophysics</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Interactive</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">SVG</span>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="h-[500px] md:h-[700px] lg:h-[800px]">
            <PermissibleUniversePage />
          </div>
        </div>
        <div className="md:hidden mt-4 text-center">
          <p className="font-nhg text-xs italic text-[var(--text-tertiary)]">
            This visualiser maps 200+ cosmic objects and is best experienced on a larger screen.
          </p>
        </div>
      </section>
    </main>
  )
}
