import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What are Fractals?  - Bang Industries',
  description: 'An accessible introduction to fractal geometry. From simple self-similarity to the infinite complexity of the Mandelbrot set, with interactive visualisations.',
  alternates: {
    canonical: 'https://bangindustries.co/work/fractals',
  },
};

export default function FractalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
