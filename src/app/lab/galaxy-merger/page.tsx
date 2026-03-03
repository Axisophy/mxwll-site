'use client'

import dynamic from 'next/dynamic'

const GalaxyMergerPage = dynamic(
  () => import('@/visualisers/galaxy-merger/core/page'),
  { ssr: false }
)

export default function Page() {
  return <GalaxyMergerPage />
}
