'use client'

import { useRef, useEffect } from 'react'

const BG = '#03060f'
const TEXT_DIM = 'rgba(255, 255, 255, 0.4)'
const TEXT_PRIMARY = 'rgba(255, 255, 255, 0.85)'

// P2 Penrose tiling (kites and darts) via Robinson triangles
// Golden ratio
const PHI = (1 + Math.sqrt(5)) / 2

// Colours for the two triangle types
const KITE_FILL = 'rgba(60, 80, 140, 0.6)'
const DART_FILL = 'rgba(140, 70, 60, 0.6)'
const KITE_STROKE = 'rgba(80, 110, 180, 0.5)'
const DART_STROKE = 'rgba(180, 100, 80, 0.5)'
const GOLDEN_OVERLAY = 'rgba(255, 200, 80, 0.35)'

const DEMO_DURATION = 55

interface Triangle {
  type: 0 | 1 // 0 = thin (dart half), 1 = thick (kite half)
  ax: number; ay: number
  bx: number; by: number
  cx: number; cy: number
}

function subdivide(triangles: Triangle[]): Triangle[] {
  const result: Triangle[] = []

  for (const t of triangles) {
    if (t.type === 1) {
      // Thick triangle (kite half) → 2 thick + 1 thin
      const px = t.ax + (t.bx - t.ax) / PHI
      const py = t.ay + (t.by - t.ay) / PHI

      result.push({ type: 1, ax: t.cx, ay: t.cy, bx: px, by: py, cx: t.bx, cy: t.by })
      result.push({ type: 1, ax: px, ay: py, bx: t.cx, by: t.cy, cx: t.ax, cy: t.ay })
      result.push({ type: 0, ax: px, ay: py, bx: t.bx, by: t.by, cx: t.ax, cy: t.ay })
    } else {
      // Thin triangle (dart half) → 1 thick + 1 thin
      const qx = t.bx + (t.ax - t.bx) / PHI
      const qy = t.by + (t.ay - t.by) / PHI

      result.push({ type: 0, ax: qx, ay: qy, bx: t.cx, by: t.cy, cx: t.ax, cy: t.ay })
      result.push({ type: 1, ax: qx, ay: qy, bx: t.bx, by: t.by, cx: t.cx, cy: t.cy })
    }
  }

  return result
}

function createSunDecagon(cx: number, cy: number, radius: number): Triangle[] {
  const triangles: Triangle[] = []

  for (let i = 0; i < 10; i++) {
    const a1 = (2 * Math.PI * i) / 10
    const a2 = (2 * Math.PI * (i + 1)) / 10

    const bx = cx + radius * Math.cos(a1)
    const by = cy + radius * Math.sin(a1)
    const ex = cx + radius * Math.cos(a2)
    const ey = cy + radius * Math.sin(a2)

    if (i % 2 === 0) {
      triangles.push({ type: 1, ax: cx, ay: cy, bx: ex, by: ey, cx: bx, cy: by })
    } else {
      triangles.push({ type: 1, ax: cx, ay: cy, bx: bx, by: by, cx: ex, cy: ey })
    }
  }

  return triangles
}

export default function PenroseTilingVisualiser() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const tilingLevelsRef = useRef<Triangle[][]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    const isMobile = window.innerWidth < 768
    const maxLevel = isMobile ? 5 : 7

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = rect.width
      H = rect.height
      canvas!.width = W * dpr
      canvas!.height = H * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      precompute()
    }

    function precompute() {
      const cx = W / 2
      const cy = H / 2
      const radius = Math.min(W, H) * 0.42

      const levels: Triangle[][] = []
      let current = createSunDecagon(cx, cy, radius)
      levels.push(current)

      for (let i = 0; i < maxLevel; i++) {
        current = subdivide(current)
        levels.push(current)
      }

      tilingLevelsRef.current = levels
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    startTimeRef.current = performance.now()

    function drawTriangles(triangles: Triangle[], alpha: number, showGolden: boolean) {
      for (const t of triangles) {
        ctx!.globalAlpha = alpha
        ctx!.fillStyle = t.type === 1 ? KITE_FILL : DART_FILL
        ctx!.strokeStyle = t.type === 1 ? KITE_STROKE : DART_STROKE
        ctx!.lineWidth = 0.5

        ctx!.beginPath()
        ctx!.moveTo(t.ax, t.ay)
        ctx!.lineTo(t.bx, t.by)
        ctx!.lineTo(t.cx, t.cy)
        ctx!.closePath()
        ctx!.fill()
        ctx!.stroke()
      }
      ctx!.globalAlpha = 1

      // Golden ratio overlay: draw pentagons formed by kite halves
      if (showGolden) {
        ctx!.strokeStyle = GOLDEN_OVERLAY
        ctx!.lineWidth = 1.5
        ctx!.globalAlpha = 0.6
        // Highlight fivefold symmetry by drawing circles at vertices shared by 5+ tiles
        // Simplified: just draw decagonal guide lines from centre
        const cx = W / 2
        const cy = H / 2
        const r = Math.min(W, H) * 0.35
        for (let i = 0; i < 5; i++) {
          const a1 = (2 * Math.PI * i) / 5
          const a2 = (2 * Math.PI * (i + 2)) / 5
          ctx!.beginPath()
          ctx!.moveTo(cx + r * Math.cos(a1), cy + r * Math.sin(a1))
          ctx!.lineTo(cx + r * Math.cos(a2), cy + r * Math.sin(a2))
          ctx!.stroke()
        }
        // Pentagon outline
        ctx!.beginPath()
        for (let i = 0; i < 5; i++) {
          const a = (2 * Math.PI * i) / 5 - Math.PI / 2
          const px = cx + r * 0.6 * Math.cos(a)
          const py = cy + r * 0.6 * Math.sin(a)
          if (i === 0) ctx!.moveTo(px, py)
          else ctx!.lineTo(px, py)
        }
        ctx!.closePath()
        ctx!.stroke()
        ctx!.globalAlpha = 1
      }
    }

    function draw(now: number) {
      const elapsed = ((now - startTimeRef.current) / 1000) % DEMO_DURATION
      const levels = tilingLevelsRef.current
      if (levels.length === 0) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      ctx!.fillStyle = BG
      ctx!.fillRect(0, 0, W, H)

      // Timeline:
      // 0-12: Seed tile (level 0)
      // 12-28: Deflation progression (levels 1 to ~3)
      // 28-42: Deeper deflation (levels 4 to max) with zoom
      // 42-55: Golden ratio overlay on final level

      let currentLevel: number
      let showGolden = false

      if (elapsed < 12) {
        // Show seed and morph to level 1
        const t = elapsed / 12
        currentLevel = Math.min(Math.floor(t * 2), 1)
      } else if (elapsed < 28) {
        // Levels 1-3
        const t = (elapsed - 12) / 16
        currentLevel = 1 + Math.min(Math.floor(t * 3), 2)
      } else if (elapsed < 42) {
        // Levels 4 to max
        const t = (elapsed - 28) / 14
        currentLevel = 4 + Math.min(Math.floor(t * (maxLevel - 3)), maxLevel - 4)
      } else {
        // Golden ratio overlay on final level
        currentLevel = maxLevel
        showGolden = true
      }

      currentLevel = Math.min(currentLevel, levels.length - 1)

      // Transition: interpolate opacity for smooth level changes
      const alpha = 1.0

      drawTriangles(levels[currentLevel], alpha, showGolden)

      // HUD
      const fontSize = isMobile ? 11 : 13
      ctx!.font = `${fontSize}px monospace`
      ctx!.fillStyle = TEXT_DIM
      ctx!.fillText(`Level ${currentLevel}`, 16, H - 16)
      ctx!.fillText(`${levels[currentLevel].length} triangles`, 16, H - 34)

      // Phase label
      let phase = ''
      if (elapsed < 12) phase = 'Seed decagon'
      else if (elapsed < 42) phase = 'Deflation'
      else phase = 'Fivefold symmetry'
      ctx!.fillStyle = elapsed >= 42 ? TEXT_PRIMARY : TEXT_DIM
      ctx!.font = `${fontSize}px monospace`
      const phaseW = ctx!.measureText(phase).width
      ctx!.fillText(phase, W - phaseW - 16, 28)

      // Aperiodic note at higher levels
      if (currentLevel >= 3) {
        ctx!.fillStyle = TEXT_DIM
        ctx!.font = `${fontSize - 2}px monospace`
        ctx!.fillText('Aperiodic - never repeats', 16, 28)
      }

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
