'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface SolarDemoProps {
  className?: string;
  showLabel?: boolean;
}

interface LoadedChannel {
  key: string;
  label: string;
  image: HTMLImageElement;
  objectUrl: string;
}

interface ChannelConfig {
  key: string;
  label: string;
  candidates: string[];
}

const DEMO_DATE = '2014-09-10T00:00:00Z';
const CROSSFADE_SECONDS = 1.5;

const CHANNELS: ChannelConfig[] = [
  { key: '171', label: '171 \u00c5', candidates: ['171'] },
  { key: '304', label: '304 \u00c5', candidates: ['304'] },
  { key: '193', label: '193 \u00c5', candidates: ['193'] },
  { key: '094', label: '094 \u00c5', candidates: ['094', '94'] },
  { key: 'HMI', label: 'HMI', candidates: ['HMI_IC', '6173'] },
];

async function fetchSolarImage(wavelength: string): Promise<{ image: HTMLImageElement; objectUrl: string }> {
  const response = await fetch(
    `/api/solar?wavelength=${encodeURIComponent(wavelength)}&date=${encodeURIComponent(DEMO_DATE)}&size=512`
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
      const label = config.key === 'HMI' ? `${candidate} \u00c5` : config.label;
      return { key: config.key, label, image, objectUrl };
    } catch {
      // Try next candidate silently.
    }
  }

  return null;
}

export default function SolarDemo({ className, showLabel = false }: SolarDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [canvasSize, setCanvasSize] = useState(320);
  const [channels, setChannels] = useState<LoadedChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      const rect = container.getBoundingClientRect();
      const width = rect.width || 320;
      const height = rect.height || width;
      const maxSize = window.innerWidth < 768 ? 320 : 600;
      setCanvasSize(Math.max(1, Math.floor(Math.min(width, height, maxSize))));
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
      const startedAt = performance.now();
      const loaded = await Promise.all(CHANNELS.map((channel) => loadChannel(channel)));

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
      setIsLoading(false);

      const loadMs = Math.round(performance.now() - startedAt);
      console.info(`[SolarDemo] Loaded ${successful.length}/${CHANNELS.length} channels in ${loadMs}ms`);
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
    canvas.width = Math.floor(canvasSize * dpr);
    canvas.height = Math.floor(canvasSize * dpr);
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cycleSeconds = displaySeconds + CROSSFADE_SECONDS;
    const startedAt = performance.now();

    const drawCoverImage = (image: HTMLImageElement, alpha: number) => {
      const sourceSize = Math.min(image.width, image.height);
      const sx = (image.width - sourceSize) * 0.5;
      const sy = (image.height - sourceSize) * 0.5;
      context.globalAlpha = alpha;
      context.drawImage(image, sx, sy, sourceSize, sourceSize, 0, 0, canvasSize, canvasSize);
    };

    const render = (now: number) => {
      const elapsed = ((now - startedAt) / 1000) % loopSeconds;
      const phaseIndex = Math.floor(elapsed / cycleSeconds);
      const phaseTime = elapsed - phaseIndex * cycleSeconds;

      const current = channels[phaseIndex % channels.length];
      const next = channels[(phaseIndex + 1) % channels.length];
      const isTransition = phaseTime >= displaySeconds;
      const transitionProgress = isTransition ? Math.min((phaseTime - displaySeconds) / CROSSFADE_SECONDS, 1) : 0;

      context.clearRect(0, 0, canvasSize, canvasSize);
      context.save();
      context.beginPath();
      context.arc(canvasSize * 0.5, canvasSize * 0.5, canvasSize * 0.5, 0, Math.PI * 2);
      context.clip();

      drawCoverImage(current.image, 1);
      if (channels.length > 1 && isTransition) {
        drawCoverImage(next.image, transitionProgress);
      }
      context.restore();

      if (showLabel) {
        let labelAlpha = 0;
        if (!isTransition) {
          const fadeDuration = 0.35;
          const fadeIn = Math.min(phaseTime / fadeDuration, 1);
          const fadeOut = phaseTime > displaySeconds - fadeDuration
            ? Math.max((displaySeconds - phaseTime) / fadeDuration, 0)
            : 1;
          labelAlpha = Math.min(fadeIn, fadeOut);
        }

        if (labelAlpha > 0.01) {
          context.globalAlpha = labelAlpha;
          context.font = '11px var(--font-input), monospace';
          context.fillStyle = 'rgba(255, 255, 255, 0.6)';
          context.textBaseline = 'bottom';
          context.fillText(current.label.toUpperCase(), 12, canvasSize - 12);
        }
      }

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
  }, [canvasSize, channels, displaySeconds, loopSeconds, showLabel]);

  return (
    <div ref={containerRef} className={className}>
      <div className='relative w-full h-full flex items-center justify-center'>
        <canvas ref={canvasRef} className='block' />
        {isLoading && (
          <div
            className='absolute inset-0 flex items-center justify-center'
            aria-live='polite'
          >
            <div
              className='rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white/60 font-input uppercase tracking-wide'
              style={{ width: canvasSize, height: canvasSize, fontSize: 11 }}
            >
              Loading...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
