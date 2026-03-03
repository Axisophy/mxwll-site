'use client'

import { useRef, useEffect } from 'react'

const BG = '#03060f'
const TEXT_DIM = 'rgba(255, 255, 255, 0.4)'
const TEXT_PRIMARY = 'rgba(255, 255, 255, 0.85)'
const HILBERT_COLOUR = 'rgba(100, 180, 255, 0.8)'
const PEANO_COLOUR = 'rgba(255, 160, 100, 0.8)'
const LOCALITY_COLOUR = 'rgba(100, 200, 160, 0.7)'
const GRID_COLOUR = 'rgba(255, 255, 255, 0.04)'
const DOT_COLOUR = 'rgba(255, 200, 100, 1)'

const DEMO_DURATION = 55

// Hilbert curve point generation
function hilbertD2xy(n: number, d: number): [number, number] {
  let rx: number, ry: number, s: number
  let x = 0, y = 0
  let t = d

  for (s = 1; s < n; s *= 2) {
    rx = (t & 2) !== 0 ? 1 : 0
    ry = ((t & 1) !== 0 ? 1 : 0) ^ rx ? 0 : (t & 1) !== 0 ? 1 : 0

    // Simplified: use standard rotation
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x
        y = s - 1 - y
      }
      const temp = x
      x = y
      y = temp
    }

    x += s * rx
    y += s * ry
    t = Math.floor(t / 4)
  }

  return [x, y]
}

// Alternative Hilbert implementation using L-system approach
function generateHilbert(level: number): [number, number][] {
  if (level === 0) return [[0, 0]]

  // Generate via recursive L-system interpretation
  let instructions = 'A'
  for (let i = 0; i < level; i++) {
    let next = ''
    for (const ch of instructions) {
      if (ch === 'A') next += '-BF+AFA+FB-'
      else if (ch === 'B') next += '+AF-BFB-FA+'
      else next += ch
    }
    instructions = next
  }

  const points: [number, number][] = []
  let x = 0, y = 0
  let dir = 0 // 0=right, 1=up, 2=left, 3=down
  const dx = [1, 0, -1, 0]
  const dy = [0, -1, 0, 1]

  points.push([x, y])

  for (const ch of instructions) {
    if (ch === 'F') {
      x += dx[dir]
      y += dy[dir]
      points.push([x, y])
    } else if (ch === '+') {
      dir = (dir + 1) % 4
    } else if (ch === '-') {
      dir = (dir + 3) % 4
    }
  }

  return points
}

// Peano curve via L-system
function generatePeano(level: number): [number, number][] {
  if (level === 0) return [[0, 0]]

  let instructions = 'X'
  for (let i = 0; i < level; i++) {
    let next = ''
    for (const ch of instructions) {
      if (ch === 'X') next += 'XFYFX+F+YFXFY-F-XFYFX'
      else if (ch === 'Y') next += 'YFXFY-F-XFYFX+F+YFXFY'
      else next += ch
    }
    instructions = next
  }

  const points: [number, number][] = []
  let x = 0, y = 0
  let dir = 0
  const dx = [1, 0, -1, 0]
  const dy = [0, -1, 0, 1]

  points.push([x, y])

  for (const ch of instructions) {
    if (ch === 'F') {
      x += dx[dir]
      y += dy[dir]
      points.push([x, y])
    } else if (ch === '+') {
      dir = (dir + 1) % 4
    } else if (ch === '-') {
      dir = (dir + 3) % 4
    }
  }

  return points
}

export default function SpaceFillingCurvesVisualiser() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const hilbertLevelsRef = useRef<[number, number][][]>([])
  const peanoLevelsRef = useRef<[number, number][][]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    const isMobile = window.innerWidth < 768
    const hilbertMax = isMobile ? 5 : 7
    const peanoMax = isMobile ? 3 : 4

    function precompute() {
      const hLevels: [number, number][][] = []
      for (let i = 1; i <= hilbertMax; i++) {
        hLevels.push(generateHilbert(i))
      }
      hilbertLevelsRef.current = hLevels

      const pLevels: [number, number][][] = []
      for (let i = 1; i <= peanoMax; i++) {
        pLevels.push(generatePeano(i))
      }
      peanoLevelsRef.current = pLevels
    }

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
    precompute()

    startTimeRef.current = performance.now()

    function drawCurve(
      points: [number, number][],
      colour: string,
      progress: number, // 0-1
      padX: number, padY: number,
      drawW: number, drawH: number,
    ) {
      if (points.length < 2) return

      // Find bounds
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
      for (const [x, y] of points) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }

      const rangeX = maxX - minX || 1
      const rangeY = maxY - minY || 1
      const scale = Math.min(drawW / rangeX, drawH / rangeY) * 0.9
      const offX = padX + (drawW - rangeX * scale) / 2
      const offY = padY + (drawH - rangeY * scale) / 2

      const endIdx = Math.floor(progress * (points.length - 1))

      // Grid
      ctx!.strokeStyle = GRID_COLOUR
      ctx!.lineWidth = 0.5
      const gridSize = scale
      if (gridSize > 4) {
        for (let gx = minX; gx <= maxX; gx++) {
          const px = offX + (gx - minX) * scale
          ctx!.beginPath()
          ctx!.moveTo(px, padY)
          ctx!.lineTo(px, padY + drawH)
          ctx!.stroke()
        }
        for (let gy = minY; gy <= maxY; gy++) {
          const py = offY + (gy - minY) * scale
          ctx!.beginPath()
          ctx!.moveTo(padX, py)
          ctx!.lineTo(padX + drawW, py)
          ctx!.stroke()
        }
      }

      // Curve
      ctx!.strokeStyle = colour
      ctx!.lineWidth = Math.max(1, Math.min(2.5, scale * 0.15))
      ctx!.beginPath()
      for (let i = 0; i <= endIdx && i < points.length; i++) {
        const px = offX + (points[i][0] - minX) * scale
        const py = offY + (points[i][1] - minY) * scale
        if (i === 0) ctx!.moveTo(px, py)
        else ctx!.lineTo(px, py)
      }
      ctx!.stroke()

      // Current position dot
      if (endIdx < points.length && progress < 1) {
        const [ex, ey] = points[endIdx]
        const px = offX + (ex - minX) * scale
        const py = offY + (ey - minY) * scale
        ctx!.fillStyle = DOT_COLOUR
        ctx!.beginPath()
        ctx!.arc(px, py, 3, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function draw(now: number) {
      const elapsed = ((now - startTimeRef.current) / 1000) % DEMO_DURATION
      const hLevels = hilbertLevelsRef.current
      const pLevels = peanoLevelsRef.current

      ctx!.fillStyle = BG
      ctx!.fillRect(0, 0, W, H)

      const fontSize = isMobile ? 11 : 13
      const pad = 16

      // Timeline:
      // 0-20: Hilbert curve levels 1 to max
      // 20-38: Peano curve levels 1 to max
      // 38-52: Locality demo (colour-mapped Hilbert)
      // 52-55: Fade

      if (elapsed < 20 && hLevels.length > 0) {
        // Hilbert growth
        const t = elapsed / 20
        const levelIdx = Math.min(Math.floor(t * hLevels.length), hLevels.length - 1)
        const levelProgress = (t * hLevels.length) % 1

        // Draw the curve with animation within each level
        const points = hLevels[levelIdx]
        const progress = levelIdx < hLevels.length - 1 ? 1 : Math.min(levelProgress * 3, 1)

        drawCurve(points, HILBERT_COLOUR, progress, pad, 50, W - pad * 2, H - 70)

        // Labels
        ctx!.fillStyle = TEXT_PRIMARY
        ctx!.font = `${fontSize}px monospace`
        ctx!.fillText(`Hilbert curve - Level ${levelIdx + 1}`, pad, 32)

        ctx!.fillStyle = TEXT_DIM
        ctx!.font = `${fontSize - 2}px monospace`
        ctx!.fillText(`${points.length} points`, pad, H - 12)

      } else if (elapsed < 38 && pLevels.length > 0) {
        // Peano growth
        const t = (elapsed - 20) / 18
        const levelIdx = Math.min(Math.floor(t * pLevels.length), pLevels.length - 1)

        const points = pLevels[levelIdx]
        drawCurve(points, PEANO_COLOUR, 1, pad, 50, W - pad * 2, H - 70)

        ctx!.fillStyle = TEXT_PRIMARY
        ctx!.font = `${fontSize}px monospace`
        ctx!.fillText(`Peano curve - Level ${levelIdx + 1}`, pad, 32)

        ctx!.fillStyle = TEXT_DIM
        ctx!.font = `${fontSize - 2}px monospace`
        ctx!.fillText(`${points.length} points`, pad, H - 12)

      } else if (elapsed < 52 && hLevels.length > 0) {
        // Locality demo: colour each segment by position on curve
        const points = hLevels[Math.min(4, hLevels.length) - 1]
        if (points.length > 1) {
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
          for (const [x, y] of points) {
            if (x < minX) minX = x
            if (x > maxX) maxX = x
            if (y < minY) minY = y
            if (y > maxY) maxY = y
          }
          const rangeX = maxX - minX || 1
          const rangeY = maxY - minY || 1
          const drawW = W - pad * 2
          const drawH = H - 70
          const scale = Math.min(drawW / rangeX, drawH / rangeY) * 0.9
          const offX = pad + (drawW - rangeX * scale) / 2
          const offY = 50 + (drawH - rangeY * scale) / 2

          for (let i = 0; i < points.length - 1; i++) {
            const t = i / (points.length - 1)
            // Rainbow colour based on position along curve
            const hue = t * 300
            ctx!.strokeStyle = `hsla(${hue}, 70%, 60%, 0.8)`
            ctx!.lineWidth = Math.max(1.5, scale * 0.15)
            ctx!.beginPath()
            const [x1, y1] = points[i]
            const [x2, y2] = points[i + 1]
            ctx!.moveTo(offX + (x1 - minX) * scale, offY + (y1 - minY) * scale)
            ctx!.lineTo(offX + (x2 - minX) * scale, offY + (y2 - minY) * scale)
            ctx!.stroke()
          }
        }

        ctx!.fillStyle = TEXT_PRIMARY
        ctx!.font = `${fontSize}px monospace`
        ctx!.fillText('Locality preservation', pad, 32)

        ctx!.fillStyle = TEXT_DIM
        ctx!.font = `${fontSize - 2}px monospace`
        ctx!.fillText('Nearby points on the curve map to nearby points in 2D', pad, 32 + fontSize + 4)
      }

      // Phase indicator
      ctx!.fillStyle = TEXT_DIM
      ctx!.font = `${fontSize - 2}px monospace`
      let phase = ''
      if (elapsed < 20) phase = 'Hilbert'
      else if (elapsed < 38) phase = 'Peano'
      else if (elapsed < 52) phase = 'Locality'
      else phase = 'Resetting'
      const phaseW = ctx!.measureText(phase).width
      ctx!.fillText(phase, W - phaseW - pad, 28)

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
