'use client'

import dynamic from 'next/dynamic'
import MetadataDropdown from '@/components/MetadataDropdown'

const SolarActivityViewer = dynamic(
  () => import('@/visualisers/solar-activity/core/SolarActivityViewer'),
  { ssr: false }
)

export default function SolarActivityPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with Metadata Sidebar */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left column */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]">
              Solar Activity
            </h1>
            <p className="font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2">
              The Sun in action across two solar cycles
            </p>
            <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12">
              An interactive viewer spanning Solar Cycles 24 and 25, from the quiet minimum of 2010
              to the intense maximum of 2024. Scrub through time to watch sunspot activity wax and wane.
              Toggle wavelength channels to see the Sun in extreme ultraviolet, white light, and coronal
              views. Bookmark events tell the stories of major flares, coronal mass ejections, and the
              storms they triggered on Earth.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8">
              <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Interactive</span>
              <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Solar Physics</span>
              <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Canvas 2D</span>
              <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">SDO Data</span>
            </div>
          </div>

          {/* Right column - Metadata */}
          <div className="space-y-6">
            <div>
              <span className="font-label text-xs text-[var(--text-tertiary)] block mb-2">Category</span>
              <span className="font-nhg text-sm">Explanation Design</span>
            </div>
            <div>
              <span className="font-label text-xs text-[var(--text-tertiary)] block mb-2">Audience</span>
              <MetadataDropdown title="General / Science-curious">
                <p>Anyone interested in understanding solar activity and its effects on Earth. The timeline interface works at two levels: scrub for the broad pattern, click events for the stories.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-label text-xs text-[var(--text-tertiary)] block mb-2">Approach</span>
              <MetadataDropdown>
                <p>A photographic and vector hybrid: programmatic solar disc rendering with annotation overlays, synchronised with a timeline and butterfly diagram. Multiple wavelength channels reveal different aspects of solar structure.</p>
                <p>Bookmarked events on the timeline provide narrative entry points into the data, connecting solar physics to real-world effects.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-label text-xs text-[var(--text-tertiary)] block mb-2">Technology</span>
              <span className="font-nhg text-sm">React, Canvas 2D, TypeScript</span>
            </div>
            <div>
              <span className="font-label text-xs text-[var(--text-tertiary)] block mb-2">Data</span>
              <span className="font-nhg text-sm text-[var(--text-secondary)]">SILSO sunspot numbers, SDO event archives, NOAA space weather records</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Viewer */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <SolarActivityViewer />
        <p className="font-label text-xs text-[var(--text-tertiary)] mt-4">
          INTERACTIVE SOLAR ACTIVITY VIEWER - SOLAR CYCLES 24 AND 25 - SCRUB TIMELINE TO EXPLORE
        </p>
      </section>

      {/* What SDO Sees */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            What SDO Sees
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              The Solar Dynamics Observatory, launched by NASA in February 2010, photographs the Sun every
              12 seconds in multiple wavelengths simultaneously. Each wavelength reveals a different layer
              of the solar atmosphere, at a different temperature.
            </p>
            <p>
              The 171 Angstrom channel shows the corona at around 600,000°C - the classic golden SDO view
              where active regions glow intensely. The HMI continuum shows visible light, the view closest
              to what a solar telescope would see, with sunspots appearing as dark patches. The 304 Angstrom
              channel reveals the chromosphere at 50,000°C, highlighting prominences - enormous arcs of
              plasma suspended above the surface. The 193 Angstrom channel shows the hottest coronal
              structures at 1.2 million°C, where coronal holes (dark regions where the solar wind escapes
              into space) are clearly visible.
            </p>
          </div>
        </div>
      </section>

      {/* The Solar Cycle */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Solar Cycle
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Every 11 years, the Sun&apos;s magnetic field reverses its polarity. The north magnetic pole
              becomes the south pole and vice versa. This cycle drives a dramatic rise and fall in solar
              activity - from the quiet minimum (few or no sunspots, minimal flare activity) to the stormy
              maximum (hundreds of sunspots, frequent powerful flares and coronal mass ejections).
            </p>
            <p>
              The butterfly diagram below the viewer shows this pattern clearly. At the start of each cycle,
              sunspots appear at high latitudes (around 30 degrees from the equator). As the cycle progresses,
              new spots emerge closer and closer to the equator. By the end of the cycle, activity is
              concentrated near the equator, and the next cycle&apos;s spots begin appearing at high latitudes
              again. This migration pattern, when plotted on a latitude-vs-time chart, creates a shape
              resembling butterfly wings - hence the name.
            </p>
          </div>
        </div>
      </section>

      {/* What Are Sunspots */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            What Are Sunspots?
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Sunspots are not blemishes or imperfections. They are regions where intense magnetic fields
              (thousands of times stronger than Earth&apos;s) break through the surface. The magnetic field
              suppresses convection, preventing hot plasma from rising from below. The result is a region
              that is cooler than its surroundings - about 3,500°C compared to the 5,500°C of the normal
              photosphere. This temperature difference makes sunspots appear dark, though a sunspot on its
              own would be brighter than the full Moon.
            </p>
            <p>
              Sunspots typically occur in pairs or groups with opposite magnetic polarity, connected by
              arching magnetic field lines. It is along these field lines that solar flares and coronal mass
              ejections originate. The larger and more complex the sunspot group, the more likely it is to
              produce a powerful eruption.
            </p>
          </div>
        </div>
      </section>

      {/* Effects on Earth */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            When the Sun Storms
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Solar flares are sudden releases of magnetic energy, producing intense bursts of radiation
              across the electromagnetic spectrum. They are classified by X-ray intensity: C-class (minor),
              M-class (moderate), and X-class (major). An X10 flare is ten times more powerful than an X1.
              The radiation arrives at Earth in just 8 minutes (the speed of light) and can cause radio
              blackouts on the sunlit hemisphere.
            </p>
            <p>
              Coronal mass ejections (CMEs) are more dangerous. They are massive clouds of magnetised plasma,
              billions of tonnes of solar material, launched into space at speeds of 250 to 3,000 km/s. When
              a CME hits Earth&apos;s magnetosphere, it can compress and distort the magnetic field, inducing
              electric currents in long conductors - power lines, pipelines, and undersea cables. A sufficiently
              powerful CME could damage transformers, disrupt satellite electronics, and degrade GPS accuracy.
            </p>
            <p>
              The same geomagnetic storms that threaten infrastructure produce aurora - the northern and
              southern lights. During the May 2024 G5 storm, aurora was visible across most of the United
              Kingdom, the continental United States, and parts of northern Mexico. It was the most widely
              observed aurora in human history, partly because of the storm&apos;s intensity and partly because
              hundreds of millions of people carry high-quality cameras in their pockets.
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
                <h3 className="font-label text-xs text-[var(--text-tertiary)] mb-4">Data Sources</h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a href="https://sdo.gsfc.nasa.gov" target="_blank" rel="noopener noreferrer"
                       className="text-[var(--text-primary)] hover:underline">
                      Solar Dynamics Observatory
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">NASA</span>
                  </li>
                  <li>
                    <a href="https://sidc.be/silso/" target="_blank" rel="noopener noreferrer"
                       className="text-[var(--text-primary)] hover:underline">
                      SILSO Sunspot Index
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">Royal Observatory of Belgium</span>
                  </li>
                  <li>
                    <a href="https://www.swpc.noaa.gov" target="_blank" rel="noopener noreferrer"
                       className="text-[var(--text-primary)] hover:underline">
                      Space Weather Prediction Center
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">NOAA</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-label text-xs text-[var(--text-tertiary)] mb-4">Related Work</h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a href="/work/stellar-cartography"
                       className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      Stellar Cartography →
                    </a>
                  </li>
                  <li>
                    <a href="/work/space-missions"
                       className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      Space Mission Timeline →
                    </a>
                  </li>
                  <li>
                    <a href="/lab/solar-system-scale"
                       className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      Solar System to Scale →
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
