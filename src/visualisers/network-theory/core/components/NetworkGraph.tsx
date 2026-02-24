'use client';

import React, { useMemo } from 'react';
import { Network } from '../lib/types';

interface Props {
  network: Network;
  width: number;
  height: number;
  nodeColorBy?: 'degree' | 'state';
  showLabels?: boolean;
  highlightHubs?: boolean;
}

const STATE_COLORS = {
  normal: '#333333',
  removed: '#cccccc',
  susceptible: '#0055FF',
  infected: '#FF0055',
  recovered: '#CCFF00',
};

export function NetworkGraph({
  network,
  width,
  height,
  nodeColorBy = 'degree',
  showLabels = false,
  highlightHubs = false,
}: Props) {
  const { nodes, edges } = network;

  const maxDegree = useMemo(() => Math.max(...nodes.map(n => n.degree), 1), [nodes]);

  const getNodeColor = (node: typeof nodes[0]) => {
    if (node.state === 'removed') return STATE_COLORS.removed;
    if (nodeColorBy === 'state') return STATE_COLORS[node.state];

    // Color by degree: light (low) to dark (high)
    const intensity = node.degree / maxDegree;
    const r = Math.round(0 + intensity * 0);
    const g = Math.round(85 - intensity * 85);
    const b = Math.round(255 - intensity * 100);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getNodeRadius = (node: typeof nodes[0]) => {
    if (node.state === 'removed') return 2;
    const base = 4 + (node.degree / maxDegree) * 8;
    return highlightHubs && node.degree > maxDegree * 0.7 ? base * 1.3 : base;
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className='w-full h-full'>
      {/* Edges */}
      <g>
        {edges.map((edge, i) => {
          const source = nodes[edge.source];
          const target = nodes[edge.target];
          if (source.state === 'removed' || target.state === 'removed') {
            return null;
          }
          return (
            <line
              key={i}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke='#000'
              strokeOpacity={0.1}
              strokeWidth={0.5}
            />
          );
        })}
      </g>

      {/* Nodes */}
      <g>
        {nodes.map(node => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={getNodeRadius(node)}
            fill={getNodeColor(node)}
            stroke={highlightHubs && node.degree > maxDegree * 0.7 ? '#FF0055' : 'white'}
            strokeWidth={highlightHubs && node.degree > maxDegree * 0.7 ? 2 : 0.5}
            opacity={node.state === 'removed' ? 0.3 : 1}
          />
        ))}
      </g>

      {/* Labels */}
      {showLabels && (
        <g>
          {nodes
            .filter(n => n.state !== 'removed' && n.degree > maxDegree * 0.5)
            .map(node => (
              <text
                key={`label-${node.id}`}
                x={node.x}
                y={node.y - getNodeRadius(node) - 4}
                textAnchor='middle'
                fontSize={9}
                fontFamily='monospace'
                fill='#666'
              >
                {node.degree}
              </text>
            ))}
        </g>
      )}
    </svg>
  );
}
