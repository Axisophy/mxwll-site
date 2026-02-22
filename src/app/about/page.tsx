export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container py-16">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-medium mb-6">About</h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed">
            MXWLL is Simon Tyler - a designer, illustrator, and developer focused on
            making complex scientific and mathematical concepts comprehensible.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-8">
        <div className="max-w-3xl">
          <div className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-8">
            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Background
              </h2>
              <p>
                With a background in physics and mathematics, combined with systematic
                design training and coding capabilities, the work here sits at the
                intersection of scientific depth, visual clarity, and technical
                implementation.
              </p>
              <p className="mt-4">
                This combination makes it possible to both understand complex scientific
                concepts deeply and translate them into visual forms that genuinely help
                people learn.
              </p>
            </div>

            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Five-Capability Stack
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-nhg text-lg font-medium mb-2 text-[var(--text-primary)]">
                    Scientific Depth
                  </h3>
                  <p>
                    Physics and mathematics background. Can read papers, understand
                    equations, and identify what actually matters for explanation.
                  </p>
                </div>

                <div>
                  <h3 className="font-nhg text-lg font-medium mb-2 text-[var(--text-primary)]">
                    Systematic Illustration
                  </h3>
                  <p>
                    Precise technical illustration with clear visual hierarchy. Every
                    line, colour, and label serves the explanation.
                  </p>
                </div>

                <div>
                  <h3 className="font-nhg text-lg font-medium mb-2 text-[var(--text-primary)]">
                    Systems Thinking
                  </h3>
                  <p>
                    Information architecture, systematic design, and editorial structure.
                    Building coherent systems, not just isolated pieces.
                  </p>
                </div>

                <div>
                  <h3 className="font-nhg text-lg font-medium mb-2 text-[var(--text-primary)]">
                    Interactive Development
                  </h3>
                  <p>
                    TypeScript, WebGL, Canvas, Three.js. Building custom visualisers and
                    interactive experiences from the ground up.
                  </p>
                </div>

                <div>
                  <h3 className="font-nhg text-lg font-medium mb-2 text-[var(--text-primary)]">
                    Published Author
                  </h3>
                  <p>
                    Contributing author to multiple science and mathematics books.
                    Experience in science communication and explanation at scale.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Selected Book Credits
              </h2>
              <ul className="space-y-2">
                <li className="font-input text-[var(--text-sm)] text-[var(--text-tertiary)]">
                  [BOOK TITLE] - PUBLISHER, YEAR
                </li>
                <li className="font-input text-[var(--text-sm)] text-[var(--text-tertiary)]">
                  [BOOK TITLE] - PUBLISHER, YEAR
                </li>
                <li className="font-input text-[var(--text-sm)] text-[var(--text-tertiary)]">
                  [BOOK TITLE] - PUBLISHER, YEAR
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Selected Clients
              </h2>
              <ul className="space-y-2">
                <li className="font-input text-[var(--text-sm)] text-[var(--text-tertiary)]">
                  [CLIENT NAME]
                </li>
                <li className="font-input text-[var(--text-sm)] text-[var(--text-tertiary)]">
                  [CLIENT NAME]
                </li>
                <li className="font-input text-[var(--text-sm)] text-[var(--text-tertiary)]">
                  [CLIENT NAME]
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Location
              </h2>
              <p>Based in East Sussex, UK. Available for remote and on-site projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 mt-12">
        <div className="max-w-3xl text-center">
          <a href="/contact" className="btn text-base px-8 py-3">
            Get in touch
          </a>
        </div>
      </section>
    </div>
  )
}
