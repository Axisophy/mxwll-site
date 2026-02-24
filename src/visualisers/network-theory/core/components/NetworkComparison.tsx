'use client';

import React, { useState, useMemo } from 'react';
import { NetworkGraph } from './NetworkGraph';
import { DegreeHistogram } from './DegreeHistogram';
import {
  generateRandomNetwork,
  generateScaleFreeNetwork,
  generateSmallWorldNetwork,
  applyForceLayout,
} from '../lib/generators';
import { getDegreeHistogram } from '../lib/metrics';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import { Button } from '@/components/Controls';

interface Props {
  nodeCount?: number;
}

export function NetworkComparison({ nodeCount = 80 }: Props) {
  const [seed, setSeed] = useState(0);

  const networks = useMemo(() => {
    const width = 300;
    const height = 250;

    const random = applyForceLayout(
      generateRandomNetwork(nodeCount, 0.08),
      width, height, 150
    );

    const scaleFree = applyForceLayout(
      generateScaleFreeNetwork(nodeCount, 2),
      width, height, 150
    );

    const smallWorld = applyForceLayout(
      generateSmallWorldNetwork(nodeCount, 6, 0.1),
      width, height, 150
    );

    return { random, scaleFree, smallWorld };
  }, [nodeCount, seed]);

  const histograms = useMemo(() => ({
    random: getDegreeHistogram(networks.random),
    scaleFree: getDegreeHistogram(networks.scaleFree),
    smallWorld: getDegreeHistogram(networks.smallWorld),
  }), [networks]);

  const networkTypes = [
    { key: 'random', label: 'Random', subtitle: 'Erdos-Renyi', color: '#0055FF' },
    { key: 'scaleFree', label: 'Scale-Free', subtitle: 'Barabasi-Albert', color: '#FF0055' },
    { key: 'smallWorld', label: 'Small-World', subtitle: 'Watts-Strogatz', color: '#CCFF00' },
  ] as const;

  return (
    <>
      <InteractiveFrame
        layout='compact'
        controls={
          <div className='flex justify-end'>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => setSeed(s => s + 1)}
            >
              Regenerate
            </Button>
          </div>
        }
      >
        <div className='grid grid-cols-3 gap-4'>
          {networkTypes.map(({ key, label, subtitle, color }) => (
            <div key={key} className='space-y-2'>
              <div className='text-center'>
                <div className='text-sm font-bold'>{label}</div>
                <div className='text-xs text-black/50 font-mono'>{subtitle}</div>
              </div>

              <div className='border border-black/10 bg-white aspect-square'>
                <NetworkGraph
                  network={networks[key]}
                  width={300}
                  height={250}
                  nodeColorBy='degree'
                  highlightHubs={key === 'scaleFree'}
                />
              </div>

              <div className='h-24 border border-black/10 bg-white'>
                <DegreeHistogram
                  data={histograms[key]}
                  width={200}
                  height={90}
                  color={color}
                  logScale={key === 'scaleFree'}
                />
              </div>
            </div>
          ))}
        </div>
      </InteractiveFrame>

      <p className='text-xs text-black/50 text-center'>
        {nodeCount} nodes each. Node size and colour indicate degree (number of connections).
        Scale-free networks show the characteristic power-law distribution with highly connected hubs.
      </p>
    </>
  );
}
