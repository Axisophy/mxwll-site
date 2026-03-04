'use client'

import dynamic from 'next/dynamic'

const SatelliteTracker = dynamic(
  () => import('@/visualisers/satellite-tracker/core/SatelliteTracker'),
  { ssr: false }
)

export default function SatelliteTrackerPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            Earth&apos;s Orbital Neighbourhood
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            Thousands of satellites, tracked in real time, orbiting a 3D globe.
          </p>
          <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6">
            Every point of light is a real satellite, propagated from Two-Line Element data
            using the same SGP4 algorithm that mission control uses. Colour-coded by purpose,
            filterable by constellation. The density view reveals just how crowded low Earth
            orbit has become.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Three.js</span>
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">satellite.js</span>
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">CelesTrak</span>
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">SGP4</span>
          </div>
        </div>
      </section>

      {/* Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <SatelliteTracker />
        <p className="font-label text-xs text-[var(--text-tertiary)] mt-4">
          DRAG TO ROTATE - SCROLL TO ZOOM - CLICK A SATELLITE FOR DETAILS - BEST ON DESKTOP
        </p>
      </section>

      {/* How Many Satellites */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            How Crowded Is Space?
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              As of early 2026, there are roughly 13,000 active satellites in Earth orbit. But
              that number only tells part of the story. There are also around 40,000 pieces of
              tracked debris larger than 10 centimetres - spent rocket bodies, defunct satellites,
              fragments from collisions and anti-satellite weapon tests. Below the tracking
              threshold, there are an estimated 130 million pieces of debris larger than 1 millimetre.
            </p>
            <p>
              The number of active satellites has roughly tripled since 2020, driven almost entirely
              by mega-constellations. SpaceX&apos;s Starlink alone accounts for over 6,000 satellites,
              with plans for 42,000. OneWeb has around 630. Amazon&apos;s Project Kuiper plans 3,236.
              The character of space has fundamentally changed in half a decade.
            </p>
          </div>
        </div>
      </section>

      {/* Orbital Regimes */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Orbital Regimes
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              <strong>Low Earth Orbit (LEO, 200-2,000 km).</strong> The most crowded zone. Satellites
              here complete an orbit in roughly 90 minutes and move at about 7.8 km/s. This is where
              the ISS flies (408 km), where Starlink operates (550 km), and where most Earth observation
              and scientific satellites work. Low altitude means high resolution and low latency, but
              also atmospheric drag that limits satellite lifetimes to a few years without propulsion.
            </p>
            <p>
              <strong>Medium Earth Orbit (MEO, 2,000-35,000 km).</strong> Home to the navigation
              constellations. GPS orbits at 20,200 km (12-hour period), Galileo at 23,222 km, GLONASS
              at 19,130 km. These altitudes are chosen because the orbital period creates a repeating
              ground track that ensures global coverage with a minimum number of satellites. MEO is
              also used by some communications constellations like O3B.
            </p>
            <p>
              <strong>Geostationary Orbit (GEO, 35,786 km).</strong> The unique altitude where orbital
              period exactly matches Earth&apos;s rotation. A satellite here appears motionless in the
              sky, making it ideal for communications and weather observation. The GEO belt is a finite
              resource - there are only 360 degrees of longitude, and satellites need to be spaced at
              least 0.1 degrees apart to avoid radio interference. GEO slots are allocated by the ITU
              and are geopolitically valuable.
            </p>
          </div>
        </div>
      </section>

      {/* Kessler Syndrome */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Kessler Problem
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              In 1978, NASA scientist Donald Kessler described a scenario in which the density of
              objects in orbit becomes high enough that collisions between them generate more debris
              than natural decay can remove. Each collision produces thousands of fragments, each
              capable of triggering further collisions. Beyond a critical density, the process becomes
              self-sustaining - a cascading chain reaction that could render entire orbital shells
              unusable for generations.
            </p>
            <p>
              This is not a theoretical concern. In 2009, a defunct Russian military satellite
              (Cosmos 2251) collided with an active Iridium communications satellite at a relative
              speed of 11.7 km/s. The collision produced over 2,300 trackable fragments. In 2007,
              China destroyed one of its own weather satellites with an anti-satellite missile,
              creating over 3,500 pieces of trackable debris - many of which remain in orbit and
              will continue to pose collision risks for decades.
            </p>
            <p>
              Switch to the density view to see the problem visually. The LEO shell is alarmingly
              dense. The question facing the space industry is whether it is possible to operate
              tens of thousands of satellites in LEO without triggering a Kessler cascade, and
              what happens to the satellites that fail before they can be deorbited.
            </p>
          </div>
        </div>
      </section>

      {/* How Tracking Works */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            How Tracking Works
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              The US Space Surveillance Network maintains a catalogue of every trackable object
              in Earth orbit, updated continuously using ground-based radar and optical telescopes.
              Each object&apos;s orbit is summarised as a Two-Line Element (TLE) set - a compact,
              standardised format containing six orbital elements plus drag parameters.
            </p>
            <p>
              TLE data alone does not tell you where a satellite is. To compute the position at
              any given time, you need a propagation algorithm. This visualisation uses SGP4
              (Simplified General Perturbations 4), the standard algorithm developed by the US
              military in the 1980s. SGP4 accounts for Earth&apos;s oblateness (the J2 effect),
              atmospheric drag, solar radiation pressure, and lunar/solar gravitational perturbations.
              It is accurate to within a few kilometres for LEO satellites over a span of a few days.
            </p>
            <p>
              The TLE data shown here comes from CelesTrak, a service operated by Dr T.S. Kelso
              that redistributes NORAD catalogue data in accessible formats. It is updated several
              times daily and is the primary source for civilian satellite tracking worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Mega-constellations */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Mega-constellations
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Select the Starlink constellation to see the scale of it. Thousands of satellites
              in coordinated orbital planes, each plane tilted at 53 degrees, spaced evenly around
              the globe. The geometry is deliberate: the orbital planes are arranged so that every
              point on Earth between 53°N and 53°S always has multiple satellites overhead.
            </p>
            <p>
              The GPS constellation, by contrast, uses just 24 satellites in six orbital planes at
              20,200 km altitude. The much higher orbit means each satellite covers a larger area,
              but the signal takes longer to arrive and the satellite cannot provide broadband
              internet (the entire purpose of Starlink requires low latency, which requires low
              altitude, which requires thousands of satellites).
            </p>
            <p>
              Select different constellations to compare their structures. Navigation constellations
              (GPS, Galileo, GLONASS) all use similar medium-orbit geometries with different plane
              counts and inclinations. Iridium uses six planes in near-polar orbit at 780 km. OneWeb
              uses higher-inclination planes at 1,200 km to cover polar regions that Starlink misses.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
