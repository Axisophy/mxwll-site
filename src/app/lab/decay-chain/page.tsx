'use client'

import dynamic from 'next/dynamic'

const DecayChainPage = dynamic(
  () => import('@/visualisers/decay-chain/core/page'),
  { ssr: false }
)

export default function Page() {
  return <DecayChainPage />
}
