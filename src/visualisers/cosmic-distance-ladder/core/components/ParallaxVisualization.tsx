'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { ParallaxStar, getStarColor } from '../lib/types';

interface ParallaxVisualizationProps {
  stars: ParallaxStar[];
  activeStep: string;
}

export default function ParallaxVisualization({
  stars,
  activeStep,
}: ParallaxVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  // Interactive state
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedStar, setSelectedStar] = useState<ParallaxStar | null>(null);
  const [hoveredStar, setHoveredStar] = useState<ParallaxStar | null>(null);

  // Animation state
  const timeRef = useRef(0);
  const lastTimeRef = useRef(0);

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

    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate Earth's position in its orbit
    const orbitRadius = 80;
    const earthX = centerX + dragOffset * 0.5;

    // Draw based on active step
    if (activeStep === 'parallax-intro' || activeStep === 'parallax-concept') {
      drawParallaxConcept(ctx, width, height, earthX, centerY, orbitRadius);
    } else if (activeStep === 'parallax-measure') {
      drawParallaxMeasurement(ctx, width, height, earthX, centerY, orbitRadius, timeRef.current);
    } else {
      drawStarField(ctx, width, height, stars, earthX, centerY, selectedStar, hoveredStar);
    }

    // Continue animation
    timeRef.current += 0.016;
  }, [stars, activeStep, dragOffset, selectedStar, hoveredStar]);

  function drawParallaxConcept(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    earthX: number,
    centerY: number,
    orbitRadius: number
  ) {
    const sunX = width / 2;
    const sunY = centerY;

    // Draw Sun
    ctx.fillStyle = '#FFCC00';
    ctx.shadowColor = '#FFCC00';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Earth's orbit
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sunX, sunY, orbitRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Earth at two positions
    const earthY1 = sunY - orbitRadius;
    const earthY2 = sunY + orbitRadius;

    // Earth position 1 (January)
    ctx.fillStyle = '#4488FF';
    ctx.beginPath();
    ctx.arc(sunX, earthY1, 8, 0, Math.PI * 2);
    ctx.fill();

    // Earth position 2 (July)
    ctx.fillStyle = '#4488FF';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(sunX, earthY2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Draw a distant star
    const starX = width * 0.8;
    const starY = centerY;

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(starX, starY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw sight lines from Earth positions to star
    ctx.strokeStyle = 'rgba(0, 170, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(sunX, earthY1);
    ctx.lineTo(starX, starY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(sunX, earthY2);
    ctx.lineTo(starX, starY);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw parallax angle arc
    const angleStart = Math.atan2(earthY1 - starY, sunX - starX);
    const angleEnd = Math.atan2(earthY2 - starY, sunX - starX);

    ctx.strokeStyle = '#FFCC00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(starX, starY, 40, angleStart, angleEnd);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#FFCC00';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('p', starX - 55, starY);

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sun', sunX, sunY + 35);
    ctx.fillText('Jan', sunX, earthY1 - 15);
    ctx.fillText('Jul', sunX, earthY2 + 20);
    ctx.fillText('Nearby Star', starX, starY + 20);

    // Distance formula
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('d (parsecs) = 1 / p (arcseconds)', width / 2, height - 30);
  }

  function drawParallaxMeasurement(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    earthX: number,
    centerY: number,
    orbitRadius: number,
    time: number
  ) {
    const sunX = width / 2;
    const sunY = centerY;

    // Animate Earth around orbit
    const angle = time * 0.5;
    const earthPosX = sunX + Math.sin(angle) * orbitRadius;
    const earthPosY = sunY + Math.cos(angle) * orbitRadius;

    // Draw Sun
    ctx.fillStyle = '#FFCC00';
    ctx.shadowColor = '#FFCC00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw orbit
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sunX, sunY, orbitRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Earth
    ctx.fillStyle = '#4488FF';
    ctx.shadowColor = '#4488FF';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(earthPosX, earthPosY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw multiple stars at different distances
    const starDistances = [
      { x: width * 0.75, y: centerY - 100, parallax: 0.5, name: 'Near star' },
      { x: width * 0.85, y: centerY + 50, parallax: 0.2, name: 'Medium star' },
      { x: width * 0.92, y: centerY - 30, parallax: 0.05, name: 'Far star' },
    ];

    for (const star of starDistances) {
      // Calculate apparent shift due to parallax
      const shift = star.parallax * Math.sin(angle) * 50;

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(star.x, star.y + shift, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw sight line
      ctx.strokeStyle = 'rgba(0, 170, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(earthPosX, earthPosY);
      ctx.lineTo(star.x, star.y + shift);
      ctx.stroke();

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${star.parallax}"`, star.x + 10, star.y + shift);
    }

    // Time indicator
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = Math.floor((angle / (Math.PI * 2) * 12) % 12);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(months[monthIndex], 20, 30);
  }

  function drawStarField(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    stars: ParallaxStar[],
    earthX: number,
    centerY: number,
    selected: ParallaxStar | null,
    hovered: ParallaxStar | null
  ) {
    // Draw all stars scaled by distance
    const maxDistance = Math.max(...stars.map(s => s.distance_pc));
    const padding = 60;

    for (const star of stars) {
      // Position based on RA/Dec (simplified projection)
      const x = padding + (star.ra / 360) * (width - 2 * padding);
      const y = padding + ((90 - star.dec) / 180) * (height - 2 * padding);

      // Size based on magnitude (brighter = bigger)
      const size = Math.max(1, 6 - star.mag_g * 0.3);

      // Color based on B-V index
      const color = getStarColor(star.color_bp_rp);

      const isSelected = selected?.id === star.id;
      const isHovered = hovered?.id === star.id;

      // Calculate parallax shift based on drag
      const parallaxShift = (star.parallax_mas / 1000) * dragOffset * 0.1;

      ctx.fillStyle = color;

      if (isSelected || isHovered) {
        ctx.shadowColor = isSelected ? '#FFCC00' : '#00AAFF';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x + parallaxShift, y, size + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw info
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(star.name, x, y - size - 10);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px monospace';
        ctx.fillText(`${star.distance_ly.toFixed(1)} ly`, x, y - size - 25);
        ctx.fillText(`parallax: ${star.parallax_mas.toFixed(1)} mas`, x, y + size + 15);
      } else {
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(x + parallaxShift, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Draw drag instruction
    if (dragOffset === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Drag left/right to simulate Earth\'s orbital motion', width / 2, height - 20);
    }

    // Distance scale
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Parallax Stars: 0 - 20 light years', 20, 25);
  }

  // Animation loop
  useEffect(() => {
    let running = true;

    const animate = (timestamp: number) => {
      if (!running) return;

      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setDragOffset(prev => {
        const newOffset = prev + e.movementX;
        return Math.max(-200, Math.min(200, newOffset));
      });
    }

    // Check for star hover
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const padding = 60;
    const width = rect.width;
    const height = rect.height;

    let closest: ParallaxStar | null = null;
    let minDist = 20;

    for (const star of stars) {
      const sx = padding + (star.ra / 360) * (width - 2 * padding);
      const sy = padding + ((90 - star.dec) / 180) * (height - 2 * padding);
      const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);

      if (dist < minDist) {
        minDist = dist;
        closest = star;
      }
    }

    setHoveredStar(closest);
  }, [isDragging, stars]);

  const handleClick = useCallback(() => {
    if (hoveredStar) {
      setSelectedStar(hoveredStar);
    } else {
      setSelectedStar(null);
    }
  }, [hoveredStar]);

  return (
    <div ref={containerRef} className='w-full h-full'>
      <canvas
        ref={canvasRef}
        className='w-full h-full cursor-grab active:cursor-grabbing'
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </div>
  );
}
