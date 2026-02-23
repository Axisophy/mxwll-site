export default function QuotePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container py-16">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-medium mb-6">Get a Quote</h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed">
            Answer a few questions about your project and we will send you an instant estimate. No obligation, no call required.
          </p>
        </div>
      </section>

      {/* Ballpark Widget Placeholder */}
      <section className="container py-8">
        <div className="max-w-3xl">
          <div className="border-2 border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-12 text-center">
            <p className="font-input text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
              Placeholder
            </p>
            <p className="text-base text-[var(--text-secondary)]">
              BALLPARK WIDGET PLACEHOLDER
            </p>
            <p className="text-sm text-[var(--text-tertiary)] mt-4">
              This is where the Ballpark pricing widget will be embedded.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
