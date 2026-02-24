import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { href: '/work', label: 'Work' },
    { href: '/lab', label: 'Lab' },
    { href: '/method', label: 'Method' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/quote', label: 'Get a quote' },
  ]

  return (
    <footer className="w-full bg-black mt-24">
      <div className="px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo - spans 2 columns on mobile and desktop */}
          <div className="col-span-2 flex flex-col">
            <Link href="/" aria-label="MXWLL Home">
              <Logo className="h-20 md:h-24 lg:h-32 w-auto text-white transition-opacity hover:opacity-70" />
            </Link>
          </div>

          {/* Desktop only: Gap (empty column 3) */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* Navigation Menu - column 1 on mobile, column 4 on desktop */}
          <nav className="col-span-1 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Instagram and Email - column 2 on mobile, column 5 on desktop */}
          <div className="col-span-1 flex flex-col gap-3">
            <a
              href="https://instagram.com/mxwll.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 hover:text-white transition-colors w-fit"
            >
              Instagram
            </a>
            <a
              href="mailto:hello@mxwll.io"
              className="text-sm text-white/70 hover:text-white transition-colors w-fit"
            >
              hello@mxwll.io
            </a>
          </div>

          {/* Copyright - bottom of footer, spans 2 columns on mobile */}
          <p className="col-span-2 md:col-span-1 text-xs text-white/50 mt-8 md:mt-0">
            © {currentYear} MXWLL
          </p>
        </div>
      </div>
    </footer>
  )
}
