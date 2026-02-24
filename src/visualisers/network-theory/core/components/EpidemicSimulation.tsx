'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { NetworkGraph } from './NetworkGraph';
import {
  generateRandomNetwork,
  generateScaleFreeNetwork,
  generateSmallWorldNetwork,
  applyForceLayout,
} from '../lib/generators';
import { Network, Node } from '../lib/types';
import { InteractiveFrame } from '@/components/InteractiveFrame';
import { Button, Slider } from '@/components/Controls';

export function EpidemicSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [transmissionRate, setTransmissionRate] = useState(0.3);
  const [recoveryRate] = useState(0.1);
  const [seed, setSeed] = useState(0);

  const nodeCount = 80;
  const maxSteps = 100;

  // Generate base networks
  const baseNetworks = useMemo(() => {
    const width = 280;
    const height = 220;

    const random = applyForceLayout(generateRandomNetwork(nodeCount, 0.08), width, height, 150);
    const scaleFree = applyForceLayout(generateScaleFreeNetwork(nodeCount, 2), width, height, 150);
    const smallWorld = applyForceLayout(generateSmallWorldNetwork(nodeCount, 6, 0.1), width, height, 150);

    // Initialize all as susceptible
    [random, scaleFree, smallWorld].forEach(net => {
      net.nodes.forEach(n => n.state = 'susceptible');
    });

    return { random, scaleFree, smallWorld };
  }, [seed]);

  // Track infection history
  const [networks, setNetworks] = useState(baseNetworks);
  const [history, setHistory] = useState<{ random: number[]; scaleFree: number[]; smallWorld: number[] }>({
    random: [0],
    scaleFree: [0],
    smallWorld: [0],
  });

  // Reset when seed changes
  useEffect(() => {
    setNetworks(baseNetworks);
    setHistory({ random: [0], scaleFree: [0], smallWorld: [0] });
    setStep(0);
    setIsRunning(false);
  }, [baseNetworks]);

  // Build adjacency lists
  const adjacency = useMemo(() => {
    const buildAdj = (network: Network) => {
      const adj: number[][] = network.nodes.map(() => []);
      network.edges.forEach(e => {
        adj[e.source].push(e.target);
        adj[e.target].push(e.source);
      });
      return adj;
    };

    return {
      random: buildAdj(baseNetworks.random),
      scaleFree: buildAdj(baseNetworks.scaleFree),
      smallWorld: buildAdj(baseNetworks.smallWorld),
    };
  }, [baseNetworks]);

  // Seed infection
  const seedInfection = useCallback(() => {
    const infect = (network: Network): Network => {
      const nodes = network.nodes.map(n => ({ ...n, state: 'susceptible' as Node['state'] }));
      const startNode = Math.floor(Math.random() * nodes.length);
      nodes[startNode].state = 'infected';
      return { ...network, nodes };
    };

    setNetworks({
      random: infect(baseNetworks.random),
      scaleFree: infect(baseNetworks.scaleFree),
      smallWorld: infect(baseNetworks.smallWorld),
    });
    setHistory({ random: [1], scaleFree: [1], smallWorld: [1] });
    setStep(0);
  }, [baseNetworks]);

  // Simulation step
  const simulationStep = useCallback(() => {
    const stepNetwork = (network: Network, adj: number[][]): Network => {
      const nodes = network.nodes.map(n => ({ ...n }));

      // Recovery
      nodes.forEach(node => {
        if (node.state === 'infected' && Math.random() < recoveryRate) {
          node.state = 'recovered';
        }
      });

      // Transmission
      const newInfections: number[] = [];
      nodes.forEach((node, i) => {
        if (node.state === 'susceptible') {
          const infectedNeighbors = adj[i].filter(j => nodes[j].state === 'infected').length;
          if (infectedNeighbors > 0 && Math.random() < 1 - Math.pow(1 - transmissionRate, infectedNeighbors)) {
            newInfections.push(i);
          }
        }
      });

      newInfections.forEach(i => {
        nodes[i].state = 'infected';
      });

      return { ...network, nodes };
    };

    setNetworks(prev => ({
      random: stepNetwork(prev.random, adjacency.random),
      scaleFree: stepNetwork(prev.scaleFree, adjacency.scaleFree),
      smallWorld: stepNetwork(prev.smallWorld, adjacency.smallWorld),
    }));

    setHistory(prev => ({
      random: [...prev.random, networks.random.nodes.filter(n => n.state === 'infected' || n.state === 'recovered').length],
      scaleFree: [...prev.scaleFree, networks.scaleFree.nodes.filter(n => n.state === 'infected' || n.state === 'recovered').length],
      smallWorld: [...prev.smallWorld, networks.smallWorld.nodes.filter(n => n.state === 'infected' || n.state === 'recovered').length],
    }));

    setStep(s => s + 1);
  }, [networks, adjacency, transmissionRate, recoveryRate]);

  // Auto-run
  useEffect(() => {
    if (!isRunning) return;
    if (step >= maxSteps) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(simulationStep, 100);
    return () => clearTimeout(timer);
  }, [isRunning, step, simulationStep]);

  const networkTypes = [
    { key: 'random', label: 'Random', color: '#0055FF' },
    { key: 'scaleFree', label: 'Scale-Free', color: '#FF0055' },
    { key: 'smallWorld', label: 'Small-World', color: '#CCFF00' },
  ] as const;

  const getInfectionRate = (network: Network) => {
    const total = network.nodes.length;
    const affected = network.nodes.filter(n => n.state === 'infected' || n.state === 'recovered').length;
    return Math.round((affected / total) * 100);
  };

  const controlsContent = (
    <div className='flex flex-wrap items-center gap-4'>
      <Button variant='secondary' onClick={seedInfection}>
        Seed infection
      </Button>

      <Button
        variant='primary'
        onClick={() => setIsRunning(!isRunning)}
        disabled={history.random.length <= 1}
      >
        {isRunning ? 'Pause' : 'Run'}
      </Button>

      <Slider
        label='Transmission'
        value={transmissionRate}
        onChange={setTransmissionRate}
        min={0.05}
        max={0.8}
        step={0.05}
        formatValue={v => `${Math.round(v * 100)}%`}
        className='flex-1 min-w-[150px]'
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
          {networkTypes.map(({ key, label, color }) => (
            <div key={key} className='space-y-2'>
              <div className='flex justify-between items-center'>
                <div className='text-sm font-bold'>{label}</div>
                <div className='text-xs font-mono' style={{ color }}>
                  {getInfectionRate(networks[key])}% affected
                </div>
              </div>

              <div className='border border-black/10 bg-white aspect-[4/3]'>
                <NetworkGraph
                  network={networks[key]}
                  width={280}
                  height={220}
                  nodeColorBy='state'
                />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className='flex justify-center gap-4 text-xs'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-[#0055FF]' />
            <span>Susceptible</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-[#FF0055]' />
            <span>Infected</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-[#CCFF00]' />
            <span>Recovered</span>
          </div>
        </div>
      </InteractiveFrame>

      <p className='text-xs text-black/50'>
        Seed an infection, then run the simulation. Scale-free networks spread faster initially because hubs act as superspreaders.
        Small-world networks show wave-like propagation through clusters.
      </p>
    </>
  );
}
