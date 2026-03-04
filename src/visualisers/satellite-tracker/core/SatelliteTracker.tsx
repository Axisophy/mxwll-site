'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import {
  SatelliteRecord,
  SatPosition,
  SatCategory,
  CATEGORY_COLOURS,
  CATEGORY_LABELS,
  CONSTELLATIONS,
  EARTH_RADIUS_KM,
  fetchSatelliteData,
  propagatePosition,
  computeOrbitTrack,
  getSunDirection,
} from './satellite-data'

// ─── Constants ──────────────────────────────────────────────────────────────

const MAX_SATELLITES = 15000
const BG_COLOR = 0x03060f

const TIME_SPEEDS = [1, 10, 100, 1000]

const DENSITY_SHELLS = [
  { label: 'LEO', minAlt: 200, maxAlt: 2000, colour: new THREE.Color(0.2, 0.5, 1.0), opacity: 0.12 },
  { label: 'MEO', minAlt: 2000, maxAlt: 35000, colour: new THREE.Color(0.3, 0.8, 0.4), opacity: 0.06 },
  { label: 'GEO', minAlt: 35500, maxAlt: 36100, colour: new THREE.Color(1.0, 0.8, 0.2), opacity: 0.15 },
]

// ─── Atmosphere Shader ──────────────────────────────────────────────────────

const ATMO_VS = `
varying vec3 vNormal;
varying vec3 vWorldPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const ATMO_FS = `
varying vec3 vNormal;
varying vec3 vWorldPosition;
uniform vec3 uSunDir;
void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
  float daylight = max(dot(vNormal, uSunDir), 0.0) * 0.3 + 0.7;
  vec3 atmoColour = mix(vec3(0.1, 0.3, 0.8), vec3(0.3, 0.5, 1.0), fresnel);
  float alpha = fresnel * 0.6 * daylight;
  gl_FragColor = vec4(atmoColour, alpha);
}
`

// ─── Earth Shader (day/night blend) ─────────────────────────────────────────

const EARTH_VS = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldNormal;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const EARTH_FS = `
uniform sampler2D uDayTex;
uniform sampler2D uNightTex;
uniform vec3 uSunDir;
uniform bool uHasDayTex;
uniform bool uHasNightTex;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldNormal;

void main() {
  float daylight = dot(vWorldNormal, uSunDir);
  float terminator = smoothstep(-0.15, 0.15, daylight);

  vec3 dayColour;
  if (uHasDayTex) {
    dayColour = texture2D(uDayTex, vUv).rgb;
  } else {
    // Procedural fallback
    float lat = (vUv.y - 0.5) * 3.14159;
    float lon = (vUv.x - 0.5) * 6.28318;
    dayColour = mix(vec3(0.04, 0.08, 0.2), vec3(0.06, 0.14, 0.08), 0.3);
  }

  vec3 nightColour;
  if (uHasNightTex) {
    nightColour = texture2D(uNightTex, vUv).rgb * 1.5;
  } else {
    nightColour = vec3(0.01, 0.01, 0.02);
  }

  // Darken day side slightly, brighten night lights
  dayColour *= (0.6 + 0.4 * max(daylight, 0.0));
  vec3 finalColour = mix(nightColour, dayColour, terminator);

  // Subtle limb darkening
  vec3 viewDir = normalize(cameraPosition - vWorldNormal * 1.0);
  float limb = pow(max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 0.3);
  finalColour *= (0.7 + 0.3 * limb);

  gl_FragColor = vec4(finalColour, 1.0);
}
`

// ─── Star Field ─────────────────────────────────────────────────────────────

function createStarField(): THREE.Points {
  const count = 2000
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  let s = 42
  const rng = () => { s = (s * 16807) % 2147483647; return s / 2147483647 }

  for (let i = 0; i < count; i++) {
    const theta = rng() * Math.PI * 2
    const phi = Math.acos(2 * rng() - 1)
    const r = 80 + rng() * 20
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.cos(phi)
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    sizes[i] = 0.5 + rng() * 1.5
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
  })

  return new THREE.Points(geom, mat)
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
  className?: string
}

export default function SatelliteTracker({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef(new THREE.Scene())
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rafRef = useRef(0)

  // Globe refs
  const earthRef = useRef<THREE.Mesh | null>(null)
  const atmoRef = useRef<THREE.Mesh | null>(null)

  // Satellite refs
  const satMeshRef = useRef<THREE.InstancedMesh | null>(null)
  const satDataRef = useRef<SatelliteRecord[]>([])
  const satPositionsRef = useRef<(SatPosition | null)[]>([])
  const colourArrayRef = useRef(new Float32Array(MAX_SATELLITES * 3))

  // Orbit track refs
  const orbitLineRef = useRef<THREE.Line | null>(null)

  // Density shells
  const densityShellsRef = useRef<THREE.Mesh[]>([])

  // Camera control
  const cameraState = useRef({
    azimuth: 0.5,
    elevation: 0.4,
    distance: 4.0,
    targetAzimuth: 0.5,
    targetElevation: 0.4,
    targetDistance: 4.0,
  })
  const mouseState = useRef({ down: false, lastX: 0, lastY: 0, button: 0 })
  const touchState = useRef({ active: false, lastDist: 0, lastX: 0, lastY: 0 })

  // Simulation
  const simTimeRef = useRef(Date.now())
  const lastFrameRef = useRef(0)
  const batchIndexRef = useRef(0)

  // UI state
  const [satellites, setSatellites] = useState<SatelliteRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState('Fetching satellite data...')
  const [timeSpeed, setTimeSpeed] = useState(1)
  const [selectedSat, setSelectedSat] = useState<SatelliteRecord | null>(null)
  const [selectedPos, setSelectedPos] = useState<SatPosition | null>(null)
  const [categories, setCategories] = useState<Record<SatCategory, boolean>>({
    'communications': true,
    'earth-observation': true,
    'navigation': true,
    'scientific': true,
    'military': true,
    'debris': false,
  })
  const [activeConstellation, setActiveConstellation] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'individual' | 'density'>('individual')
  const [searchQuery, setSearchQuery] = useState('')
  const [satCount, setSatCount] = useState(0)

  // Refs for current values in animation loop
  const timeSpeedRef = useRef(1)
  const categoriesRef = useRef(categories)
  const constellationRef = useRef<string | null>(null)
  const viewModeRef = useRef<'individual' | 'density'>('individual')
  const selectedRef = useRef<SatelliteRecord | null>(null)

  useEffect(() => { timeSpeedRef.current = timeSpeed }, [timeSpeed])
  useEffect(() => { categoriesRef.current = categories }, [categories])
  useEffect(() => { constellationRef.current = activeConstellation }, [activeConstellation])
  useEffect(() => { viewModeRef.current = viewMode }, [viewMode])
  useEffect(() => { selectedRef.current = selectedSat }, [selectedSat])

  // ─── Initialise Three.js ───────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const scene = sceneRef.current
    scene.background = new THREE.Color(BG_COLOR)

    // Renderer
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    })
    renderer.setPixelRatio(dpr)
    rendererRef.current = renderer

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200)
    cameraRef.current = camera

    // Star field
    scene.add(createStarField())

    // ─── Earth Globe ──────────────────────────────────────────────────
    const earthGeom = new THREE.SphereGeometry(1, 64, 64)
    const textureLoader = new THREE.TextureLoader()

    const earthMat = new THREE.ShaderMaterial({
      vertexShader: EARTH_VS,
      fragmentShader: EARTH_FS,
      uniforms: {
        uDayTex: { value: null },
        uNightTex: { value: null },
        uSunDir: { value: new THREE.Vector3(1, 0, 0) },
        uHasDayTex: { value: false },
        uHasNightTex: { value: false },
      },
    })

    const earth = new THREE.Mesh(earthGeom, earthMat)
    scene.add(earth)
    earthRef.current = earth

    // Load textures
    textureLoader.load('/data/satellite-tracker/earth-day.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      earthMat.uniforms.uDayTex.value = tex
      earthMat.uniforms.uHasDayTex.value = true
    })
    textureLoader.load('/data/satellite-tracker/earth-night.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      earthMat.uniforms.uNightTex.value = tex
      earthMat.uniforms.uHasNightTex.value = true
    })

    // ─── Atmosphere ───────────────────────────────────────────────────
    const atmoGeom = new THREE.SphereGeometry(1.025, 64, 64)
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: ATMO_VS,
      fragmentShader: ATMO_FS,
      uniforms: {
        uSunDir: { value: new THREE.Vector3(1, 0, 0) },
      },
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    })
    const atmo = new THREE.Mesh(atmoGeom, atmoMat)
    scene.add(atmo)
    atmoRef.current = atmo

    // ─── Satellite Instanced Mesh ─────────────────────────────────────
    const satGeom = new THREE.SphereGeometry(0.008, 6, 4)
    const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const satMesh = new THREE.InstancedMesh(satGeom, satMat, MAX_SATELLITES)
    satMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    // Instance colours
    const colourAttr = new THREE.InstancedBufferAttribute(
      colourArrayRef.current, 3
    )
    colourAttr.setUsage(THREE.DynamicDrawUsage)
    satMesh.instanceColor = colourAttr
    satMesh.count = 0
    scene.add(satMesh)
    satMeshRef.current = satMesh

    // ─── Orbit Track Line ─────────────────────────────────────────────
    const orbitGeom = new THREE.BufferGeometry()
    const orbitMat = new THREE.LineBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.6,
    })
    const orbitLine = new THREE.Line(orbitGeom, orbitMat)
    orbitLine.visible = false
    scene.add(orbitLine)
    orbitLineRef.current = orbitLine

    // ─── Density Shells ───────────────────────────────────────────────
    for (const shell of DENSITY_SHELLS) {
      const innerR = (EARTH_RADIUS_KM + shell.minAlt) / EARTH_RADIUS_KM
      const outerR = (EARTH_RADIUS_KM + shell.maxAlt) / EARTH_RADIUS_KM
      const midR = (innerR + outerR) / 2
      const shellGeom = new THREE.SphereGeometry(midR, 48, 48)
      const shellMat = new THREE.MeshBasicMaterial({
        color: shell.colour,
        transparent: true,
        opacity: shell.opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      const shellMesh = new THREE.Mesh(shellGeom, shellMat)
      shellMesh.visible = false
      scene.add(shellMesh)
      densityShellsRef.current.push(shellMesh)
    }

    // ─── Resize ───────────────────────────────────────────────────────
    function handleResize() {
      if (!container) return
      const rect = container.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      renderer.setSize(rect.width, rect.height)
      camera.aspect = rect.width / rect.height
      camera.updateProjectionMatrix()
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(container)
    handleResize()

    // ─── Mouse Controls ───────────────────────────────────────────────
    function onMouseDown(e: MouseEvent) {
      mouseState.current = { down: true, lastX: e.clientX, lastY: e.clientY, button: e.button }
    }
    function onMouseMove(e: MouseEvent) {
      if (!mouseState.current.down) return
      const dx = e.clientX - mouseState.current.lastX
      const dy = e.clientY - mouseState.current.lastY
      mouseState.current.lastX = e.clientX
      mouseState.current.lastY = e.clientY

      cameraState.current.targetAzimuth -= dx * 0.005
      cameraState.current.targetElevation = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, cameraState.current.targetElevation + dy * 0.005)
      )
    }
    function onMouseUp() {
      mouseState.current.down = false
    }
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      cameraState.current.targetDistance = Math.max(
        1.5, Math.min(20, cameraState.current.targetDistance + e.deltaY * 0.003)
      )
    }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    // ─── Touch Controls ───────────────────────────────────────────────
    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 1) {
        touchState.current = { active: true, lastDist: 0, lastX: e.touches[0].clientX, lastY: e.touches[0].clientY }
      } else if (e.touches.length === 2) {
        e.preventDefault()
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        touchState.current.lastDist = Math.sqrt(dx * dx + dy * dy)
        touchState.current.lastX = (e.touches[0].clientX + e.touches[1].clientX) / 2
        touchState.current.lastY = (e.touches[0].clientY + e.touches[1].clientY) / 2
      }
    }
    function onTouchMove(e: TouchEvent) {
      if (e.touches.length === 1 && touchState.current.active) {
        const dx = e.touches[0].clientX - touchState.current.lastX
        const dy = e.touches[0].clientY - touchState.current.lastY
        touchState.current.lastX = e.touches[0].clientX
        touchState.current.lastY = e.touches[0].clientY
        cameraState.current.targetAzimuth -= dx * 0.005
        cameraState.current.targetElevation = Math.max(
          -Math.PI / 2 + 0.1,
          Math.min(Math.PI / 2 - 0.1, cameraState.current.targetElevation + dy * 0.005)
        )
      } else if (e.touches.length === 2) {
        e.preventDefault()
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (touchState.current.lastDist > 0) {
          const scale = touchState.current.lastDist / dist
          cameraState.current.targetDistance = Math.max(
            1.5, Math.min(20, cameraState.current.targetDistance * scale)
          )
        }
        touchState.current.lastDist = dist
      }
    }
    function onTouchEnd() {
      touchState.current.active = false
      touchState.current.lastDist = 0
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)

    // ─── Click / Tap to Select ────────────────────────────────────────
    const raycaster = new THREE.Raycaster()
    raycaster.params.Points = { threshold: 0.1 }

    function onClick(e: MouseEvent) {
      if (!container || !satMeshRef.current) return
      const rect = container.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      )
      raycaster.setFromCamera(mouse, camera)

      // Check intersection with satellite instances
      const intersects = raycaster.intersectObject(satMeshRef.current)
      if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
        const idx = intersects[0].instanceId
        const sats = satDataRef.current
        if (idx < sats.length) {
          const sat = sats[idx]
          const pos = satPositionsRef.current[idx]
          setSelectedSat(sat)
          setSelectedPos(pos)

          // Draw orbit track
          if (orbitLineRef.current) {
            const date = new Date(simTimeRef.current)
            const track = computeOrbitTrack(sat, date)
            if (track.length > 2) {
              const pts = track.map(p => new THREE.Vector3(p.x, p.y, p.z))
              orbitLineRef.current.geometry.dispose()
              orbitLineRef.current.geometry = new THREE.BufferGeometry().setFromPoints(pts)
              orbitLineRef.current.visible = true
            }
          }
          return
        }
      }

      // Clicked nothing - deselect
      setSelectedSat(null)
      setSelectedPos(null)
      if (orbitLineRef.current) orbitLineRef.current.visible = false
    }
    canvas.addEventListener('click', onClick)

    // ─── Animation Loop ───────────────────────────────────────────────
    const dummy = new THREE.Object3D()

    function animate(timestamp: number) {
      const dt = Math.min((timestamp - lastFrameRef.current) / 1000, 0.1)
      lastFrameRef.current = timestamp

      // Advance simulation time
      simTimeRef.current += dt * 1000 * timeSpeedRef.current

      // Smooth camera
      const cs = cameraState.current
      cs.azimuth += (cs.targetAzimuth - cs.azimuth) * 0.1
      cs.elevation += (cs.targetElevation - cs.elevation) * 0.1
      cs.distance += (cs.targetDistance - cs.distance) * 0.1

      camera.position.set(
        cs.distance * Math.cos(cs.elevation) * Math.sin(cs.azimuth),
        cs.distance * Math.sin(cs.elevation),
        cs.distance * Math.cos(cs.elevation) * Math.cos(cs.azimuth),
      )
      camera.lookAt(0, 0, 0)

      // Sun direction
      const simDate = new Date(simTimeRef.current)
      const sunDir = getSunDirection(simDate)
      if (earthRef.current) {
        const mat = earthRef.current.material as THREE.ShaderMaterial
        mat.uniforms.uSunDir.value.set(sunDir[0], sunDir[1], sunDir[2])
      }
      if (atmoRef.current) {
        const mat = atmoRef.current.material as THREE.ShaderMaterial
        mat.uniforms.uSunDir.value.set(sunDir[0], sunDir[1], sunDir[2])
      }

      // Slow rotation for Earth
      if (earthRef.current) {
        earthRef.current.rotation.y = (simTimeRef.current / 86400000) * Math.PI * 2
      }

      // ─── Update Satellite Positions (batched) ──────────────────────
      const sats = satDataRef.current
      const mesh = satMeshRef.current
      if (mesh && sats.length > 0) {
        const batchSize = Math.ceil(sats.length / 4) // Update 1/4 per frame
        const start = batchIndexRef.current * batchSize
        const end = Math.min(start + batchSize, sats.length)
        const date = simDate

        for (let i = start; i < end; i++) {
          const pos = propagatePosition(sats[i], date)
          satPositionsRef.current[i] = pos
        }
        batchIndexRef.current = (batchIndexRef.current + 1) % 4

        // Update instance transforms and colours
        const cats = categoriesRef.current
        const cst = constellationRef.current
        const vm = viewModeRef.current
        let visibleCount = 0
        const colours = colourArrayRef.current

        for (let i = 0; i < sats.length; i++) {
          const pos = satPositionsRef.current[i]
          if (!pos) continue

          const sat = sats[i]

          // Filter by category
          if (!cats[sat.category]) continue

          // Constellation filter - dim non-matching
          let alpha = 1.0
          if (cst) {
            alpha = sat.constellation === cst ? 1.0 : 0.05
          }

          // Density mode hides individual satellites
          if (vm === 'density') continue

          dummy.position.set(pos.x, pos.y, pos.z)
          // Slightly larger for LEO (they move faster, need to be visible)
          const s = sat.altitude < 2000 ? 1.0 : (sat.altitude < 20000 ? 0.7 : 0.5)
          dummy.scale.setScalar(s)
          dummy.updateMatrix()
          mesh.setMatrixAt(visibleCount, dummy.matrix)

          const col = CATEGORY_COLOURS[sat.category]
          colours[visibleCount * 3] = col[0] * alpha
          colours[visibleCount * 3 + 1] = col[1] * alpha
          colours[visibleCount * 3 + 2] = col[2] * alpha

          visibleCount++
        }

        mesh.count = visibleCount
        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) {
          (mesh.instanceColor as THREE.InstancedBufferAttribute).needsUpdate = true
        }

        // Update density shells visibility
        for (const shell of densityShellsRef.current) {
          shell.visible = vm === 'density'
        }
      }

      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    // ─── Cleanup ──────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('click', onClick)
      renderer.dispose()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Fetch Data ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setLoadingMsg('Fetching satellite data...')
      const data = await fetchSatelliteData()

      if (cancelled) return

      // On mobile, limit count
      const isMobile = window.innerWidth < 768
      const maxCount = isMobile ? 3000 : MAX_SATELLITES
      const trimmed = data.slice(0, maxCount)

      satDataRef.current = trimmed
      satPositionsRef.current = new Array(trimmed.length).fill(null)
      colourArrayRef.current = new Float32Array(Math.max(trimmed.length, MAX_SATELLITES) * 3)
      if (satMeshRef.current) {
        satMeshRef.current.instanceColor = new THREE.InstancedBufferAttribute(
          colourArrayRef.current, 3
        )
      }

      setSatellites(trimmed)
      setSatCount(trimmed.length)
      setLoadingMsg(`Propagating ${trimmed.length.toLocaleString()} satellites...`)

      // Initial propagation for all satellites
      const date = new Date(simTimeRef.current)
      for (let i = 0; i < trimmed.length; i++) {
        satPositionsRef.current[i] = propagatePosition(trimmed[i], date)
      }

      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  // ─── Constellation Toggle ───────────────────────────────────────────────
  const toggleConstellation = useCallback((id: string) => {
    setActiveConstellation(prev => prev === id ? null : id)
  }, [])

  // ─── Category Toggle ───────────────────────────────────────────────────
  const toggleCategory = useCallback((cat: SatCategory) => {
    setCategories(prev => ({ ...prev, [cat]: !prev[cat] }))
  }, [])

  // ─── Search ─────────────────────────────────────────────────────────────
  const searchResults = searchQuery.length > 1
    ? satellites.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8)
    : []

  const selectSearchResult = useCallback((sat: SatelliteRecord) => {
    setSelectedSat(sat)
    const date = new Date(simTimeRef.current)
    const pos = propagatePosition(sat, date)
    setSelectedPos(pos)
    setSearchQuery('')

    // Draw orbit track
    if (orbitLineRef.current && pos) {
      const track = computeOrbitTrack(sat, date)
      if (track.length > 2) {
        const pts = track.map(p => new THREE.Vector3(p.x, p.y, p.z))
        orbitLineRef.current.geometry.dispose()
        orbitLineRef.current.geometry = new THREE.BufferGeometry().setFromPoints(pts)
        orbitLineRef.current.visible = true
      }
    }
  }, [])

  return (
    <div className={className}>
      {/* Visualiser Container */}
      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden"
        style={{ aspectRatio: '4/3', background: '#03060f' }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#03060f]/80 z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-3" />
              <p className="font-label text-xs text-white/60">{loadingMsg}</p>
            </div>
          </div>
        )}

        {/* Satellite Count */}
        <div className="absolute top-3 left-3 pointer-events-none z-20">
          <p className="font-label text-[10px] text-white/70">
            {satCount.toLocaleString()} SATELLITES TRACKED
          </p>
        </div>

        {/* Selected Satellite Panel */}
        {selectedSat && selectedPos && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm p-3 max-w-[240px] pointer-events-auto z-20">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-nhg text-xs font-medium text-white leading-tight">
                {selectedSat.name}
              </h3>
              <button
                onClick={() => {
                  setSelectedSat(null)
                  setSelectedPos(null)
                  if (orbitLineRef.current) orbitLineRef.current.visible = false
                }}
                className="text-white/60 hover:text-white/80 text-xs ml-2"
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              <span className="font-label text-[9px] text-white/60">NORAD ID</span>
              <span className="font-label text-[9px] text-white/70">{selectedSat.noradId}</span>
              <span className="font-label text-[9px] text-white/60">ALTITUDE</span>
              <span className="font-label text-[9px] text-white/70">{Math.round(selectedPos.alt)} km</span>
              <span className="font-label text-[9px] text-white/60">SPEED</span>
              <span className="font-label text-[9px] text-white/70">
                {(Math.sqrt(398600.4418 / (EARTH_RADIUS_KM + selectedPos.alt)) ).toFixed(2)} km/s
              </span>
              <span className="font-label text-[9px] text-white/60">PERIOD</span>
              <span className="font-label text-[9px] text-white/70">{selectedSat.period.toFixed(1)} min</span>
              <span className="font-label text-[9px] text-white/60">INCLINATION</span>
              <span className="font-label text-[9px] text-white/70">{selectedSat.inclination.toFixed(1)}°</span>
              <span className="font-label text-[9px] text-white/60">CATEGORY</span>
              <span className="font-label text-[9px] text-white/70">{CATEGORY_LABELS[selectedSat.category]}</span>
              <span className="font-label text-[9px] text-white/60">LAT</span>
              <span className="font-label text-[9px] text-white/70">{selectedPos.lat.toFixed(2)}°</span>
              <span className="font-label text-[9px] text-white/60">LON</span>
              <span className="font-label text-[9px] text-white/70">{selectedPos.lon.toFixed(2)}°</span>
            </div>
          </div>
        )}

      </div>

      {/* Controls Below Visualiser */}
      <div className="mt-4 space-y-3">
        {/* Time Speed + View Mode */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-label text-xs text-[var(--text-tertiary)]">Speed</span>
            <div className="flex gap-1">
              {TIME_SPEEDS.map(speed => (
                <button
                  key={speed}
                  onClick={() => setTimeSpeed(speed)}
                  className={`font-label text-xs px-3 py-1.5 transition-colors ${
                    timeSpeed === speed
                      ? 'bg-[var(--text-primary)] text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label text-xs text-[var(--text-tertiary)]">View</span>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('individual')}
                className={`font-label text-xs px-3 py-1.5 transition-colors ${
                  viewMode === 'individual'
                    ? 'bg-[var(--text-primary)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setViewMode('density')}
                className={`font-label text-xs px-3 py-1.5 transition-colors ${
                  viewMode === 'density'
                    ? 'bg-[var(--text-primary)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                Density
              </button>
            </div>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search satellites..."
            className="w-full font-nhg text-sm bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--bg-tertiary)] z-30 max-h-48 overflow-y-auto">
              {searchResults.map(sat => (
                <button
                  key={sat.noradId}
                  onClick={() => selectSearchResult(sat)}
                  className="w-full text-left px-3 py-2 font-nhg text-sm hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <span className="text-[var(--text-primary)]">{sat.name}</span>
                  <span className="text-[var(--text-tertiary)] ml-2 text-xs">{CATEGORY_LABELS[sat.category]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_COLOURS) as SatCategory[]).map(cat => {
            const col = CATEGORY_COLOURS[cat]
            const colStr = `rgb(${Math.round(col[0]*255)},${Math.round(col[1]*255)},${Math.round(col[2]*255)})`
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`font-label text-xs px-3 py-1.5 transition-colors flex items-center gap-1.5 ${
                  categories[cat]
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] opacity-40'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: colStr }}
                />
                {CATEGORY_LABELS[cat]}
              </button>
            )
          })}
        </div>

        {/* Constellation Highlights */}
        <div className="flex flex-wrap gap-2">
          {CONSTELLATIONS.map(c => (
            <button
              key={c.id}
              onClick={() => toggleConstellation(c.id)}
              className={`font-label text-xs px-3 py-1.5 transition-colors ${
                activeConstellation === c.id
                  ? 'bg-[var(--text-primary)] text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {c.label}
            </button>
          ))}
          {activeConstellation && (
            <button
              onClick={() => setActiveConstellation(null)}
              className="font-label text-xs px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
