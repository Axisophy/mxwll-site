'use client';

import { useState, useEffect } from 'react';
import GalaxyExplorer from './GalaxyExplorer';
import { GalaxyData } from '../lib/types';

export default function ClientExplorer() {
  const [data] = useState(() => new GalaxyData());
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        await data.load('/data/galaxy-merger', (progress) => {
          setLoadProgress(progress);
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load galaxy data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setIsLoading(false);
      }
    }

    loadData();
  }, [data]);

  if (isLoading) {
    return (
      <div className='h-screen flex flex-col items-center justify-center bg-black'>
        <div className='text-center'>
          {/* Animated galaxy loading indicator */}
          <div className='relative w-24 h-24 mx-auto mb-6'>
            <div className='absolute inset-0 rounded-full border-2 border-white/10' />
            <div
              className='absolute inset-0 rounded-full border-2 border-t-[#0055FF] animate-spin'
              style={{ animationDuration: '1.5s' }}
            />
            <div
              className='absolute inset-2 rounded-full border-2 border-t-white/50 animate-spin'
              style={{ animationDuration: '2s', animationDirection: 'reverse' }}
            />
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-3 h-3 bg-white rounded-full animate-pulse' />
            </div>
          </div>

          <div className='text-white/70 mb-2'>Loading galaxy simulation...</div>

          {/* Progress bar */}
          <div className='w-64 h-1 bg-white/10 rounded-full overflow-hidden'>
            <div
              className='h-full bg-[#0055FF] transition-all duration-300'
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>

          <div className='text-white/40 text-sm mt-2'>
            {(loadProgress * 100).toFixed(0)}% - {data.metadata?.n_particles.toLocaleString() || '50,000'} particles
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='h-screen flex items-center justify-center bg-black'>
        <div className='text-center text-white/70'>
          <div className='text-xl mb-2'>Error loading simulation</div>
          <div className='text-sm'>{error}</div>
        </div>
      </div>
    );
  }

  return <GalaxyExplorer data={data} />;
}
