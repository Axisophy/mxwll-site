import Link from 'next/link'

export default function MethodPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-medium mb-6">How we think about explanation</h1>
          <p className="font-sabon text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed">
            Explanation design is a discipline, not a style. It draws on cognitive science, information architecture, and visual communication to make complex ideas genuinely comprehensible - not just presentable.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="px-4 md:px-8 lg:px-12 pb-12">
        <div className="max-w-3xl font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
          <p>
            We don&apos;t start with how something should look. We start with the information gap: what does the audience already know? What do they need to understand? What&apos;s the shortest, clearest path between those two states?
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-3xl space-y-12">
          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              The Information Gap
            </h2>
            <div className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
              <p>
                Curiosity is triggered by awareness of what you don&apos;t know. Effective explanation first establishes an intriguing gap, then progressively fills it while maintaining engagement. We design for the moment when understanding clicks - not just information delivery, but genuine comprehension.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              Working Memory Limits
            </h2>
            <div className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
              <p>
                People can hold three to four unfamiliar concepts simultaneously. Expert explanations fail because they assume &quot;chunks&quot; the audience doesn&apos;t possess. We audit for cognitive overload and restructure accordingly - breaking complex ideas into sequences that build on each other.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              Concrete Before Abstract
            </h2>
            <div className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
              <p>
                Abstraction is where understanding lives, but concrete examples are how you get there. We sequence every explanation from tangible to theoretical. The familiar before the unfamiliar. The specific before the general.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              The Expertise Reversal
            </h2>
            <div className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
              <p>
                Techniques that help novices can actually harm expert comprehension. There&apos;s no universal &quot;good explanation&quot; - only explanations calibrated to specific audiences. This is why we increasingly build adaptive systems that meet each user where they are.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              Evidence-Based Design
            </h2>
            <div className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
              <p>
                We make design decisions based on perceptual research: Cleveland&apos;s accuracy hierarchy for visual encoding, Bertin&apos;s visual variables, ColorBrewer&apos;s tested palettes, research on cognitive load and progressive disclosure. Craft informed by science, not just instinct.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-4 md:px-8 lg:px-12 py-12">
        <div className="max-w-3xl">
          <h2 className="font-nhg text-2xl font-medium mb-8 text-[var(--text-primary)]">
            Our Process
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">01. Discovery</h3>
              <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
                Understanding the subject, audience, and constraints. What are we explaining? To whom? What do they need to understand or do with this knowledge?
              </p>
            </div>
            <div>
              <h3 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">02. Information Architecture</h3>
              <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
                Mapping the concept space. Identifying dependencies, prerequisite knowledge, and the optimal sequence from concrete to abstract. Finding the right entry point for the audience.
              </p>
            </div>
            <div>
              <h3 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">03. Visual Strategy</h3>
              <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
                Choosing the right encoding for each type of information. Not decoration - communication. Every visual element earns its place.
              </p>
            </div>
            <div>
              <h3 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">04. Progressive Disclosure</h3>
              <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
                Layering complexity so the audience isn&apos;t overwhelmed. Overview first, then detail on demand. Building understanding incrementally rather than delivering everything at once.
              </p>
            </div>
            <div>
              <h3 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">05. Production</h3>
              <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
                Building the final outputs - whether static graphics, interactive visualisations, or complete adaptive systems. Calibrated to your channels and contexts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 md:px-8 lg:px-12 py-12">
        <div className="max-w-3xl">
          <h2 className="font-nhg text-2xl font-medium mb-8 text-[var(--text-primary)]">
            Services
          </h2>
          <div className="space-y-10">
            <div>
              <h3 className="font-nhg text-xl font-medium mb-2 text-[var(--text-primary)]">Visual Audit + Redesign Sprint</h3>
              <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
                A structured diagnostic of your existing explanation materials, followed by redesigned samples showing what&apos;s possible. We assess against five common failure patterns: the Expert&apos;s Explanation, the Data Dump, the Beautiful Confusion, the Boring Textbook, and the Wrong Audience. Three to five days.
              </p>
            </div>
            <div>
              <h3 className="font-nhg text-xl font-medium mb-2 text-[var(--text-primary)]">Explanation Design</h3>
              <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
                Taking a complex topic and making it genuinely clear - not just presentable. From audience analysis through concept mapping to final production. Two to four weeks.
              </p>
            </div>
            <div>
              <h3 className="font-nhg text-xl font-medium mb-2 text-[var(--text-primary)]">Interactive Explanations</h3>
              <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
                Static graphics explain. Interactive systems let people think. When the goal is genuine understanding, interaction transforms explanation from information delivery into an environment for exploration. Explorable explanations, data tools, calculators, simulations. Four to eight weeks.
              </p>
            </div>
            <div>
              <h3 className="font-nhg text-xl font-medium mb-2 text-[var(--text-primary)]">Adaptive Explanation Systems</h3>
              <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
                Not everyone needs the same explanation. A scientist and a policymaker looking at the same research need fundamentally different approaches. We design systems that adapt - from simple level selection to AI-powered generation tailored to each user&apos;s context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 lg:px-12 py-16 mt-12">
        <div className="max-w-3xl text-center">
          <p className="font-sabon text-xl text-[var(--text-secondary)] mb-8">
            Working on something that needs explaining?
          </p>
          <Link href="/contact" className="btn text-base px-8 py-3">
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  )
}
