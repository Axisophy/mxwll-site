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
        <div className="flex flex-col gap-12">
          {/* Large MXWLL Logo */}
          <div className="w-full">
            <Link href="/" aria-label="MXWLL Home">
              <Logo className="h-20 md:h-24 lg:h-32 w-auto text-white transition-opacity hover:opacity-70" />
            </Link>
          </div>

          {/* Navigation and Social */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8">
            {/* Left: Navigation Links */}
            <nav className="flex flex-col gap-3">
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

            {/* Right: Instagram */}
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com/mxwll.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white transition-colors w-fit"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Copyright - Bottom Right */}
          <div className="flex justify-end">
            <p className="text-xs text-white/50">
              © {currentYear} MXWLL
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
