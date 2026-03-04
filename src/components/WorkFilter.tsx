'use client'

import { clsx } from 'clsx'

interface WorkFilterProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function WorkFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: WorkFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={clsx(
            'font-display text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] transition-colors',
            activeCategory === category
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-tertiary)]'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
