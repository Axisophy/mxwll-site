'use client'

import dynamic from 'next/dynamic'

const SolarSystemScale = dynamic(
  () => import('@/visualisers/solar-system-scale/core/SolarSystemScale'),
  { ssr: false }
)

export default function SolarSystemScalePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            Solar System to Scale
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            Every planet in the solar system, drawn to scale. Swipe to explore.
          </p>
          <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6">
            Textbooks almost never show the planets at their true relative sizes. When you see them drawn to scale, the solar system feels completely different. Jupiter is enormous. Earth is humbling. Mercury is a speck.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">SVG</span>
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astronomy</span>
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Mobile-First</span>
          </div>
        </div>
      </section>

      {/* Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <SolarSystemScale />
        <div className="hidden lg:block mt-4 text-center">
          <p className="font-nhg text-xs text-[var(--text-tertiary)]">
            Also works great on your phone. Use arrow keys or swipe to navigate.
          </p>
        </div>
      </section>

      {/* Explanatory content */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Why Scale Matters
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Almost every diagram of the solar system you have ever seen is wrong. Not because the facts are wrong, but because the sizes are. Textbooks draw the planets as neat, roughly similar circles. In reality, the differences are staggering.
            </p>
            <p>
              The Sun is so large that all eight planets could fit inside it - many times over. Jupiter alone is wider than eleven Earths laid side by side. Saturn, stripped of its rings, is still massive enough to swallow 764 Earths. And our home planet? It is a small blue marble, barely distinguishable in size from Venus.
            </p>
            <p>
              The reason textbooks cheat is practical: if you drew the planets to scale on a page, Mercury and Mars would be specks too small to label, while the Sun would extend far beyond the page edges. But this cheat robs you of the most important thing the solar system has to teach - just how vast the differences in scale really are.
            </p>
          </div>
        </div>
      </section>

      {/* Distance note */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            And That&apos;s Just Size
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              The distances are even harder to grasp. If the Sun were a football, Earth would be a peppercorn 26 metres away. Jupiter would be a conker 135 metres away. Neptune? A blueberry, nearly 800 metres from the football. You would need most of a kilometre to walk the solar system at this scale.
            </p>
            <p>
              Light itself takes over four hours to travel from the Sun to Neptune. The Voyager 1 spacecraft, the most distant human-made object, has been travelling for nearly fifty years and has barely left the Sun&apos;s gravitational influence.
            </p>
            <p>
              Scale is not a detail. It is the story.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
