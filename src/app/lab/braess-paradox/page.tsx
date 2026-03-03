'use client'

import dynamic from 'next/dynamic'

const BraessParadoxPage = dynamic(
  () => import('@/visualisers/braess-paradox/core/page'),
  { ssr: false }
)

export default function Page() {
  return <BraessParadoxPage />
}
