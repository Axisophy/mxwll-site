'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  EarthModel,
  RayPath,
  Station,
  polarToCanvas,
  getPhaseColor,
} from '../lib/types';

interface EarthCrossSectionProps {
  earthModel: EarthModel;
  rayPaths: RayPath[];
  stations: Station[];
  currentTime: number;
  visiblePhases: string[];
  highlightedStation: string | null;
  onStationHover: (station: string | null) => void;
  onStationClick: (station: string) => void;
}

export default function EarthCrossSection({
  earthModel,
  rayPaths,
  stations,
  currentTime,
  visiblePhases,
  highlightedStation,
  onStationHover,
  onStationClick,
}: EarthCrossSectionProps) {
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
    const size = Math.min(rect.width, rect.height);

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const earthRadius = size * 0.42;

    // Clear
    ctx.fillStyle = '#0A0A0F';
    ctx.fillRect(0, 0, size, size);

    // Draw Earth layers (from outer to inner)
    const sortedLayers = [...earthModel.layers].sort((a, b) => b.r_outer - a.r_outer);

    for (const layer of sortedLayers) {
      const outerR = (layer.r_outer / earthModel.radius_km) * earthRadius;
      const innerR = (layer.r_inner / earthModel.radius_km) * earthRadius;

      // Create radial gradient for each layer
      const gradient = ctx.createRadialGradient(
        centerX, centerY, innerR,
        centerX, centerY, outerR
      );

      // Darken towards inner edge
      const baseColor = layer.color;
      gradient.addColorStop(0, adjustBrightness(baseColor, 0.6));
      gradient.addColorStop(0.5, baseColor);
      gradient.addColorStop(1, adjustBrightness(baseColor, 0.8));

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerR, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, innerR, 0, Math.PI * 2, true);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Draw discontinuity lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    for (const disc of earthModel.discontinuities) {
      const r = (disc.radius_km / earthModel.radius_km) * earthRadius;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw CMB with stronger line
    const cmbRadius = (3480 / earthModel.radius_km) * earthRadius;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, cmbRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw ICB
    const icbRadius = (1221 / earthModel.radius_km) * earthRadius;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, icbRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw shadow zones (semi-transparent wedges)
    const sourceAngle = 0; // Source at top

    // S-wave shadow zone (103° to 180°)
    const sShadowStart = (103 * Math.PI) / 180;
    const sShadowEnd = Math.PI;
    ctx.fillStyle = 'rgba(255, 0, 85, 0.08)';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, earthRadius, sourceAngle + sShadowStart - Math.PI / 2, sourceAngle + sShadowEnd - Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    // Mirror side
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, earthRadius, sourceAngle - sShadowEnd - Math.PI / 2, sourceAngle - sShadowStart - Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    // P-wave shadow zone (103° to 142°)
    const pShadowStart = (103 * Math.PI) / 180;
    const pShadowEnd = (142 * Math.PI) / 180;
    ctx.fillStyle = 'rgba(0, 85, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, earthRadius, sourceAngle + pShadowStart - Math.PI / 2, sourceAngle + pShadowEnd - Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    // Mirror side
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, earthRadius, sourceAngle - pShadowEnd - Math.PI / 2, sourceAngle - pShadowStart - Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    // Draw ray paths that have been traversed by current time
    for (const ray of rayPaths) {
      if (!visiblePhases.includes(ray.phase) && !visiblePhases.includes(ray.wave_type)) continue;

      const color = getPhaseColor(ray.phase);

      // Find points up to current time
      const visiblePoints: { x: number; y: number }[] = [];
      for (const pt of ray.path) {
        if (pt.t > currentTime) break;
        const { x, y } = polarToCanvas(pt.theta, pt.r, centerX, centerY, earthRadius, sourceAngle);
        visiblePoints.push({ x, y });
      }

      if (visiblePoints.length < 2) continue;

      // Draw the ray path
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y);
      for (let i = 1; i < visiblePoints.length; i++) {
        ctx.lineTo(visiblePoints[i].x, visiblePoints[i].y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw wavefronts
    drawWavefront(ctx, rayPaths, currentTime, 'P', visiblePhases, centerX, centerY, earthRadius, sourceAngle);
    drawWavefront(ctx, rayPaths, currentTime, 'S', visiblePhases, centerX, centerY, earthRadius, sourceAngle);

    // Draw earthquake source
    ctx.fillStyle = '#FFCC00';
    ctx.shadowColor = '#FFCC00';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(centerX, centerY - earthRadius + 5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw stations
    for (const station of stations) {
      const angle = (station.distance_deg * Math.PI) / 180;
      const stationX = centerX + earthRadius * Math.sin(angle - Math.PI / 2 + sourceAngle);
      const stationY = centerY - earthRadius * Math.cos(angle - Math.PI / 2 + sourceAngle);

      const isHighlighted = highlightedStation === station.station;

      // Check if any arrivals have occurred
      const hasArrived = station.arrivals.some(a => a.time_s <= currentTime);

      ctx.fillStyle = isHighlighted
        ? '#FFFFFF'
        : hasArrived
        ? '#00FF88'
        : station.in_p_shadow
        ? '#FF6666'
        : '#888888';

      ctx.beginPath();
      ctx.arc(stationX, stationY, isHighlighted ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw station label for highlighted
      if (isHighlighted) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(station.station, stationX, stationY - 10);
      }
    }

    // Draw layer labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';

    // Inner core label
    ctx.fillText('Inner', centerX, centerY - 5);
    ctx.fillText('Core', centerX, centerY + 8);

    // Outer core label
    const outerCoreY = centerY - icbRadius - (cmbRadius - icbRadius) / 2;
    ctx.fillText('Outer Core', centerX, outerCoreY);

    // Mantle label
    const mantleY = centerY - cmbRadius - (earthRadius - cmbRadius) / 2;
    ctx.fillText('Mantle', centerX, mantleY);

  }, [earthModel, rayPaths, stations, currentTime, visiblePhases, highlightedStation]);

  // Draw wavefront for a wave type
  function drawWavefront(
    ctx: CanvasRenderingContext2D,
    rayPaths: RayPath[],
    currentTime: number,
    waveType: 'P' | 'S',
    visiblePhases: string[],
    centerX: number,
    centerY: number,
    earthRadius: number,
    sourceAngle: number
  ) {
    if (!visiblePhases.includes(waveType)) return;

    const color = waveType === 'P' ? '#0055FF' : '#FF0055';

    // Find wavefront points across all ray paths of this type
    const wavefrontPoints: { x: number; y: number; angle: number }[] = [];

    for (const ray of rayPaths) {
      if (ray.wave_type !== waveType) continue;
      if (!ray.phase.startsWith(waveType)) continue;

      // Find the point at currentTime by interpolation
      for (let i = 0; i < ray.path.length - 1; i++) {
        const pt1 = ray.path[i];
        const pt2 = ray.path[i + 1];

        if (pt1.t <= currentTime && pt2.t > currentTime) {
          const frac = (currentTime - pt1.t) / (pt2.t - pt1.t);
          const theta = pt1.theta + frac * (pt2.theta - pt1.theta);
          const r = pt1.r + frac * (pt2.r - pt1.r);
          const { x, y } = polarToCanvas(theta, r, centerX, centerY, earthRadius, sourceAngle);
          wavefrontPoints.push({ x, y, angle: theta });
          break;
        }
      }
    }

    if (wavefrontPoints.length < 2) return;

    // Sort by angle
    wavefrontPoints.sort((a, b) => a.angle - b.angle);

    // Draw wavefront as a thick glowing line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.9;

    ctx.beginPath();
    ctx.moveTo(wavefrontPoints[0].x, wavefrontPoints[0].y);
    for (let i = 1; i < wavefrontPoints.length; i++) {
      ctx.lineTo(wavefrontPoints[i].x, wavefrontPoints[i].y);
    }
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

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
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.min(rect.width, rect.height);
    const centerX = size / 2;
    const centerY = size / 2;
    const earthRadius = size * 0.42;

    // Find nearest station
    let nearestStation: string | null = null;
    let nearestDist = 15; // Max hover distance in pixels

    for (const station of stations) {
      const angle = (station.distance_deg * Math.PI) / 180;
      const stationX = centerX + earthRadius * Math.sin(angle - Math.PI / 2);
      const stationY = centerY - earthRadius * Math.cos(angle - Math.PI / 2);

      const dist = Math.sqrt((x - stationX) ** 2 + (y - stationY) ** 2);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestStation = station.station;
      }
    }

    onStationHover(nearestStation);
  }, [stations, onStationHover]);

  const handleClick = useCallback(() => {
    if (highlightedStation) {
      onStationClick(highlightedStation);
    }
  }, [highlightedStation, onStationClick]);

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

// Utility function to adjust colour brightness
function adjustBrightness(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const newR = Math.round(Math.min(255, r * factor));
  const newG = Math.round(Math.min(255, g * factor));
  const newB = Math.round(Math.min(255, b * factor));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}
