'use client'

import dynamic from 'next/dynamic'

// Dynamically import to avoid SSR issues
const PermissibleUniverse = dynamic(
  () => import('@/visualisers/permissible-universe/core/PermissibleUniverse'),
  { ssr: false }
)

export default function PermissibleUniversePage() {
  return (
    <div className="min-h-screen">
      <PermissibleUniverse />
    </div>
  )
}
