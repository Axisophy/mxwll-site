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

function ComponentCard({ name, icon, role, color }: { name: string; icon: string; role: string; color: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`p-6 border border-white/10 transition-all cursor-pointer ${isHovered ? 'bg-white/10' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`text-4xl mb-4 ${color}`}>{icon}</div>
      <h4 className='text-lg font-bold mb-2'>{name}</h4>
      <p className='text-white/70 text-sm'>{role}</p>
    </div>
  );
}

export default function ConsoleHardwarePage() {
  return (
    <main className='min-h-screen bg-black'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              What&apos;s Inside Your Console?
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              A Guide for Gamers
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              You use it every day to play games. But what&apos;s actually happening inside that box? Let&apos;s open it up and find out what makes your console tick - no tools required.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Explanation Design</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Technology</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Kids (8-12)</span>
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
              <MetadataDropdown title='Kids (8-12)'>
                <p>Young gamers who use consoles every day but have no idea what&apos;s inside. They know how to play games and navigate menus, but the hardware is a mystery. The reward is feeling like they understand technology that adults often can&apos;t explain.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>We use familiar analogies - the console has a brain, memory, and senses, just like you. Four main components (respecting 3-4 chunk working memory limits for this age), each mapped to something they already understand.</p>
                <p>Bright, tactile visuals. Lots of animation. Humour throughout. Components should look &quot;touchable&quot; - we want them to feel like they could build one.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Adaptability
              </span>
              <MetadataDropdown>
                <p>This approach - hardware demystification through analogy - works for any complex device. Phones, cars, washing machines. The four-component framework (processor, graphics, short-term memory, long-term storage) applies to most computing devices.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>React, SVG Animation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 1: HOOK */}
      <section className='relative h-[70vh] min-h-[500px] bg-black overflow-hidden flex items-center justify-center'>
        <div className='absolute inset-0' style={{
          background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #000 70%)'
        }} />
        {/* Animated circuit pattern suggestion */}
        <svg className='absolute inset-0 w-full h-full opacity-10' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid slice'>
          <pattern id='circuit' width='20' height='20' patternUnits='userSpaceOnUse'>
            <path d='M10 0 L10 10 M0 10 L20 10' stroke='#0055FF' strokeWidth='0.5' fill='none' />
            <circle cx='10' cy='10' r='1' fill='#0055FF' />
          </pattern>
          <rect width='100' height='100' fill='url(#circuit)' />
        </svg>
        <div className='relative text-center text-white px-4'>
          <p className='font-mono text-lg md:text-xl text-[var(--color-lime)] mb-4'>
            100,000,000,000 calculations per second
          </p>
          <h2 className='font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-4'>
            What&apos;s Inside Your Console?
          </h2>
          <p className='font-display text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white/80'>
            That&apos;s what happens every time you press a button
          </p>
        </div>
      </section>

      {/* Stage 2: ANCHOR - "The Computer That Plays Games" */}
      <section className='px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Computer That Plays Games
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Your PlayStation, Xbox, or Switch might look like a simple box. But inside? It&apos;s a seriously powerful computer - more powerful than every computer on Earth... in 1980. Combined.
            </p>
            <p>
              The cool thing is, your console has parts that work a lot like <em>you</em> do:
            </p>
            <ul className='space-y-2 ml-4'>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <span>A <strong>brain</strong> that makes decisions</span>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <span>An <strong>artist</strong> that draws everything you see</span>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <span>A <strong>notepad</strong> for stuff it needs to remember right now</span>
              </li>
              <li className='flex gap-2'>
                <span className='text-[var(--color-blue)]'>-</span>
                <span>A <strong>bookshelf</strong> for all your games and saves</span>
              </li>
            </ul>
            <p>
              Let&apos;s meet each one.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 3: FOUNDATION - "The Four Parts" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Four Main Parts
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Every gaming console - PlayStation, Xbox, Nintendo Switch - has these four things inside. They all need to work together for you to play a game.
            </p>
            <p>
              <strong>See if you can spot:</strong> Which part do you think works the hardest when you&apos;re playing a game with amazing graphics?
            </p>
          </div>
        </div>

        {/* Interactive component grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <ComponentCard
            name='CPU - The Brain'
            icon='🧠'
            role='Makes all the decisions. "Should this enemy attack?" "Did that jump land?" The CPU figures it out.'
            color='text-[var(--color-blue)]'
          />
          <ComponentCard
            name='GPU - The Artist'
            icon='🎨'
            role='Draws every single thing you see on screen. Every frame. Every explosion. 60 times per second.'
            color='text-[var(--color-pink)]'
          />
          <ComponentCard
            name='RAM - The Notepad'
            icon='📝'
            role='Super fast memory for stuff happening right now. Where enemies are. What you&apos;re carrying. Gone when you turn it off.'
            color='text-[var(--color-lime)]'
          />
          <ComponentCard
            name='Storage - The Bookshelf'
            icon='📚'
            role='Where your games live. Your save files. Your screenshots. Still there when you turn it back on.'
            color='text-black'
          />
        </div>
        <p className='text-xs md:text-sm text-white/50 mt-4'>
          Click each part to learn more about what it does.
        </p>
      </section>

      {/* Stage 4a: BUILD - "The CPU" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Brain (CPU)
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              CPU stands for &quot;Central Processing Unit&quot; - but you can just think of it as the brain.
            </p>
            <p>
              Every single thing that happens in a game? The CPU decides. An enemy spots you and starts running toward you - the CPU calculated that. You press the jump button - the CPU figures out how high you go, whether you make it to the platform, whether you hit that coin.
            </p>
            <p>
              CPUs are measured in &quot;gigahertz&quot; (GHz). That&apos;s how fast they can think. A PS5 runs at 3.5 GHz, which means it can do 3.5 <em>billion</em> simple calculations every second.
            </p>
            <div className='border-l-4 border-[var(--color-blue)] pl-4 py-2 my-6'>
              <p className='text-white/70 font-medium'>Think of it like this: if you could do one maths problem per second, it would take you 111 years to do what your console&apos;s CPU does in one second.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 4b: BUILD - "The GPU" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Artist (GPU)
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              GPU stands for &quot;Graphics Processing Unit&quot; - the part that draws everything you see.
            </p>
            <p>
              Here&apos;s the wild thing: your TV shows you a new picture (called a &quot;frame&quot;) at least 60 times every second. That means the GPU has to draw an entirely new image of your game world - with all the lighting, shadows, reflections, and characters - in just 1/60th of a second.
            </p>
            <p>
              Why doesn&apos;t the CPU do this? Because drawing is actually thousands of tiny calculations happening at once. &quot;What colour should this pixel be?&quot; multiplied by 8 million pixels. The GPU is specially designed to do millions of simple calculations at the same time - something the CPU can&apos;t do.
            </p>
            <div className='border-l-4 border-[var(--color-pink)] pl-4 py-2 my-6'>
              <p className='text-white/70 font-medium'>The CPU is like one really smart person. The GPU is like thousands of less clever people all working together. For drawing, thousands of workers wins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 4c: BUILD - "Memory" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Fast vs Slow Memory
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Your console has two types of memory, and they&apos;re <em>very</em> different.
            </p>
            <p>
              <strong>RAM</strong> is like a whiteboard. It&apos;s super fast - the CPU can grab information from it almost instantly. But it gets wiped clean every time you turn off your console. RAM holds everything happening right now: where enemies are standing, what&apos;s in your inventory, the exact state of the game world.
            </p>
            <p>
              <strong>Storage</strong> (SSD or hard drive) is like a library. Much slower to access, but permanent. This is where your games are installed, where your save files live. A PS5 has 16 GB of RAM but 825 GB of storage - over 50 times more.
            </p>
            <div className='bg-white/10 p-4 my-6'>
              <p className='font-bold text-xs uppercase tracking-wider text-white/50 mb-1'>
                Why this matters
              </p>
              <p className='text-white/70'>Loading screens exist because the console is copying stuff from slow storage into fast RAM. Faster storage = shorter loading screens. That&apos;s why new consoles with SSDs load so much faster than old ones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 4d: BUILD - "Working Together" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            What Happens When You Start a Game
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Let&apos;s follow what actually happens when you launch a game:
            </p>
            <ol className='space-y-4 ml-4'>
              <li className='flex gap-4'>
                <span className='text-[var(--color-blue)] font-bold'>1.</span>
                <span><strong>Load:</strong> The game files copy from Storage into RAM. This is the loading screen.</span>
              </li>
              <li className='flex gap-4'>
                <span className='text-[var(--color-blue)] font-bold'>2.</span>
                <span><strong>Process:</strong> The CPU starts running the game code. It figures out where everything should be.</span>
              </li>
              <li className='flex gap-4'>
                <span className='text-[var(--color-blue)] font-bold'>3.</span>
                <span><strong>Render:</strong> The GPU takes that information and draws it - 60 times per second.</span>
              </li>
              <li className='flex gap-4'>
                <span className='text-[var(--color-blue)] font-bold'>4.</span>
                <span><strong>Repeat:</strong> Every time you press a button, the CPU processes it, updates the game state in RAM, and the GPU draws the new frame.</span>
              </li>
            </ol>
            <p>
              All of this happens in a fraction of a second. Press jump, and within 50 milliseconds (1/20th of a second), your character is in the air on screen.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 5: REWARD */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-black text-white'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Now You Know
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Next time you turn on your console, you know what&apos;s happening inside.
            </p>
            <p>
              The CPU is making billions of decisions. The GPU is painting millions of pixels. RAM is holding everything that matters right now. Storage is keeping your games safe until you need them.
            </p>
            <p>
              Four parts, working together, doing the impossible - letting you explore worlds, battle enemies, and race cars that don&apos;t exist. All in a box that fits in your entertainment center.
            </p>
            <p className='text-white'>
              Not bad for a gaming machine.
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
            Got the basics? Here&apos;s more cool stuff.
          </p>
        </div>
      </section>

      {/* 6a: Why It Gets Hot */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Why Does It Get Hot?
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Ever noticed your console gets warm? That&apos;s not a bug - it&apos;s physics.
            </p>
            <p>
              When electricity flows through the CPU and GPU doing calculations, some energy turns into heat. More calculations = more heat. That&apos;s why consoles have fans - they blow cool air over the hot parts to stop them from overheating.
            </p>
            <p>
              The PS5&apos;s weird shape? That&apos;s mostly for cooling. All those curves and vents help air flow through to keep everything from getting too toasty.
            </p>
          </div>
        </div>
      </section>

      {/* 6b: Console Evolution */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            How Far We&apos;ve Come
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The original PlayStation (1994) had 2 MB of RAM. The PS5 has 16,000 MB. That&apos;s 8,000 times more.
            </p>
            <p>
              The original Xbox (2001) could do about 20 billion calculations per second. The Xbox Series X can do over 12 <em>trillion</em>. That&apos;s 600 times more powerful.
            </p>
            <p>
              And it keeps getting better. The console you play today is more powerful than supercomputers that used to fill entire rooms. In another 10 years? Who knows what games will look like.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 7: LAUNCH - Further Exploration */}
      <section className='px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24 pt-16 md:pt-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Keep Exploring
          </h2>
          <div>
            <div className='space-y-8'>
              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Questions to Think About
                </h3>
                <ul className='space-y-2 text-sm text-white/70'>
                  <li>- How is your phone different from a console? (Hint: it&apos;s got the same four parts...)</li>
                  <li>- Why do some games take longer to load than others?</li>
                  <li>- What happens if the GPU can&apos;t keep up? (Ever seen a game &quot;lag&quot;?)</li>
                </ul>
              </div>

              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Watch
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='https://www.youtube.com/watch?v=O5nskjZ_GoI'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      How a CPU Works (Visual Guide)
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
