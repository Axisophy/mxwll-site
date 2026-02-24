'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AIA_CHANNELS, DEFAULT_DATE, IMAGE_SIZE } from '../lib/channels';
import { AIAChannel, ImageCache } from '../lib/types';

interface SolarWavelengthExplorerProps {
  className?: string;
}

export default function SolarWavelengthExplorer({ className = '' }: SolarWavelengthExplorerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageCacheRef = useRef<ImageCache>({});
  const animationRef = useRef<number>(0);
  const sweepRef = useRef<number>(0);

  // State
  const [sliderValue, setSliderValue] = useState(0); // 0 to 1000 for smooth control
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isSweeping, setIsSweeping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate which channels to show based on slider position
  const getChannelBlend = useCallback((value: number): { primary: AIAChannel; secondary: AIAChannel | null; blend: number } => {
    const numChannels = AIA_CHANNELS.length;
    const position = (value / 1000) * (numChannels - 1);
    const primaryIndex = Math.floor(position);
    const blend = position - primaryIndex;

    const primary = AIA_CHANNELS[Math.min(primaryIndex, numChannels - 1)];
    const secondary = primaryIndex < numChannels - 1 ? AIA_CHANNELS[primaryIndex + 1] : null;

    return { primary, secondary, blend };
  }, []);

  const { primary: currentChannel, secondary: nextChannel, blend } = getChannelBlend(sliderValue);

  // Preload all images
  useEffect(() => {
    let mounted = true;

    const loadImage = async (channel: AIAChannel): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          if (mounted) {
            imageCacheRef.current[channel.wavelength] = img;
            setLoadedCount(prev => prev + 1);
          }
          resolve();
        };

        img.onerror = () => {
          console.warn(`Failed to load image for ${channel.wavelength}Å`);
          reject(new Error(`Failed to load ${channel.wavelength}Å`));
        };

        // Use our API proxy
        const url = `/api/solar?wavelength=${channel.wavelength}&date=${encodeURIComponent(DEFAULT_DATE)}&size=${IMAGE_SIZE}`;
        img.src = url;
      });
    };

    const loadAllImages = async () => {
      try {
        // Load images in parallel with some error tolerance
        const results = await Promise.allSettled(
          AIA_CHANNELS.map(channel => loadImage(channel))
        );

        const failures = results.filter(r => r.status === 'rejected').length;
        if (failures === AIA_CHANNELS.length) {
          setError('Unable to load solar images. Please check your connection and try again.');
        } else if (failures > 0) {
          console.warn(`${failures} images failed to load, continuing with available data`);
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load solar images');
          setIsLoading(false);
        }
      }
    };

    loadAllImages();

    return () => {
      mounted = false;
    };
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isLoading) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const size = Math.min(rect.width, rect.height);

      // Set canvas size
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      ctx.scale(dpr, dpr);

      // Clear with black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);

      // Get images
      const primaryImg = imageCacheRef.current[currentChannel.wavelength];
      const secondaryImg = nextChannel ? imageCacheRef.current[nextChannel.wavelength] : null;

      if (primaryImg) {
        // Draw primary image
        ctx.globalAlpha = 1;
        ctx.drawImage(primaryImg, 0, 0, size, size);

        // Crossfade to secondary if blending
        if (secondaryImg && blend > 0) {
          ctx.globalAlpha = blend;
          ctx.drawImage(secondaryImg, 0, 0, size, size);
        }

        ctx.globalAlpha = 1;
      }
    };

    render();

    // Re-render on resize
    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isLoading, currentChannel, nextChannel, blend]);

  // Auto-sweep animation
  useEffect(() => {
    if (!isSweeping) {
      if (sweepRef.current) {
        cancelAnimationFrame(sweepRef.current);
        sweepRef.current = 0;
      }
      return;
    }

    let lastTime = performance.now();
    const duration = 20000; // 20 seconds for full sweep

    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      setSliderValue(prev => {
        const increment = (delta / duration) * 1000;
        let next = prev + increment;
        if (next >= 1000) {
          next = 0; // Loop back
        }
        return next;
      });

      sweepRef.current = requestAnimationFrame(animate);
    };

    sweepRef.current = requestAnimationFrame(animate);

    return () => {
      if (sweepRef.current) {
        cancelAnimationFrame(sweepRef.current);
      }
    };
  }, [isSweeping]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setSliderValue(prev => Math.max(0, prev - 50));
          setIsSweeping(false);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSliderValue(prev => Math.min(1000, prev + 50));
          setIsSweeping(false);
          break;
        case ' ':
          e.preventDefault();
          setIsSweeping(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Temperature bar position (normalized 0-1 based on temperatureK)
  const minTemp = Math.min(...AIA_CHANNELS.map(c => c.temperatureK));
  const maxTemp = Math.max(...AIA_CHANNELS.map(c => c.temperatureK));
  const tempPosition = (Math.log10(currentChannel.temperatureK) - Math.log10(minTemp)) /
                       (Math.log10(maxTemp) - Math.log10(minTemp));

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-black text-white ${className}`}>
        <div className='text-center p-8'>
          <p className='text-white/70 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 text-sm border border-white/20 hover:bg-white/10 transition-colors'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col lg:flex-row bg-black text-white ${className}`}>
      {/* Canvas area */}
      <div
        ref={containerRef}
        className='relative flex-1 flex items-center justify-center min-h-[400px] lg:min-h-0'
      >
        {isLoading ? (
          <div className='flex flex-col items-center gap-4'>
            <div className='w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin' />
            <p className='text-sm text-white/60'>
              Loading solar images... {loadedCount}/{AIA_CHANNELS.length}
            </p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className='max-w-full max-h-full'
          />
        )}

        {/* Wavelength indicator overlay */}
        {!isLoading && (
          <div className='absolute top-4 left-4 text-xs font-mono'>
            <span
              className='px-2 py-1'
              style={{ backgroundColor: currentChannel.colour + '40' }}
            >
              {currentChannel.wavelength} Å
            </span>
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className='w-full lg:w-80 xl:w-96 p-4 lg:p-6 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-white/10'>
        {/* Temperature bar */}
        <div>
          <div className='flex justify-between text-xs font-mono text-white/40 mb-2'>
            <span>5,700°C</span>
            <span>10,000,000°C</span>
          </div>
          <div className='relative h-2 bg-gradient-to-r from-[#F5E6C8] via-[#FF6030] via-[#FFD700] via-[#8040C0] to-[#30C0C0] rounded-full'>
            <div
              className='absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 transition-all duration-150'
              style={{
                left: `calc(${tempPosition * 100}% - 6px)`,
                borderColor: currentChannel.colour,
              }}
            />
          </div>
        </div>

        {/* Channel info */}
        <div className='space-y-4'>
          <div>
            <span
              className='inline-block px-3 py-1 text-sm font-mono'
              style={{ backgroundColor: currentChannel.colour, color: '#000' }}
            >
              {currentChannel.name}
            </span>
          </div>

          <div className='space-y-3'>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-1'>
                Temperature
              </span>
              <span className='text-lg font-bold'>{currentChannel.temperature}</span>
            </div>

            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-1'>
                Region
              </span>
              <span className='text-sm text-white/80'>{currentChannel.region}</span>
            </div>

            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-1'>
                What You See
              </span>
              <p className='text-sm text-white/70 leading-relaxed'>{currentChannel.description}</p>
            </div>

            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-1'>
                Reveals
              </span>
              <p className='text-sm text-white/60'>{currentChannel.reveals}</p>
            </div>

            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-1'>
                Ion
              </span>
              <p className='text-sm text-white/60 font-mono'>{currentChannel.ion}</p>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className='mt-auto space-y-4'>
          <div>
            <input
              type='range'
              min='0'
              max='1000'
              value={sliderValue}
              onChange={(e) => {
                setSliderValue(parseInt(e.target.value));
                setIsSweeping(false);
              }}
              className='w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:cursor-grab
                [&::-webkit-slider-thumb]:active:cursor-grabbing
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-white
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-grab
                [&::-moz-range-thumb]:active:cursor-grabbing'
              aria-label='Wavelength slider'
            />
          </div>

          {/* Channel dots */}
          <div className='flex justify-between px-1'>
            {AIA_CHANNELS.map((channel, i) => {
              const dotPosition = i / (AIA_CHANNELS.length - 1);
              const sliderPosition = sliderValue / 1000;
              const isActive = Math.abs(dotPosition - sliderPosition) < 0.05;

              return (
                <button
                  key={channel.wavelength}
                  onClick={() => {
                    setSliderValue(i * (1000 / (AIA_CHANNELS.length - 1)));
                    setIsSweeping(false);
                  }}
                  className='group relative flex flex-col items-center'
                  title={`${channel.wavelength}Å - ${channel.name}`}
                >
                  <div
                    className='w-2 h-2 rounded-full transition-transform'
                    style={{
                      backgroundColor: channel.colour,
                      transform: isActive ? 'scale(1.5)' : 'scale(1)',
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Play/Pause button */}
          <button
            onClick={() => setIsSweeping(prev => !prev)}
            className='w-full py-2 text-sm font-mono uppercase tracking-wider border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center gap-2'
          >
            {isSweeping ? (
              <>
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                  <rect x='6' y='4' width='4' height='16' />
                  <rect x='14' y='4' width='4' height='16' />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                  <polygon points='5,3 19,12 5,21' />
                </svg>
                Auto Sweep
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
