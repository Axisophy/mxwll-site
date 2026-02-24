'use client';

import { useState } from 'react';
import Link from 'next/link';

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

export default function MorphogenesisPage() {
  return (
    <main className='min-h-screen'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              Morphogenesis
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              Watching Turing patterns emerge from reaction and diffusion
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              In 1952, Alan Turing proposed that simple chemical reactions could spontaneously produce the spots, stripes and spirals found throughout nature. This interactive visualiser simulates the Gray-Scott reaction-diffusion model in real time, letting you watch complexity emerge from two simple rules: chemicals spread out, and chemicals react.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive Visualisation</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>WebGL</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Reaction-Diffusion</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Gray-Scott Model</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className='space-y-6'>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Category
              </span>
              <span className='text-sm'>Generative Art</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Audience
              </span>
              <MetadataDropdown title='Science communicators'>
                <p>Educators and communicators looking for intuitive demonstrations of emergence and self-organisation. Also anyone curious about the mathematics underlying biological patterns.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>The Gray-Scott model simulates two chemicals (U and V) that diffuse at different rates and react together. U is continuously fed into the system while V is removed. Different feed and kill rates produce dramatically different patterns.</p>
                <p>The simulation runs entirely on the GPU using WebGL2 with float framebuffers for numerical precision.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>React, WebGL2, GLSL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Placeholder */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='w-full aspect-video bg-black' />
      </section>

      {/* Interactive Visualiser Placeholder */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='w-full aspect-video bg-black border border-white/10 flex items-center justify-center'>
          <span className='text-white/30 text-sm font-mono'>[Reaction-Diffusion Visualiser]</span>
        </div>
      </section>

      {/* Content Grid */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-12 lg:gap-16'>
          {/* Left column - Main content */}
          <div className='space-y-12'>
            {/* The Challenge */}
            <div>
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6'>
                The Challenge
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  How do leopards get their spots? Why do zebras have stripes? These patterns seem impossibly complex, yet Turing showed they could emerge from remarkably simple chemistry. The challenge is making this insight visceral — not just understood intellectually, but felt through direct manipulation.
                </p>
              </div>
            </div>

            {/* Background */}
            <div>
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6'>
                Background
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  Reaction-diffusion systems describe how chemicals spread and interact over space and time. Turing&apos;s key insight was that if two chemicals diffuse at different rates, small random fluctuations can amplify into stable patterns. The faster-diffusing chemical acts as an inhibitor, while the slower one acts as an activator.
                </p>
                <p>
                  The Gray-Scott model is a specific reaction-diffusion system that produces an astonishing variety of patterns — from spots to stripes to labyrinthine waves — depending on just two parameters: the feed rate (how fast U is added) and the kill rate (how fast V is removed).
                </p>
              </div>
            </div>

            {/* Approach */}
            <div>
              <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6'>
                Approach
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  The visualiser uses WebGL2 to run the simulation entirely on the GPU. Each frame, a fragment shader computes the next state of every pixel in parallel, using float textures for numerical precision. The user can paint chemicals directly onto the canvas and adjust the feed and kill rates in real time.
                </p>
                <p>
                  A preset system offers named patterns (mitosis, coral, waves, etc.) that correspond to specific parameter regions in the Gray-Scott phase space.
                </p>
              </div>
            </div>
          </div>

          {/* Right column - Sidebar */}
          <div className='space-y-12'>
            {/* Technology */}
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Technology
              </h3>
              <ul className='space-y-2 text-sm text-white/70'>
                <li>React</li>
                <li>WebGL2</li>
                <li>GLSL Shaders</li>
                <li>Float Framebuffers</li>
              </ul>
            </div>

            {/* Related Projects */}
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Related Projects
              </h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link
                    href='/work/emergent-currents'
                    className='text-white/70 hover:text-[var(--color-blue)] transition-colors'
                  >
                    Emergent Currents →
                  </Link>
                </li>
                <li>
                  <Link
                    href='/work/fractals'
                    className='text-white/70 hover:text-[var(--color-blue)] transition-colors'
                  >
                    What are Fractals? →
                  </Link>
                </li>
                <li>
                  <Link
                    href='/work/stellar-evolution'
                    className='text-white/70 hover:text-[var(--color-blue)] transition-colors'
                  >
                    Stellar Evolution →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
