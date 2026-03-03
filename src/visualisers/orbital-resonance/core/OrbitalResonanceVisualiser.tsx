'use client'

import { useRef, useEffect } from 'react'

const BG = '#03060f'
const TEXT_DIM = 'rgba(255, 255, 255, 0.4)'
const TEXT_PRIMARY = 'rgba(255, 255, 255, 0.85)'
const ORBIT_COLOUR = 'rgba(255, 255, 255, 0.06)'
const TRACE_COLOUR = 'rgba(100, 160, 255, 0.3)'
const STAR_COLOUR = 'rgba(255, 220, 140, 1)'
const STAR_GLOW = 'rgba(255, 200, 80, 0.15)'

const DEMO_DURATION = 60

interface Body {
  name: string
  colour: string
  radius: number      // orbital radius (relative)
  period: number       // orbital period (relative, innermost = 1)
  size: number         // visual dot size
}

// Galilean moons: 1:2:4 resonance
const GALILEAN: Body[] = [
  { name: 'Io', colour: 'rgba(255, 200, 80, 1)', radius: 0.22, period: 1, size: 4 },
  { name: 'Europa', colour: 'rgba(180, 200, 255, 1)', radius: 0.35, period: 2, size: 3.5 },
  { name: 'Ganymede', colour: 'rgba(200, 180, 160, 1)', radius: 0.50, period: 4, size: 5 },
]

// Ratio explorer presets
const RATIO_PRESETS: { label: string, ratios: [number, number], bodies: Body[] }[] = [
  {
    label: '1:2',
    ratios: [1, 2],
    bodies: [
      { name: 'Inner', colour: 'rgba(100, 200, 255, 1)', radius: 0.28, period: 1, size: 4 },
      { name: 'Outer', colour: 'rgba(255, 150, 100, 1)', radius: 0.45, period: 2, size: 4 },
    ],
  },
  {
    label: '2:3',
    ratios: [2, 3],
    bodies: [
      { name: 'Inner', colour: 'rgba(100, 255, 180, 1)', radius: 0.28, period: 2, size: 4 },
      { name: 'Outer', colour: 'rgba(255, 100, 200, 1)', radius: 0.45, period: 3, size: 4 },
    ],
  },
  {
    label: '3:5',
    ratios: [3, 5],
    bodies: [
      { name: 'Inner', colour: 'rgba(200, 160, 255, 1)', radius: 0.28, period: 3, size: 4 },
      { name: 'Outer', colour: 'rgba(255, 200, 100, 1)', radius: 0.45, period: 5, size: 4 },
    ],
  },
]

// TRAPPIST-1: near-resonance chain (approximate ratios)
const TRAPPIST: Body[] = [
  { name: 'b', colour: 'rgba(255, 120, 100, 1)', radius: 0.12, period: 1, size: 3 },
  { name: 'c', colour: 'rgba(255, 180, 100, 1)', radius: 0.16, period: 1.60, size: 3 },
  { name: 'd', colour: 'rgba(200, 200, 255, 1)', radius: 0.21, period: 2.42, size: 2.5 },
  { name: 'e', colour: 'rgba(100, 200, 200, 1)', radius: 0.27, period: 3.66, size: 3 },
  { name: 'f', colour: 'rgba(100, 160, 255, 1)', radius: 0.33, period: 5.66, size: 3 },
  { name: 'g', colour: 'rgba(200, 140, 255, 1)', radius: 0.40, period: 7.32, size: 3.5 },
  { name: 'h', colour: 'rgba(180, 200, 160, 1)', radius: 0.48, period: 11.67, size: 2.5 },
]

export default function OrbitalResonanceVisualiser() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    const isMobile = window.innerWidth < 768

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = rect.width
      H = rect.height
      canvas!.width = W * dpr
      canvas!.height = H * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    startTimeRef.current = performance.now()

    function drawSystem(
      bodies: Body[],
      time: number,
      cx: number, cy: number,
      maxR: number,
      showTraces: boolean,
      showConnectors: boolean,
      traceHistory: Map<string, [number, number][]>,
      label: string,
      sublabel?: string,
    ) {
      const speed = 0.8 // orbits per second for innermost

      // Star
      ctx!.fillStyle = STAR_GLOW
      ctx!.beginPath()
      ctx!.arc(cx, cy, 16, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.fillStyle = STAR_COLOUR
      ctx!.beginPath()
      ctx!.arc(cx, cy, 5, 0, Math.PI * 2)
      ctx!.fill()

      // Orbital paths
      for (const body of bodies) {
        const r = body.radius * maxR
        ctx!.strokeStyle = ORBIT_COLOUR
        ctx!.lineWidth = 0.5
        ctx!.beginPath()
        ctx!.arc(cx, cy, r, 0, Math.PI * 2)
        ctx!.stroke()
      }

      // Compute positions
      const positions: { body: Body, x: number, y: number }[] = []
      for (const body of bodies) {
        const r = body.radius * maxR
        const angle = (time * speed / body.period) * Math.PI * 2
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        positions.push({ body, x, y })

        // Trace
        if (showTraces) {
          if (!traceHistory.has(body.name)) {
            traceHistory.set(body.name, [])
          }
          const hist = traceHistory.get(body.name)!
          hist.push([x, y])
          if (hist.length > 300) hist.shift()
        }
      }

      // Draw traces
      if (showTraces) {
        for (const { body } of positions) {
          const hist = traceHistory.get(body.name)
          if (!hist || hist.length < 2) continue
          ctx!.strokeStyle = body.colour.replace('1)', '0.2)')
          ctx!.lineWidth = 0.8
          ctx!.beginPath()
          ctx!.moveTo(hist[0][0], hist[0][1])
          for (let i = 1; i < hist.length; i++) {
            ctx!.lineTo(hist[i][0], hist[i][1])
          }
          ctx!.stroke()
        }
      }

      // Draw connectors between adjacent bodies
      if (showConnectors && positions.length >= 2) {
        ctx!.strokeStyle = TRACE_COLOUR
        ctx!.lineWidth = 0.5
        for (let i = 0; i < positions.length - 1; i++) {
          ctx!.beginPath()
          ctx!.moveTo(positions[i].x, positions[i].y)
          ctx!.lineTo(positions[i + 1].x, positions[i + 1].y)
          ctx!.stroke()
        }
      }

      // Draw bodies
      for (const { body, x, y } of positions) {
        // Glow
        ctx!.fillStyle = body.colour.replace('1)', '0.2)')
        ctx!.beginPath()
        ctx!.arc(x, y, body.size * 2.5, 0, Math.PI * 2)
        ctx!.fill()

        // Body
        ctx!.fillStyle = body.colour
        ctx!.beginPath()
        ctx!.arc(x, y, body.size, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Labels
      const fontSize = isMobile ? 11 : 13
      ctx!.fillStyle = TEXT_PRIMARY
      ctx!.font = `${fontSize}px monospace`
      ctx!.fillText(label, cx - maxR, cy - maxR - 20)

      if (sublabel) {
        ctx!.fillStyle = TEXT_DIM
        ctx!.font = `${fontSize - 2}px monospace`
        ctx!.fillText(sublabel, cx - maxR, cy - maxR - 4)
      }

      // Body names
      if (!isMobile || bodies.length <= 4) {
        ctx!.font = `${fontSize - 2}px monospace`
        ctx!.fillStyle = TEXT_DIM
        for (const { body, x, y } of positions) {
          ctx!.fillText(body.name, x + body.size + 4, y + 3)
        }
      }
    }

    const traceHistories: Map<string, Map<string, [number, number][]>> = new Map()

    function getTraceHistory(key: string): Map<string, [number, number][]> {
      if (!traceHistories.has(key)) {
        traceHistories.set(key, new Map())
      }
      return traceHistories.get(key)!
    }

    function draw(now: number) {
      const elapsed = ((now - startTimeRef.current) / 1000) % DEMO_DURATION
      const simTime = (now - startTimeRef.current) / 1000

      ctx!.fillStyle = BG
      ctx!.fillRect(0, 0, W, H)

      const maxR = Math.min(W, H) * 0.42
      const cx = W / 2
      const cy = H / 2
      const fontSize = isMobile ? 11 : 13

      // Timeline:
      // 0-20: Galilean 1:2:4
      // 20-42: Ratio explorer cycles
      // 42-58: TRAPPIST-1
      // 58-60: Reset

      if (elapsed < 20) {
        // Galilean system
        drawSystem(
          GALILEAN, simTime, cx, cy, maxR,
          true, true,
          getTraceHistory('galilean'),
          'Galilean moons - 1:2:4',
          'Io : Europa : Ganymede'
        )

        // Resonance ratios
        ctx!.fillStyle = TEXT_DIM
        ctx!.font = `${fontSize - 2}px monospace`
        ctx!.fillText('Laplace resonance: every conjunction maintains orbital stability', 16, H - 16)

      } else if (elapsed < 42) {
        // Ratio explorer
        const ratioTime = elapsed - 20
        const presetIdx = Math.min(Math.floor(ratioTime / 7.3), RATIO_PRESETS.length - 1)
        const preset = RATIO_PRESETS[presetIdx]

        // Clear trace on preset change
        const key = `ratio_${presetIdx}`
        drawSystem(
          preset.bodies, simTime, cx, cy, maxR,
          true, true,
          getTraceHistory(key),
          `Resonance ${preset.label}`,
          'Pattern closes when ratio is rational'
        )

        ctx!.fillStyle = TEXT_DIM
        ctx!.font = `${fontSize - 2}px monospace`
        ctx!.fillText('Simple ratios → closed patterns. Irrational ratios → never close.', 16, H - 16)

      } else if (elapsed < 58) {
        // TRAPPIST-1
        drawSystem(
          TRAPPIST, simTime * 0.3, cx, cy, maxR,
          false, true,
          getTraceHistory('trappist'),
          'TRAPPIST-1 system',
          '7 planets in near-resonance chain'
        )

        // Period ratios
        ctx!.fillStyle = TEXT_DIM
        ctx!.font = `${fontSize - 2}px monospace`
        const ratioText = 'Period ratios: ~8:5, ~5:3, ~3:2, ~3:2, ~4:3, ~3:2'
        ctx!.fillText(ratioText, 16, H - 16)
      }

      // Phase indicator
      ctx!.fillStyle = TEXT_DIM
      ctx!.font = `${fontSize - 2}px monospace`
      let phase = ''
      if (elapsed < 20) phase = 'Galilean 1:2:4'
      else if (elapsed < 42) phase = 'Ratio explorer'
      else if (elapsed < 58) phase = 'TRAPPIST-1'
      else phase = 'Resetting'
      const phaseW = ctx!.measureText(phase).width
      ctx!.fillText(phase, W - phaseW - 16, H - 16)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ background: BG }}
    />
  )
}
