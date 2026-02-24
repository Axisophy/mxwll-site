'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  ChainIsotope,
  ChartContext,
  ColourEntry,
  halfLifeToOKLCh,
  DECAY_COLOURS,
} from '../lib/types';

interface NuclideChartViewProps {
  chainData: ChainIsotope[];
  chartContext: ChartContext;
  colourMap: Record<string, ColourEntry>;
  currentStep: number;
  animationProgress: number;  // 0-1 progress through current decay
}

export default function NuclideChartView({
  chainData,
  chartContext,
  colourMap,
  currentStep,
  animationProgress,
}: NuclideChartViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear
    ctx.fillStyle = '#0A0A0F';
    ctx.fillRect(0, 0, width, height);

    // Chart parameters
    const { viewport } = chartContext;
    const numCols = viewport.n_max - viewport.n_min + 1;  // 24
    const numRows = viewport.z_max - viewport.z_min + 1;  // 12
    const cellSize = Math.min((width - 80) / numCols, (height - 60) / numRows);
    const gap = 2;
    const offsetX = (width - numCols * (cellSize + gap)) / 2;
    const offsetY = 40;

    // Helper to convert Z, N to canvas coords
    const toCanvas = (Z: number, N: number) => ({
      x: offsetX + (N - viewport.n_min) * (cellSize + gap),
      y: offsetY + (viewport.z_max - Z) * (cellSize + gap),
    });

    // Draw background grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let z = viewport.z_min; z <= viewport.z_max; z++) {
      for (let n = viewport.n_min; n <= viewport.n_max; n++) {
        const pos = toCanvas(z, n);
        ctx.fillRect(pos.x, pos.y, cellSize, cellSize);
      }
    }

    // Draw axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';

    // N labels (bottom)
    for (let n = viewport.n_min; n <= viewport.n_max; n += 2) {
      const pos = toCanvas(viewport.z_min, n);
      ctx.fillText(n.toString(), pos.x + cellSize / 2, height - 10);
    }
    ctx.fillText('N (neutrons)', width / 2, height - 2);

    // Z labels (left)
    ctx.textAlign = 'right';
    for (let z = viewport.z_min; z <= viewport.z_max; z += 2) {
      const pos = toCanvas(z, viewport.n_min);
      ctx.fillText(z.toString(), offsetX - 8, pos.y + cellSize / 2 + 4);
    }
    ctx.save();
    ctx.translate(12, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Z (protons)', 0, 0);
    ctx.restore();

    // Draw chain path cells
    for (let i = 0; i < chainData.length; i++) {
      const isotope = chainData[i];
      const pos = toCanvas(isotope.Z, isotope.N);

      // Get colour from colour map or compute
      const colourEntry = colourMap[isotope.isotope];
      const computedColour = halfLifeToOKLCh(isotope.half_life_seconds);
      const colourCss = colourEntry?.oklch || computedColour.css;

      // Determine cell state
      const isPast = i < currentStep;
      const isCurrent = i === currentStep;
      const isFuture = i > currentStep;
      const isNext = i === currentStep + 1;

      // Cell background
      if (isCurrent) {
        // Current isotope - full colour with glow
        ctx.shadowColor = colourCss;
        ctx.shadowBlur = 15;
        ctx.fillStyle = colourCss;
        ctx.fillRect(pos.x, pos.y, cellSize, cellSize);
        ctx.shadowBlur = 0;
      } else if (isPast) {
        // Past isotopes - dimmed
        ctx.fillStyle = `rgba(100, 100, 100, 0.3)`;
        ctx.fillRect(pos.x, pos.y, cellSize, cellSize);
      } else if (isNext && animationProgress > 0) {
        // Next isotope during animation - growing
        const alpha = animationProgress * 0.6;
        ctx.fillStyle = colourCss;
        ctx.globalAlpha = alpha;
        ctx.fillRect(pos.x, pos.y, cellSize, cellSize);
        ctx.globalAlpha = 1;
      } else if (isFuture) {
        // Future isotopes - outlined
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(pos.x + 0.5, pos.y + 0.5, cellSize - 1, cellSize - 1);
      }

      // Cell labels
      const textColor = isCurrent || isPast ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
      ctx.fillStyle = textColor;

      // Mass number (top-left, superscript style)
      ctx.font = `${cellSize * 0.22}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(isotope.A.toString(), pos.x + 2, pos.y + cellSize * 0.25);

      // Element symbol (center)
      ctx.font = `bold ${cellSize * 0.35}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        isotope.symbol + (isotope.is_metastable ? 'm' : ''),
        pos.x + cellSize / 2,
        pos.y + cellSize / 2
      );
      ctx.textBaseline = 'alphabetic';
    }

    // Draw transition arrows
    for (let i = 0; i < currentStep && i < chainData.length - 1; i++) {
      const from = chainData[i];
      const to = chainData[i + 1];
      const fromPos = toCanvas(from.Z, from.N);
      const toPos = toCanvas(to.Z, to.N);

      const startX = fromPos.x + cellSize / 2;
      const startY = fromPos.y + cellSize / 2;
      const endX = toPos.x + cellSize / 2;
      const endY = toPos.y + cellSize / 2;

      // Arrow colour based on decay type
      ctx.strokeStyle = from.decay_type === 'alpha'
        ? DECAY_COLOURS.alpha
        : DECAY_COLOURS.beta_minus;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(endY - startY, endX - startX);
      const headLen = 8;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(angle - Math.PI / 6),
        endY - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(angle + Math.PI / 6),
        endY - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();

      ctx.globalAlpha = 1;
    }

    // Draw current decay animation
    if (animationProgress > 0 && currentStep < chainData.length - 1) {
      const from = chainData[currentStep];
      const to = chainData[currentStep + 1];
      const fromPos = toCanvas(from.Z, from.N);
      const toPos = toCanvas(to.Z, to.N);

      const startX = fromPos.x + cellSize / 2;
      const startY = fromPos.y + cellSize / 2;
      const endX = toPos.x + cellSize / 2;
      const endY = toPos.y + cellSize / 2;

      // Animated particle
      const particleX = startX + (endX - startX) * animationProgress;
      const particleY = startY + (endY - startY) * animationProgress;

      // Add parabolic arc for alpha particles
      if (from.decay_type === 'alpha') {
        const arcHeight = -30 * Math.sin(animationProgress * Math.PI);
        const arcY = particleY + arcHeight;

        // Alpha particle (helium-4 cluster)
        ctx.fillStyle = DECAY_COLOURS.alpha;
        ctx.shadowColor = DECAY_COLOURS.alpha;
        ctx.shadowBlur = 10;

        // Draw 4 small circles for He-4
        const particleSize = 4;
        ctx.beginPath();
        ctx.arc(particleX - particleSize, arcY - particleSize, particleSize, 0, Math.PI * 2);
        ctx.arc(particleX + particleSize, arcY - particleSize, particleSize, 0, Math.PI * 2);
        ctx.arc(particleX - particleSize, arcY + particleSize, particleSize, 0, Math.PI * 2);
        ctx.arc(particleX + particleSize, arcY + particleSize, particleSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      } else if (from.decay_type === 'beta_minus') {
        // Beta electron
        ctx.fillStyle = DECAY_COLOURS.beta_minus;
        ctx.shadowColor = DECAY_COLOURS.beta_minus;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.arc(particleX, particleY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Electron trail
        ctx.strokeStyle = DECAY_COLOURS.beta_minus;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(particleX, particleY);
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.shadowBlur = 0;
      }
    }

    // Draw current isotope info
    if (currentStep < chainData.length) {
      const current = chainData[currentStep];
      const pos = toCanvas(current.Z, current.N);

      // Info panel below current cell
      const infoY = pos.y + cellSize + 15;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${current.element}-${current.A}`,
        pos.x + cellSize / 2,
        infoY
      );

      if (!current.is_stable) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '11px sans-serif';
        ctx.fillText(
          `t½ = ${current.half_life_readable}`,
          pos.x + cellSize / 2,
          infoY + 16
        );

        ctx.font = '10px sans-serif';
        ctx.fillStyle = current.decay_type === 'alpha'
          ? DECAY_COLOURS.alpha
          : DECAY_COLOURS.beta_minus;
        ctx.fillText(
          current.decay_mode || '',
          pos.x + cellSize / 2,
          infoY + 30
        );
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '11px sans-serif';
        ctx.fillText('STABLE', pos.x + cellSize / 2, infoY + 16);
      }
    }

    // Legend
    const legendX = width - 120;
    const legendY = 50;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Decay modes:', legendX, legendY);

    // Alpha
    ctx.fillStyle = DECAY_COLOURS.alpha;
    ctx.fillRect(legendX, legendY + 8, 12, 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('α (alpha)', legendX + 18, legendY + 18);

    // Beta
    ctx.fillStyle = DECAY_COLOURS.beta_minus;
    ctx.fillRect(legendX, legendY + 26, 12, 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('β⁻ (beta)', legendX + 18, legendY + 36);

  }, [chainData, chartContext, colourMap, currentStep, animationProgress]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div ref={containerRef} className='w-full h-full'>
      <canvas ref={canvasRef} className='w-full h-full' />
    </div>
  );
}
