'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import GalaxyRenderer from './GalaxyRenderer';
import TimelineControls from './TimelineControls';
import { GalaxyData } from '../lib/types';

interface GalaxyExplorerProps {
  data: GalaxyData;
}

export default function GalaxyExplorer({ data }: GalaxyExplorerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const animationRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !data.metadata) return;

    const animate = (timestamp: number) => {
      if (lastFrameRef.current === 0) {
        lastFrameRef.current = timestamp;
      }

      const delta = (timestamp - lastFrameRef.current) / 1000;
      lastFrameRef.current = timestamp;

      setCurrentTime(prev => {
        // ~30 seconds to play full simulation at 1x
        const playbackRate = data.metadata!.t_max / 30;
        const newTime = prev + delta * playbackRate * speed;

        if (newTime >= data.metadata!.t_max) {
          setIsPlaying(false);
          return data.metadata!.t_max;
        }

        return newTime;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      lastFrameRef.current = 0;
    };
  }, [isPlaying, speed, data.metadata]);

  const handlePlayPause = useCallback(() => {
    if (!data.metadata) return;

    if (currentTime >= data.metadata.t_max) {
      setCurrentTime(0);
    }
    setIsPlaying(prev => !prev);
  }, [currentTime, data.metadata]);

  const handleTimeChange = useCallback((time: number) => {
    setCurrentTime(time);
    setIsPlaying(false);
  }, []);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  if (!data.metadata) {
    return (
      <div className='h-screen flex items-center justify-center bg-black'>
        <div className='text-white/50'>No data loaded</div>
      </div>
    );
  }

  const currentEvent = data.metadata.events.find(e => Math.abs(e.t - currentTime) < 5);

  return (
    <div className='relative h-screen bg-black flex flex-col'>
      {/* Main visualization */}
      <div className='flex-1 relative'>
        <GalaxyRenderer
          data={data}
          currentTime={currentTime}
          isPlaying={isPlaying}
          onTimeChange={handleTimeChange}
        />

        {/* Info overlay */}
        {showInfo && (
          <div className='absolute top-4 left-4 max-w-sm'>
            <div className='bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/10'>
              <h3 className='text-white font-bold text-lg mb-2'>
                {data.narrative?.title || 'Galaxy Merger'}
              </h3>
              <p className='text-white/70 text-sm'>
                {data.narrative?.subtitle}
              </p>
              <div className='mt-3 text-xs text-white/50'>
                <div>{data.metadata.n_particles.toLocaleString()} particles</div>
                <div>{data.metadata.n_mw.toLocaleString()} Milky Way</div>
                <div>{data.metadata.n_m31.toLocaleString()} Andromeda</div>
              </div>
            </div>

            {currentEvent && (
              <div className='mt-3 bg-[#0055FF]/20 border border-[#0055FF]/40 rounded-lg p-3'>
                <div className='text-white font-bold'>{currentEvent.label}</div>
                <div className='text-white/80 text-sm mt-1'>{currentEvent.description}</div>
              </div>
            )}
          </div>
        )}

        {/* Controls hint */}
        <div className='absolute bottom-4 right-4 text-white/40 text-xs'>
          Drag to rotate | Scroll to zoom
        </div>

        {/* Toggle info button */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors'
        >
          <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
            <circle cx='8' cy='8' r='6' stroke='currentColor' fill='none' strokeWidth='1.5' />
            <path d='M8 7v4M8 5v1' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
          </svg>
        </button>
      </div>

      {/* Timeline controls */}
      <TimelineControls
        metadata={data.metadata}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onTimeChange={handleTimeChange}
        onPlayPause={handlePlayPause}
        onSpeedChange={handleSpeedChange}
        speed={speed}
      />
    </div>
  );
}
