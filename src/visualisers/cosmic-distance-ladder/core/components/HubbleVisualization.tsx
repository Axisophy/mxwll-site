'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { HubbleDiagram, RedshiftSpectrum, RUNG_COLORS } from '../lib/types';

interface HubbleVisualizationProps {
  hubbleData: HubbleDiagram;
  spectrumData: RedshiftSpectrum;
  activeStep: string;
}

export default function HubbleVisualization({
  hubbleData,
  spectrumData,
  activeStep,
}: HubbleVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const [showTension, setShowTension] = useState(false);
  const [animatedZ, setAnimatedZ] = useState(0);

  useEffect(() => {
    if (activeStep === 'hubble-tension') {
      setShowTension(true);
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

    if (activeStep === 'hubble-redshift' || activeStep === 'hubble-spectrum') {
      drawRedshiftSpectrum(ctx, width, height, spectrumData, timeRef.current);
    } else if (activeStep === 'hubble-law') {
      drawHubbleLaw(ctx, width, height, hubbleData, timeRef.current);
    } else if (activeStep === 'hubble-tension') {
      drawHubbleTension(ctx, width, height, hubbleData, timeRef.current);
    } else {
      drawCosmicExpansion(ctx, width, height, timeRef.current);
    }

    timeRef.current += 0.016;
  }, [hubbleData, spectrumData, activeStep]);

  function drawRedshiftSpectrum(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: RedshiftSpectrum,
    time: number
  ) {
    const padding = { left: 60, right: 30, top: 60, bottom: 50 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Animate redshift
    const z = (Math.sin(time * 0.3) + 1) / 2 * 0.1; // 0 to 0.1

    // Wavelength range
    const lambdaMin = 3500;
    const lambdaMax = 7500;

    const lambdaToX = (lambda: number) =>
      padding.left + ((lambda - lambdaMin) / (lambdaMax - lambdaMin)) * plotWidth;

    // Draw wavelength color gradient background
    for (let x = padding.left; x < width - padding.right; x++) {
      const lambda = lambdaMin + ((x - padding.left) / plotWidth) * (lambdaMax - lambdaMin);
      const color = wavelengthToColor(lambda);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(x, padding.top, 1, plotHeight);
    }
    ctx.globalAlpha = 1;

    // Draw rest-frame spectrum
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    const spectrum = data.spectra['z_0_00'];
    if (spectrum) {
      for (let i = 0; i < spectrum.wavelengths.length; i++) {
        const x = lambdaToX(spectrum.wavelengths[i]);
        const y = padding.top + plotHeight - (spectrum.flux[i] / 150) * plotHeight * 0.8;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    }
    ctx.stroke();

    // Draw redshifted spectrum
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.beginPath();

    if (spectrum) {
      for (let i = 0; i < spectrum.wavelengths.length; i++) {
        const observedLambda = spectrum.wavelengths[i] * (1 + z);
        const x = lambdaToX(observedLambda);
        const y = padding.top + plotHeight - (spectrum.flux[i] / 150) * plotHeight * 0.8;

        if (x < padding.left || x > width - padding.right) continue;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    }
    ctx.stroke();

    // Draw spectral line markers
    const keyLines = [
      { name: 'Hα', rest: 6563, color: '#FF6B6B' },
      { name: 'Hβ', rest: 4861, color: '#6B9FFF' },
      { name: '[O III]', rest: 5007, color: '#6BFF6B' },
      { name: 'Ca K', rest: 3934, color: '#BB6BFF' },
    ];

    for (const line of keyLines) {
      const restX = lambdaToX(line.rest);
      const obsX = lambdaToX(line.rest * (1 + z));

      // Rest position (dashed)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(restX, padding.top);
      ctx.lineTo(restX, height - padding.bottom);
      ctx.stroke();

      // Observed position (solid)
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(obsX, padding.top);
      ctx.lineTo(obsX, height - padding.bottom);
      ctx.stroke();

      // Arrow showing shift
      if (z > 0.01) {
        ctx.fillStyle = line.color;
        ctx.beginPath();
        ctx.moveTo(restX, padding.top + 20);
        ctx.lineTo(obsX - 5, padding.top + 20);
        ctx.lineTo(obsX - 5, padding.top + 15);
        ctx.lineTo(obsX, padding.top + 20);
        ctx.lineTo(obsX - 5, padding.top + 25);
        ctx.lineTo(obsX - 5, padding.top + 20);
        ctx.fill();
      }

      // Label
      ctx.fillStyle = line.color;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(line.name, obsX, padding.top - 10);
    }
    ctx.setLineDash([]);

    // Axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';

    for (let lambda = 4000; lambda <= 7000; lambda += 1000) {
      ctx.fillText(`${lambda}`, lambdaToX(lambda), height - padding.bottom + 15);
    }
    ctx.fillText('Wavelength (Å)', width / 2, height - 10);

    // Redshift display
    ctx.fillStyle = RUNG_COLORS.hubble;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`z = ${z.toFixed(4)}`, padding.left, 30);

    const velocity = z * 299792;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px monospace';
    ctx.fillText(`v = ${velocity.toFixed(0)} km/s`, padding.left, 48);

    // Title
    ctx.fillStyle = RUNG_COLORS.hubble;
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Spectral Lines Shift to Red as Galaxy Recedes', width / 2, height - 35);
  }

  function drawHubbleLaw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: HubbleDiagram,
    time: number
  ) {
    const padding = { left: 80, right: 30, top: 40, bottom: 50 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Velocity vs Distance (classic Hubble diagram)
    const dMin = 0;
    const dMax = 500; // Mpc
    const vMin = 0;
    const vMax = 35000; // km/s

    const dToX = (d: number) =>
      padding.left + ((d - dMin) / (dMax - dMin)) * plotWidth;
    const vToY = (v: number) =>
      height - padding.bottom - ((v - vMin) / (vMax - vMin)) * plotHeight;

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let d = 0; d <= 500; d += 100) {
      const x = dToX(d);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    for (let v = 0; v <= 35000; v += 10000) {
      const y = vToY(v);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw Hubble relation line (H0 = 70)
    ctx.strokeStyle = RUNG_COLORS.hubble;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(dToX(0), vToY(0));
    ctx.lineTo(dToX(500), vToY(500 * 70));
    ctx.stroke();

    // Draw observed data points
    for (const pt of data.observations) {
      const x = dToX(pt.d_Mpc);
      const y = vToY(pt.v);

      if (x < padding.left || x > width - padding.right) continue;
      if (y < padding.top || y > height - padding.bottom) continue;

      ctx.fillStyle = 'rgba(155, 89, 182, 0.7)';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Error bars
      if (pt.d_err) {
        ctx.strokeStyle = 'rgba(155, 89, 182, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dToX(pt.d_Mpc - pt.d_err), y);
        ctx.lineTo(dToX(pt.d_Mpc + pt.d_err), y);
        ctx.stroke();
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

    for (let d = 0; d <= 500; d += 100) {
      ctx.fillText(`${d}`, dToX(d), height - padding.bottom + 15);
    }
    ctx.fillText('Distance (Mpc)', width / 2, height - 10);

    ctx.textAlign = 'right';
    for (let v = 0; v <= 35000; v += 10000) {
      ctx.fillText(`${v / 1000}k`, padding.left - 8, vToY(v) + 4);
    }

    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Recession Velocity (km/s)', 0, 0);
    ctx.restore();

    // Hubble constant annotation
    ctx.fillStyle = RUNG_COLORS.hubble;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('v = H₀ × d', width - padding.right - 120, padding.top + 30);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '13px monospace';
    ctx.fillText('H₀ ≈ 70 km/s/Mpc', width - padding.right - 120, padding.top + 50);

    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Hubble\'s Law: The Universe is Expanding', width / 2, 20);
  }

  function drawHubbleTension(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: HubbleDiagram,
    time: number
  ) {
    const centerY = height / 2;

    // Animate the reveal
    const revealProgress = Math.min(1, time / 3);

    // Draw two H0 measurements
    const barHeight = 40;
    const barMaxWidth = width * 0.6;
    const leftMargin = width * 0.25;

    // Scale: H0 from 60 to 80
    const H0Min = 60;
    const H0Max = 80;
    const H0ToWidth = (H0: number) =>
      ((H0 - H0Min) / (H0Max - H0Min)) * barMaxWidth;

    // SH0ES measurement (local, distance ladder)
    const shoesY = centerY - 60;
    const shoesWidth = H0ToWidth(data.H0_shoes);
    const shoesErrWidth = H0ToWidth(data.H0_shoes + data.H0_shoes_err) - shoesWidth;

    // Planck measurement (CMB, early universe)
    const planckY = centerY + 60;
    const planckWidth = H0ToWidth(data.H0_planck);
    const planckErrWidth = H0ToWidth(data.H0_planck + data.H0_planck_err) - planckWidth;

    // Animate widths
    const animShoesWidth = shoesWidth * revealProgress;
    const animPlanckWidth = planckWidth * revealProgress;

    // Draw bars
    // SH0ES
    ctx.fillStyle = RUNG_COLORS.supernova;
    ctx.fillRect(leftMargin, shoesY - barHeight / 2, animShoesWidth, barHeight);

    // Error range
    if (revealProgress > 0.5) {
      ctx.fillStyle = 'rgba(255, 107, 107, 0.3)';
      ctx.fillRect(
        leftMargin + shoesWidth - shoesErrWidth,
        shoesY - barHeight / 2,
        shoesErrWidth * 2,
        barHeight
      );
    }

    // Planck
    ctx.fillStyle = RUNG_COLORS.hubble;
    ctx.fillRect(leftMargin, planckY - barHeight / 2, animPlanckWidth, barHeight);

    // Error range
    if (revealProgress > 0.5) {
      ctx.fillStyle = 'rgba(155, 89, 182, 0.3)';
      ctx.fillRect(
        leftMargin + planckWidth - planckErrWidth,
        planckY - barHeight / 2,
        planckErrWidth * 2,
        barHeight
      );
    }

    // Labels
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('SH0ES', leftMargin - 15, shoesY + 5);
    ctx.fillText('(Distance Ladder)', leftMargin - 15, shoesY + 20);

    ctx.fillText('Planck', leftMargin - 15, planckY + 5);
    ctx.fillText('(CMB)', leftMargin - 15, planckY + 20);

    // Values
    if (revealProgress > 0.3) {
      ctx.fillStyle = RUNG_COLORS.supernova;
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        `${data.H0_shoes.toFixed(1)} ± ${data.H0_shoes_err.toFixed(1)}`,
        leftMargin + shoesWidth + 15,
        shoesY + 6
      );

      ctx.fillStyle = RUNG_COLORS.hubble;
      ctx.fillText(
        `${data.H0_planck.toFixed(1)} ± ${data.H0_planck_err.toFixed(1)}`,
        leftMargin + planckWidth + 15,
        planckY + 6
      );
    }

    // Scale
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftMargin, centerY + 120);
    ctx.lineTo(leftMargin + barMaxWidth, centerY + 120);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    for (let H0 = 60; H0 <= 80; H0 += 5) {
      const x = leftMargin + H0ToWidth(H0);
      ctx.fillText(`${H0}`, x, centerY + 135);

      ctx.beginPath();
      ctx.moveTo(x, centerY + 115);
      ctx.lineTo(x, centerY + 125);
      ctx.stroke();
    }
    ctx.fillText('H₀ (km/s/Mpc)', leftMargin + barMaxWidth / 2, centerY + 155);

    // Tension indicator
    if (revealProgress > 0.7) {
      const tensionOpacity = (revealProgress - 0.7) / 0.3;

      // Gap highlight
      const gapLeft = leftMargin + planckWidth;
      const gapRight = leftMargin + shoesWidth;

      ctx.fillStyle = `rgba(255, 204, 0, ${tensionOpacity * 0.2})`;
      ctx.fillRect(gapLeft, centerY - 80, gapRight - gapLeft, 160);

      // Tension label
      ctx.fillStyle = `rgba(255, 204, 0, ${tensionOpacity})`;
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('THE HUBBLE TENSION', width / 2, 50);

      ctx.fillStyle = `rgba(255, 255, 255, ${tensionOpacity * 0.8})`;
      ctx.font = '14px sans-serif';
      ctx.fillText(`${data.tension_sigma.toFixed(1)}σ discrepancy`, width / 2, 75);

      // Question
      ctx.fillStyle = `rgba(255, 255, 255, ${tensionOpacity * 0.6})`;
      ctx.font = '13px sans-serif';
      ctx.fillText('Either our distance measurements are wrong...', width / 2, height - 50);
      ctx.fillText('or our understanding of cosmology is incomplete.', width / 2, height - 30);
    }

    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Two ways to measure the expansion rate:', 20, 25);
  }

  function drawCosmicExpansion(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number
  ) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Animate expansion
    const expansion = 1 + Math.sin(time * 0.5) * 0.3;

    // Draw expanding grid of galaxies
    const gridSize = 80 * expansion;
    const numGalaxies = 7;

    for (let i = -numGalaxies; i <= numGalaxies; i++) {
      for (let j = -numGalaxies; j <= numGalaxies; j++) {
        if (i === 0 && j === 0) continue; // Skip center

        const x = centerX + i * gridSize;
        const y = centerY + j * gridSize;

        if (x < 0 || x > width || y < 0 || y > height) continue;

        // Distance from center
        const dist = Math.sqrt(i * i + j * j);
        const alpha = Math.max(0.2, 1 - dist / numGalaxies);

        // Galaxy (small spiral)
        ctx.fillStyle = `rgba(200, 180, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 3 + (1 / dist) * 2, 0, Math.PI * 2);
        ctx.fill();

        // Recession arrow (farther = longer)
        if (dist > 1 && expansion > 1.1) {
          const arrowLen = dist * 3 * (expansion - 1) * 3;
          const angle = Math.atan2(j, i);

          ctx.strokeStyle = `rgba(255, 100, 100, ${alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(angle) * arrowLen,
            y + Math.sin(angle) * arrowLen
          );
          ctx.stroke();
        }
      }
    }

    // Our galaxy at center
    ctx.fillStyle = '#FFCC00';
    ctx.shadowColor = '#FFCC00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Us', centerX, centerY + 25);

    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('The Universe is Expanding', width / 2, 30);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px sans-serif';
    ctx.fillText('Farther galaxies recede faster', width / 2, 50);
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

  return (
    <div ref={containerRef} className='w-full h-full'>
      <canvas
        ref={canvasRef}
        className='w-full h-full'
      />
    </div>
  );
}

// Convert wavelength (nm) to RGB color
function wavelengthToColor(lambda: number): string {
  // Convert Angstroms to nm
  const nm = lambda / 10;

  let r = 0, g = 0, b = 0;

  if (nm >= 380 && nm < 440) {
    r = (440 - nm) / (440 - 380);
    b = 1;
  } else if (nm >= 440 && nm < 490) {
    g = (nm - 440) / (490 - 440);
    b = 1;
  } else if (nm >= 490 && nm < 510) {
    g = 1;
    b = (510 - nm) / (510 - 490);
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / (580 - 510);
    g = 1;
  } else if (nm >= 580 && nm < 645) {
    r = 1;
    g = (645 - nm) / (645 - 580);
  } else if (nm >= 645 && nm <= 750) {
    r = 1;
  }

  // Intensity adjustment for visibility
  let factor = 0.3;
  if (nm >= 380 && nm < 420) {
    factor = 0.3 + 0.7 * (nm - 380) / (420 - 380);
  } else if (nm >= 420 && nm <= 700) {
    factor = 1;
  } else if (nm > 700 && nm <= 750) {
    factor = 0.3 + 0.7 * (750 - nm) / (750 - 700);
  }

  r = Math.round(255 * r * factor);
  g = Math.round(255 * g * factor);
  b = Math.round(255 * b * factor);

  return `rgb(${r}, ${g}, ${b})`;
}
