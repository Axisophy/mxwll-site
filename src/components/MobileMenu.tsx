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
    { href: '/method', label: 'Method' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <div
      className={`
        fixed inset-0 z-40 bg-[var(--bg-primary)]
        transition-all duration-300 ease-in-out
        md:hidden
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      style={{
        top: '0',
        paddingTop: 'calc(var(--space-16) + 40px)', // Account for header height
      }}
    >
      <nav className="container flex flex-col items-center justify-center gap-8 h-full pb-32">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              text-[32px] font-medium transition-colors
              ${
                pathname === link.href
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
