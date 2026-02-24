'use client'

import React, { useEffect, useCallback } from 'react'
import { ExplanationModalProps, ExplanationLevel, ExplanationTier } from './types'

const LEVEL_ORDER: ExplanationLevel[] = ['child', 'student', 'undergraduate', 'expert']

/**
 * ExplanationModal - Four-tier explanation system
 *
 * Presents content at four expertise levels to accommodate different audiences.
 * Based on cognitive science principle of expertise reversal - different audiences
 * need different explanations.
 */
export function ExplanationModal({
  title,
  subtitle,
  tiers,
  defaultTier = 'student',
  onClose,
  isOpen,
}: ExplanationModalProps) {
  const [selectedLevel, setSelectedLevel] = React.useState<ExplanationLevel>(defaultTier)

  // Create tier lookup map
  const tierMap = React.useMemo(() => {
    const map = new Map<ExplanationLevel, ExplanationTier>()
    tiers.forEach(tier => map.set(tier.level, tier))
    return map
  }, [tiers])

  const currentTier = tierMap.get(selectedLevel)

  // ESC to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explanation-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white border border-black/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-start justify-between">
          <div>
            <h2
              id="explanation-modal-title"
              className="text-2xl font-display font-bold tracking-tight text-black"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-black/60 text-sm mt-1 font-nhg">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 text-black/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
          {/* Tier Selector */}
          <div className="mb-4">
            <h3 className="text-xs font-input font-medium text-black/50 uppercase tracking-wider mb-3">
              Explanation Level
            </h3>
            <div
              className="flex gap-1 bg-black/5 rounded-xl p-1"
              role="tablist"
              aria-label="Explanation levels"
            >
              {LEVEL_ORDER.map((level) => {
                const tier = tierMap.get(level)
                const hasContent = !!tier
                return (
                  <button
                    key={level}
                    onClick={() => hasContent && setSelectedLevel(level)}
                    disabled={!hasContent}
                    role="tab"
                    aria-selected={selectedLevel === level}
                    aria-controls="explanation-content"
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-nhg font-medium transition-colors
                      ${selectedLevel === level
                        ? 'bg-black text-white'
                        : hasContent
                          ? 'text-black/60 hover:bg-black/10'
                          : 'text-black/20 cursor-not-allowed'
                      }`}
                  >
                    <div>{tier?.label || level}</div>
                  </button>
                )
              })}
            </div>
            {currentTier && (
              <p className="text-xs text-black/40 font-nhg mt-2 text-center">
                {currentTier.description}
              </p>
            )}
          </div>

          {/* Explanation Content */}
          {currentTier && (
            <div
              id="explanation-content"
              role="tabpanel"
              className="bg-black/5 rounded-xl p-5"
            >
              <div className="text-black/80 leading-relaxed font-sabon prose prose-sm max-w-none">
                {typeof currentTier.content === 'string' ? (
                  <p className="whitespace-pre-line">{currentTier.content}</p>
                ) : (
                  currentTier.content
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
