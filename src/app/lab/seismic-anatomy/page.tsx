'use client'

import dynamic from 'next/dynamic'

const SeismicAnatomyPage = dynamic(
  () => import('@/visualisers/seismic-anatomy/core/page'),
  { ssr: false }
)

export default function Page() {
  return <SeismicAnatomyPage />
}
