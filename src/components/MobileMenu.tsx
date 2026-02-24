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
    { href: '/quote', label: 'Get a Quote', isButton: true },
  ]

  return (
    <div
      id="mobile-menu"
      className={`
        fixed inset-0 z-50 bg-white
        transition-opacity duration-300
        md:hidden
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      style={{ top: 'var(--header-height)' }}
    >
      <nav className="flex flex-col items-center justify-center h-full gap-8 px-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              font-display text-3xl transition-colors
              ${
                link.isButton
                  ? 'px-6 py-3 border-2 border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]'
                  : pathname === link.href
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
