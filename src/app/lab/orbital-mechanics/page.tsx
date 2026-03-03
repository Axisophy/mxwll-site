'use client'

import dynamic from 'next/dynamic'

const OrbitalMechanicsPage = dynamic(
  () => import('@/visualisers/orbital-mechanics/core/page'),
  { ssr: false }
)

export default function Page() {
  return <OrbitalMechanicsPage />
}
