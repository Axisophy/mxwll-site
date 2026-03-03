'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import MetadataDropdown from '@/components/MetadataDropdown'
import { Exoplanet, ViewMode, SortOption, FilterState, getPlanetType, isInHabitableZone } from '@/visualisers/exoplanet-transit/core/lib/types'
import TransitCard from '@/visualisers/exoplanet-transit/core/components/TransitCard'
import ExpandedCard from '@/visualisers/exoplanet-transit/core/components/ExpandedCard'

const ExoplanetVisualization = dynamic(
  () => import('@/visualisers/exoplanet-transit/core/components/ExoplanetVisualization'),
  { ssr: false }
)

export default function ExoplanetSystemsPage() {
  // Data state
  const [planets, setPlanets] = useState<Exoplanet[]>([])
  const [featuredPlanets, setFeaturedPlanets] = useState<Exoplanet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [view, setView] = useState<ViewMode>('sky')
  const [sortBy, setSortBy] = useState<SortOption>('depth')
  const [filter, setFilter] = useState<FilterState>({ facility: null, type: null })
  const [highlightedPlanet, setHighlightedPlanet] = useState<string | null>(null)
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null)

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const [planetsRes, featuredRes] = await Promise.all([
          fetch('/data/exoplanets/planets.json'),
          fetch('/data/exoplanets/featured.json'),
        ])
        if (!planetsRes.ok || !featuredRes.ok) throw new Error('Failed to load planet data')
        const planetsData = await planetsRes.json()
        const featuredData = await featuredRes.json()
        setPlanets(planetsData)
        setFeaturedPlanets(featuredData)
        setIsLoading(false)
      } catch {
        setError('Failed to load exoplanet data')
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Sort and filter featured planets
  const displayedPlanets = useMemo(() => {
    let filtered = [...featuredPlanets]
    if (filter.facility) {
      filtered = filtered.filter(p =>
        p.disc_facility?.toLowerCase().includes(filter.facility!.toLowerCase())
      )
    }
    if (filter.type) {
      if (filter.type === 'habitable') {
        filtered = filtered.filter(p => isInHabitableZone(p.pl_eqt))
      } else {
        filtered = filtered.filter(p => getPlanetType(p.pl_rade) === filter.type)
      }
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'depth': return (b.pl_trandep ?? 0) - (a.pl_trandep ?? 0)
        case 'radius': return (b.pl_rade ?? 0) - (a.pl_rade ?? 0)
        case 'period': return (a.pl_orbper ?? 0) - (b.pl_orbper ?? 0)
        case 'year': return (a.disc_year ?? 0) - (b.disc_year ?? 0)
        case 'temperature': return (b.pl_eqt ?? 0) - (a.pl_eqt ?? 0)
        default: return 0
      }
    })
    return filtered
  }, [featuredPlanets, sortBy, filter])

  const handleVisualizationClick = useCallback((name: string) => {
    const planet = featuredPlanets.find(p => p.pl_name === name)
    if (planet) {
      setExpandedPlanet(name)
    } else {
      setHighlightedPlanet(name)
    }
  }, [featuredPlanets])

  const handleCardClick = useCallback((name: string) => {
    setExpandedPlanet(name)
  }, [])

  const expandedIndex = expandedPlanet
    ? displayedPlanets.findIndex(p => p.pl_name === expandedPlanet)
    : -1

  const handlePrevious = useCallback(() => {
    if (expandedIndex > 0) setExpandedPlanet(displayedPlanets[expandedIndex - 1].pl_name)
  }, [expandedIndex, displayedPlanets])

  const handleNext = useCallback(() => {
    if (expandedIndex < displayedPlanets.length - 1) setExpandedPlanet(displayedPlanets[expandedIndex + 1].pl_name)
  }, [expandedIndex, displayedPlanets])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (expandedPlanet) return
      switch (e.key) {
        case '1': setView('sky'); break
        case '2': setView('scatter'); break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [expandedPlanet])

  return (
    <main className="min-h-screen bg-white">
      {/* Header with Metadata Sidebar */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left column */}
          <div className="lg:col-span-2">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-[-0.03em] leading-[1.1]">
              Exoplanet Systems
            </h1>
            <p className="font-nhg text-lg md:text-xl lg:text-2xl font-normal text-[var(--text-secondary)] mt-2">
              {isLoading ? 'Loading...' : `${planets.length.toLocaleString()} planets, discovered by the shadows they cast`}
            </p>
            <p className="font-nhg text-base text-[var(--text-secondary)] max-w-3xl mt-6 md:mt-8 lg:mt-12">
              Every confirmed exoplanet discovered by the transit method was found by its shadow - a tiny dip in starlight as the planet crosses its host star. Each dip is a fingerprint: its depth tells you the planet&apos;s size, its duration tells you the orbital speed. Explore the full catalogue on the sky, then reorganise by size and period to see the hidden structure of the exoplanet population.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8">
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Interactive</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">NASA Data</span>
              <span className="px-3 py-1 text-xs bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">Astronomy</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className="space-y-6">
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">Category</span>
              <span className="font-nhg text-sm">Scientific Data Visualisation</span>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">Audience</span>
              <MetadataDropdown title="General / Space enthusiasts">
                <p>Anyone curious about exoplanets and how we find them. The interaction reveals the signal-in-noise story that defines transit detection.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">Approach</span>
              <MetadataDropdown>
                <p>Two views of the same data: sky coordinates and parameter space. The gallery shows computed transit curves from real parameters, with optional noise overlay to show what astronomers actually measure.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">Technology</span>
              <span className="font-nhg text-sm">WebGL2, Canvas 2D, NASA TAP API</span>
            </div>
            <div>
              <span className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">Data</span>
              <span className="font-nhg text-sm text-[var(--text-secondary)]">NASA Exoplanet Archive</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visualisation */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        {/* View toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView('sky')}
            className={`font-nhg px-4 py-2 text-sm rounded transition-colors ${
              view === 'sky'
                ? 'bg-[var(--text-primary)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            Sky Map (1)
          </button>
          <button
            onClick={() => setView('scatter')}
            className={`font-nhg px-4 py-2 text-sm rounded transition-colors ${
              view === 'scatter'
                ? 'bg-[var(--text-primary)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            Radius vs Period (2)
          </button>
        </div>

        {/* Visualisation container */}
        <div className="rounded-xl bg-[#03060f] overflow-hidden">
          <div className="aspect-[16/9]">
            {!isLoading && !error && (
              <ExoplanetVisualization
                planets={planets}
                view={view}
                highlightedPlanet={highlightedPlanet}
                onPlanetHover={setHighlightedPlanet}
                onPlanetClick={handleVisualizationClick}
              />
            )}
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white/60 font-nhg text-sm">Loading exoplanet data...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-white/70 mb-4 font-nhg">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 border border-white/20 hover:bg-white/10 transition-colors font-nhg text-sm"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs font-nhg text-[var(--text-tertiary)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F5A623' }} />
            <span>Kepler</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4A9EF5' }} />
            <span>TESS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E8854A' }} />
            <span>K2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5ECE7B' }} />
            <span>Ground-based</span>
          </div>
        </div>
      </section>

      {/* Transit Gallery */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em]">
            Transit Gallery
          </h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="font-nhg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm px-3 py-1.5 text-[var(--text-secondary)] rounded focus:outline-none"
            >
              <option value="depth">Sort by Depth</option>
              <option value="radius">Sort by Radius</option>
              <option value="period">Sort by Period</option>
              <option value="year">Sort by Discovery Year</option>
              <option value="temperature">Sort by Temperature</option>
            </select>
            <select
              value={filter.facility ?? ''}
              onChange={(e) => setFilter(f => ({ ...f, facility: e.target.value || null }))}
              className="font-nhg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm px-3 py-1.5 text-[var(--text-secondary)] rounded focus:outline-none"
            >
              <option value="">All Facilities</option>
              <option value="kepler">Kepler</option>
              <option value="tess">TESS</option>
              <option value="k2">K2</option>
            </select>
            <select
              value={filter.type ?? ''}
              onChange={(e) => setFilter(f => ({ ...f, type: e.target.value || null }))}
              className="font-nhg bg-[var(--bg-secondary)] border border-[var(--border)] text-sm px-3 py-1.5 text-[var(--text-secondary)] rounded focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Gas Giant">Gas Giants</option>
              <option value="Sub-Neptune">Sub-Neptunes</option>
              <option value="Super-Earth">Super-Earths</option>
              <option value="Terrestrial">Terrestrial</option>
              <option value="habitable">Habitable Zone</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {displayedPlanets.map((planet) => (
            <TransitCard
              key={planet.pl_name}
              planet={planet}
              onClick={() => handleCardClick(planet.pl_name)}
              isHighlighted={planet.pl_name === highlightedPlanet}
            />
          ))}
        </div>

        {displayedPlanets.length === 0 && !isLoading && (
          <p className="text-center text-[var(--text-tertiary)] py-12 font-nhg">
            No planets match the current filters.
          </p>
        )}
      </section>

      {/* Expanded Card Modal */}
      {expandedPlanet && displayedPlanets.find(p => p.pl_name === expandedPlanet) && (
        <ExpandedCard
          planet={displayedPlanets.find(p => p.pl_name === expandedPlanet)!}
          onClose={() => setExpandedPlanet(null)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={expandedIndex > 0}
          hasNext={expandedIndex < displayedPlanets.length - 1}
        />
      )}

      {/* How Transit Detection Works */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            How Transit Detection Works
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              When a planet passes in front of its star as seen from Earth, it blocks a tiny fraction of the starlight. For a Jupiter-sized planet orbiting a Sun-like star, this causes about a 1% dip. For an Earth-sized planet, the dip is only 0.01% - one part in ten thousand.
            </p>
            <p>
              The depth of the transit tells us the ratio of the planet&apos;s cross-sectional area to the star&apos;s: deeper dips mean bigger planets. The duration tells us how fast the planet is moving - which, combined with the orbital period, reveals the distance from the star.
            </p>
            <p>
              Toggle &quot;Show Raw Data&quot; on any card to see what astronomers actually measure: the clean model curve buried in noise from stellar variability, instrumental effects, and photon counting statistics. Small planets require folding dozens of transits together before the signal emerges from the noise.
            </p>
          </div>
        </div>
      </section>

      {/* What the Population Reveals */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            What the Population Reveals
          </h2>
          <div className="space-y-4 font-nhg text-[var(--text-secondary)] leading-relaxed">
            <p>
              Switch to the &quot;Radius vs Period&quot; view to see the exoplanet population structure. Hot Jupiters cluster in the upper-left: large planets on short orbits, easy to detect because they create deep, frequent transits. The Kepler mission revealed they&apos;re actually quite rare - only about 1% of Sun-like stars host one.
            </p>
            <p>
              The most common type of planet is the &quot;sub-Neptune&quot; - between 2 and 4 Earth radii, with no analogue in our Solar System. Notice the &quot;radius gap&quot; around 1.8 Earth radii: planets seem to cluster either above or below this line, likely because atmospheric mass loss strips some planets of their envelopes.
            </p>
            <p>
              The habitable zone - where liquid water could exist - sits at longer orbital periods. These planets transit less frequently and show shallower dips, making them the hardest to find. The TRAPPIST-1 system is exceptional: seven Earth-sized planets, three in the habitable zone, all transiting a small, dim star.
            </p>
          </div>
        </div>
      </section>

      {/* Further Exploration */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24 pt-16 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-[-0.03em]">
            Further Exploration
          </h2>
          <div>
            <div className="space-y-8">
              <div>
                <h3 className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Data Source
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="https://exoplanetarchive.ipac.caltech.edu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      NASA Exoplanet Archive
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">The full catalogue</span>
                  </li>
                  <li>
                    <a
                      href="https://exoplanets.nasa.gov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-primary)] hover:underline"
                    >
                      NASA Exoplanet Exploration
                    </a>
                    <span className="text-[var(--text-tertiary)] ml-2">Overview and latest discoveries</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-nhg text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
                  Related Work
                </h3>
                <ul className="space-y-2 text-sm font-nhg">
                  <li>
                    <a
                      href="/work/stellar-cartography"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Stellar Cartography &rarr;
                    </a>
                  </li>
                  <li>
                    <a
                      href="/work/stellar-evolution"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Stellar Evolution &rarr;
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
