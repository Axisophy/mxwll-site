'use client';

import { useState } from 'react';
import { NetworkComparison } from './components/NetworkComparison';
import { AttackSimulation } from './components/AttackSimulation';
import { EpidemicSimulation } from './components/EpidemicSimulation';

function MetadataDropdown({ title, children }: { title?: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center ${title ? 'justify-between w-full' : ''} text-left`}
      >
        {title && <span className='text-sm'>{title}</span>}
        <svg
          className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='square' strokeLinejoin='miter' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>
      {isOpen && (
        <div className='text-xs text-white/50 mt-2 leading-relaxed space-y-2'>
          {children}
        </div>
      )}
    </div>
  );
}

export default function NetworkTheoryPage() {
  return (
    <main className='min-h-screen bg-black'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              Fragile by Design
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              How topology shapes resilience, epidemics, and information flow
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              Not all networks fail the same way. A random network degrades gracefully under attack. A scale-free network - the topology of the internet, airline routes, and social graphs - can survive random failures but collapses catastrophically when its hubs are targeted. These interactive experiments make the mathematics of connection tangible.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/50'>Interactive</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/50'>Systems</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/50'>Network theory</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/50'>Mxwll</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className='space-y-6'>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/50 block mb-2'>
                Category
              </span>
              <span className='text-sm'>Interactive Design</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/50 block mb-2'>
                Audience
              </span>
              <MetadataDropdown title='Students and systems thinkers'>
                <p>Anyone curious about why some systems are fragile and others resilient. From students encountering graph theory to engineers designing robust infrastructure.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/50 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Interactive experiments let users break networks and watch epidemics spread. Seeing scale-free networks disintegrate under targeted attack makes the hub vulnerability viscerally clear.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/50 block mb-2'>
                Adaptability
              </span>
              <MetadataDropdown>
                <p>The same framework applies to any system modelled as nodes and edges: supply chains, organisational structures, infrastructure, social networks. The topology shapes the behaviour.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/50 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>React, TypeScript, SVG, Force-directed layout</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/50 block mb-2'>
                Data
              </span>
              <span className='text-sm text-white/70'>Procedurally generated networks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Static image placeholder */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='border border-white/10 bg-white/10 aspect-[2/1] flex items-center justify-center'>
          <span className='text-black/30 text-sm font-mono'>network_comparison_static.png</span>
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
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
            The Challenge
          </h2>
          <p className='text-white/70 leading-relaxed'>
            Networks are everywhere - social connections, infrastructure grids, biological pathways, the internet. But not all networks are the same. Some are resilient to random failures but collapse when targeted. Others spread information slowly but contain outbreaks. Understanding why requires understanding topology - the shape of connection itself. For Mxwll, we built interactive tools to make these abstract properties tangible.
          </p>
        </div>
      </section>

      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
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
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
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
    </main>
  );
}
