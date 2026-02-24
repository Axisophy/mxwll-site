'use client';

import React, { useState, useMemo } from 'react';
import { NetworkGraph } from './NetworkGraph';
import {
  generateRandomNetwork,
  generateScaleFreeNetwork,
  generateSmallWorldNetwork,
  applyForceLayout,
} from '../lib/generators';
import { calculateMetrics } from '../lib/metrics';
import { Network, Node } from '../lib/types';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import { Button, Slider, ButtonGroup, ReadoutGrid } from '@/components/Controls';

export function AttackSimulation() {
  const [removalFraction, setRemovalFraction] = useState(0);
  const [attackMode, setAttackMode] = useState<'random' | 'targeted'>('random');
  const [seed, setSeed] = useState(0);

  const nodeCount = 80;

  // Generate base networks
  const baseNetworks = useMemo(() => {
    const width = 280;
    const height = 220;

    return {
      random: applyForceLayout(generateRandomNetwork(nodeCount, 0.08), width, height, 150),
      scaleFree: applyForceLayout(generateScaleFreeNetwork(nodeCount, 2), width, height, 150),
      smallWorld: applyForceLayout(generateSmallWorldNetwork(nodeCount, 6, 0.1), width, height, 150),
    };
  }, [seed]);

  // Apply node removal
  const attackedNetworks = useMemo(() => {
    const applyAttack = (network: Network): Network => {
      const nodes = network.nodes.map(n => ({ ...n, state: 'normal' as Node['state'] }));
      const numToRemove = Math.floor(nodes.length * removalFraction);

      if (numToRemove === 0) return { ...network, nodes };

      let toRemove: number[];

      if (attackMode === 'targeted') {
        // Remove highest degree nodes first
        toRemove = [...nodes]
          .sort((a, b) => b.degree - a.degree)
          .slice(0, numToRemove)
          .map(n => n.id);
      } else {
        // Random removal
        const shuffled = [...nodes].sort(() => Math.random() - 0.5);
        toRemove = shuffled.slice(0, numToRemove).map(n => n.id);
      }

      toRemove.forEach(id => {
        nodes[id].state = 'removed';
      });

      return { ...network, nodes, edges: network.edges };
    };

    return {
      random: applyAttack(baseNetworks.random),
      scaleFree: applyAttack(baseNetworks.scaleFree),
      smallWorld: applyAttack(baseNetworks.smallWorld),
    };
  }, [baseNetworks, removalFraction, attackMode]);

  // Calculate metrics
  const metrics = useMemo(() => ({
    random: calculateMetrics(attackedNetworks.random),
    scaleFree: calculateMetrics(attackedNetworks.scaleFree),
    smallWorld: calculateMetrics(attackedNetworks.smallWorld),
  }), [attackedNetworks]);

  const networkTypes = [
    { key: 'random', label: 'Random' },
    { key: 'scaleFree', label: 'Scale-Free' },
    { key: 'smallWorld', label: 'Small-World' },
  ] as const;

  const controlsContent = (
    <div className='flex flex-wrap items-center gap-4'>
      <Slider
        label='Nodes removed'
        value={removalFraction}
        onChange={setRemovalFraction}
        min={0}
        max={0.8}
        step={0.02}
        formatValue={v => `${Math.round(v * 100)}%`}
        className='flex-1 min-w-[200px]'
      />
      <ButtonGroup
        options={[
          { value: 'random', label: 'Random failure' },
          { value: 'targeted', label: 'Targeted attack' },
        ]}
        value={attackMode}
        onChange={setAttackMode}
      />
      <Button variant='secondary' onClick={() => setSeed(s => s + 1)}>
        Reset
      </Button>
    </div>
  );

  return (
    <>
      <InteractiveFrame layout='compact' controls={controlsContent}>
        {/* Networks */}
        <div className='grid grid-cols-3 gap-4'>
          {networkTypes.map(({ key, label }) => (
            <div key={key} className='space-y-2'>
              <div className='text-sm font-bold text-center'>{label}</div>

              <div className='border border-black/10 bg-white aspect-[4/3]'>
                <NetworkGraph
                  network={attackedNetworks[key]}
                  width={280}
                  height={220}
                  nodeColorBy='degree'
                />
              </div>

              {/* Metrics */}
              <ReadoutGrid
                columns={2}
                size='sm'
                items={[
                  { label: 'Largest component', value: `${Math.round(metrics[key].largestComponent * 100)}%` },
                  { label: 'Isolated nodes', value: String(metrics[key].isolatedNodes) },
                ]}
              />
            </div>
          ))}
        </div>
      </InteractiveFrame>
      <p className='text-xs text-black/50'>
        {attackMode === 'targeted'
          ? 'Targeted attack removes the most connected nodes first. Scale-free networks collapse rapidly because hubs hold the network together.'
          : 'Random failure removes nodes at random. Scale-free networks survive well because most nodes are peripheral - hubs are unlikely to be hit.'}
      </p>
    </>
  );
}
