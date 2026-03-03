'use client'

import { useRef, useEffect } from 'react'

const BG = '#03060f'
const TRACER_COLOUR = 'rgba(255, 180, 80, 1)'
const TRACER_GLOW = 'rgba(255, 180, 80, 0.3)'
const MOLECULE_COLOUR = 'rgba(100, 140, 200, 0.5)'
const PATH_COLOUR = 'rgba(255, 180, 80, 0.4)'
const ENSEMBLE_COLOURS = [
  'rgba(100, 200, 160, 0.8)',
  'rgba(200, 130, 255, 0.8)',
  'rgba(255, 130, 130, 0.8)',
  'rgba(130, 200, 255, 0.8)',
]
const MSD_LINE = 'rgba(100, 200, 160, 0.8)'
const MSD_THEORY = 'rgba(255, 255, 255, 0.3)'
const PANEL_BG = 'rgba(255, 255, 255, 0.03)'
const PANEL_BORDER = 'rgba(255, 255, 255, 0.08)'
const TEXT_PRIMARY = 'rgba(255, 255, 255, 0.85)'
const TEXT_DIM = 'rgba(255, 255, 255, 0.4)'

const DEMO_DURATION = 40 // seconds

interface Molecule {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

interface Tracer {
  x: number
  y: number
  startX: number
  startY: number
  path: { x: number; y: number }[]
  msd: number[]
  colour: string
}

export default function BrownianMotionVisualiser() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const stateRef = useRef<{
    molecules: Molecule[]
    tracers: Tracer[]
    startTime: number
    lastTime: number
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    const isMobile = window.innerWidth < 768
    const moleculeCount = isMobile ? 80 : 200

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

    function initState() {
      // Microscale panel dimensions (left half)
      const panelW = isMobile ? W : W * 0.5
      const panelH = isMobile ? H * 0.5 : H

      const molecules: Molecule[] = []
      for (let i = 0; i < moleculeCount; i++) {
        molecules.push({
          x: Math.random() * panelW,
          y: Math.random() * panelH,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          r: 2 + Math.random() * 1.5,
        })
      }

      const tracers: Tracer[] = [{
        x: panelW / 2,
        y: panelH / 2,
        startX: panelW / 2,
        startY: panelH / 2,
        path: [{ x: panelW / 2, y: panelH / 2 }],
        msd: [0],
        colour: TRACER_COLOUR,
      }]

      stateRef.current = {
        molecules,
        tracers,
        startTime: performance.now(),
        lastTime: performance.now(),
      }
    }

    initState()

    function draw(now: number) {
      const state = stateRef.current!
      const elapsed = (now - state.startTime) / 1000

      // Reset cycle
      if (elapsed > DEMO_DURATION) {
        initState()
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const dt = Math.min((now - state.lastTime) / 1000, 0.05)
      state.lastTime = now

      // Layout
      const panelW = isMobile ? W : W * 0.5
      const panelH = isMobile ? H * 0.5 : H
      const rightX = isMobile ? 0 : W * 0.5
      const rightY = isMobile ? H * 0.5 : 0
      const rightW = isMobile ? W : W * 0.5
      const rightH = isMobile ? H * 0.5 : H

      // Add ensemble tracers at t=24s
      if (elapsed >= 24 && state.tracers.length === 1) {
        for (let i = 0; i < 4; i++) {
          state.tracers.push({
            x: panelW / 2 + (Math.random() - 0.5) * 20,
            y: panelH / 2 + (Math.random() - 0.5) * 20,
            startX: panelW / 2,
            startY: panelH / 2,
            path: [{ x: panelW / 2, y: panelH / 2 }],
            msd: [0],
            colour: ENSEMBLE_COLOURS[i],
          })
        }
      }

      // --- Physics update ---
      const speed = 120
      for (const mol of state.molecules) {
        mol.x += mol.vx * speed * dt
        mol.y += mol.vy * speed * dt

        // Bounce off walls
        if (mol.x < mol.r || mol.x > panelW - mol.r) mol.vx *= -1
        if (mol.y < mol.r || mol.y > panelH - mol.r) mol.vy *= -1
        mol.x = Math.max(mol.r, Math.min(panelW - mol.r, mol.x))
        mol.y = Math.max(mol.r, Math.min(panelH - mol.r, mol.y))
      }

      // Update tracers with random kicks (simulating collisions)
      for (const tracer of state.tracers) {
        const kick = 40 * Math.sqrt(dt)
        tracer.x += (Math.random() - 0.5) * kick * 2
        tracer.y += (Math.random() - 0.5) * kick * 2

        // Clamp to panel
        tracer.x = Math.max(10, Math.min(panelW - 10, tracer.x))
        tracer.y = Math.max(10, Math.min(panelH - 10, tracer.y))

        // Record path (every ~3 frames)
        if (tracer.path.length < elapsed * 20) {
          tracer.path.push({ x: tracer.x, y: tracer.y })
          const dx = tracer.x - tracer.startX
          const dy = tracer.y - tracer.startY
          tracer.msd.push(dx * dx + dy * dy)
        }
      }

      // --- Draw ---
      ctx!.fillStyle = BG
      ctx!.fillRect(0, 0, W, H)

      // Left panel: microscale
      ctx!.fillStyle = PANEL_BG
      ctx!.fillRect(0, 0, panelW, panelH)
      ctx!.strokeStyle = PANEL_BORDER
      ctx!.lineWidth = 0.5
      ctx!.strokeRect(0, 0, panelW, panelH)

      // Molecules
      for (const mol of state.molecules) {
        ctx!.fillStyle = MOLECULE_COLOUR
        ctx!.beginPath()
        ctx!.arc(mol.x, mol.y, mol.r, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Primary tracer (always)
      const mainTracer = state.tracers[0]

      // Draw path
      if (mainTracer.path.length > 1) {
        ctx!.strokeStyle = PATH_COLOUR
        ctx!.lineWidth = 1
        ctx!.beginPath()
        ctx!.moveTo(mainTracer.path[0].x, mainTracer.path[0].y)
        for (let i = 1; i < mainTracer.path.length; i++) {
          ctx!.lineTo(mainTracer.path[i].x, mainTracer.path[i].y)
        }
        ctx!.stroke()
      }

      // Tracer glow
      ctx!.fillStyle = TRACER_GLOW
      ctx!.beginPath()
      ctx!.arc(mainTracer.x, mainTracer.y, 12, 0, Math.PI * 2)
      ctx!.fill()

      // Tracer dot
      ctx!.fillStyle = mainTracer.colour
      ctx!.beginPath()
      ctx!.arc(mainTracer.x, mainTracer.y, 5, 0, Math.PI * 2)
      ctx!.fill()

      // Ensemble tracers
      for (let i = 1; i < state.tracers.length; i++) {
        const t = state.tracers[i]
        // Path
        if (t.path.length > 1) {
          ctx!.strokeStyle = t.colour.replace('0.8', '0.3')
          ctx!.lineWidth = 0.8
          ctx!.beginPath()
          ctx!.moveTo(t.path[0].x, t.path[0].y)
          for (let j = 1; j < t.path.length; j++) {
            ctx!.lineTo(t.path[j].x, t.path[j].y)
          }
          ctx!.stroke()
        }
        // Dot
        ctx!.fillStyle = t.colour
        ctx!.beginPath()
        ctx!.arc(t.x, t.y, 4, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Left panel label
      const fontSize = isMobile ? 11 : 13
      ctx!.font = `${fontSize}px monospace`
      ctx!.fillStyle = TEXT_DIM
      ctx!.fillText('Microscale', 12, 24)

      // --- Right panel: trajectory + MSD ---
      ctx!.fillStyle = PANEL_BG
      ctx!.fillRect(rightX, rightY, rightW, rightH)
      ctx!.strokeStyle = PANEL_BORDER
      ctx!.lineWidth = 0.5
      ctx!.strokeRect(rightX, rightY, rightW, rightH)

      // Top half of right: zoomed-out trajectory
      const trajH = rightH * 0.55
      ctx!.fillStyle = TEXT_DIM
      ctx!.font = `${fontSize}px monospace`
      ctx!.fillText('Random walk trajectory', rightX + 12, rightY + 24)

      // Draw trajectory centred
      const trajCx = rightX + rightW / 2
      const trajCy = rightY + trajH / 2 + 12
      const trajScale = 0.5

      // All tracer paths in trajectory view
      for (const t of state.tracers) {
        if (t.path.length < 2) continue
        ctx!.strokeStyle = t === mainTracer ? PATH_COLOUR : t.colour.replace('0.8', '0.3')
        ctx!.lineWidth = t === mainTracer ? 1.2 : 0.8
        ctx!.beginPath()
        const ox = t.path[0].x
        const oy = t.path[0].y
        ctx!.moveTo(trajCx, trajCy)
        for (let i = 1; i < t.path.length; i++) {
          ctx!.lineTo(
            trajCx + (t.path[i].x - ox) * trajScale,
            trajCy + (t.path[i].y - oy) * trajScale
          )
        }
        ctx!.stroke()
      }

      // Origin marker
      ctx!.strokeStyle = 'rgba(255, 255, 255, 0.15)'
      ctx!.lineWidth = 0.5
      ctx!.beginPath()
      ctx!.moveTo(trajCx - 8, trajCy)
      ctx!.lineTo(trajCx + 8, trajCy)
      ctx!.moveTo(trajCx, trajCy - 8)
      ctx!.lineTo(trajCx, trajCy + 8)
      ctx!.stroke()

      // Bottom half of right: MSD graph
      const msdY = rightY + trajH + 8
      const msdH = rightH - trajH - 16
      const msdX = rightX + 40
      const msdW = rightW - 60

      ctx!.fillStyle = TEXT_DIM
      ctx!.font = `${fontSize}px monospace`
      ctx!.fillText('Mean squared displacement', rightX + 12, msdY + 4)

      // MSD axes
      const graphY = msdY + 16
      const graphH = msdH - 32
      ctx!.strokeStyle = 'rgba(255, 255, 255, 0.12)'
      ctx!.lineWidth = 0.5
      ctx!.beginPath()
      ctx!.moveTo(msdX, graphY)
      ctx!.lineTo(msdX, graphY + graphH)
      ctx!.lineTo(msdX + msdW, graphY + graphH)
      ctx!.stroke()

      // Axis labels
      ctx!.fillStyle = TEXT_DIM
      ctx!.font = `${fontSize - 2}px monospace`
      ctx!.fillText('t', msdX + msdW - 8, graphY + graphH + 14)
      ctx!.save()
      ctx!.translate(msdX - 8, graphY + graphH / 2)
      ctx!.rotate(-Math.PI / 2)
      ctx!.fillText('<r²>', -16, 0)
      ctx!.restore()

      // Plot MSD for each tracer
      const msdData = mainTracer.msd
      if (msdData.length > 2) {
        const maxMSD = Math.max(...msdData, 1)
        const xScale = msdW / msdData.length
        const yScale = graphH / maxMSD

        // Theoretical linear line (if showing trend)
        if (elapsed >= 32) {
          // Linear fit: MSD ≈ slope * t
          const slope = msdData[msdData.length - 1] / msdData.length
          ctx!.strokeStyle = MSD_THEORY
          ctx!.lineWidth = 1
          ctx!.setLineDash([4, 4])
          ctx!.beginPath()
          ctx!.moveTo(msdX, graphY + graphH)
          ctx!.lineTo(msdX + msdW, graphY + graphH - slope * msdData.length * yScale)
          ctx!.stroke()
          ctx!.setLineDash([])

          // Label
          ctx!.fillStyle = TEXT_PRIMARY
          ctx!.font = `${fontSize}px monospace`
          ctx!.fillText('<r²> = 2Dt', msdX + msdW - 80, graphY + 16)
        }

        // MSD line
        ctx!.strokeStyle = MSD_LINE
        ctx!.lineWidth = 1.5
        ctx!.beginPath()
        for (let i = 0; i < msdData.length; i++) {
          const px = msdX + i * xScale
          const py = graphY + graphH - msdData[i] * yScale
          if (i === 0) ctx!.moveTo(px, py)
          else ctx!.lineTo(px, py)
        }
        ctx!.stroke()
      }

      // Phase label
      ctx!.fillStyle = TEXT_DIM
      ctx!.font = `${fontSize - 2}px monospace`
      let phase = ''
      if (elapsed < 12) phase = 'Collisions'
      else if (elapsed < 24) phase = 'Random walk'
      else if (elapsed < 32) phase = 'Ensemble spread'
      else phase = 'Linear MSD'
      const phaseW = ctx!.measureText(phase).width
      ctx!.fillText(phase, W - phaseW - 16, (isMobile ? 0 : 0) + 24)

      // Time
      ctx!.fillStyle = TEXT_DIM
      ctx!.font = `${fontSize - 2}px monospace`
      ctx!.fillText(`t = ${elapsed.toFixed(1)}s`, 12, H - 12)

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
