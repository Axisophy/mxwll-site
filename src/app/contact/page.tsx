export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="container py-16">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-medium mb-6">Contact</h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed">
            Get in touch about projects, collaborations, or questions about explanation
            design.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="container py-8">
        <div className="max-w-2xl space-y-12">
          {/* Email */}
          <div>
            <h2 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-3">
              EMAIL
            </h2>
            <a
              href="mailto:hello@mxwll.io"
              className="text-2xl md:text-3xl font-medium text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition-colors"
            >
              hello@mxwll.io
            </a>
          </div>

          {/* Location */}
          <div>
            <h2 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-3">
              LOCATION
            </h2>
            <p className="text-xl text-[var(--text-primary)]">
              East Sussex, UK
            </p>
            <p className="text-base text-[var(--text-secondary)] mt-2">
              Available for remote and on-site projects
            </p>
          </div>

          {/* Social */}
          <div>
            <h2 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-3">
              SOCIAL
            </h2>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/mxwll"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition-colors w-fit"
              >
                GitHub
              </a>
              <a
                href="https://instagram.com/mxwll"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition-colors w-fit"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Response Time */}
          <div className="pt-8 border-t border-[var(--border)]">
            <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed">
              Typically respond within 24-48 hours. For urgent enquiries, please mention
              timelines in your message.
            </p>
          </div>
        </div>
      </section>

      {/* Back to work */}
      <section className="container py-16 mt-12">
        <div className="max-w-2xl">
          <a
            href="/work"
            className="inline-flex items-center gap-2 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← View work examples
          </a>
        </div>
      </section>
    </div>
  )
}
