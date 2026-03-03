import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lab - MXWLL',
  description: 'Experiments, tools, and generative work. Interactive visualisations exploring science, mathematics, and data - built with real data and real science.',
}

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children
}
