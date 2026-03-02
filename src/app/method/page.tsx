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
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            How we work
          </h1>
          <p className="font-sabon text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
            Good work starts with understanding the problem clearly. We bring a systematic approach to every project - combining research, design thinking, and technical craft to produce work that is rigorous, elegant, and built to last.
          </p>
        </div>
      </section>

      {/* Section 2 - Three-column bento row */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {/* Cell A - Understand */}
          <div className="border border-[var(--border)] rounded-lg p-6 md:p-8 bg-white">
            <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              UNDERSTAND
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-4">
              We start by asking hard questions
            </h2>
            <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed">
              Before any design work begins, we dig into the subject matter. What does the audience already know? Where does comprehension break down? What is the single most important thing they need to understand?
            </p>
          </div>

          {/* Cell B - Structure */}
          <div className="border border-[var(--border)] rounded-lg p-6 md:p-8 bg-white">
            <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              STRUCTURE
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-4">
              We find the shape of the explanation
            </h2>
            <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed">
              Every complex idea has a natural structure - a sequence, a hierarchy, a set of relationships. We find that structure before we design anything. The visual form follows the explanatory logic, not the other way round.
            </p>
          </div>

          {/* Cell C - Build */}
          <div className="border border-[var(--border)] rounded-lg p-6 md:p-8 bg-white">
            <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              BUILD
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-4">
              We make it work at every level
            </h2>
            <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed">
              Whether the deliverable is an interactive visualisation, an illustration system, or a designed document - we build it with care. Technically sound, visually resolved, and tested against real audiences where possible.
            </p>
          </div>

        </div>

        {/* Placeholder - Process diagram */}
        <div className="mt-8 border-2 border-dashed border-[var(--border)] rounded-lg aspect-[3/1] flex items-center justify-center bg-[var(--bg-secondary)]">
          <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] text-center px-4">
            DIAGRAM: Three-stage process arc - Understand → Structure → Build - simple horizontal flow diagram, MXWLL colour palette, clean geometric style
          </p>
        </div>
      </section>

      {/* Section 3 - Accordion section */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Our approaches
          </h2>
          <p className="font-sabon text-sm text-[var(--text-tertiary)] mb-8">
            We work across several disciplines. Each has its own methodology.
          </p>

          <div className="space-y-4">

            {/* Accordion Item 1 - Explanation Design */}
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleAccordion('explanation')}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-[var(--bg-secondary)] transition-colors text-left"
              >
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-1">
                    Explanation Design
                  </h3>
                  <p className="font-sabon text-sm text-[var(--text-tertiary)]">
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
                <div className="p-6 pt-0 bg-white border-t border-[var(--border)]">
                  <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                    Explanation design is the practice of making difficult ideas accessible without dumbing them down. It draws on cognitive science, information design, and narrative structure - and it requires genuine understanding of the subject matter.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-secondary)]">
                      <h4 className="font-display text-lg font-bold tracking-tight mb-3">
                        The information gap
                      </h4>
                      <p className="font-sabon text-sm text-[var(--text-secondary)] leading-relaxed">
                        Curiosity is created by the gap between what you know and what you want to know. Good explanation opens that gap deliberately, then closes it progressively - each step building on the last.
                      </p>
                    </div>

                    <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-secondary)]">
                      <h4 className="font-display text-lg font-bold tracking-tight mb-3">
                        Working memory limits
                      </h4>
                      <p className="font-sabon text-sm text-[var(--text-secondary)] leading-relaxed">
                        The human mind can hold 3-5 new concepts at once. Explanation design works within that constraint - chunking information carefully, sequencing reveals, and never asking the reader to hold more than they can.
                      </p>
                    </div>
                  </div>

                  {/* Placeholder - Seven-stage arc */}
                  <div className="border-2 border-dashed border-[var(--border)] rounded-lg aspect-[2/1] flex items-center justify-center bg-[var(--bg-secondary)] mb-4">
                    <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] text-center px-4">
                      DIAGRAM: Seven-stage explanation arc - Hook / Anchor / Foundation / Build / Reward / Extend / Launch - horizontal timeline or rising arc shape
                    </p>
                  </div>

                  <p className="font-sabon text-sm text-[var(--text-secondary)] leading-relaxed">
                    We apply a seven-stage arc to every explanation project: Hook, Anchor, Foundation, Build, Reward, Extend, Launch. Each stage has a specific cognitive purpose. Nothing is decorative.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion Item 2 - The Audit */}
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleAccordion('audit')}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-[var(--bg-secondary)] transition-colors text-left"
              >
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-1">
                    The Audit
                  </h3>
                  <p className="font-sabon text-sm text-[var(--text-tertiary)]">
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
                <div className="p-6 pt-0 bg-white border-t border-[var(--border)]">
                  <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                    The Audit is our diagnostic process for existing explanatory materials - websites, reports, publications, presentations. We assess them across six dimensions and produce a clear, actionable report.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-secondary)]">
                      <h4 className="font-display text-lg font-bold tracking-tight mb-3">
                        What we assess
                      </h4>
                      <p className="font-sabon text-sm text-[var(--text-secondary)] leading-relaxed">
                        Vocabulary and assumed knowledge. Narrative structure and sequencing. Visual and verbal alignment. Cognitive load. Engagement and curiosity. Audience calibration.
                      </p>
                    </div>

                    <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-secondary)]">
                      <h4 className="font-display text-lg font-bold tracking-tight mb-3">
                        What you get
                      </h4>
                      <p className="font-sabon text-sm text-[var(--text-secondary)] leading-relaxed">
                        A structured report identifying where the explanation is failing and why - with specific, prioritised recommendations. Delivered as a designed document, not a spreadsheet.
                      </p>
                    </div>
                  </div>

                  {/* Placeholder - Audit report mockup */}
                  <div className="border-2 border-dashed border-[var(--border)] rounded-lg aspect-[4/3] flex items-center justify-center bg-[var(--bg-secondary)] mb-4">
                    <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] text-center px-4">
                      DIAGRAM / MOCKUP: Sample audit report page - six-dimension assessment as designed infographic, spider/radar chart or scored grid
                    </p>
                  </div>

                  {/* Callout box */}
                  <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-tertiary)]">
                    <p className="font-sabon text-sm text-[var(--text-secondary)]">
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
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleAccordion('data')}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-[var(--bg-secondary)] transition-colors text-left"
              >
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-1">
                    Data Visualisation
                  </h3>
                  <p className="font-sabon text-sm text-[var(--text-tertiary)]">
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
                <div className="p-6 pt-0 bg-white border-t border-[var(--border)]">
                  <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                    Data visualisation is only useful when it communicates clearly. We design visualisations around the insight they need to convey - choosing visual encodings that match the data type, the audience, and the context. Interactive or static, web-based or print.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-secondary)]">
                      <h4 className="font-display text-lg font-bold tracking-tight mb-3">
                        Visual hierarchy
                      </h4>
                      <p className="font-sabon text-sm text-[var(--text-secondary)] leading-relaxed">
                        We follow Cleveland&apos;s hierarchy of perceptual accuracy - position first, then length, then area, then colour. Critical comparisons are encoded in the most accurate channel available.
                      </p>
                    </div>

                    <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-secondary)]">
                      <h4 className="font-display text-lg font-bold tracking-tight mb-3">
                        Interactive and static
                      </h4>
                      <p className="font-sabon text-sm text-[var(--text-secondary)] leading-relaxed">
                        Some data needs exploration - sliders, filters, linked views. Some needs a single clear chart. We match the level of interactivity to what the data and audience actually require.
                      </p>
                    </div>
                  </div>

                  {/* Placeholder - Visual encoding hierarchy */}
                  <div className="border-2 border-dashed border-[var(--border)] rounded-lg aspect-[1/2] max-w-md mx-auto flex items-center justify-center bg-[var(--bg-secondary)]">
                    <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] text-center px-4">
                      DIAGRAM: Visual encoding hierarchy - ranked list showing position &gt; length &gt; area &gt; colour saturation, clean typographic treatment
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item 4 - Illustration & Systems */}
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleAccordion('illustration')}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-[var(--bg-secondary)] transition-colors text-left"
              >
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-1">
                    Illustration & Systems
                  </h3>
                  <p className="font-sabon text-sm text-[var(--text-tertiary)]">
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
                <div className="p-6 pt-0 bg-white border-t border-[var(--border)]">
                  <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                    Illustration for explanation is different from illustration for decoration. Every mark carries meaning. We design illustration systems - not one-off images - so that visual logic is consistent across a publication, product, or platform.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-secondary)]">
                      <h4 className="font-display text-lg font-bold tracking-tight mb-3">
                        Scientific illustration
                      </h4>
                      <p className="font-sabon text-sm text-[var(--text-secondary)] leading-relaxed">
                        Accurate, precise, and designed to reveal structure. Organisms, systems, processes, mechanisms - drawn with the rigour of scientific communication and the clarity of good design.
                      </p>
                    </div>

                    <div className="border border-[var(--border)] rounded-lg p-6 bg-[var(--bg-secondary)]">
                      <h4 className="font-display text-lg font-bold tracking-tight mb-3">
                        Pictogram systems
                      </h4>
                      <p className="font-sabon text-sm text-[var(--text-secondary)] leading-relaxed">
                        Custom symbol sets for publishing, wayfinding, and interfaces. Designed as systems with consistent visual grammar - not assembled from stock icon libraries.
                      </p>
                    </div>
                  </div>

                  {/* Placeholder - Sample illustration */}
                  <div className="border-2 border-dashed border-[var(--border)] rounded-lg aspect-[16/9] flex items-center justify-center bg-[var(--bg-secondary)]">
                    <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] text-center px-4">
                      IMAGE: Sample illustration or pictogram system from existing work - honeybee anatomy SVG or Axisophy poster detail
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Section 4 - Closing CTA */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24">
        <div className="border border-[var(--border)] rounded-lg p-8 md:p-12 bg-[var(--bg-tertiary)] text-center max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Every project is different.
          </h2>
          <p className="font-sabon text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
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
