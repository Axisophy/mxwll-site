'use client'

import { useRef, useEffect } from 'react'

const BG = '#03060f'
const TEXT_DIM = 'rgba(255, 255, 255, 0.4)'
const TEXT_PRIMARY = 'rgba(255, 255, 255, 0.85)'
const CURVE_COLOUR = 'rgba(200, 170, 255, 0.8)'
const TRACE_COLOUR = 'rgba(200, 170, 255, 0.6)'
const AXIS_COLOUR = 'rgba(255, 255, 255, 0.08)'
const DOT_COLOUR = 'rgba(255, 200, 100, 1)'
const DAMPED_COLOUR = 'rgba(100, 200, 180, 0.7)'
const GRID_LABEL = 'rgba(255, 255, 255, 0.5)'

const DEMO_DURATION = 50

// Frequency ratios for the table view
const TABLE_RATIOS: [number, number][] = [
  [1, 1], [1, 2], [1, 3], [1, 4],
  [2, 3], [3, 4], [3, 5], [4, 5],
]

export default function LissajousVisualiser() {
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

    function drawLissajousCurve(
      cx: number, cy: number, w: number, h: number,
      a: number, b: number, phase: number,
      colour: string, lineWidth: number,
      damping?: number, tMax?: number
    ) {
      const steps = 500
      const maxT = tMax ?? Math.PI * 2
      const r = Math.min(w, h) * 0.42

      ctx!.strokeStyle = colour
      ctx!.lineWidth = lineWidth
      ctx!.beginPath()

      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * maxT
        const damp = damping ? Math.exp(-damping * t) : 1
        const x = cx + r * Math.sin(a * t + phase) * damp
        const y = cy + r * Math.cos(b * t) * damp

        if (i === 0) ctx!.moveTo(x, y)
        else ctx!.lineTo(x, y)
      }
      ctx!.stroke()
    }

    function drawTable(alpha: number) {
      ctx!.globalAlpha = alpha
      const cols = isMobile ? 4 : 4
      const rows = 2
      const pad = isMobile ? 8 : 16
      const gridW = W - pad * 2
      const gridH = H - 80 - pad * 2
      const cellW = gridW / cols
      const cellH = gridH / rows

      const fontSize = isMobile ? 10 : 12
      ctx!.font = `${fontSize}px monospace`

      for (let i = 0; i < TABLE_RATIOS.length; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        const cx = pad + col * cellW + cellW / 2
        const cy = 60 + row * cellH + cellH / 2
        const [a, b] = TABLE_RATIOS[i]

        // Cell border
        ctx!.strokeStyle = AXIS_COLOUR
        ctx!.lineWidth = 0.5
        ctx!.strokeRect(pad + col * cellW, 60 + row * cellH, cellW, cellH)

        // Ratio label
        ctx!.fillStyle = GRID_LABEL
        ctx!.fillText(`${a}:${b}`, pad + col * cellW + 8, 60 + row * cellH + fontSize + 4)

        // Curve
        drawLissajousCurve(cx, cy, cellW * 0.8, cellH * 0.7, a, b, Math.PI / 4, CURVE_COLOUR, 1)
      }

      // Title
      ctx!.fillStyle = TEXT_PRIMARY
      ctx!.font = `${isMobile ? 13 : 15}px monospace`
      ctx!.fillText('Frequency ratio table', 16, 36)

      ctx!.globalAlpha = 1
    }

    function drawAnimatedTrace(elapsed: number, phaseStart: number) {
      const t = elapsed - phaseStart
      const a = 3
      const b = 2
      const phase = Math.PI / 4
      const traceT = Math.min(t / 8, 1) * Math.PI * 2
      const r = Math.min(W, H) * 0.35
      const cx = W / 2
      const cy = H / 2

      // Axes
      ctx!.strokeStyle = AXIS_COLOUR
      ctx!.lineWidth = 0.5
      ctx!.beginPath()
      ctx!.moveTo(cx - r - 20, cy)
      ctx!.lineTo(cx + r + 20, cy)
      ctx!.moveTo(cx, cy - r - 20)
      ctx!.lineTo(cx, cy + r + 20)
      ctx!.stroke()

      // Component oscillator indicators on axes
      const tNow = traceT
      const xPos = cx + r * Math.sin(a * tNow + phase)
      const yPos = cy + r * Math.cos(b * tNow)

      // X component projection
      ctx!.strokeStyle = 'rgba(255, 150, 100, 0.3)'
      ctx!.setLineDash([3, 3])
      ctx!.beginPath()
      ctx!.moveTo(xPos, cy + r + 20)
      ctx!.lineTo(xPos, yPos)
      ctx!.stroke()
      ctx!.setLineDash([])

      // Y component projection
      ctx!.strokeStyle = 'rgba(100, 150, 255, 0.3)'
      ctx!.setLineDash([3, 3])
      ctx!.beginPath()
      ctx!.moveTo(cx - r - 20, yPos)
      ctx!.lineTo(xPos, yPos)
      ctx!.stroke()
      ctx!.setLineDash([])

      // Draw curve so far
      drawLissajousCurve(cx, cy, W * 0.7, H * 0.7, a, b, phase, TRACE_COLOUR, 1.5, undefined, traceT)

      // Current position dot
      ctx!.fillStyle = DOT_COLOUR
      ctx!.beginPath()
      ctx!.arc(xPos, yPos, 5, 0, Math.PI * 2)
      ctx!.fill()

      // Label
      const fontSize = isMobile ? 11 : 13
      ctx!.fillStyle = TEXT_PRIMARY
      ctx!.font = `${fontSize}px monospace`
      ctx!.fillText('3:2 ratio - animated trace', 16, 28)

      ctx!.fillStyle = TEXT_DIM
      ctx!.font = `${fontSize - 2}px monospace`
      ctx!.fillText('x = sin(3t + π/4)', 16, 28 + fontSize + 6)
      ctx!.fillText('y = cos(2t)', 16, 28 + (fontSize + 6) * 2)
    }

    function drawHarmonograph(elapsed: number, phaseStart: number) {
      const t = elapsed - phaseStart
      const progress = Math.min(t / 14, 1)
      const cx = W / 2
      const cy = H / 2
      const damping = 0.12

      // Draw the damped curve
      drawLissajousCurve(
        cx, cy, W * 0.8, H * 0.8,
        3, 2, Math.PI / 6,
        DAMPED_COLOUR, 1.2,
        damping,
        progress * Math.PI * 12
      )

      // Current position
      const tNow = progress * Math.PI * 12
      const r = Math.min(W, H) * 0.35
      const damp = Math.exp(-damping * tNow)
      const xPos = cx + r * Math.sin(3 * tNow + Math.PI / 6) * damp
      const yPos = cy + r * Math.cos(2 * tNow) * damp

      ctx!.fillStyle = DOT_COLOUR
      ctx!.beginPath()
      ctx!.arc(xPos, yPos, 4, 0, Math.PI * 2)
      ctx!.fill()

      // Label
      const fontSize = isMobile ? 11 : 13
      ctx!.fillStyle = TEXT_PRIMARY
      ctx!.font = `${fontSize}px monospace`
      ctx!.fillText('Harmonograph - damped oscillation', 16, 28)

      ctx!.fillStyle = TEXT_DIM
      ctx!.font = `${fontSize - 2}px monospace`
      ctx!.fillText(`Damping: ${damping}`, 16, 28 + fontSize + 6)
    }

    function draw(now: number) {
      const elapsed = ((now - startTimeRef.current) / 1000) % DEMO_DURATION

      ctx!.fillStyle = BG
      ctx!.fillRect(0, 0, W, H)

      // Timeline:
      // 0-15: Frequency table
      // 15-30: Animated 3:2 trace
      // 30-46: Harmonograph with damping
      // 46-50: Fade to table

      if (elapsed < 15) {
        drawTable(1)
      } else if (elapsed < 16) {
        // Crossfade
        drawTable(1 - (elapsed - 15))
      } else if (elapsed < 30) {
        drawAnimatedTrace(elapsed, 15)
      } else if (elapsed < 31) {
        // Quick transition
        ctx!.globalAlpha = elapsed - 30
        drawHarmonograph(elapsed, 30)
        ctx!.globalAlpha = 1
      } else if (elapsed < 46) {
        drawHarmonograph(elapsed, 30)
      } else {
        // Fade back
        const fadeT = (elapsed - 46) / 4
        drawTable(Math.min(1, fadeT))
      }

      // Phase indicator
      const fontSize = isMobile ? 10 : 12
      ctx!.fillStyle = TEXT_DIM
      ctx!.font = `${fontSize}px monospace`
      let phase = ''
      if (elapsed < 15) phase = 'Ratio table'
      else if (elapsed < 30) phase = 'Animated trace'
      else if (elapsed < 46) phase = 'Harmonograph'
      else phase = 'Ratio table'
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
