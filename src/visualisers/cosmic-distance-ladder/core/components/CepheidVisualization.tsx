'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Cepheid, PLRelation, RUNG_COLORS } from '../lib/types';

interface CepheidVisualizationProps {
  cepheids: Cepheid[];
  plRelation: PLRelation;
  activeStep: string;
}

export default function CepheidVisualization({
  cepheids,
  plRelation,
  activeStep,
}: CepheidVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const [selectedCepheid, setSelectedCepheid] = useState<Cepheid | null>(null);
  const [hoveredCepheid, setHoveredCepheid] = useState<Cepheid | null>(null);
  const [showPLFit, setShowPLFit] = useState(false);

  // Update showPLFit based on active step
  useEffect(() => {
    if (activeStep === 'cepheid-pl' || activeStep === 'cepheid-calibrate') {
      setShowPLFit(true);
    } else {
      setShowPLFit(false);
    }
  }, [activeStep]);

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

    // Choose what to draw based on step
    if (activeStep === 'cepheid-intro' || activeStep === 'cepheid-pulsate') {
      drawPulsatingCepheid(ctx, width, height, timeRef.current);
    } else {
      drawPLDiagram(ctx, width, height, cepheids, plRelation, showPLFit, selectedCepheid, hoveredCepheid);
    }

    timeRef.current += 0.016;
  }, [cepheids, plRelation, activeStep, showPLFit, selectedCepheid, hoveredCepheid]);

  function drawPulsatingCepheid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number
  ) {
    const centerX = width * 0.35;
    const centerY = height / 2;

    // Simulate Cepheid pulsation
    const period = 5; // seconds
    const phase = (time % period) / period;

    // Cepheid light curve shape (fast rise, slow decline)
    const riseTime = 0.15;
    let brightness: number;
    if (phase < riseTime) {
      brightness = Math.sin(Math.PI * phase / riseTime);
    } else {
      brightness = Math.cos(Math.PI * (phase - riseTime) / (1 - riseTime));
    }
    brightness = (brightness + 1) / 2; // Normalize to 0-1

    // Draw the pulsating star
    const minRadius = 30;
    const maxRadius = 50;
    const radius = minRadius + (maxRadius - minRadius) * brightness;

    // Color changes with temperature (hotter when smaller)
    const temp = 1 - brightness * 0.3; // 0.7 to 1
    const r = Math.floor(255);
    const g = Math.floor(200 + 55 * temp);
    const b = Math.floor(100 + 155 * temp);

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw light curve on the right
    const lcX = width * 0.55;
    const lcY = height * 0.2;
    const lcWidth = width * 0.4;
    const lcHeight = height * 0.6;

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lcX, lcY);
    ctx.lineTo(lcX, lcY + lcHeight);
    ctx.lineTo(lcX + lcWidth, lcY + lcHeight);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time (days)', lcX + lcWidth / 2, lcY + lcHeight + 25);

    ctx.save();
    ctx.translate(lcX - 20, lcY + lcHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Brightness', 0, 0);
    ctx.restore();

    // Draw the light curve
    ctx.strokeStyle = RUNG_COLORS.cepheid;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i <= 100; i++) {
      const p = i / 100;
      let b: number;
      if (p < riseTime) {
        b = Math.sin(Math.PI * p / riseTime);
      } else {
        b = Math.cos(Math.PI * (p - riseTime) / (1 - riseTime));
      }
      b = (b + 1) / 2;

      const x = lcX + p * lcWidth;
      const y = lcY + lcHeight - b * lcHeight * 0.8 - lcHeight * 0.1;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Current position marker
    const markerX = lcX + phase * lcWidth;
    const markerY = lcY + lcHeight - brightness * lcHeight * 0.8 - lcHeight * 0.1;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(markerX, markerY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Period label
    ctx.fillStyle = RUNG_COLORS.cepheid;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Period: ${period} days`, lcX + lcWidth / 2, lcY - 15);

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Cepheid Variable Star', centerX, height * 0.85);
    ctx.fillText('Pulsates in size and brightness', centerX, height * 0.89);
  }

  function drawPLDiagram(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cepheids: Cepheid[],
    plRelation: PLRelation,
    showFit: boolean,
    selected: Cepheid | null,
    hovered: Cepheid | null
  ) {
    const padding = { left: 70, right: 30, top: 40, bottom: 50 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Axis ranges
    const logPMin = 0;
    const logPMax = 2;
    const magMin = -7;
    const magMax = -1;

    // Transform functions
    const logPToX = (logP: number) =>
      padding.left + ((logP - logPMin) / (logPMax - logPMin)) * plotWidth;
    const magToY = (mag: number) =>
      padding.top + ((mag - magMin) / (magMax - magMin)) * plotHeight;

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let logP = 0; logP <= 2; logP += 0.5) {
      const x = logPToX(logP);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    for (let mag = -7; mag <= -1; mag += 1) {
      const y = magToY(mag);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw P-L relation fit line
    if (showFit) {
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let logP = logPMin; logP <= logPMax; logP += 0.01) {
        const mag = plRelation.slope * logP + plRelation.intercept;
        const x = logPToX(logP);
        const y = magToY(mag);

        if (logP === logPMin) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Scatter band
      ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
      ctx.beginPath();
      for (let logP = logPMin; logP <= logPMax; logP += 0.01) {
        const mag = plRelation.slope * logP + plRelation.intercept - plRelation.scatter * 2;
        ctx.lineTo(logPToX(logP), magToY(mag));
      }
      for (let logP = logPMax; logP >= logPMin; logP -= 0.01) {
        const mag = plRelation.slope * logP + plRelation.intercept + plRelation.scatter * 2;
        ctx.lineTo(logPToX(logP), magToY(mag));
      }
      ctx.closePath();
      ctx.fill();

      // P-L equation
      ctx.fillStyle = RUNG_COLORS.cepheid;
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        `M = ${plRelation.slope.toFixed(1)} × log₁₀(P) ${plRelation.intercept.toFixed(1)}`,
        padding.left + 10,
        padding.top + 20
      );
    }

    // Draw Cepheid points
    for (const cep of cepheids) {
      const x = logPToX(cep.log_period);
      const y = magToY(cep.absolute_mag);

      // Skip if outside plot area
      if (x < padding.left || x > width - padding.right) continue;
      if (y < padding.top || y > height - padding.bottom) continue;

      const isSelected = selected?.id === cep.id;
      const isHovered = hovered?.id === cep.id;
      const isFeatured = cep.featured;

      ctx.fillStyle = isFeatured
        ? '#FFAA00'
        : isSelected
        ? '#FFFFFF'
        : isHovered
        ? '#FFDD88'
        : 'rgba(255, 215, 0, 0.5)';

      const size = isFeatured ? 5 : isSelected || isHovered ? 6 : 3;

      if (isSelected || isHovered) {
        ctx.shadowColor = RUNG_COLORS.cepheid;
        ctx.shadowBlur = 10;
      }

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label for selected/hovered
      if (isSelected || isHovered) {
        const label = cep.name || `P = ${cep.period_days.toFixed(1)}d`;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y - 15);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px monospace';
        ctx.fillText(`d = ${cep.distance_kpc.toFixed(1)} kpc`, x, y + 20);
      }
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // X-axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';

    for (let logP = 0; logP <= 2; logP += 0.5) {
      const x = logPToX(logP);
      const period = Math.pow(10, logP);
      ctx.fillText(`${period.toFixed(0)}`, x, height - padding.bottom + 15);
    }

    ctx.fillText('Period (days)', width / 2, height - 10);

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let mag = -7; mag <= -1; mag += 1) {
      const y = magToY(mag);
      ctx.fillText(`${mag}`, padding.left - 8, y + 4);
    }

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Absolute Magnitude', 0, 0);
    ctx.restore();

    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Cepheid Period-Luminosity Relation', width / 2, 20);
  }

  // Animation loop
  useEffect(() => {
    let running = true;

    const animate = () => {
      if (!running) return;
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  // Mouse interaction
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    const padding = { left: 70, right: 30, top: 40, bottom: 50 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const logPMin = 0;
    const logPMax = 2;
    const magMin = -7;
    const magMax = -1;

    let closest: Cepheid | null = null;
    let minDist = 15;

    for (const cep of cepheids) {
      const cx = padding.left + ((cep.log_period - logPMin) / (logPMax - logPMin)) * plotWidth;
      const cy = padding.top + ((cep.absolute_mag - magMin) / (magMax - magMin)) * plotHeight;

      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist < minDist) {
        minDist = dist;
        closest = cep;
      }
    }

    setHoveredCepheid(closest);
  }, [cepheids]);

  const handleClick = useCallback(() => {
    if (hoveredCepheid) {
      setSelectedCepheid(hoveredCepheid);
    } else {
      setSelectedCepheid(null);
    }
  }, [hoveredCepheid]);

  return (
    <div ref={containerRef} className='w-full h-full'>
      <canvas
        ref={canvasRef}
        className='w-full h-full cursor-crosshair'
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </div>
  );
}
