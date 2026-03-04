'use client'

import dynamic from 'next/dynamic'
import MetadataDropdown from '@/components/MetadataDropdown'

const SpaceMissionTimeline = dynamic(
  () => import('@/visualisers/space-missions/core/SpaceMissionTimeline'),
  { ssr: false }
)

export default function SpaceMissionsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with Metadata Sidebar */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left column - Title and description */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]">
              Space Mission Timeline
            </h1>
            <p className="font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2">
              Seven decades of reaching beyond Earth
            </p>
            <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12">
              From Sputnik&apos;s beep in 1957 to the James Webb Space Telescope peering at the first
              galaxies, this timeline charts the missions that have defined our relationship with space.
              Over 120 missions across seven decades, filtered by destination, agency, and outcome.
            </p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8">
              <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Interactive</span>
              <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Scrollytelling</span>
              <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Space History</span>
              <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">SVG</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className="space-y-6">
            <div>
              <span className="font-label text-xs text-[var(--text-tertiary)] block mb-2">
                Category
              </span>
              <span className="font-nhg text-sm">Explanation Design</span>
            </div>
            <div>
              <span className="font-label text-xs text-[var(--text-tertiary)] block mb-2">
                Audience
              </span>
              <MetadataDropdown title="General / Science-curious">
                <p>Anyone interested in space exploration. The timeline is designed to work at two levels: a quick scroll reveals the shape of the Space Age at a glance, while clicking individual missions unlocks the stories behind them.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-label text-xs text-[var(--text-tertiary)] block mb-2">
                Approach
              </span>
              <MetadataDropdown>
                <p>A scrollytelling vertical timeline with missions colour-coded by destination. Scroll-triggered animations reveal missions as they enter the viewport, giving the timeline a sense of unfolding history.</p>
                <p>Filter controls allow exploration by destination, agency, decade, or outcome. Landmark missions carry extended narratives that tell the human stories behind the data.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-label text-xs text-[var(--text-tertiary)] block mb-2">
                Technology
              </span>
              <span className="font-nhg text-sm">React, SVG, TypeScript, Intersection Observer</span>
            </div>
            <div>
              <span className="font-label text-xs text-[var(--text-tertiary)] block mb-2">
                Data
              </span>
              <span className="font-nhg text-sm text-[var(--text-secondary)]">Curated from NASA, ESA, JAXA, and national space agency archives</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <SpaceMissionTimeline />
        <p className="font-label text-xs text-[var(--text-tertiary)] mt-4">
          INTERACTIVE SPACE MISSION TIMELINE - 1957 TO PRESENT - SCROLL TO EXPLORE
        </p>
      </section>

      {/* Why a Timeline */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Why a Timeline
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Space exploration is usually told as a series of isolated triumphs. First person in space. First Moon landing. First Mars rover. But when you place every mission on a single timeline, patterns emerge that individual stories cannot show.
            </p>
            <p>
              You see the frantic pace of the Space Race give way to the methodical exploration of the 1970s. You see the long gap after the Shuttle Challenger disaster. You see Mars missions clustering together every 26 months, when the planets align for efficient transfers. You see the sudden arrival of new space nations in the 2010s and 2020s - India, China, the UAE, Israel - transforming what was once a superpower duopoly.
            </p>
            <p>
              A timeline does not just record history. It reveals its rhythm.
            </p>
          </div>
        </div>
      </section>

      {/* The Colour of Destination */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Colour of Destination
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Each mission is colour-coded by where it went. Moon missions are silver. Mars is rust. Venus is gold. Jupiter is amber. Saturn is pale gold. The outer planets and Pluto are ice blue. Interstellar missions are white.
            </p>
            <p>
              This colour scheme is not arbitrary - it is drawn from the visual character of the destinations themselves. When you scroll through the timeline, the dominant colours shift. The silver of early lunar missions gives way to the rust of Mars exploration. Filter by destination and the timeline transforms into a focused narrative of humanity&apos;s relationship with a single world.
            </p>
          </div>
        </div>
      </section>

      {/* Success and Failure */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Success and Failure
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Not every mission succeeds. The timeline includes failures - Mars Climate Orbiter destroyed by a unit conversion error, Beresheet crashing on the Moon, Challenger breaking apart 73 seconds after launch. These are not footnotes. They are essential to understanding the difficulty of what space agencies attempt.
            </p>
            <p>
              Some of the most important stories are the partial successes. Apollo 13, which never reached the Moon but whose crew survived through extraordinary improvisation. Hayabusa, which suffered multiple system failures at asteroid Itokawa but still managed to return microscopic samples. Philae, which bounced into a shadowed crevice on a comet but transmitted 60 hours of data before its batteries died.
            </p>
            <p>
              Space exploration is hard. The timeline shows this honestly.
            </p>
          </div>
        </div>
      </section>

      {/* Going Deeper */}
      <section className="px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Going Deeper
          </h2>
          <p className="font-nhg text-[var(--text-tertiary)] text-sm">
            For the curious - you&apos;ve got the main idea, this is extra.
          </p>
        </div>
      </section>

      {/* The Mars Window */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em]">
            The Mars Window
          </h3>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Mars missions do not launch whenever engineers feel ready. They launch when orbital mechanics allow it. Earth and Mars align for efficient Hohmann transfer orbits roughly every 26 months - a window that lasts only a few weeks. Miss it and you wait two years.
            </p>
            <p>
              This is why Mars missions arrive in clusters. In 2020, three missions launched within ten days of each other: Hope (UAE), Tianwen-1 (China), and Perseverance (NASA). All three had to hit the same launch window. Filter the timeline to Mars and you can see this pattern repeating across decades - bursts of activity separated by years of waiting.
            </p>
          </div>
        </div>
      </section>

      {/* The Voyager Achievement */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em]">
            The Voyager Achievement
          </h3>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Voyager 2 is the only spacecraft in history to have visited all four giant planets. This was only possible because of a rare planetary alignment that occurs once every 175 years - Jupiter, Saturn, Uranus, and Neptune were arranged so that a spacecraft could use gravity assists to hop between them like stepping stones.
            </p>
            <p>
              The alignment was identified in the 1960s by Gary Flandro, a graduate student at JPL. NASA approved the mission, originally called the Grand Tour, and launched Voyager 2 in August 1977. It flew past Jupiter in 1979, Saturn in 1981, Uranus in 1986, and Neptune in 1989. No spacecraft has visited Uranus or Neptune since. Both Voyagers are now in interstellar space, still transmitting data nearly fifty years after launch.
            </p>
          </div>
        </div>
      </section>

      {/* Further Exploration */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24 pt-16 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Further Exploration
          </h2>
          <div>
            <div className="space-y-8">
              <div>
                <h3 className="font-label text-xs text-[var(--text-tertiary)] mb-4">
                  Data Sources
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="https://nssdc.gsfc.nasa.gov/planetary/chronology.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      NASA NSSDC Chronology of Planetary Exploration
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">NASA</span>
                  </li>
                  <li>
                    <a
                      href="https://www.esa.int/Science_Exploration/Space_Science"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      ESA Science &amp; Exploration
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">European Space Agency</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-label text-xs text-[var(--text-tertiary)] mb-4">
                  Related Work
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="/work/stellar-cartography"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Stellar Cartography →
                    </a>
                  </li>
                  <li>
                    <a
                      href="/lab/orbital-mechanics"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Orbital Mechanics →
                    </a>
                  </li>
                  <li>
                    <a
                      href="/lab/cosmic-distance-ladder"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Cosmic Distance Ladder →
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
