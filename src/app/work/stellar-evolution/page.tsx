'use client'

import dynamic from 'next/dynamic'

const StellarEvolutionPage = dynamic(
  () => import('@/visualisers/stellar-evolution/core/page'),
  { ssr: false }
)

export default function Page() {
  return <StellarEvolutionPage />
}
