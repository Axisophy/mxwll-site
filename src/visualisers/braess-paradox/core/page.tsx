'use client';

import { useState } from 'react';

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
          className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='square' strokeLinejoin='miter' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>
      {isOpen && (
        <div className='text-xs text-white/60 mt-2 leading-relaxed space-y-2'>
          {children}
        </div>
      )}
    </div>
  );
}

function CaseStudyCard({ city, year, action, result }: { city: string; year: string; action: string; result: string }) {
  return (
    <div className='border border-white/10 p-6'>
      <div className='flex items-baseline gap-2 mb-2'>
        <span className='font-bold'>{city}</span>
        <span className='text-xs font-mono text-white/40'>{year}</span>
      </div>
      <p className='text-sm text-white/70 mb-2'>{action}</p>
      <p className='text-sm font-medium text-[var(--color-blue)]'>{result}</p>
    </div>
  );
}

export default function BraessParadoxPage() {
  return (
    <main className='min-h-screen bg-black'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              The Braess Paradox
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              When More Makes Things Worse
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              Adding a new highway can make traffic worse. Expanding capacity can reduce throughput. This isn&apos;t a paradox - it&apos;s game theory. Understanding why individual optimization creates collective harm is essential for effective infrastructure and network policy.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Explanation Design</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Policy</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Game Theory</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className='space-y-6'>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Category
              </span>
              <span className='text-sm'>Explanation Design</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Audience
              </span>
              <MetadataDropdown title='Policymakers'>
                <p>Officials and analysts involved in infrastructure, urban planning, or network governance. They understand that systems are complex but may not have encountered formal game theory. The reward is a diagnostic framework for identifying when capacity expansion will backfire.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Lead with the dramatic real-world example (Seoul&apos;s highway removal) to establish that this isn&apos;t academic theory - it&apos;s observed reality. Then introduce the formal mechanism through the classic Braess network.</p>
                <p>Evidence-based throughout with citations. Interactive simulation makes the paradox visceral rather than abstract.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Adaptability
              </span>
              <MetadataDropdown>
                <p>The Braess Paradox applies to any network where individual agents choose routes: road networks, internet traffic, power grids, supply chains. The game-theoretic framework (Nash equilibrium vs system optimum) transfers directly.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>React, D3.js, Network Simulation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 1: HOOK */}
      <section className='relative h-[70vh] min-h-[500px] bg-black overflow-hidden flex items-center justify-center'>
        <div className='absolute inset-0' style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%)'
        }} />
        {/* Network lines suggestion */}
        <svg className='absolute inset-0 w-full h-full opacity-20' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid slice'>
          <line x1='20' y1='30' x2='50' y2='30' stroke='#0055FF' strokeWidth='0.5' />
          <line x1='50' y1='30' x2='80' y2='30' stroke='#0055FF' strokeWidth='0.5' />
          <line x1='20' y1='70' x2='50' y2='70' stroke='#0055FF' strokeWidth='0.5' />
          <line x1='50' y1='70' x2='80' y2='70' stroke='#0055FF' strokeWidth='0.5' />
          <line x1='50' y1='30' x2='50' y2='70' stroke='#FF0055' strokeWidth='1' strokeDasharray='2,2' />
          <circle cx='20' cy='30' r='2' fill='#0055FF' />
          <circle cx='50' cy='30' r='2' fill='#0055FF' />
          <circle cx='80' cy='30' r='2' fill='#0055FF' />
          <circle cx='20' cy='70' r='2' fill='#0055FF' />
          <circle cx='50' cy='70' r='2' fill='#0055FF' />
          <circle cx='80' cy='70' r='2' fill='#0055FF' />
        </svg>
        <div className='relative text-center text-white px-4 max-w-4xl'>
          <p className='font-mono text-sm text-[var(--color-pink)] mb-8 tracking-wider'>
            SEOUL, 2003
          </p>
          <h2 className='font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4'>
            They Tore Down a Highway
          </h2>
          <p className='font-display text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white/80'>
            Traffic got better. Much better.
          </p>
        </div>
      </section>

      {/* Stage 2: ANCHOR - "When More Makes Things Worse" */}
      <section className='px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            When More Makes Things Worse
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              In 2003, Seoul demolished the Cheonggyecheon Expressway - a six-lane elevated highway carrying 168,000 vehicles per day through the city centre.
            </p>
            <p>
              Traffic planners expected chaos. Instead, traffic <em>improved</em>. Average travel times across the network decreased. The city replaced the highway with a park.
            </p>
            <p>
              This wasn&apos;t magic. It was mathematics - specifically, a phenomenon first identified by German mathematician Dietrich Braess in 1968. He proved that adding capacity to a network can, counterintuitively, make overall performance worse.
            </p>
            <p>
              The implications extend far beyond traffic. Power grids, internet routing, supply chains - anywhere individuals make locally optimal choices that create globally suboptimal outcomes, the Braess Paradox can emerge.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 3: FOUNDATION - "The Classic Network" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Classic Network
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Consider a simple network. 100 cars need to travel from point A to point B. There are two routes: one through the north (via N), one through the south (via S).
            </p>
            <p>
              Each route has two segments. Some segments have fixed travel time (45 minutes regardless of traffic). Others are congestion-dependent (travel time equals the number of cars using them).
            </p>
            <p>
              In equilibrium, traffic splits evenly. Each route takes 95 minutes. Total system travel time: 9,500 car-minutes.
            </p>
            <p>
              <strong>Now add a shortcut</strong> - a fast road connecting N to S. Surely this helps?
            </p>
          </div>
        </div>

        {/* Network diagram placeholder */}
        <div className='border border-white/10 bg-white/10 p-12 flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <p className='text-white/40 font-mono text-sm mb-2'>[Interactive Network Diagram]</p>
            <p className='text-white/50 text-sm max-w-md'>
              Route 100 cars from A to B. Watch as adding the shortcut makes everyone&apos;s journey longer.
            </p>
          </div>
        </div>
        <p className='text-xs md:text-sm text-white/50 mt-4'>
          The classic Braess network. Before the shortcut: 95 minutes per car. After: 100 minutes per car.
        </p>
      </section>

      {/* Stage 4a: BUILD - "The Mechanism" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Mechanism
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Here&apos;s what happens when the shortcut opens:
            </p>
            <ol className='space-y-4 ml-4'>
              <li className='flex gap-4'>
                <span className='text-[var(--color-blue)] font-bold'>1.</span>
                <div>
                  <strong>Individual incentive:</strong> Each driver sees a faster route through the shortcut. Taking A-N-S-B appears to save time.
                </div>
              </li>
              <li className='flex gap-4'>
                <span className='text-[var(--color-blue)] font-bold'>2.</span>
                <div>
                  <strong>Collective shift:</strong> When everyone makes this locally optimal choice, traffic concentrates on the congestion-sensitive segments (A-N and S-B).
                </div>
              </li>
              <li className='flex gap-4'>
                <span className='text-[var(--color-blue)] font-bold'>3.</span>
                <div>
                  <strong>New equilibrium:</strong> All 100 cars now use the same route. Travel time increases to 100 minutes per car. Total system time: 10,000 car-minutes.
                </div>
              </li>
            </ol>
            <div className='border-l-4 border-[var(--color-blue)] pl-4 py-2 my-6'>
              <p className='text-white/70 font-medium'>
                The shortcut didn&apos;t reduce travel time - it eliminated the only mechanism forcing traffic to distribute efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 4b: BUILD - "Real-World Evidence" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Real-World Evidence
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The Braess Paradox isn&apos;t just theory. It&apos;s been documented in real infrastructure:
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <CaseStudyCard
            city='Seoul'
            year='2003'
            action='Demolished 6-lane elevated highway'
            result='Traffic speeds improved 3-6% citywide'
          />
          <CaseStudyCard
            city='Stuttgart'
            year='1969'
            action='Closed major road for construction'
            result='City-wide congestion decreased during closure'
          />
          <CaseStudyCard
            city='New York'
            year='1990'
            action='42nd Street closed for Earth Day'
            result='Predicted gridlock never materialized'
          />
          <CaseStudyCard
            city='Boston'
            year='2008'
            action='Modeled selfish vs coordinated routing'
            result='30% efficiency loss from selfish routing identified'
          />
          <CaseStudyCard
            city='San Francisco'
            year='1989'
            action='Embarcadero Freeway collapsed (earthquake)'
            result='Traffic improved; highway never rebuilt'
          />
          <CaseStudyCard
            city='London'
            year='2003'
            action='Congestion pricing introduced'
            result='Traffic reduced 30% in charging zone'
          />
        </div>
      </section>

      {/* Stage 4c: BUILD - "Nash vs System Optimum" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Nash Equilibrium vs System Optimum
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The Braess Paradox illustrates a fundamental tension in game theory.
            </p>
            <p>
              <strong>Nash equilibrium</strong> occurs when no individual can improve their outcome by changing their behavior alone. Each driver is taking their best available route given what everyone else is doing.
            </p>
            <p>
              <strong>System optimum</strong> occurs when total travel time is minimized. This requires some drivers to take routes that are worse for them personally, but better for everyone collectively.
            </p>
            <p>
              In networks with certain characteristics, the Nash equilibrium can be significantly worse than the system optimum. This gap is called the &quot;Price of Anarchy&quot; - the cost society pays for uncoordinated decision-making.
            </p>
            <div className='bg-white/10 p-4 my-6'>
              <p className='font-bold text-xs uppercase tracking-wider text-white/50 mb-1'>
                Policy Implication
              </p>
              <p className='text-white/70'>
                When the Price of Anarchy is high, infrastructure additions can make things worse. The solution isn&apos;t always more capacity - sometimes it&apos;s better coordination mechanisms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 4d: BUILD - "Beyond Traffic" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Beyond Traffic
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The Braess Paradox appears wherever agents independently optimize their routes through a shared network:
            </p>
            <ul className='space-y-4 ml-4'>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <div>
                  <strong>Power grids:</strong> Adding transmission lines can destabilize networks if power flows shift to overload other components.
                </div>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <div>
                  <strong>Internet routing:</strong> Adding bandwidth can increase latency when packets reroute to congest new links.
                </div>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <div>
                  <strong>Supply chains:</strong> Opening new suppliers can reduce reliability when all buyers shift to the same source.
                </div>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <div>
                  <strong>Organisations:</strong> Adding communication channels can slow decision-making when everyone routes through the new shortcut.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stage 5: REWARD */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-black text-white'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            A Different Question
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The Braess Paradox teaches us to ask a different question.
            </p>
            <p>
              Not &quot;Will this new capacity be used?&quot; - it almost certainly will be. But &quot;Will individual optimization create system-level dysfunction?&quot;
            </p>
            <p>
              Sometimes the answer is yes. Sometimes removing options improves outcomes. Sometimes constraints create efficiency by forcing coordination that wouldn&apos;t happen voluntarily.
            </p>
            <p className='text-white'>
              Infrastructure policy isn&apos;t just engineering. It&apos;s game theory - and the optimal solution isn&apos;t always more.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 6: EXTEND - Going Deeper */}
      <section className='px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Going Deeper
          </h2>
          <p className='text-white/50 text-sm'>
            Technical background for those who want the formal framework.
          </p>
        </div>
      </section>

      {/* 6a: Formal Definition */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Formal Definition
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The Braess Paradox occurs when adding an edge to a network increases the cost at Nash equilibrium. Formally: let G be a network with edge costs c{'\u2091'}(f{'\u2091'}) depending on flow f{'\u2091'}. Adding edge e&apos; creates network G&apos;. The paradox occurs when:
            </p>
            <p className='font-mono text-sm bg-white/10 p-4'>
              C{'\u2099\u2091'}(G&apos;) {'>'} C{'\u2099\u2091'}(G)
            </p>
            <p>
              Where C{'\u2099\u2091'} is the total cost at Nash equilibrium.
            </p>
            <p>
              Roughgarden and Tardos (2002) showed that for linear latency functions, the Price of Anarchy is bounded by 4/3 - meaning selfish routing can be at most 33% worse than optimal. For more general functions, the gap can be arbitrarily large.
            </p>
          </div>
        </div>
      </section>

      {/* 6b: Solutions */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Mechanism Design Solutions
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              If we can&apos;t rely on individual optimization to produce good outcomes, how do we achieve coordination?
            </p>
            <ul className='space-y-4 ml-4'>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <div>
                  <strong>Congestion pricing:</strong> Charge for externalities. London&apos;s congestion charge makes drivers internalize the cost they impose on others.
                </div>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <div>
                  <strong>Strategic capacity removal:</strong> As Seoul demonstrated, sometimes the solution is less infrastructure, not more.
                </div>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <div>
                  <strong>Information design:</strong> Control what routing information is available. Navigation apps already do this, sometimes controversially.
                </div>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <div>
                  <strong>Centralized routing:</strong> Remove individual choice entirely. Autonomous vehicles could enable system-optimal routing.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6c: Historical Context */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Historical Context
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Dietrich Braess published his paradox in 1968 in the German journal Unternehmensforschung. It remained relatively obscure until the 1990s, when researchers began finding real-world examples.
            </p>
            <p>
              The paradox connected to broader work in game theory, particularly Wardrop&apos;s equilibrium conditions (1952) and the emerging field of algorithmic game theory. Today, the Price of Anarchy is a standard measure in network design.
            </p>
            <p>
              Braess himself noted the philosophical implications: &quot;For each point in time, all users of the network can agree that they should be better off... and yet they cannot achieve this improvement.&quot; It&apos;s a striking illustration of how rational individual behavior can produce irrational collective outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 7: LAUNCH - Further Exploration */}
      <section className='px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24 pt-16 md:pt-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Further Exploration
          </h2>
          <div>
            <div className='space-y-8'>
              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Recommended Reading
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='https://www.amazon.co.uk/Algorithmic-Game-Theory-Noam-Nisan/dp/0521872820'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Algorithmic Game Theory - Nisan et al.
                    </a>
                    <span className='text-white/40 ml-2'>Comprehensive technical reference</span>
                  </li>
                  <li>
                    <a
                      href='https://www.amazon.co.uk/Thinking-Systems-Donella-H-Meadows/dp/1603580557'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Thinking in Systems - Donella Meadows
                    </a>
                    <span className='text-white/40 ml-2'>Accessible systems thinking primer</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Reference
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Braess%27s_paradox'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Braess&apos;s paradox (Wikipedia)
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Price_of_anarchy'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Price of anarchy (Wikipedia)
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Cheonggyecheon'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Cheonggyecheon restoration (Wikipedia)
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Related Explainers
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='/work/network-effects'
                      className='text-white/70 hover:text-[var(--color-pink)] transition-colors'
                    >
                      Network Effects →
                    </a>
                  </li>
                  <li>
                    <a
                      href='/work/orbital-mechanics'
                      className='text-white/70 hover:text-[var(--color-pink)] transition-colors'
                    >
                      Orbital Mechanics →
                    </a>
                  </li>
                  <li>
                    <a
                      href='/work/fractals'
                      className='text-white/70 hover:text-[var(--color-pink)] transition-colors'
                    >
                      What are Fractals? →
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
