export default function MethodPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container py-16">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-medium mb-6">Explanation Design</h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed">
            How we make complex things comprehensible through systematic design,
            interactive visualisation, and precise illustration.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-8">
        <div className="max-w-3xl font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-8">
          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              The Problem with Simplification
            </h2>
            <p>
              Most explanation fails because it tries to make things simple by removing
              detail. But understanding doesn&apos;t come from simplification - it comes from
              building the right mental models, in the right sequence, with the right
              level of detail.
            </p>
            <p className="mt-4">
              A good explanation doesn&apos;t hide complexity. It makes complexity navigable.
            </p>
          </div>

          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              Building Mental Models
            </h2>
            <p>
              Understanding happens when someone can manipulate a concept mentally -
              predict what will happen, see why something works, connect it to other
              ideas. This requires building functional mental models, not just
              presenting facts.
            </p>
            <p className="mt-4">
              We design experiences that let people construct these models themselves,
              through interaction, visualisation, and systematic presentation.
            </p>
          </div>

          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              Three Principles
            </h2>
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="font-nhg text-xl font-medium mb-2 text-[var(--text-primary)]">
                  1. Show the System
                </h3>
                <p>
                  Static diagrams can&apos;t show how things change, interact, or behave
                  under different conditions. Interactive visualisation lets people
                  explore the system itself, not just snapshots of it.
                </p>
              </div>

              <div>
                <h3 className="font-nhg text-xl font-medium mb-2 text-[var(--text-primary)]">
                  2. Respect the Mathematics
                </h3>
                <p>
                  Mathematical notation isn&apos;t an obstacle - it&apos;s a precise language.
                  Rather than hiding equations, we make them visually comprehensible
                  while maintaining their rigour.
                </p>
              </div>

              <div>
                <h3 className="font-nhg text-xl font-medium mb-2 text-[var(--text-primary)]">
                  3. Design Systematically
                </h3>
                <p>
                  Consistent visual language, clear hierarchy, systematic organisation.
                  The design itself should never be the barrier to understanding.
                  Every element serves the explanation.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              Capabilities
            </h2>
            <p>
              This approach requires genuine depth across scientific content, visual
              design, systematic thinking, and technical implementation. We bring:
            </p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Scientific and mathematical depth (physics, mathematics background)</li>
              <li>Systematic illustration and visual design</li>
              <li>Interactive visualisation development (WebGL, Canvas, Three.js)</li>
              <li>Editorial design and information architecture</li>
              <li>Published author in science communication</li>
            </ul>
          </div>

          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              Process
            </h2>
            <p>
              Every project starts with understanding - not the subject matter, but how
              someone moves from not knowing to genuinely understanding. What are the
              conceptual obstacles? What mental models do they need to build? In what
              sequence?
            </p>
            <p className="mt-4">
              From there, we design the clearest path through that conceptual landscape.
              Sometimes that means an interactive visualiser. Sometimes systematic
              illustration. Sometimes both. Always guided by what actually helps people
              understand.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 mt-12">
        <div className="max-w-3xl text-center">
          <p className="text-xl text-[var(--text-secondary)] mb-8">
            Working on something that needs explaining?
          </p>
          <a href="/contact" className="btn text-base px-8 py-3">
            Get in touch
          </a>
        </div>
      </section>
    </div>
  )
}
