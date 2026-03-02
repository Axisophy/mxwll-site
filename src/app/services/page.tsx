import Link from 'next/link'

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Section 1 - Opening */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            What we do
          </h1>
          <p className="font-sabon text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
            We work across a range of scales and formats - from single illustrations to full explanation systems. Every engagement starts with understanding what the work needs to do, and for whom.
          </p>
        </div>
      </section>

      {/* Section 2 - Service Cards */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* Card 1 - Explanation Design Systems */}
          <div className="border border-[var(--border)] p-6 md:p-8">
            <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              EXPLANATION DESIGN
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Explanation Design Systems
            </h2>
            <p className="font-sabon text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              Reusable visual frameworks for complex concepts. We design the underlying system - the visual grammar, the narrative structure, the component library - so that explanation is consistent across an entire publication, platform, or campaign.
            </p>
            <p className="font-sabon text-sm text-[var(--text-tertiary)] italic">
              Research institutions - Publishers - Corporate communications
            </p>
          </div>

          {/* Card 2 - Research & Impact */}
          <div className="border border-[var(--border)] p-6 md:p-8">
            <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              RESEARCH & IMPACT
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Research & Impact Visualisation
            </h2>
            <p className="font-sabon text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              Transforming research findings into public-facing explainers. Grant graphics, policy briefs, exhibition materials, and public engagement content - designed to make research genuinely accessible to non-specialist audiences.
            </p>
            <p className="font-sabon text-sm text-[var(--text-tertiary)] italic">
              Universities - Funders - Think tanks
            </p>
          </div>

          {/* Card 3 - Data Visualisation */}
          <div className="border border-[var(--border)] p-6 md:p-8">
            <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              DATA VISUALISATION
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Data Visualisation & Interactive Design
            </h2>
            <p className="font-sabon text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              Custom interactive and static visualisations for complex datasets. Built for the web or for print - designed to reveal insight rather than merely display data. From exploratory tools to single-purpose charts.
            </p>
            <p className="font-sabon text-sm text-[var(--text-tertiary)] italic">
              Publishers - Corporate - Agencies
            </p>
          </div>

          {/* Card 4 - Product Explainers */}
          <div className="border border-[var(--border)] p-6 md:p-8">
            <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              PRODUCT EXPLAINERS
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Product & Technology Explainers
            </h2>
            <p className="font-sabon text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              Illustrated explanations of complex products, platforms, and technologies for non-technical audiences. Investor decks, onboarding materials, product documentation - designed to close the comprehension gap.
            </p>
            <p className="font-sabon text-sm text-[var(--text-tertiary)] italic">
              Biotech - SaaS - Deep tech - Agencies
            </p>
          </div>

          {/* Card 5 - Illustration */}
          <div className="border border-[var(--border)] p-6 md:p-8">
            <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              ILLUSTRATION
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Scientific Illustration & Pictogram Systems
            </h2>
            <p className="font-sabon text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              Custom illustration for publishing, exhibition, and digital - accurate, systematic, and designed to communicate rather than decorate. Pictogram systems for publishing, wayfinding, and interface design.
            </p>
            <p className="font-sabon text-sm text-[var(--text-tertiary)] italic">
              Publishers - Museums - Agencies
            </p>
          </div>

          {/* Card 6 - The Audit */}
          <div className="border border-[var(--border)] p-6 md:p-8">
            <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              THE AUDIT
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
              The Audit
            </h2>
            <p className="font-sabon text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              A structured diagnostic of existing explanatory materials. We assess across six dimensions - vocabulary, structure, visual alignment, cognitive load, engagement, and audience calibration - and deliver a clear, prioritised report.
            </p>
            <p className="font-sabon text-sm text-[var(--text-tertiary)] italic">
              Any organisation with complex communications to improve
            </p>
          </div>

        </div>
      </section>

      {/* Placeholder - Work thumbnails */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] aspect-[3/1] flex items-center justify-center">
          <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] text-center px-4">
            PLACEHOLDER: 2-3 small work thumbnails as horizontal strip showing range across service types
          </p>
        </div>
      </section>

      {/* Section 3 - How we work together */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20 bg-[var(--bg-secondary)]">
        <div className="py-12 md:py-16 lg:py-20">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-12">
            How we work together
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

            {/* Step 1 */}
            <div className="border border-[var(--border)] bg-white p-6 md:p-8">
              <p className="font-display text-4xl font-bold text-[var(--text-tertiary)] mb-4">
                01
              </p>
              <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-3">
                Discovery
              </h3>
              <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed">
                We start with a conversation about what you need and why. For larger projects, this becomes a paid discovery phase - a structured investigation of the subject matter, the audience, and the brief.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-[var(--border)] bg-white p-6 md:p-8">
              <p className="font-display text-4xl font-bold text-[var(--text-tertiary)] mb-4">
                02
              </p>
              <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-3">
                Proposal
              </h3>
              <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed">
                We send a clear proposal with scope, deliverables, timeline, and price. No hourly rates, no ambiguity. You know exactly what you&apos;re getting.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-[var(--border)] bg-white p-6 md:p-8">
              <p className="font-display text-4xl font-bold text-[var(--text-tertiary)] mb-4">
                03
              </p>
              <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-3">
                Delivery
              </h3>
              <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed">
                We work iteratively with regular check-ins. Final deliverables are fully documented and handed over cleanly - source files, assets, and guidance for whoever uses the work next.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section 4 - CTA */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* Left - Quote tool */}
          <div className="border border-[var(--border)] bg-[var(--bg-tertiary)] p-8 md:p-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Know what you need?
            </h3>
            <p className="font-sabon text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              Get an instant estimate using our quote tool. Takes two minutes, no obligation.
            </p>
            <Link
              href="/quote"
              className="inline-block font-display text-sm font-medium px-6 py-3 border border-[var(--border)] bg-white hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Get a quote →
            </Link>
          </div>

          {/* Right - Contact */}
          <div className="border border-[var(--border)] bg-[var(--bg-tertiary)] p-8 md:p-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Not sure yet?
            </h3>
            <p className="font-sabon text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              We&apos;re happy to have an initial conversation about what you&apos;re trying to do before anything is committed.
            </p>
            <Link
              href="/contact"
              className="inline-block font-display text-sm font-medium px-6 py-3 border border-[var(--border)] bg-white hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Get in touch →
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}
