'use client';

import { useState } from 'react';
import NuclideChart from './NuclideChart';

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

export default function NuclideChartPage() {
  return (
    <main className='min-h-screen bg-black'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              Chart of Nuclides
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              A Beginner&apos;s Guide
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              An accessible introduction to nuclear physics through the chart of nuclides  - from the familiar periodic table to the vast landscape of 3,300+ atomic species. Designed to explain what makes atoms stable or unstable without requiring any physics background.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Explanation Design</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Nuclear Physics</span>
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
                <p>Curious people who know atoms exist and have heard of radioactivity, but don&apos;t understand what makes some atoms stable and others unstable. They&apos;ve never seen a chart of nuclides or wouldn&apos;t know how to read one. The reward is understanding the physics that underpins nuclear energy, medical imaging, and the origins of the elements.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Start with the familiar periodic table, then reveal its limitation: it treats all atoms of an element as identical when they&apos;re not. Isotopes open the door to the nuclide chart.</p>
                <p>The &quot;valley of stability&quot; metaphor makes the physics intuitive  - atoms on the ridges are unstable and &quot;roll&quot; toward stability through decay. Colour-coding makes decay types visible without requiring technical knowledge.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Adaptability
              </span>
              <MetadataDropdown>
                <p>This approach  - start with familiar framework, reveal its limitations, introduce the fuller picture  - works for any subject where common knowledge is a simplification. The periodic table to nuclides, Newtonian physics to relativity, flat Earth intuition to spherical geometry.</p>
                <p>The interactive chart pattern (canvas rendering with progressive disclosure) works for any dense categorical dataset: gene expression matrices, materials databases, taxonomic classifications.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>React, Canvas, TypeScript</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Data
              </span>
              <span className='text-sm text-white/70'>IAEA Nuclear Data Services (3,352 nuclides)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 1: HOOK - Visual */}
      <section className='relative h-[50vh] min-h-[400px] bg-black overflow-hidden flex items-center justify-center'>
        <div className='absolute inset-0 opacity-30'>
          {/* Simplified chart preview as background pattern */}
          <div className='w-full h-full' style={{
            background: 'linear-gradient(135deg, #000 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #000 100%)'
          }} />
        </div>
        <div className='relative text-center text-white px-4'>
          <h2 className='font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-4'>
            Chart of Nuclides
          </h2>
          <p className='font-display text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white/80'>
            3,352 ways to build an atom
          </p>
        </div>
      </section>

      {/* Stage 2: ANCHOR - "You Know the Periodic Table" */}
      <section className='px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            You Know the Periodic Table
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Everyone learns the periodic table. 118 elements, organised by proton count. Hydrogen has 1 proton, helium has 2, carbon has 6, uranium has 92. It&apos;s one of the most successful organising schemes in science.
            </p>
            <p>
              But here&apos;s what the periodic table doesn&apos;t show you: atoms of the same element aren&apos;t all identical.
            </p>
            <p>
              Carbon always has 6 protons  - that&apos;s what makes it carbon. But it can have 6 neutrons, or 7, or 8. Carbon-12 and Carbon-14 are both carbon, but they behave very differently. One is stable. The other is radioactive, and it&apos;s the basis of carbon dating.
            </p>
            <p>
              <strong>There&apos;s a chart that shows all of this.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Stage 3: FOUNDATION - "Beyond the Elements" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Beyond the Elements
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              A <strong>nuclide</strong> is a specific combination of protons and neutrons. While the periodic table shows 118 elements, there are over 3,300 known nuclides  - different versions of those elements with varying neutron counts.
            </p>
            <p>
              The chart of nuclides plots them all. Protons on the vertical axis (which element), neutrons on the horizontal (which isotope). Each square is a distinct atomic species.
            </p>
            <p>
              Most of these nuclides are unstable. They decay  - transforming into other nuclides by emitting radiation until they reach a stable configuration. The colours show how they decay: beta emission, alpha emission, spontaneous fission. The pattern reveals something beautiful.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 4a: BUILD - "The Valley of Stability" + Interactive */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Valley of Stability
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Look at the chart and you&apos;ll see a pattern: stable nuclides (shown in black) cluster along a diagonal path. This is the <strong>valley of stability</strong>.
            </p>
            <p>
              For light elements, stability means roughly equal numbers of protons and neutrons. Helium-4 (2 protons, 2 neutrons) is stable. But as elements get heavier, they need progressively more neutrons to remain stable. Lead-208 (82 protons, 126 neutrons) is the heaviest stable nuclide.
            </p>
            <p>
              Step off this narrow ridge and nuclei become unstable. Too many neutrons? The atom undergoes beta-minus decay, converting a neutron to a proton. Too few neutrons? Beta-plus decay or electron capture. Too heavy overall? Alpha decay, shedding two protons and two neutrons at once.
            </p>
            <p>
              Explore the chart. Click any nuclide to see its properties.
            </p>
          </div>
        </div>
        <div className='border border-white/10 bg-black overflow-hidden'>
          <div className='h-[500px] md:h-[750px] lg:h-[875px]'>
            <NuclideChart className='h-full' />
          </div>
        </div>
      </section>

      {/* Stage 4b: BUILD - "Magic Numbers" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Magic Numbers
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Certain numbers of protons or neutrons create especially stable nuclei: 2, 8, 20, 28, 50, 82, and 126. These are the <strong>magic numbers</strong>.
            </p>
            <p>
              Just as electrons fill shells around the nucleus, protons and neutrons fill shells within it. When a shell is complete, the nucleus is particularly stable. Helium-4 (2 protons, 2 neutrons) is doubly magic. So is oxygen-16 (8 and 8), calcium-48 (20 and 28), and lead-208 (82 and 126).
            </p>
            <p>
              You can see magic numbers on the chart as horizontal and vertical lines where nuclides are more abundant or longer-lived. The doubly magic nuclides sit at the intersections  - islands of unusual stability in a sea of radioactive decay.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 4c: BUILD - "Decay and Time" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Decay and Time
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Every unstable nuclide has a half-life  - the time it takes for half of any sample to decay. These range from fractions of a second to billions of years.
            </p>
            <p>
              Uranium-238 has a half-life of 4.5 billion years  - nearly the age of Earth. That&apos;s why there&apos;s still uranium in the ground. Carbon-14 has a half-life of 5,730 years  - long enough to date ancient artifacts, short enough that it&apos;s continuously replenished by cosmic rays.
            </p>
            <p>
              Some nuclides exist for mere microseconds. Oganesson-294, the heaviest known element, has a half-life of about 0.7 milliseconds. It was only detected because physicists knew exactly where to look  - and what decay signature to expect.
            </p>
            <p>
              Switch the chart to half-life mode to see this temporal dimension. The stable nuclides are eternal. Everything else is just waiting.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 5: REWARD - "The Landscape of Matter" */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-black text-white'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Landscape of Matter
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Look at the chart of nuclides now, and you see something different than you did ten minutes ago.
            </p>
            <p>
              You see a landscape  - 3,352 atomic species, each trying to reach stability. The valley of stability isn&apos;t just a pattern; it&apos;s the narrow path where nuclear forces balance. The colours aren&apos;t random; they show which direction each nuclide will &quot;roll&quot; on its way to stability.
            </p>
            <p>
              You can find carbon-14 and understand why it&apos;s useful for dating. You can find uranium-235 and see why it&apos;s fissile. You can find technetium and see why it doesn&apos;t exist naturally on Earth  - there are no stable isotopes, so any primordial technetium decayed long ago.
            </p>
            <p className='text-white'>
              The chart of nuclides isn&apos;t just a reference table. It&apos;s a map of nuclear physics  - stability, instability, and the forces that govern the building blocks of matter.
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

      {/* 6a: Types of Decay */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Types of Decay
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              <strong>Beta-minus decay:</strong> A neutron converts to a proton, emitting an electron and an antineutrino. The atom moves one square up and one left on the chart. Common for neutron-rich nuclides.
            </p>
            <p>
              <strong>Beta-plus decay / Electron capture:</strong> A proton converts to a neutron, emitting a positron (or capturing an orbital electron). The atom moves one square down and one right. Common for proton-rich nuclides.
            </p>
            <p>
              <strong>Alpha decay:</strong> The nucleus ejects a helium-4 nucleus (2 protons, 2 neutrons). The atom moves two squares down and two left. Common for heavy elements.
            </p>
            <p>
              <strong>Spontaneous fission:</strong> The nucleus splits into two roughly equal pieces plus neutrons. Only occurs in very heavy elements. The primary decay mode for some transuranic elements.
            </p>
          </div>
        </div>
      </section>

      {/* 6b: The Island of Stability */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            The Island of Stability
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Theory predicts that around 114 protons and 184 neutrons, there should be another region of enhanced stability  - an &quot;island&quot; beyond the sea of short-lived superheavy elements.
            </p>
            <p>
              We&apos;ve reached the shores. Flerovium-298 (114 protons) shows hints of increased stability compared to its neighbours. But the predicted centre of the island  - nuclides with half-lives of years rather than milliseconds  - remains undiscovered.
            </p>
            <p>
              Finding these nuclides would validate our understanding of nuclear structure and potentially reveal new chemistry. The search continues.
            </p>
          </div>
        </div>
      </section>

      {/* 6c: Stellar Nucleosynthesis */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Where Elements Come From
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The chart of nuclides is also a map of cosmic chemistry. Hydrogen and helium came from the Big Bang. Carbon, nitrogen, and oxygen are forged in stellar cores. Iron is the endpoint of fusion in massive stars.
            </p>
            <p>
              Everything heavier than iron requires extreme events: supernovae and neutron star collisions. The rapid neutron capture process (r-process) builds heavy elements in seconds, far from stability, which then decay back toward the valley.
            </p>
            <p>
              The gold in your ring, the uranium in reactor fuel, the iodine in your thyroid  - all were created in the violent deaths of stars, then decayed along paths visible on this chart until they reached stability.
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
                      href='https://www.amazon.co.uk/Periodic-Table-Primo-Levi/dp/0141185147'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      The Periodic Table  - Primo Levi
                    </a>
                    <span className='text-white/40 ml-2'>Memoir through chemistry</span>
                  </li>
                  <li>
                    <a
                      href='https://www.amazon.co.uk/Making-Atomic-Bomb-Richard-Rhodes/dp/1451677618'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      The Making of the Atomic Bomb  - Richard Rhodes
                    </a>
                    <span className='text-white/40 ml-2'>Nuclear physics in historical context</span>
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
                      href='https://www.youtube.com/watch?v=rcOFV4y5z8c'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Kurzgesagt: The Most Dangerous Stuff in the Universe
                    </a>
                    <span className='text-white/40 ml-2'>Strange matter and nuclear stability</span>
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
                      href='https://www-nds.iaea.org/relnsd/vcharthtml/VChartHTML.html'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      IAEA Live Chart of Nuclides
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Table_of_nuclides'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Table of nuclides (Wikipedia)
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Island_of_stability'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Island of stability (Wikipedia)
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
                      href='/work/stellar-evolution'
                      className='text-white/70 hover:text-[var(--color-pink)] transition-colors'
                    >
                      Stellar Evolution →
                    </a>
                  </li>
                  <li>
                    <a
                      href='/work/fractals'
                      className='text-white/70 hover:text-[var(--color-pink)] transition-colors'
                    >
                      What are Fractals? →
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
