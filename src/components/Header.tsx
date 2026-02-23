'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import MobileMenu from './MobileMenu'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

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
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-black/10">
        <div className="px-4 md:px-8 lg:px-12 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 lg:gap-20 items-start">
            {/* Logo */}
            <Link
              href="/"
              className="block transition-opacity hover:opacity-70"
              aria-label="MXWLL Home"
            >
              <Logo className="h-10 w-auto text-[var(--text-primary)]" />
            </Link>

            {/* Description (hidden on mobile/tablet) */}
            <div className="hidden lg:block text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
              MXWLL is an explanation design studio for science, data, and the complex. We build work that is rigorous, elegant, and alive - through visualisation, illustration, and systematic design.
              <br />
              We don't simplify. We clarify.
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 lg:justify-self-end">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-sm font-text transition-colors whitespace-nowrap
                    ${
                      link.isButton
                        ? 'px-4 py-2 border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]'
                        : pathname === link.href
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden absolute top-6 right-4 flex flex-col gap-[6px] w-6 h-6 justify-center items-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`
                  w-6 h-[2px] bg-[var(--text-primary)]
                  transition-all duration-300 ease-in-out
                  ${mobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}
                `}
              />
              <span
                className={`
                  w-6 h-[2px] bg-[var(--text-primary)]
                  transition-all duration-300 ease-in-out
                  ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}
                `}
              />
              <span
                className={`
                  w-6 h-[2px] bg-[var(--text-primary)]
                  transition-all duration-300 ease-in-out
                  ${mobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}
                `}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
