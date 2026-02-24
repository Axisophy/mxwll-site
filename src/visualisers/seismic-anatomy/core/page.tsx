'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  EarthModel,
  RayPath,
  TravelTimes,
  VelocityPoint,
  Station,
  Seismogram,
  SeismicEvent,
  formatTime,
} from './lib/types';

const EarthCrossSection = dynamic(
  () => import('./components/EarthCrossSection'),
  { ssr: false }
);

const SeismogramPanel = dynamic(
  () => import('./components/SeismogramPanel'),
  { ssr: false }
);

const VelocityProfile = dynamic(
  () => import('./components/VelocityProfile'),
  { ssr: false }
);

function MetadataDropdown({ title, children }: { title?: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center ${title ? 'justify-between w-full' : ''} text-left`}
      >
        {title && <span className='text-sm'>{title}</span>}
        <svg
          className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='square' strokeLinejoin='miter' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>
      {isOpen && (
        <div className='text-xs text-white/60 mt-2 leading-relaxed space-y-2'>
          {children}
        </div>
      )}
    </div>
  );
}

// Animation duration in earthquake seconds
const DURATION = 1800;  // 30 minutes of earthquake time

// Annotation triggers
const ANNOTATIONS = [
  { time: 0, text: 'Magnitude 9.1 earthquake off the coast of Japan, March 11, 2011' },
  { time: 50, text: 'P-waves travel at ~8 km/s through the upper mantle' },
  { time: 100, text: 'S-waves follow — about 1.7× slower than P' },
  { time: 350, text: 'At the core-mantle boundary, everything changes...' },
  { time: 400, text: "S-waves can't travel through liquid. They stop here." },
  { time: 500, text: 'The Shadow Zone — from 103° to 142°, no direct waves arrive' },
  { time: 900, text: 'PKP waves — P-waves that traveled through the core' },
  { time: 1200, text: 'These waves passed through the inner core — proving it is solid' },
];

export default function SeismicAnatomyPage() {
  // Data state
  const [earthModel, setEarthModel] = useState<EarthModel | null>(null);
  const [rayPaths, setRayPaths] = useState<RayPath[]>([]);
  const [travelTimes, setTravelTimes] = useState<TravelTimes>({});
  const [velocityProfile, setVelocityProfile] = useState<VelocityPoint[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [seismograms, setSeismograms] = useState<Seismogram[]>([]);
  const [event, setEvent] = useState<SeismicEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation state
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);  // 5x default
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // UI state
  const [visiblePhases, setVisiblePhases] = useState<string[]>(['P', 'S']);
  const [highlightedStation, setHighlightedStation] = useState<string | null>(null);
  const [currentAnnotation, setCurrentAnnotation] = useState<string>('');

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const [
          earthModelRes,
          rayPathsRes,
          travelTimesRes,
          velocityProfileRes,
          stationsRes,
          seismogramsRes,
          eventRes,
        ] = await Promise.all([
          fetch('/data/seismic/earth_model.json'),
          fetch('/data/seismic/ray_paths.json'),
          fetch('/data/seismic/travel_times.json'),
          fetch('/data/seismic/velocity_profile.json'),
          fetch('/data/seismic/stations.json'),
          fetch('/data/seismic/seismograms.json'),
          fetch('/data/seismic/event.json'),
        ]);

        if (!earthModelRes.ok) throw new Error('Failed to load earth model');

        setEarthModel(await earthModelRes.json());
        setRayPaths(await rayPathsRes.json());
        setTravelTimes(await travelTimesRes.json());
        setVelocityProfile(await velocityProfileRes.json());
        setStations(await stationsRes.json());
        setSeismograms(await seismogramsRes.json());
        setEvent(await eventRes.json());

        setIsLoading(false);
      } catch (err) {
        setError('Failed to load seismic data');
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setCurrentTime(prev => {
        const next = prev + (delta / 1000) * speed * 10;  // speed multiplier
        if (next >= DURATION) {
          setIsPlaying(false);
          return DURATION;
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  // Update annotation based on current time
  useEffect(() => {
    const annotation = ANNOTATIONS.filter(a => a.time <= currentTime).pop();
    if (annotation) {
      setCurrentAnnotation(annotation.text);
    }
  }, [currentTime]);

  // Calculate current max wavefront depth
  const currentMaxDepth = useCallback(() => {
    // Simplified: P-waves travel ~8km/s on average, estimate depth
    const avgVelocity = 10;  // km/s average through mantle
    const maxPathLength = currentTime * avgVelocity;
    // Rough approximation of depth based on path length
    return Math.min(6371, maxPathLength * 0.4);
  }, [currentTime]);

  // Handlers
  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  const handleTimeClick = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleJumpTo = useCallback((time: number) => {
    setCurrentTime(time);
    setIsPlaying(false);
  }, []);

  const togglePhase = useCallback((phase: string) => {
    setVisiblePhases(prev =>
      prev.includes(phase)
        ? prev.filter(p => p !== phase)
        : [...prev, phase]
    );
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'r':
        case 'R':
          handleReset();
          break;
        case '1':
          handleJumpTo(350);  // CMB
          break;
        case '2':
          handleJumpTo(500);  // Shadow zone
          break;
        case '3':
          handleJumpTo(900);  // PKP
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handlePlayPause, handleReset, handleJumpTo]);

  if (isLoading) {
    return (
      <main className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4' />
          <p className='text-white/60'>Loading seismic data...</p>
        </div>
      </main>
    );
  }

  if (error || !earthModel) {
    return (
      <main className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center text-white'>
          <p className='text-white/70 mb-4'>{error || 'Failed to load data'}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 border border-white/20 hover:bg-white/10 transition-colors'
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-black text-white'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              Listening to the Earth&apos;s Interior
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              How earthquakes reveal the structure of our planet
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              Every earthquake is a free CT scan of the Earth. When the ground shakes, waves radiate
              through the planet&apos;s interior. These waves bend, reflect, and — critically — stop
              at boundaries between different materials. The pattern of what arrives where, and what
              doesn&apos;t arrive, tells us everything about Earth&apos;s hidden layers.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive Visualisation</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>IRIS Seismic Data</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Explanation Design</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className='space-y-6'>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Category
              </span>
              <span className='text-sm'>Scientific Data Visualisation</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Audience
              </span>
              <MetadataDropdown title='General / Geoscience enthusiasts'>
                <p>Anyone curious about earthquakes and how we know what lies beneath. The shadow zone discovery is the key &quot;aha&quot; moment.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Three linked views: Earth cross-section with animated wavefronts, velocity profile showing the physics, and real seismograms showing what stations actually recorded.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>Canvas2D, ObsPy/TauP, IRIS DMC</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Data Source
              </span>
              <span className='text-sm'>
                <a
                  href='https://ds.iris.edu/ds/nodes/dmc/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[var(--color-blue)] hover:text-white transition-colors'
                >
                  IRIS Data Management Center
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Visualisation */}
      <section className='px-4 md:px-8 lg:px-12 pb-8'>
        {/* Event info */}
        {event && (
          <div className='mb-4 text-sm text-white/60'>
            <span className='font-medium text-white/80'>{event.name}</span>
            {' — '} M{event.magnitude} · {event.type} · {event.depth_km} km depth
          </div>
        )}

        {/* Main visualization grid */}
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-4'>
          {/* Earth cross-section */}
          <div className='aspect-square lg:aspect-auto lg:h-[500px] bg-[#050508] border border-white/10 overflow-hidden'>
            <EarthCrossSection
              earthModel={earthModel}
              rayPaths={rayPaths}
              stations={stations}
              currentTime={currentTime}
              visiblePhases={visiblePhases}
              highlightedStation={highlightedStation}
              onStationHover={setHighlightedStation}
              onStationClick={(s) => setHighlightedStation(s)}
            />
          </div>

          {/* Velocity profile sidebar */}
          <div className='hidden lg:block h-[500px] bg-[#050508] border border-white/10'>
            <VelocityProfile
              velocityProfile={velocityProfile}
              earthModel={earthModel}
              currentMaxDepth={currentMaxDepth()}
            />
          </div>
        </div>

        {/* Annotation overlay */}
        {currentAnnotation && (
          <div className='mt-4 p-3 bg-white/5 border border-white/10'>
            <p className='text-sm text-white/80'>{currentAnnotation}</p>
          </div>
        )}

        {/* Seismogram panel */}
        <div className='mt-4 h-[300px] bg-[#050508] border border-white/10'>
          <SeismogramPanel
            seismograms={seismograms}
            currentTime={currentTime}
            duration={DURATION}
            highlightedStation={highlightedStation}
            onStationHover={setHighlightedStation}
            onStationClick={(s) => setHighlightedStation(s)}
            onTimeClick={handleTimeClick}
          />
        </div>

        {/* Controls */}
        <div className='mt-4 flex flex-wrap items-center gap-4'>
          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className='px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2'
          >
            {isPlaying ? (
              <>
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                  <rect x='6' y='4' width='4' height='16' />
                  <rect x='14' y='4' width='4' height='16' />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                  <polygon points='5,3 19,12 5,21' />
                </svg>
                Play
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className='px-4 py-2 border border-white/20 hover:bg-white/10 transition-colors'
          >
            Reset
          </button>

          {/* Speed control */}
          <div className='flex items-center gap-2'>
            <span className='text-xs text-white/50'>Speed:</span>
            {[1, 2, 5, 10].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 text-xs transition-colors ${
                  speed === s ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Time display */}
          <div className='flex-1 flex items-center gap-4'>
            <input
              type='range'
              min='0'
              max={DURATION}
              value={currentTime}
              onChange={(e) => setCurrentTime(parseInt(e.target.value))}
              className='flex-1 h-1 bg-white/20 rounded appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white'
            />
            <span className='text-sm font-mono text-white/60'>
              {formatTime(currentTime)} / {formatTime(DURATION)}
            </span>
          </div>

          {/* Jump buttons */}
          <div className='flex gap-2'>
            <button
              onClick={() => handleJumpTo(350)}
              className='px-2 py-1 text-xs border border-white/20 hover:bg-white/10 transition-colors'
            >
              CMB (1)
            </button>
            <button
              onClick={() => handleJumpTo(500)}
              className='px-2 py-1 text-xs border border-white/20 hover:bg-white/10 transition-colors'
            >
              Shadow (2)
            </button>
            <button
              onClick={() => handleJumpTo(900)}
              className='px-2 py-1 text-xs border border-white/20 hover:bg-white/10 transition-colors'
            >
              PKP (3)
            </button>
          </div>
        </div>

        {/* Phase toggles */}
        <div className='mt-4 flex flex-wrap items-center gap-2'>
          <span className='text-xs text-white/50 mr-2'>Phases:</span>
          {['P', 'S', 'PKP', 'PKIKP', 'PP', 'PcP'].map(phase => (
            <button
              key={phase}
              onClick={() => togglePhase(phase)}
              className={`px-2 py-1 text-xs transition-colors ${
                visiblePhases.includes(phase)
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
              style={{
                borderLeft: `3px solid ${
                  phase.startsWith('P') ? '#0055FF' :
                  phase.startsWith('S') ? '#FF0055' : '#9933FF'
                }`
              }}
            >
              {phase}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className='mt-4 flex flex-wrap gap-4 text-xs text-white/50'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: '#0055FF' }} />
            <span>P-waves</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: '#FF0055' }} />
            <span>S-waves</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: '#9933FF' }} />
            <span>Core phases (PKP)</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-1 rounded' style={{ backgroundColor: 'rgba(255,0,85,0.3)' }} />
            <span>Shadow zone</span>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid lg:grid-cols-[7fr_3fr] gap-12 lg:gap-16'>
          {/* Main content */}
          <div className='space-y-12'>
            <div>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tight mb-6'>
                The Shadow Zone Discovery
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  In the early 1900s, seismologists noticed something strange. When a large earthquake
                  occurred, stations close to the source recorded strong waves. Stations on the far side
                  of the Earth also recorded waves. But stations in between — roughly 103° to 142° from
                  the epicentre — recorded almost nothing.
                </p>
                <p>
                  This &quot;shadow zone&quot; was the smoking gun that revealed Earth&apos;s liquid outer core.
                  S-waves (shear waves) cannot travel through liquid at all — they simply stop at the
                  core-mantle boundary. P-waves (compression waves) can pass through liquid, but the
                  sharp velocity drop at the boundary bends them away from the shadow zone.
                </p>
                <p>
                  The absence of signal IS the discovery. Structure creates silence.
                </p>
              </div>
            </div>

            <div>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tight mb-6'>
                How Seismic Waves Work
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  <strong className='text-white/90'>P-waves (Primary)</strong> are compression waves —
                  they squeeze and stretch material in the direction they travel. They can pass through
                  solids, liquids, and gases. In the mantle, they travel at 8–13 km/s.
                </p>
                <p>
                  <strong className='text-white/90'>S-waves (Secondary)</strong> are shear waves —
                  they wiggle material side-to-side, perpendicular to their travel direction. They can
                  only pass through solids. In the mantle, they travel at 4–7 km/s — about 1.7× slower
                  than P-waves.
                </p>
                <p>
                  Both wave types curve as they travel because velocity increases with depth (due to
                  increasing pressure). This is why seismic rays follow curved paths, not straight lines.
                </p>
              </div>
            </div>

            <div>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tight mb-6'>
                Earth&apos;s Hidden Layers
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  Using wave travel times from thousands of earthquakes, seismologists have mapped
                  Earth&apos;s entire interior. The crust is a thin shell, just 5–70 km thick. Below lies
                  the mantle — 2,890 km of silicate rock, slowly convecting over millions of years.
                </p>
                <p>
                  At 2,891 km depth, the core-mantle boundary marks the most dramatic transition in
                  the planet: solid rock gives way to liquid iron-nickel alloy. S-waves stop dead.
                  P-waves slow dramatically. This boundary is sharper than the line between Earth&apos;s
                  surface and the atmosphere.
                </p>
                <p>
                  And at the very centre — 5,150 km down — another surprise. In 1936, Inge Lehmann
                  noticed unexpected arrivals within the shadow zone. She proposed a solid inner core.
                  Today we know it&apos;s an iron-nickel sphere 1,221 km in radius, crystallised under
                  immense pressure despite temperatures exceeding 5,000°C.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-8'>
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                About the Data
              </h3>
              <p className='text-sm text-white/60 leading-relaxed'>
                This visualisation uses seismic data from the 2011 Tohoku-Oki earthquake (M9.1).
                Ray paths are computed using the TauP toolkit with the IASP91 velocity model.
                Seismograms show recordings from the Global Seismographic Network.
              </p>
            </div>
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Resources
              </h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a
                    href='https://ds.iris.edu/ds/nodes/dmc/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--color-blue)] hover:text-white transition-colors'
                  >
                    IRIS Data Management Center
                  </a>
                  <span className='text-white/40'> — Seismic data archive</span>
                </li>
                <li>
                  <a
                    href='https://earthquake.usgs.gov/earthquakes/eventpage/usc0001xgp'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--color-blue)] hover:text-white transition-colors'
                  >
                    USGS Event Page
                  </a>
                  <span className='text-white/40'> — Tohoku 2011 details</span>
                </li>
                <li>
                  <a
                    href='https://docs.obspy.org/packages/obspy.taup.html'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--color-blue)] hover:text-white transition-colors'
                  >
                    ObsPy TauP
                  </a>
                  <span className='text-white/40'> — Travel time computation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
