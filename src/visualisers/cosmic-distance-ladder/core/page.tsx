import { Metadata } from 'next';
import ClientExplorer from './components/ClientExplorer';

export const metadata: Metadata = {
  title: 'How Far is Far? — Cosmic Distance Ladder | Bang Industries',
  description: 'An interactive journey through the cosmic distance ladder — from nearby stars to the edge of the observable universe. Explore parallax, Cepheid variables, Type Ia supernovae, and the Hubble tension.',
  alternates: {
    canonical: 'https://bangindustries.co/work/cosmic-distance-ladder',
  },
};

export default function CosmicDistanceLadderPage() {
  return (
    <main className='min-h-screen bg-black text-white'>
      {/* Hero */}
      <section className='relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-radial from-[#1a1a2e] to-black' />

        {/* Starfield background */}
        <div className='absolute inset-0 opacity-60'>
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className='absolute w-px h-px bg-white rounded-full'
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                transform: `scale(${Math.random() * 2 + 0.5})`,
              }}
            />
          ))}
        </div>

        <div className='relative z-10 text-center px-4'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6'>
            How Far is Far?
          </h1>
          <p className='text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white/80 mb-8'>
            Climbing the Cosmic Distance Ladder
          </p>
          <p className='text-base md:text-lg text-white/60 max-w-2xl mx-auto'>
            From the parallax of nearby stars to the expansion of the universe itself —
            a journey through the methods astronomers use to measure the cosmos.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2'>
          <span className='text-xs text-white/40 uppercase tracking-wider'>Scroll to begin</span>
          <div className='w-px h-8 bg-gradient-to-b from-white/40 to-transparent' />
        </div>
      </section>

      {/* Intro */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-24'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Problem
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              How do you measure the distance to something you cannot touch? For most
              of human history, the answer was: you can&apos;t. Stars were simply &quot;up there&quot; —
              impossibly remote pinpricks of light.
            </p>
            <p>
              The universe revealed its scale reluctantly, one rung at a time. Each new
              method of distance measurement depended on the previous one, building a
              ladder that now reaches to the edge of the observable universe.
            </p>
            <p>
              This is the story of that ladder — and the surprising tension that emerged
              when astronomers tried to reconcile measurements from different ends of
              cosmic history.
            </p>
          </div>
        </div>
      </section>

      {/* Main scrollytelling content */}
      <ClientExplorer />

      {/* Conclusion */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-24 bg-black'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            What We&apos;ve Learned
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The cosmic distance ladder is humanity&apos;s greatest ruler — a chain of
              methods that lets us measure distances across billions of light years.
            </p>
            <p>
              <strong className='text-white'>Rung 1: Parallax</strong> — We measure nearby stars
              by watching them shift as Earth orbits the Sun. The fundamental base of the ladder.
            </p>
            <p>
              <strong className='text-white'>Rung 2: Cepheids</strong> — Pulsating stars with a
              period-luminosity relation. If you know how long they pulse, you know how bright
              they truly are — and thus how far away.
            </p>
            <p>
              <strong className='text-white'>Rung 3: Type Ia Supernovae</strong> — Exploding white
              dwarfs that all reach nearly the same peak brightness. Standard candles visible
              across cosmological distances.
            </p>
            <p>
              <strong className='text-white'>Rung 4: Hubble Flow</strong> — At the largest scales,
              redshift tells us how fast galaxies recede, and thus how far they are.
            </p>
            <p className='pt-4'>
              But here&apos;s the puzzle: when we measure the expansion rate using the distance
              ladder (looking outward from us), we get a different answer than when we
              calculate it from the cosmic microwave background (looking backward to the
              early universe). This &quot;Hubble tension&quot; is one of the most exciting unsolved
              problems in cosmology.
            </p>
          </div>
        </div>
      </section>

      {/* Further Exploration */}
      <section className='px-4 md:px-8 lg:px-12 pb-16 md:pb-24 pt-8'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Further Exploration
          </h2>
          <div className='space-y-8'>
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Learn More
              </h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <span className='text-white/70'>Gaia Space Observatory</span>
                  <span className='text-white/40'> — Measuring parallaxes for 2 billion stars</span>
                </li>
                <li>
                  <span className='text-white/70'>SH0ES Collaboration</span>
                  <span className='text-white/40'> — Precision Cepheid and supernova measurements</span>
                </li>
                <li>
                  <span className='text-white/70'>Planck Collaboration</span>
                  <span className='text-white/40'> — CMB measurements of cosmic parameters</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Related Explainers
              </h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='/work/stellar-cartography' className='text-[var(--color-blue)] hover:text-white transition-colors'>
                    Stellar Cartography
                  </a>
                  <span className='text-white/40'> — 50,000 stars from Gaia</span>
                </li>
                <li>
                  <a href='/work/gravitational-wave' className='text-[var(--color-blue)] hover:text-white transition-colors'>
                    The Chirp
                  </a>
                  <span className='text-white/40'> — Gravitational wave astronomy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
