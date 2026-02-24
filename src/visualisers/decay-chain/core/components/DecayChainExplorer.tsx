'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import NuclideChartView from './NuclideChartView';
import LogTimeScrubber from './LogTimeScrubber';
import InventoryChart from './InventoryChart';
import {
  ChainIsotope,
  ChartContext,
  ColourEntry,
  InventorySnapshot,
  NarrativeStep,
  GeigerNuttallPoint,
  TimeComparison,
  formatHalfLife,
  halfLifeToOKLCh,
  DECAY_COLOURS,
} from '../lib/types';

interface DecayChainExplorerProps {
  chainData: ChainIsotope[];
  chartContext: ChartContext;
  colourMap: Record<string, ColourEntry>;
  inventoryData: InventorySnapshot[];
  narratives: NarrativeStep[];
  geigerNuttall: GeigerNuttallPoint[];
  timeComparisons: TimeComparison[];
}

export default function DecayChainExplorer({
  chainData,
  chartContext,
  colourMap,
  inventoryData,
  narratives,
  geigerNuttall,
  timeComparisons,
}: DecayChainExplorerProps) {
  // State
  const [mode, setMode] = useState<'guided' | 'scrubber'>('guided');
  const [currentStep, setCurrentStep] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [logTime, setLogTime] = useState(-5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGeigerNuttall, setShowGeigerNuttall] = useState(false);

  const animationRef = useRef<number>(0);
  const stepRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Animation loop for guided mode
  useEffect(() => {
    if (!isPlaying || mode !== 'guided') return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setAnimationProgress(prev => {
        const newProgress = prev + delta * 0.5;  // 2 seconds per decay

        if (newProgress >= 1) {
          // Move to next step
          setCurrentStep(step => {
            const nextStep = step + 1;
            if (nextStep >= chainData.length) {
              setIsPlaying(false);
              return step;
            }
            return nextStep;
          });
          return 0;
        }

        return newProgress;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, mode, chainData.length]);

  // Update log time based on current step in guided mode
  useEffect(() => {
    if (mode === 'guided' && currentStep < chainData.length) {
      const isotope = chainData[currentStep];
      if (isotope.log10_half_life !== null) {
        setLogTime(isotope.log10_half_life);
      }
    }
  }, [currentStep, mode, chainData]);

  // Find current step from log time in scrubber mode
  useEffect(() => {
    if (mode === 'scrubber') {
      // Find which isotope dominates at this time
      // This is a simplification - in reality it's complex
      let dominantStep = 0;
      let cumulativeLogTime = chainData[0].log10_half_life || 0;

      for (let i = 0; i < chainData.length - 1; i++) {
        if (logTime < cumulativeLogTime) {
          dominantStep = i;
          break;
        }
        if (chainData[i + 1].log10_half_life !== null) {
          cumulativeLogTime = Math.max(cumulativeLogTime, chainData[i + 1].log10_half_life!);
        }
        dominantStep = i + 1;
      }

      setCurrentStep(dominantStep);
    }
  }, [logTime, mode, chainData]);

  // Intersection observer for scrollytelling
  useEffect(() => {
    if (mode !== 'guided') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const step = parseInt(entry.target.getAttribute('data-step') || '0');
            setCurrentStep(step);
            setAnimationProgress(0);
          }
        }
      },
      { threshold: [0.5], rootMargin: '-20% 0px -20% 0px' }
    );

    stepRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mode]);

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    setAnimationProgress(0);
  };

  const handlePlayPause = () => {
    if (currentStep >= chainData.length - 1) {
      setCurrentStep(0);
      setAnimationProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const currentIsotope = chainData[currentStep];
  const currentNarrative = narratives.find(n => n.isotope === currentIsotope.isotope);
  const currentComparison = timeComparisons.find(t => t.isotope === currentIsotope.isotope);

  return (
    <div className='relative'>
      {/* Mode toggle */}
      <div className='sticky top-0 z-40 bg-black/90 border-b border-white/10 px-4 py-3'>
        <div className='flex items-center justify-between max-w-6xl mx-auto'>
          <div className='flex gap-2'>
            <button
              onClick={() => setMode('guided')}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                mode === 'guided'
                  ? 'bg-[var(--color-blue)] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Guided Journey
            </button>
            <button
              onClick={() => setMode('scrubber')}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                mode === 'scrubber'
                  ? 'bg-[var(--color-blue)] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Time Explorer
            </button>
          </div>

          {mode === 'guided' && (
            <div className='flex items-center gap-4'>
              <span className='text-xs text-white/50'>
                Step {currentStep + 1} of {chainData.length}
              </span>
              <button
                onClick={handlePlayPause}
                className='px-4 py-2 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition-colors'
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-0'>
        {/* Left: Visualization panels */}
        <div className='lg:sticky lg:top-16 h-screen lg:h-[calc(100vh-64px)] bg-[#0A0A0F] flex flex-col'>
          {/* Nuclide Chart */}
          <div className='flex-1 min-h-0'>
            <NuclideChartView
              chainData={chainData}
              chartContext={chartContext}
              colourMap={colourMap}
              currentStep={currentStep}
              animationProgress={animationProgress}
            />
          </div>

          {/* Log Time Scrubber (in scrubber mode) */}
          {mode === 'scrubber' && (
            <div className='border-t border-white/10 p-4'>
              <LogTimeScrubber
                logTime={logTime}
                onLogTimeChange={setLogTime}
                chainData={chainData}
              />
            </div>
          )}

          {/* Inventory Chart (in scrubber mode) */}
          {mode === 'scrubber' && (
            <div className='h-64 border-t border-white/10'>
              <InventoryChart
                chainData={chainData}
                inventoryData={inventoryData}
                colourMap={colourMap}
                logTime={logTime}
              />
            </div>
          )}
        </div>

        {/* Right: Narrative content (guided mode) or info panel */}
        <div className='px-4 md:px-8 lg:px-12 py-8'>
          {mode === 'guided' ? (
            <>
              {/* Step-by-step narrative */}
              {chainData.map((isotope, i) => {
                const narrative = narratives.find(n => n.isotope === isotope.isotope);
                const comparison = timeComparisons.find(t => t.isotope === isotope.isotope);
                const colour = colourMap[isotope.isotope];

                return (
                  <div
                    key={i}
                    data-step={i}
                    ref={(el) => {
                      if (el) stepRefs.current.set(i, el);
                    }}
                    className={`min-h-[60vh] flex flex-col justify-center py-12 cursor-pointer transition-opacity ${
                      currentStep === i ? 'opacity-100' : 'opacity-40'
                    }`}
                    onClick={() => handleStepClick(i)}
                  >
                    {/* Step indicator */}
                    <div className='flex items-center gap-3 mb-4'>
                      <div
                        className='w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm'
                        style={{ backgroundColor: colour?.oklch || '#444' }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <span className='text-xs font-mono uppercase tracking-wider text-white/50'>
                          {isotope.decay_type === 'alpha' && 'α decay'}
                          {isotope.decay_type === 'beta_minus' && 'β⁻ decay'}
                          {isotope.is_stable && 'Stable'}
                        </span>
                      </div>
                    </div>

                    {/* Isotope name */}
                    <h3 className='text-3xl md:text-4xl font-bold tracking-tight mb-2'>
                      <sup className='text-lg'>{isotope.A}</sup>{isotope.symbol}
                      {isotope.is_metastable && <sup>m</sup>}
                      <span className='text-white/50 ml-3'>{isotope.element}</span>
                    </h3>

                    {/* Half-life */}
                    {!isotope.is_stable && (
                      <div className='text-xl text-white/70 mb-4'>
                        Half-life: <span className='font-bold text-white'>{isotope.half_life_readable}</span>
                      </div>
                    )}

                    {/* Narrative */}
                    {narrative && (
                      <>
                        <h4 className='text-xl font-bold mb-2'>{narrative.title}</h4>
                        <p className='text-white/70 leading-relaxed mb-4'>
                          {narrative.content}
                        </p>
                        <div className='inline-block px-3 py-1 bg-white/10 rounded text-sm text-white/80'>
                          {narrative.highlight}
                        </div>
                      </>
                    )}

                    {/* Time comparison */}
                    {comparison && (
                      <div className='mt-4 text-sm text-white/50'>
                        Human scale: <span className='text-white/70'>{comparison.comparison}</span>
                      </div>
                    )}

                    {/* Decay info */}
                    {!isotope.is_stable && isotope.daughter && (
                      <div className='mt-6 flex items-center gap-2 text-sm'>
                        <span
                          className='px-2 py-1 rounded'
                          style={{
                            backgroundColor: isotope.decay_type === 'alpha'
                              ? DECAY_COLOURS.alpha + '30'
                              : DECAY_COLOURS.beta_minus + '30',
                            color: isotope.decay_type === 'alpha'
                              ? DECAY_COLOURS.alpha
                              : DECAY_COLOURS.beta_minus,
                          }}
                        >
                          {isotope.decay_mode}
                        </span>
                        <span className='text-white/50'>→</span>
                        <span className='text-white'>{isotope.daughter}</span>
                        {isotope.q_value_keV && (
                          <span className='text-white/40 ml-2'>
                            Q = {(isotope.q_value_keV / 1000).toFixed(2)} MeV
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            /* Scrubber mode info panel */
            <div className='py-8'>
              <div className='bg-white/5 rounded-lg p-6 mb-8'>
                <h3 className='text-2xl font-bold mb-4'>
                  <sup className='text-lg'>{currentIsotope.A}</sup>{currentIsotope.symbol}
                  {currentIsotope.is_metastable && <sup>m</sup>}
                  <span className='text-white/50 ml-3'>{currentIsotope.element}</span>
                </h3>

                {!currentIsotope.is_stable ? (
                  <>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='text-white/50'>Half-life:</span>
                        <div className='font-bold'>{currentIsotope.half_life_readable}</div>
                      </div>
                      <div>
                        <span className='text-white/50'>Decay mode:</span>
                        <div className='font-bold'>{currentIsotope.decay_mode}</div>
                      </div>
                      <div>
                        <span className='text-white/50'>Protons (Z):</span>
                        <div className='font-bold'>{currentIsotope.Z}</div>
                      </div>
                      <div>
                        <span className='text-white/50'>Neutrons (N):</span>
                        <div className='font-bold'>{currentIsotope.N}</div>
                      </div>
                    </div>
                    {currentComparison && (
                      <div className='mt-4 pt-4 border-t border-white/10'>
                        <span className='text-white/50'>Human comparison:</span>
                        <div className='text-white/80'>{currentComparison.comparison}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className='text-xl text-[#808080]'>
                    STABLE — End of chain
                  </div>
                )}
              </div>

              {/* Geiger-Nuttall toggle */}
              <button
                onClick={() => setShowGeigerNuttall(!showGeigerNuttall)}
                className='text-sm text-white/50 hover:text-white transition-colors'
              >
                {showGeigerNuttall ? 'Hide' : 'Show'} Geiger-Nuttall relationship →
              </button>

              {showGeigerNuttall && (
                <div className='mt-4 bg-white/5 rounded-lg p-4'>
                  <h4 className='font-bold mb-2'>Why the huge time differences?</h4>
                  <p className='text-sm text-white/70 mb-4'>
                    The Geiger-Nuttall law explains why alpha decay half-lives span 21 orders of magnitude:
                    higher-energy alpha particles tunnel through the nuclear barrier exponentially faster.
                  </p>
                  <div className='grid grid-cols-2 gap-2 text-xs'>
                    {geigerNuttall.map((point, i) => (
                      <div key={i} className='flex justify-between'>
                        <span>{point.isotope}</span>
                        <span className='text-white/50'>{point.alpha_energy_keV} keV</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
