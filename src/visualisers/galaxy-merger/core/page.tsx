import { Metadata } from 'next';
import ClientExplorer from './components/ClientExplorer';

export const metadata: Metadata = {
  title: 'Gravity Makes Everything — Galaxy Merger Simulation | Bang Industries',
  description: 'Watch the Milky Way and Andromeda galaxies collide in this N-body simulation. 50,000 particles evolving over 10 billion years under nothing but gravity.',
  alternates: {
    canonical: 'https://bangindustries.co/work/galaxy-merger',
  },
};

export default function GalaxyMergerPage() {
  return (
    <main className='min-h-screen bg-black text-white'>
      {/* Hero */}
      <section className='relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-radial from-[#0a1628] to-black' />

        {/* Subtle star field background */}
        <div className='absolute inset-0 opacity-30'>
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className='absolute w-px h-px bg-white rounded-full'
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>

        <div className='relative z-10 text-center px-4 max-w-3xl'>
          <div className='text-xs font-mono uppercase tracking-widest text-white/40 mb-4'>
            N-Body Simulation
          </div>
          <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6'>
            Gravity Makes<br />Everything
          </h1>
          <p className='text-xl md:text-2xl text-white/70 mb-8'>
            The Milky Way and Andromeda are on a collision course
          </p>
          <p className='text-base text-white/50 max-w-xl mx-auto'>
            At 110 km/s, Andromeda is approaching — one of the few galaxies in
            the universe moving toward us. In roughly 4 billion years, two spiral
            galaxies will become one elliptical giant.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2'>
          <span className='text-xs text-white/40 uppercase tracking-wider'>Scroll to begin</span>
          <div className='w-px h-8 bg-gradient-to-b from-white/40 to-transparent' />
        </div>
      </section>

      {/* Introduction */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-24'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            One Force, Infinite Complexity
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              This simulation uses a single force: <strong className='text-white'>gravity</strong>.
              No dark energy, no magnetic fields, no gas dynamics. Just F = Gm&#x2081;m&#x2082;/r&#xb2;.
              Every tidal tail, every bridge of stars, every distortion you see emerges from
              this one equation applied 50,000 times per timestep.
            </p>
            <p>
              The <strong className='text-white'>Barnes-Hut algorithm</strong> makes it possible.
              Instead of calculating 2.5 billion force pairs directly, distant particle groups
              are approximated by their center of mass. Complexity drops from O(N&#xb2;) to
              O(N log N) — the difference between days and minutes of computation.
            </p>
            <p>
              What you&apos;re watching isn&apos;t an animation. It&apos;s the actual output
              of gravitational physics, computed particle by particle.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive explorer */}
      <ClientExplorer />

      {/* The physics */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-24 bg-white/5'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Stars Never Collide
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Despite the violence of the merger, individual stars almost never collide.
              The average distance between stars is <strong className='text-white'>160 billion kilometers</strong> —
              galaxies are mostly empty space. When these galaxies &quot;collide,&quot;
              their stars pass through each other like two clouds of gnats.
            </p>
            <p>
              <strong className='text-white'>Gas is different.</strong> When interstellar gas clouds collide,
              they compress and heat up, triggering massive bursts of star formation.
              The merger will light up with new stars — blue, hot, and short-lived.
              This &quot;starburst&quot; phase is visible in real merging galaxies like
              the Antennae Galaxies (NGC 4038/4039).
            </p>
            <p>
              <strong className='text-white'>Our Solar System&apos;s fate?</strong> Earth will likely survive.
              We&apos;ll be flung to the outskirts of the new galaxy — perhaps 100,000 light-years
              from the core. The Sun still has 5 billion years of fuel. But our descendants
              will see a completely different night sky.
            </p>
          </div>
        </div>
      </section>

      {/* Technical details */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-24'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Simulation
          </h2>
          <div className='space-y-8'>
            <div>
              <h3 className='text-xl font-bold mb-2 text-[#0055FF]'>Barnes-Hut Tree</h3>
              <p className='text-white/70'>
                Space is recursively subdivided into octants. Distant particle groups are
                approximated by their total mass and center of mass. With opening angle
                &#x3b8; = 0.5, this is accurate to within 1% while being 100x faster than
                direct summation.
              </p>
            </div>
            <div>
              <h3 className='text-xl font-bold mb-2 text-[#0055FF]'>Gravitational Softening</h3>
              <p className='text-white/70'>
                Each particle represents millions of stars. Close two-body encounters are
                numerical artifacts — real collisionless galaxies don&apos;t have them.
                Plummer softening (&#x3a6; = -Gm/&#x221a;(r&#xb2; + &#x3b5;&#xb2;)) keeps forces
                finite and suppresses artificial scattering.
              </p>
            </div>
            <div>
              <h3 className='text-xl font-bold mb-2 text-[#0055FF]'>Leapfrog Integration</h3>
              <p className='text-white/70'>
                The symplectic leapfrog integrator updates positions and velocities in a
                staggered pattern, naturally conserving energy over billions of years.
                It&apos;s the standard choice for collisionless stellar dynamics.
              </p>
            </div>
            <div>
              <h3 className='text-xl font-bold mb-2 text-[#0055FF]'>Initial Conditions</h3>
              <p className='text-white/70'>
                Each galaxy starts as an equilibrium exponential disk — particle positions
                and velocities sampled from a distribution function that satisfies the
                collisionless Boltzmann equation. The Milky Way has 25,000 particles,
                Andromeda has 25,000 at 3x the mass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The science */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-24 bg-black'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Will It Actually Happen?
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              <strong className='text-white'>Probably.</strong> Recent research (Sawala et al. 2025)
              revised the merger probability. A head-on collision in 4-5 billion years has
              only <strong className='text-white'>2% probability</strong>. Including the Large Magellanic
              Cloud&apos;s gravitational influence, the merger probability within 10 billion years
              is about <strong className='text-white'>50%</strong>.
            </p>
            <p>
              The key revision factor: the LMC is more massive than previously thought
              (2 × 10&#xb9;&#xb9; solar masses), and its gravity pulls the Milky Way off
              its orbital plane relative to Andromeda. If we include the Triangulum Galaxy (M33),
              the probability rises to 63%.
            </p>
            <p>
              Galaxy mergers are fundamental to cosmic structure formation. Most massive
              elliptical galaxies formed through mergers. The Milky Way itself has absorbed
              dozens of smaller galaxies — the Sagittarius Dwarf is being torn apart right now,
              its stars streaming across our sky.
            </p>
          </div>
        </div>
      </section>

      {/* Further exploration */}
      <section className='px-4 md:px-8 lg:px-12 pb-16 md:pb-24 pt-8'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Further Exploration
          </h2>
          <div className='space-y-8'>
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Related Explainers
              </h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='/work/orbital-mechanics' className='text-[var(--color-blue)] hover:text-white transition-colors'>
                    Orbital Mechanics
                  </a>
                  <span className='text-white/40'> — The same F = Gm&#x2081;m&#x2082;/r&#xb2; at solar system scale</span>
                </li>
                <li>
                  <a href='/work/stellar-evolution' className='text-[var(--color-blue)] hover:text-white transition-colors'>
                    Stellar Evolution
                  </a>
                  <span className='text-white/40'> — What happens inside the stars in these galaxies</span>
                </li>
                <li>
                  <a href='/work/cosmic-distance-ladder' className='text-[var(--color-blue)] hover:text-white transition-colors'>
                    Cosmic Distance Ladder
                  </a>
                  <span className='text-white/40'> — How we know Andromeda is 2.5 million light-years away</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                External Resources
              </h3>
              <ul className='space-y-2 text-sm text-white/70'>
                <li>
                  <a
                    href='https://svs.gsfc.nasa.gov/30955'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--color-blue)] hover:text-white transition-colors'
                  >
                    NASA SVS Milky Way-Andromeda Collision
                  </a>
                  <span className='text-white/40'> — High-resolution visualization from NASA</span>
                </li>
                <li>
                  <a
                    href='https://rebound.readthedocs.io'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--color-blue)] hover:text-white transition-colors'
                  >
                    REBOUND Documentation
                  </a>
                  <span className='text-white/40'> — The N-body integrator used in this simulation</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Key References
              </h3>
              <ul className='space-y-2 text-sm text-white/70'>
                <li><strong className='text-white'>Barnes & Hut 1986</strong> — A hierarchical O(N log N) force-calculation algorithm</li>
                <li><strong className='text-white'>Rein & Liu 2012</strong> — REBOUND: An open-source multi-purpose N-body code</li>
                <li><strong className='text-white'>Sawala et al. 2025</strong> — The Andromeda-Milky Way merger: Revised probability</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
