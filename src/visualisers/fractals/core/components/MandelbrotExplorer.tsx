'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import { mandelbrotIteration } from '../lib/fractal-math';
import { COLORMAPS, COLORMAP_NAMES, ColorMap } from '../lib/colormaps';

interface ViewState {
  centerX: number;
  centerY: number;
  zoom: number;
}

const INITIAL_VIEW: ViewState = {
  centerX: -0.5,
  centerY: 0,
  zoom: 1.5,
};

export function MandelbrotExplorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState<ViewState>(INITIAL_VIEW);
  const [maxIter, setMaxIter] = useState(100);
  const [colormap, setColormap] = useState<string>('inferno');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isRendering, setIsRendering] = useState(false);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const cmap: ColorMap = COLORMAPS[colormap] || COLORMAPS.inferno;
    const aspectRatio = width / height;

    // Calculate view bounds
    const viewWidth = view.zoom * 2 * aspectRatio;
    const viewHeight = view.zoom * 2;
    const minX = view.centerX - viewWidth / 2;
    const minY = view.centerY - viewHeight / 2;

    // Render in chunks to avoid blocking
    const chunkSize = 50;
    let currentRow = 0;
    const context = ctx;

    function renderChunk() {
      const endRow = Math.min(currentRow + chunkSize, height);

      for (let py = currentRow; py < endRow; py++) {
        for (let px = 0; px < width; px++) {
          const x = minX + (px / width) * viewWidth;
          const y = minY + (py / height) * viewHeight;

          const iter = mandelbrotIteration({ re: x, im: y }, maxIter);
          const idx = (py * width + px) * 4;

          if (iter >= maxIter) {
            // Inside the set - black
            data[idx] = 0;
            data[idx + 1] = 0;
            data[idx + 2] = 0;
            data[idx + 3] = 255;
          } else {
            // Outside - use colormap
            const t = iter / maxIter;
            const [r, g, b] = cmap(t);
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
          }
        }
      }

      currentRow = endRow;

      if (currentRow < height) {
        context.putImageData(imageData, 0, 0);
        requestAnimationFrame(renderChunk);
      } else {
        context.putImageData(imageData, 0, 0);
        setIsRendering(false);
      }
    }

    renderChunk();
  }, [view, maxIter, colormap]);

  useEffect(() => {
    render();
  }, [render]);

  // Handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      render();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [render]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });

    const rect = canvas.getBoundingClientRect();
    const viewWidth = view.zoom * 2 * (rect.width / rect.height);
    const viewHeight = view.zoom * 2;

    setView(prev => ({
      ...prev,
      centerX: prev.centerX - (dx / rect.width) * viewWidth,
      centerY: prev.centerY - (dy / rect.height) * viewHeight,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.2 : 0.8;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;

    const aspectRatio = rect.width / rect.height;
    const viewWidth = view.zoom * 2 * aspectRatio;
    const viewHeight = view.zoom * 2;

    const worldX = view.centerX - viewWidth / 2 + mouseX * viewWidth;
    const worldY = view.centerY - viewHeight / 2 + mouseY * viewHeight;

    const newZoom = view.zoom * zoomFactor;

    const newViewWidth = newZoom * 2 * aspectRatio;
    const newViewHeight = newZoom * 2;

    setView({
      centerX: worldX + (0.5 - mouseX) * newViewWidth,
      centerY: worldY + (0.5 - mouseY) * newViewHeight,
      zoom: newZoom,
    });
  };

  const resetView = () => {
    setView(INITIAL_VIEW);
  };

  const formatCoord = (n: number) => {
    if (Math.abs(n) < 0.0001) return n.toExponential(2);
    return n.toFixed(6);
  };

  const sidebar = (
    <div className='space-y-6'>
      <div>
        <label className='block text-sm text-black/60 mb-2'>Colormap</label>
        <select
          value={colormap}
          onChange={(e) => setColormap(e.target.value)}
          className='w-full px-3 py-2 border border-black/20 bg-transparent focus:border-black focus:outline-none transition-colors text-sm'
        >
          {COLORMAP_NAMES.map(name => (
            <option key={name} value={name}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='block text-sm text-black/60 mb-2'>
          Max iterations: {maxIter}
        </label>
        <input
          type='range'
          min={50}
          max={500}
          step={10}
          value={maxIter}
          onChange={(e) => setMaxIter(parseInt(e.target.value))}
          className='w-full'
        />
        <p className='text-xs text-black/40 mt-1'>
          Higher values reveal more detail at deep zoom
        </p>
      </div>

      <button
        onClick={resetView}
        className='w-full px-4 py-2 border border-black/20 text-sm hover:bg-black hover:text-white transition-colors'
      >
        Reset view
      </button>

      <div className='space-y-2 pt-4 border-t border-black/10'>
        <div className='flex justify-between text-xs'>
          <span className='text-black/40'>Center</span>
          <span className='font-mono'>
            {formatCoord(view.centerX)} {view.centerY >= 0 ? '+' : ''}{formatCoord(view.centerY)}i
          </span>
        </div>
        <div className='flex justify-between text-xs'>
          <span className='text-black/40'>Zoom</span>
          <span className='font-mono'>{(1 / view.zoom).toFixed(1)}x</span>
        </div>
      </div>

      <div className='pt-4 border-t border-black/10'>
        <p className='text-xs text-black/50 leading-relaxed'>
          Click and drag to pan. Scroll to zoom. The black region is the Mandelbrot
          set itself. The colorful boundary contains infinite detail.
        </p>
      </div>

      {isRendering && (
        <div className='text-xs text-black/40'>Rendering...</div>
      )}
    </div>
  );

  return (
    <InteractiveFrame
      layout='sidebar'
      sidebar={sidebar}
      caption='The Mandelbrot set is defined by a simple formula: z = z² + c. Points that stay bounded are in the set (black). The boundary contains infinite complexity.'
    >
      <div className='bg-black w-full h-full min-h-[400px] relative'>
        <canvas
          ref={canvasRef}
          className='w-full h-full cursor-grab active:cursor-grabbing'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>
    </InteractiveFrame>
  );
}
