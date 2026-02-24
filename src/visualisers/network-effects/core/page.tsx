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

function TimelineItem({ year, first, winner }: { year: string; first: string; winner: string }) {
  return (
    <div className='flex items-center gap-4 py-4 border-b border-white/10'>
      <span className='text-xs font-mono text-white/40 w-16'>{year}</span>
      <span className='text-white/50 flex-1'>{first}</span>
      <span className='text-white/40'>→</span>
      <span className='font-bold flex-1'>{winner}</span>
    </div>
  );
}

export default function NetworkEffectsPage() {
  return (
    <main className='min-h-screen bg-black'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              Why Your Competitor&apos;s Head Start Doesn&apos;t Matter
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              Network Effects and Market Timing
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              The companies that dominate their markets are rarely the ones that got there first. This explainer shows when first-mover advantage matters, when it doesn&apos;t, and what actually determines market outcomes.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Explanation Design</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Strategy</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Business Leaders</span>
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
              <MetadataDropdown title='Business Leaders'>
                <p>Executives and strategists who face competitive decisions about market timing, investment, and positioning. They&apos;ve heard &quot;first-mover advantage&quot; but haven&apos;t examined when it actually applies. The reward is a diagnostic framework for their own markets.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Lead with the counterintuitive conclusion: first doesn&apos;t mean winner. Use immediately recognisable examples (Google, Facebook, iPhone) to establish credibility before introducing the framework.</p>
                <p>Structure follows inverted pyramid - conclusions first, supporting detail after. Respect executive reading patterns: assume interrupted attention, make key points scannable.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Adaptability
              </span>
              <MetadataDropdown>
                <p>The network effects framework applies to any market with user-generated value: platforms, marketplaces, social products, standards-dependent technologies. The diagnostic questions work for strategic planning in any sector.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>React, D3.js, SVG</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 1: HOOK */}
      <section className='relative h-[70vh] min-h-[500px] bg-black overflow-hidden flex items-center justify-center'>
        <div className='absolute inset-0' style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)'
        }} />
        <div className='relative text-center text-white px-4 max-w-4xl'>
          <p className='font-mono text-sm text-[var(--color-lime)] mb-8 tracking-wider'>
            FIRST MOVER → MARKET LEADER
          </p>
          <div className='space-y-4 mb-8'>
            <p className='text-xl md:text-2xl text-white/60'>AltaVista → <span className='text-white font-bold'>Google</span></p>
            <p className='text-xl md:text-2xl text-white/60'>MySpace → <span className='text-white font-bold'>Facebook</span></p>
            <p className='text-xl md:text-2xl text-white/60'>Nokia → <span className='text-white font-bold'>iPhone</span></p>
          </div>
          <h2 className='font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4'>
            First Doesn&apos;t Mean Winner
          </h2>
          <p className='font-display text-xl md:text-2xl font-bold tracking-tight text-white/80'>
            Here&apos;s what does.
          </p>
        </div>
      </section>

      {/* Stage 2: ANCHOR - "The Myth of First-Mover Advantage" */}
      <section className='px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Myth of First-Mover Advantage
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              <strong>The conventional wisdom is wrong.</strong>
            </p>
            <p>
              Being first to market is overrated. In markets with network effects, timing matters far less than reaching the tipping point where growth becomes self-reinforcing.
            </p>
            <p>
              Google was the 21st search engine. Facebook was years behind MySpace. The iPhone arrived 14 years after the first smartphone. They won anyway - and not by a little.
            </p>
            <p>
              The pattern is consistent: in network-effect markets, the company that crosses the tipping point first usually takes everything. And that company is rarely the pioneer.
            </p>
          </div>
        </div>

        {/* Timeline visual */}
        <div className='mt-12 max-w-3xl'>
          <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
            First Mover vs Market Winner
          </h3>
          <TimelineItem year='1995' first='AltaVista (Search)' winner='Google (1998)' />
          <TimelineItem year='2003' first='MySpace (Social)' winner='Facebook (2004)' />
          <TimelineItem year='1992' first='Simon (Smartphone)' winner='iPhone (2007)' />
          <TimelineItem year='2006' first='Friendster (Video)' winner='YouTube (2005)' />
          <TimelineItem year='1995' first='eBay (Marketplace)' winner='Amazon (1994)' />
        </div>
      </section>

      {/* Stage 3: FOUNDATION - "Network Effects" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            What Are Network Effects?
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              A network effect exists when a product becomes more valuable as more people use it.
            </p>
            <p>
              A phone with one user is worthless. With ten users, it&apos;s marginally useful. With a billion users, it&apos;s indispensable. The product didn&apos;t change - only the number of people using it.
            </p>
            <p>
              This creates exponential dynamics. Early growth is painful (why join a network with few users?). But once you cross a threshold, growth accelerates: each new user makes the product better, which attracts more users, which makes it even better.
            </p>
            <div className='border-l-4 border-[var(--color-blue)] pl-4 py-2 my-6'>
              <p className='text-white/70 font-medium'>
                The key insight: In network-effect markets, market share isn&apos;t linear. A 10% lead can become a 90% market share when the tipping point hits.
              </p>
            </div>
          </div>
        </div>

        {/* S-curve placeholder */}
        <div className='border border-white/10 bg-white/10 p-12 flex items-center justify-center'>
          <div className='text-center'>
            <p className='text-white/40 font-mono text-sm mb-2'>[Interactive S-Curve]</p>
            <p className='text-white/50 text-sm max-w-md'>
              Adjust user growth rate and see value curve respond. Before tipping point: slow. After: explosive.
            </p>
          </div>
        </div>
        <p className='text-xs md:text-sm text-white/50 mt-4'>
          The S-curve of network adoption. The tipping point is where growth becomes self-sustaining.
        </p>
      </section>

      {/* Stage 4a: BUILD - "Types of Network Effects" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Three Types of Network Effects
          </h2>
          <div className='space-y-6 text-white/70 leading-relaxed'>
            <div>
              <h3 className='text-lg font-bold text-black mb-2'>Direct Network Effects</h3>
              <p>
                Users benefit directly from other users. Phone networks, messaging apps, social platforms. More users = more people to connect with.
              </p>
            </div>
            <div>
              <h3 className='text-lg font-bold text-black mb-2'>Indirect Network Effects</h3>
              <p>
                Users benefit from complements attracted by other users. Gaming consoles attract developers, which attracts more gamers, which attracts more developers. Two-sided markets.
              </p>
            </div>
            <div>
              <h3 className='text-lg font-bold text-black mb-2'>Data Network Effects</h3>
              <p>
                Product improves as usage generates more data. Google gets better at search because billions of queries train its algorithms. Each user makes it better for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 4b: BUILD - "The Tipping Point" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Tipping Point
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Network-effect markets have a brutal characteristic: winner takes most.
            </p>
            <p>
              Before the tipping point, multiple competitors can coexist. After it, the market rapidly consolidates around one or two winners. The losers don&apos;t just fall behind - they often disappear entirely.
            </p>
            <p>
              MySpace had 115 million users in 2008. By 2011, it was irrelevant. Not because the product got worse, but because Facebook crossed the tipping point and network effects made switching costs unbearable.
            </p>
            <div className='border-l-4 border-[var(--color-pink)] pl-4 py-2 my-6'>
              <p className='text-white/70 font-medium'>
                &quot;Almost winning&quot; in a network-effect market often means total loss. There&apos;s no silver medal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 4c: BUILD - "When First-Mover Does Matter" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            When First-Mover Does Matter
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              First-mover advantage is real - just not where most people think.
            </p>
            <p>
              <strong>It matters when:</strong>
            </p>
            <ul className='space-y-2 ml-4'>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <span>No network effects exist (traditional products, physical goods)</span>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <span>Switching costs are locked in early (enterprise software with deep integration)</span>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <span>Regulatory capture is possible (telecom licenses, banking charters)</span>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <span>Patents provide real protection (pharmaceuticals, some hardware)</span>
              </li>
            </ul>
            <p>
              <strong>It doesn&apos;t matter when:</strong>
            </p>
            <ul className='space-y-2 ml-4'>
              <li className='flex gap-2'>
                <span className='text-[var(--color-pink)]'>-</span>
                <span>Network effects dominate (platforms, marketplaces, social)</span>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-pink)]'>-</span>
                <span>Technology is evolving rapidly (the leader pioneers, the follower optimises)</span>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-pink)]'>-</span>
                <span>Market education is expensive (pioneers pay, fast followers harvest)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stage 4d: BUILD - "Diagnostic Questions" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Does Your Market Have Network Effects?
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Ask these questions about your market:
            </p>
            <div className='space-y-4 mt-6'>
              <div className='bg-white/10 p-4'>
                <p className='font-bold text-black mb-1'>1. Does your product get better when more people use it?</p>
                <p className='text-sm'>If yes: network effects are likely present.</p>
              </div>
              <div className='bg-white/10 p-4'>
                <p className='font-bold text-black mb-1'>2. Would users lose value if they switched to a competitor?</p>
                <p className='text-sm'>If yes: you have switching costs, which amplify network effects.</p>
              </div>
              <div className='bg-white/10 p-4'>
                <p className='font-bold text-black mb-1'>3. Is there a clear &quot;tipping point&quot; in your market&apos;s history?</p>
                <p className='text-sm'>If yes: you&apos;re in a winner-take-most market.</p>
              </div>
              <div className='bg-white/10 p-4'>
                <p className='font-bold text-black mb-1'>4. Are there multiple viable competitors with similar market share?</p>
                <p className='text-sm'>If yes: either tipping hasn&apos;t happened yet, or network effects are weak.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 5: REWARD */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-black text-white'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Strategic Implication
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Stop asking &quot;How do we get there first?&quot;
            </p>
            <p>
              Start asking &quot;How strong are network effects in this market?&quot; If they&apos;re strong, the game isn&apos;t about timing - it&apos;s about crossing the tipping point before anyone else does.
            </p>
            <p>
              Your competitor&apos;s head start is only an advantage if they can convert it into network effects before you can. Often, they can&apos;t - because they&apos;re optimising for the wrong thing.
            </p>
            <p className='text-white'>
              The race isn&apos;t to be first. It&apos;s to be first to tip.
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
            For those who want the detail behind the framework.
          </p>
        </div>
      </section>

      {/* 6a: The Math */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            The Mathematics
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Metcalfe&apos;s Law suggests network value grows proportionally to n{'\u00B2'} (users squared). A network with 10 users has potential value of 100; with 100 users, value is 10,000.
            </p>
            <p>
              This is why small differences in adoption can lead to massive differences in outcomes. A 20% lead in users can mean a 44% lead in network value - which attracts even more users, widening the gap.
            </p>
            <p>
              Modern research suggests the exponent varies by network type. Social networks may be closer to n{'\u00B9'}{'\u00B7'}{'\u2075'}. But the core insight holds: growth is super-linear.
            </p>
          </div>
        </div>
      </section>

      {/* 6b: Case Studies */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Case Studies
          </h3>
          <div className='space-y-6 text-white/70 leading-relaxed'>
            <div>
              <h4 className='font-bold text-black mb-2'>Uber vs Lyft</h4>
              <p>
                Launched within a year of each other. Uber&apos;s aggressive growth strategy reached tipping point first. Despite Lyft offering comparable service, Uber maintains 70%+ US market share. Network effects (driver density, rider liquidity) make switching painful.
              </p>
            </div>
            <div>
              <h4 className='font-bold text-black mb-2'>Slack vs Microsoft Teams</h4>
              <p>
                Slack pioneered workplace messaging. Microsoft bundled Teams with Office 365. Despite being years late, Teams now dominates - because Microsoft&apos;s existing enterprise network effects (Office, Azure) outweighed Slack&apos;s head start.
              </p>
            </div>
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
                      href='https://www.amazon.co.uk/Platform-Revolution-Networked-Markets-Transforming/dp/0393354350'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Platform Revolution - Parker, Van Alstyne, Choudary
                    </a>
                    <span className='text-white/40 ml-2'>Comprehensive platform strategy</span>
                  </li>
                  <li>
                    <a
                      href='https://www.amazon.co.uk/Zero-One-Notes-Start-Future/dp/0753555204'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Zero to One - Peter Thiel
                    </a>
                    <span className='text-white/40 ml-2'>Monopoly and network effects</span>
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
                      href='https://en.wikipedia.org/wiki/Network_effect'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Network effect (Wikipedia)
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Metcalfe%27s_law'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Metcalfe&apos;s Law (Wikipedia)
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
                      href='/work/braess-paradox'
                      className='text-white/70 hover:text-[var(--color-pink)] transition-colors'
                    >
                      The Braess Paradox →
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
