import Link from 'next/link'

const labItems = [
  {
    title: 'Stellar Cartography',
    description: '50,000 stars from the ESA Gaia catalogue, rendered in two arrangements. Sky coordinates show where they appear. The HR diagram reveals the hidden structure beneath - main sequence, red giants, white dwarfs. The transition between views is the explanatory moment.',
    tags: ['WebGL', 'Gaia DR3', 'Astronomy'],
    slug: '/work/stellar-cartography',
    status: 'Live',
  },
  {
    title: 'Emergent Currents',
    description: 'Particles tracing a divergence-free noise field. Curl noise produces organic, fluid-like motion - particles flowing through it never converge or diverge. An interactive visualiser for exploring how layered fractal noise shapes emergent flow patterns.',
    tags: ['WebGL', 'Generative', 'Curl Noise'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'Lorenz Attractor',
    description: 'The butterfly effect made visible. A deterministic system that produces chaos - two trajectories starting a hair\'s breadth apart diverge completely. Real-time 3D rendering of the attractor with adjustable parameters.',
    tags: ['WebGL', 'Chaos Theory', 'Dynamical Systems'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'Lissajous',
    description: 'Parametric harmonics made visible. Frequency ratios and phase offsets generate elegant curve families, while harmonograph damping reveals how physical drawing systems decay over time.',
    tags: ['Canvas 2D', 'Parametric Curves', 'Harmonics'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'Space-Filling Curves',
    description: 'Hilbert, Peano, and Moore constructions animated level by level. Shows how a 1D path can fill 2D space and why locality-preserving mappings matter for data layouts.',
    tags: ['Canvas 2D', 'Recursion', 'Geometry'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'Double Pendulum',
    description: 'Many near-identical pendulums begin synchronised, then diverge chaotically. A paired phase-space view reveals the deeper dynamical structure behind sensitive dependence on initial conditions.',
    tags: ['Canvas 2D', 'Chaos Theory', 'Physics'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'Boids',
    description: 'Emergent flocking from three local rules - separation, alignment, and cohesion. Real-time controls reveal how complex group motion appears without central coordination.',
    tags: ['Canvas/WebGL', 'Emergence', 'Agent Simulation'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'Wave Tank',
    description: 'Interactive wave equation simulation for interference, diffraction, and reflection. Includes canonical presets such as double slit and resonant cavity.',
    tags: ['WebGL2', 'Wave Physics', 'Superposition'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'Fourier Epicycles',
    description: 'A drawing machine built from rotating circles. Any path can be decomposed into Fourier components and reconstructed by epicycles in real time.',
    tags: ['Canvas/WebGL', 'Fourier', 'Signal Decomposition'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'Chladni Figures',
    description: 'Nodal vibration patterns where virtual sand accumulates at standing-wave nodes. Includes mode browser, frequency sweep, and optional microphone-reactive mode.',
    tags: ['Canvas/WebGL', 'Acoustics', 'Pattern Formation'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'Exoplanet Systems',
    description: 'Interactive orrery of real exoplanetary systems using NASA archive data, with TRAPPIST-1 as the primary showcase and a full discovery timeline browser.',
    tags: ['Three.js', 'Astronomy', 'NASA Data'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'Gaia Proper Motions',
    description: 'A Stellar Cartography extension that fast-forwards the sky by ±100,000 years using Gaia proper-motion vectors, showing how constellations deform over time.',
    tags: ['WebGL', 'Gaia DR3', 'Astrometry'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'Physarum',
    description: 'High-density slime mould simulation where agents deposit and follow chemical trails. Emergent networks resemble veins, rivers, and cosmic web structure.',
    tags: ['WebGL Compute', 'Emergence', 'Biological Simulation'],
    slug: '#',
    status: 'In Development',
  },
  {
    title: 'CMB Explorer',
    description: 'Planck Legacy CMB map rendered as an interactive sky globe with harmonic decomposition. Includes a personal sky-patch feature mapped from date input.',
    tags: ['Three.js', 'Cosmology', 'Planck Data'],
    slug: '#',
    status: 'In Development',
  },
]

export default function LabPage() {
  return (
    <div className="min-h-screen">
      {/* Intro */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Lab</h1>
          <p className="font-sabon text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed">
            Experiments, tools, and generative work. Some of these are research projects exploring new ways to visualise data. Some are purely aesthetic. All of them are built with the same care as our client work.
          </p>
        </div>
      </section>

      {/* Lab Items */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="space-y-0">
          {labItems.map((item) => (
            <div
              key={item.title}
              className="border-t border-[var(--border)] py-8 md:py-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 lg:gap-12">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-nhg text-xl md:text-2xl font-medium text-[var(--text-primary)]">
                      {item.slug !== '#' ? (
                        <Link href={item.slug} className="hover:text-[var(--accent-hover)] transition-colors">
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </h2>
                    {item.status === 'In Development' && (
                      <span className="font-input text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider border border-[var(--border)] px-2 py-0.5">
                        {item.status}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
          <div className="border-t border-[var(--border)]" />
        </div>
      </section>

      {/* Note */}
      <section className="px-4 md:px-8 lg:px-12 pb-16">
        <div className="max-w-3xl">
          <p className="font-sabon text-base text-[var(--text-tertiary)] leading-relaxed">
            Lab projects are works in progress. Some will become client-ready tools. Some will remain experiments. All are built with real data and real science.
          </p>
        </div>
      </section>
    </div>
  )
}
