'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import {
  MISSIONS,
  DESTINATION_COLOURS,
  DESTINATION_LABELS,
  getMissionsByDecade,
  getUniqueAgencies,
  getUniqueDestinations,
  type Mission,
  type Destination,
  type Outcome,
} from './data'

// ─── Types ──────────────────────────────────────────────────────────────────

interface Filters {
  destination: Destination | null
  agency: string | null
  decade: string | null
  outcome: Outcome | null
}

// ─── Decade descriptions ────────────────────────────────────────────────────

const DECADE_SUBTITLES: Record<string, string> = {
  '1950s': 'The Space Age begins',
  '1960s': 'The Space Race',
  '1970s': 'Deep space exploration',
  '1980s': 'The Shuttle era',
  '1990s': 'Hubble, Mars, and the ISS',
  '2000s': 'The new millennium',
  '2010s': 'Private space and robotic explorers',
  '2020s': 'A new era of exploration',
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SpaceMissionTimeline() {
  const [filters, setFilters] = useState<Filters>({
    destination: null,
    agency: null,
    decade: null,
    outcome: null,
  })
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)

  const allAgencies = useMemo(() => getUniqueAgencies(MISSIONS), [])
  const allDestinations = useMemo(() => getUniqueDestinations(MISSIONS), [])

  const filteredMissions = useMemo(() => {
    return MISSIONS.filter(m => {
      if (filters.destination && m.destination !== filters.destination) return false
      if (filters.agency && m.agency !== filters.agency) return false
      if (filters.decade) {
        const year = parseInt(m.launchDate.substring(0, 4))
        const decadeStart = parseInt(filters.decade)
        if (year < decadeStart || year >= decadeStart + 10) return false
      }
      if (filters.outcome && m.outcome !== filters.outcome) return false
      return true
    })
  }, [filters])

  const decades = useMemo(() => getMissionsByDecade(filteredMissions), [filteredMissions])

  const clearFilters = () => {
    setFilters({ destination: null, agency: null, decade: null, outcome: null })
  }

  const hasFilters = Object.values(filters).some(v => v !== null)

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ background: '#03060f' }}>
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        agencies={allAgencies}
        destinations={allDestinations}
        hasFilters={hasFilters}
        onClear={clearFilters}
      />

      {/* Timeline */}
      <div className="relative px-4 md:px-8 lg:px-12 pb-12 md:pb-16 pt-4">
        {/* Central line */}
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: '28px',
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12) 80px, rgba(255,255,255,0.12) calc(100% - 80px), transparent)',
          }}
        />
        <div
          className="hidden md:block absolute top-0 bottom-0 w-px"
          style={{
            left: '50%',
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12) 80px, rgba(255,255,255,0.12) calc(100% - 80px), transparent)',
          }}
        />
        {/* Hide mobile line on desktop */}
        <style>{`@media (min-width: 768px) { .timeline-line-mobile { display: none !important; } }`}</style>

        {decades.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-nhg text-sm text-white/40">No missions match these filters.</p>
            <button
              onClick={clearFilters}
              className="font-label text-xs text-[#0055FF] mt-2 hover:text-[#3377FF] transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          decades.map(({ decade, missions }) => (
            <DecadeSection key={decade} decade={decade}>
              {missions.map((mission, i) => (
                <MissionNode
                  key={mission.id}
                  mission={mission}
                  side={i % 2 === 0 ? 'right' : 'left'}
                  onClick={() => setSelectedMission(mission)}
                />
              ))}
            </DecadeSection>
          ))
        )}

        {/* End marker */}
        {decades.length > 0 && (
          <div className="relative flex items-center justify-start md:justify-center pt-8 pb-4">
            <div className="ml-[22px] md:ml-0 w-3 h-3 rounded-full bg-white/20" />
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="px-4 md:px-8 lg:px-12 py-4 border-t border-white/5">
        <div className="flex flex-wrap gap-4 md:gap-8">
          <Stat label="Missions" value={filteredMissions.length.toString()} />
          <Stat label="Landmarks" value={filteredMissions.filter(m => m.landmark).length.toString()} />
          <Stat label="Success rate" value={`${Math.round((filteredMissions.filter(m => m.outcome === 'success').length / Math.max(filteredMissions.length, 1)) * 100)}%`} />
          <Stat label="Agencies" value={new Set(filteredMissions.map(m => m.agency)).size.toString()} />
        </div>
      </div>

      {/* Detail Panel */}
      {selectedMission && (
        <MissionDetail
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
        />
      )}
    </div>
  )
}

// ─── Stat ────────────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-label text-[9px] text-white/40 block">{label}</span>
      <span className="font-display text-lg font-bold tracking-[-0.03em] text-white/80 tabular-nums">{value}</span>
    </div>
  )
}

// ─── Filter Bar ─────────────────────────────────────────────────────────────

function FilterBar({
  filters,
  setFilters,
  agencies,
  destinations,
  hasFilters,
  onClear,
}: {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  agencies: string[]
  destinations: Destination[]
  hasFilters: boolean
  onClear: () => void
}) {
  return (
    <div className="sticky top-0 z-30 px-4 md:px-8 lg:px-12 py-3 backdrop-blur-md" style={{ background: 'rgba(3,6,15,0.85)' }}>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-label text-[9px] text-white/40 mr-1">Filter</span>

        {/* Destination */}
        <FilterSelect
          value={filters.destination || ''}
          onChange={(v) => setFilters(f => ({ ...f, destination: (v || null) as Destination | null }))}
          options={destinations.map(d => ({ value: d, label: DESTINATION_LABELS[d] }))}
          placeholder="Destination"
        />

        {/* Agency */}
        <FilterSelect
          value={filters.agency || ''}
          onChange={(v) => setFilters(f => ({ ...f, agency: v || null }))}
          options={agencies.map(a => ({ value: a, label: a }))}
          placeholder="Agency"
        />

        {/* Decade */}
        <FilterSelect
          value={filters.decade || ''}
          onChange={(v) => setFilters(f => ({ ...f, decade: v || null }))}
          options={['1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020'].map(d => ({
            value: d,
            label: `${d}s`,
          }))}
          placeholder="Decade"
        />

        {/* Outcome */}
        <FilterSelect
          value={filters.outcome || ''}
          onChange={(v) => setFilters(f => ({ ...f, outcome: (v || null) as Outcome | null }))}
          options={[
            { value: 'success', label: 'Success' },
            { value: 'partial', label: 'Partial' },
            { value: 'failure', label: 'Failure' },
          ]}
          placeholder="Outcome"
        />

        {hasFilters && (
          <button
            onClick={onClear}
            className="font-label text-[9px] text-[#0055FF] hover:text-[#3377FF] transition-colors ml-1"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-label text-[10px] text-white/70 bg-white/5 hover:bg-white/10 rounded-xl px-3 py-1.5 border-none outline-none cursor-pointer transition-colors appearance-none"
      style={{ backgroundImage: 'none' }}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

// ─── Decade Section ─────────────────────────────────────────────────────────

function DecadeSection({ decade, children }: { decade: string; children: React.ReactNode }) {
  return (
    <div className="relative pt-12 md:pt-16 first:pt-8">
      {/* Decade label */}
      <div className="relative flex items-center mb-6 md:mb-8">
        {/* Mobile: left-aligned */}
        <div className="md:hidden flex items-center gap-3 pl-1">
          <div className="w-[14px] h-[14px] rounded-full bg-white/20 border-2 border-white/10 relative z-10" />
          <div>
            <h3 className="font-display text-xl font-bold tracking-[-0.03em] text-white/90">{decade}</h3>
            {DECADE_SUBTITLES[decade] && (
              <p className="font-nhg text-xs text-white/30 mt-0.5">{DECADE_SUBTITLES[decade]}</p>
            )}
          </div>
        </div>

        {/* Desktop: centered */}
        <div className="hidden md:flex w-full items-center justify-center">
          <div className="text-center relative z-10">
            <div className="w-4 h-4 rounded-full bg-white/20 border-2 border-white/10 mx-auto mb-2" />
            <h3 className="font-display text-2xl font-bold tracking-[-0.03em] text-white/90">{decade}</h3>
            {DECADE_SUBTITLES[decade] && (
              <p className="font-nhg text-xs text-white/30 mt-0.5">{DECADE_SUBTITLES[decade]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Missions */}
      <div className="space-y-3 md:space-y-4">
        {children}
      </div>
    </div>
  )
}

// ─── Mission Node ───────────────────────────────────────────────────────────

function MissionNode({
  mission,
  side,
  onClick,
}: {
  mission: Mission
  side: 'left' | 'right'
  onClick: () => void
}) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = nodeRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const colour = DESTINATION_COLOURS[mission.destination]
  const year = mission.launchDate.substring(0, 4)
  const monthDay = new Date(mission.launchDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })

  const outcomeIcon = mission.outcome === 'success'
    ? null
    : mission.outcome === 'failure'
      ? '✕'
      : '◐'

  return (
    <div
      ref={nodeRef}
      className={`relative transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Mobile layout: dot on left, card to the right */}
      <div className="md:hidden relative pl-12">
        {/* Dot */}
        <div
          className="absolute left-[22px] top-3 w-[12px] h-[12px] rounded-full z-10"
          style={{
            background: colour,
            boxShadow: `0 0 8px ${colour}40`,
          }}
        />
        {/* Connector line */}
        <svg
          className="absolute left-[34px] top-[14px] pointer-events-none"
          width="18"
          height="2"
          overflow="visible"
        >
          <line x1="0" y1="1" x2="18" y2="1" stroke={colour} strokeWidth="1" opacity="0.3" />
        </svg>
        {/* Card */}
        <MissionCard
          mission={mission}
          colour={colour}
          year={year}
          monthDay={monthDay}
          outcomeIcon={outcomeIcon}
          onClick={onClick}
        />
      </div>

      {/* Desktop layout: alternating sides */}
      <div className="hidden md:flex items-start relative">
        {/* Left card */}
        <div className={`w-[calc(50%-32px)] ${side === 'left' ? 'pr-4' : ''}`}>
          {side === 'left' && (
            <div className="flex justify-end">
              <div className="max-w-md w-full">
                <MissionCard
                  mission={mission}
                  colour={colour}
                  year={year}
                  monthDay={monthDay}
                  outcomeIcon={outcomeIcon}
                  onClick={onClick}
                  alignRight
                />
              </div>
            </div>
          )}
        </div>

        {/* Center column with dot and connectors */}
        <div className="relative w-16 flex-shrink-0 flex items-start justify-center pt-2">
          {/* Dot */}
          <div
            className="w-3 h-3 rounded-full z-10 relative"
            style={{
              background: colour,
              boxShadow: `0 0 10px ${colour}50`,
            }}
          />
          {/* Left connector arc */}
          {side === 'left' && (
            <svg className="absolute right-[32px] top-[10px] pointer-events-none" width="32" height="16" overflow="visible">
              <path
                d={`M 32 4 C 20 4, 8 2, 0 2`}
                stroke={colour}
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
            </svg>
          )}
          {/* Right connector arc */}
          {side === 'right' && (
            <svg className="absolute left-[32px] top-[10px] pointer-events-none" width="32" height="16" overflow="visible">
              <path
                d={`M 0 4 C 12 4, 24 2, 32 2`}
                stroke={colour}
                strokeWidth="1"
                fill="none"
                opacity="0.3"
              />
            </svg>
          )}
        </div>

        {/* Right card */}
        <div className={`w-[calc(50%-32px)] ${side === 'right' ? 'pl-4' : ''}`}>
          {side === 'right' && (
            <div className="max-w-md w-full">
              <MissionCard
                mission={mission}
                colour={colour}
                year={year}
                monthDay={monthDay}
                outcomeIcon={outcomeIcon}
                onClick={onClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Mission Card ───────────────────────────────────────────────────────────

function MissionCard({
  mission,
  colour,
  year,
  monthDay,
  outcomeIcon,
  onClick,
  alignRight = false,
}: {
  mission: Mission
  colour: string
  year: string
  monthDay: string
  outcomeIcon: string | null
  onClick: () => void
  alignRight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full group bg-white/[0.03] hover:bg-white/[0.06] rounded-xl p-3 md:p-4 transition-colors text-left ${
        alignRight ? 'text-right' : ''
      }`}
    >
      <div className={`flex items-start gap-3 ${alignRight ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-2 flex-wrap ${alignRight ? 'justify-end' : ''}`}>
            <h4 className={`font-display text-sm md:text-base font-bold tracking-[-0.03em] text-white/90 leading-tight ${
              mission.landmark ? '' : ''
            }`}>
              {mission.name}
            </h4>
            {mission.landmark && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: colour }}
                title="Landmark mission"
              />
            )}
            {outcomeIcon && (
              <span className={`font-label text-[9px] ${
                mission.outcome === 'failure' ? 'text-red-400/70' : 'text-yellow-400/70'
              }`}>
                {outcomeIcon}
              </span>
            )}
          </div>
          <div className={`flex items-center gap-2 mt-1 ${alignRight ? 'justify-end' : ''}`}>
            <span className="font-label text-[9px] text-white/30">{mission.agency}</span>
            <span className="text-white/10">·</span>
            <span className="font-label text-[9px] text-white/30">{monthDay} {year}</span>
            <span className="text-white/10">·</span>
            <span className="font-label text-[9px]" style={{ color: `${colour}80` }}>
              {DESTINATION_LABELS[mission.destination]}
            </span>
          </div>
          <p className={`font-nhg text-xs text-white/40 mt-1.5 leading-relaxed line-clamp-2 group-hover:text-white/50 transition-colors ${
            alignRight ? '' : ''
          }`}>
            {mission.description}
          </p>
        </div>
      </div>
    </button>
  )
}

// ─── Mission Detail Panel ───────────────────────────────────────────────────

function MissionDetail({ mission, onClose }: { mission: Mission; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Close on click outside
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose()
    }
  }, [onClose])

  const colour = DESTINATION_COLOURS[mission.destination]
  const date = new Date(mission.launchDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center md:justify-end"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full md:w-[480px] md:h-full bg-[#0a0e1a] md:border-l border-white/5 overflow-y-auto animate-slideUp md:animate-none"
        style={{ maxHeight: '85vh' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 md:p-8">
          {/* Colour accent */}
          <div className="w-8 h-1 rounded-full mb-6" style={{ background: colour }} />

          {/* Title */}
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em] text-white/95 pr-8">
            {mission.name}
          </h2>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
            <span className="font-label text-[10px] text-white/40">{mission.agency}</span>
            <span className="text-white/10">·</span>
            <span className="font-label text-[10px] text-white/40">{date}</span>
          </div>

          {/* Destination and outcome */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span
              className="font-label text-[10px] px-2.5 py-0.5 rounded-full"
              style={{ background: `${colour}15`, color: `${colour}CC` }}
            >
              {DESTINATION_LABELS[mission.destination]}
            </span>
            <span className={`font-label text-[10px] px-2.5 py-0.5 rounded-full ${
              mission.outcome === 'success'
                ? 'bg-green-500/10 text-green-400/80'
                : mission.outcome === 'failure'
                  ? 'bg-red-500/10 text-red-400/80'
                  : 'bg-yellow-500/10 text-yellow-400/80'
            }`}>
              {mission.outcome === 'success' ? 'Success' : mission.outcome === 'failure' ? 'Failure' : 'Partial Success'}
            </span>
            {mission.landmark && (
              <span className="font-label text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 text-white/50">
                Landmark
              </span>
            )}
          </div>

          {/* Description */}
          <p className="font-nhg text-sm text-white/60 leading-relaxed mt-6">
            {mission.description}
          </p>

          {/* Story (landmark missions) */}
          {mission.story && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <h3 className="font-label text-[10px] text-white/30 mb-3">The Story</h3>
              <p className="font-nhg text-sm text-white/50 leading-relaxed">
                {mission.story}
              </p>
            </div>
          )}

          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/[0.03] rounded-xl p-3">
              <span className="font-label text-[9px] text-white/30 block">Launch Date</span>
              <span className="font-nhg text-sm text-white/70 mt-1 block">{date}</span>
            </div>
            <div className="bg-white/[0.03] rounded-xl p-3">
              <span className="font-label text-[9px] text-white/30 block">Agency</span>
              <span className="font-nhg text-sm text-white/70 mt-1 block">{mission.agency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
