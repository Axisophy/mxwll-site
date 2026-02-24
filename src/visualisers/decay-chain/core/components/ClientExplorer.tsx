'use client';

import { useState, useEffect } from 'react';
import DecayChainExplorer from './DecayChainExplorer';
import {
  ChainIsotope,
  ChartContext,
  ColourEntry,
  InventorySnapshot,
  NarrativeStep,
  GeigerNuttallPoint,
  TimeComparison,
} from '../lib/types';

export default function ClientExplorer() {
  const [chainData, setChainData] = useState<ChainIsotope[]>([]);
  const [chartContext, setChartContext] = useState<ChartContext | null>(null);
  const [colourMap, setColourMap] = useState<Record<string, ColourEntry>>({});
  const [inventoryData, setInventoryData] = useState<InventorySnapshot[]>([]);
  const [narratives, setNarratives] = useState<NarrativeStep[]>([]);
  const [geigerNuttall, setGeigerNuttall] = useState<GeigerNuttallPoint[]>([]);
  const [timeComparisons, setTimeComparisons] = useState<TimeComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          chainRes,
          contextRes,
          colourRes,
          inventoryRes,
          narrativeRes,
          geigerRes,
          timeRes,
        ] = await Promise.all([
          fetch('/data/decay-chain/chain_data.json'),
          fetch('/data/decay-chain/chart_context.json'),
          fetch('/data/decay-chain/colour_map.json'),
          fetch('/data/decay-chain/inventory_evolution.json'),
          fetch('/data/decay-chain/narratives.json'),
          fetch('/data/decay-chain/geiger_nuttall.json'),
          fetch('/data/decay-chain/time_comparisons.json'),
        ]);

        if (!chainRes.ok) throw new Error('Failed to load chain data');

        setChainData(await chainRes.json());
        setChartContext(await contextRes.json());
        setColourMap(await colourRes.json());
        setInventoryData(await inventoryRes.json());
        setNarratives(await narrativeRes.json());
        setGeigerNuttall(await geigerRes.json());
        setTimeComparisons(await timeRes.json());
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading decay chain data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className='h-screen flex items-center justify-center bg-black'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4' />
          <div className='text-white/50'>Loading decay chain data...</div>
        </div>
      </div>
    );
  }

  if (error || !chartContext) {
    return (
      <div className='h-screen flex items-center justify-center bg-black'>
        <div className='text-center text-white/70'>
          <div className='text-xl mb-2'>Error loading data</div>
          <div className='text-sm'>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <DecayChainExplorer
      chainData={chainData}
      chartContext={chartContext}
      colourMap={colourMap}
      inventoryData={inventoryData}
      narratives={narratives}
      geigerNuttall={geigerNuttall}
      timeComparisons={timeComparisons}
    />
  );
}
