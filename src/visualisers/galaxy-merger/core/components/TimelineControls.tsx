'use client';

import { useCallback, useRef, useEffect } from 'react';
import { GalaxyMetadata, GalaxyEvent } from '../lib/types';

interface TimelineControlsProps {
  metadata: GalaxyMetadata;
  currentTime: number;
  isPlaying: boolean;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onSpeedChange?: (speed: number) => void;
  speed?: number;
}

export default function TimelineControls({
  metadata,
  currentTime,
  isPlaying,
  onTimeChange,
  onPlayPause,
  onSpeedChange,
  speed = 1,
}: TimelineControlsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const timeToGyr = (t: number) => t * metadata.time_unit_myr / 1000;
  const progress = currentTime / metadata.t_max;

  // Get current event if any
  const currentEvent = metadata.events.find(e => {
    const dist = Math.abs(e.t - currentTime);
    return dist < 5;
  });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    const track = trackRef.current;
    if (!track) return;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const rect = track.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(1, x)) * metadata.t_max;
    onTimeChange(newTime);
  }, [metadata.t_max, onTimeChange]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(1, x)) * metadata.t_max;
    onTimeChange(newTime);
  }, [metadata.t_max, onTimeChange]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className='w-full bg-black/80 backdrop-blur-sm border-t border-white/10 p-4'>
      {/* Time display and controls */}
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-4'>
          <button
            onClick={onPlayPause}
            className='w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors'
          >
            {isPlaying ? (
              <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
                <rect x='3' y='2' width='4' height='12' />
                <rect x='9' y='2' width='4' height='12' />
              </svg>
            ) : (
              <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
                <path d='M4 2l10 6-10 6V2z' />
              </svg>
            )}
          </button>

          {onSpeedChange && (
            <select
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className='bg-white/10 text-white text-sm px-2 py-1 rounded border border-white/20'
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
          )}
        </div>

        <div className='text-right'>
          <div className='text-lg font-mono text-white'>
            T + {timeToGyr(currentTime).toFixed(2)} Gyr
          </div>
          <div className='text-xs text-white/50'>
            {(currentTime * metadata.time_unit_myr).toFixed(0)} Myr
          </div>
        </div>
      </div>

      {/* Timeline track */}
      <div
        ref={trackRef}
        className='relative h-12 bg-white/5 rounded cursor-pointer'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Progress fill */}
        <div
          className='absolute top-0 left-0 h-full bg-gradient-to-r from-[#0055FF]/30 to-[#0055FF]/10 rounded-l'
          style={{ width: `${progress * 100}%` }}
        />

        {/* Event markers */}
        {metadata.events.map((event, i) => {
          const eventProgress = event.t / metadata.t_max;
          const isActive = Math.abs(event.t - currentTime) < 5;

          return (
            <div
              key={i}
              className='absolute top-0 h-full flex flex-col items-center'
              style={{ left: `${eventProgress * 100}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className={`w-0.5 h-3 ${isActive ? 'bg-white' : 'bg-white/40'}`}
              />
              <div
                className={`text-xs whitespace-nowrap mt-1 px-1 transition-colors ${
                  isActive ? 'text-white' : 'text-white/40'
                }`}
              >
                {event.label}
              </div>
            </div>
          );
        })}

        {/* Playhead */}
        <div
          className='absolute top-0 h-full w-0.5 bg-white'
          style={{ left: `${progress * 100}%` }}
        >
          <div className='absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full' />
        </div>
      </div>

      {/* Current event description */}
      {currentEvent && (
        <div className='mt-3 text-center'>
          <div className='text-white font-bold'>{currentEvent.label}</div>
          <div className='text-sm text-white/70'>{currentEvent.description}</div>
        </div>
      )}
    </div>
  );
}
