export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-medium mb-6">Services</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-3xl">
          <div className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-12">

            {/* Opening */}
            <div>
              <p>
                Our work falls into three areas, which are often combined in a single project. Pricing is by project rather than day rate. We don&apos;t publish prices because scope varies substantially - a short editorial piece and a multi-month research communication programme have very different requirements.
              </p>
            </div>

            {/* Science visualisation and interactive explanation */}
            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Science visualisation and interactive explanation
              </h2>
              <p>
                We build interactive data visualisations, real-time scientific simulations, and exploratory tools that let audiences engage with complex phenomena directly.
              </p>
              <p className="mt-4">
                This includes everything from standalone interactive pieces - gravitational wave detectors, stellar catalogues, orbital mechanics simulations - to integrated data experiences that pull live data from scientific sources and render it in real time.
              </p>
              <p className="mt-4">
                The work is technically built in-house, not contracted out. The advantage of this is that the design and the engineering are developed together rather than handed off - which matters enormously for interactive explanation, where the constraints of what is possible technically should inform the explanation strategy from the start, not arrive as a surprise at the end.
              </p>
              <p className="mt-4 italic">
                Appropriate for: research institutions needing public-facing interactive content, science museums developing permanent or temporary exhibitions, publishers building digital counterparts to print work, organisations communicating complex scientific or technical findings to non-specialist audiences.
              </p>
            </div>

            {/* Scientific illustration and explanation design */}
            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Scientific illustration and explanation design
              </h2>
              <p>
                Structured explanation built around our methodology - taking a complex mechanism, process, or system and making it genuinely comprehensible to a defined audience.
              </p>
              <p className="mt-4">
                This includes scientific illustration, information graphics, explanation sequences, and the full seven-stage explanation arc applied to a subject. It can be print, digital, or both.
              </p>
              <p className="mt-4">
                The illustration capability here is meaningful: we can work in areas where the data does not yet exist, or where the phenomenon cannot be charted because it is structural or mechanistic. Illustration and data visualisation are treated as continuous disciplines, not separate ones, because cognitively they are.
              </p>
              <p className="mt-4">
                We also offer <strong>explanation audits</strong>: a structured assessment of existing communication material - a paper, a website, a presentation, an exhibition - against the explanation methodology. This identifies the specific places where the explanation is failing and why, and recommends targeted improvements. Audits are often the fastest route to significantly improved communication for organisations with existing assets.
              </p>
              <p className="mt-4 italic">
                Appropriate for: research institutions preparing public engagement content, REF impact case studies, or grant communication; publishers developing explanation sequences for scientific or technical books; organisations whose existing communication consistently fails to land with non-specialist audiences.
              </p>
            </div>

            {/* Design systems and pictogram design */}
            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Design systems and pictogram design
              </h2>
              <p>
                Systems that allow organisations to produce consistent, explanation-quality visual communication at scale.
              </p>
              <p className="mt-4">
                This includes data design systems (governing how charts, maps, and data representations are formatted and styled), pictogram and symbol sets (custom icon systems for publications, wayfinding, and information design), and explanation templates applicable consistently across a body of work.
              </p>
              <p className="mt-4">
                The value of a design system for explanation work specifically is that the cognitive load considerations - hierarchy, colour use, typographic scale, information density - are resolved once and then applied consistently, rather than renegotiated on every piece.
              </p>
              <p className="mt-4 italic">
                Appropriate for: publishers producing multi-volume or multi-format scientific reference works; research institutions producing regular public communication; organisations needing to produce large volumes of data-driven communication with consistent quality.
              </p>
            </div>

            {/* Starting a conversation */}
            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Starting a conversation
              </h2>
              <p>
                If you have a project in mind - or a communication problem you are not sure how to approach - the best starting point is a brief description of the audience, the material, and what you need the audience to be able to do or understand afterwards. From there we can usually tell quickly whether we are the right fit, and if so, what the shape of the engagement might be.
              </p>
              <p className="mt-4">
                <a href="mailto:hello@mxwll.io" className="text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition-colors">
                  hello@mxwll.io
                </a>
              </p>
              <p className="mt-4 italic">
                We work with a small number of clients at a time. If you are considering a project for later in the year, it is worth making contact early.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
