import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Geometry of Getting There  - Bang Industries',
  description: 'Orbital mechanics and the path to the Moon. Interactive visualisations explaining transfer orbits, mission planning, and spacecraft trajectories.',
  alternates: {
    canonical: 'https://bangindustries.co/work/orbital-mechanics',
  },
};

export default function OrbitalMechanicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
