import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-medium mb-6">Making complex ideas clear</h1>
          <p className="font-sabon text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed">
            MXWLL is a design practice specialising in explanation design for complex systems. We work with research institutions, publishers, museums, and organisations who need to communicate difficult ideas with clarity and precision.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-3xl">
          <div className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-12">

            <div>
              <p>
                Founded by Simon Tyler, the practice combines deep subject understanding with illustration, data visualisation, and interactive design. We don&apos;t just make things look good. We make them make sense.
              </p>
            </div>

            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                What We Bring
              </h2>
              <p className="mb-6">
                Most data visualisation studios have designers or developers. Rarely both. Almost never someone who can engage deeply with the content itself. We combine five capabilities that don&apos;t usually coexist:
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="font-nhg text-lg font-medium mb-2 text-[var(--text-primary)]">
                    Subject Understanding
                  </h3>
                  <p>
                    Scientific and technical literacy that lets us engage with complex content directly - not just make it look presentable.
                  </p>
                </div>
                <div>
                  <h3 className="font-nhg text-lg font-medium mb-2 text-[var(--text-primary)]">
                    Illustration
                  </h3>
                  <p>
                    Actual drawing skills. Bespoke visual systems, not just charts and templates.
                  </p>
                </div>
                <div>
                  <h3 className="font-nhg text-lg font-medium mb-2 text-[var(--text-primary)]">
                    Systems Architecture
                  </h3>
                  <p>
                    Pictogram sets, visual languages, design frameworks. Work that scales and maintains consistency.
                  </p>
                </div>
                <div>
                  <h3 className="font-nhg text-lg font-medium mb-2 text-[var(--text-primary)]">
                    Technical Build
                  </h3>
                  <p>
                    React, D3, Python, WebGL. We prototype, build, and deploy - not just design and hand off.
                  </p>
                </div>
                <div>
                  <h3 className="font-nhg text-lg font-medium mb-2 text-[var(--text-primary)]">
                    Author Credibility
                  </h3>
                  <p>
                    Published books demonstrate proven ability to explain complex ideas to general audiences. Not just a claim - evidence.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Background
              </h2>
              <p>
                Before founding MXWLL, Simon led projects including the Network Rail wayfinding pictogram system at Spaceagency, developing systematic visual languages for complex operational environments.
              </p>
              <p className="mt-4">
                His work spans scientific illustration, data visualisation, and explanation design. He has written and illustrated several books, including Gizmo (Laurence King), a visual history of gadgets and technology, Bugs (HarperCollins), and Emergency Vehicles (Faber &amp; Faber).
              </p>
              <p className="mt-4">
                He also creates scientific visualisation products through Axisophy, and explores computational art and generative systems at Elxsis.
              </p>
            </div>

            <div>
              <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
                Books
              </h2>
              <ul className="space-y-3">
                <li>
                  <span className="font-nhg font-medium text-[var(--text-primary)]">Gizmo</span>
                  <span className="text-[var(--text-tertiary)]"> - Laurence King Publishing. A visual history of the gadgets and technology that shaped the modern world.</span>
                </li>
                <li>
                  <span className="font-nhg font-medium text-[var(--text-primary)]">Bugs</span>
                  <span className="text-[var(--text-tertiary)]"> - HarperCollins. Illustrated insect portraits combining scientific accuracy with graphic impact.</span>
                </li>
                <li>
                  <span className="font-nhg font-medium text-[var(--text-primary)]">Emergency Vehicles</span>
                  <span className="text-[var(--text-tertiary)]"> - Faber &amp; Faber. An illustrated children&apos;s book.</span>
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
      <section className="px-4 md:px-8 lg:px-12 py-16 mt-12">
        <div className="max-w-3xl text-center">
          <Link href="/contact" className="btn text-base px-8 py-3">
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  )
}
