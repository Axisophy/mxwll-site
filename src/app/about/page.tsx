import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About - MXWLL',
  description: 'MXWLL is an explanation design studio for science, data, and the complex. Founded by Simon Tyler - designer, illustrator, and author.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-6">
            About
          </h1>
          <p className="font-nhg text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
            MXWLL is an explanation design studio for science, data, and the complex. We make difficult ideas genuinely clear - through interactive visualisation, scientific illustration, and systematic design. We don&apos;t simplify. We clarify.
          </p>
        </div>
      </section>

      {/* Two-column bento */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* Simon Tyler */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
            <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">
              FOUNDER
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-[-0.03em] mb-4">
              Simon Tyler
            </h2>
            <div className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed space-y-4">
              <p>
                Designer, illustrator, and author. Biochemistry degree from Imperial College London, with further study in the History and Philosophy of Science at University College London.
              </p>
              <p>
                That combination of scientific training and design practice shapes everything MXWLL does. Understanding the subject matter - not just the brief - changes what questions get asked. A designer who understands the physics can tell when a simplification has become a distortion.
              </p>
              <p>
                Based in St Leonards on Sea, East Sussex.
              </p>
            </div>
          </div>

          {/* What we do */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
            <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">
              THE WORK
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-[-0.03em] mb-4">
              Visualisation, illustration, explanation
            </h2>
            <div className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed space-y-4">
              <p>
                We work with research institutions, publishers, science museums, and organisations who need to communicate complex ideas to non-specialist audiences.
              </p>
              <p>
                The work spans interactive data visualisation, scientific illustration, and structured explanation design. Sometimes these are combined in a single project. Often the most effective work integrates all three.
              </p>
              <p>
                We are a small studio. We take on a limited number of projects each year and work directly with the people who commission us. If you are working with MXWLL, you are working with Simon.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Credentials */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em] mb-8">
          Selected credentials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* Books */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
            <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">
              BOOKS
            </p>
            <div className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed space-y-3">
              <p>
                Author and illustrator of four books on science and technology, published by Laurence King, Faber &amp; Faber, and Pavilion:
              </p>
              <ul className="space-y-2">
                <li><em>Gizmo</em> - Laurence King</li>
                <li><em>Bugs</em> - Pavilion</li>
                <li><em>Adventures in Space</em> - Pavilion</li>
                <li><em>Emergency Vehicles</em> - Faber &amp; Faber</li>
              </ul>
            </div>
          </div>

          {/* Systems design */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
            <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">
              SYSTEMS DESIGN
            </p>
            <div className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed space-y-3">
              <p>
                Pictogram system for Network Rail&apos;s UK station wayfinding, in collaboration with Margaret Calvert.
              </p>
              <p>
                Scientific poster and publication design systems. The MXWLL design system for real-time scientific data visualisation.
              </p>
            </div>
          </div>

          {/* Interactive */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
            <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">
              INTERACTIVE
            </p>
            <div className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed">
              <p>
                WebGL-based visualisers for stellar cartography (50,000 stars from the ESA Gaia catalogue), gravitational wave detection, nuclear physics, orbital mechanics, reaction-diffusion morphogenesis, and flow field dynamics.
              </p>
            </div>
          </div>

          {/* Recognition */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 md:p-8">
            <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">
              EXHIBITED &amp; FEATURED
            </p>
            <div className="font-nhg text-base text-[var(--text-secondary)] leading-relaxed space-y-3">
              <p>
                Work exhibited at the Design Museum, Science Museum (London), and National Gallery of Singapore.
              </p>
              <p>
                Featured in The Guardian, The Times, Elle Decoration, It&apos;s Nice That, The Telegraph, and The Independent.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24">
        <div className="bg-[var(--bg-secondary)] rounded-xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em] mb-4">
            Have something complex that needs explaining?
          </h2>
          <p className="font-nhg text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            We&apos;d like to hear about it.
          </p>
          <Link
            href="/contact"
            className="inline-block font-display text-sm font-medium px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  )
}
