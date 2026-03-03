'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import MetadataDropdown from '@/components/MetadataDropdown'

const AnnotatedHRDiagram = dynamic(
  () => import('@/visualisers/stellar-evolution/core/components/AnnotatedHRDiagram').then(m => m.AnnotatedHRDiagram),
  { ssr: false }
)

const FamousStarsExplorer = dynamic(
  () => import('@/visualisers/stellar-evolution/core/components/FamousStarsExplorer').then(m => m.FamousStarsExplorer),
  { ssr: false }
)

const SolarEvolutionPathway = dynamic(
  () => import('@/visualisers/stellar-evolution/core/components/SolarEvolutionPathway').then(m => m.SolarEvolutionPathway),
  { ssr: false }
)

const StellarPathways = dynamic(
  () => import('@/visualisers/stellar-evolution/core/components/StellarPathways').then(m => m.StellarPathways),
  { ssr: false }
)

export default function StellarEvolutionPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const handleCanPlayThrough = () => {
    setIsVideoReady(true)
    videoRef.current?.play()
    setTimeout(() => {
      setShowOverlay(true)
    }, 2500)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header with Metadata Sidebar */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left column - Title and description */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]">
              Stellar Evolution
            </h1>
            <p className="font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2">
              A map of how stars live and die
            </p>
            <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12">
              An accessible guide to stellar lifecycles - from the hydrogen-burning main sequence to red giants, white dwarfs, and beyond. Using the Hertzsprung-Russell diagram as our map, we explore how every star in the night sky is on a journey through the same cosmic story.
            </p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8">
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Explanation Design</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Interactive</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astronomy</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className="space-y-6">
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Category
              </span>
              <span className="font-nhg text-sm">Explanation Design</span>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Audience
              </span>
              <MetadataDropdown title="Generally interested adults">
                <p>Curious people who know stars exist, have heard of red giants and black holes, but don&apos;t understand how stellar lifecycles actually work. They&apos;ve never seen an HR diagram or wouldn&apos;t know how to read one. The reward is understanding what astronomers see when they look at the night sky.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Approach
              </span>
              <MetadataDropdown>
                <p>The HR diagram is introduced as &quot;a map that shows every star&apos;s past and future&quot; - not &quot;astronomy&apos;s most powerful classification tool.&quot; We start with personal stake (the Sun will die), then progressively build understanding through concrete examples.</p>
                <p>Famous stars provide orientation. The Sun&apos;s evolutionary path shows that the diagram isn&apos;t static. Different mass stars show that initial conditions determine destiny.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Technology
              </span>
              <span className="font-nhg text-sm">React, Canvas, D3.js</span>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Data
              </span>
              <span className="font-nhg text-sm text-[var(--text-secondary)]">Gaia DR3 (3 million stars)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Hook */}
      <section className="relative h-[70vh] min-h-[500px] bg-black overflow-hidden">
        <video
          ref={videoRef}
          preload="auto"
          muted
          playsInline
          onCanPlayThrough={handleCanPlayThrough}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="https://bangindustries.co/video/hr_animation.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center text-white px-4">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-[-0.03em] leading-[1.1] mb-4">
              Stellar Evolution
            </h2>
            <p className="font-display text-xl md:text-2xl lg:text-3xl font-bold tracking-[-0.03em] text-white/80">
              A map of how stars live and die
            </p>
          </div>
        </div>
      </section>

      {/* Stars Don't Last Forever */}
      <section className="px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Stars Don&apos;t Last Forever
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              The Sun rises every morning. It&apos;s been doing that for as long as humans have existed, and for billions of years before that. It feels permanent - the most reliable thing in the sky.
            </p>
            <p>
              But the Sun is a fire, and fires run out of fuel.
            </p>
            <p>
              In about 5 billion years, the Sun will swell into a red giant, expanding past Mercury, past Venus, possibly engulfing Earth. Its outer layers will drift away as a glowing nebula. What&apos;s left will be a white dwarf - a dense ember the size of Earth, slowly cooling for eternity.
            </p>
            <p>
              Every star you see in the night sky is somewhere on this same journey. Some are young, burning hot and blue. Some are middle-aged like our Sun. Some are dying, swollen and red. Some are already dead - white dwarfs, neutron stars, black holes.
            </p>
            <p>
              <strong>There&apos;s a map that shows all of this at once.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* The Map - Annotated HR Diagram */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Map
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              A century ago, astronomers discovered something remarkable. If you plot stars by their colour (which tells you temperature) against their brightness, they don&apos;t scatter randomly. They cluster in patterns.
            </p>
            <p>
              Most stars fall on a diagonal band called the <strong>main sequence</strong> - that&apos;s where stars spend most of their lives, steadily burning hydrogen. Our Sun is there right now.
            </p>
            <p>
              But look at the corners. Top right: <strong>red giants</strong> - cool but enormously bright because they&apos;re huge. Bottom left: <strong>white dwarfs</strong> - hot but dim because they&apos;re tiny.
            </p>
            <p>
              This diagram isn&apos;t just a snapshot. It&apos;s a map of stellar lives. Where a star sits tells you what it&apos;s doing now. Where it will move tells you its future.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <AnnotatedHRDiagram />
        </div>
      </section>

      {/* Three Million Stars */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Three Million Stars
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              That&apos;s the theory. Here&apos;s the reality.
            </p>
            <p>
              This diagram shows three million real stars, measured by the Gaia space telescope with unprecedented precision. Every dot is an actual star in our galaxy.
            </p>
            <p>
              Notice how they cluster. The main sequence isn&apos;t a neat line - it&apos;s a dense river of stars, because that&apos;s where stars spend most of their lives. The giants and white dwarfs are sparser by comparison - those phases are brief.
            </p>
            <p>
              This is what the night sky looks like when you can see it all at once.
            </p>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden">
          <img
            src="/images/work/stellar-evolution/gaia-hr-3million.png"
            alt="HR diagram showing three million stars from Gaia telescope data"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Stars You Know - Famous Stars Explorer */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Stars You Know
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Let&apos;s find some familiar faces on this map.
            </p>
            <p>
              The Sun sits in the middle of the main sequence - a thoroughly average star. Sirius, the brightest star in our night sky, is hotter and brighter, sitting higher on the main sequence.
            </p>
            <p>
              Betelgeuse - the red shoulder of Orion - is a red supergiant in the top right. It&apos;s so large that if you put it where the Sun is, it would swallow Jupiter. It&apos;s near the end of its life and could explode as a supernova any time in the next hundred thousand years.
            </p>
            <p>
              And Sirius B, the white dwarf companion to Sirius, sits in the bottom left - the cooling remnant of a star that died long ago.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <FamousStarsExplorer />
        </div>
      </section>

      {/* The Sun's Future - Solar Evolution Pathway */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Sun&apos;s Future
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Stars don&apos;t stay in one place on this diagram. They move - slowly, over billions of years.
            </p>
            <p>
              The Sun has been on the main sequence for about 4.6 billion years. It will stay there for another 5 billion, steadily burning hydrogen in its core.
            </p>
            <p>
              Then things get dramatic.
            </p>
            <p>
              As the hydrogen runs out, the core contracts and heats up. The outer layers expand and cool. The Sun swells into a red giant, moving from the main sequence toward the top right of the diagram.
            </p>
            <p>
              At its largest, the Sun will be about 200 times its current size.
            </p>
            <p>
              Eventually, the outer layers drift away, leaving only the core - a white dwarf. The Sun slides down to the bottom left of the diagram, where it will slowly cool and fade over trillions of years.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <SolarEvolutionPathway />
        </div>
      </section>

      {/* Mass Is Destiny - Stellar Pathways */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Mass Is Destiny
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Not all stars end as white dwarfs. A star&apos;s mass at birth determines everything about its life - how long it lives, how brightly it burns, and how it dies.
            </p>
            <p>
              <strong>Small stars</strong> (less than half the Sun&apos;s mass) burn slowly and live for hundreds of billions of years - longer than the current age of the universe. They&apos;ll eventually become white dwarfs.
            </p>
            <p>
              <strong>Sun-like stars</strong> live about 10 billion years. Red giant, planetary nebula, white dwarf.
            </p>
            <p>
              <strong>Massive stars</strong> (8+ times the Sun&apos;s mass) live fast and die young - just millions of years. They swell into supergiants, then explode as supernovae. What&apos;s left is a neutron star (an unimaginably dense ball of neutrons) or, for the most massive stars, a black hole.
            </p>
            <p>
              The heavier you start, the more dramatic your ending.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <StellarPathways />
        </div>
      </section>

      {/* Reading the Night Sky */}
      <section className="px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-[var(--bg-tertiary)]">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Reading the Night Sky
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Look at the HR diagram now, and you see something different than you did ten minutes ago.
            </p>
            <p>
              You see a population - billions of stars, each on its own journey. The main sequence isn&apos;t just a cluster; it&apos;s where stars spend most of their lives. The outliers aren&apos;t random; they&apos;re stars at the beginning or end of their stories.
            </p>
            <p>
              You can find a star like Betelgeuse and know it&apos;s near death. You can find a white dwarf and know it&apos;s a stellar corpse. You can find a blue giant and know it&apos;s burning through its fuel at a furious rate.
            </p>
            <p className="text-[var(--text-primary)]">
              The night sky isn&apos;t static. It&apos;s a snapshot of stellar lives in progress. Now you can read it.
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

      {/* Spectral Classification */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em]">
            Spectral Classification
          </h3>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Astronomers classify stars by spectral type: O, B, A, F, G, K, M - from hottest to coolest. The Sun is a G-type star. The letters come from historical classification systems, which is why they&apos;re not in alphabetical order.
            </p>
            <p>
              A popular mnemonic: &quot;Oh Be A Fine Girl/Guy, Kiss Me.&quot;
            </p>
            <p>
              The spectral type appears along the top of the HR diagram, mapping temperature to colour. O stars are blue-white and scorching hot. M stars are red and relatively cool.
            </p>
          </div>
        </div>
      </section>

      {/* The Gaia Mission */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em]">
            The Gaia Mission
          </h3>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              The data behind these visualisations comes from the European Space Agency&apos;s Gaia spacecraft, which has measured the positions, distances, and brightnesses of nearly two billion stars with unprecedented precision.
            </p>
            <p>
              Before Gaia, accurate distances were only known for a few thousand nearby stars. Now we have reliable data for millions. This transforms the HR diagram from a schematic illustration into a genuine census of the stellar neighbourhood.
            </p>
          </div>
        </div>
      </section>

      {/* We Are Star Stuff */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em]">
            We Are Star Stuff
          </h3>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Stars don&apos;t just burn - they build. In their cores, they forge heavier elements from lighter ones. The Sun is currently fusing hydrogen into helium. Larger stars fuse helium into carbon, carbon into oxygen, all the way up to iron.
            </p>
            <p>
              Everything heavier than iron - gold, uranium, the iodine in your thyroid - is created in the violence of supernovae and neutron star collisions.
            </p>
            <p>
              The calcium in your bones, the iron in your blood, the oxygen you&apos;re breathing - all of it was forged inside stars that died before the Sun was born. We are, quite literally, made of star stuff.
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
                <h3 className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Recommended Reading
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="https://www.amazon.co.uk/Stars-Their-Courses-Jeans/dp/0521744180"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      The Life and Death of Stars - Kenneth R. Lang
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">Comprehensive but accessible</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Watch
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="https://www.youtube.com/watch?v=ld75W1dz-h0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      Kurzgesagt: The Life and Death of Stars
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">Beautifully animated overview</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Reference
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="https://en.wikipedia.org/wiki/Hertzsprung%E2%80%93Russell_diagram"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      Hertzsprung-Russell diagram (Wikipedia)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://gea.esac.esa.int/archive/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      Gaia Archive - ESA
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Related Work
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="/work/stellar-cartography"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Stellar Cartography &rarr;
                    </a>
                  </li>
                  <li>
                    <a
                      href="/work/nuclide-chart"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Chart of Nuclides &rarr;
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
