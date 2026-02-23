export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-medium mb-6">Get in touch</h1>
          <p className="font-sabon text-xl md:text-2xl text-[var(--text-secondary)] leading-relaxed">
            Whether you have a specific project in mind or just want to explore what&apos;s possible, start with a conversation.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-2xl space-y-12">
          {/* Email */}
          <div>
            <h2 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">
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
            <h2 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">
              LOCATION
            </h2>
            <p className="text-xl text-[var(--text-primary)]">
              East Sussex, UK
            </p>
            <p className="font-sabon text-base text-[var(--text-secondary)] mt-2">
              Available for remote and on-site projects
            </p>
          </div>

          {/* What to Include */}
          <div>
            <h2 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">
              WHAT TO INCLUDE
            </h2>
            <div className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed space-y-2">
              <p>A brief description of what you&apos;re trying to explain or communicate.</p>
              <p>Who the audience is (or who you think it might be).</p>
              <p>Any constraints - timeline, format, budget range.</p>
              <p>Don&apos;t worry if you&apos;re not sure yet. That&apos;s what the conversation is for.</p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h2 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">
              ELSEWHERE
            </h2>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/simontyler"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition-colors w-fit"
              >
                GitHub
              </a>
              <a
                href="https://instagram.com/mxwll.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition-colors w-fit"
              >
                Instagram
              </a>
              <a
                href="https://axisophy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[var(--text-primary)] hover:text-[var(--accent-hover)] transition-colors w-fit"
              >
                Axisophy
              </a>
            </div>
          </div>

          {/* Response Time */}
          <div className="pt-8 border-t border-[var(--border)]">
            <p className="font-sabon text-base text-[var(--text-secondary)] leading-relaxed">
              Typically respond within 24-48 hours. For urgent enquiries, please mention timelines in your message.
            </p>
          </div>
        </div>
      </section>

      {/* Back to work */}
      <section className="px-4 md:px-8 lg:px-12 py-16 mt-12">
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
