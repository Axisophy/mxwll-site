import { Metadata } from 'next';
import ClientExplorer from './components/ClientExplorer';

export const metadata: Metadata = {
  title: '4.5 Billion Years in 14 Steps — Radioactive Decay Chains | Bang Industries',
  description: 'Follow a single Uranium-238 nucleus through 14 transformations to become stable Lead-206. A journey spanning 21 orders of magnitude in time, from 164 microseconds to 4.5 billion years.',
  alternates: {
    canonical: 'https://bangindustries.co/work/decay-chain',
  },
};

export default function DecayChainPage() {
  return (
    <main className='min-h-screen bg-black text-white'>
      {/* Hero */}
      <section className='relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-radial from-[#1a1a2e] to-black' />

        {/* Animated nucleus background */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='w-64 h-64 rounded-full bg-gradient-radial from-[#0055FF]/20 to-transparent animate-pulse' />
        </div>

        <div className='relative z-10 text-center px-4 max-w-3xl'>
          <div className='text-xs font-mono uppercase tracking-widest text-white/40 mb-4'>
            U-238 → Pb-206
          </div>
          <h1 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6'>
            4.5 Billion Years<br />in 14 Steps
          </h1>
          <p className='text-xl md:text-2xl text-white/70 mb-8'>
            The radioactive decay chain of Uranium-238
          </p>
          <p className='text-base text-white/50 max-w-xl mx-auto'>
            Every atom of uranium in the Earth is a clock, counting down.
            Follow the journey from unstable uranium to stable lead — through
            8 alpha decays and 6 beta decays, across time scales from
            microseconds to billions of years.
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
            What is Nuclear Decay?
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The periodic table tells us what elements exist. The nuclide chart tells us
              what they <em>do</em>. Some atomic nuclei are stable — they will exist
              unchanged for eternity. Others are unstable, and will eventually transform
              into something else.
            </p>
            <p>
              <strong className='text-white'>Alpha decay (α):</strong> The nucleus ejects
              a helium-4 particle (2 protons + 2 neutrons). The atom loses 4 units of mass
              and becomes a completely different element — two steps down the periodic table.
            </p>
            <p>
              <strong className='text-white'>Beta-minus decay (β⁻):</strong> A neutron
              transforms into a proton, releasing an electron and an antineutrino. The
              atom&apos;s mass stays the same, but it gains a proton — becoming the next
              element up.
            </p>
            <p>
              The U-238 decay chain uses both. Eight alpha decays strip away mass. Six
              beta decays adjust the proton-neutron balance. The result: uranium becomes
              lead, via 14 transformations.
            </p>
          </div>
        </div>
      </section>

      {/* The extraordinary time scales */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-24 bg-white/5'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            21 Orders of Magnitude
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The longest step in the chain — U-238&apos;s first decay — takes 4.468 billion
              years. Almost exactly the age of the Earth. Half of all the uranium that
              existed when our planet formed has already decayed.
            </p>
            <p>
              The fastest step — Po-214 to Pb-210 — takes 164 microseconds. In that time,
              light travels just 49 kilometres.
            </p>
            <p>
              The ratio between these two? <strong className='text-white'>8.6 × 10²⁰</strong>.
              That&apos;s 860 billion trillion times faster. If the first step were one second,
              the fastest step would be 0.00000000000000000001 seconds.
            </p>
            <p>
              This extraordinary range is explained by quantum tunneling. Alpha particles
              must tunnel through an energy barrier to escape the nucleus. A tiny increase
              in energy makes tunneling exponentially more likely — transforming billion-year
              half-lives into microsecond flashes.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive explorer */}
      <ClientExplorer />

      {/* Real-world connections */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-24 bg-black'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Why This Matters
          </h2>
          <div className='space-y-8'>
            <div>
              <h3 className='text-xl font-bold mb-2 text-[#FFD700]'>Uranium-Lead Dating</h3>
              <p className='text-white/70'>
                The ratio of U-238 to Pb-206 in a rock tells us when it formed. The oldest
                minerals on Earth — Jack Hills zircons from Western Australia — are 4.4
                billion years old. Every Pb-206 atom in that zircon was once U-238.
              </p>
            </div>
            <div>
              <h3 className='text-xl font-bold mb-2 text-[#87CEEB]'>Radon in Buildings</h3>
              <p className='text-white/70'>
                Rn-222 is the only gas in the chain. It seeps through cracks in floors and
                foundations into basements. Radon is the second leading cause of lung cancer
                after smoking — estimated 21,000 deaths per year in the US alone. The UK
                mandates radon testing in high-risk areas.
              </p>
            </div>
            <div>
              <h3 className='text-xl font-bold mb-2 text-[#FF6347]'>Polonium: The Assassin&apos;s Element</h3>
              <p className='text-white/70'>
                Po-210 — the final unstable isotope in the chain — was used to assassinate
                Alexander Litvinenko in London in 2006. Intensely radioactive, it delivers
                devastating alpha radiation to biological tissue at close range. It exists
                naturally in tiny amounts in all uranium-bearing rock.
              </p>
            </div>
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
                  <a href='/work/nuclide-chart' className='text-[var(--color-blue)] hover:text-white transition-colors'>
                    The Nuclide Chart
                  </a>
                  <span className='text-white/40'> — The full landscape of nuclear stability</span>
                </li>
                <li>
                  <a href='/work/stellar-evolution' className='text-[var(--color-blue)] hover:text-white transition-colors'>
                    Stellar Evolution
                  </a>
                  <span className='text-white/40'> — Where heavy elements are made</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Key Figures
              </h3>
              <ul className='space-y-2 text-sm text-white/70'>
                <li><strong className='text-white'>Marie Curie</strong> — Discovered radium (Ra-226) and polonium (Po-210)</li>
                <li><strong className='text-white'>Ernest Rutherford</strong> — Identified alpha and beta radiation</li>
                <li><strong className='text-white'>Clair Cameron Patterson</strong> — Used U-Pb dating to determine the age of Earth (1956)</li>
                <li><strong className='text-white'>George Gamow</strong> — Explained alpha decay via quantum tunneling (1928)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
