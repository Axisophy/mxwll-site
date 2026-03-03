'use client'

import dynamic from 'next/dynamic'

const AsteroidBeltPage = dynamic(
  () => import('@/visualisers/asteroid-belt/core/page'),
  { ssr: false }
)

export default function Page() {
  return <AsteroidBeltPage />
}
