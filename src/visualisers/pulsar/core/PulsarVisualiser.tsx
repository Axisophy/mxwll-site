'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'

// ─── Presets ────────────────────────────────────────────────────────────────

interface Preset {
  name: string
  label: string
  period: number        // seconds per rotation
  beamHalfAngle: number // radians
  fieldIntensity: number
  audioFreq: number
  audioDuration: number
  type: 'normal' | 'millisecond' | 'magnetar'
}

const PRESETS: Preset[] = [
  {
    name: 'PSR B1919+21',
    label: 'Normal Pulsar',
    period: 1.337,
    beamHalfAngle: 10 * Math.PI / 180,
    fieldIntensity: 0.3,
    audioFreq: 220,
    audioDuration: 0.08,
    type: 'normal',
  },
  {
    name: 'PSR J1748-2446ad',
    label: 'Millisecond Pulsar',
    period: 0.08, // visual period (actual 1.396ms is too fast to render)
    beamHalfAngle: 5 * Math.PI / 180,
    fieldIntensity: 0.15,
    audioFreq: 716,
    audioDuration: 0.002,
    type: 'millisecond',
  },
  {
    name: 'SGR 1806-20',
    label: 'Magnetar',
    period: 7.56,
    beamHalfAngle: 15 * Math.PI / 180,
    fieldIntensity: 1.0,
    audioFreq: 80,
    audioDuration: 0.25,
    type: 'magnetar',
  },
]

// ─── Shaders ────────────────────────────────────────────────────────────────

const STAR_VERT = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const STAR_FRAG = `
uniform float uTime;
uniform float uMagnetar;
varying vec3 vNormal;
varying vec3 vPosition;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  float n1 = noise(vPosition.xy * 10.0 + uTime * 0.15);
  float n2 = noise(vPosition.yz * 14.0 - uTime * 0.1);
  float cracks = smoothstep(0.28, 0.35, abs(n1 - 0.5)) * smoothstep(0.28, 0.35, abs(n2 - 0.5));

  vec3 hotGlow = mix(vec3(1.0, 0.5, 0.2), vec3(0.6, 0.2, 0.9), uMagnetar);
  vec3 surface = mix(vec3(0.95, 0.9, 0.85), vec3(0.8, 0.75, 0.95), uMagnetar);
  vec3 col = mix(hotGlow, surface, cracks);

  float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
  vec3 fresnelCol = mix(vec3(0.3, 0.5, 1.0), vec3(0.7, 0.3, 1.0), uMagnetar);
  col += fresnel * fresnelCol * 0.6;

  gl_FragColor = vec4(col, 1.0);
}
`

const BEAM_VERT = `
varying float vAlpha;
varying float vRadius;
void main() {
  vAlpha = 1.0 - smoothstep(0.0, 1.0, (position.y + 4.0) / 8.0);
  vRadius = length(position.xz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const BEAM_FRAG = `
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;
varying float vRadius;
void main() {
  float radial = exp(-vRadius * vRadius * 0.8);
  float alpha = vAlpha * radial * uOpacity;
  gl_FragColor = vec4(uColor, alpha * 0.6);
}
`

// ─── Component ──────────────────────────────────────────────────────────────

export default function PulsarVisualiser() {
  const containerRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const [presetIdx, setPresetIdx] = useState(0)
  const [muted, setMuted] = useState(true)
  const [showInstructions, setShowInstructions] = useState(true)

  const stateRef = useRef({
    period: PRESETS[0].period,
    targetPeriod: PRESETS[0].period,
    axisTilt: 0.0,
    magneticInclination: Math.PI / 4,
    cameraDistance: 10,
    isMuted: true,
    presetType: 'normal' as string,
    beamHalfAngle: PRESETS[0].beamHalfAngle,
    fieldIntensity: PRESETS[0].fieldIntensity,
    targetFieldIntensity: PRESETS[0].fieldIntensity,
    audioFreq: PRESETS[0].audioFreq,
    audioDuration: PRESETS[0].audioDuration,
    audioCtx: null as AudioContext | null,
    continuousOsc: null as OscillatorNode | null,
    continuousGain: null as GainNode | null,
    lastBeamCross: false,
    flashOpacity: 0,
    disposed: false,
  })

  // Update state when preset changes
  useEffect(() => {
    const p = PRESETS[presetIdx]
    const s = stateRef.current
    s.targetPeriod = p.period
    s.beamHalfAngle = p.beamHalfAngle
    s.targetFieldIntensity = p.fieldIntensity
    s.audioFreq = p.audioFreq
    s.audioDuration = p.audioDuration
    s.presetType = p.type

    // Handle continuous oscillator for millisecond preset
    if (p.type === 'millisecond' && s.audioCtx && !s.isMuted) {
      startContinuousTone(s)
    } else {
      stopContinuousTone(s)
    }
  }, [presetIdx])

  // Sync muted state
  useEffect(() => {
    stateRef.current.isMuted = muted
    if (muted) {
      stopContinuousTone(stateRef.current)
    } else if (stateRef.current.presetType === 'millisecond') {
      ensureAudioCtx(stateRef.current)
      startContinuousTone(stateRef.current)
    }
  }, [muted])

  // ─── Three.js Setup ───────────────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const state = stateRef.current
    state.disposed = false

    const rect = container.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio, 2)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: false,
    })
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x000000, 1)
    container.appendChild(renderer.domElement)

    // Camera
    const camera = new THREE.PerspectiveCamera(50, rect.width / rect.height, 0.1, 100)
    camera.position.set(0, 0, state.cameraDistance)

    // Scene
    const scene = new THREE.Scene()

    // ── Star ──
    const starMat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uMagnetar: { value: 0 },
      },
    })
    const star = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), starMat)
    scene.add(star)

    // ── Glow sprite ──
    const glowCanvas = document.createElement('canvas')
    glowCanvas.width = 128
    glowCanvas.height = 128
    const gCtx = glowCanvas.getContext('2d')!
    const grad = gCtx.createRadialGradient(64, 64, 0, 64, 64, 64)
    grad.addColorStop(0, 'rgba(150,180,255,0.4)')
    grad.addColorStop(0.4, 'rgba(100,140,255,0.15)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    gCtx.fillStyle = grad
    gCtx.fillRect(0, 0, 128, 128)
    const glowTex = new THREE.CanvasTexture(glowCanvas)
    const glowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false })
    )
    glowSprite.scale.set(5, 5, 1)
    scene.add(glowSprite)

    // ── Rotation and magnetic pivot ──
    const rotationGroup = new THREE.Group()
    const magneticPivot = new THREE.Group()
    magneticPivot.rotation.z = state.magneticInclination
    rotationGroup.add(magneticPivot)
    scene.add(rotationGroup)

    // ── Beams ──
    const beamLength = 8
    const beamRadius = 2
    const beamGeo = new THREE.ConeGeometry(beamRadius, beamLength, 32, 1, true)
    const beamColor = new THREE.Color(0.4, 0.6, 1.0)

    const beamMat1 = new THREE.ShaderMaterial({
      vertexShader: BEAM_VERT,
      fragmentShader: BEAM_FRAG,
      uniforms: { uColor: { value: beamColor }, uOpacity: { value: 0.5 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const beam1 = new THREE.Mesh(beamGeo, beamMat1)
    beam1.position.y = 1 + beamLength / 2
    beam1.rotation.x = Math.PI
    magneticPivot.add(beam1)

    const beamMat2 = beamMat1.clone()
    const beam2 = new THREE.Mesh(beamGeo, beamMat2)
    beam2.position.y = -(1 + beamLength / 2)
    magneticPivot.add(beam2)

    // ── Field lines (magnetic dipole) ──
    const fieldLines: THREE.Line[] = []
    const fieldLineMat = new THREE.LineBasicMaterial({
      color: 0x6688ff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    })

    function createFieldLine(R0: number, phi: number) {
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= 80; i++) {
        const theta = (i / 80) * Math.PI
        const sinT = Math.sin(theta)
        const r = R0 * sinT * sinT
        if (r < 0.05) { pts.push(new THREE.Vector3(0, r > 0 ? R0 * 0.001 : -R0 * 0.001, 0)); continue }
        pts.push(new THREE.Vector3(
          r * sinT * Math.cos(phi),
          r * Math.cos(theta),
          r * sinT * Math.sin(phi),
        ))
      }
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        fieldLineMat.clone()
      )
      magneticPivot.add(line)
      fieldLines.push(line)
    }

    const fieldR0s = [3, 5, 7]
    const fieldPhis = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3]
    for (const R0 of fieldR0s) {
      for (const phi of fieldPhis) {
        createFieldLine(R0, phi)
      }
    }

    // ── Particles along field lines ──
    const particleCount = 200
    const particleData = new Float32Array(particleCount * 4) // x, y, z, t
    const particleR0 = new Float32Array(particleCount)
    const particlePhi = new Float32Array(particleCount)
    const particleSpeed = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      particleR0[i] = fieldR0s[Math.floor(Math.random() * fieldR0s.length)] + (Math.random() - 0.5) * 1
      particlePhi[i] = Math.random() * Math.PI * 2
      particleSpeed[i] = 0.1 + Math.random() * 0.15
      particleData[i * 4 + 3] = Math.random() // t parameter
    }

    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const particleSprite = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        size: 0.06,
        color: 0x8899ff,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      })
    )
    magneticPivot.add(particleSprite)

    // ── Resize ──
    function onResize() {
      if (!container) return
      const r = container.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      renderer.setSize(r.width, r.height)
      camera.aspect = r.width / r.height
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(container)

    // ── Gesture handling ──
    let isDragging = false
    let lastX = 0, lastY = 0
    let lastPinchDist = 0
    let lastTapTime = 0

    function onPointerDown(e: PointerEvent) {
      isDragging = true
      lastX = e.clientX
      lastY = e.clientY
      setShowInstructions(false)
      ensureAudioCtx(state)
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY

      // Horizontal: change period
      state.targetPeriod = Math.max(0.05, Math.min(15, state.targetPeriod * (1 - dx * 0.003)))
      // Vertical: tilt axis
      state.axisTilt = Math.max(-1.2, Math.min(1.2, state.axisTilt + dy * 0.005))
    }

    function onPointerUp() { isDragging = false }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      state.cameraDistance = Math.max(3, Math.min(25, state.cameraDistance + e.deltaY * 0.01))
    }

    function onDoubleTap() {
      setPresetIdx(i => (i + 1) % PRESETS.length)
    }

    function onClick(e: MouseEvent) {
      const now = Date.now()
      if (now - lastTapTime < 350) {
        onDoubleTap()
        lastTapTime = 0
      } else {
        lastTapTime = now
      }
    }

    // Touch handling
    function onTouchStart(e: TouchEvent) {
      setShowInstructions(false)
      ensureAudioCtx(state)
      if (e.touches.length === 1) {
        isDragging = true
        lastX = e.touches[0].clientX
        lastY = e.touches[0].clientY
      } else if (e.touches.length === 2) {
        isDragging = false
        lastPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
      }
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
      if (e.touches.length === 1 && isDragging) {
        const dx = e.touches[0].clientX - lastX
        const dy = e.touches[0].clientY - lastY
        lastX = e.touches[0].clientX
        lastY = e.touches[0].clientY
        state.targetPeriod = Math.max(0.05, Math.min(15, state.targetPeriod * (1 - dx * 0.003)))
        state.axisTilt = Math.max(-1.2, Math.min(1.2, state.axisTilt + dy * 0.005))
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
        const scale = lastPinchDist / Math.max(dist, 1)
        state.cameraDistance = Math.max(3, Math.min(25, state.cameraDistance * scale))
        lastPinchDist = dist
      }
    }

    function onTouchEnd(e: TouchEvent) {
      isDragging = false
      if (e.changedTouches.length === 1 && e.touches.length === 0) {
        const now = Date.now()
        if (now - lastTapTime < 350) {
          onDoubleTap()
          lastTapTime = 0
        } else {
          lastTapTime = now
        }
      }
    }

    const canvas = renderer.domElement
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointerleave', onPointerUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)
    canvas.style.touchAction = 'none'

    // ── Animation ──
    const clock = new THREE.Clock()
    let rotationAngle = 0
    const beamWorldDir = new THREE.Vector3()
    const cameraDir = new THREE.Vector3()

    function animate() {
      if (state.disposed) return
      requestAnimationFrame(animate)

      const dt = Math.min(clock.getDelta(), 0.1)
      const time = clock.getElapsedTime()

      // Smooth period transition (log space)
      const logTarget = Math.log(state.targetPeriod)
      const logCurrent = Math.log(state.period)
      state.period = Math.exp(logCurrent + (logTarget - logCurrent) * 0.08)

      // Smooth field intensity
      state.fieldIntensity += (state.targetFieldIntensity - state.fieldIntensity) * 0.05

      // Rotate
      rotationAngle += (Math.PI * 2 / state.period) * dt
      rotationGroup.rotation.y = rotationAngle
      rotationGroup.rotation.x = state.axisTilt

      // Camera
      camera.position.z += (state.cameraDistance - camera.position.z) * 0.1

      // Star shader uniforms
      starMat.uniforms.uTime.value = time
      starMat.uniforms.uMagnetar.value += ((state.presetType === 'magnetar' ? 1 : 0) - starMat.uniforms.uMagnetar.value) * 0.05

      // Field line opacity
      for (const line of fieldLines) {
        const mat = line.material as THREE.LineBasicMaterial
        mat.opacity += (state.fieldIntensity * 0.3 - mat.opacity) * 0.05
      }

      // Particle opacity
      const pMat = particleSprite.material as THREE.PointsMaterial
      pMat.opacity += (state.fieldIntensity * 0.6 - pMat.opacity) * 0.05

      // Update particles
      const pos = particleGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < particleCount; i++) {
        let t = particleData[i * 4 + 3]
        t += particleSpeed[i] * dt
        if (t > 1) t -= 1
        particleData[i * 4 + 3] = t

        const theta = t * Math.PI
        const sinT = Math.sin(theta)
        const r = particleR0[i] * sinT * sinT
        const phi = particlePhi[i]
        pos.setXYZ(i,
          r * sinT * Math.cos(phi),
          r * Math.cos(theta),
          r * sinT * Math.sin(phi),
        )
      }
      pos.needsUpdate = true

      // ── Beam crossing detection ──
      // Get beam1 world direction (+y in magnetic frame)
      beamWorldDir.set(0, 1, 0)
      magneticPivot.localToWorld(beamWorldDir.clone()) // not quite right
      // Proper way: get world direction of magnetic +y axis
      const beamTip = new THREE.Vector3(0, 5, 0)
      magneticPivot.updateWorldMatrix(true, false)
      beamTip.applyMatrix4(magneticPivot.matrixWorld)
      const starWorldPos = new THREE.Vector3()
      star.getWorldPosition(starWorldPos)
      beamWorldDir.copy(beamTip).sub(starWorldPos).normalize()

      cameraDir.copy(camera.position).sub(starWorldPos).normalize()

      const angle1 = beamWorldDir.angleTo(cameraDir)
      const angle2 = beamWorldDir.negate().angleTo(cameraDir) // opposite beam
      const minAngle = Math.min(angle1, angle2)
      const crossing = minAngle < state.beamHalfAngle

      // Flash
      if (crossing) {
        const intensity = 1 - minAngle / state.beamHalfAngle
        state.flashOpacity = Math.max(state.flashOpacity, intensity * 0.5)
      }
      state.flashOpacity *= 0.85
      if (flashRef.current) {
        flashRef.current.style.opacity = String(state.flashOpacity)
      }

      // Audio trigger
      if (crossing && !state.lastBeamCross && !state.isMuted && state.audioCtx) {
        if (state.presetType !== 'millisecond') {
          playPulse(state.audioCtx, state.audioFreq, state.audioDuration, state.presetType === 'magnetar')
        }
      }
      state.lastBeamCross = crossing

      // Millisecond continuous tone volume based on alignment possibility
      if (state.continuousGain && state.audioCtx) {
        const canCross = Math.abs(state.axisTilt) < state.magneticInclination + state.beamHalfAngle
        const targetVol = canCross && !state.isMuted ? 0.06 : 0.001
        state.continuousGain.gain.setTargetAtTime(targetVol, state.audioCtx.currentTime, 0.1)
      }

      renderer.render(scene, camera)
    }

    animate()

    // ── Cleanup ──
    return () => {
      state.disposed = true
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointerleave', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      stopContinuousTone(state)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMuteToggle = useCallback(() => {
    setMuted(m => !m)
    ensureAudioCtx(stateRef.current)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden select-none"
      style={{ height: '72vh', minHeight: '480px', maxHeight: '800px', background: '#000' }}
    >
      {/* Flash overlay */}
      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(120,170,255,0.5), rgba(60,100,200,0.2) 40%, transparent 70%)',
          opacity: 0,
        }}
      />

      {/* Instructions */}
      {showInstructions && (
        <div className="absolute inset-0 flex items-end justify-center pb-20 pointer-events-none animate-fadeInstructions">
          <div className="text-center">
            <p className="font-nhg text-xs text-white/50">Drag left/right to change spin speed</p>
            <p className="font-nhg text-xs text-white/30 mt-1">Drag up/down to tilt the axis</p>
            <p className="font-nhg text-xs text-white/30 mt-1">Double-tap to change pulsar type</p>
          </div>
        </div>
      )}

      {/* Preset label */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <p className="font-label text-[9px] text-white/25">{PRESETS[presetIdx].label}</p>
        <p className="font-nhg text-[10px] text-white/15 mt-0.5">{PRESETS[presetIdx].name}</p>
      </div>

      {/* Mute button */}
      <button
        onClick={handleMuteToggle}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors z-10"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Desktop instruction */}
      <div className="hidden lg:block absolute bottom-3 right-3 pointer-events-none">
        <p className="font-nhg text-[10px] text-white/20">Click and drag to explore. Scroll to zoom.</p>
      </div>
    </div>
  )
}

// ─── Audio helpers ──────────────────────────────────────────────────────────

function ensureAudioCtx(state: { audioCtx: AudioContext | null }) {
  if (!state.audioCtx) {
    state.audioCtx = new AudioContext()
  }
  if (state.audioCtx.state === 'suspended') {
    state.audioCtx.resume()
  }
}

function playPulse(ctx: AudioContext, freq: number, duration: number, deep: boolean) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.frequency.value = freq
  osc.type = deep ? 'triangle' : 'sine'

  const now = ctx.currentTime
  gain.gain.setValueAtTime(0.001, now)
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.004)
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

  osc.start(now)
  osc.stop(now + duration + 0.01)
}

function startContinuousTone(state: {
  audioCtx: AudioContext | null
  continuousOsc: OscillatorNode | null
  continuousGain: GainNode | null
}) {
  if (state.continuousOsc || !state.audioCtx) return
  const ctx = state.audioCtx
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = 716
  osc.type = 'sine'
  gain.gain.value = 0.06
  osc.start()
  state.continuousOsc = osc
  state.continuousGain = gain
}

function stopContinuousTone(state: {
  continuousOsc: OscillatorNode | null
  continuousGain: GainNode | null
}) {
  if (state.continuousOsc) {
    try { state.continuousOsc.stop() } catch {}
    state.continuousOsc = null
  }
  state.continuousGain = null
}
