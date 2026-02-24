'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GWData, Stage, Panel, TIME_RANGE, COLOURS } from '../lib/types';
import { generateMockGWData, findNearestIndex, easeInOutCubic, lerp } from '../lib/mock-data';
import { computePanelLayout, drawWaveform, drawSpectrogram, drawOrbitalDiagram } from '../lib/renderer';
import { ChirpAudio } from '../lib/audio';

interface GravitationalWaveExplorerProps {
  className?: string;
}

// Stage text content
const STAGE_TEXT: Record<Stage, { main: string; sub?: string }> = {
  1: {
    main: 'On 14 September 2015 at 09:50:45 UTC, these signals were recorded by the LIGO detectors in Hanford, Washington and Livingston, Louisiana. Can you see anything?',
  },
  2: {
    main: 'General Relativity predicts this waveform for two black holes \u2014 36 and 29 times the mass of the Sun \u2014 spiralling into each other.',
  },
  3: {
    main: 'Signal-to-noise ratio: 24. This happens by chance less than once every 203,000 years.',
  },
  4: {
    main: '36 + 29 \u2192 62 solar masses. Three Suns of energy, radiated as gravitational waves in 0.2 seconds.',
    sub: 'This merger happened 1.3 billion years ago, when Earth contained only simple multicellular life.',
  },
};

// Stage button labels
const STAGE_BUTTONS: Record<Stage, string> = {
  1: 'What were they looking for?',
  2: 'Find the signal',
  3: 'What happened?',
  4: '',
};

export default function GravitationalWaveExplorer({ className = '' }: GravitationalWaveExplorerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const dataRef = useRef<GWData | null>(null);
  const audioRef = useRef<ChirpAudio | null>(null);

  // Stage management
  const [stage, setStage] = useState<Stage>(1);
  const [stageTransition, setStageTransition] = useState(0);
  const nextStageRef = useRef<Stage | null>(null);

  // Playhead
  const [playheadTime, setPlayheadTime] = useState(TIME_RANGE[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackRef = useRef({ active: false, startTime: 0, startValue: TIME_RANGE[0] });

  // Audio
  const [soundOn, setSoundOn] = useState(false);

  // Template overlay animation for stage 3
  const [templateOffset, setTemplateOffset] = useState(0.15);
  const [showOverlay, setShowOverlay] = useState(false);

  // SNR animation
  const [displayedSNR, setDisplayedSNR] = useState(0);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Initialise data and audio
  useEffect(() => {
    dataRef.current = generateMockGWData();
    audioRef.current = new ChirpAudio();
    setIsLoading(false);

    return () => {
      audioRef.current?.dispose();
    };
  }, []);

  // Advance stage with animation
  const advanceStage = useCallback(() => {
    if (stage >= 4 || stageTransition > 0) return;

    const next = (stage + 1) as Stage;
    nextStageRef.current = next;

    const startTime = performance.now();
    const duration = 1200;

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeInOutCubic(progress);
      setStageTransition(eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setStage(next);
        setStageTransition(0);
        nextStageRef.current = null;

        // Trigger stage-specific animations
        if (next === 3) {
          animateTemplateOverlay();
        }
      }
    }
    requestAnimationFrame(tick);
  }, [stage, stageTransition]);

  // Template overlay animation for stage 3
  const animateTemplateOverlay = useCallback(() => {
    setShowOverlay(true);
    setTemplateOffset(0.12);

    const startTime = performance.now();
    const duration = 2500;

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeInOutCubic(progress);
      setTemplateOffset(0.12 * (1 - eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Animate SNR counter
        animateSNR();
      }
    }
    requestAnimationFrame(tick);
  }, []);

  // SNR counter animation
  const animateSNR = useCallback(() => {
    const startTime = performance.now();
    const duration = 1000;
    const target = 24;

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeInOutCubic(progress);
      setDisplayedSNR(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }, []);

  // Playback control
  const startPlayback = useCallback(() => {
    if (isPlaying) return;

    setIsPlaying(true);
    playbackRef.current = {
      active: true,
      startTime: performance.now(),
      startValue: playheadTime,
    };

    if (soundOn && audioRef.current) {
      audioRef.current.start();
    }
  }, [isPlaying, playheadTime, soundOn]);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    playbackRef.current.active = false;

    if (audioRef.current) {
      audioRef.current.stop();
    }
  }, []);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      // Reset to start if at end
      if (playheadTime >= TIME_RANGE[1] - 0.01) {
        setPlayheadTime(TIME_RANGE[0]);
      }
      startPlayback();
    }
  }, [isPlaying, playheadTime, startPlayback, stopPlayback]);

  const toggleSound = useCallback(() => {
    setSoundOn(prev => {
      const next = !prev;
      if (next && isPlaying && audioRef.current) {
        audioRef.current.start();
      } else if (!next && audioRef.current) {
        audioRef.current.stop();
      }
      return next;
    });
  }, [isPlaying]);

  const resetToStage1 = useCallback(() => {
    stopPlayback();
    setStage(1);
    setStageTransition(0);
    setPlayheadTime(TIME_RANGE[0]);
    setShowOverlay(false);
    setTemplateOffset(0.15);
    setDisplayedSNR(0);
  }, [stopPlayback]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const data = dataRef.current;
    if (!canvas || !data || isLoading) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = rect.width;
      const H = rect.height;

      // Clear
      ctx.fillStyle = COLOURS.BACKGROUND;
      ctx.fillRect(0, 0, W, H);

      // Update playback
      if (playbackRef.current.active) {
        const elapsed = performance.now() - playbackRef.current.startTime;
        const duration = (TIME_RANGE[1] - TIME_RANGE[0]);
        const playDuration = duration * 1000 * 35; // 35x slower (0.4s plays over 14s)
        const progress = Math.min(elapsed / playDuration, 1);
        const newTime = playbackRef.current.startValue + progress * (TIME_RANGE[1] - playbackRef.current.startValue);

        setPlayheadTime(newTime);

        // Update audio
        if (soundOn && audioRef.current) {
          const tIdx = findNearestIndex(data.orbital.times, newTime);
          const freq = data.orbital.frequency[tIdx];
          const strainIdx = findNearestIndex(data.H1.times, newTime);
          const amp = Math.abs(data.H1.strain[strainIdx]);
          audioRef.current.update(freq, amp);
        }

        if (progress >= 1) {
          stopPlayback();
        }
      }

      // Compute panel layouts
      const currentStage = stage;
      const targetStage = nextStageRef.current || stage;
      const layoutFrom = computePanelLayout(currentStage, W, H);
      const layoutTo = computePanelLayout(targetStage, W, H);

      // Interpolate panels
      const panels: Panel[] = layoutTo.map(toPanel => {
        const fromPanel = layoutFrom.find(p => p.id === toPanel.id);
        if (fromPanel && stageTransition > 0) {
          return {
            ...toPanel,
            x: lerp(fromPanel.x, toPanel.x, stageTransition),
            y: lerp(fromPanel.y, toPanel.y, stageTransition),
            width: lerp(fromPanel.width, toPanel.width, stageTransition),
            height: lerp(fromPanel.height, toPanel.height, stageTransition),
            opacity: 1,
          };
        } else if (!fromPanel && stageTransition > 0) {
          return { ...toPanel, opacity: stageTransition };
        }
        return toPanel;
      });

      // Add panels from old layout that are disappearing
      if (stageTransition > 0) {
        for (const fromPanel of layoutFrom) {
          if (!layoutTo.find(p => p.id === fromPanel.id)) {
            panels.push({ ...fromPanel, opacity: 1 - stageTransition });
          }
        }
      }

      // Draw panels
      for (const panel of panels) {
        if (panel.id === 'h1') {
          const overlayData = (stage >= 3 || (nextStageRef.current && nextStageRef.current >= 3)) && showOverlay
            ? { times: data.template.times, strain: data.template.strain, colour: COLOURS.TEMPLATE, offset: templateOffset }
            : undefined;

          drawWaveform(ctx, panel, data.H1.times, data.H1.strain, COLOURS.H1_STRAIN, playheadTime, {
            label: 'H1 \u2014 LIGO Hanford, Washington',
            showPlayhead: true,
            overlay: overlayData,
          });
        } else if (panel.id === 'l1') {
          const overlayData = (stage >= 3 || (nextStageRef.current && nextStageRef.current >= 3)) && showOverlay
            ? { times: data.template.times, strain: data.template.strain, colour: COLOURS.TEMPLATE, offset: templateOffset + data.event.timeLag }
            : undefined;

          drawWaveform(ctx, panel, data.L1.times, data.L1.strain, COLOURS.L1_STRAIN, playheadTime, {
            label: 'L1 \u2014 LIGO Livingston, Louisiana',
            showPlayhead: true,
            overlay: overlayData,
          });
        } else if (panel.id === 'template') {
          drawWaveform(ctx, panel, data.template.times, data.template.strain, COLOURS.TEMPLATE, playheadTime, {
            label: 'Template \u2014 General Relativity prediction',
            showPlayhead: true,
          });
        } else if (panel.id === 'spectrogram') {
          drawSpectrogram(ctx, panel, data.spectrogram, playheadTime);
        } else if (panel.id === 'orbital') {
          drawOrbitalDiagram(ctx, panel, data.orbital, playheadTime, data.event);
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isLoading, stage, stageTransition, playheadTime, showOverlay, templateOffset, soundOn, stopPlayback]);

  // Handle scrub slider
  const handleScrub = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPlaying) {
      stopPlayback();
    }
    setPlayheadTime(parseInt(e.target.value) / 1000);

    // Update audio frequency while scrubbing
    if (soundOn && audioRef.current && dataRef.current) {
      const t = parseInt(e.target.value) / 1000;
      const tIdx = findNearestIndex(dataRef.current.orbital.times, t);
      const freq = dataRef.current.orbital.frequency[tIdx];
      audioRef.current.start();
      audioRef.current.update(freq, 0.5);
    }
  }, [isPlaying, soundOn, stopPlayback]);

  const handleScrubEnd = useCallback(() => {
    if (soundOn && audioRef.current && !isPlaying) {
      audioRef.current.stop();
    }
  }, [soundOn, isPlaying]);

  return (
    <div ref={containerRef} className={`relative bg-[#050508] ${className}`}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-white/50 text-sm font-mono animate-pulse">
            Loading gravitational wave data...
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />

      {/* Stage text overlay */}
      {!isLoading && (
        <div className="absolute top-3 left-4 right-4 z-10">
          <p className="text-[11px] md:text-xs text-white/60 leading-relaxed max-w-2xl">
            {STAGE_TEXT[stage].main}
          </p>
          {STAGE_TEXT[stage].sub && (
            <p className="text-[9px] md:text-[10px] text-white/30 mt-1">
              {STAGE_TEXT[stage].sub}
            </p>
          )}
        </div>
      )}

      {/* SNR display (stage 3+) */}
      {stage >= 3 && displayedSNR > 0 && (
        <div className="absolute top-14 right-4 z-10 text-right">
          <div className="text-[9px] font-mono text-white/30 uppercase tracking-wider">
            Signal-to-Noise
          </div>
          <div className="text-2xl font-mono text-white/80 tabular-nums">
            {displayedSNR}
          </div>
        </div>
      )}

      {/* Scrub slider */}
      {!isLoading && (
        <div className="absolute bottom-14 left-4 right-4 z-10">
          <input
            type="range"
            min={TIME_RANGE[0] * 1000}
            max={TIME_RANGE[1] * 1000}
            value={playheadTime * 1000}
            onChange={handleScrub}
            onMouseUp={handleScrubEnd}
            onTouchEnd={handleScrubEnd}
            className="w-full h-1 appearance-none bg-white/10 rounded-full cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-white/80
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-white/80
                       [&::-moz-range-thumb]:border-0
                       [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-[8px] font-mono text-white/20 mt-1">
            <span>{(TIME_RANGE[0] * 1000).toFixed(0)} ms</span>
            <span className="text-white/40">{(playheadTime * 1000).toFixed(1)} ms</span>
            <span>{(TIME_RANGE[1] * 1000).toFixed(0)} ms</span>
          </div>
        </div>
      )}

      {/* Stage advance button (stages 1-3) */}
      {!isLoading && stage < 4 && stageTransition === 0 && (
        <button
          onClick={advanceStage}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20
                     px-5 py-2 bg-white/5 hover:bg-white/10
                     border border-white/10 hover:border-white/20
                     rounded-full text-[11px] text-white/70 hover:text-white/90
                     transition-all duration-300
                     flex items-center gap-2"
        >
          {STAGE_BUTTONS[stage]}
          <span className="text-white/30" aria-hidden="true">&rarr;</span>
        </button>
      )}

      {/* Stage 4 controls */}
      {!isLoading && stage === 4 && stageTransition === 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20
                        flex items-center gap-2 bg-black/60 backdrop-blur-xl
                        border border-white/8 rounded-full px-3 py-1.5">
          <button
            onClick={togglePlayback}
            className={`w-7 h-7 flex items-center justify-center rounded-full
                        transition-all duration-300 text-sm
                        ${isPlaying ? 'bg-white/15 text-white/90' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '\u23F8' : '\u25B6'}
          </button>
          <button
            onClick={toggleSound}
            className={`w-7 h-7 flex items-center justify-center rounded-full
                        transition-all duration-300 text-sm
                        ${soundOn ? 'text-white/80' : 'text-white/25 hover:text-white/40'}`}
            title={soundOn ? 'Mute' : 'Unmute'}
          >
            {soundOn ? '\uD83D\uDD0A' : '\uD83D\uDD07'}
          </button>
          <div className="w-px h-4 bg-white/10" />
          <button
            onClick={resetToStage1}
            className="text-[9px] text-white/30 hover:text-white/50 px-2 transition-colors"
          >
            \u21BB Reset
          </button>
        </div>
      )}
    </div>
  );
}
