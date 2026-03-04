'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  CHANNELS,
  LAYERS,
  EVENTS,
  SSN_DATA,
  SSN_START_YEAR,
  TIMELINE_START,
  TIMELINE_END,
  getSSN,
  yearToDateStr,
  seededRandom,
  eventYear,
  type SolarEvent,
  type Channel,
} from './data'

// ─── Component ──────────────────────────────────────────────────────────────

export default function SolarActivityViewer() {
  const [currentYear, setCurrentYear] = useState(2024.36) // May 2024 storm
  const [channelId, setChannelId] = useState('171A')
  const [layers, setLayers] = useState({ sunspots: true, magnetic: false, coronal: false, holes: false })
  const [selectedEvent, setSelectedEvent] = useState<SolarEvent | null>(null)

  const discCanvasRef = useRef<HTMLCanvasElement>(null)
  const butterflyCanvasRef = useRef<HTMLCanvasElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const channel = useMemo(() => CHANNELS.find(c => c.id === channelId) || CHANNELS[0], [channelId])

  // ── Render solar disc ──
  useEffect(() => {
    const canvas = discCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.parentElement?.getBoundingClientRect()
    if (!rect) return
    const size = Math.min(rect.width, rect.height)
    const dpr = Math.min(window.devicePixelRatio, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    renderDisc(ctx, size, size, currentYear, channel, layers)
  }, [currentYear, channel, layers])

  // ── Render butterfly diagram ──
  useEffect(() => {
    const canvas = butterflyCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement
    if (!parent) return
    const rect = parent.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio, 2)
    canvas.width = rect.width * dpr
    canvas.height = 160 * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = '160px'
    ctx.scale(dpr, dpr)

    renderButterfly(ctx, rect.width, 160, currentYear)
  }, [currentYear])

  // ── Timeline drag ──
  const handleTimelineDrag = useCallback((e: React.PointerEvent | React.TouchEvent) => {
    const el = timelineRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    setCurrentYear(TIMELINE_START + frac * (TIMELINE_END - TIMELINE_START))
  }, [])

  const [draggingTimeline, setDraggingTimeline] = useState(false)

  const onTimelinePointerDown = useCallback((e: React.PointerEvent) => {
    setDraggingTimeline(true)
    handleTimelineDrag(e)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [handleTimelineDrag])

  const onTimelinePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingTimeline) return
    handleTimelineDrag(e)
  }, [draggingTimeline, handleTimelineDrag])

  const onTimelinePointerUp = useCallback(() => {
    setDraggingTimeline(false)
  }, [])

  // ── Event click ──
  const handleEventClick = useCallback((event: SolarEvent) => {
    if (!event.historic) {
      setCurrentYear(eventYear(event))
    }
    setSelectedEvent(event)
  }, [])

  const toggleLayer = useCallback((id: string) => {
    setLayers(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }))
  }, [])

  const ssn = getSSN(currentYear)
  const timelineFrac = (currentYear - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)

  return (
    <div className="bg-[#03060f] rounded-xl overflow-hidden">
      {/* ── Channel selector ── */}
      <div className="flex items-center gap-1.5 px-3 md:px-4 py-2.5 overflow-x-auto scrollbar-hide">
        <span className="font-label text-[9px] text-white/30 mr-1 flex-shrink-0">Channel</span>
        {CHANNELS.map(ch => (
          <button
            key={ch.id}
            onClick={() => setChannelId(ch.id)}
            className={`font-label text-[10px] px-2.5 py-1 rounded-xl flex-shrink-0 transition-colors ${
              channelId === ch.id
                ? 'bg-[#0055FF] text-white'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {ch.label}
          </button>
        ))}
      </div>

      {/* ── Main viewer ── */}
      <div className="relative flex flex-col lg:flex-row">
        {/* Solar disc */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-6" style={{ minHeight: '350px' }}>
          <div className="relative w-full max-w-[500px] aspect-square">
            <canvas ref={discCanvasRef} className="w-full h-full" />
            {/* Date overlay */}
            <div className="absolute top-2 left-2 pointer-events-none">
              <p className="font-label text-[9px] text-white/30">{yearToDateStr(currentYear)}</p>
              <p className="font-label text-[9px] text-white/20 mt-0.5">SSN: {Math.round(ssn)}</p>
            </div>
            {/* Channel description */}
            <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
              <p className="font-nhg text-[10px] text-white/25 leading-relaxed">{channel.description}</p>
            </div>
          </div>
        </div>

        {/* Layer controls + info (sidebar on desktop, row on mobile) */}
        <div className="lg:w-48 p-3 md:p-4 lg:border-l border-white/5">
          <p className="font-label text-[9px] text-white/30 mb-2">Overlay Layers</p>
          <div className="flex lg:flex-col gap-1.5">
            {LAYERS.map(layer => (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`font-label text-[10px] px-2.5 py-1.5 rounded-xl transition-colors text-left flex-shrink-0 ${
                  layers[layer.id as keyof typeof layers]
                    ? 'bg-[#0055FF] text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>

          {/* Solar cycle indicator */}
          <div className="mt-4 hidden lg:block">
            <p className="font-label text-[9px] text-white/30 mb-1">Solar Cycle</p>
            <p className="font-nhg text-xs text-white/50">
              {currentYear < 2020 ? 'Cycle 24' : 'Cycle 25'}
            </p>
            <p className="font-nhg text-[10px] text-white/25 mt-0.5">
              {ssn < 20 ? 'Minimum' : ssn < 60 ? 'Low Activity' : ssn < 120 ? 'Moderate' : ssn < 170 ? 'High Activity' : 'Very High'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="px-3 md:px-4 pt-2 pb-1">
        <div
          ref={timelineRef}
          className="relative h-10 cursor-pointer select-none touch-none"
          onPointerDown={onTimelinePointerDown}
          onPointerMove={onTimelinePointerMove}
          onPointerUp={onTimelinePointerUp}
          onPointerLeave={onTimelinePointerUp}
        >
          {/* Track */}
          <div className="absolute left-0 right-0 top-[18px] h-[3px] rounded-full bg-white/10" />

          {/* SSN sparkline on track */}
          <svg className="absolute left-0 right-0 top-[4px] h-[14px] pointer-events-none overflow-visible" preserveAspectRatio="none">
            <polyline
              points={SSN_DATA.map((v, i) => {
                const x = (i / (SSN_DATA.length - 1)) * 100
                const y = 14 - (v / 220) * 14
                return `${x}%,${y}`
              }).join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Event markers */}
          {EVENTS.map(event => {
            const ey = eventYear(event)
            if (ey < TIMELINE_START) return null
            const frac = (ey - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)
            return (
              <button
                key={event.id}
                onClick={(e) => { e.stopPropagation(); handleEventClick(event) }}
                className="absolute top-[13px] w-2.5 h-2.5 -ml-[5px] rotate-45 bg-amber-400/60 hover:bg-amber-400 transition-colors z-10"
                style={{ left: `${frac * 100}%` }}
                title={event.name}
              />
            )
          })}

          {/* Thumb */}
          <div
            className="absolute top-[12px] w-3 h-3 -ml-1.5 rounded-full bg-white shadow-sm shadow-white/30 z-20"
            style={{ left: `${timelineFrac * 100}%` }}
          />

          {/* Year labels */}
          {[2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026].map(y => {
            const frac = (y - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)
            if (frac < 0 || frac > 1) return null
            return (
              <span
                key={y}
                className="absolute top-[28px] font-label text-[8px] text-white/20 -translate-x-1/2"
                style={{ left: `${frac * 100}%` }}
              >
                {y}
              </span>
            )
          })}
        </div>

        {/* Carrington marker */}
        <div className="flex items-center gap-1 mt-0.5 mb-1">
          <span className="w-2 h-2 rotate-45 bg-amber-400/30 inline-block flex-shrink-0" />
          <span className="font-nhg text-[9px] text-white/20">
            Carrington Event (1859) predates SDO - shown as historical reference
          </span>
        </div>
      </div>

      {/* ── Butterfly Diagram ── */}
      <div className="px-3 md:px-4 pb-3">
        <div className="relative">
          <p className="font-label text-[9px] text-white/30 mb-1">Butterfly Diagram</p>
          <div className="relative">
            <canvas ref={butterflyCanvasRef} className="w-full" style={{ height: '160px' }} />
            {/* Y-axis labels */}
            <span className="absolute left-0 top-0 font-label text-[7px] text-white/15">+40°</span>
            <span className="absolute left-0 bottom-0 font-label text-[7px] text-white/15">-40°</span>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 font-label text-[7px] text-white/15">0°</span>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="flex flex-wrap gap-4 md:gap-8 px-3 md:px-4 py-3 border-t border-white/5">
        <div>
          <span className="font-label text-[9px] text-white/30 block">Date</span>
          <span className="font-display text-sm font-bold tracking-[-0.03em] text-white/70">{yearToDateStr(currentYear)}</span>
        </div>
        <div>
          <span className="font-label text-[9px] text-white/30 block">Sunspot Number</span>
          <span className="font-display text-sm font-bold tracking-[-0.03em] text-white/70 tabular-nums">{Math.round(ssn)}</span>
        </div>
        <div>
          <span className="font-label text-[9px] text-white/30 block">Cycle</span>
          <span className="font-display text-sm font-bold tracking-[-0.03em] text-white/70">
            {currentYear < 2020 ? '24' : '25'}
          </span>
        </div>
        <div>
          <span className="font-label text-[9px] text-white/30 block">Channel</span>
          <span className="font-display text-sm font-bold tracking-[-0.03em] text-white/70">{channel.name}</span>
        </div>
      </div>

      {/* ── Event Detail Panel ── */}
      {selectedEvent && (
        <EventPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}

// ─── Event Detail Panel ─────────────────────────────────────────────────────

function EventPanel({ event, onClose }: { event: SolarEvent; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const dateStr = new Date(event.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="border-t border-white/5 animate-slideUp">
      <div className="p-4 md:p-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg md:text-xl font-bold tracking-[-0.03em] text-white/90">
              {event.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-label text-[9px] text-white/30">{dateStr}</span>
              <span className="text-white/10">·</span>
              <span className="font-label text-[9px] text-amber-400/70">{event.rating}</span>
              {event.historic && (
                <>
                  <span className="text-white/10">·</span>
                  <span className="font-label text-[9px] text-white/20">Historical</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="font-nhg text-sm text-white/50 leading-relaxed mt-3">
          {event.description}
        </p>

        <div className="bg-white/[0.03] rounded-xl p-3 mt-3">
          <p className="font-label text-[9px] text-white/30 mb-1">Effects on Earth</p>
          <p className="font-nhg text-sm text-white/40 leading-relaxed">
            {event.earthEffects}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Solar Disc Renderer ────────────────────────────────────────────────────

interface Sunspot {
  lat: number
  lon: number
  size: number
  regionNumber: number
}

function generateSunspots(year: number): Sunspot[] {
  const ssn = getSSN(year)
  const numSpots = Math.max(0, Math.round(ssn / 12))

  // Determine cycle phase for latitude placement
  let cycleStart: number
  let cycleDuration: number
  if (year < 2020) {
    cycleStart = 2008.5
    cycleDuration = 11
  } else {
    cycleStart = 2019.5
    cycleDuration = 11
  }
  const phase = Math.max(0, Math.min(1, (year - cycleStart) / cycleDuration))
  const meanLat = 30 - 25 * phase // Starts at ±30°, migrates to ±5°
  const latSpread = 6

  const rng = seededRandom(Math.floor(year * 12))
  const spots: Sunspot[] = []
  for (let i = 0; i < numSpots; i++) {
    const lat = (meanLat + (rng() - 0.5) * latSpread * 2) * (rng() > 0.5 ? 1 : -1)
    const lon = (rng() - 0.5) * 130 // ±65° longitude visible
    const size = 0.012 + rng() * 0.035
    spots.push({ lat, lon, size, regionNumber: 12000 + Math.floor(year * 10) % 1000 + i })
  }
  return spots
}

function helioToPixel(lat: number, lon: number, cx: number, cy: number, r: number) {
  const latRad = (lat * Math.PI) / 180
  const lonRad = (lon * Math.PI) / 180
  const x = cx + r * Math.cos(latRad) * Math.sin(lonRad)
  const y = cy - r * Math.sin(latRad)
  const foreshorten = Math.cos(lonRad) * Math.cos(latRad)
  return { x, y, visible: foreshorten > 0, foreshorten }
}

function renderDisc(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  year: number,
  channel: Channel,
  layerState: Record<string, boolean>,
) {
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(cx, cy) * 0.88

  // Clear
  ctx.fillStyle = '#03060f'
  ctx.fillRect(0, 0, w, h)

  // Disc base gradient
  const grad = ctx.createRadialGradient(cx - r * 0.1, cy - r * 0.1, 0, cx, cy, r)
  const [br, bg, bb] = channel.baseColour
  const [er, eg, eb] = channel.edgeColour
  grad.addColorStop(0, `rgb(${br},${bg},${bb})`)
  grad.addColorStop(0.75, `rgb(${Math.round(br * 0.85 + er * 0.15)},${Math.round(bg * 0.85 + eg * 0.15)},${Math.round(bb * 0.85 + eb * 0.15)})`)
  grad.addColorStop(0.95, `rgb(${er},${eg},${eb})`)
  grad.addColorStop(1, 'rgb(0,0,0)')

  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  // Subtle surface texture
  const rng = seededRandom(Math.floor(year * 100))
  for (let i = 0; i < 40; i++) {
    const angle = rng() * Math.PI * 2
    const dist = rng() * r * 0.85
    const tx = cx + Math.cos(angle) * dist
    const ty = cy + Math.sin(angle) * dist
    const ts = 2 + rng() * 8
    const tGrad = ctx.createRadialGradient(tx, ty, 0, tx, ty, ts)
    tGrad.addColorStop(0, `rgba(${br},${bg},${bb},0.15)`)
    tGrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = tGrad
    ctx.fillRect(tx - ts, ty - ts, ts * 2, ts * 2)
  }

  // Generate and draw sunspots
  const spots = generateSunspots(year)

  for (const spot of spots) {
    const { x, y, visible, foreshorten } = helioToPixel(spot.lat, spot.lon, cx, cy, r)
    if (!visible) continue

    const spotR = spot.size * r * foreshorten

    if (channel.spotStyle === 'dark') {
      // HMI: dark spots
      const sGrad = ctx.createRadialGradient(x, y, 0, x, y, spotR)
      sGrad.addColorStop(0, 'rgba(40,30,20,0.85)')
      sGrad.addColorStop(0.4, 'rgba(80,60,40,0.6)')
      sGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(x, y, spotR * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = sGrad
      ctx.fill()
    } else {
      // EUV channels: bright active regions
      const sGrad = ctx.createRadialGradient(x, y, 0, x, y, spotR * 2)
      sGrad.addColorStop(0, `rgba(255,255,255,0.5)`)
      sGrad.addColorStop(0.3, `rgba(${br},${bg},${bb},0.4)`)
      sGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(x, y, spotR * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = sGrad
      ctx.fill()
    }

    // Sunspot region labels
    if (layerState.sunspots && spotR > 2) {
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.arc(x, y, spotR * 1.8, 0, Math.PI * 2)
      ctx.stroke()

      ctx.font = '8px sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.textAlign = 'center'
      ctx.fillText(`AR ${spot.regionNumber}`, x, y - spotR * 2.2)
    }
  }

  // Magnetic polarity overlay
  if (layerState.magnetic) {
    for (const spot of spots) {
      const { x, y, visible, foreshorten } = helioToPixel(spot.lat, spot.lon, cx, cy, r)
      if (!visible) continue
      const spotR = spot.size * r * foreshorten
      // Leading/trailing polarity
      ctx.fillStyle = spot.lat > 0 ? 'rgba(80,120,255,0.15)' : 'rgba(255,80,80,0.15)'
      ctx.beginPath()
      ctx.arc(x - spotR * 0.5, y, spotR * 1.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = spot.lat > 0 ? 'rgba(255,80,80,0.15)' : 'rgba(80,120,255,0.15)'
      ctx.beginPath()
      ctx.arc(x + spotR * 0.5, y, spotR * 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Coronal loops
  if (layerState.coronal) {
    ctx.strokeStyle = 'rgba(200,220,255,0.12)'
    ctx.lineWidth = 0.5
    for (const spot of spots) {
      const { x, y, visible, foreshorten } = helioToPixel(spot.lat, spot.lon, cx, cy, r)
      if (!visible || foreshorten < 0.3) continue
      const spotR = spot.size * r * foreshorten
      for (let a = 0; a < 3; a++) {
        const arcR = spotR * (2 + a * 1.5)
        const startAngle = -Math.PI * 0.8
        const endAngle = -Math.PI * 0.2
        ctx.beginPath()
        ctx.arc(x, y + arcR * 0.3, arcR, startAngle, endAngle)
        ctx.stroke()
      }
    }
  }

  // Coronal holes
  if (layerState.holes) {
    const holeRng = seededRandom(Math.floor(year * 7) + 999)
    const numHoles = Math.max(1, Math.round(3 - getSSN(year) / 80))
    for (let h = 0; h < numHoles; h++) {
      const hlat = (holeRng() - 0.5) * 50
      const hlon = (holeRng() - 0.5) * 100
      const { x, y, visible } = helioToPixel(hlat, hlon, cx, cy, r)
      if (!visible) continue
      const holeR = r * (0.06 + holeRng() * 0.08)
      const hGrad = ctx.createRadialGradient(x, y, 0, x, y, holeR)
      hGrad.addColorStop(0, 'rgba(0,0,0,0.4)')
      hGrad.addColorStop(0.7, 'rgba(0,0,0,0.2)')
      hGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(x, y, holeR, 0, Math.PI * 2)
      ctx.fillStyle = hGrad
      ctx.fill()
    }
  }

  // Limb darkening
  const limbGrad = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r)
  limbGrad.addColorStop(0, 'rgba(0,0,0,0)')
  limbGrad.addColorStop(1, 'rgba(0,0,0,0.45)')
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = limbGrad
  ctx.fill()

  // Corona glow (outer ring)
  const coronaGrad = ctx.createRadialGradient(cx, cy, r * 0.95, cx, cy, r * 1.15)
  coronaGrad.addColorStop(0, `rgba(${er},${eg},${eb},0.1)`)
  coronaGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.beginPath()
  ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2)
  ctx.fillStyle = coronaGrad
  ctx.fill()
}

// ─── Butterfly Diagram Renderer ─────────────────────────────────────────────

function renderButterfly(ctx: CanvasRenderingContext2D, w: number, h: number, currentYear: number) {
  ctx.fillStyle = 'rgba(3,6,15,1)'
  ctx.fillRect(0, 0, w, h)

  const margin = { left: 20, right: 10, top: 5, bottom: 15 }
  const plotW = w - margin.left - margin.right
  const plotH = h - margin.top - margin.bottom

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 0.5
  // Horizontal: equator
  const eqY = margin.top + plotH / 2
  ctx.beginPath()
  ctx.moveTo(margin.left, eqY)
  ctx.lineTo(margin.left + plotW, eqY)
  ctx.stroke()

  // Generate butterfly data
  const rng = seededRandom(42)
  for (let i = 0; i < SSN_DATA.length; i++) {
    const ssn = SSN_DATA[i]
    const year = SSN_START_YEAR + i / 12
    const numDots = Math.round(ssn / 8)

    // Determine cycle and phase
    let cycleStart: number
    if (year < 2020) {
      cycleStart = 2008.5
    } else {
      cycleStart = 2019.5
    }
    const phase = Math.max(0, Math.min(1, (year - cycleStart) / 11))
    const meanLat = 30 - 25 * phase

    for (let j = 0; j < numDots; j++) {
      const lat = (meanLat + (rng() - 0.5) * 10) * (rng() > 0.5 ? 1 : -1)
      const x = margin.left + ((year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * plotW
      const y = margin.top + plotH / 2 - (lat / 40) * (plotH / 2)

      const isCycle25 = year >= 2020
      ctx.fillStyle = isCycle25
        ? `rgba(255,100,80,${0.15 + rng() * 0.15})`
        : `rgba(80,140,255,${0.15 + rng() * 0.15})`
      ctx.beginPath()
      ctx.arc(x, y, 1.2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Current position indicator
  const curX = margin.left + ((currentYear - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * plotW
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(curX, margin.top)
  ctx.lineTo(curX, margin.top + plotH)
  ctx.stroke()

  // X-axis labels
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.font = '8px sans-serif'
  ctx.textAlign = 'center'
  for (let y = 2010; y <= 2026; y += 4) {
    const x = margin.left + ((y - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * plotW
    ctx.fillText(String(y), x, h - 2)
  }
}
