export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-medium mb-6">About</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-3xl">
          <div className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-12">

            {/* Studio */}
            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Studio
              </h2>
              <p>
                MXWLL is a science visualisation and explanation design studio. We work with research institutions, publishers, science museums, and organisations who need to make difficult ideas genuinely clear - not simplified, but made accessible without being made wrong.
              </p>
              <p className="mt-4">
                The work spans interactive data visualisation, scientific illustration, and structured explanation design. Sometimes these are combined in a single project. Often the most effective work integrates all three.
              </p>
            </div>

            {/* The studio */}
            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                The studio
              </h2>
              <p>
                Simon Tyler founded MXWLL after a decade working at the intersection of scientific illustration, data visualisation, systems design, and writing. The studio is based in East Sussex, UK.
              </p>
              <p className="mt-4">
                The background is unusual, and deliberately so. Most data visualisation studios are built from design or engineering. MXWLL is built from both, plus a genuine interest in science and a decade of practice in explaining complex things to general audiences through books.
              </p>
              <p className="mt-4">
                The books matter because explanation is a craft that requires iteration and feedback over time, not a style applied to a brief. Writing - and specifically writing about technical subjects for non-specialist readers - builds a different kind of understanding than design practice alone. It forces the question: what does this audience actually need to know? What can be left out? What is the essential structure of this idea? These are the same questions that drive good explanation design.
              </p>
              <p className="mt-4">
                The technical depth matters because subject understanding shapes what questions get asked. A designer who understands the physics can ask whether the chart is actually representing the phenomenon correctly. A designer who understands genetics can identify when a simplification has become a distortion. This changes the conversation with scientists and researchers considerably.
              </p>
            </div>

            {/* Selected credentials */}
            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Selected credentials
              </h2>
              <p>
                Scientific illustration and information design for national and international publishers, science museums, and research institutions.
              </p>
              <p className="mt-4">
                Author of five books on science, technology, and design subjects, including <em>Gizmo: A Visual History of Ingenious Machines</em> (Thames & Hudson), published in multiple languages.
              </p>
              <p className="mt-4">
                Systems design: Network Rail passenger information pictogram system; scientific poster and publication design systems; Maxwell design system for real-time scientific data visualisation.
              </p>
              <p className="mt-4">
                Interactive work includes WebGL-based visualisers for stellar cartography (50,000 stars from the Gaia catalogue), gravitational wave detection, atomic structure, orbital mechanics, reaction-diffusion morphogenesis, and flow field dynamics.
              </p>
            </div>

            {/* How we work */}
            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                How we work
              </h2>
              <p>
                Projects begin with a conversation about the explanation problem, not the visual output. We ask what the audience currently understands, what the most important thing is that they need to leave with, and what the misconceptions are that stand between their current understanding and the one you need them to have.
              </p>
              <p className="mt-4">
                From that conversation we develop an explanation strategy - a structured document that maps the information architecture before any design decisions are made. This is not a deliverable in the traditional agency sense. It is the thinking that makes the subsequent design work faster, sharper, and more likely to do what it needs to do.
              </p>
              <p className="mt-4">
                We are a small studio. We take on a limited number of projects each year, and we work directly with the people who commission us rather than through account management layers. If you are working with MXWLL, you are working with Simon.
              </p>
            </div>

            {/* What we don't do */}
            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                What we don&apos;t do
              </h2>
              <p>
                We don&apos;t do dashboards, business intelligence, or data analytics visualisation. Those are important disciplines; they are simply not ours.
              </p>
              <p className="mt-4">
                We don&apos;t produce quick-turnaround infographics. Our method requires time at the strategy stage, and skipping that stage produces work we would not stand behind.
              </p>
              <p className="mt-4">
                We don&apos;t simplify. We clarify. These are different things. Simplification removes complexity; clarification makes complexity navigable. The science stays accurate.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
