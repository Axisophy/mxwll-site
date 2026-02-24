'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on route change
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

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
    <div
      id="mobile-menu"
      className={`
        fixed inset-0 z-50 bg-black
        transition-opacity duration-300
        md:hidden
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      style={{ top: 'var(--header-height)' }}
    >
      <nav className="flex flex-col items-start justify-center h-full gap-4 px-4">
        {/* Studio Description */}
        <p className="text-sm text-white/70 leading-relaxed max-w-md mb-4">
          MXWLL is an explanation design studio for science, data, and the complex. We build work that is rigorous, elegant, and alive - through visualisation, illustration, and systematic design.
          <br />
          <br />
          We don't simplify. We clarify.
        </p>

        {/* Navigation Links */}
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              font-display text-4xl text-white
              ${
                pathname === link.href
                  ? 'underline'
                  : 'hover:underline'
              }
            `}
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
