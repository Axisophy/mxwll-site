'use client';

import { useState } from 'react';
import { MissionMap } from './components/MissionMap';
import { TransferAnimation } from './components/TransferAnimation';
import { TransferDesigner } from './components/TransferDesigner';
import { MissionStoryboard } from './components/MissionStoryboard';

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

export default function OrbitalMechanicsPage() {
  return (
    <main className='min-h-screen bg-black'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              Orbital Mechanics
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              A Beginner&apos;s Guide
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              An accessible introduction to how spacecraft navigate  - from the counterintuitive physics of orbits to the elegant mathematics of getting to the Moon. Designed to explain what mission controllers actually do without requiring any calculus.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Explanation Design</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Space</span>
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
              <MetadataDropdown title='Generally interested adults'>
                <p>Curious people who&apos;ve watched rocket launches and wondered how spacecraft actually navigate. They know orbits exist but don&apos;t understand why going faster can make you slow down, or why you can&apos;t just point at the Moon and fire. The reward is understanding what mission controllers see when they plot a trajectory.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Start by acknowledging the counterintuition: space travel doesn&apos;t work like driving a car. Then build understanding through the key insight that orbits are just falling  - perpetually missing the ground.</p>
                <p>The Hohmann transfer provides a concrete, visual example. Interactive sliders let people discover the relationships themselves. Real mission profiles connect the abstract to the familiar.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Adaptability
              </span>
              <MetadataDropdown>
                <p>This approach  - acknowledge counterintuition, provide key insight, build through interactive exploration  - works for any subject where common intuition is wrong. Relativity, quantum mechanics, evolutionary biology, economics.</p>
                <p>The interactive trajectory framework extends to any dynamical system: interplanetary transfers, satellite constellations, even non-space applications like optimal routing.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>React, TypeScript, SVG</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Data
              </span>
              <span className='text-sm text-white/70'>NASA mission profiles, JPL Horizons</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 1: HOOK - Visual */}
      <section className='relative h-[50vh] min-h-[400px] bg-black overflow-hidden flex items-center justify-center'>
        <div className='absolute inset-0'>
          {/* Space background with orbital curves suggestion */}
          <div className='w-full h-full' style={{
            background: 'radial-gradient(ellipse at 30% 50%, #0a1628 0%, #000 70%)'
          }} />
          {/* Orbital path suggestion */}
          <svg className='absolute inset-0 w-full h-full opacity-20' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid slice'>
            <ellipse cx='30' cy='50' rx='25' ry='35' fill='none' stroke='#0055FF' strokeWidth='0.3' />
            <ellipse cx='30' cy='50' rx='45' ry='60' fill='none' stroke='#0055FF' strokeWidth='0.2' />
            <circle cx='30' cy='50' r='3' fill='#0055FF' opacity='0.5' />
          </svg>
        </div>
        <div className='relative text-center text-white px-4'>
          <h2 className='font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-4'>
            Orbital Mechanics
          </h2>
          <p className='font-display text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white/80'>
            The geometry of falling forever
          </p>
        </div>
      </section>

      {/* Stage 2: ANCHOR - "Space Travel Isn't Like Driving" */}
      <section className='px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Space Travel Isn&apos;t Like Driving
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              On Earth, if you want to go somewhere, you point at it and hit the accelerator. Want to go faster? Press harder. Want to catch up to something ahead of you? Speed up.
            </p>
            <p>
              In space, none of this works.
            </p>
            <p>
              To go faster, you often need to fire your engine backward. To catch something ahead of you, you slow down first. To reach the Moon, you don&apos;t point at it  - you aim at where it will be in three days, and you get there by falling.
            </p>
            <p>
              This isn&apos;t because space is mysterious. It&apos;s because orbits obey rules that are beautifully counterintuitive.
            </p>
            <p>
              <strong>Once you see the rules, the confusion disappears.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Stage 3: FOUNDATION - "Orbits Are Just Falling" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Orbits Are Just Falling
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Here&apos;s the key insight: an orbiting spacecraft is falling toward Earth  - it&apos;s just moving sideways fast enough that it keeps missing.
            </p>
            <p>
              Throw a ball, and it arcs down and hits the ground. Throw it faster, and it goes further before landing. Throw it fast enough (about 28,000 km/h at low Earth orbit altitude), and by the time it falls, the curved Earth has fallen away beneath it by exactly the same amount.
            </p>
            <p>
              That&apos;s an orbit. Perpetual falling, perpetual missing. No engine required to maintain it  - just the right balance of speed and altitude.
            </p>
            <p>
              This is why the counterintuitions make sense. Speed up in a circular orbit, and you rise higher  - you&apos;re now going too fast to fall at this altitude. Slow down, and you fall closer. The relationship between speed and altitude is fixed by physics.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 4a: BUILD - "The Shape of Orbits" + Mission Map */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Shape of Orbits
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Orbits come in different shapes, all ellipses (or circles, which are just special ellipses).
            </p>
            <p>
              A spacecraft in low Earth orbit circles at about 400 km altitude, completing one orbit every 90 minutes. The Moon orbits much higher  - about 384,000 km away  - taking 27 days per orbit.
            </p>
            <p>
              To travel between these orbits, a spacecraft needs to change its shape  - stretch out from a circle to an ellipse that touches both altitudes, then circularise at the destination.
            </p>
            <p>
              The interactive below shows a lunar mission profile. Notice how the transfer orbit connects low Earth orbit to the Moon&apos;s orbit.
            </p>
          </div>
        </div>
        <div className='border border-white/10 overflow-hidden'>
          <MissionMap />
        </div>
      </section>

      {/* Stage 4b: BUILD - "The Hohmann Transfer" + Animation */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Hohmann Transfer
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              In 1925, German engineer Walter Hohmann discovered the most fuel-efficient way to move between two circular orbits. It uses exactly two engine burns.
            </p>
            <p>
              <strong>First burn:</strong> At the starting orbit, fire your engine to speed up. This stretches your circular orbit into an ellipse whose far point touches the destination orbit.
            </p>
            <p>
              <strong>Coast:</strong> You&apos;re now on a transfer ellipse. No engine needed  - you&apos;re falling outward, slowing down as you climb against gravity.
            </p>
            <p>
              <strong>Second burn:</strong> When you reach the high point (apoapsis), fire again to circularise. Otherwise you&apos;d fall back down the ellipse.
            </p>
            <p>
              Watch the transfer below. Notice how velocity drops as altitude increases  - trading speed for height.
            </p>
          </div>
        </div>
        <div className='border border-white/10 overflow-hidden'>
          <TransferAnimation />
        </div>
        <p className='text-xs md:text-sm text-white/50 mt-4 max-w-2xl'>
          Scrub through time to see how velocity and altitude change during a lunar transfer. Notice how the spacecraft slows as it climbs out of Earth&apos;s gravity well.
        </p>
      </section>

      {/* Stage 4c: BUILD - "The Oberth Effect" + Designer */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Oberth Effect
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Here&apos;s something strange: a rocket engine produces more useful energy when the spacecraft is already moving fast.
            </p>
            <p>
              The engine produces the same thrust regardless of speed. But kinetic energy depends on velocity squared. Adding 1 km/s to a spacecraft moving at 10 km/s adds much more energy than adding 1 km/s to one moving at 1 km/s.
            </p>
            <p>
              This is why Hohmann transfers work so well. Both burns happen at the fastest points in the orbit  - periapsis (closest to Earth) and apoapsis (at the destination). Burning at these points extracts maximum value from every kilogram of fuel.
            </p>
            <p>
              Try adjusting the orbital parameters below to see how the required velocity change (delta-v) varies with the orbit ratio.
            </p>
          </div>
        </div>
        <div className='border border-white/10 overflow-hidden'>
          <TransferDesigner />
        </div>
        <p className='text-xs md:text-sm text-white/50 mt-4 max-w-2xl'>
          Adjust the orbital parameters to see how {'\u0394'}v requirements change. For very distant targets (ratio {'>'} 11.94), a bi-elliptic transfer becomes more efficient than Hohmann  - at the cost of much longer travel time.
        </p>
      </section>

      {/* Stage 4d: BUILD - "Real Missions" + Storyboard */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Real Missions
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Real lunar missions add complexity. The Moon is moving, so timing matters  - you need to arrive when the Moon is actually there. The spacecraft needs to enter lunar orbit, not just fly past.
            </p>
            <p>
              Apollo used a direct transfer: launch, trans-lunar injection burn, coast for three days, enter lunar orbit. Simple and fast.
            </p>
            <p>
              Artemis uses a more complex trajectory involving a near-rectilinear halo orbit (NRHO). It takes longer but requires less fuel and provides better geometry for lunar surface access. Different constraints, different optimal solution.
            </p>
            <p>
              Explore the mission phases below to see how the full trajectory breaks down.
            </p>
          </div>
        </div>
        <div className='border border-white/10 overflow-hidden'>
          <MissionStoryboard />
        </div>
      </section>

      {/* Stage 5: REWARD - "The Geometry of Getting There" */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-black text-white'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Geometry of Getting There
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Watch a rocket launch now, and you see something different than you did ten minutes ago.
            </p>
            <p>
              You see the spacecraft not as something being pushed through space, but as something falling  - carefully aimed so it falls from one orbit onto an ellipse that touches another. You understand why the burns happen when they do, and why the trajectory curves the way it does.
            </p>
            <p>
              The counterintuitions resolve. Slowing down to catch up makes sense when you realise you need to fall to a lower, faster orbit. Going backward to go forward makes sense when you realise you&apos;re changing the shape of your fall.
            </p>
            <p className='text-white'>
              Orbital mechanics isn&apos;t mysterious. It&apos;s geometry  - the geometry of falling forever, and choosing where to fall.
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
            For the curious  - you&apos;ve got the main idea, this is extra.
          </p>
        </div>
      </section>

      {/* 6a: Orbital Elements */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Orbital Elements
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Mission controllers describe orbits using six numbers called Keplerian elements: semi-major axis (size), eccentricity (shape), inclination (tilt), longitude of ascending node (orientation), argument of periapsis (rotation), and true anomaly (position).
            </p>
            <p>
              These six numbers completely define where an object is and where it&apos;s going. Change any one, and you get a different orbit. Spacecraft maneuvers are really just carefully calculated changes to these elements.
            </p>
          </div>
        </div>
      </section>

      {/* 6b: Gravity Assists */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Gravity Assists
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              For interplanetary missions, fuel is precious. Spacecraft can &quot;borrow&quot; energy from planets through gravity assists  - flying close enough to be deflected, gaining (or losing) speed relative to the Sun without burning any fuel.
            </p>
            <p>
              Voyager 2 used gravity assists at Jupiter, Saturn, and Uranus to reach Neptune. Without them, the mission would have been impossible with available rockets. The spacecraft gained speed from each encounter while the planets lost an imperceptible amount.
            </p>
            <p>
              It&apos;s like bouncing a tennis ball off a moving truck  - the ball gains speed from the collision while the truck barely notices.
            </p>
          </div>
        </div>
      </section>

      {/* 6c: The Three-Body Problem */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            The Three-Body Problem
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Everything we&apos;ve discussed assumes only one gravitational body matters at a time. In reality, a spacecraft traveling to the Moon feels both Earth&apos;s and the Moon&apos;s gravity (and the Sun&apos;s, and...).
            </p>
            <p>
              The three-body problem has no general closed-form solution  - we can&apos;t write an equation that gives the position at any time. Instead, mission planners use numerical integration: calculate the forces now, take a tiny step forward, recalculate, repeat millions of times.
            </p>
            <p>
              But the three-body problem has special solutions: Lagrange points, where gravitational and centrifugal forces balance. The James Webb Space Telescope orbits one of these points, L2, about 1.5 million km from Earth.
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
                      href='https://www.amazon.co.uk/Fundamentals-Astrodynamics-Dover-Aeronautical-Engineering/dp/0486600610'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Fundamentals of Astrodynamics  - Bate, Mueller, White
                    </a>
                    <span className='text-white/40 ml-2'>The classic textbook</span>
                  </li>
                  <li>
                    <a
                      href='https://www.amazon.co.uk/Ignition-Informal-History-Liquid-Propellants/dp/0813595835'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Ignition!  - John D. Clark
                    </a>
                    <span className='text-white/40 ml-2'>History of rocket propellants, surprisingly entertaining</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Watch
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='https://www.youtube.com/watch?v=i5XPFjqPLik'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Scott Manley: Orbital Mechanics
                    </a>
                    <span className='text-white/40 ml-2'>Clear explanations with Kerbal Space Program</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Play
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='https://www.kerbalspaceprogram.com/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Kerbal Space Program
                    </a>
                    <span className='text-white/40 ml-2'>The best way to develop orbital intuition</span>
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
                      href='https://en.wikipedia.org/wiki/Hohmann_transfer_orbit'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Hohmann transfer orbit (Wikipedia)
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Oberth_effect'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Oberth effect (Wikipedia)
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://ssd.jpl.nasa.gov/horizons/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      JPL Horizons System
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
                      href='/work/stellar-evolution'
                      className='text-white/70 hover:text-[var(--color-pink)] transition-colors'
                    >
                      Stellar Evolution →
                    </a>
                  </li>
                  <li>
                    <a
                      href='/work/nuclide-chart'
                      className='text-white/70 hover:text-[var(--color-pink)] transition-colors'
                    >
                      Chart of Nuclides →
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
