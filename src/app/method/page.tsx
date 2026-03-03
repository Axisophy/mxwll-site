'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MethodPage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>('explanation')

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  return (
    <div className="min-h-screen">
      {/* Section 1 - Opening */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-6">
            How we work
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
            Good work starts with understanding the problem clearly. We bring a systematic approach to every project - combining research, design thinking, and technical craft to produce work that is rigorous, elegant, and built to last.
          </p>
        </div>
      </section>

      {/* Section 2 - Three-column bento row */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {/* Cell A - Understand */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
            <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">
              UNDERSTAND
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-[-0.03em] mb-4">
              We start by asking hard questions
            </h2>
            <p className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed">
              Before any design work begins, we dig into the subject matter. What does the audience already know? Where does comprehension break down? What is the single most important thing they need to understand?
            </p>
          </div>

          {/* Cell B - Structure */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
            <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">
              STRUCTURE
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-[-0.03em] mb-4">
              We find the shape of the explanation
            </h2>
            <p className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed">
              Every complex idea has a natural structure - a sequence, a hierarchy, a set of relationships. We find that structure before we design anything. The visual form follows the explanatory logic, not the other way round.
            </p>
          </div>

          {/* Cell C - Build */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
            <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">
              BUILD
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-[-0.03em] mb-4">
              We make it work at every level
            </h2>
            <p className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed">
              Whether the deliverable is an interactive visualisation, an illustration system, or a designed document - we build it with care. Technically sound, visually resolved, and tested against real audiences where possible.
            </p>
          </div>

        </div>

        {/* Process flow diagram */}
        <div className="mt-8 bg-[var(--bg-secondary)] rounded-xl p-8 md:p-12">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <div className="flex-1 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center mx-auto mb-3">
                <span className="font-display text-lg md:text-xl font-bold">1</span>
              </div>
              <p className="font-display text-sm md:text-base font-bold tracking-[-0.03em]">Understand</p>
            </div>
            <div className="flex-shrink-0 w-8 md:w-16 h-[2px] bg-[var(--border)]" />
            <div className="flex-1 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center mx-auto mb-3">
                <span className="font-display text-lg md:text-xl font-bold">2</span>
              </div>
              <p className="font-display text-sm md:text-base font-bold tracking-[-0.03em]">Structure</p>
            </div>
            <div className="flex-shrink-0 w-8 md:w-16 h-[2px] bg-[var(--border)]" />
            <div className="flex-1 text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center mx-auto mb-3">
                <span className="font-display text-lg md:text-xl font-bold">3</span>
              </div>
              <p className="font-display text-sm md:text-base font-bold tracking-[-0.03em]">Build</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Accordion section */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em] mb-3">
            Our approaches
          </h2>
          <p className="font-nhg text-sm text-[var(--text-tertiary)] mb-8">
            We work across several disciplines. Each has its own methodology.
          </p>

          <div className="space-y-4">

            {/* Accordion Item 1 - Explanation Design */}
            <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('explanation')}
                className="w-full flex items-center justify-between p-6 hover:bg-[var(--bg-tertiary)] transition-colors text-left"
              >
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold tracking-[-0.03em] mb-1">
                    Explanation Design
                  </h3>
                  <p className="font-nhg text-sm text-[var(--text-tertiary)]">
                    Making complex ideas genuinely comprehensible
                  </p>
                </div>
                <svg
                  className={`w-6 h-6 transition-transform ${openAccordion === 'explanation' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openAccordion === 'explanation' && (
                <div className="p-6 pt-0">
                  <p className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                    Explanation design is the practice of making difficult ideas accessible without dumbing them down. It draws on cognitive science, information design, and narrative structure - and it requires genuine understanding of the subject matter.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-6">
                      <h4 className="font-display text-lg font-bold tracking-[-0.03em] mb-3">
                        The information gap
                      </h4>
                      <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed">
                        Curiosity is created by the gap between what you know and what you want to know. Good explanation opens that gap deliberately, then closes it progressively - each step building on the last.
                      </p>
                    </div>

                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-6">
                      <h4 className="font-display text-lg font-bold tracking-[-0.03em] mb-3">
                        Working memory limits
                      </h4>
                      <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed">
                        The human mind can hold 3-5 new concepts at once. Explanation design works within that constraint - chunking information carefully, sequencing reveals, and never asking the reader to hold more than they can.
                      </p>
                    </div>
                  </div>

                  {/* Seven-stage explanation arc */}
                  <div className="bg-[var(--bg-tertiary)] rounded-xl p-6 mb-4 overflow-x-auto">
                    <div className="flex items-end gap-1 min-w-[500px]">
                      {[
                        { label: 'Hook', h: 40, desc: 'Open the gap' },
                        { label: 'Anchor', h: 50, desc: 'Familiar ground' },
                        { label: 'Foundation', h: 60, desc: 'Core concepts' },
                        { label: 'Build', h: 75, desc: 'Layer complexity' },
                        { label: 'Reward', h: 90, desc: 'The insight' },
                        { label: 'Extend', h: 80, desc: 'Broader context' },
                        { label: 'Launch', h: 70, desc: 'What next?' },
                      ].map((stage) => (
                        <div key={stage.label} className="flex-1 flex flex-col items-center">
                          <p className="font-nhg text-[10px] text-[var(--text-tertiary)] mb-1">{stage.desc}</p>
                          <div
                            className="w-full bg-[var(--text-primary)] rounded-t-sm"
                            style={{ height: `${stage.h}px` }}
                          />
                          <p className="font-label text-[10px] text-[var(--text-secondary)] mt-2">{stage.label.toUpperCase()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed">
                    We apply a seven-stage arc to every explanation project: Hook, Anchor, Foundation, Build, Reward, Extend, Launch. Each stage has a specific cognitive purpose. Nothing is decorative.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion Item 2 - The Audit */}
            <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('audit')}
                className="w-full flex items-center justify-between p-6 hover:bg-[var(--bg-tertiary)] transition-colors text-left"
              >
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold tracking-[-0.03em] mb-1">
                    The Audit
                  </h3>
                  <p className="font-nhg text-sm text-[var(--text-tertiary)]">
                    A structured assessment of how well an explanation is working
                  </p>
                </div>
                <svg
                  className={`w-6 h-6 transition-transform ${openAccordion === 'audit' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openAccordion === 'audit' && (
                <div className="p-6 pt-0">
                  <p className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                    The Audit is our diagnostic process for existing explanatory materials - websites, reports, publications, presentations. We assess them across six dimensions and produce a clear, actionable report.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-6">
                      <h4 className="font-display text-lg font-bold tracking-[-0.03em] mb-3">
                        What we assess
                      </h4>
                      <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed">
                        Vocabulary and assumed knowledge. Narrative structure and sequencing. Visual and verbal alignment. Cognitive load. Engagement and curiosity. Audience calibration.
                      </p>
                    </div>

                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-6">
                      <h4 className="font-display text-lg font-bold tracking-[-0.03em] mb-3">
                        What you get
                      </h4>
                      <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed">
                        A structured report identifying where the explanation is failing and why - with specific, prioritised recommendations. Delivered as a designed document, not a spreadsheet.
                      </p>
                    </div>
                  </div>

                  {/* Audit dimensions grid */}
                  <div className="bg-[var(--bg-tertiary)] rounded-xl p-6 mb-4">
                    <p className="font-label text-[10px] text-[var(--text-tertiary)] mb-4">SIX AUDIT DIMENSIONS</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { dim: 'Vocabulary', score: '—' },
                        { dim: 'Structure', score: '—' },
                        { dim: 'Visual alignment', score: '—' },
                        { dim: 'Cognitive load', score: '—' },
                        { dim: 'Engagement', score: '—' },
                        { dim: 'Audience calibration', score: '—' },
                      ].map((item) => (
                        <div key={item.dim} className="bg-[var(--bg-secondary)] rounded-lg p-4">
                          <p className="font-nhg text-sm font-medium text-[var(--text-primary)]">{item.dim}</p>
                          <p className="font-nhg text-xs text-[var(--text-tertiary)] mt-1">Assessed and scored</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Callout box */}
                  <div className="bg-[var(--bg-tertiary)] rounded-xl p-6">
                    <p className="font-nhg text-sm text-[var(--text-secondary)]">
                      The Audit is available as a standalone service.{' '}
                      <Link href="/contact" className="text-[var(--text-primary)] hover:underline">
                        Get in touch →
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item 3 - Data Visualisation */}
            <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('data')}
                className="w-full flex items-center justify-between p-6 hover:bg-[var(--bg-tertiary)] transition-colors text-left"
              >
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold tracking-[-0.03em] mb-1">
                    Data Visualisation
                  </h3>
                  <p className="font-nhg text-sm text-[var(--text-tertiary)]">
                    Turning data into insight through careful visual encoding
                  </p>
                </div>
                <svg
                  className={`w-6 h-6 transition-transform ${openAccordion === 'data' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openAccordion === 'data' && (
                <div className="p-6 pt-0">
                  <p className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                    Data visualisation is only useful when it communicates clearly. We design visualisations around the insight they need to convey - choosing visual encodings that match the data type, the audience, and the context. Interactive or static, web-based or print.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-6">
                      <h4 className="font-display text-lg font-bold tracking-[-0.03em] mb-3">
                        Visual hierarchy
                      </h4>
                      <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed">
                        We follow Cleveland&apos;s hierarchy of perceptual accuracy - position first, then length, then area, then colour. Critical comparisons are encoded in the most accurate channel available.
                      </p>
                    </div>

                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-6">
                      <h4 className="font-display text-lg font-bold tracking-[-0.03em] mb-3">
                        Interactive and static
                      </h4>
                      <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed">
                        Some data needs exploration - sliders, filters, linked views. Some needs a single clear chart. We match the level of interactivity to what the data and audience actually require.
                      </p>
                    </div>
                  </div>

                  {/* Visual encoding hierarchy */}
                  <div className="bg-[var(--bg-tertiary)] rounded-xl p-6 max-w-md mx-auto">
                    <p className="font-label text-[10px] text-[var(--text-tertiary)] mb-4">PERCEPTUAL ACCURACY (CLEVELAND, 1984)</p>
                    <div className="space-y-3">
                      {[
                        { rank: 1, channel: 'Position', accuracy: 'Most accurate', width: '100%' },
                        { rank: 2, channel: 'Length', accuracy: 'High', width: '85%' },
                        { rank: 3, channel: 'Angle / Slope', accuracy: 'Moderate', width: '68%' },
                        { rank: 4, channel: 'Area', accuracy: 'Moderate', width: '55%' },
                        { rank: 5, channel: 'Volume', accuracy: 'Low', width: '40%' },
                        { rank: 6, channel: 'Colour saturation', accuracy: 'Low', width: '30%' },
                        { rank: 7, channel: 'Colour hue', accuracy: 'Categorical only', width: '20%' },
                      ].map((item) => (
                        <div key={item.rank} className="flex items-center gap-3">
                          <span className="font-nhg text-xs text-[var(--text-tertiary)] w-4 flex-shrink-0">{item.rank}</span>
                          <div className="flex-1">
                            <div
                              className="h-6 bg-[var(--text-primary)] rounded-sm flex items-center px-2"
                              style={{ width: item.width }}
                            >
                              <span className="font-nhg text-[10px] text-[var(--bg-primary)] truncate">{item.channel}</span>
                            </div>
                          </div>
                          <span className="font-nhg text-[10px] text-[var(--text-tertiary)] w-24 text-right flex-shrink-0">{item.accuracy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item 4 - Illustration & Systems */}
            <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleAccordion('illustration')}
                className="w-full flex items-center justify-between p-6 hover:bg-[var(--bg-tertiary)] transition-colors text-left"
              >
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold tracking-[-0.03em] mb-1">
                    Illustration & Systems
                  </h3>
                  <p className="font-nhg text-sm text-[var(--text-tertiary)]">
                    Visual languages built for clarity and consistency
                  </p>
                </div>
                <svg
                  className={`w-6 h-6 transition-transform ${openAccordion === 'illustration' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openAccordion === 'illustration' && (
                <div className="p-6 pt-0">
                  <p className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                    Illustration for explanation is different from illustration for decoration. Every mark carries meaning. We design illustration systems - not one-off images - so that visual logic is consistent across a publication, product, or platform.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-6">
                      <h4 className="font-display text-lg font-bold tracking-[-0.03em] mb-3">
                        Scientific illustration
                      </h4>
                      <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed">
                        Accurate, precise, and designed to reveal structure. Organisms, systems, processes, mechanisms - drawn with the rigour of scientific communication and the clarity of good design.
                      </p>
                    </div>

                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-6">
                      <h4 className="font-display text-lg font-bold tracking-[-0.03em] mb-3">
                        Pictogram systems
                      </h4>
                      <p className="font-nhg text-sm text-[var(--text-secondary)] leading-relaxed">
                        Custom symbol sets for publishing, wayfinding, and interfaces. Designed as systems with consistent visual grammar - not assembled from stock icon libraries.
                      </p>
                    </div>
                  </div>

                  {/* Illustration principles */}
                  <div className="bg-[var(--bg-tertiary)] rounded-xl p-6">
                    <p className="font-label text-[10px] text-[var(--text-tertiary)] mb-4">ILLUSTRATION PRINCIPLES</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-full aspect-square bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center mb-2">
                          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[var(--text-tertiary)]">
                            <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5"/>
                            <line x1="24" y1="8" x2="24" y2="40" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2"/>
                            <line x1="8" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2"/>
                          </svg>
                        </div>
                        <p className="font-nhg text-xs text-[var(--text-secondary)]">Accuracy</p>
                      </div>
                      <div className="text-center">
                        <div className="w-full aspect-square bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center mb-2">
                          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[var(--text-tertiary)]">
                            <rect x="10" y="10" width="12" height="12" stroke="currentColor" strokeWidth="1.5"/>
                            <rect x="26" y="10" width="12" height="12" stroke="currentColor" strokeWidth="1.5"/>
                            <rect x="10" y="26" width="12" height="12" stroke="currentColor" strokeWidth="1.5"/>
                            <rect x="26" y="26" width="12" height="12" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </div>
                        <p className="font-nhg text-xs text-[var(--text-secondary)]">Consistency</p>
                      </div>
                      <div className="text-center">
                        <div className="w-full aspect-square bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center mb-2">
                          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[var(--text-tertiary)]">
                            <path d="M12 36 L24 12 L36 36" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                            <line x1="16" y1="28" x2="32" y2="28" stroke="currentColor" strokeWidth="0.75"/>
                          </svg>
                        </div>
                        <p className="font-nhg text-xs text-[var(--text-secondary)]">Clarity</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Section 4 - Closing CTA */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24">
        <div className="bg-[var(--bg-secondary)] rounded-xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em] mb-4">
            Every project is different.
          </h2>
          <p className="font-nhg text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
            We don&apos;t have a one-size-fits-all process. We have a set of principles we apply with judgement. If you have something complex that needs explaining,{' '}
            <Link href="/contact" className="text-[var(--text-primary)] hover:underline">
              let&apos;s talk →
            </Link>
          </p>
        </div>
      </section>

    </div>
  )
}
