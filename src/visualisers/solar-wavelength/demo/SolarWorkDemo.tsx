'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface SolarWorkDemoProps {
  className?: string;
}

type SpectrumKey = '094' | '171' | '193' | '304' | 'visible';

interface LoadedChannel {
  key: SpectrumKey;
  image: HTMLImageElement;
  objectUrl: string;
}

interface ChannelConfig {
  key: SpectrumKey;
  candidates: string[];
}

const DEMO_DATE = '2014-09-10T00:00:00Z';
const CROSSFADE_SECONDS = 2;
const DISPLAY_SECONDS = 5;

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
  if (!response.ok) throw new Error(`Failed to fetch ${wavelength}: ${response.status}`);
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
      return { key: config.key, image, objectUrl };
    } catch {
      // Continue through fallbacks
    }
  }
  return null;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Rectangular crossfading demo for work index card backgrounds.
 * No UI controls, no annotations - just slowly crossfading solar images
 * that fill the container using cover-fit.
 */
export default function SolarWorkDemo({ className = '' }: SolarWorkDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const [channels, setChannels] = useState<LoadedChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const preload = async () => {
      const loaded = await Promise.all(CYCLE_CHANNELS.map(loadChannel));
      if (!mounted) {
        loaded.forEach(e => e && URL.revokeObjectURL(e.objectUrl));
        return;
      }
      const successful = loaded.filter((e): e is LoadedChannel => e !== null);
      objectUrlsRef.current = successful.map(e => e.objectUrl);
      setChannels(successful);
      setIsLoading(false);
    };
    preload();
    return () => {
      mounted = false;
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  const loopSeconds = useMemo(() => {
    if (channels.length === 0) return 0;
    return channels.length * (DISPLAY_SECONDS + CROSSFADE_SECONDS);
  }, [channels.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || channels.length === 0 || loopSeconds === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cycleSeconds = DISPLAY_SECONDS + CROSSFADE_SECONDS;
    const startedAt = performance.now();

    const drawCover = (img: HTMLImageElement, w: number, h: number, alpha: number) => {
      const srcSize = Math.min(img.width, img.height);
      const sx = (img.width - srcSize) / 2;
      const sy = (img.height - srcSize) / 2;
      const scale = Math.max(w / srcSize, h / srcSize);
      const dw = srcSize * scale;
      const dh = srcSize * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, sx, sy, srcSize, srcSize, dx, dy, dw, dh);
    };

    const render = (now: number) => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width;
      const h = rect.height;

      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const elapsed = ((now - startedAt) / 1000) % loopSeconds;
      const phaseIndex = Math.floor(elapsed / cycleSeconds);
      const phaseTime = elapsed - phaseIndex * cycleSeconds;

      const current = channels[phaseIndex % channels.length];
      const next = channels[(phaseIndex + 1) % channels.length];
      const isTransition = phaseTime >= DISPLAY_SECONDS;
      const t = isTransition ? clamp01((phaseTime - DISPLAY_SECONDS) / CROSSFADE_SECONDS) : 0;

      ctx.fillStyle = '#03060f';
      ctx.fillRect(0, 0, w, h);

      drawCover(current.image, w, h, 1);
      if (isTransition && channels.length > 1) {
        drawCover(next.image, w, h, t);
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [channels, loopSeconds]);

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-[#03060f] ${className}`}>
      <canvas ref={canvasRef} className='absolute inset-0 w-full h-full' />
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin' />
        </div>
      )}
    </div>
  );
}
