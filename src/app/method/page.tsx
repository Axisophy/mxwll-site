export default function MethodPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-medium mb-6">Method</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-12">

          {/* Opening */}
          <div>
            <p>
              The problem with most science communication isn&apos;t the design. It&apos;s the thinking before the design.
            </p>
            <p className="mt-4">
              Most visualisations fail not because the charts are wrong, but because nobody asked the right questions first. What does this audience already know? What is the single most surprising thing in this data? What does someone need to understand before they can understand the main point? Where does their attention go when they first see the page?
            </p>
            <p className="mt-4">
              These are questions about cognition, not aesthetics. And answering them well requires understanding both the science and the science of understanding.
            </p>
          </div>

          {/* The curse of knowledge */}
          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              The curse of knowledge
            </h2>
            <p>
              In 1990, a Stanford psychology student ran a simple experiment. She tapped the rhythm of well-known songs with her finger and asked listeners to identify them. The tappers predicted others would recognise 50% of songs. The actual rate was 2.5%.
            </p>
            <p className="mt-4">
              The tappers could hear the music in their heads. Their listeners heard only irregular knocking.
            </p>
            <p className="mt-4">
              This is the curse of knowledge - the better you understand something, the harder it becomes to remember what it was like not to understand it. The intermediate steps disappear from conscious awareness. Experts skip them without realising, and audiences are left with the knocking.
            </p>
            <p className="mt-4">
              The problem compounds in science communication because the knowledge gap is often not just large but invisible. A researcher presenting climate data to policymakers, or a biotech explaining a mechanism of action to investors, is almost always operating on different ground than their audience - and usually underestimates how different.
            </p>
          </div>

          {/* The information gap */}
          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              The information gap
            </h2>
            <p>
              Curiosity isn&apos;t a passive state. It is the felt sense of a gap between what you know and what you want to know - and it motivates engagement only when closing the gap feels possible. Too small a gap and there is nothing to learn. Too large and the audience gives up.
            </p>
            <p className="mt-4">
              Effective explanation creates the right size of gap, then closes it. This means establishing what the audience already knows before introducing anything new, connecting new concepts to existing mental models rather than replacing them, and revealing complexity progressively rather than all at once.
            </p>
            <p className="mt-4">
              The seven-stage structure we use for explanation work follows this logic:
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <span className="font-nhg font-medium text-[var(--text-primary)]">Hook</span>
                <span className="text-[var(--text-secondary)]"> - a visual or question that creates curiosity before the audience knows why they should care. Five to ten seconds.</span>
              </div>
              <div>
                <span className="font-nhg font-medium text-[var(--text-primary)]">Anchor</span>
                <span className="text-[var(--text-secondary)]"> - connection to something the audience already knows. This is not simplification; it is orientation.</span>
              </div>
              <div>
                <span className="font-nhg font-medium text-[var(--text-primary)]">Foundation</span>
                <span className="text-[var(--text-secondary)]"> - the core concept, explained with one concrete example at a level appropriate for the specific audience. Not the full picture. The foothold.</span>
              </div>
              <div>
                <span className="font-nhg font-medium text-[var(--text-primary)]">Build</span>
                <span className="text-[var(--text-secondary)]"> - progressive complexity across three to five beats, each adding one layer. The audience can see where they are in the structure.</span>
              </div>
              <div>
                <span className="font-nhg font-medium text-[var(--text-primary)]">Reward</span>
                <span className="text-[var(--text-secondary)]"> - consolidation. The moment the pieces come together. <em>Now you see it.</em></span>
              </div>
              <div>
                <span className="font-nhg font-medium text-[var(--text-primary)]">Extend</span>
                <span className="text-[var(--text-secondary)]"> - clearly flagged deeper material for those who want it.</span>
              </div>
              <div>
                <span className="font-nhg font-medium text-[var(--text-primary)]">Launch</span>
                <span className="text-[var(--text-secondary)]"> - pathways to further exploration, follow-up action, or application.</span>
              </div>
            </div>
            <p className="mt-6">
              This is a framework, not a formula. Different subjects, different audiences, and different formats weight the stages differently. Some work needs only four; some needs all seven run twice.
            </p>
          </div>

          {/* How the mind receives information */}
          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              How the mind receives information
            </h2>
            <p>
              Working memory is the bottleneck of understanding. When material is genuinely unfamiliar, it holds roughly three to five items - sometimes as few as three. This is not a limitation to design around; it is a fact to design from.
            </p>
            <p className="mt-4">
              It means one new concept per unit of time. It means pre-attentive features (position, colour, size) should carry the most critical information because they are processed in under half a second before conscious attention engages. It means animation helps when it shows a process that unfolds over time, and hinders when it creates motion where stillness would serve comparison better. It means interactive elements should guide attention, not just offer a sandbox.
            </p>
            <p className="mt-4">
              It also means expertise reversal is real: the instructional approach that works for a novice actively interferes with an expert. There is no single optimal explanation. Different audiences require fundamentally different work.
            </p>
          </div>

          {/* What this changes */}
          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              What this changes
            </h2>
            <p>
              A consequence of taking cognitive science seriously is that the strategy of a piece - which concepts to surface first, what to leave out, how long each section earns - becomes as important as the execution. Beautiful, technically accomplished work can still fail its audience completely if the structure is wrong.
            </p>
            <p className="mt-4">
              This is why we start every project with an explanation audit. We map the knowledge state of the target audience, identify the key misconceptions that need to be cleared before the central ideas land, and determine what the audience needs to be able to do or think differently at the end. Only then do we decide what form the work takes.
            </p>
          </div>

          {/* On interactivity */}
          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              On interactivity
            </h2>
            <p>
              The best interactive work is not a graphic that the reader can prod, but a model of a system that the reader can explore - adjusting assumptions, watching consequences update, building intuition about how the parts relate. It requires deliberate guidance, not just freedom. It must be readable without interaction for those who want to read first. And it must make the underlying model visible, not hide it behind an interface.
            </p>
            <p className="mt-4">
              Not everything should be interactive. Many of the most powerful pieces of explanation design are still. Movement earns its place only when the phenomenon being explained genuinely unfolds over time.
            </p>
          </div>

          {/* On illustration */}
          <div>
            <h2 className="font-nhg text-2xl font-medium mb-4 text-[var(--text-primary)]">
              On illustration
            </h2>
            <p>
              Data visualisation and scientific illustration are often treated as separate disciplines. They are not. The same cognitive principles govern both. The same hierarchy of perceptual accuracy applies. The difference is that illustration allows precision where no data exists - representing a mechanism, a structure, a process that cannot be charted because it is not yet measured.
            </p>
            <p className="mt-4">
              For research on the frontier, illustration is often more honest than charts. And the combination of rigorous illustration with interactive data can say things that neither achieves alone.
            </p>
          </div>

          {/* Closing */}
          <div>
            <p>
              Every project we take on involves the full methodology - from explanation audit to final output. We don&apos;t offer parts of this. If you want only the visual execution, there are faster options. We work best with organisations who want the thinking as well as the making.
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
