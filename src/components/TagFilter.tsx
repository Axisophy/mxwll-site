'use client'

interface TagFilterProps {
  /** All tags with their counts, derived from project data */
  tags: { tag: string; count: number }[]
  /** Currently selected tags */
  selectedTags: string[]
  /** Callback when tags change */
  onTagsChange: (tags: string[]) => void
}

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  '0': '\u2070',
  '1': '\u00B9',
  '2': '\u00B2',
  '3': '\u00B3',
  '4': '\u2074',
  '5': '\u2075',
  '6': '\u2076',
  '7': '\u2077',
  '8': '\u2078',
  '9': '\u2079',
}

function toSuperscript(n: number): string {
  return String(n)
    .split('')
    .map(d => SUPERSCRIPT_DIGITS[d] || d)
    .join('')
}

export default function TagFilter({
  tags,
  selectedTags,
  onTagsChange,
}: TagFilterProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const totalCount = tags.reduce((sum, t) => sum + t.count, 0)
  const noneSelected = selectedTags.length === 0

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      <button
        onClick={() => onTagsChange([])}
        className={`
          font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.03em]
          transition-colors duration-150
          ${noneSelected
            ? 'text-[#0055FF]'
            : 'text-[var(--text-primary)] hover:text-[#0055FF]'
          }
        `}
      >
        All{toSuperscript(totalCount)}
      </button>
      {tags.map(({ tag, count }) => {
        const isActive = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`
              font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-[-0.03em]
              transition-colors duration-150
              ${isActive
                ? 'text-[#0055FF]'
                : 'text-[var(--text-primary)] hover:text-[#0055FF]'
              }
            `}
          >
            {tag}{toSuperscript(count)}
          </button>
        )
      })}
    </div>
  )
}
