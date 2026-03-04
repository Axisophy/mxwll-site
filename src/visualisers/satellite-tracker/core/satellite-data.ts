// Satellite Tracker - Data Layer
// TLE fetching, parsing, categorisation, and orbital propagation

import {
  twoline2satrec,
  propagate,
  gstime,
  eciToGeodetic,
  degreesLong,
  degreesLat,
} from 'satellite.js'

// ─── Types ──────────────────────────────────────────────────────────────────

export type SatCategory =
  | 'communications'
  | 'earth-observation'
  | 'navigation'
  | 'scientific'
  | 'military'
  | 'debris'

export interface SatelliteRecord {
  name: string
  noradId: number
  category: SatCategory
  constellation: string | null
  satrec: ReturnType<typeof twoline2satrec>
  inclination: number   // degrees
  period: number        // minutes
  altitude: number      // km (approximate from mean motion)
}

export interface SatPosition {
  lat: number   // degrees
  lon: number   // degrees
  alt: number   // km
  x: number     // scene units
  y: number     // scene units
  z: number     // scene units
}

// ─── Constants ──────────────────────────────────────────────────────────────

export const EARTH_RADIUS_KM = 6371
const MU = 398600.4418 // km^3/s^2

export const CATEGORY_COLOURS: Record<SatCategory, [number, number, number]> = {
  'communications':    [0.2, 0.5, 1.0],  // Blue
  'earth-observation': [0.2, 0.8, 0.3],  // Green
  'navigation':        [1.0, 0.85, 0.2], // Gold
  'scientific':        [0.6, 0.3, 0.9],  // Purple
  'military':          [0.5, 0.5, 0.5],  // Grey
  'debris':            [0.8, 0.2, 0.2],  // Red
}

export const CATEGORY_LABELS: Record<SatCategory, string> = {
  'communications':    'Communications',
  'earth-observation': 'Earth Observation',
  'navigation':        'Navigation',
  'scientific':        'Scientific',
  'military':          'Military / Other',
  'debris':            'Debris',
}

export const CONSTELLATIONS = [
  { id: 'starlink', label: 'Starlink', match: /STARLINK/i },
  { id: 'oneweb', label: 'OneWeb', match: /ONEWEB/i },
  { id: 'gps', label: 'GPS', match: /GPS|NAVSTAR/i },
  { id: 'galileo', label: 'Galileo', match: /GALILEO/i },
  { id: 'glonass', label: 'GLONASS', match: /GLONASS|COSMOS 2/i },
  { id: 'iridium', label: 'Iridium', match: /IRIDIUM/i },
  { id: 'globalstar', label: 'Globalstar', match: /GLOBALSTAR/i },
]

// ─── TLE Parsing ────────────────────────────────────────────────────────────

/** Parse 3-line TLE format (name, line1, line2) */
export function parseTLEText(text: string): SatelliteRecord[] {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0)
  const records: SatelliteRecord[] = []

  for (let i = 0; i < lines.length - 2; i += 3) {
    const name = lines[i]
    const line1 = lines[i + 1]
    const line2 = lines[i + 2]

    // Validate TLE lines
    if (!line1.startsWith('1 ') || !line2.startsWith('2 ')) {
      // Try to recover - might be missing name line
      if (lines[i].startsWith('1 ') && lines[i + 1].startsWith('2 ')) {
        i -= 1 // Step back, treat as 2-line format
        continue
      }
      continue
    }

    try {
      const satrec = twoline2satrec(line1, line2)
      const noradId = parseInt(line1.substring(2, 7).trim(), 10)
      const inclination = parseFloat(line2.substring(8, 16).trim())
      const meanMotion = parseFloat(line2.substring(52, 63).trim())

      // Calculate approximate altitude from mean motion
      const period = (24 * 60) / meanMotion // minutes
      const sma = Math.pow(MU * (period * 60 / (2 * Math.PI)) ** 2, 1 / 3)
      const altitude = sma - EARTH_RADIUS_KM

      const { category, constellation } = categoriseSatellite(name)

      records.push({
        name: name.trim(),
        noradId,
        category,
        constellation,
        satrec,
        inclination,
        period,
        altitude,
      })
    } catch {
      // Skip invalid records
    }
  }

  return records
}

// ─── Categorisation ─────────────────────────────────────────────────────────

function categoriseSatellite(name: string): { category: SatCategory; constellation: string | null } {
  const upper = name.toUpperCase()
  let constellation: string | null = null

  for (const c of CONSTELLATIONS) {
    if (c.match.test(name)) {
      constellation = c.id
      break
    }
  }

  // Debris
  if (upper.includes('DEB') || upper.includes('R/B') || upper.includes('DEBRIS')) {
    return { category: 'debris', constellation }
  }

  // Navigation
  if (upper.includes('GPS') || upper.includes('NAVSTAR') || upper.includes('GALILEO') ||
      upper.includes('GLONASS') || upper.includes('BEIDOU') || upper.includes('COMPASS') ||
      upper.includes('QZSS') || upper.includes('IRNSS')) {
    return { category: 'navigation', constellation }
  }

  // Communications
  if (upper.includes('STARLINK') || upper.includes('ONEWEB') || upper.includes('IRIDIUM') ||
      upper.includes('GLOBALSTAR') || upper.includes('SES') || upper.includes('INTELSAT') ||
      upper.includes('TELESAT') || upper.includes('ORBCOMM') || upper.includes('O3B') ||
      upper.includes('VIASAT') || upper.includes('INMARSAT') || upper.includes('DIRECTV') ||
      upper.includes('SIRIUS') || upper.includes('XM ') || upper.includes('TDRS') ||
      upper.includes('KUIPER')) {
    return { category: 'communications', constellation }
  }

  // Earth observation
  if (upper.includes('LANDSAT') || upper.includes('SENTINEL') || upper.includes('GOES') ||
      upper.includes('NOAA') || upper.includes('METEOSAT') || upper.includes('SUOMI') ||
      upper.includes('TERRA') || upper.includes('AQUA') || upper.includes('WORLDVIEW') ||
      upper.includes('PLANET') || upper.includes('DOVE') || upper.includes('FLOCK') ||
      upper.includes('ICESAT') || upper.includes('JPSS') || upper.includes('HIMAWARI')) {
    return { category: 'earth-observation', constellation }
  }

  // Scientific
  if (upper.includes('HUBBLE') || upper.includes('HST') || upper.includes('CHANDRA') ||
      upper.includes('FERMI') || upper.includes('SWIFT') || upper.includes('NUSTAR') ||
      upper.includes('ISS') || upper.includes('TIANGONG') || upper.includes('ZARYA') ||
      upper.includes('CREW DRAGON') || upper.includes('SOYUZ')) {
    return { category: 'scientific', constellation }
  }

  // Military / other (including COSMOS, USA without other identifiers)
  if (upper.includes('COSMOS') || upper.includes('USA ') || upper.includes('NROL') ||
      upper.includes('YAOGAN')) {
    return { category: 'military', constellation }
  }

  return { category: 'communications', constellation } // Default
}

// ─── Propagation ────────────────────────────────────────────────────────────

/** Propagate a satellite to a given date, returns geodetic position */
export function propagatePosition(sat: SatelliteRecord, date: Date): SatPosition | null {
  try {
    const posVel = propagate(sat.satrec, date)
    if (!posVel || !posVel.position || typeof posVel.position === 'boolean') return null

    const gmst = gstime(date)
    const geo = eciToGeodetic(posVel.position as { x: number; y: number; z: number }, gmst)

    const lat = degreesLat(geo.latitude)
    const lon = degreesLong(geo.longitude)
    const alt = geo.height // km

    // Convert to 3D scene coordinates (Earth radius = 1.0)
    const scale = (EARTH_RADIUS_KM + alt) / EARTH_RADIUS_KM
    const latRad = geo.latitude
    const lonRad = geo.longitude

    return {
      lat, lon, alt,
      x: scale * Math.cos(latRad) * Math.cos(lonRad),
      y: scale * Math.sin(latRad),
      z: -scale * Math.cos(latRad) * Math.sin(lonRad),
    }
  } catch {
    return null
  }
}

/** Propagate positions for an orbital track (one full period) */
export function computeOrbitTrack(
  sat: SatelliteRecord,
  date: Date,
  segments: number = 120,
): SatPosition[] {
  const positions: SatPosition[] = []
  const periodMs = sat.period * 60 * 1000

  for (let i = 0; i <= segments; i++) {
    const t = new Date(date.getTime() - periodMs / 2 + (i / segments) * periodMs)
    const pos = propagatePosition(sat, t)
    if (pos) positions.push(pos)
  }

  return positions
}

/** Compute ground track (lat/lon for one orbit) */
export function computeGroundTrack(
  sat: SatelliteRecord,
  date: Date,
  segments: number = 120,
): { lat: number; lon: number }[] {
  const track: { lat: number; lon: number }[] = []
  const periodMs = sat.period * 60 * 1000

  for (let i = 0; i <= segments; i++) {
    const t = new Date(date.getTime() - periodMs / 2 + (i / segments) * periodMs)
    const pos = propagatePosition(sat, t)
    if (pos) track.push({ lat: pos.lat, lon: pos.lon })
  }

  return track
}

// ─── Data Fetching ──────────────────────────────────────────────────────────

const CELESTRAK_ACTIVE = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=3le'

export async function fetchSatelliteData(): Promise<SatelliteRecord[]> {
  try {
    const resp = await fetch(CELESTRAK_ACTIVE)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const text = await resp.text()
    return parseTLEText(text)
  } catch (err) {
    console.warn('Failed to fetch live satellite data, using sample dataset:', err)
    return generateSampleSatellites()
  }
}

// ─── Sample Fallback Data ───────────────────────────────────────────────────

function seeded(seed: number) {
  let s = Math.abs(seed) + 1
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647 }
}

/** Generate procedural sample satellites when CelesTrak is unavailable */
function generateSampleSatellites(): SatelliteRecord[] {
  const rng = seeded(42)
  const sats: SatelliteRecord[] = []
  const epoch = new Date()

  // Helper: create a synthetic TLE from orbital elements
  function makeTLE(
    noradId: number,
    inc: number,
    raan: number,
    ecc: number,
    argp: number,
    ma: number,
    meanMotion: number,
  ): { line1: string; line2: string } {
    const epochYr = epoch.getUTCFullYear() % 100
    const doy = Math.floor((epoch.getTime() - new Date(epoch.getUTCFullYear(), 0, 1).getTime()) / 86400000) + 1
    const epochDay = doy + (epoch.getUTCHours() * 3600 + epoch.getUTCMinutes() * 60 + epoch.getUTCSeconds()) / 86400

    const id = String(noradId).padStart(5)
    const line1 = `1 ${id}U 24001A   ${String(epochYr).padStart(2, '0')}${epochDay.toFixed(8).padStart(12)} .00000000  00000-0  00000-0 0  9990`
    const line2 = `2 ${id} ${inc.toFixed(4).padStart(8)} ${raan.toFixed(4).padStart(8)} ${ecc.toFixed(7).substring(2).padStart(7, '0')} ${argp.toFixed(4).padStart(8)} ${ma.toFixed(4).padStart(8)} ${meanMotion.toFixed(8).padStart(11)}00001`

    return { line1, line2 }
  }

  function addSat(
    name: string,
    noradId: number,
    category: SatCategory,
    constellation: string | null,
    inc: number,
    altKm: number,
    raan: number,
    ma: number,
    ecc: number = 0.0001,
  ) {
    const sma = EARTH_RADIUS_KM + altKm
    const period = (2 * Math.PI * Math.sqrt(sma ** 3 / MU)) / 60 // minutes
    const meanMotion = (24 * 60) / period

    const tle = makeTLE(noradId, inc, raan, ecc, rng() * 360, ma, meanMotion)
    try {
      const satrec = twoline2satrec(tle.line1, tle.line2)
      sats.push({ name, noradId, category, constellation, satrec, inclination: inc, period, altitude: altKm })
    } catch {
      // Skip if TLE generation produces invalid record
    }
  }

  // ISS
  addSat('ISS (ZARYA)', 25544, 'scientific', null, 51.64, 408, 100, 0)

  // Hubble
  addSat('HST', 20580, 'scientific', null, 28.47, 540, 200, 90)

  // Tiangong
  addSat('TIANGONG', 54216, 'scientific', null, 41.47, 390, 150, 180)

  // Starlink constellation (~200 sample)
  for (let i = 0; i < 200; i++) {
    const plane = i % 36
    addSat(
      `STARLINK-${1000 + i}`,
      70000 + i,
      'communications',
      'starlink',
      53 + rng() * 0.5,
      550,
      plane * 10,
      (i * 137.5) % 360,
    )
  }

  // OneWeb (~40 sample)
  for (let i = 0; i < 40; i++) {
    const plane = i % 12
    addSat(
      `ONEWEB-${100 + i}`,
      71000 + i,
      'communications',
      'oneweb',
      87.9,
      1200,
      plane * 30,
      (i * 137.5) % 360,
    )
  }

  // GPS constellation
  for (let i = 0; i < 24; i++) {
    addSat(
      `NAVSTAR ${i + 1} (GPS)`,
      72000 + i,
      'navigation',
      'gps',
      55,
      20200,
      (i % 6) * 60,
      (i * 15) % 360,
    )
  }

  // Galileo
  for (let i = 0; i < 24; i++) {
    addSat(
      `GALILEO ${i + 1}`,
      73000 + i,
      'navigation',
      'galileo',
      56,
      23222,
      (i % 3) * 120,
      (i * 15) % 360,
    )
  }

  // GLONASS
  for (let i = 0; i < 24; i++) {
    addSat(
      `GLONASS ${i + 1}`,
      74000 + i,
      'navigation',
      'glonass',
      64.8,
      19130,
      (i % 3) * 120,
      (i * 15) % 360,
    )
  }

  // Iridium NEXT
  for (let i = 0; i < 66; i++) {
    const plane = i % 6
    addSat(
      `IRIDIUM ${100 + i}`,
      75000 + i,
      'communications',
      'iridium',
      86.4,
      780,
      plane * 31.6,
      (i * 32.7) % 360,
    )
  }

  // GEO satellites
  const geoNames = [
    'GOES-16', 'GOES-17', 'METEOSAT-11', 'HIMAWARI-8',
    'INTELSAT 35E', 'SES-17', 'VIASAT-3', 'DIRECTV 15',
    'ASTRA 2G', 'EUTELSAT 172B',
  ]
  for (let i = 0; i < geoNames.length; i++) {
    const cat = geoNames[i].includes('GOES') || geoNames[i].includes('METEO') || geoNames[i].includes('HIMAWARI')
      ? 'earth-observation' as SatCategory
      : 'communications' as SatCategory
    addSat(geoNames[i], 76000 + i, cat, null, 0.05 + rng() * 0.1, 35786, i * 36, rng() * 360, 0.0002)
  }

  // Earth observation LEO
  const eoNames = ['LANDSAT 9', 'SENTINEL-2A', 'TERRA', 'AQUA', 'SUOMI NPP', 'ICESAT-2']
  for (let i = 0; i < eoNames.length; i++) {
    addSat(eoNames[i], 77000 + i, 'earth-observation', null, 97 + rng() * 2, 680 + rng() * 100, rng() * 360, rng() * 360)
  }

  // Science
  const sciNames = ['CHANDRA', 'FERMI', 'SWIFT', 'NUSTAR']
  for (let i = 0; i < sciNames.length; i++) {
    addSat(sciNames[i], 78000 + i, 'scientific', null, 28 + rng() * 30, 500 + rng() * 200, rng() * 360, rng() * 360)
  }

  // Military/other
  for (let i = 0; i < 30; i++) {
    addSat(
      `COSMOS ${2500 + i}`,
      79000 + i,
      'military',
      null,
      60 + rng() * 40,
      400 + rng() * 1500,
      rng() * 360,
      rng() * 360,
    )
  }

  return sats
}

// ─── Sun Position ───────────────────────────────────────────────────────────

/** Approximate sun direction in ECI, normalised */
export function getSunDirection(date: Date): [number, number, number] {
  const J2000 = new Date('2000-01-01T12:00:00Z').getTime()
  const d = (date.getTime() - J2000) / 86400000

  // Approximate ecliptic longitude
  const g = ((357.529 + 0.98560028 * d) * Math.PI) / 180
  const q = ((280.459 + 0.98564736 * d) * Math.PI) / 180
  const L = q + ((1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * Math.PI) / 180

  // Obliquity of ecliptic
  const e = (23.439 - 0.00000036 * d) * Math.PI / 180

  const x = Math.cos(L)
  const y = Math.sin(L) * Math.cos(e)
  const z = Math.sin(L) * Math.sin(e)

  // Rotate by GMST to get from ECI to ECEF-ish direction
  const gmst = gstime(date)
  const xr = x * Math.cos(gmst) + y * Math.sin(gmst)
  const yr = -x * Math.sin(gmst) + y * Math.cos(gmst)

  return [xr, z, -yr]
}
