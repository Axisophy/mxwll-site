'use client'

import dynamic from 'next/dynamic'
import MetadataDropdown from '@/components/MetadataDropdown'

const SolarWavelengthExplorer = dynamic(
  () => import('@/visualisers/solar-wavelength/core/components/SolarWavelengthExplorer'),
  { ssr: false }
)

export default function SolarWavelengthPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with Metadata Sidebar */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left column - Title and description */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]">
              Solar Wavelength
            </h1>
            <p className="font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2">
              One star, ten wavelengths, ten different stories
            </p>
            <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12">
              The Sun looks completely different depending on which wavelength you observe it in. Sweep across ten channels from NASA&apos;s Solar Dynamics Observatory to see how the same moment reveals coronal loops, chromospheric filaments, flare plasma, and structures invisible in ordinary light.
            </p>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8">
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Data Visualisation</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astronomy</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Canvas 2D</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className="space-y-6">
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Category
              </span>
              <span className="font-nhg text-sm">Data Visualisation</span>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Audience
              </span>
              <MetadataDropdown title="Educators, science communicators">
                <p>Anyone curious about what the Sun really looks like beyond visible light. No physics background needed - the visualisation makes the temperature-wavelength relationship intuitive through direct comparison.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Approach
              </span>
              <MetadataDropdown>
                <p>A continuous wavelength slider lets users sweep through the electromagnetic spectrum, crossfading between SDO channels. Each channel reveals temperature-specific structures. The info panel updates in real time with channel data, temperature, and descriptions of visible features.</p>
                <p>The interactive version replaces the autonomous demo to give users direct control over which wavelengths they explore.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Technology
              </span>
              <span className="font-nhg text-sm">React, Canvas 2D, Helioviewer API</span>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">
                Data
              </span>
              <span className="font-nhg text-sm text-[var(--text-secondary)]">NASA Solar Dynamics Observatory (SDO) imagery via Helioviewer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Explorer */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <SolarWavelengthExplorer />
      </section>

      {/* The Same Moment, Different Views */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Same Moment, Different Views
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Look at a photograph of the Sun and you see a bright disk - the photosphere. But the photosphere is just the surface. The Sun has an atmosphere too, extending millions of kilometres into space, and it&apos;s far more turbulent than the serene surface suggests.
            </p>
            <p>
              The problem is you can&apos;t see it. Not in visible light. The corona is millions of degrees hotter than the surface, but it&apos;s also millions of times fainter. To see it, you need to look in ultraviolet - wavelengths invisible to your eyes but precisely suited to the temperatures of the solar atmosphere.
            </p>
            <p>
              This is exactly what NASA&apos;s Solar Dynamics Observatory does. Launched in 2010, SDO photographs the Sun every 12 seconds in ten different wavelengths simultaneously. Each wavelength reveals a different temperature layer, a different set of structures, a different story about the same star.
            </p>
          </div>
        </div>
      </section>

      {/* Temperature Layers */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Temperature Layers
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              The Sun&apos;s temperature is not what you&apos;d expect. The surface (photosphere) is about 5,700°C. Move upward through the chromosphere and you&apos;d expect it to get cooler - like climbing a mountain on Earth. It does, briefly. Then something extraordinary happens.
            </p>
            <p>
              In a thin layer called the transition region, the temperature rises from tens of thousands to over a million degrees in just a few hundred kilometres. The corona - the Sun&apos;s outermost atmosphere - blazes at 1 to 3 million degrees. During flares, localised regions can reach 10 million degrees or more.
            </p>
            <p>
              Nobody fully understands why. This is the &quot;coronal heating problem&quot; - one of the biggest unsolved questions in solar physics. The energy must come from the magnetic field, but the exact mechanism remains debated.
            </p>
            <p>
              Each wavelength channel in the explorer above corresponds to a specific temperature. When you slide from 4500Å to 94Å, you&apos;re climbing from the 5,700°C surface to the 6-million-degree flare plasma. The structures you see change completely because different temperatures reveal different physical processes.
            </p>
          </div>
        </div>
      </section>

      {/* What SDO Reveals */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            What SDO Reveals
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              SDO doesn&apos;t just take pretty pictures. It&apos;s a diagnostic tool, and its ten wavelength channels function like a set of thermal filters, each tuned to a specific temperature.
            </p>
            <p>
              At 171Å (630,000°C), you see the quiet corona - delicate magnetic loops arching between sunspots, tracing the magnetic field like iron filings around a magnet. At 193Å (1.2 million°C), coronal holes become dramatically visible - dark regions where the magnetic field opens into space, the source of the fast solar wind that rushes past Earth.
            </p>
            <p>
              At 304Å (50,000°C), you&apos;re looking at the chromosphere. Prominences and filaments are vivid here - vast curtains of plasma suspended by magnetic fields. When they erupt, they become coronal mass ejections - billions of tonnes of magnetised plasma flung into the solar system.
            </p>
            <p>
              The hottest channels (94Å and 131Å) only light up during flares - the most violent events in the solar system. When the magnetic field suddenly reconnects, it accelerates plasma to millions of degrees in minutes. These are the events that can disrupt satellites, power grids, and communications on Earth.
            </p>
          </div>
        </div>
      </section>

      {/* Beyond Visible Light */}
      <section className="px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Beyond Visible Light
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              The Sun teaches a universal principle: what you see depends entirely on how you look. In visible light, the Sun is calm - a featureless disk with a few dark spots. In extreme ultraviolet, it&apos;s a churning, dynamic plasma laboratory with structure at every scale.
            </p>
            <p>
              This isn&apos;t unique to the Sun. The entire universe reveals different information at different wavelengths. Radio telescopes see cold gas and magnetic fields. Infrared sees dust and the earliest galaxies. X-ray telescopes see black holes and the hottest gas in galaxy clusters. Gamma rays reveal the most violent events in the cosmos.
            </p>
            <p className="text-[var(--text-primary)]">
              Multi-wavelength observation is the foundation of modern astronomy. No single wavelength tells the complete story. SDO proved this for our nearest star - and the same principle scales across the entire observable universe.
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
                  Data Source
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="https://sdo.gsfc.nasa.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      NASA Solar Dynamics Observatory
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">Mission overview and latest data</span>
                  </li>
                  <li>
                    <a
                      href="https://helioviewer.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      Helioviewer
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">Browse and explore solar imagery</span>
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
                      href="https://www.amazon.co.uk/Sun-Kings-Unexpected-Tragedy-Experts/dp/0691141266"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      The Sun Kings - Stuart Clark
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">The Carrington Event and early solar physics</span>
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
                      Stellar Cartography →
                    </a>
                  </li>
                  <li>
                    <a
                      href="/work/stellar-evolution"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Stellar Evolution →
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
