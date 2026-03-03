'use client'

import dynamic from 'next/dynamic'

const CosmicDistanceLadderPage = dynamic(
  () => import('@/visualisers/cosmic-distance-ladder/core/page'),
  { ssr: false }
)

export default function Page() {
  return <CosmicDistanceLadderPage />
}
