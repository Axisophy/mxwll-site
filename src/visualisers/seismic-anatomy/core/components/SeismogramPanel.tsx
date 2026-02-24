'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Seismogram, getPhaseColor, formatTime } from '../lib/types';

interface SeismogramPanelProps {
  seismograms: Seismogram[];
  currentTime: number;
  duration: number;
  highlightedStation: string | null;
  onStationHover: (station: string | null) => void;
  onStationClick: (station: string) => void;
  onTimeClick: (time: number) => void;
}

export default function SeismogramPanel({
  seismograms,
  currentTime,
  duration,
  highlightedStation,
  onStationHover,
  onStationClick,
  onTimeClick,
}: SeismogramPanelProps) {
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

    const padding = { left: 80, right: 20, top: 20, bottom: 30 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Clear
    ctx.fillStyle = '#0A0A0F';
    ctx.fillRect(0, 0, width, height);

    // Sort seismograms by distance
    const sortedSeismograms = [...seismograms].sort((a, b) => a.distance_deg - b.distance_deg);
    const numTraces = sortedSeismograms.length;
    const traceHeight = plotHeight / numTraces;

    // Draw background for shadow zone traces
    for (let i = 0; i < sortedSeismograms.length; i++) {
      const seis = sortedSeismograms[i];
      const y = padding.top + i * traceHeight;

      // Highlight shadow zone
      if (seis.distance_deg >= 103 && seis.distance_deg <= 142) {
        ctx.fillStyle = 'rgba(255, 0, 85, 0.05)';
        ctx.fillRect(padding.left, y, plotWidth, traceHeight);
      }
    }

    // Time to x coordinate
    const timeToX = (t: number) => padding.left + (t / duration) * plotWidth;

    // Draw time grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let t = 0; t <= duration; t += 300) {  // Every 5 minutes
      const x = timeToX(t);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    // Draw current time marker
    const currentX = timeToX(currentTime);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(currentX, padding.top);
    ctx.lineTo(currentX, height - padding.bottom);
    ctx.stroke();

    // Draw seismogram traces
    for (let i = 0; i < sortedSeismograms.length; i++) {
      const seis = sortedSeismograms[i];
      const yCenter = padding.top + i * traceHeight + traceHeight / 2;
      const amplitudeScale = traceHeight * 0.4;

      const isHighlighted = highlightedStation === seis.station.split('.')[1];
      const stationName = seis.station.split('.')[1];

      // Draw station label
      ctx.fillStyle = isHighlighted ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)';
      ctx.font = isHighlighted ? 'bold 10px monospace' : '10px monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(stationName, padding.left - 40, yCenter);

      // Draw distance
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '9px monospace';
      ctx.fillText(`${seis.distance_deg}°`, padding.left - 8, yCenter);

      // Draw baseline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, yCenter);
      ctx.lineTo(width - padding.right, yCenter);
      ctx.stroke();

      // Draw waveform up to current time
      const startTime = seis.start_time_offset_s;
      const dt = 1 / seis.sample_rate;

      ctx.strokeStyle = isHighlighted ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = isHighlighted ? 1.5 : 1;
      ctx.beginPath();

      let started = false;
      for (let j = 0; j < seis.data.length; j++) {
        const t = startTime + j * dt;
        if (t > currentTime) break;

        const x = timeToX(t);
        const y = yCenter - seis.data[j] * amplitudeScale;

        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw arrival markers
      for (const arrival of seis.arrivals) {
        if (arrival.time_s > duration) continue;

        const x = timeToX(arrival.time_s);
        const color = getPhaseColor(arrival.phase);

        // Arrival line
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(x, yCenter - traceHeight * 0.3);
        ctx.lineTo(x, yCenter + traceHeight * 0.3);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Arrival marker (triangle)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, yCenter - traceHeight * 0.35);
        ctx.lineTo(x - 4, yCenter - traceHeight * 0.35 - 6);
        ctx.lineTo(x + 4, yCenter - traceHeight * 0.35 - 6);
        ctx.closePath();
        ctx.fill();

        // Phase label (only for highlighted or first occurrence)
        if (isHighlighted) {
          ctx.fillStyle = color;
          ctx.font = '8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(arrival.phase, x, yCenter - traceHeight * 0.35 - 10);
        }
      }
    }

    // Draw time axis
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let t = 0; t <= duration; t += 300) {
      const x = timeToX(t);
      ctx.fillText(formatTime(t), x, height - padding.bottom + 8);
    }

    // Draw axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time since earthquake (mm:ss)', width / 2, height - 5);

    // Y-axis label
    ctx.save();
    ctx.translate(12, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Epicentral distance (degrees)', 0, 0);
    ctx.restore();

    // Shadow zone labels
    const shadowZoneTraces = sortedSeismograms.filter(s => s.distance_deg >= 103 && s.distance_deg <= 142);
    if (shadowZoneTraces.length > 0) {
      const firstShadowIndex = sortedSeismograms.findIndex(s => s.distance_deg >= 103);
      const y = padding.top + firstShadowIndex * traceHeight - 2;

      ctx.fillStyle = 'rgba(255, 0, 85, 0.6)';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Shadow Zone', width - padding.right - 70, y);
    }

  }, [seismograms, currentTime, duration, highlightedStation]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  // Mouse interaction
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const padding = { top: 20, bottom: 30 };
    const plotHeight = rect.height - padding.top - padding.bottom;
    const sortedSeismograms = [...seismograms].sort((a, b) => a.distance_deg - b.distance_deg);
    const traceHeight = plotHeight / sortedSeismograms.length;

    const traceIndex = Math.floor((y - padding.top) / traceHeight);
    if (traceIndex >= 0 && traceIndex < sortedSeismograms.length) {
      const station = sortedSeismograms[traceIndex].station.split('.')[1];
      onStationHover(station);
    } else {
      onStationHover(null);
    }
  }, [seismograms, onStationHover]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const padding = { left: 80, right: 20 };
    const plotWidth = rect.width - padding.left - padding.right;

    if (x >= padding.left && x <= rect.width - padding.right) {
      const time = ((x - padding.left) / plotWidth) * duration;
      onTimeClick(Math.max(0, Math.min(duration, time)));
    }

    if (highlightedStation) {
      onStationClick(highlightedStation);
    }
  }, [duration, highlightedStation, onTimeClick, onStationClick]);

  return (
    <div ref={containerRef} className='w-full h-full'>
      <canvas
        ref={canvasRef}
        className='w-full h-full cursor-crosshair'
        onMouseMove={handleMouseMove}
        onMouseLeave={() => onStationHover(null)}
        onClick={handleClick}
      />
    </div>
  );
}
