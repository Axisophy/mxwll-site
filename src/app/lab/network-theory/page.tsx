'use client'

import dynamic from 'next/dynamic'

const NetworkTheoryPage = dynamic(
  () => import('@/visualisers/network-theory/core/page'),
  { ssr: false }
)

export default function Page() {
  return <NetworkTheoryPage />
}
