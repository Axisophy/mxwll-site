'use client';

import { useRef, useState } from 'react';
import { AnnotatedHRDiagram } from './components/AnnotatedHRDiagram';
import { FamousStarsExplorer } from './components/FamousStarsExplorer';
import { SolarEvolutionPathway } from './components/SolarEvolutionPathway';
import { StellarPathways } from './components/StellarPathways';

function MetadataDropdown({ title, children }: { title?: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center ${title ? 'justify-between w-full' : ''} text-left`}
      >
        {title && <span className='text-sm'>{title}</span>}
        <svg
          className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='square' strokeLinejoin='miter' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>
      {isOpen && (
        <div className='text-xs text-white/60 mt-2 leading-relaxed space-y-2'>
          {children}
        </div>
      )}
    </div>
  );
}

export default function StellarEvolutionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleCanPlayThrough = () => {
    setIsVideoReady(true);
    videoRef.current?.play();
    setTimeout(() => {
      setShowOverlay(true);
    }, 2500);
  };

  return (
    <main className='min-h-screen bg-black'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              Stellar Evolution
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              A map of how stars live and die
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              An accessible guide to stellar lifecycles  - from the hydrogen-burning main sequence to red giants, white dwarfs, and beyond. Using the Hertzsprung-Russell diagram as our map, we&apos;ll explore how every star in the night sky is on a journey through the same cosmic story.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Explanation Design</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Astronomy</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className='space-y-6'>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Category
              </span>
              <span className='text-sm'>Explanation Design</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Audience
              </span>
              <MetadataDropdown title='Generally interested adults'>
                <p>Curious people who know stars exist, have heard of red giants and black holes, but don&apos;t understand how stellar lifecycles actually work. They&apos;ve never seen an HR diagram or wouldn&apos;t know how to read one. The reward is understanding what astronomers see when they look at the night sky.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>The HR diagram is introduced as &quot;a map that shows every star&apos;s past and future&quot; - not &quot;astronomy&apos;s most powerful classification tool.&quot; We start with personal stake (the Sun will die), then progressively build understanding through concrete examples.</p>
                <p>Famous stars provide orientation. The Sun&apos;s evolutionary path shows that the diagram isn&apos;t static. Different mass stars show that initial conditions determine destiny.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Adaptability
              </span>
              <MetadataDropdown>
                <p>This approach - personal stake first, then concrete examples, then systematic understanding - works for any classification system where position reveals history and destiny. Geological strata, phylogenetic trees, economic mobility charts.</p>
                <p>It wouldn&apos;t suit purely abstract classification systems without a temporal or narrative dimension.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>React, Canvas, D3.js</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Data
              </span>
              <span className='text-sm text-white/70'>GAIA DR3 (3 million stars)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 1: HOOK - Video/Visual */}
      <section className='relative h-[70vh] min-h-[500px] bg-black overflow-hidden'>
        {/* HR Animation Video */}
        <video
          ref={videoRef}
          preload='auto'
          muted
          playsInline
          onCanPlayThrough={handleCanPlayThrough}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src='https://bangindustries.co/video/hr_animation.mp4' type='video/mp4' />
        </video>
        <div className='absolute inset-0 bg-black/30' />
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}>
          <div className='text-center text-white px-4'>
            <h2 className='font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-4'>
              Stellar Evolution
            </h2>
            <p className='font-display text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white/80'>
              A map of how stars live and die
            </p>
          </div>
        </div>
      </section>

      {/* Stage 2: ANCHOR - "Stars Don't Last Forever" */}
      <section className='px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Stars Don&apos;t Last Forever
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The Sun rises every morning. It&apos;s been doing that for as long as humans have existed, and for billions of years before that. It feels permanent  - the most reliable thing in the sky.
            </p>
            <p>
              But the Sun is a fire, and fires run out of fuel.
            </p>
            <p>
              In about 5 billion years, the Sun will swell into a red giant, expanding past Mercury, past Venus, possibly engulfing Earth. Its outer layers will drift away as a glowing nebula. What&apos;s left will be a white dwarf  - a dense ember the size of Earth, slowly cooling for eternity.
            </p>
            <p>
              Every star you see in the night sky is somewhere on this same journey. Some are young, burning hot and blue. Some are middle-aged like our Sun. Some are dying, swollen and red. Some are already dead  - white dwarfs, neutron stars, black holes.
            </p>
            <p>
              <strong>There&apos;s a map that shows all of this at once.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Stage 3: FOUNDATION - "The Map" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Map
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              A century ago, astronomers discovered something remarkable. If you plot stars by their colour (which tells you temperature) against their brightness, they don&apos;t scatter randomly. They cluster in patterns.
            </p>
            <p>
              Most stars fall on a diagonal band called the <strong>main sequence</strong>  - that&apos;s where stars spend most of their lives, steadily burning hydrogen. Our Sun is there right now.
            </p>
            <p>
              But look at the corners. Top right: <strong>red giants</strong>  - cool but enormously bright because they&apos;re huge. Bottom left: <strong>white dwarfs</strong>  - hot but dim because they&apos;re tiny.
            </p>
            <p>
              This diagram isn&apos;t just a snapshot. It&apos;s a map of stellar lives. Where a star sits tells you what it&apos;s doing now. Where it will move tells you its future.
            </p>
          </div>
        </div>
        <AnnotatedHRDiagram />
      </section>

      {/* THREE MILLION STARS */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Three Million Stars
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              That&apos;s the theory. Here&apos;s the reality.
            </p>
            <p>
              This diagram shows three million real stars, measured by the GAIA space telescope with unprecedented precision. Every dot is an actual star in our galaxy.
            </p>
            <p>
              Notice how they cluster. The main sequence isn&apos;t a neat line  - it&apos;s a dense river of stars, because that&apos;s where stars spend most of their lives. The giants and white dwarfs are sparser by comparison  - those phases are brief.
            </p>
            <p>
              This is what the night sky looks like when you can see it all at once.
            </p>
          </div>
        </div>
        <img
          src='/images/work/stellar-evolution/gaia-hr-3million.png'
          alt='HR diagram showing three million stars from GAIA telescope data'
          className='w-full h-auto'
        />
      </section>

      {/* Stage 4a: BUILD - "Stars You Know" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Stars You Know
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Let&apos;s find some familiar faces on this map.
            </p>
            <p>
              The Sun sits in the middle of the main sequence  - a thoroughly average star. Sirius, the brightest star in our night sky, is hotter and brighter, sitting higher on the main sequence.
            </p>
            <p>
              Betelgeuse  - the red shoulder of Orion  - is a red supergiant in the top right. It&apos;s so large that if you put it where the Sun is, it would swallow Jupiter. It&apos;s near the end of its life and could explode as a supernova any time in the next hundred thousand years.
            </p>
            <p>
              And Sirius B, the white dwarf companion to Sirius, sits in the bottom left  - the cooling remnant of a star that died long ago.
            </p>
          </div>
        </div>
        <FamousStarsExplorer />
      </section>

      {/* Stage 4b: BUILD - "The Sun's Future" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Sun&apos;s Future
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Stars don&apos;t stay in one place on this diagram. They move  - slowly, over billions of years.
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
              Eventually, the outer layers drift away, leaving only the core  - a white dwarf. The Sun slides down to the bottom left of the diagram, where it will slowly cool and fade over trillions of years.
            </p>
          </div>
        </div>
        <SolarEvolutionPathway />
      </section>

      {/* Stage 4c: BUILD - "Mass Is Destiny" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Mass Is Destiny
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Not all stars end as white dwarfs. A star&apos;s mass at birth determines everything about its life  - how long it lives, how brightly it burns, and how it dies.
            </p>
            <p>
              <strong>Small stars</strong> (less than half the Sun&apos;s mass) burn slowly and live for hundreds of billions of years  - longer than the current age of the universe. They&apos;ll eventually become white dwarfs.
            </p>
            <p>
              <strong>Sun-like stars</strong> live about 10 billion years. Red giant, planetary nebula, white dwarf.
            </p>
            <p>
              <strong>Massive stars</strong> (8+ times the Sun&apos;s mass) live fast and die young  - just millions of years. They swell into supergiants, then explode as supernovae. What&apos;s left is a neutron star (an unimaginably dense ball of neutrons) or, for the most massive stars, a black hole.
            </p>
            <p>
              The heavier you start, the more dramatic your ending.
            </p>
          </div>
        </div>
        <StellarPathways />
      </section>

      {/* Stage 5: REWARD - "Reading the Night Sky" */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-black text-white'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Reading the Night Sky
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Look at the HR diagram now, and you see something different than you did ten minutes ago.
            </p>
            <p>
              You see a population  - billions of stars, each on its own journey. The main sequence isn&apos;t just a cluster; it&apos;s where stars spend most of their lives. The outliers aren&apos;t random; they&apos;re stars at the beginning or end of their stories.
            </p>
            <p>
              You can find a star like Betelgeuse and know it&apos;s near death. You can find a white dwarf and know it&apos;s a stellar corpse. You can find a blue giant and know it&apos;s burning through its fuel at a furious rate.
            </p>
            <p className='text-white'>
              The night sky isn&apos;t static. It&apos;s a snapshot of stellar lives in progress. Now you can read it.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 6: EXTEND - Going Deeper */}
      <section className='px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Going Deeper
          </h2>
          <p className='text-white/50 text-sm'>
            For the curious  - you&apos;ve got the main idea, this is extra.
          </p>
        </div>
      </section>

      {/* 6a: Spectral Classification */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Spectral Classification
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Astronomers classify stars by spectral type: O, B, A, F, G, K, M  - from hottest to coolest. The Sun is a G-type star. The letters come from historical classification systems, which is why they&apos;re not in alphabetical order.
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

      {/* 6b: The Gaia Mission */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            The Gaia Mission
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The data behind these visualisations comes from the European Space Agency&apos;s Gaia spacecraft, which has measured the positions, distances, and brightnesses of nearly two billion stars with unprecedented precision.
            </p>
            <p>
              Before Gaia, accurate distances were only known for a few thousand nearby stars. Now we have reliable data for millions. This transforms the HR diagram from a schematic illustration into a genuine census of the stellar neighbourhood.
            </p>
          </div>
        </div>
      </section>

      {/* 6c: Stellar Nucleosynthesis */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            We Are Star Stuff
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Stars don&apos;t just burn  - they build. In their cores, they forge heavier elements from lighter ones. The Sun is currently fusing hydrogen into helium. Larger stars fuse helium into carbon, carbon into oxygen, all the way up to iron.
            </p>
            <p>
              Everything heavier than iron  - gold, uranium, the iodine in your thyroid  - is created in the violence of supernovae and neutron star collisions.
            </p>
            <p>
              The calcium in your bones, the iron in your blood, the oxygen you&apos;re breathing  - all of it was forged inside stars that died before the Sun was born. We are, quite literally, made of star stuff.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 7: LAUNCH - Further Exploration */}
      <section className='px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24 pt-16 md:pt-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Further Exploration
          </h2>
          <div>
            <div className='space-y-8'>
              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Recommended Reading
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='https://www.amazon.co.uk/Stars-Their-Courses-Jeans/dp/0521744180'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      The Life and Death of Stars  - Kenneth R. Lang
                    </a>
                    <span className='text-white/40 ml-2'>Comprehensive but accessible</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Watch
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='https://www.youtube.com/watch?v=ld75W1dz-h0'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Kurzgesagt: The Life and Death of Stars
                    </a>
                    <span className='text-white/40 ml-2'>Beautifully animated overview</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Reference
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Hertzsprung%E2%80%93Russell_diagram'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Hertzsprung-Russell diagram (Wikipedia)
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Stellar_evolution'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Stellar evolution (Wikipedia)
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://gea.esac.esa.int/archive/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Gaia Archive  - ESA
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Related Explainers
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='/work/fractals'
                      className='text-white/70 hover:text-[var(--color-pink)] transition-colors'
                    >
                      What are Fractals? →
                    </a>
                  </li>
                  <li>
                    <a
                      href='/work/nuclide-chart'
                      className='text-white/70 hover:text-[var(--color-pink)] transition-colors'
                    >
                      Chart of Nuclides →
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
