'use client';

import { NetworkComparison } from './components/NetworkComparison';
import { AttackSimulation } from './components/AttackSimulation';
import { EpidemicSimulation } from './components/EpidemicSimulation';
import MetadataDropdown from '@/components/MetadataDropdown';

export default function NetworkTheoryPage() {
  return (
    <main className='min-h-screen'>
      {/* Header */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <h1 className='font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]'>
          Network Theory
        </h1>
        <p className='font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2'>
          How topology shapes resilience, epidemics, and information flow
        </p>
        <p className='font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12'>
          Interactive network topology comparison, epidemic spread simulation, and attack resilience testing. Force-directed graph layout with random vs scale-free network generation.
        </p>
        {/* Tags */}
        <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
          <span className='px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'>SVG</span>
          <span className='px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'>Mathematics</span>
          <span className='px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'>Simulation</span>
          <span className='px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'>Interactive</span>
        </div>
        {/* Metadata */}
        <div className='flex flex-wrap gap-x-12 gap-y-6 mt-8 md:mt-12'>
          <div>
            <span className='font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2'>Category</span>
            <span className='font-nhg text-sm'>Interactive Design</span>
          </div>
          <div>
            <span className='font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2'>Audience</span>
            <MetadataDropdown title='Students and systems thinkers'>
              <p>Anyone curious about why some systems are fragile and others resilient. From students encountering graph theory to engineers designing robust infrastructure.</p>
            </MetadataDropdown>
          </div>
          <div>
            <span className='font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2'>Approach</span>
            <MetadataDropdown>
              <p>Interactive experiments let users break networks and watch epidemics spread. Seeing scale-free networks disintegrate under targeted attack makes the hub vulnerability viscerally clear.</p>
            </MetadataDropdown>
          </div>
          <div>
            <span className='font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2'>Technology</span>
            <span className='font-nhg text-sm'>React, TypeScript, SVG, Force-directed layout</span>
          </div>
        </div>
      </section>

      {/* Dark content */}
      <div className='bg-black text-white'>

      {/* Static image placeholder */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='border border-white/10 bg-white/10 aspect-[2/1] flex items-center justify-center'>
          <span className='text-black/30 text-sm font-nhg'>network_comparison_static.png</span>
        </div>
        <p className='text-xs md:text-sm text-white/50 mt-4'>
          Three canonical network topologies with identical node counts, coloured by degree.
        </p>
      </section>

      {/* Interactive: Network Topologies */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='border border-white/10 bg-black overflow-hidden'>
          <NetworkComparison nodeCount={80} />
        </div>
      </section>

      {/* Experiment: Attack vs Random Failure */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='border border-white/10 bg-black overflow-hidden'>
          <AttackSimulation />
        </div>
      </section>

      {/* Experiment: Epidemic Spread */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='border border-white/10 bg-black overflow-hidden'>
          <EpidemicSimulation />
        </div>
      </section>

      {/* Content sections */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em]'>
            The Challenge
          </h2>
          <p className='text-white/70 leading-relaxed'>
            Networks are everywhere - social connections, infrastructure grids, biological pathways, the internet. But not all networks are the same. Some are resilient to random failures but collapse when targeted. Others spread information slowly but contain outbreaks. Understanding why requires understanding topology - the shape of connection itself. For Mxwll, we built interactive tools to make these abstract properties tangible.
          </p>
        </div>
      </section>

      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em]'>
            Background
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Three network types dominate the research literature, each with distinct properties:
            </p>
            <p>
              Random networks (Erdos-Renyi) connect nodes with uniform probability. Degree distribution is narrow - most nodes have similar numbers of connections. Robust to any single failure, but no node is particularly important.
            </p>
            <p>
              Scale-free networks (Barabasi-Albert) grow through preferential attachment - new nodes connect to already-popular nodes. This creates hubs with many connections and a long tail of peripheral nodes. The degree distribution follows a power law. Hubs make the network efficient but create critical vulnerabilities.
            </p>
            <p>
              Small-world networks (Watts-Strogatz) combine local clustering with occasional long-range shortcuts. Most connections are to neighbours, but a few bridges span the network. This gives both high clustering (your friends know each other) and short path lengths (six degrees of separation).
            </p>
          </div>
        </div>
      </section>

      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em]'>
            Related Projects
          </h2>
          <ul className='space-y-2 text-sm'>
            <li>
              <a href='/work/nuclide-chart' className='text-white/70 hover:text-[var(--color-pink)] transition-colors'>
                Chart of Nuclides →
              </a>
            </li>
            <li>
              <a href='/work/stellar-evolution' className='text-white/70 hover:text-[var(--color-pink)] transition-colors'>
                Stellar Evolution →
              </a>
            </li>
            <li>
              <a href='/work/fractals' className='text-white/70 hover:text-[var(--color-pink)] transition-colors'>
                Fractals →
              </a>
            </li>
          </ul>
        </div>
      </section>
      </div>
    </main>
  );
}
