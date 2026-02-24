'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Exoplanet, ViewMode, SortOption, FilterState, getFacilityColour, getPlanetType, isInHabitableZone } from './lib/types';
import TransitCard from './components/TransitCard';
import ExpandedCard from './components/ExpandedCard';

const ExoplanetVisualization = dynamic(
  () => import('./components/ExoplanetVisualization'),
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

export default function ExoplanetTransitPage() {
  // Data state
  const [planets, setPlanets] = useState<Exoplanet[]>([]);
  const [featuredPlanets, setFeaturedPlanets] = useState<Exoplanet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [view, setView] = useState<ViewMode>('sky');
  const [sortBy, setSortBy] = useState<SortOption>('depth');
  const [filter, setFilter] = useState<FilterState>({ facility: null, type: null });
  const [highlightedPlanet, setHighlightedPlanet] = useState<string | null>(null);
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);

  const galleryRef = useRef<HTMLDivElement>(null);

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const [planetsRes, featuredRes] = await Promise.all([
          fetch('/data/exoplanets/planets.json'),
          fetch('/data/exoplanets/featured.json'),
        ]);

        if (!planetsRes.ok || !featuredRes.ok) {
          throw new Error('Failed to load planet data');
        }

        const planetsData = await planetsRes.json();
        const featuredData = await featuredRes.json();

        setPlanets(planetsData);
        setFeaturedPlanets(featuredData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load exoplanet data');
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Sort and filter featured planets
  const displayedPlanets = useMemo(() => {
    let filtered = [...featuredPlanets];

    // Apply facility filter
    if (filter.facility) {
      filtered = filtered.filter(p =>
        p.disc_facility?.toLowerCase().includes(filter.facility!.toLowerCase())
      );
    }

    // Apply type filter
    if (filter.type) {
      if (filter.type === 'habitable') {
        filtered = filtered.filter(p => isInHabitableZone(p.pl_eqt));
      } else {
        filtered = filtered.filter(p => getPlanetType(p.pl_rade) === filter.type);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'depth':
          return (b.pl_trandep ?? 0) - (a.pl_trandep ?? 0);
        case 'radius':
          return (b.pl_rade ?? 0) - (a.pl_rade ?? 0);
        case 'period':
          return (a.pl_orbper ?? 0) - (b.pl_orbper ?? 0);
        case 'year':
          return (a.disc_year ?? 0) - (b.disc_year ?? 0);
        case 'temperature':
          return (b.pl_eqt ?? 0) - (a.pl_eqt ?? 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [featuredPlanets, sortBy, filter]);

  // Handle planet click from visualization
  const handleVisualizationClick = useCallback((name: string) => {
    // Find the planet in featured list
    const planet = featuredPlanets.find(p => p.pl_name === name);
    if (planet) {
      setExpandedPlanet(name);
    } else {
      // Scroll to gallery and highlight
      setHighlightedPlanet(name);
    }
  }, [featuredPlanets]);

  // Handle card click
  const handleCardClick = useCallback((name: string) => {
    setExpandedPlanet(name);
  }, []);

  // Navigation for expanded card
  const expandedIndex = expandedPlanet
    ? displayedPlanets.findIndex(p => p.pl_name === expandedPlanet)
    : -1;

  const handlePrevious = useCallback(() => {
    if (expandedIndex > 0) {
      setExpandedPlanet(displayedPlanets[expandedIndex - 1].pl_name);
    }
  }, [expandedIndex, displayedPlanets]);

  const handleNext = useCallback(() => {
    if (expandedIndex < displayedPlanets.length - 1) {
      setExpandedPlanet(displayedPlanets[expandedIndex + 1].pl_name);
    }
  }, [expandedIndex, displayedPlanets]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (expandedPlanet) return; // Let ExpandedCard handle its own keys

      switch (e.key) {
        case '1':
          setView('sky');
          break;
        case '2':
          setView('scatter');
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expandedPlanet]);

  if (isLoading) {
    return (
      <main className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4' />
          <p className='text-white/60'>Loading exoplanet data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center text-white'>
          <p className='text-white/70 mb-4'>{error}</p>
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
              Shadows of Other Worlds
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              {planets.length.toLocaleString()} planets, discovered by the shadows they cast
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              Every confirmed exoplanet discovered by the transit method was found by its shadow &mdash;
              a tiny dip in starlight as the planet crosses its host star. Each dip is a fingerprint:
              its depth tells you the planet&apos;s size, its duration tells you the orbital speed.
              Explore the full catalogue on the sky, then reorganise by size and period to see
              the hidden structure of the exoplanet population.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive Visualisation</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>NASA Exoplanet Archive</span>
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
              <MetadataDropdown title='General / Space enthusiasts'>
                <p>Anyone curious about exoplanets and how we find them. The interaction reveals the signal-in-noise story that defines transit detection.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Two views of the same data: sky coordinates and parameter space. The gallery shows computed transit curves from real parameters, with optional noise overlay to show what astronomers actually measure.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>WebGL2, Canvas2D, NASA TAP API</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Data Source
              </span>
              <span className='text-sm'>
                <a
                  href='https://exoplanetarchive.ipac.caltech.edu'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[var(--color-blue)] hover:text-white transition-colors'
                >
                  NASA Exoplanet Archive
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Visualisation */}
      <section className='px-4 md:px-8 lg:px-12 pb-8'>
        {/* View toggle */}
        <div className='flex gap-2 mb-4'>
          <button
            onClick={() => setView('sky')}
            className={`px-4 py-2 text-sm font-mono transition-colors ${
              view === 'sky'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Sky Map (1)
          </button>
          <button
            onClick={() => setView('scatter')}
            className={`px-4 py-2 text-sm font-mono transition-colors ${
              view === 'scatter'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Radius vs Period (2)
          </button>
        </div>

        {/* Visualization container */}
        <div className='aspect-[16/9] bg-[#050508] border border-white/10 overflow-hidden'>
          <ExoplanetVisualization
            planets={planets}
            view={view}
            highlightedPlanet={highlightedPlanet}
            onPlanetHover={setHighlightedPlanet}
            onPlanetClick={handleVisualizationClick}
          />
        </div>

        {/* Legend */}
        <div className='flex flex-wrap gap-4 mt-4 text-xs text-white/50'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: '#F5A623' }} />
            <span>Kepler</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: '#4A9EF5' }} />
            <span>TESS</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: '#E8854A' }} />
            <span>K2</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: '#5ECE7B' }} />
            <span>Ground-based</span>
          </div>
        </div>
      </section>

      {/* Transit Gallery */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Transit Gallery
          </h2>

          {/* Sort and Filter controls */}
          <div className='flex flex-wrap gap-3'>
            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className='bg-transparent border border-white/20 text-sm px-3 py-1.5 text-white/80
                focus:outline-none focus:border-white/40'
            >
              <option value='depth'>Sort by Depth</option>
              <option value='radius'>Sort by Radius</option>
              <option value='period'>Sort by Period</option>
              <option value='year'>Sort by Discovery Year</option>
              <option value='temperature'>Sort by Temperature</option>
            </select>

            {/* Facility filter */}
            <select
              value={filter.facility ?? ''}
              onChange={(e) => setFilter(f => ({ ...f, facility: e.target.value || null }))}
              className='bg-transparent border border-white/20 text-sm px-3 py-1.5 text-white/80
                focus:outline-none focus:border-white/40'
            >
              <option value=''>All Facilities</option>
              <option value='kepler'>Kepler</option>
              <option value='tess'>TESS</option>
              <option value='k2'>K2</option>
            </select>

            {/* Type filter */}
            <select
              value={filter.type ?? ''}
              onChange={(e) => setFilter(f => ({ ...f, type: e.target.value || null }))}
              className='bg-transparent border border-white/20 text-sm px-3 py-1.5 text-white/80
                focus:outline-none focus:border-white/40'
            >
              <option value=''>All Types</option>
              <option value='Gas Giant'>Gas Giants</option>
              <option value='Sub-Neptune'>Sub-Neptunes</option>
              <option value='Super-Earth'>Super-Earths</option>
              <option value='Terrestrial'>Terrestrial</option>
              <option value='habitable'>Habitable Zone</option>
            </select>
          </div>
        </div>

        {/* Gallery grid */}
        <div
          ref={galleryRef}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'
        >
          {displayedPlanets.map((planet) => (
            <TransitCard
              key={planet.pl_name}
              planet={planet}
              onClick={() => handleCardClick(planet.pl_name)}
              isHighlighted={planet.pl_name === highlightedPlanet}
            />
          ))}
        </div>

        {displayedPlanets.length === 0 && (
          <p className='text-center text-white/50 py-12'>
            No planets match the current filters.
          </p>
        )}
      </section>

      {/* Expanded Card Modal */}
      {expandedPlanet && (
        <ExpandedCard
          planet={displayedPlanets.find(p => p.pl_name === expandedPlanet)!}
          onClose={() => setExpandedPlanet(null)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={expandedIndex > 0}
          hasNext={expandedIndex < displayedPlanets.length - 1}
        />
      )}

      {/* Content sections */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid lg:grid-cols-[7fr_3fr] gap-12 lg:gap-16'>
          {/* Main content */}
          <div className='space-y-12'>
            <div>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tight mb-6'>
                How Transit Detection Works
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  When a planet passes in front of its star as seen from Earth, it blocks a tiny
                  fraction of the starlight. For a Jupiter-sized planet orbiting a Sun-like star,
                  this causes about a 1% dip. For an Earth-sized planet, the dip is only 0.01% &mdash;
                  one part in ten thousand.
                </p>
                <p>
                  The depth of the transit tells us the ratio of the planet&apos;s cross-sectional area
                  to the star&apos;s: deeper dips mean bigger planets. The duration tells us how fast
                  the planet is moving &mdash; which, combined with the orbital period, reveals
                  the distance from the star.
                </p>
                <p>
                  Toggle &quot;Show Raw Data&quot; on any card to see what astronomers actually measure:
                  the clean model curve buried in noise from stellar variability, instrumental effects,
                  and photon counting statistics. Small planets require folding dozens of transits
                  together before the signal emerges from the noise.
                </p>
              </div>
            </div>

            <div>
              <h2 className='text-2xl md:text-3xl font-bold tracking-tight mb-6'>
                What the Population Reveals
              </h2>
              <div className='space-y-4 text-white/70 leading-relaxed'>
                <p>
                  Switch to the &quot;Radius vs Period&quot; view to see the exoplanet population structure.
                  Hot Jupiters cluster in the upper-left: large planets on short orbits, easy to detect
                  because they create deep, frequent transits. The Kepler mission revealed they&apos;re
                  actually quite rare &mdash; only about 1% of Sun-like stars host one.
                </p>
                <p>
                  The most common type of planet is the &quot;sub-Neptune&quot; &mdash; between 2 and 4 Earth
                  radii, with no analogue in our Solar System. Notice the &quot;radius gap&quot; around
                  1.8 Earth radii: planets seem to cluster either above or below this line, likely
                  because atmospheric mass loss strips some planets of their envelopes.
                </p>
                <p>
                  The habitable zone &mdash; where liquid water could exist &mdash; sits at longer
                  orbital periods. These planets transit less frequently and show shallower dips,
                  making them the hardest to find. The TRAPPIST-1 system is exceptional: seven
                  Earth-sized planets, three in the habitable zone, all transiting a small, dim star.
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
                This visualisation uses the NASA Exoplanet Archive&apos;s Planetary Systems
                Composite Parameters table, which compiles the best-available measurements
                for each confirmed planet. Transit light curves are computed from the
                archived parameters using the Mandel &amp; Agol (2002) analytic formalism.
              </p>
            </div>
            <div>
              <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                Resources
              </h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a
                    href='https://exoplanetarchive.ipac.caltech.edu'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--color-blue)] hover:text-white transition-colors'
                  >
                    NASA Exoplanet Archive
                  </a>
                  <span className='text-white/40'> &mdash; The full catalogue</span>
                </li>
                <li>
                  <a
                    href='https://exoplanets.nasa.gov'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--color-blue)] hover:text-white transition-colors'
                  >
                    NASA Exoplanet Exploration
                  </a>
                  <span className='text-white/40'> &mdash; Overview and latest discoveries</span>
                </li>
                <li>
                  <a
                    href='https://www.astro.ex.ac.uk/people/alapini/Publications/PhD_chap1.pdf'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[var(--color-blue)] hover:text-white transition-colors'
                  >
                    Transit Light Curve Tutorial
                  </a>
                  <span className='text-white/40'> &mdash; The mathematics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
