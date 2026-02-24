'use client';

import React, { ReactNode } from 'react';

type Layout = 'sidebar' | 'compact' | 'immersive';

interface InteractiveFrameProps {
  children: ReactNode;
  layout?: Layout;
  sidebar?: ReactNode;
  controls?: ReactNode;
  caption?: string;
  maxHeight?: string;
  className?: string;
}

export function InteractiveFrame({
  children,
  layout = 'compact',
  sidebar,
  controls,
  caption,
  maxHeight,
  className = '',
}: InteractiveFrameProps) {
  const heightStyle = maxHeight ? { maxHeight } : undefined;

  if (layout === 'sidebar' && sidebar) {
    return (
      <div className="space-y-4">
        <div className={`border border-black/10 overflow-hidden ${className}`}>
          <div
            className="flex flex-col lg:grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]"
            style={heightStyle}
          >
            {/* Visualization area */}
            <div className="flex-1 min-w-0 overflow-hidden">
              {children}
            </div>
            {/* Sidebar */}
            <div className="border-t lg:border-t-0 lg:border-l border-black/10 bg-black/[0.02] p-4 lg:p-4 space-y-4 overflow-y-auto max-h-[300px] lg:max-h-none">
              {sidebar}
            </div>
          </div>
        </div>
        {caption && (
          <p className="text-xs md:text-sm text-black/50 max-w-2xl">{caption}</p>
        )}
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div className="space-y-4">
        <div className={`border border-black/10 overflow-hidden ${className}`}>
          {controls && (
            <div className="border-b border-black/10 bg-black/[0.02] px-4 py-2">
              {controls}
            </div>
          )}
          <div style={heightStyle} className="overflow-hidden">
            {children}
          </div>
        </div>
        {caption && (
          <p className="text-xs md:text-sm text-black/50 max-w-2xl">{caption}</p>
        )}
      </div>
    );
  }

  // Immersive
  return (
    <div className="space-y-4">
      <div
        className={`relative border border-black/10 overflow-hidden ${className}`}
        style={heightStyle}
      >
        {children}
      </div>
      {caption && (
        <p className="text-xs md:text-sm text-black/50 max-w-2xl">{caption}</p>
      )}
    </div>
  );
}
