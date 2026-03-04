'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { SOLAR_SYSTEM, REFERENCE_DIAMETER, REFERENCE_FILL, PlanetData } from './data'
import PlanetSVG from './PlanetSVG'

// Moon appears on Earth's slide, not as its own slide
const SLIDES = SOLAR_SYSTEM.filter(p => p.id !== 'moon')
const MOON_DATA = SOLAR_SYSTEM.find(p => p.id === 'moon')!

export default function SolarSystemScale() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showFact, setShowFact] = useState(false)
  const [containerHeight, setContainerHeight] = useState(500)

  // Measure container height for sizing planets
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const rect = container.getBoundingClientRect()
      if (rect.height > 0) setContainerHeight(rect.height)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  // Calculate pixel size for a planet body
  const referenceSize = containerHeight * REFERENCE_FILL
  const getPlanetSize = useCallback((diameter: number) => {
    return (diameter / REFERENCE_DIAMETER) * referenceSize
  }, [referenceSize])

  // Track scroll position to determine active planet
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft
      const slideWidth = el.clientWidth
      if (slideWidth === 0) return
      const index = Math.round(scrollLeft / slideWidth)
      const clamped = Math.min(index, SLIDES.length - 1)
      setActiveIndex(prev => {
        if (prev !== clamped) setShowFact(false)
        return clamped
      })
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const el = scrollRef.current
      if (!el) return

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        const next = Math.min(activeIndex + 1, SLIDES.length - 1)
        el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = Math.max(activeIndex - 1, 0)
        el.scrollTo({ left: prev * el.clientWidth, behavior: 'smooth' })
      } else if (e.key === 'Escape') {
        setShowFact(false)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeIndex])

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
  }

  const activePlanet = SLIDES[activeIndex]

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden select-none"
      style={{ height: '72vh', minHeight: '480px', maxHeight: '800px', background: '#F8F8FA' }}
    >
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory h-full scrollbar-hide"
      >
        {SLIDES.map((planet) => {
          const size = getPlanetSize(planet.diameter)
          const moonSize = getPlanetSize(MOON_DATA.diameter)
          return (
            <div
              key={planet.id}
              className="snap-center flex-shrink-0 w-full h-full flex items-center justify-center relative"
              onClick={() => setShowFact(f => !f)}
              role="button"
              tabIndex={0}
              aria-label={`${planet.name} - tap for details`}
            >
              {/* Planet */}
              <div className="relative flex items-center justify-center" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <PlanetSVG id={planet.id} size={size} />
                {/* For Earth, show Moon nearby */}
                {planet.id === 'earth' && (
                  <div
                    className="absolute"
                    style={{
                      top: `calc(50% - ${size * 0.8}px)`,
                      left: `calc(50% + ${size * 1.5}px)`,
                    }}
                  >
                    <PlanetSVG id="moon" size={moonSize} />
                    <p className="font-nhg text-[8px] md:text-[10px] text-gray-400 text-center mt-1 whitespace-nowrap">
                      Moon
                    </p>
                  </div>
                )}
              </div>

              {/* Planet label at bottom */}
              <div className="absolute bottom-16 md:bottom-20 left-0 right-0 text-center pointer-events-none px-4">
                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] text-gray-900">
                  {planet.name}
                </h3>
                <p className="font-nhg text-sm md:text-base text-gray-500 mt-1">
                  {planet.diameter.toLocaleString()} km diameter
                </p>
                <p className="font-nhg text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  {planet.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center gap-1.5 z-10">
        {SLIDES.map((planet, i) => (
          <button
            key={planet.id}
            onClick={(e) => {
              e.stopPropagation()
              scrollToIndex(i)
              setShowFact(false)
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'w-6 bg-gray-900'
                : 'w-2 bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Go to ${planet.name}`}
          />
        ))}
      </div>

      {/* Left/Right arrows (desktop) */}
      {activeIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            scrollToIndex(activeIndex - 1)
            setShowFact(false)
          }}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm text-gray-600 hover:text-gray-900 transition-colors z-10"
          aria-label="Previous planet"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {activeIndex < SLIDES.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            scrollToIndex(activeIndex + 1)
            setShowFact(false)
          }}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm text-gray-600 hover:text-gray-900 transition-colors z-10"
          aria-label="Next planet"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Planet counter + swipe hint */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <p className="font-label text-[10px] text-gray-400">
          {activeIndex + 1} / {SLIDES.length}
        </p>
        {activeIndex === 0 && (
          <p className="font-nhg text-xs text-gray-400 md:hidden flex items-center gap-1">
            Swipe
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </p>
        )}
      </div>

      {/* Fact card */}
      {showFact && (
        <FactCard planet={activePlanet} onClose={() => setShowFact(false)} />
      )}
    </div>
  )
}

// ─── Fact Card ────────────────────────────────────────────────────────────────

function FactCard({ planet, onClose }: { planet: PlanetData; onClose: () => void }) {
  // Close on outside click handled by parent

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 animate-slideUp"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mx-3 mb-3 md:mx-6 md:mb-6 bg-white rounded-2xl shadow-lg p-5 md:p-6 max-w-lg md:mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h4 className="font-display text-xl md:text-2xl font-bold tracking-[-0.03em] text-gray-900 pr-8">
          {planet.name}
        </h4>
        <p className="font-nhg text-sm text-gray-600 mt-1">
          {planet.funComparison}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="font-label text-[10px] text-gray-400 uppercase tracking-wider">Diameter</p>
            <p className="font-display text-lg font-bold tracking-[-0.03em] text-gray-900 mt-0.5">
              {planet.diameter.toLocaleString()} km
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="font-label text-[10px] text-gray-400 uppercase tracking-wider">Distance from Sun</p>
            <p className="font-display text-lg font-bold tracking-[-0.03em] text-gray-900 mt-0.5">
              {planet.distanceFromSun === 0
                ? '—'
                : `${planet.distanceFromSun.toLocaleString()}M km`
              }
            </p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-3 mt-3">
          <p className="font-nhg text-sm text-amber-900 leading-relaxed">
            {planet.fact}
          </p>
        </div>
      </div>
    </div>
  )
}
