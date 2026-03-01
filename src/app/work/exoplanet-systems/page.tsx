'use client';

import dynamic from 'next/dynamic';

const ExoplanetDemo = dynamic(() => import('@/visualisers/exoplanet-transit/demo'), {
  ssr: false,
});

export default function ExoplanetSystemsPage() {
  return (
    <main className='min-h-screen'>
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4'>
          Exoplanet Systems
        </h1>
        <p className='text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl'>
          A three-view exoplanet demo: discovery timeline, orbital-period scatter, and sky map.
        </p>
      </section>

      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='w-full bg-[#050508] border border-[var(--border-light)] p-3 md:p-4'>
          <ExoplanetDemo className='w-full' />
        </div>
      </section>
    </main>
  );
}
