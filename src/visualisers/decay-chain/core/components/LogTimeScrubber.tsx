'use client';

import { useRef, useCallback, useEffect } from 'react';
import { formatTime, LOG_TIME_MARKERS, ChainIsotope } from '../lib/types';

interface LogTimeScrubberProps {
  logTime: number;  // Current log10(time in seconds)
  onLogTimeChange: (logTime: number) => void;
  chainData: ChainIsotope[];
  minLog?: number;
  maxLog?: number;
}

export default function LogTimeScrubber({
  logTime,
  onLogTimeChange,
  chainData,
  minLog = -5,
  maxLog = 18,
}: LogTimeScrubberProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const logRange = maxLog - minLog;

  // Convert log time to percentage
  const logToPercent = (log: number) => ((log - minLog) / logRange) * 100;

  // Convert percentage to log time
  const percentToLog = (percent: number) => minLog + (percent / 100) * logRange;

  // Handle mouse/touch events
  const handleStart = useCallback((clientX: number) => {
    isDragging.current = true;
    updateFromPosition(clientX);
  }, []);

  const updateFromPosition = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newLogTime = percentToLog(percent);
    onLogTimeChange(newLogTime);
  }, [onLogTimeChange, percentToLog]);

  const handleMove = useCallback((clientX: number) => {
    if (isDragging.current) {
      updateFromPosition(clientX);
    }
  }, [updateFromPosition]);

  const handleEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const handleMouseMove = useCallback((e: MouseEvent) => handleMove(e.clientX), [handleMove]);
  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX);
    }
  };
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);
  const handleTouchEnd = useCallback(() => handleEnd(), [handleEnd]);

  // Global event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Get half-life markers from chain data
  const halfLifeMarkers = chainData
    .filter(d => d.log10_half_life !== null && d.log10_half_life >= minLog && d.log10_half_life <= maxLog)
    .map(d => ({
      log: d.log10_half_life!,
      label: d.isotope,
      readable: d.half_life_readable,
    }));

  const currentTimeSeconds = Math.pow(10, logTime);

  return (
    <div ref={containerRef} className='w-full py-4'>
      {/* Time display */}
      <div className='text-center mb-4'>
        <div className='text-2xl font-bold font-mono text-white'>
          {formatTime(currentTimeSeconds)}
        </div>
        <div className='text-xs text-white/50 mt-1'>
          10<sup>{logTime.toFixed(1)}</sup> seconds
        </div>
      </div>

      {/* Track */}
      <div className='relative px-4'>
        <div
          ref={trackRef}
          className='relative h-12 cursor-pointer'
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Background track */}
          <div className='absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 bg-white/10 rounded-full' />

          {/* Progress fill */}
          <div
            className='absolute top-1/2 left-0 h-2 -translate-y-1/2 bg-gradient-to-r from-[#FF0055] via-[#FFCC00] to-[#0055FF] rounded-full'
            style={{ width: `${logToPercent(logTime)}%` }}
          />

          {/* Half-life markers */}
          {halfLifeMarkers.map((marker, i) => (
            <div
              key={i}
              className='absolute top-0 transform -translate-x-1/2'
              style={{ left: `${logToPercent(marker.log)}%` }}
            >
              <div className='w-px h-3 bg-white/30' />
              <div
                className='text-[8px] text-white/40 mt-1 whitespace-nowrap'
                style={{
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'top left',
                }}
              >
                {marker.label}
              </div>
            </div>
          ))}

          {/* Log scale markers */}
          {LOG_TIME_MARKERS.map((marker, i) => (
            <div
              key={`log-${i}`}
              className='absolute bottom-0 transform -translate-x-1/2'
              style={{ left: `${logToPercent(marker.log)}%` }}
            >
              <div className='w-px h-2 bg-white/40' />
              <div className='text-[9px] text-white/50 mt-0.5 whitespace-nowrap'>
                {marker.label}
              </div>
            </div>
          ))}

          {/* Handle */}
          <div
            className='absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2'
            style={{ left: `${logToPercent(logTime)}%` }}
          >
            <div className='w-6 h-6 bg-white rounded-full shadow-lg border-2 border-[#FFCC00] cursor-grab active:cursor-grabbing'>
              <div className='w-full h-full rounded-full bg-[#FFCC00] scale-50' />
            </div>
          </div>
        </div>
      </div>

      {/* Axis labels */}
      <div className='flex justify-between px-4 mt-2'>
        <span className='text-xs text-white/40'>10⁻⁵ s</span>
        <span className='text-xs text-white/40 font-bold'>Time since start (log scale)</span>
        <span className='text-xs text-white/40'>10¹⁸ s</span>
      </div>

      {/* Special time notes */}
      <div className='text-center mt-4'>
        {logTime < -3 && (
          <span className='text-xs text-[#FF0055]'>
            Faster than Po-214 decay (164 μs)
          </span>
        )}
        {logTime >= -3 && logTime < 5 && (
          <span className='text-xs text-[#FFCC00]'>
            Human timescales — seconds to days
          </span>
        )}
        {logTime >= 5 && logTime < 10 && (
          <span className='text-xs text-white/60'>
            Historical timescales — years to millennia
          </span>
        )}
        {logTime >= 10 && logTime < 15 && (
          <span className='text-xs text-[#00AAFF]'>
            Geological timescales — thousands to millions of years
          </span>
        )}
        {logTime >= 15 && (
          <span className='text-xs text-[#0055FF]'>
            Cosmological timescales — approaching the age of Earth
          </span>
        )}
      </div>
    </div>
  );
}
