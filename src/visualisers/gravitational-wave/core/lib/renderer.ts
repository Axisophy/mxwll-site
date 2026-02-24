import { Panel, Stage, SpectrogramData, OrbitalData, EventMetadata, COLOURS, TIME_RANGE } from './types';
import { findNearestIndex } from './mock-data';

/**
 * Compute panel layout based on current stage
 */
export function computePanelLayout(stage: Stage, W: number, H: number): Panel[] {
  const panels: Panel[] = [];
  const pad = 12;
  const headerHeight = 56;
  const scrubberHeight = 56;
  const usableHeight = H - headerHeight - scrubberHeight;

  switch (stage) {
    case 1: {
      // Two tall waveform panels
      const panelH = (usableHeight - pad) / 2;
      panels.push({ id: 'h1', x: pad, y: headerHeight, width: W - pad * 2, height: panelH, opacity: 1 });
      panels.push({ id: 'l1', x: pad, y: headerHeight + panelH + pad, width: W - pad * 2, height: panelH, opacity: 1 });
      break;
    }
    case 2: {
      // Three panels: H1, L1, template
      const panelH = (usableHeight - pad * 2) / 3;
      panels.push({ id: 'h1', x: pad, y: headerHeight, width: W - pad * 2, height: panelH, opacity: 1 });
      panels.push({ id: 'l1', x: pad, y: headerHeight + panelH + pad, width: W - pad * 2, height: panelH, opacity: 1 });
      panels.push({ id: 'template', x: pad, y: headerHeight + (panelH + pad) * 2, width: W - pad * 2, height: panelH, opacity: 1 });
      break;
    }
    case 3: {
      // Three panels: H1+overlay, L1+overlay, spectrogram
      const panelH = (usableHeight - pad * 2) / 3;
      panels.push({ id: 'h1', x: pad, y: headerHeight, width: W - pad * 2, height: panelH, opacity: 1 });
      panels.push({ id: 'l1', x: pad, y: headerHeight + panelH + pad, width: W - pad * 2, height: panelH, opacity: 1 });
      panels.push({ id: 'spectrogram', x: pad, y: headerHeight + (panelH + pad) * 2, width: W - pad * 2, height: panelH, opacity: 1 });
      break;
    }
    case 4: {
      // Orbital diagram (left), waveforms + spectrogram (right, stacked)
      const orbitalSize = Math.min(usableHeight, W * 0.35);
      const rightX = pad + orbitalSize + pad;
      const rightW = W - rightX - pad;
      const panelH = (usableHeight - pad * 2) / 3;

      panels.push({ id: 'orbital', x: pad, y: headerHeight, width: orbitalSize, height: usableHeight, opacity: 1 });
      panels.push({ id: 'h1', x: rightX, y: headerHeight, width: rightW, height: panelH, opacity: 1 });
      panels.push({ id: 'l1', x: rightX, y: headerHeight + panelH + pad, width: rightW, height: panelH, opacity: 1 });
      panels.push({ id: 'spectrogram', x: rightX, y: headerHeight + (panelH + pad) * 2, width: rightW, height: panelH, opacity: 1 });
      break;
    }
  }
  return panels;
}

/**
 * Draw a waveform panel
 */
export function drawWaveform(
  ctx: CanvasRenderingContext2D,
  panel: Panel,
  times: number[],
  strain: number[],
  colour: string,
  playheadTime: number,
  options?: {
    overlay?: { times: number[], strain: number[], colour: string, offset?: number },
    label?: string,
    showPlayhead?: boolean,
  }
) {
  const { x, y, width, height } = panel;

  // Background
  ctx.fillStyle = COLOURS.PANEL_BG;
  ctx.fillRect(x, y, width, height);

  // Border
  ctx.strokeStyle = COLOURS.PANEL_BORDER;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(x, y, width, height);

  // Zero line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x, y + height / 2);
  ctx.lineTo(x + width, y + height / 2);
  ctx.stroke();

  // Label
  if (options?.label) {
    ctx.font = '9px monospace';
    ctx.fillStyle = COLOURS.TEXT_SECONDARY;
    ctx.fillText(options.label, x + 8, y + 14);
  }

  // Map time range to pixel range
  const tMin = TIME_RANGE[0];
  const tMax = TIME_RANGE[1];
  const mapX = (t: number) => x + ((t - tMin) / (tMax - tMin)) * width;
  const mapY = (v: number) => y + height / 2 - v * (height * 0.38);

  // Draw main waveform
  ctx.strokeStyle = colour;
  ctx.lineWidth = 1;
  ctx.globalAlpha = panel.opacity * 0.7;
  ctx.beginPath();
  for (let i = 0; i < times.length; i++) {
    const px = mapX(times[i]);
    const py = mapY(strain[i]);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Draw overlay (template on noisy data)
  if (options?.overlay) {
    const ov = options.overlay;
    const offset = ov.offset || 0;
    ctx.strokeStyle = ov.colour;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = panel.opacity * 0.9;
    ctx.beginPath();
    for (let i = 0; i < ov.times.length; i++) {
      const px = mapX(ov.times[i] + offset);
      const py = mapY(ov.strain[i]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Playhead line
  if (options?.showPlayhead && playheadTime >= tMin && playheadTime <= tMax) {
    const px = mapX(playheadTime);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(px, y);
    ctx.lineTo(px, y + height);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

/**
 * Draw spectrogram panel
 */
export function drawSpectrogram(
  ctx: CanvasRenderingContext2D,
  panel: Panel,
  specData: SpectrogramData,
  playheadTime: number,
) {
  const { x, y, width, height } = panel;

  // Background
  ctx.fillStyle = COLOURS.PANEL_BG;
  ctx.fillRect(x, y, width, height);

  // Label
  ctx.font = '9px monospace';
  ctx.fillStyle = COLOURS.TEXT_SECONDARY;
  ctx.fillText('Time-Frequency Map (Q-Transform)', x + 8, y + 14);

  // Draw spectrogram as pixel grid
  const tBins = specData.timeBins;
  const fBins = specData.freqBins;
  const labelHeight = 20;
  const cellW = width / tBins;
  const cellH = (height - labelHeight) / fBins;

  for (let ti = 0; ti < tBins; ti++) {
    for (let fi = 0; fi < fBins; fi++) {
      const power = specData.data[ti][fi];
      if (power < 0.015) continue;

      // Colour map: black -> deep blue -> electric blue -> white
      const r = Math.floor(power * power * 255);
      const g = Math.floor(power * 180);
      const b = Math.floor(Math.sqrt(power) * 255);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.globalAlpha = panel.opacity;
      ctx.fillRect(
        x + ti * cellW,
        y + labelHeight + (fBins - 1 - fi) * cellH,
        cellW + 0.5,
        cellH + 0.5,
      );
    }
  }
  ctx.globalAlpha = 1;

  // Frequency axis labels
  ctx.font = '8px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillText(`${Math.round(specData.freqRange[1])} Hz`, x + 2, y + 28);
  ctx.fillText(`${Math.round(specData.freqRange[0])} Hz`, x + 2, y + height - 4);

  // Playhead
  const tFrac = (playheadTime - specData.timeRange[0]) /
    (specData.timeRange[1] - specData.timeRange[0]);
  if (tFrac >= 0 && tFrac <= 1) {
    const px = x + tFrac * width;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(px, y);
    ctx.lineTo(px, y + height);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

/**
 * Draw orbital diagram panel
 */
export function drawOrbitalDiagram(
  ctx: CanvasRenderingContext2D,
  panel: Panel,
  orbital: OrbitalData,
  playheadTime: number,
  event: EventMetadata,
) {
  const { x, y, width, height } = panel;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const maxR = Math.min(width, height) * 0.32;

  // Background
  ctx.fillStyle = COLOURS.PANEL_BG;
  ctx.fillRect(x, y, width, height);

  // Find current orbital state from playhead time
  const tIdx = findNearestIndex(orbital.times, playheadTime);
  const separation = orbital.separation[tIdx];
  const freq = orbital.frequency[tIdx];

  // Orbital phase (integrated from frequency)
  let phase = 0;
  for (let i = 0; i <= tIdx; i++) {
    const dt = i > 0 ? orbital.times[i] - orbital.times[i - 1] : 0;
    phase += 2 * Math.PI * orbital.frequency[i] * dt;
  }

  // Map separation to radius (log scale looks better)
  const r = Math.max(8, Math.log(separation + 1) / Math.log(26) * maxR);

  // Draw orbital trail (fading path)
  ctx.strokeStyle = COLOURS.TRAIL;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = Math.max(0, tIdx - 80); i <= tIdx; i++) {
    const sep = orbital.separation[i];
    const rr = Math.max(8, Math.log(sep + 1) / Math.log(26) * maxR);
    let ph = 0;
    for (let j = 0; j <= i; j++) {
      const dt = j > 0 ? orbital.times[j] - orbital.times[j - 1] : 0;
      ph += 2 * Math.PI * orbital.frequency[j] * dt;
    }
    const bx = cx + rr * Math.cos(ph);
    const by = cy + rr * Math.sin(ph);
    if (i === Math.max(0, tIdx - 80)) ctx.moveTo(bx, by);
    else ctx.lineTo(bx, by);
  }
  ctx.stroke();

  // Mass fractions
  const m1Frac = event.mass1 / (event.mass1 + event.mass2);
  const m2Frac = 1 - m1Frac;

  // BH positions
  const bh1x = cx + r * m2Frac * Math.cos(phase);
  const bh1y = cy + r * m2Frac * Math.sin(phase);
  const bh1r = 5 + m1Frac * 7;

  const bh2x = cx - r * m1Frac * Math.cos(phase);
  const bh2y = cy - r * m1Frac * Math.sin(phase);
  const bh2r = 5 + m2Frac * 7;

  // Draw gravitational wave ripples (post-merger)
  if (playheadTime > -0.008) {
    const ringAge = (playheadTime + 0.008) * 1500;
    for (let i = 0; i < 4; i++) {
      const ringR = (ringAge + i * 25) % (maxR * 1.8);
      if (ringR > maxR * 1.8) continue;
      ctx.strokeStyle = `rgba(100, 140, 255, ${0.08 * (1 - ringR / (maxR * 1.8))})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Draw BH1 (larger)
  const grad1 = ctx.createRadialGradient(bh1x, bh1y, 0, bh1x, bh1y, bh1r * 2);
  grad1.addColorStop(0, 'rgba(20, 20, 30, 1)');
  grad1.addColorStop(0.5, 'rgba(40, 50, 80, 0.7)');
  grad1.addColorStop(1, 'rgba(40, 50, 80, 0)');
  ctx.fillStyle = grad1;
  ctx.beginPath();
  ctx.arc(bh1x, bh1y, bh1r * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLOURS.BH_FILL;
  ctx.beginPath();
  ctx.arc(bh1x, bh1y, bh1r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLOURS.BH_GLOW;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw BH2 (smaller)
  const grad2 = ctx.createRadialGradient(bh2x, bh2y, 0, bh2x, bh2y, bh2r * 2);
  grad2.addColorStop(0, 'rgba(20, 20, 30, 1)');
  grad2.addColorStop(0.5, 'rgba(40, 50, 80, 0.7)');
  grad2.addColorStop(1, 'rgba(40, 50, 80, 0)');
  ctx.fillStyle = grad2;
  ctx.beginPath();
  ctx.arc(bh2x, bh2y, bh2r * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLOURS.BH_FILL;
  ctx.beginPath();
  ctx.arc(bh2x, bh2y, bh2r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLOURS.BH_GLOW;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Mass labels
  ctx.font = '8px monospace';
  ctx.fillStyle = COLOURS.TEXT_SECONDARY;
  ctx.fillText(`${event.mass1.toFixed(0)} M\u2609`, bh1x + bh1r + 4, bh1y + 3);
  ctx.fillText(`${event.mass2.toFixed(0)} M\u2609`, bh2x + bh2r + 4, bh2y + 3);

  // Separation / merged indicator
  ctx.fillStyle = COLOURS.TEXT_DIM;
  ctx.font = '9px monospace';
  const sepText = separation < 1.5 ? 'MERGED' : `${separation.toFixed(0)} Rs`;
  ctx.fillText(sepText, x + 8, y + height - 8);

  // Frequency
  ctx.fillText(`${freq.toFixed(0)} Hz`, x + 8, y + height - 20);
}
