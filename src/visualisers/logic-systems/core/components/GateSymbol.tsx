'use client';

import React from 'react';
import { GateType } from '../lib/types';

interface Props {
  type: GateType;
  size?: number;
  value?: boolean;
  selected?: boolean;
}

export function GateSymbol({ type, size = 60, value, selected = false }: Props) {
  const color = value === undefined ? '#333' : value ? '#0055FF' : '#999';
  const strokeWidth = selected ? 2.5 : 1.5;

  const renderGate = () => {
    switch (type) {
      case 'AND':
        return (
          <g>
            <path
              d='M 10 10 L 30 10 Q 50 10 50 30 Q 50 50 30 50 L 10 50 Z'
              fill='white'
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <text x='30' y='35' textAnchor='middle' fontSize='10' fill={color} fontFamily='monospace'>AND</text>
          </g>
        );

      case 'OR':
        return (
          <g>
            <path
              d='M 10 10 Q 20 30 10 50 Q 35 45 50 30 Q 35 15 10 10'
              fill='white'
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <text x='28' y='35' textAnchor='middle' fontSize='10' fill={color} fontFamily='monospace'>OR</text>
          </g>
        );

      case 'NOT':
        return (
          <g>
            <polygon
              points='10,10 45,30 10,50'
              fill='white'
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <circle cx='50' cy='30' r='5' fill='white' stroke={color} strokeWidth={strokeWidth} />
            <text x='25' y='35' textAnchor='middle' fontSize='9' fill={color} fontFamily='monospace'>NOT</text>
          </g>
        );

      case 'XOR':
        return (
          <g>
            <path
              d='M 15 10 Q 25 30 15 50 Q 40 45 55 30 Q 40 15 15 10'
              fill='white'
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <path
              d='M 8 10 Q 18 30 8 50'
              fill='none'
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <text x='32' y='35' textAnchor='middle' fontSize='9' fill={color} fontFamily='monospace'>XOR</text>
          </g>
        );

      case 'NAND':
        return (
          <g>
            <path
              d='M 10 10 L 25 10 Q 42 10 42 30 Q 42 50 25 50 L 10 50 Z'
              fill='white'
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <circle cx='50' cy='30' r='5' fill='white' stroke={color} strokeWidth={strokeWidth} />
            <text x='25' y='35' textAnchor='middle' fontSize='8' fill={color} fontFamily='monospace'>NAND</text>
          </g>
        );

      case 'NOR':
        return (
          <g>
            <path
              d='M 10 10 Q 20 30 10 50 Q 30 45 42 30 Q 30 15 10 10'
              fill='white'
              stroke={color}
              strokeWidth={strokeWidth}
            />
            <circle cx='50' cy='30' r='5' fill='white' stroke={color} strokeWidth={strokeWidth} />
            <text x='25' y='35' textAnchor='middle' fontSize='9' fill={color} fontFamily='monospace'>NOR</text>
          </g>
        );

      case 'INPUT':
        return (
          <g>
            <circle cx='30' cy='30' r='18' fill={value ? '#0055FF' : 'white'} stroke={color} strokeWidth={strokeWidth} />
            <text x='30' y='35' textAnchor='middle' fontSize='10' fill={value ? 'white' : color} fontFamily='monospace'>
              {value ? '1' : '0'}
            </text>
          </g>
        );

      case 'OUTPUT':
        return (
          <g>
            <rect x='12' y='12' width='36' height='36' fill={value ? '#CCFF00' : 'white'} stroke={color} strokeWidth={strokeWidth} />
            <text x='30' y='36' textAnchor='middle' fontSize='12' fill={value ? '#333' : color} fontWeight='bold' fontFamily='monospace'>
              {value ? '1' : '0'}
            </text>
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <svg width={size} height={size} viewBox='0 0 60 60'>
      {renderGate()}
    </svg>
  );
}
