'use client'

import dynamic from 'next/dynamic'
import MetadataDropdown from '@/components/MetadataDropdown'

const GravitationalWaveExplorer = dynamic(
  () => import('@/visualisers/gravitational-wave/core/components/GravitationalWaveExplorer'),
  { ssr: false }
)

export default function GravitationalWavePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]">
          The Chirp
        </h1>
        <p className="font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2">
          How LIGO found a whisper from 1.3 billion years ago
        </p>
        <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12">
          On 14 September 2015, two black holes collided 1.3 billion light-years away. The collision was so violent it radiated more energy in 0.2 seconds than all the stars in the observable universe combined. LIGO caught it - barely. This interactive recreates the moment of discovery.
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8">
          <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Interactive</span>
          <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Scientific Data</span>
          <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">WebAudio</span>
          <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astronomy</span>
        </div>

        {/* Portfolio Metadata */}
        <div className="flex flex-wrap gap-x-12 gap-y-6 mt-8 md:mt-12">
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
            <MetadataDropdown title="General / Science-curious">
              <p>For people who know black holes exist and have heard of gravitational waves, but don&apos;t understand how detection works or why it&apos;s significant. The interactive shows the actual discovery process - how LIGO finds signals buried in noise.</p>
            </MetadataDropdown>
          </div>
          <div>
            <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
              Approach
            </span>
            <MetadataDropdown>
              <p>Progressive revelation through multi-representation. Start with raw detector readings (pure noise), reveal the predicted template, show the correlation process, then present the physical interpretation. Each stage builds understanding of how matched filtering works.</p>
              <p>Audio sonification makes the &quot;chirp&quot; visceral - you can hear the frequency rise as the black holes spiral inward.</p>
            </MetadataDropdown>
          </div>
          <div>
            <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
              Technology
            </span>
            <span className="font-nhg text-sm">React, Canvas 2D, Web Audio API</span>
          </div>
          <div>
            <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
              Data
            </span>
            <span className="font-nhg text-sm text-[var(--text-secondary)]">Mock (Post-Newtonian approximation)</span>
          </div>
        </div>
      </section>

      {/* Interactive Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="h-[500px] md:h-[750px] lg:h-[875px]">
            <GravitationalWaveExplorer />
          </div>
        </div>
        <p className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mt-4">
          INTERACTIVE - FOUR STAGES FROM RAW DATA TO INTERPRETATION
        </p>
      </section>

      {/* The Challenge */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Challenge
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed mt-6">
            <p>
              Gravitational waves compress and stretch spacetime by infinitesimal amounts. When GW150914 arrived, LIGO&apos;s 4-kilometre laser arms shifted by less than one-thousandth of a proton&apos;s diameter.
            </p>
            <p>
              Raw detector readings resembled pure noise - the signal remained invisible to direct observation. Two detectors, 3,000 kilometres apart, recorded near-identical noise patterns 6.9 milliseconds apart. That delay is how long the gravitational wave took to travel from Livingston, Louisiana to Hanford, Washington.
            </p>
          </div>
        </div>
      </section>

      {/* Matched Filtering */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Matched Filtering
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed mt-6">
            <p>
              LIGO employs matched filtering methodology. Einstein&apos;s equations precisely predict gravitational wave characteristics for merging black hole pairs. The distinctive &quot;chirp&quot; signal - frequency and amplitude increasing together - follows exact mathematical patterns determined by the masses and spins of the merging objects.
            </p>
            <p>
              By correlating predicted templates against noisy measurements, LIGO isolates buried signals. The process is like listening for a specific bird call in a crowded forest - if you know what it sounds like, you can find it even when everything else is louder.
            </p>
            <p>
              GW150914&apos;s correlation strength reached a signal-to-noise ratio of 24 - meaning the chance of random noise producing this match was less than 1 in 200,000 years of continuous data. The signal was real.
            </p>
          </div>
        </div>
      </section>

      {/* The Event */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Event
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed mt-6">
            <p>
              Two black holes - 36 and 29 solar masses - spiralled inward over millions of years. During their final fractional second, orbital speed approached half light-speed, completing dozens of cycles before merger.
            </p>
            <p>
              The resulting 62-solar-mass object released three solar masses as gravitational energy - more than 10&#x2074;&#x2077; joules - momentarily outshining all observable stars combined.
            </p>
            <p>
              After travelling 1.3 billion years while expanding with the universe, the wave reached Earth on 14 September 2015.
            </p>
          </div>
        </div>
      </section>

      {/* What This Means */}
      <section className="px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24">
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
              What This Means
            </h2>
            <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed mt-6">
              <p>
                GW150914 was the first direct detection of gravitational waves - confirming a century-old prediction by Einstein. But it also opened a new way of observing the universe. Light can&apos;t escape black holes. Gravitational waves can.
              </p>
              <p>
                Rainer Weiss, Kip Thorne, and Barry Barish received the 2017 Nobel Prize in Physics for the detection.
              </p>
              <p className="text-[var(--text-primary)]">
                We can now &quot;hear&quot; events that were previously invisible. LIGO has since detected dozens of black hole mergers and neutron star collisions. Each one reveals physics that was inaccessible before September 2015.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Going Deeper */}
      <section className="px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Going Deeper
          </h2>
          <p className="font-nhg text-[var(--text-tertiary)] text-sm mt-4">
            For the curious - you&apos;ve got the main idea, this is extra.
          </p>
        </div>
      </section>

      {/* How LIGO Works */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em]">
            How LIGO Achieves Sub-Atomic Precision
          </h3>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed mt-6">
            <p>
              LIGO uses laser interferometry. A single laser beam splits and travels down two perpendicular 4-kilometre arms. Mirrors reflect the beams back and forth about 280 times, effectively creating 1,120-kilometre paths.
            </p>
            <p>
              When the beams recombine, they interfere. If both arms are exactly the same length, they cancel perfectly. A gravitational wave passing through stretches one arm while compressing the other - the interference pattern changes.
            </p>
            <p>
              The sensitivity required to detect GW150914 means isolating the detector from every conceivable noise source: seismic activity, thermal fluctuations, quantum shot noise, even traffic on nearby roads. The detectors are among the most sensitive instruments ever built.
            </p>
          </div>
        </div>
      </section>

      {/* The Chirp */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em]">
            Why It&apos;s Called a Chirp
          </h3>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed mt-6">
            <p>
              As two black holes spiral closer, they orbit faster. Faster orbits produce higher-frequency gravitational waves. The amplitude also increases as the black holes approach merger.
            </p>
            <p>
              The result is a distinctive signal: frequency and amplitude rising together over a fraction of a second. When converted to sound (the actual signal is below human hearing), it sounds like a bird chirp - hence the name.
            </p>
            <p>
              The exact shape of the chirp encodes information about the black holes: their masses, spins, orbital parameters, and distance. Matched filtering doesn&apos;t just detect the signal - it measures the event.
            </p>
          </div>
        </div>
      </section>

      {/* Further Exploration */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24 pt-16 md:pt-20">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Further Exploration
          </h2>
          <div className="mt-6">
            <div className="space-y-8">
              <div>
                <h3 className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Data Source
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="https://www.gwosc.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      Gravitational Wave Open Science Center
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">GW150914 data release</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Recommended Reading
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="https://arxiv.org/abs/1602.03837"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      Observation of Gravitational Waves from a Binary Black Hole Merger
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">Original discovery paper (arXiv)</span>
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
                      href="/work/stellar-evolution"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Stellar Evolution &rarr;
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
