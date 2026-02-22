'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import MobileMenu from './MobileMenu'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/work', label: 'Work' },
    { href: '/method', label: 'Method' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <header
        className={`
          sticky top-0 z-50 w-full
          border-b border-[var(--border)]
          bg-[var(--bg-primary)]
          transition-all duration-300 ease-in-out
          ${isScrolled ? 'py-4' : 'py-6'}
        `}
      >
        <div className="container">
          {/* Desktop & Mobile Top Row: Logo + Nav */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-medium tracking-tight transition-colors hover:text-[var(--text-secondary)]"
            >
              MXWLL
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-base font-normal transition-colors
                    ${
                      pathname === link.href
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
              {/* Theme toggle placeholder */}
              <div className="w-6 h-6 flex items-center justify-center text-[var(--text-secondary)]">
                {/* [◐] - Future theme toggle */}
              </div>
            </nav>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col gap-[6px] w-6 h-6 justify-center items-center"
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

          {/* Positioning Statement - Collapses on scroll */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isScrolled ? 'max-h-0 opacity-0 mt-0' : 'max-h-32 opacity-100 mt-8'}
            `}
          >
            <div className="max-w-3xl">
              <p className="text-xl md:text-2xl font-normal leading-relaxed text-[var(--text-primary)]">
                A digital laboratory for science, maths, and explanation design.
              </p>
              <p className="mt-3 text-base md:text-lg font-normal leading-relaxed text-[var(--text-secondary)]">
                We make complex things visible - through interactive visualisation,
                illustration, and systematic design.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
