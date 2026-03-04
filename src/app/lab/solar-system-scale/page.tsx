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
            Every planet drawn to its true relative size
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">SVG</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astronomy</span>
            <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Mobile-First</span>
          </div>
        </div>
      </section>

      {/* Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <SolarSystemScale />
      </section>

      {/* Description */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl space-y-12">
          <div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] mb-6">
              Why Scale Matters
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
              <p>
                Almost every diagram of the solar system you have ever seen is wrong. Not because the facts are wrong, but because the sizes are. Textbooks draw the planets as neat, roughly similar circles. In reality, the differences are staggering.
              </p>
              <p>
                Jupiter alone is wider than eleven Earths laid side by side. Saturn, stripped of its rings, is still massive enough to swallow 764 Earths. And our home planet? It is a small blue marble, barely distinguishable in size from Venus. The reason textbooks cheat is practical: if you drew the planets to scale on a page, Mercury and Mars would be specks too small to label. But this cheat robs you of the most important thing the solar system has to teach.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] mb-6">
              Two Families
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
              <p>
                The solar system divides neatly into two families. The inner planets - Mercury, Venus, Earth, Mars - are small, dense, and rocky. They formed close to the young Sun, where temperatures were too high for volatile gases to condense. The outer planets - Jupiter, Saturn, Uranus, Neptune - are enormous by comparison, composed mostly of hydrogen, helium, and ices. They formed beyond the &quot;frost line&quot;, where water and other volatiles could freeze into solid grains, providing extra material for planet-building.
              </p>
              <p>
                The size difference is not gradual. Mars, the largest inner planet, is 6,792 km across. Neptune, the smallest outer planet, is 49,528 km across - more than seven times wider. Jupiter, at 142,984 km, is twenty-one times the diameter of Mars. Swipe from Mars to Jupiter and you feel this jump viscerally: a small red marble gives way to a body that dominates the screen.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] mb-6">
              And That&apos;s Just Size
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
              <p>
                The distances are even harder to grasp. If the Sun were a football, Earth would be a peppercorn 26 metres away. Jupiter would be a conker 135 metres away. Neptune? A blueberry, nearly 800 metres from the football. You would need most of a kilometre to walk the solar system at this scale.
              </p>
              <p>
                Light itself takes over four hours to travel from the Sun to Neptune. The Voyager 1 spacecraft, the most distant human-made object, has been travelling for nearly fifty years and has barely left the Sun&apos;s gravitational influence. Scale is not a detail. It is the story.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
