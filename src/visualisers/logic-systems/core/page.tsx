'use client';

import { useState } from 'react';
import { CircuitPlayground } from './components/CircuitPlayground';
import { DecisionBoundary } from './components/DecisionBoundary';
import { LogicToMLBridge } from './components/LogicToMLBridge';

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

export default function LogicSystemsPage() {
  return (
    <main className='min-h-screen bg-black'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              From Gates to Gradients
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              How logic circuits become learning machines
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              Machine learning can feel like magic - or like impenetrable mathematics.
              Neither is true. This interactive guide builds from something concrete
              (logic gates, the AND/OR/NOT you might remember from school) to something
              powerful (neural networks that can learn almost any pattern). The key
              insight: they&apos;re all doing the same thing - dividing space into regions.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/50'>Interactive</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/50'>Education</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/50'>Machine learning</span>
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
              <MetadataDropdown title='Curious non-specialists'>
                <p>Anyone who wants to understand what machine learning actually does, without requiring prior knowledge of statistics or programming. Starting from logic gates provides familiar ground.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/50 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Build from concrete to abstract. Logic gates create sharp boundaries. Decision trees learn chunky splits. Neural networks learn smooth curves. The key insight: all classifiers divide space into regions.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/50 block mb-2'>
                Adaptability
              </span>
              <MetadataDropdown>
                <p>The pedagogical pattern - start concrete, build to abstract, show connections - applies to any complex system: cryptography, compression, optimisation, or any domain where underlying simplicity is hidden by surface complexity.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/50 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>React, TypeScript, SVG</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/50 block mb-2'>
                Data
              </span>
              <span className='text-sm text-white/70'>Procedurally generated datasets</span>
            </div>
          </div>
        </div>
      </section>

      {/* Static image placeholder */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='border border-white/10 bg-white/10 aspect-[2/1] flex items-center justify-center'>
          <span className='text-black/30 text-sm font-mono'>logic_to_ml_progression.png</span>
        </div>
        <p className='text-xs md:text-sm text-white/50 mt-4 max-w-2xl'>
          The same classification problem solved three ways: Boolean logic (sharp quadrants),
          decision tree (axis-aligned rectangles), neural network (smooth curves).
        </p>
      </section>

      {/* Part A: Boolean Logic */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='border border-white/10 bg-black overflow-hidden'>
          <CircuitPlayground />
        </div>
      </section>

      {/* Part B: Decision Boundaries */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='border border-white/10 bg-black overflow-hidden'>
          <DecisionBoundary />
        </div>
      </section>

      {/* The Bridge */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='border border-white/10 bg-black overflow-hidden'>
          <LogicToMLBridge />
        </div>
      </section>

      {/* Content sections */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'>
            The Challenge
          </h2>
          <p className='text-white/70 leading-relaxed'>
            Machine learning has a reputation problem. To non-specialists, it appears as either impenetrable mathematics or magical black boxes. Neither framing helps people understand what these systems actually do, why they work, or where they fail. For Mxwll, we wanted to build a bridge from the familiar (logic gates, the kind you might have encountered in a physics class) to the unfamiliar (neural networks, the kind that power modern AI).
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
              Boolean logic is the foundation of all digital computation. AND gates output 1 only if both inputs are 1. OR gates output 1 if either input is 1. NOT gates flip the input. From these primitives, you can build any computable function - including arithmetic, memory, and entire computers.
            </p>
            <p>
              The key insight connecting logic to machine learning is the concept of a decision boundary. A Boolean function divides its input space into regions that map to 0 or 1. A machine learning classifier does the same thing - but instead of the boundary being hand-designed, it is learned from examples.
            </p>
            <p>
              The simplest ML classifier (logistic regression) learns a single straight line to separate classes. More complex models (polynomial features, neural networks) learn curved or wiggly boundaries. The tradeoff is always between flexibility and the risk of overfitting - memorising the training data rather than learning the underlying pattern.
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
              <a href='/work/network-theory' className='text-white/70 hover:text-[var(--color-pink)] transition-colors'>
                Network Theory →
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
