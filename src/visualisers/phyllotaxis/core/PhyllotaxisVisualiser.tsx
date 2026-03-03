'use client'

import { useRef, useEffect } from 'react'

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)) // ~137.508° in radians
const DEG_TO_RAD = Math.PI / 180

// Demo timeline phases (in seconds)
const PHASE_GROW = 0       // Seeds appear from centre
const PHASE_ZOOM = 8       // Camera zooms out
const PHASE_FULL = 14      // Full pattern visible
const PHASE_MORPH = 18     // Angle morphs from 90° to golden
const PHASE_SPIRALS = 24   // Spiral arms highlight
const PHASE_RESET = 30     // Reset

// Colours
const BG = '#03060f'
const SEED_COLOUR = 'rgba(200, 180, 140, 0.85)'
const SEED_GLOW = 'rgba(255, 220, 160, 0.4)'
const SPIRAL_COLOURS = [
  'rgba(100, 160, 255, 0.7)',
  'rgba(255, 130, 100, 0.7)',
]
const TEXT_PRIMARY = 'rgba(255, 255, 255, 0.85)'
const TEXT_DIM = 'rgba(255, 255, 255, 0.4)'

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t))
}

export default function PhyllotaxisVisualiser() {
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

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 2 : 2)
      W = rect.width
      H = rect.height
      canvas!.width = W * dpr
      canvas!.height = H * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    const isMobile = window.innerWidth < 768
    const maxSeeds = isMobile ? 600 : 1200
    const seedRadius = isMobile ? 2.5 : 3

    startTimeRef.current = performance.now()

    function draw(now: number) {
      const elapsed = ((now - startTimeRef.current) / 1000) % PHASE_RESET

      // Clear
      ctx!.fillStyle = BG
      ctx!.fillRect(0, 0, W, H)

      const cx = W / 2
      const cy = H / 2
      const minDim = Math.min(W, H)

      // --- Determine current state from timeline ---

      // How many seeds to show
      let seedCount: number
      if (elapsed < PHASE_ZOOM) {
        // Growing: 0 to maxSeeds over 8s
        const t = elapsed / PHASE_ZOOM
        seedCount = Math.floor(easeInOutCubic(t) * maxSeeds)
      } else {
        seedCount = maxSeeds
      }

      // Zoom level (scale factor for the pattern)
      let scale: number
      if (elapsed < PHASE_ZOOM) {
        // Close-up: large scale
        scale = minDim * 0.04
      } else if (elapsed < PHASE_FULL) {
        // Zoom out
        const t = easeInOutCubic((elapsed - PHASE_ZOOM) / (PHASE_FULL - PHASE_ZOOM))
        scale = lerp(minDim * 0.04, minDim * 0.013, t)
      } else {
        scale = minDim * 0.013
      }

      // Divergence angle
      let angle: number
      let showAngleLabel = false
      if (elapsed < PHASE_MORPH) {
        angle = GOLDEN_ANGLE
      } else if (elapsed < PHASE_SPIRALS) {
        // Morph from 90° to golden angle
        showAngleLabel = true
        const t = easeInOutCubic((elapsed - PHASE_MORPH) / (PHASE_SPIRALS - PHASE_MORPH))
        // Start at 90°, morph to golden
        angle = lerp(90 * DEG_TO_RAD, GOLDEN_ANGLE, t)
      } else {
        angle = GOLDEN_ANGLE
      }

      // Spiral highlighting
      let showSpirals = elapsed >= PHASE_SPIRALS
      let spiralOpacity = 0
      if (showSpirals) {
        spiralOpacity = Math.min(1, (elapsed - PHASE_SPIRALS) / 1.5)
      }

      // --- Compute seed positions ---
      const seeds: { x: number; y: number; i: number }[] = []
      for (let i = 0; i < seedCount; i++) {
        const r = scale * Math.sqrt(i)
        const theta = i * angle
        const x = cx + r * Math.cos(theta)
        const y = cy + r * Math.sin(theta)
        seeds.push({ x, y, i })
      }

      // --- Draw spiral arm highlights ---
      if (showSpirals && spiralOpacity > 0) {
        // Fibonacci spiral families: 13 CW, 21 CCW
        const families = [13, 21]
        families.forEach((fam, fi) => {
          ctx!.strokeStyle = SPIRAL_COLOURS[fi]
          ctx!.lineWidth = 1.5
          ctx!.globalAlpha = spiralOpacity * 0.5

          for (let arm = 0; arm < fam; arm++) {
            ctx!.beginPath()
            let started = false
            for (let i = arm; i < seedCount; i += fam) {
              const r = scale * Math.sqrt(i)
              const theta = i * angle
              const x = cx + r * Math.cos(theta)
              const y = cy + r * Math.sin(theta)
              if (!started) {
                ctx!.moveTo(x, y)
                started = true
              } else {
                ctx!.lineTo(x, y)
              }
            }
            ctx!.stroke()
          }
        })
        ctx!.globalAlpha = 1
      }

      // --- Draw seeds ---
      for (const seed of seeds) {
        // Subtle glow
        ctx!.fillStyle = SEED_GLOW
        ctx!.beginPath()
        ctx!.arc(seed.x, seed.y, seedRadius * 2, 0, Math.PI * 2)
        ctx!.fill()

        // Seed dot
        ctx!.fillStyle = SEED_COLOUR
        ctx!.beginPath()
        ctx!.arc(seed.x, seed.y, seedRadius, 0, Math.PI * 2)
        ctx!.fill()
      }

      // --- Draw new seed pulse (during growth phase) ---
      if (elapsed < PHASE_ZOOM && seeds.length > 0) {
        const newest = seeds[seeds.length - 1]
        const pulse = ((now / 100) % 1)
        ctx!.strokeStyle = `rgba(255, 220, 160, ${0.5 * (1 - pulse)})`
        ctx!.lineWidth = 1
        ctx!.beginPath()
        ctx!.arc(newest.x, newest.y, seedRadius + pulse * 8, 0, Math.PI * 2)
        ctx!.stroke()
      }

      // --- HUD text ---
      const fontSize = isMobile ? 11 : 13
      ctx!.font = `${fontSize}px monospace`

      // Seed count
      ctx!.fillStyle = TEXT_DIM
      ctx!.fillText(`Seeds: ${seedCount}`, 16, H - 16)

      // Angle display
      const angleDeg = (angle / DEG_TO_RAD).toFixed(2)
      if (showAngleLabel || elapsed >= PHASE_SPIRALS) {
        ctx!.fillStyle = TEXT_PRIMARY
        ctx!.fillText(`Angle: ${angleDeg}°`, 16, 28)

        if (elapsed >= PHASE_SPIRALS) {
          ctx!.fillStyle = TEXT_DIM
          ctx!.fillText(`Golden angle: 137.51°`, 16, 28 + fontSize + 6)
        }
      } else if (elapsed >= PHASE_FULL) {
        ctx!.fillStyle = TEXT_DIM
        ctx!.fillText(`Angle: ${angleDeg}°`, 16, 28)
      }

      // Spiral count labels
      if (showSpirals && spiralOpacity > 0) {
        ctx!.globalAlpha = spiralOpacity
        ctx!.fillStyle = SPIRAL_COLOURS[0]
        ctx!.fillText('13 spirals', W - (isMobile ? 100 : 120), H - 36)
        ctx!.fillStyle = SPIRAL_COLOURS[1]
        ctx!.fillText('21 spirals', W - (isMobile ? 100 : 120), H - 16)
        ctx!.globalAlpha = 1

        // Fibonacci note
        ctx!.fillStyle = TEXT_DIM
        ctx!.font = `${fontSize - 2}px monospace`
        ctx!.fillText('Consecutive Fibonacci numbers', W - (isMobile ? 190 : 220), H - 56)
      }

      // Phase indicator
      ctx!.fillStyle = TEXT_DIM
      ctx!.font = `${fontSize - 2}px monospace`
      let phaseLabel = ''
      if (elapsed < PHASE_ZOOM) phaseLabel = 'Growing'
      else if (elapsed < PHASE_FULL) phaseLabel = 'Zooming out'
      else if (elapsed < PHASE_MORPH) phaseLabel = 'Golden angle packing'
      else if (elapsed < PHASE_SPIRALS) phaseLabel = 'Angle comparison'
      else phaseLabel = 'Fibonacci spirals'
      ctx!.fillText(phaseLabel, W - ctx!.measureText(phaseLabel).width - 16, 28)

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
