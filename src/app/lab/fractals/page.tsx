'use client'

import dynamic from 'next/dynamic'

const FractalsPage = dynamic(
  () => import('@/visualisers/fractals/core/page'),
  { ssr: false }
)

export default function Page() {
  return <FractalsPage />
}
