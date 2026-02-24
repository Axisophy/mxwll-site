'use client';

import React from 'react';

interface Props {
  data: { degree: number; count: number }[];
  width: number;
  height: number;
  color?: string;
  logScale?: boolean;
}

export function DegreeHistogram({
  data,
  width,
  height,
  color = '#0055FF',
  logScale = false,
}: Props) {
  if (data.length === 0) return null;

  const maxCount = Math.max(...data.map(d => d.count));
  const maxDegree = Math.max(...data.map(d => d.degree));

  const padding = { top: 10, right: 10, bottom: 25, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const barWidth = Math.max(2, chartWidth / (maxDegree + 1) - 1);

  const getY = (count: number) => {
    if (logScale && count > 0) {
      return chartHeight - (Math.log10(count + 1) / Math.log10(maxCount + 1)) * chartHeight;
    }
    return chartHeight - (count / maxCount) * chartHeight;
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className='w-full h-full'>
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {/* Bars */}
        {data.map(d => (
          <rect
            key={d.degree}
            x={(d.degree / (maxDegree + 1)) * chartWidth}
            y={getY(d.count)}
            width={barWidth}
            height={chartHeight - getY(d.count)}
            fill={color}
            opacity={0.7}
          />
        ))}

        {/* X axis */}
        <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke='#ccc' />
        <text x={chartWidth / 2} y={chartHeight + 18} textAnchor='middle' fontSize={9} fill='#666' fontFamily='monospace'>
          Degree
        </text>

        {/* Y axis */}
        <line x1={0} y1={0} x2={0} y2={chartHeight} stroke='#ccc' />
        <text x={-chartHeight / 2} y={-25} textAnchor='middle' fontSize={9} fill='#666' fontFamily='monospace' transform='rotate(-90)'>
          Count {logScale ? '(log)' : ''}
        </text>
      </g>
    </svg>
  );
}
