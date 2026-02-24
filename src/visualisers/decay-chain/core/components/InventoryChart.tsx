'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  ChainIsotope,
  ColourEntry,
  interpolateInventory,
  InventorySnapshot,
} from '../lib/types';

interface InventoryChartProps {
  chainData: ChainIsotope[];
  inventoryData: InventorySnapshot[];
  colourMap: Record<string, ColourEntry>;
  logTime: number;
}

export default function InventoryChart({
  chainData,
  inventoryData,
  colourMap,
  logTime,
}: InventoryChartProps) {
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

    // Get current inventory
    const inventory = interpolateInventory(inventoryData, logTime);

    // Chart parameters
    const padding = { left: 100, right: 20, top: 20, bottom: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const barHeight = chartHeight / chainData.length;

    // Find max activity for scaling
    const activities = Object.values(inventory);
    const maxActivity = Math.max(...activities, 1e-10);

    // Draw bars
    chainData.forEach((isotope, i) => {
      const y = padding.top + i * barHeight;
      const activity = inventory[isotope.isotope] || 0;

      // Normalized value (log scale for better visibility)
      let barWidth = 0;
      if (activity > 0 && maxActivity > 0) {
        // Use log scale for better visibility of small values
        const logActivity = Math.log10(Math.max(activity, 1e-30));
        const logMax = Math.log10(maxActivity);
        const logMin = logMax - 30;  // Show 30 orders of magnitude
        const normalizedLog = Math.max(0, (logActivity - logMin) / (logMax - logMin));
        barWidth = normalizedLog * chartWidth;
      }

      // Background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(padding.left, y + 2, chartWidth, barHeight - 4);

      // Bar
      if (barWidth > 0) {
        const colour = colourMap[isotope.isotope];
        ctx.fillStyle = colour?.oklch || 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(padding.left, y + 2, barWidth, barHeight - 4);
      }

      // Label (isotope name)
      ctx.fillStyle = activity > 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)';
      ctx.font = `${Math.min(12, barHeight * 0.6)}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(isotope.isotope, padding.left - 8, y + barHeight / 2);

      // Activity value (if significant)
      if (activity > 1e-20) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = `${Math.min(10, barHeight * 0.45)}px monospace`;
        ctx.textAlign = 'left';

        let activityText: string;
        if (activity >= 0.01) {
          activityText = `${(activity * 100).toFixed(1)}%`;
        } else if (activity >= 1e-6) {
          activityText = `${(activity * 1e6).toFixed(1)} ppm`;
        } else {
          activityText = `10^${Math.log10(activity).toFixed(0)}`;
        }

        ctx.fillText(activityText, padding.left + barWidth + 5, y + barHeight / 2);
      }
    });

    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Isotope Inventory (relative activity)', width / 2, height - 10);

    // Axis line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();

  }, [chainData, inventoryData, colourMap, logTime]);

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
