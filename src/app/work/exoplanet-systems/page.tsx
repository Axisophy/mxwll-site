'use client'

import dynamic from 'next/dynamic'

const ExoplanetTransitPage = dynamic(
  () => import('@/visualisers/exoplanet-transit/core/page'),
  { ssr: false }
)

export default function Page() {
  return <ExoplanetTransitPage />
}
