'use client'

import { useState } from 'react'

interface MetadataDropdownProps {
  title?: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function MetadataDropdown({ title, children, defaultOpen = false }: MetadataDropdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center ${title ? 'justify-between w-full' : ''} text-left`}
      >
        {title && <span className="text-sm">{title}</span>}
        <svg
          className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed space-y-2">
          {children}
        </div>
      )}
    </div>
  )
}
