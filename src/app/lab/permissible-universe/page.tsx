'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const PermissibleUniverse = dynamic(
  () => import('@/visualisers/permissible-universe/core/PermissibleUniverse'),
  { ssr: false }
)

const LIMITS = [
  {
    id: 'schwarzschild',
    name: 'Schwarzschild Limit',
    subtitle: 'The Black Hole Limit',
    equation: 'R_s = 2GM/c\u00B2',
    description: 'If you pack too much mass into too small a space, gravity becomes so strong that not even light can escape. This creates a black hole. The Schwarzschild limit marks this point of no return.',
    forbids: 'Region above the line',
  },
  {
    id: 'compton',
    name: 'Compton Limit',
    subtitle: 'The Quantum Limit',
    equation: '\u03BB_C = h/mc',
    description: 'Quantum mechanics says everything is a wave. The heavier something is, the shorter its wavelength. If you try to confine a particle smaller than its wavelength, quantum effects make it impossible - the particle becomes fuzzy and delocalised.',
    forbids: 'Region below the line',
  },
  {
    id: 'planck',
    name: 'Planck Scale',
    subtitle: 'The Resolution of Reality',
    equation: 'l_P = \u221A(\u0127G/c\u00B3)',
    description: 'At the Planck scale, both quantum mechanics and gravity become equally important. Our current theories break down here - we need quantum gravity to understand what happens. It is the smallest meaningful distance.',
    forbids: 'Region to the left',
  },
  {
    id: 'hubble',
    name: 'Hubble Radius',
    subtitle: 'The Edge of the Observable',
    equation: 'R_H = c/H\u2080',
    description: 'The universe is expanding. At a certain distance, space is stretching faster than light can travel through it. Beyond this Hubble radius, nothing that happens can ever affect us - it is the edge of our cosmic horizon.',
    forbids: 'Region above the line',
  },
]

const BIG_QUESTIONS = [
  {
    id: 'universe-black-hole',
    number: 1,
    title: 'Is the Universe a Black Hole?',
    hook: 'Both the instanton and the Hubble radius lie on the Schwarzschild line.',
    content: 'The universe has always been on the Schwarzschild line as it expanded. Both the smallest possible object (the instanton at Planck scale) and the largest (the Hubble radius) sit exactly on this boundary.\n\nDoes this mean we\'re inside a black hole?\n\nThe catch: The Schwarzschild solution assumes empty space surrounds the black hole. Our universe isn\'t surrounded by empty Minkowski space - or is it?',
  },
  {
    id: 'desert-gap',
    number: 2,
    title: 'What Fills the Gap?',
    hook: '17 orders of magnitude with no known particles.',
    content: 'Between the top quark (173 GeV) and the Planck scale (10\u00B9\u2079 GeV), there are 17 orders of magnitude with no known particles.\n\nIs this "desert" real, or are there undiscovered particles waiting to be found with bigger colliders?\n\nCandidates include: supersymmetric partners, GUT bosons, string excitations, right-handed neutrinos.',
  },
  {
    id: 'below-planck',
    number: 3,
    title: 'What Happens Below the Planck Length?',
    hook: 'No object can be smaller than the Planck length - but why?',
    content: 'The diagram shows "sub-Planckian unknown" in the far left. No object can be smaller than the Planck length (10\u207B\u00B3\u00B3 cm).\n\nDoes space itself become discrete? Does the concept of "size" break down entirely?\n\nTheories addressing this include: Loop quantum gravity (discrete spacetime), string theory (minimum length), and noncommutative geometry.',
  },
  {
    id: 'instanton',
    number: 4,
    title: 'The Instanton Question',
    hook: 'Where three limits meet: what are the degrees of freedom?',
    content: 'At the Planck scale, three lines meet: Compton, Schwarzschild, and nuclear density. An object here would simultaneously be:\n\u2022 The smallest possible black hole\n\u2022 The highest energy photon\n\u2022 At nuclear density\n\nWhat ARE the degrees of freedom at this scale? This is perhaps the deepest question in physics.',
  },
  {
    id: 'matter-antimatter',
    number: 5,
    title: 'Why Is There Anything?',
    hook: 'The universe contains matter but almost no antimatter.',
    content: 'The laws of physics treat matter and antimatter almost identically. Yet the universe contains matter but almost no antimatter.\n\nSomething broke the symmetry in the first fraction of a second. We don\'t know what.\n\nCurrent understanding: CP violation exists but is too weak. Baryogenesis requires new physics we haven\'t discovered.',
  },
  {
    id: 'dark-universe',
    number: 6,
    title: 'What Is 95% of the Universe?',
    hook: 'Only 5% is made of atoms. The rest is unknown.',
    content: 'Only 5% of the universe is made of atoms - the stuff we can see and touch. The rest:\n\u2022 ~27% dark matter (unknown particles that clump gravitationally)\n\u2022 ~68% dark energy (unknown field that accelerates cosmic expansion)\n\nWe\'ve mapped something we don\'t understand. The Permissible Universe shows the 5% we know - the rest is invisible.',
  },
]

export default function Page() {
  const [expandedLimit, setExpandedLimit] = useState<string | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
            The Permissible Universe
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] mt-2">
            A map of everything that can exist
          </p>
          <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6">
            An interactive mass-radius diagram showing ~200 cosmic objects from quarks to supermassive black holes, positioned according to fundamental physical limits. Click any object or boundary line to learn more.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Astrophysics</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">Interactive</span>
            <span className="font-nhg px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)] uppercase tracking-wider">D3.js</span>
          </div>
        </div>
      </section>

      {/* Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="h-[500px] md:h-[700px] lg:h-[800px]">
            <PermissibleUniverse />
          </div>
        </div>
        <div className="md:hidden mt-4 text-center">
          <p className="font-nhg text-xs italic text-[var(--text-tertiary)]">
            This visualiser maps 200+ cosmic objects and is best experienced on a larger screen.
          </p>
        </div>
      </section>

      {/* The Four Limits */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16">
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em] mb-3">
          The Four Limits
        </h2>
        <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mb-8">
          The universe permits only certain combinations of mass and size. These four boundaries carve out the "permissible" zone where matter, energy, and structure can exist.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LIMITS.map((limit) => (
            <button
              key={limit.id}
              onClick={() => setExpandedLimit(expandedLimit === limit.id ? null : limit.id)}
              className="text-left bg-[var(--bg-secondary)] rounded-xl p-6 transition-colors hover:bg-[var(--bg-tertiary)]"
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-nhg text-lg font-medium text-[var(--text-primary)]">
                  {limit.name}
                </h3>
                <svg
                  className={`w-5 h-5 text-[var(--text-tertiary)] transition-transform ${expandedLimit === limit.id ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="font-nhg text-sm text-[var(--text-secondary)] mb-3">{limit.subtitle}</p>
              <span className="font-mono text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-1 rounded">
                {limit.equation}
              </span>
              {expandedLimit === limit.id && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed">
                    {limit.description}
                  </p>
                  <p className="font-nhg text-xs text-[var(--text-tertiary)] mt-3">
                    Forbids: {limit.forbids}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Where They Meet */}
        <div className="mt-8 bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
          <h3 className="font-nhg text-lg font-medium text-[var(--text-primary)] mb-3">Where They Meet</h3>
          <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl mb-6">
            The Schwarzschild and Compton lines intersect at a single point: the Planck mass (~22 micrograms). This is the only mass where an object could be simultaneously a black hole and a quantum particle. It marks the boundary where general relativity and quantum mechanics must somehow merge - the domain of quantum gravity, still not fully understood.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-[var(--bg-tertiary)] rounded-lg px-4 py-2">
              <div className="font-nhg text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">Planck Mass</div>
              <div className="font-mono text-sm text-[var(--text-primary)]">2.18 x 10⁻⁵ g</div>
            </div>
            <div className="bg-[var(--bg-tertiary)] rounded-lg px-4 py-2">
              <div className="font-nhg text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">Planck Length</div>
              <div className="font-mono text-sm text-[var(--text-primary)]">1.62 x 10⁻³³ cm</div>
            </div>
            <div className="bg-[var(--bg-tertiary)] rounded-lg px-4 py-2">
              <div className="font-nhg text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">Planck Time</div>
              <div className="font-mono text-sm text-[var(--text-primary)]">5.39 x 10⁻⁴⁴ s</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Big Questions */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24">
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em] mb-3">
          The Big Questions
        </h2>
        <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mb-8">
          The Permissible Universe isn't just a map - it's a window into the deepest mysteries of physics.
        </p>
        <div className="space-y-3">
          {BIG_QUESTIONS.map((question) => (
            <button
              key={question.id}
              onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
              className="w-full text-left bg-[var(--bg-secondary)] rounded-xl p-6 transition-colors hover:bg-[var(--bg-tertiary)]"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-sm text-[var(--text-tertiary)] mt-0.5">{question.number}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-nhg text-lg font-medium text-[var(--text-primary)]">
                      {question.title}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-[var(--text-tertiary)] transition-transform flex-shrink-0 ml-4 ${expandedQuestion === question.id ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <p className="font-nhg text-sm text-[var(--text-secondary)] mt-1">{question.hook}</p>
                  {expandedQuestion === question.id && (
                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                      <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                        {question.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
