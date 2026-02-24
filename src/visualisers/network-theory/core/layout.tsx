import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fragile by Design  - Bang Industries',
  description: 'How topology shapes resilience, epidemics, and information flow in networks. Interactive experiments exploring random vs scale-free network behaviour.',
  alternates: {
    canonical: 'https://bangindustries.co/work/network-theory',
  },
};

export default function NetworkTheoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
