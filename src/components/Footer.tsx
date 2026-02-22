import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { href: '/work', label: 'Work' },
    { href: '/method', label: 'Method' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  const socialLinks = [
    { href: 'https://github.com/mxwll', label: 'GitHub' },
    { href: 'https://instagram.com/mxwll', label: 'Instagram' },
  ]

  return (
    <footer className="w-full border-t border-[var(--border)] mt-24">
      <div className="container py-24">
        {/* Top Section: Statement + Nav Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-16">
          {/* Left: Statement */}
          <div>
            <h2 className="text-xl font-medium mb-4">MXWLL</h2>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-md">
              A digital laboratory for science, maths, and explanation design.
            </p>
          </div>

          {/* Right: Navigation */}
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[var(--border)] mb-8" />

        {/* Bottom Section: Copyright + Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-24">
          {/* Left: Copyright & Location */}
          <div className="flex flex-col gap-2 text-sm text-[var(--text-tertiary)]">
            <p>© {currentYear} MXWLL</p>
            <p>East Sussex, UK</p>
          </div>

          {/* Right: Email & Social */}
          <div className="flex flex-col gap-3">
            <a
              href="mailto:hello@mxwll.io"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors w-fit"
            >
              hello@mxwll.io
            </a>
            <div className="flex gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
