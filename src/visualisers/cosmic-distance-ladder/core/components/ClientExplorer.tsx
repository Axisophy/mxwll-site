'use client';

import dynamic from 'next/dynamic';

const DistanceLadderExplorer = dynamic(
  () => import('./DistanceLadderExplorer'),
  { ssr: false }
);

export default function ClientExplorer() {
  return <DistanceLadderExplorer />;
}
