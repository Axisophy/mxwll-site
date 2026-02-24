import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'From Gates to Gradients  - Bang Industries',
  description: 'How logic circuits become learning machines. An interactive explainer bridging boolean logic and neural networks.',
  alternates: {
    canonical: 'https://bangindustries.co/work/logic-systems',
  },
};

export default function LogicSystemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
