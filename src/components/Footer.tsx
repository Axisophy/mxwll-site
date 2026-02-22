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
    <footer className="w-full border-t border-black/10 mt-24">
      <div className="px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-12">
          {/* Left: Brand */}
          <div>
            <h2 className="font-display text-xl mb-4">MXWLL</h2>
          </div>

          {/* Right: Navigation */}
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-black/10 mb-8" />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          {/* Left: Copyright */}
          <div className="text-xs text-[var(--text-tertiary)]">
            <p>© {currentYear} MXWLL</p>
            <p className="mt-1">East Sussex, UK</p>
          </div>

          {/* Right: Contact & Social */}
          <div>
            <a
              href="mailto:hello@mxwll.io"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors block mb-2"
            >
              hello@mxwll.io
            </a>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
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
