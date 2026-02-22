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
    <div className="mb-16">
      <div className="flex flex-wrap gap-4 md:gap-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={clsx(
              'text-3xl md:text-4xl lg:text-5xl font-medium transition-all duration-300',
              'hover:text-[var(--text-primary)]',
              activeCategory === category
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-tertiary)]'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
