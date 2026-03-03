'use client'

import dynamic from 'next/dynamic'

const NetworkEffectsPage = dynamic(
  () => import('@/visualisers/network-effects/core/page'),
  { ssr: false }
)

export default function Page() {
  return <NetworkEffectsPage />
}
