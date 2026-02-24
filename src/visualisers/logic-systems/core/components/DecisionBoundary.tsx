'use client';

import React, { useState, useMemo } from 'react';
import { ModelType } from '../lib/types';
import {
  trainLinear,
  trainPolynomial,
  trainKNN,
  trainRBF,
  generateDataset,
  ClassifierResult
} from '../lib/classifiers';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import { ControlGroup, Select, Slider, Button, Readout, InfoPanel } from '@/components/Controls';

export function DecisionBoundary() {
  const [datasetType, setDatasetType] = useState<'linear' | 'circular' | 'xor' | 'moons'>('linear');
  const [modelType, setModelType] = useState<ModelType>('linear');
  const [parameter, setParameter] = useState(0.5);
  const [seed, setSeed] = useState(0);

  // Generate dataset
  const points = useMemo(() => {
    return generateDataset(datasetType, 100);
  }, [datasetType, seed]);

  // Train classifier
  const classifier = useMemo((): ClassifierResult => {
    switch (modelType) {
      case 'linear':
        return trainLinear(points, parameter * 0.1);
      case 'polynomial':
        return trainPolynomial(points, parameter * 0.1);
      case 'knn':
        return trainKNN(points, Math.max(1, Math.round(parameter * 20)));
      case 'rbf':
        return trainRBF(points, parameter * 5);
      default:
        return trainLinear(points);
    }
  }, [points, modelType, parameter]);

  // Generate decision boundary grid
  const boundaryGrid = useMemo(() => {
    const resolution = 50;
    const grid: number[][] = [];

    for (let i = 0; i < resolution; i++) {
      const row: number[] = [];
      for (let j = 0; j < resolution; j++) {
        const x = (j / resolution) * 2 - 1;
        const y = (i / resolution) * 2 - 1;
        row.push(classifier.predict(x, y));
      }
      grid.push(row);
    }

    return grid;
  }, [classifier]);

  const width = 400;
  const height = 400;
  const padding = 40;

  const scaleX = (x: number) => padding + ((x + 1) / 2) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - ((y + 1) / 2) * (height - 2 * padding);

  const getParameterLabel = () => {
    switch (modelType) {
      case 'linear':
      case 'polynomial':
        return 'Regularization';
      case 'knn':
        return 'k (neighbors)';
      case 'rbf':
        return 'Gamma';
    }
  };

  const getParameterDisplay = () => {
    switch (modelType) {
      case 'linear':
      case 'polynomial':
        return (parameter * 0.1).toFixed(2);
      case 'knn':
        return String(Math.max(1, Math.round(parameter * 20)));
      case 'rbf':
        return (parameter * 5).toFixed(1);
    }
  };

  const sidebarContent = (
    <>
      <ControlGroup title='Dataset'>
        <Select
          value={datasetType}
          options={[
            { value: 'linear', label: 'Linearly separable' },
            { value: 'circular', label: 'Circular (inner/outer)' },
            { value: 'xor', label: 'XOR pattern' },
            { value: 'moons', label: 'Two moons' },
          ]}
          onChange={setDatasetType}
        />
      </ControlGroup>

      <ControlGroup title='Model'>
        <Select
          value={modelType}
          options={[
            { value: 'linear', label: 'Linear (straight line)' },
            { value: 'polynomial', label: 'Polynomial (curves)' },
            { value: 'knn', label: 'k-Nearest Neighbors' },
            { value: 'rbf', label: 'RBF Kernel (smooth blobs)' },
          ]}
          onChange={(v) => setModelType(v as ModelType)}
        />
      </ControlGroup>

      <ControlGroup>
        <Slider
          label={getParameterLabel()}
          value={parameter}
          onChange={setParameter}
          min={0.05}
          max={1}
          step={0.05}
          formatValue={() => getParameterDisplay()}
        />
      </ControlGroup>

      <Button variant='secondary' onClick={() => setSeed(s => s + 1)}>
        New data
      </Button>

      <ControlGroup title='What you&apos;re seeing'>
        <InfoPanel>
          The background colour shows what the model would predict for any
          new point in that region. Blue regions predict blue class.
          Pink regions predict pink class.
        </InfoPanel>
      </ControlGroup>

      <Readout
        label='Accuracy'
        value={`${(classifier.accuracy * 100).toFixed(0)}%`}
      />

      <InfoPanel title='Try this'>
        Switch to <strong>XOR pattern</strong> with a <strong>Linear</strong> model.
        The accuracy drops to ~50% — no straight line can separate the classes.
        Now try <strong>Polynomial</strong> or <strong>k-NN</strong>.
      </InfoPanel>

      <div className='flex gap-4'>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-[var(--color-blue)]' />
          <span className='text-xs'>Class 1</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-[var(--color-pink)]' />
          <span className='text-xs'>Class 0</span>
        </div>
      </div>
    </>
  );

  return (
    <InteractiveFrame
      layout='sidebar'
      sidebar={sidebarContent}
      caption='Classifiers divide feature space into regions. A linear model can only draw straight boundaries. Some patterns need curves — and some need the flexibility of neural networks.'
    >
      <div className='bg-white p-4'>
        <svg viewBox={`0 0 ${width} ${height}`} className='w-full h-auto'>
          {/* Decision boundary as colored grid */}
          {boundaryGrid.map((row, i) =>
            row.map((prob, j) => {
              const x = (j / boundaryGrid[0].length) * 2 - 1;
              const y = (i / boundaryGrid.length) * 2 - 1;
              const cellSize = (width - 2 * padding) / boundaryGrid[0].length;

              // Interpolate between class colors
              const r = Math.round(prob * 0 + (1 - prob) * 255);
              const g = Math.round(prob * 85 + (1 - prob) * 0);
              const b = Math.round(prob * 255 + (1 - prob) * 85);

              return (
                <rect
                  key={`${i}-${j}`}
                  x={scaleX(x) - cellSize/2}
                  y={scaleY(y) - cellSize/2}
                  width={cellSize + 1}
                  height={cellSize + 1}
                  fill={`rgb(${r}, ${g}, ${b})`}
                  opacity={0.3}
                />
              );
            })
          )}

          {/* Grid */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke='#ccc' />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke='#ccc' />

          {/* Points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={scaleX(point.x)}
              cy={scaleY(point.y)}
              r={5}
              fill={point.label === 1 ? 'var(--color-blue)' : 'var(--color-pink)'}
              stroke='white'
              strokeWidth={1.5}
            />
          ))}

          {/* Axes labels */}
          <text x={width / 2} y={height - 8} textAnchor='middle' fontSize='11' fill='#666' fontFamily='monospace'>
            Feature 1
          </text>
          <text x={12} y={height / 2} textAnchor='middle' fontSize='11' fill='#666' fontFamily='monospace' transform={`rotate(-90, 12, ${height/2})`}>
            Feature 2
          </text>
        </svg>
      </div>
    </InteractiveFrame>
  );
}
