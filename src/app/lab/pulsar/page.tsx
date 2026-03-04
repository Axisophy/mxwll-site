'use client'

import dynamic from 'next/dynamic'

const PulsarVisualiser = dynamic(
  () => import('@/visualisers/pulsar/core/PulsarVisualiser'),
  { ssr: false }
)

export default function PulsarPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            Pulsar
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            A rotating neutron star, its radio beam sweeping past like a lighthouse. Drag to change its spin. Tilt to lose the signal.
          </p>
          <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6">
            Pulsars are rapidly rotating neutron stars with beams of radiation shooting from their magnetic poles. We detect them only when the beam happens to sweep past Earth. This visualisation lets you control the rotation and see how the geometry of the beam determines whether we hear the pulse.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Three.js</span>
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Web Audio</span>
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astrophysics</span>
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Mobile-First</span>
          </div>
        </div>
      </section>

      {/* Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <PulsarVisualiser />
        <div className="hidden lg:block mt-4 text-center">
          <p className="font-nhg text-xs text-[var(--text-tertiary)]">
            Three presets: normal pulsar, millisecond pulsar, and magnetar. Double-click to cycle.
          </p>
        </div>
      </section>

      {/* What Is a Pulsar */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            What Is a Pulsar?
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              When a massive star dies in a supernova, its core can collapse into a neutron star - an object roughly 20 km across but containing more mass than the Sun. The density is staggering: a teaspoon of neutron star material would weigh about a billion tonnes on Earth.
            </p>
            <p>
              As the star collapses, conservation of angular momentum causes it to spin faster, like a figure skater pulling in their arms. A star that once rotated once a month can become a neutron star spinning several times per second. Its magnetic field, compressed into a tiny volume, becomes trillions of times stronger than Earth's.
            </p>
            <p>
              The magnetic axis is usually tilted relative to the rotation axis. Charged particles accelerated along the magnetic field produce intense beams of radio emission from the magnetic poles. As the star rotates, these beams sweep through space like a lighthouse. If Earth happens to lie in the path of one of these beams, we detect a regular pulse of radio waves. Hence the name: pulsar.
            </p>
          </div>
        </div>
      </section>

      {/* Discovery */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Little Green Men
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              In November 1967, a 24-year-old graduate student named Jocelyn Bell noticed a strange signal in the data from a radio telescope she had helped build at Cambridge. It was a series of regular pulses, arriving every 1.337 seconds with extraordinary precision. Nothing natural was known to produce such a regular signal.
            </p>
            <p>
              The discovery was so unexpected that the source was initially labelled LGM-1 - for "Little Green Men" - because the regularity of the signal briefly suggested an artificial origin. Within weeks, Bell found three more pulsating sources in different parts of the sky, ruling out an alien civilisation (unlikely that multiple civilisations would all signal at similar frequencies).
            </p>
            <p>
              The explanation turned out to be even more extraordinary than aliens: these were rotating neutron stars, objects whose existence had been theorised but never confirmed. The first pulsar, PSR B1919+21, is the default preset in this visualisation. Its 1.337-second period is the rhythm you hear on load.
            </p>
          </div>
        </div>
      </section>

      {/* Three Types */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Three Kinds of Pulsar
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              <strong>Normal pulsars</strong> rotate between roughly once per second and once every few seconds. PSR B1919+21, the first discovered, has a period of 1.337 seconds. They gradually slow down over millions of years as they lose rotational energy.
            </p>
            <p>
              <strong>Millisecond pulsars</strong> spin hundreds of times per second. PSR J1748-2446ad, the fastest known, rotates 716 times per second - its equator moves at about 24% of the speed of light. These pulsars were "spun up" by accreting matter from a companion star, which transferred angular momentum. In this visualisation, the audio for the millisecond preset becomes a continuous buzz at 716 Hz because the individual pulses blend together.
            </p>
            <p>
              <strong>Magnetars</strong> have the most powerful magnetic fields in the known universe - up to a quadrillion (10^15) times stronger than Earth's. SGR 1806-20 holds the record for the most energetic stellar event ever observed: a gamma-ray flare in December 2004 that was detectable from 50,000 light-years away. Magnetars rotate more slowly (the one modelled here has a 7.56-second period) but release enormous energy through their decaying magnetic fields.
            </p>
          </div>
        </div>
      </section>

      {/* The Beam Geometry */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Why It Pulses
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              A pulsar is not actually flashing on and off. The emission is continuous, but the beam is narrow. We only see it when it sweeps past our line of sight, like seeing a lighthouse from shore. This is why tilting the axis in the visualisation can cause the pulses to stop - if you tilt far enough, the beam no longer crosses your viewing angle, and the pulsar falls silent. The star is still spinning and emitting, but you cannot see it.
            </p>
            <p>
              This geometry means we can only detect pulsars whose beams happen to cross Earth. There are estimated to be around a billion neutron stars in the Milky Way, but we have detected only about 3,000 as pulsars. The rest are either not beaming toward us, or their beams are too weak to detect at their distance.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
