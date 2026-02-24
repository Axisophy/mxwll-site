'use client';

import { useEffect, useRef, useCallback } from 'react';
import { VelocityPoint, EarthModel } from '../lib/types';

interface VelocityProfileProps {
  velocityProfile: VelocityPoint[];
  earthModel: EarthModel;
  currentMaxDepth: number;  // Maximum depth reached by wavefront
}

export default function VelocityProfile({
  velocityProfile,
  earthModel,
  currentMaxDepth,
}: VelocityProfileProps) {
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

    const padding = { left: 35, right: 10, top: 20, bottom: 40 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Clear
    ctx.fillStyle = '#0A0A0F';
    ctx.fillRect(0, 0, width, height);

    // Velocity range: 0 to 14 km/s
    const maxVelocity = 14;
    const maxDepth = 6371;

    // Transform functions
    const velocityToX = (v: number) => padding.left + (v / maxVelocity) * plotWidth;
    const depthToY = (d: number) => padding.top + (d / maxDepth) * plotHeight;

    // Draw layer backgrounds
    for (const layer of earthModel.layers) {
      const yTop = depthToY(earthModel.radius_km - layer.r_outer);
      const yBottom = depthToY(earthModel.radius_km - layer.r_inner);

      ctx.fillStyle = layer.color + '20';  // Very transparent
      ctx.fillRect(padding.left, yTop, plotWidth, yBottom - yTop);
    }

    // Draw discontinuity lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (const disc of earthModel.discontinuities) {
      const y = depthToY(disc.depth_km);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(disc.name, padding.left - 4, y);
    }

    ctx.setLineDash([]);

    // Draw velocity grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    for (let v = 0; v <= maxVelocity; v += 2) {
      const x = velocityToX(v);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    // Draw Vp curve (blue)
    ctx.strokeStyle = '#0055FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    for (const pt of velocityProfile) {
      const x = velocityToX(pt.vp);
      const y = depthToY(pt.depth);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw Vs curve (red)
    ctx.strokeStyle = '#FF0055';
    ctx.lineWidth = 2;
    ctx.beginPath();
    started = false;
    for (const pt of velocityProfile) {
      const x = velocityToX(pt.vs);
      const y = depthToY(pt.depth);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Highlight where Vs = 0 (outer core)
    const outerCoreTop = depthToY(2891);
    const outerCoreBottom = depthToY(5150);
    ctx.fillStyle = 'rgba(255, 0, 85, 0.15)';
    ctx.fillRect(velocityToX(0) - 2, outerCoreTop, 4, outerCoreBottom - outerCoreTop);

    // Draw current depth marker
    if (currentMaxDepth > 0) {
      const markerY = depthToY(currentMaxDepth);
      ctx.strokeStyle = '#FFCC00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding.left, markerY);
      ctx.lineTo(width - padding.right, markerY);
      ctx.stroke();

      // Depth label
      ctx.fillStyle = '#FFCC00';
      ctx.font = '9px monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(currentMaxDepth)} km`, width - padding.right, markerY - 10);
    }

    // X-axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let v = 0; v <= maxVelocity; v += 4) {
      ctx.fillText(`${v}`, velocityToX(v), height - padding.bottom + 4);
    }

    // Axis title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px sans-serif';
    ctx.fillText('Velocity (km/s)', width / 2, height - 8);

    // Legend
    ctx.fillStyle = '#0055FF';
    ctx.fillRect(padding.left + 5, padding.top + 5, 12, 3);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Vp', padding.left + 20, padding.top + 7);

    ctx.fillStyle = '#FF0055';
    ctx.fillRect(padding.left + 45, padding.top + 5, 12, 3);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Vs', padding.left + 60, padding.top + 7);

    // "Vs = 0" annotation in outer core
    const outerCoreMid = (outerCoreTop + outerCoreBottom) / 2;
    ctx.fillStyle = 'rgba(255, 0, 85, 0.7)';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Vs = 0', velocityToX(2), outerCoreMid);
    ctx.fillText('(liquid)', velocityToX(2), outerCoreMid + 12);

  }, [velocityProfile, earthModel, currentMaxDepth]);

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
