'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Supernova, RUNG_COLORS } from '../lib/types';

interface SupernovaVisualizationProps {
  supernovae: Supernova[];
  activeStep: string;
}

export default function SupernovaVisualization({
  supernovae,
  activeStep,
}: SupernovaVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const [selectedSN, setSelectedSN] = useState<Supernova | null>(null);
  const [hoveredSN, setHoveredSN] = useState<Supernova | null>(null);
  const [showStandardized, setShowStandardized] = useState(false);

  useEffect(() => {
    if (activeStep === 'sn-standard' || activeStep === 'sn-hubble') {
      setShowStandardized(true);
    } else {
      setShowStandardized(false);
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

    if (activeStep === 'sn-intro' || activeStep === 'sn-explode') {
      drawSupernovaExplosion(ctx, width, height, timeRef.current);
    } else if (activeStep === 'sn-lightcurve') {
      drawLightCurveComparison(ctx, width, height, supernovae, timeRef.current);
    } else {
      drawHubbleDiagram(ctx, width, height, supernovae, showStandardized, selectedSN, hoveredSN);
    }

    timeRef.current += 0.016;
  }, [supernovae, activeStep, showStandardized, selectedSN, hoveredSN]);

  function drawSupernovaExplosion(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number
  ) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Explosion animation cycle
    const cycle = 8; // seconds
    const t = (time % cycle) / cycle;

    if (t < 0.3) {
      // Pre-explosion: white dwarf accreting
      const phase = t / 0.3;

      // White dwarf
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#AABBFF';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(centerX - 30, centerY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Companion star
      ctx.fillStyle = '#FF8844';
      ctx.shadowColor = '#FF8844';
      ctx.beginPath();
      ctx.arc(centerX + 60, centerY, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Accretion stream
      ctx.strokeStyle = 'rgba(255, 136, 68, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX + 25, centerY);
      ctx.quadraticCurveTo(centerX, centerY - 20, centerX - 15, centerY);
      ctx.stroke();

      // Growing disk
      ctx.fillStyle = `rgba(255, 200, 100, ${0.3 + phase * 0.3})`;
      ctx.beginPath();
      ctx.ellipse(centerX - 30, centerY, 25 + phase * 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('White dwarf accreting matter', centerX, height * 0.85);
      ctx.fillText('from companion star', centerX, height * 0.89);

    } else if (t < 0.4) {
      // Explosion moment
      const phase = (t - 0.3) / 0.1;
      const radius = 20 + phase * 150;
      const brightness = 1 - phase * 0.5;

      // Explosion flash
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness})`);
      gradient.addColorStop(0.3, `rgba(255, 255, 150, ${brightness * 0.8})`);
      gradient.addColorStop(0.6, `rgba(255, 150, 50, ${brightness * 0.4})`);
      gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SUPERNOVA!', centerX, height * 0.15);

    } else {
      // Expanding remnant
      const phase = (t - 0.4) / 0.6;
      const radius = 30 + phase * 200;
      const opacity = Math.max(0, 0.8 - phase * 0.6);

      // Expanding shell
      ctx.strokeStyle = `rgba(255, 100, 100, ${opacity})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner glow
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius * 0.8
      );
      gradient.addColorStop(0, `rgba(255, 200, 100, ${opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 100, 50, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Peak brightness info
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Type Ia: Thermonuclear explosion', centerX, height * 0.85);
      ctx.fillText('Peak luminosity: ~5 billion solar luminosities', centerX, height * 0.89);
    }
  }

  function drawLightCurveComparison(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    supernovae: Supernova[],
    time: number
  ) {
    const padding = { left: 60, right: 30, top: 40, bottom: 50 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Time range: -20 to 60 days
    const dayMin = -20;
    const dayMax = 60;
    const magMin = 10;
    const magMax = 18;

    const dayToX = (day: number) =>
      padding.left + ((day - dayMin) / (dayMax - dayMin)) * plotWidth;
    const magToY = (mag: number) =>
      padding.top + ((mag - magMin) / (magMax - magMin)) * plotHeight;

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let day = -20; day <= 60; day += 20) {
      const x = dayToX(day);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    // Featured SNe with light curves
    const featured = supernovae.filter(sn => sn.featured && sn.lightcurve);

    // Draw multiple light curves to show variation
    const colors = ['#FF6B6B', '#FF8E6B', '#FFAA6B', '#FFCC6B'];

    for (let i = 0; i < Math.min(4, featured.length); i++) {
      const sn = featured[i];
      if (!sn.lightcurve) continue;

      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();

      let started = false;
      for (const pt of sn.lightcurve) {
        const x = dayToX(pt.day);
        const y = magToY(pt.mag);

        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Label
      ctx.fillStyle = colors[i];
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(sn.name || sn.id, dayToX(65), magToY(sn.peak_mag + i * 0.5));
    }

    // Current time marker
    const animDay = ((time * 5) % 80) - 20;
    const markerX = dayToX(animDay);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(markerX, padding.top);
    ctx.lineTo(markerX, height - padding.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Days from peak', width / 2, height - 10);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Apparent Magnitude', 0, 0);
    ctx.restore();

    // Title
    ctx.fillStyle = RUNG_COLORS.supernova;
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Type Ia Supernova Light Curves', width / 2, 20);

    // Note about standardization
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '11px sans-serif';
    ctx.fillText('Different distances → different apparent brightnesses', width / 2, height * 0.92);
  }

  function drawHubbleDiagram(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    supernovae: Supernova[],
    standardized: boolean,
    selected: Supernova | null,
    hovered: Supernova | null
  ) {
    const padding = { left: 70, right: 30, top: 40, bottom: 50 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Redshift vs distance modulus
    const zMin = 0;
    const zMax = 1.5;
    const muMin = 30;
    const muMax = 46;

    const zToX = (z: number) =>
      padding.left + ((z - zMin) / (zMax - zMin)) * plotWidth;
    const muToY = (mu: number) =>
      padding.top + ((mu - muMin) / (muMax - muMin)) * plotHeight;

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let z = 0; z <= 1.5; z += 0.3) {
      const x = zToX(z);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    // Theoretical curve (flat ΛCDM)
    ctx.strokeStyle = 'rgba(255, 107, 107, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let z = 0.001; z <= zMax; z += 0.01) {
      const H0 = 70;
      const c = 299792.458;
      const Omega_m = 0.3;

      // Simplified luminosity distance for flat ΛCDM
      let dL_Mpc: number;
      if (z < 0.3) {
        dL_Mpc = (c / H0) * z * (1 + 0.5 * z * (1 - Omega_m));
      } else {
        dL_Mpc = (c / H0) * z * (1 + z) * (1 - 0.5 * Omega_m * z);
      }

      const mu = 5 * Math.log10(dL_Mpc * 1e6 / 10);
      const x = zToX(z);
      const y = muToY(mu);

      if (z === 0.001) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Plot supernovae
    for (const sn of supernovae) {
      if (sn.redshift > zMax) continue;

      const x = zToX(sn.redshift);
      let mu = sn.mu;

      // Apply stretch/color corrections if standardized
      if (standardized) {
        const alpha = 0.14;
        const beta = 3.1;
        mu = sn.mu - alpha * sn.x1 + beta * sn.c;
      }

      const y = muToY(mu);

      if (y < padding.top || y > height - padding.bottom) continue;

      const isSelected = selected?.id === sn.id;
      const isHovered = hovered?.id === sn.id;
      const isFeatured = sn.featured;

      ctx.fillStyle = isFeatured
        ? '#FF6B6B'
        : isSelected
        ? '#FFFFFF'
        : isHovered
        ? '#FF9999'
        : 'rgba(255, 107, 107, 0.5)';

      const size = isFeatured ? 5 : isSelected || isHovered ? 6 : 3;

      if (isSelected || isHovered) {
        ctx.shadowColor = RUNG_COLORS.supernova;
        ctx.shadowBlur = 10;
      }

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (isSelected || isHovered) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sn.name || `z=${sn.redshift.toFixed(3)}`, x, y - 15);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '9px monospace';
        ctx.fillText(`d = ${sn.distance_Mpc.toFixed(0)} Mpc`, x, y + 18);
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

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';

    for (let z = 0; z <= 1.5; z += 0.3) {
      ctx.fillText(z.toFixed(1), zToX(z), height - padding.bottom + 15);
    }
    ctx.fillText('Redshift (z)', width / 2, height - 10);

    ctx.textAlign = 'right';
    for (let mu = 32; mu <= 46; mu += 4) {
      ctx.fillText(mu.toString(), padding.left - 8, muToY(mu) + 4);
    }

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Distance Modulus (μ)', 0, 0);
    ctx.restore();

    // Title
    ctx.fillStyle = RUNG_COLORS.supernova;
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      standardized ? 'Standardized Type Ia Hubble Diagram' : 'Type Ia Supernova Hubble Diagram',
      width / 2,
      20
    );

    // Standardization toggle hint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px sans-serif';
    ctx.fillText(
      standardized
        ? 'Stretch and color corrections applied'
        : 'Raw measurements (scatter from intrinsic variation)',
      width / 2,
      35
    );
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

    const zMin = 0;
    const zMax = 1.5;
    const muMin = 30;
    const muMax = 46;

    let closest: Supernova | null = null;
    let minDist = 15;

    for (const sn of supernovae) {
      if (sn.redshift > zMax) continue;

      const cx = padding.left + ((sn.redshift - zMin) / (zMax - zMin)) * plotWidth;
      const cy = padding.top + ((sn.mu - muMin) / (muMax - muMin)) * plotHeight;

      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist < minDist) {
        minDist = dist;
        closest = sn;
      }
    }

    setHoveredSN(closest);
  }, [supernovae]);

  const handleClick = useCallback(() => {
    if (hoveredSN) {
      setSelectedSN(hoveredSN);
    } else {
      setSelectedSN(null);
    }
  }, [hoveredSN]);

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
