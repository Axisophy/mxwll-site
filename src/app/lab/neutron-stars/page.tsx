'use client'

import dynamic from 'next/dynamic'

const NeutronStarVisualiser = dynamic(
  () => import('@/visualisers/neutron-stars/core/NeutronStarVisualiser'),
  { ssr: false }
)

export default function NeutronStarsPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            Neutron Stars &amp; Magnetars
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            The densest objects in the visible universe. Three states of extreme physics.
          </p>
          <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6">
            A particle system rendering the magnetic field of a neutron star across three regimes:
            a quiet cooling remnant, an active pulsar with sweeping beams, and a magnetar undergoing
            a starquake. Each state uses real physical parameters - mass, radius, field strength, and
            rotation period - to drive the visualisation.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">WebGL2</span>
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Particle System</span>
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astrophysics</span>
            <span className="font-label px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Bloom</span>
          </div>
        </div>
      </section>

      {/* Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <NeutronStarVisualiser />
        <p className="font-label text-xs text-[var(--text-tertiary)] mt-4">
          AUTONOMOUS CINEMATIC SEQUENCE - USE BUTTONS TO SWITCH STATE MANUALLY
        </p>
      </section>

      {/* What Is a Neutron Star */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            What Is a Neutron Star?
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              When a star between about 8 and 25 solar masses exhausts its nuclear fuel, its core
              collapses in a fraction of a second. The outer layers are blasted away as a supernova.
              What remains is a neutron star - an object roughly 20 kilometres across, yet containing
              more mass than the Sun.
            </p>
            <p>
              The density is beyond intuitive comprehension: a single teaspoon of neutron star material
              weighs approximately a billion tonnes. The entire star is essentially a single atomic
              nucleus, 20 kilometres wide, held together by gravity and supported against further
              collapse by neutron degeneracy pressure - the quantum mechanical resistance of neutrons
              to being compressed further.
            </p>
          </div>
        </div>
      </section>

      {/* The Magnetic Field */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Magnetic Field
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              A neutron star&apos;s magnetic field is one of the most powerful forces in nature. During
              collapse, the original star&apos;s magnetic field is compressed from a volume millions of
              kilometres across into a sphere just 20 kilometres wide. Conservation of magnetic flux
              means the field strength increases by a factor of roughly 10 billion.
            </p>
            <p>
              The result is a magnetic dipole field - the same shape as a bar magnet, with field lines
              arcing from one magnetic pole to the other. This is what the visualisation renders:
              particles tracing the dipole field structure, concentrated near the poles where the field
              is strongest. The magnetic axis is typically tilted relative to the rotation axis,
              which is what produces the lighthouse effect in pulsars.
            </p>
            <p>
              The field equations follow the dipole formula: B<sub>r</sub> = (2m cos &theta;) / r&sup3;
              and B<sub>&theta;</sub> = (m sin &theta;) / r&sup3;, where m is the magnetic moment, &theta;
              is the colatitude, and r is the distance from the centre. Field strength falls off as
              the cube of the distance - it drops by a factor of eight every time you double your distance.
            </p>
          </div>
        </div>
      </section>

      {/* Three States */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Three States
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              <strong>Quiet neutron star.</strong> Most neutron stars are invisible. They are born
              extremely hot (around a trillion degrees) but cool rapidly, emitting thermal X-rays
              that fade over millions of years. Without active emission, they are nearly undetectable.
              The visualisation shows a sparse, slowly rotating field structure with no beam activity.
            </p>
            <p>
              <strong>Pulsar.</strong> If the magnetic field is strong enough and the rotation fast enough,
              charged particles are accelerated along the open field lines near the magnetic poles,
              producing beams of coherent radio emission. The beam sweeps through space as the star
              rotates. The visualisation shows the intensified particle flow along the polar field
              lines and the characteristic twin-beam structure.
            </p>
            <p>
              <strong>Magnetar starquake.</strong> Magnetars have magnetic fields a thousand times
              stronger than ordinary pulsars - up to 10&sup1;&sup1; Tesla. The immense magnetic stress
              can fracture the neutron star&apos;s crystalline crust. When the crust cracks, the sudden
              rearrangement of the magnetic field releases enormous energy in milliseconds. The
              visualisation shows this as an explosive perturbation of the particle system, with the
              field structure distorting and particles scattering before gradually settling.
            </p>
          </div>
        </div>
      </section>

      {/* Extremes */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            The Numbers
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              A neutron star packs 1.4 solar masses into a sphere 10 kilometres in radius. Its density
              of 3.7 &times; 10&sup1;&sup7; kg/m&sup3; means that a cubic centimetre weighs as much as
              a mountain. The escape velocity is about 100,000 km/s - a third of the speed of light.
              Light leaving the surface is gravitationally redshifted by about 20%.
            </p>
            <p>
              The surface gravity is roughly 2 &times; 10&sup1;&sup2; m/s&sup2; - about 200 billion
              times Earth&apos;s gravity. A human standing on the surface would be compressed into a film
              less than an atom thick. The crust is a rigid lattice of iron nuclei, about a kilometre
              thick, stronger than any material on Earth by a factor of roughly ten billion.
            </p>
            <p>
              The fastest known pulsar, PSR J1748-2446ad, rotates 716 times per second. Its equator
              moves at 24% of the speed of light. The strongest known magnetic field belongs to
              magnetar SGR 1806-20, measured at approximately 10&sup1;&sup1; Tesla - strong enough
              that at a distance of half the Earth-Moon separation, it would erase every credit card
              on Earth.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
