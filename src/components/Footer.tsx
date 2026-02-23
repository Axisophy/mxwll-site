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
    { href: '/quote', label: 'Get a Quote', isButton: true },
  ]

  return (
    <footer className="w-full bg-black mt-24">
      <div className="px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-start">
          {/* Left: Logo (50% width) */}
          <div className="w-full">
            <Link href="/" aria-label="MXWLL Home">
              <Logo className="h-10 w-auto text-white" />
            </Link>
          </div>

          {/* Right: Navigation */}
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  text-sm transition-colors w-fit
                  ${
                    link.isButton
                      ? 'px-4 py-2 border border-white text-white hover:bg-white hover:text-black'
                      : 'text-white/70 hover:text-white'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="mailto:hello@mxwll.io"
              className="text-sm text-white/70 hover:text-white transition-colors mt-2"
            >
              hello@mxwll.io
            </a>
            <p className="text-xs text-white/50 mt-2">
              © {currentYear} MXWLL
            </p>
          </nav>
        </div>
      </div>
    </footer>
  )
}
