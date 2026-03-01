'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface SolarDemoProps {
  className?: string;
  showLabel?: boolean;
}

interface LoadedChannel {
  key: SpectrumKey;
  wavelengthLabel: string;
  channelName: string;
  image: HTMLImageElement;
  objectUrl: string;
}

interface ChannelConfig {
  key: SpectrumKey;
  candidates: string[];
}

type SpectrumKey = '094' | '131' | '171' | '193' | '211' | '304' | '1600' | 'visible';

const DEMO_DATE = '2014-09-10T00:00:00Z';
const CROSSFADE_SECONDS = 1.5;

const CHANNEL_DISPLAY: Record<SpectrumKey, { wavelength: string; name: string }> = {
  '094': { wavelength: '094 Å', name: 'X-ray - Flare Regions' },
  '131': { wavelength: '131 Å', name: 'Extreme UV - Hot Plasma' },
  '171': { wavelength: '171 Å', name: 'Extreme UV - Coronal Loops' },
  '193': { wavelength: '193 Å', name: 'UV - Hot Corona' },
  '211': { wavelength: '211 Å', name: 'UV - Active Regions' },
  '304': { wavelength: '304 Å', name: 'UV - Chromosphere' },
  '1600': { wavelength: '1600 Å', name: 'UV - Transition Region' },
  visible: { wavelength: 'Visible', name: 'Visible Light - Surface' },
};

const SPECTRUM_ORDER: SpectrumKey[] = ['094', '131', '171', '193', '211', '304', '1600', 'visible'];

const CYCLE_CHANNELS: ChannelConfig[] = [
  { key: '171', candidates: ['171'] },
  { key: '304', candidates: ['304'] },
  { key: '193', candidates: ['193'] },
  { key: '094', candidates: ['094', '94'] },
  { key: 'visible', candidates: ['HMI_IC', '6173'] },
];

async function fetchSolarImage(wavelength: string): Promise<{ image: HTMLImageElement; objectUrl: string }> {
  const response = await fetch(
    `/api/solar?wavelength=${encodeURIComponent(wavelength)}&date=${encodeURIComponent(DEMO_DATE)}&size=768`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${wavelength}: ${response.status}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to decode image for ${wavelength}`));
    img.src = objectUrl;
  });

  return { image, objectUrl };
}

async function loadChannel(config: ChannelConfig): Promise<LoadedChannel | null> {
  for (const candidate of config.candidates) {
    try {
      const { image, objectUrl } = await fetchSolarImage(candidate);
      const display = CHANNEL_DISPLAY[config.key];
      return {
        key: config.key,
        wavelengthLabel: display.wavelength,
        channelName: display.name,
        image,
        objectUrl,
      };
    } catch {
      // Continue through fallbacks.
    }
  }

  return null;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export default function SolarDemo({ className, showLabel = true }: SolarDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  const [circleSize, setCircleSize] = useState(280);
  const [channels, setChannels] = useState<LoadedChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [indicator, setIndicator] = useState({
    position: 0,
    wavelengthLabel: CHANNEL_DISPLAY['171'].wavelength,
    channelName: CHANNEL_DISPLAY['171'].name,
    activeKey: '171' as SpectrumKey,
  });

  const displaySeconds = isMobile ? 3 : 4;

  useEffect(() => {
    const updateViewportState = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateViewportState();
    window.addEventListener('resize', updateViewportState);

    return () => {
      window.removeEventListener('resize', updateViewportState);
    };
  }, []);

  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const padding = window.innerWidth < 768 ? 16 : 24;
      const panelHeight = 86;
      const verticalGap = 12;

      const rect = container.getBoundingClientRect();
      const parentRect = container.parentElement?.getBoundingClientRect();

      const widthLimit = Math.max(120, Math.floor(rect.width - 2 * padding));

      let diameter = widthLimit;
      if (parentRect && parentRect.height > 0) {
        const heightLimit = Math.floor(parentRect.height - 2 * padding - panelHeight - verticalGap);
        if (heightLimit > 120) {
          diameter = Math.min(widthLimit, heightLimit);
        }
      }

      setCircleSize(Math.max(120, diameter));
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const preload = async () => {
      setIsLoading(true);
      const loaded = await Promise.all(CYCLE_CHANNELS.map((channel) => loadChannel(channel)));

      if (!isMounted) {
        loaded.forEach((entry) => {
          if (entry) {
            URL.revokeObjectURL(entry.objectUrl);
          }
        });
        return;
      }

      const successful = loaded.filter((entry): entry is LoadedChannel => entry !== null);
      objectUrlsRef.current = successful.map((entry) => entry.objectUrl);
      setChannels(successful);

      if (successful.length > 0) {
        const first = successful[0];
        setIndicator({
          position: SPECTRUM_ORDER.indexOf(first.key),
          wavelengthLabel: first.wavelengthLabel,
          channelName: first.channelName,
          activeKey: first.key,
        });
      }

      setIsLoading(false);
    };

    preload();

    return () => {
      isMounted = false;
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  const loopSeconds = useMemo(() => {
    if (channels.length === 0) {
      return 0;
    }
    return channels.length * (displaySeconds + CROSSFADE_SECONDS);
  }, [channels.length, displaySeconds]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || channels.length === 0 || loopSeconds === 0) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(circleSize * dpr);
    canvas.height = Math.floor(circleSize * dpr);
    canvas.style.width = `${circleSize}px`;
    canvas.style.height = `${circleSize}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cycleSeconds = displaySeconds + CROSSFADE_SECONDS;
    const startedAt = performance.now();

    const drawCoverImage = (image: HTMLImageElement, alpha: number) => {
      const sourceSize = Math.min(image.width, image.height);
      const sx = (image.width - sourceSize) * 0.5;
      const sy = (image.height - sourceSize) * 0.5;
      context.globalAlpha = alpha;
      context.drawImage(image, sx, sy, sourceSize, sourceSize, 0, 0, circleSize, circleSize);
    };

    const render = (now: number) => {
      const elapsed = ((now - startedAt) / 1000) % loopSeconds;
      const phaseIndex = Math.floor(elapsed / cycleSeconds);
      const phaseTime = elapsed - phaseIndex * cycleSeconds;

      const current = channels[phaseIndex % channels.length];
      const next = channels[(phaseIndex + 1) % channels.length];
      const isTransition = phaseTime >= displaySeconds;
      const transitionProgress = isTransition ? clamp01((phaseTime - displaySeconds) / CROSSFADE_SECONDS) : 0;

      const currentSpectrumIndex = SPECTRUM_ORDER.indexOf(current.key);
      const nextSpectrumIndex = SPECTRUM_ORDER.indexOf(next.key);
      const indicatorPosition = currentSpectrumIndex + (nextSpectrumIndex - currentSpectrumIndex) * transitionProgress;

      const active = transitionProgress > 0.5 ? next : current;
      setIndicator((prev) => {
        if (
          Math.abs(prev.position - indicatorPosition) < 0.002 &&
          prev.activeKey === active.key &&
          prev.wavelengthLabel === active.wavelengthLabel
        ) {
          return prev;
        }

        return {
          position: indicatorPosition,
          wavelengthLabel: active.wavelengthLabel,
          channelName: active.channelName,
          activeKey: active.key,
        };
      });

      context.clearRect(0, 0, circleSize, circleSize);
      context.save();
      context.beginPath();
      context.arc(circleSize * 0.5, circleSize * 0.5, circleSize * 0.5, 0, Math.PI * 2);
      context.clip();

      drawCoverImage(current.image, 1);
      if (channels.length > 1 && isTransition) {
        drawCoverImage(next.image, transitionProgress);
      }

      context.restore();
      context.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = null;
    };
  }, [circleSize, channels, displaySeconds, loopSeconds]);

  const dotLeftPercent = useMemo(() => {
    if (SPECTRUM_ORDER.length < 2) {
      return 0;
    }
    const norm = clamp01(indicator.position / (SPECTRUM_ORDER.length - 1));
    return norm * 100;
  }, [indicator.position]);

  return (
    <div ref={containerRef} className={`w-full h-full bg-[#03060f] p-4 md:p-6 ${className ?? ''}`}>
      <div className='h-full w-full flex flex-col items-center justify-center gap-3'>
        <div
          className='relative flex items-center justify-center'
          style={{ width: `${circleSize}px`, height: `${circleSize}px` }}
        >
          <canvas ref={canvasRef} className='block' />
          {isLoading && (
            <div
              className='absolute inset-0 flex items-center justify-center rounded-full border border-white/20 bg-white/5'
              aria-live='polite'
            >
              <p className='font-input text-[10px] uppercase tracking-[0.08em] text-white/60'>Loading</p>
            </div>
          )}
        </div>

        {showLabel && (
          <div className='w-full max-w-[720px] bg-white/[0.04] px-4 py-3'>
            <div className='flex items-baseline justify-between gap-4'>
              <p className='font-input text-[12px] text-white'>{indicator.wavelengthLabel}</p>
              <p className='font-nhg text-[12px] text-white/60 text-right'>{indicator.channelName}</p>
            </div>

            <div className='relative mt-3 pb-5'>
              <div className='absolute left-0 right-0 top-[7px] h-px bg-white/20' />

              <div
                className='absolute top-0 -translate-x-1/2 transition-none'
                style={{ left: `${dotLeftPercent}%` }}
              >
                <span className='block h-[7px] w-[7px] rounded-full bg-white' />
              </div>

              {SPECTRUM_ORDER.map((key, index) => {
                const norm = (index / (SPECTRUM_ORDER.length - 1)) * 100;
                const isActive = key === indicator.activeKey;
                const label = CHANNEL_DISPLAY[key].wavelength;

                return (
                  <div
                    key={key}
                    className='absolute -translate-x-1/2'
                    style={{ left: `${norm}%`, top: 0 }}
                  >
                    <span className={`block h-[8px] w-px ${isActive ? 'bg-white' : 'bg-white/30'}`} />
                    <span
                      className={`mt-[6px] block whitespace-nowrap font-input text-[9px] ${isActive ? 'text-white' : 'text-white/40'}`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
