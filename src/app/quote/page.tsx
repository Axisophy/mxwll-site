import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get a Quote - MXWLL',
  description: 'Get an instant project estimate for explanation design, data visualisation, scientific illustration, or design systems. No obligation, no call required.',
}

export default function QuotePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-6">Get a Quote</h1>
          <p className="font-nhg text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed">
            Answer a few questions about your project and we will send you an instant estimate. No obligation, no call required.
          </p>
        </div>
      </section>

      {/* Ballpark Widget Placeholder */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-3xl">
          <div className="bg-[var(--bg-secondary)] rounded-xl p-12 text-center">
            <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">
              COMING SOON
            </p>
            <p className="font-nhg text-base text-[var(--text-secondary)]">
              The quote tool is being built. In the meantime, please get in touch directly.
            </p>
            <p className="font-nhg text-sm text-[var(--text-tertiary)] mt-4">
              <a href="mailto:hello@mxwll.io" className="text-[var(--text-primary)] hover:underline">hello@mxwll.io</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
