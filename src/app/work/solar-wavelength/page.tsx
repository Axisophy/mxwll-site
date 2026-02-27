'use client';

import dynamic from 'next/dynamic';

const SolarDemo = dynamic(() => import('@/visualisers/solar-wavelength/demo'), {
  ssr: false,
});

export default function SolarWavelengthPage() {
  return (
    <main className='min-h-screen'>
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4'>
          Solar Wavelength
        </h1>
        <p className='text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl'>
          One solar moment seen through multiple wavelengths - a compact demo loop for homepage use.
        </p>
      </section>

      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='w-full max-w-[600px] aspect-square bg-[#050508] border border-[var(--border-light)] flex items-center justify-center'>
          <SolarDemo className='w-full h-full' showLabel />
        </div>
      </section>
    </main>
  );
}
