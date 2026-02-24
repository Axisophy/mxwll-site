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
        <div className="grid grid-cols-5 gap-8">
          {/* Column 1-2: Large MXWLL Logo (spans 2 columns) */}
          <div className="col-span-2 flex flex-col justify-between">
            <Link href="/" aria-label="MXWLL Home">
              <Logo className="h-20 md:h-24 lg:h-32 w-auto text-white transition-opacity hover:opacity-70" />
            </Link>

            {/* Copyright at bottom of column 1 */}
            <p className="text-xs text-white/50 mt-auto pt-12">
              © {currentYear} MXWLL
            </p>
          </div>

          {/* Column 3: Gap (empty) */}
          <div className="col-span-1"></div>

          {/* Column 4: Navigation Menu */}
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

          {/* Column 5: Instagram and Email */}
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
        </div>
      </div>
    </footer>
  )
}
