/**
 * Types for the ExplanationModal component
 */

export type ExplanationLevel = 'child' | 'student' | 'undergraduate' | 'expert'

export interface ExplanationTier {
  level: ExplanationLevel
  label: string
  description: string
  content: string | React.ReactNode
}

export interface ExplanationModalProps {
  title: string
  subtitle?: string
  tiers: ExplanationTier[]
  defaultTier?: ExplanationLevel
  onClose: () => void
  isOpen: boolean
}
