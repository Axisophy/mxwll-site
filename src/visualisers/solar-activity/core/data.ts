// Solar Activity Viewer - Data
// Monthly sunspot numbers, bookmarked events, channel definitions

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SolarEvent {
  id: string
  date: string         // YYYY-MM-DD
  name: string
  rating: string       // e.g. "X17.2", "G5", etc.
  description: string
  earthEffects: string
  historic?: boolean   // No SDO imagery available
}

export interface Channel {
  id: string
  name: string
  label: string
  baseColour: [number, number, number]    // RGB for disc centre
  edgeColour: [number, number, number]    // RGB for limb
  spotStyle: 'dark' | 'bright'           // How sunspots render
  description: string
}

export interface LayerDef {
  id: string
  label: string
  description: string
}

// ─── Channels ───────────────────────────────────────────────────────────────

export const CHANNELS: Channel[] = [
  {
    id: '171A',
    name: '171 Angstrom',
    label: '171A EUV',
    baseColour: [255, 200, 50],
    edgeColour: [200, 120, 0],
    spotStyle: 'bright',
    description: 'Extreme ultraviolet. Shows the solar corona at ~600,000°C. Active regions glow intensely.',
  },
  {
    id: 'HMI',
    name: 'HMI Continuum',
    label: 'White Light',
    baseColour: [255, 250, 230],
    edgeColour: [220, 200, 150],
    spotStyle: 'dark',
    description: 'Visible light. Shows sunspots as dark regions - cooler areas of intense magnetic activity.',
  },
  {
    id: '304A',
    name: '304 Angstrom',
    label: '304A Chromo.',
    baseColour: [255, 80, 30],
    edgeColour: [180, 40, 10],
    spotStyle: 'bright',
    description: 'Chromosphere at ~50,000°C. Reveals prominences - arcs of plasma above the surface.',
  },
  {
    id: '193A',
    name: '193 Angstrom',
    label: '193A Corona',
    baseColour: [60, 180, 200],
    edgeColour: [20, 100, 130],
    spotStyle: 'bright',
    description: 'Hot corona at ~1.2 million°C. Coronal holes appear dark - regions where solar wind escapes.',
  },
]

// ─── Layers ─────────────────────────────────────────────────────────────────

export const LAYERS: LayerDef[] = [
  { id: 'sunspots', label: 'Regions', description: 'Numbered NOAA active regions' },
  { id: 'magnetic', label: 'Polarity', description: 'Magnetic field polarity (blue/red)' },
  { id: 'coronal', label: 'Loops', description: 'Coronal loop structures' },
  { id: 'holes', label: 'Holes', description: 'Coronal holes' },
]

// ─── Bookmarked Events ──────────────────────────────────────────────────────

export const EVENTS: SolarEvent[] = [
  {
    id: 'carrington',
    date: '1859-09-01',
    name: 'Carrington Event',
    rating: 'Estimated X40+',
    description: 'The most powerful geomagnetic storm on record. Richard Carrington and Richard Hodgson independently observed a white-light solar flare - the first ever recorded. The resulting geomagnetic storm arrived at Earth in just 17.6 hours (typical transit is 3-4 days), indicating an extraordinarily fast coronal mass ejection.',
    earthEffects: 'Telegraph systems worldwide failed, with some operators receiving electric shocks. Aurora was visible as far south as the Caribbean. Telegraph equipment continued operating even when disconnected from batteries, powered by the induced currents alone.',
    historic: true,
  },
  {
    id: 'halloween-2003',
    date: '2003-10-28',
    name: 'Halloween Storms',
    rating: 'X17.2 + X10',
    description: 'A series of powerful solar flares and coronal mass ejections over two weeks in October-November 2003. Region AR 10486 produced some of the most powerful flares ever recorded, including an X28+ event that saturated the GOES detectors.',
    earthEffects: 'Widespread aurora visible from the Mediterranean. Satellite damage including the loss of ADEOS-II. Power transformer damage in South Africa. Aviation rerouted away from polar regions. GPS accuracy degraded for days.',
  },
  {
    id: 'sdo-first-2010',
    date: '2010-08-01',
    name: 'SDO First Major Event',
    rating: 'C3.4',
    description: 'The Solar Dynamics Observatory captured its first major coronal mass ejection just months after launch. The event was modest by solar standards but spectacular visually - a massive filament of plasma lifted off the surface across almost an entire solar hemisphere.',
    earthEffects: 'Minor geomagnetic storm (G1). Modest aurora at high latitudes. More significant as a demonstration of SDO\'s imaging capabilities than for its Earth effects.',
  },
  {
    id: 'valentines-2011',
    date: '2011-02-15',
    name: 'Valentine\'s Day Flare',
    rating: 'X2.2',
    description: 'The first X-class flare of Solar Cycle 24. After years of unusually quiet solar minimum, this flare from region AR 11158 signalled that the new cycle was finally building. It was the largest flare in over four years.',
    earthEffects: 'Radio blackouts on the sunlit side of Earth. Minor disruption to high-frequency communications. The associated CME caused a moderate (G1) geomagnetic storm two days later.',
  },
  {
    id: 'rain-2011',
    date: '2011-06-07',
    name: 'Coronal Rain',
    rating: 'M2.5',
    description: 'A medium-sized flare produced one of the most visually spectacular events in SDO history. A massive eruption launched material high above the Sun, and SDO captured the plasma falling back to the surface as "coronal rain" - glowing streams cascading across the solar disc.',
    earthEffects: 'Minimal Earth effects. The event was significant primarily for the extraordinary SDO imagery it produced.',
  },
  {
    id: 'x5-2012',
    date: '2012-03-07',
    name: 'March 2012 Flares',
    rating: 'X5.4 + X1.3',
    description: 'Two X-class flares in quick succession from region AR 11429, accompanied by fast coronal mass ejections. The strongest flare of Cycle 24 at that point.',
    earthEffects: 'Strong geomagnetic storm (G3). Aurora visible across Scandinavia and northern US states. Brief GPS accuracy degradation. High-frequency radio blackouts.',
  },
  {
    id: 'near-miss-2012',
    date: '2012-07-23',
    name: 'Near-Miss CME',
    rating: 'Extreme',
    description: 'An extraordinarily powerful coronal mass ejection erupted from the far side of the Sun, in a direction that would have hit Earth squarely had it occurred just nine days earlier. Analysis suggests it would have been comparable to the 1859 Carrington Event. STEREO-A, positioned ahead of Earth in its orbit, recorded the event directly.',
    earthEffects: 'No effects on Earth - the CME missed entirely. Later analysis estimated that a direct hit would have caused $0.6-2.6 trillion in damage to technological infrastructure in the first year alone, with recovery taking 4-10 years.',
  },
  {
    id: 'x28-estimate',
    date: '2013-05-13',
    name: 'Cycle 24 Strongest',
    rating: 'X2.8 + X3.2 + X1.7',
    description: 'A cluster of three X-class flares over two days from regions AR 11748. These were the strongest flares of Solar Cycle 24\'s maximum phase, though Cycle 24 was historically weak.',
    earthEffects: 'Radio blackouts in the Pacific region. Minor to moderate geomagnetic storming. Aurora visible at high latitudes.',
  },
  {
    id: 'x49-2014',
    date: '2014-10-22',
    name: 'Giant Sunspot Group',
    rating: 'X1.6',
    description: 'Region AR 12192 became the largest sunspot group observed in 24 years, spanning an area larger than Jupiter. Despite its enormous size, it produced surprisingly few coronal mass ejections relative to its flare output - a mystery that prompted significant research.',
    earthEffects: 'Multiple radio blackouts. Surprisingly modest geomagnetic effects due to the lack of significant CMEs despite repeated X-class flares.',
  },
  {
    id: 'sept-2017',
    date: '2017-09-06',
    name: 'September 2017 Flares',
    rating: 'X9.3',
    description: 'Region AR 12673 produced the strongest flare in 12 years - an X9.3 event followed by an X8.2 on September 10. This was remarkable because it occurred during the declining phase of Cycle 24, when such powerful events are unusual.',
    earthEffects: 'Widespread high-frequency radio blackouts. GPS accuracy degraded across the sunlit hemisphere. Strong geomagnetic storm (G4). Aurora visible across Scandinavia and much of Canada.',
  },
  {
    id: 'cycle25-start',
    date: '2020-06-01',
    name: 'Cycle 25 Begins',
    rating: 'N/A',
    description: 'Solar Cycle 25 was officially declared to have begun in December 2019, with the solar minimum occurring around this time. Initial predictions suggested a weak cycle similar to Cycle 24, but actual activity has significantly exceeded forecasts.',
    earthEffects: 'No immediate effects. The start of a new cycle means increasing solar activity over the following 5-6 years.',
  },
  {
    id: 'cycle25-ramp',
    date: '2022-03-30',
    name: 'Cycle 25 Intensifies',
    rating: 'X1.3',
    description: 'An X1.3 flare from region AR 12975, part of a pattern of increasing activity that showed Cycle 25 was outperforming predictions. Monthly sunspot numbers began consistently exceeding the forecast.',
    earthEffects: 'Brief radio blackout over the Americas. Minor geomagnetic storm. Aurora at high latitudes.',
  },
  {
    id: 'dec-2023',
    date: '2023-12-14',
    name: 'December 2023 Activity',
    rating: 'X2.8',
    description: 'Continuing the trend of Cycle 25 exceeding predictions, December 2023 saw high activity with multiple M and X-class flares. Monthly sunspot numbers approached levels not seen since 2001.',
    earthEffects: 'Radio blackouts. Enhanced aurora at high latitudes. Minor satellite drag effects from upper atmosphere expansion.',
  },
  {
    id: 'may-2024',
    date: '2024-05-10',
    name: 'May 2024 Storm',
    rating: 'G5 Extreme',
    description: 'The strongest geomagnetic storm in over 20 years. Multiple coronal mass ejections arrived at Earth in rapid succession, producing sustained G5 (extreme) geomagnetic conditions. Region AR 13664 had been active for days, launching a series of Earth-directed CMEs.',
    earthEffects: 'Aurora visible from the UK, much of the continental United States, and as far south as northern Mexico. The most widely photographed aurora in history due to smartphone cameras. Some GPS degradation and minor satellite issues, but no major infrastructure damage.',
  },
  {
    id: 'x71-2024',
    date: '2024-10-03',
    name: 'X7.1 Flare',
    rating: 'X7.1',
    description: 'Region AR 13842 produced an X7.1 flare, one of the strongest of Cycle 25. This confirmed that Cycle 25 had significantly exceeded initial predictions, with peak activity rivalling some of the stronger cycles of recent decades.',
    earthEffects: 'Strong radio blackout over the sunlit hemisphere. G3 geomagnetic storm conditions. Aurora visible across northern Europe and Canada.',
  },
]

// ─── Monthly Sunspot Numbers (SSN) ──────────────────────────────────────────
// Approximate monthly mean sunspot numbers, Jan 2010 to Mar 2026
// Index 0 = Jan 2010, Index 194 = Mar 2026
// Sources: SILSO, WDC-SILSO, Royal Observatory of Belgium

export const SSN_START_YEAR = 2010

export const SSN_DATA: number[] = [
  // 2010
  13, 19, 15, 14, 12, 14, 16, 20, 25, 23, 22, 17,
  // 2011
  19, 29, 56, 54, 41, 37, 43, 51, 78, 88, 97, 73,
  // 2012
  58, 33, 64, 55, 69, 64, 67, 63, 62, 54, 62, 40,
  // 2013
  62, 38, 58, 72, 79, 52, 57, 66, 37, 86, 78, 90,
  // 2014
  82, 102, 92, 75, 76, 71, 75, 74, 87, 60, 64, 78,
  // 2015
  67, 45, 39, 54, 58, 66, 59, 65, 49, 44, 59, 57,
  // 2016
  56, 57, 38, 39, 22, 28, 21, 42, 44, 33, 22, 16,
  // 2017
  26, 26, 18, 32, 19, 20, 30, 33, 45, 13, 6, 8,
  // 2018
  7, 11, 3, 8, 14, 15, 1, 9, 3, 5, 5, 10,
  // 2019
  7, 0, 10, 9, 10, 1, 1, 1, 1, 1, 1, 6,
  // 2020
  6, 0, 1, 5, 0, 6, 7, 9, 1, 14, 31, 17,
  // 2021
  10, 7, 28, 27, 25, 23, 36, 28, 51, 45, 43, 71,
  // 2022
  57, 58, 73, 85, 97, 70, 96, 118, 94, 96, 80, 113,
  // 2023
  144, 111, 123, 97, 137, 161, 160, 115, 134, 99, 106, 114,
  // 2024
  123, 123, 104, 135, 172, 164, 196, 215, 142, 174, 131, 127,
  // 2025
  139, 130, 128, 120, 115, 110, 105, 100, 95, 90, 85, 80,
  // 2026 (Jan-Mar)
  75, 70, 65,
]

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Convert a fractional year (e.g. 2024.5) to a month index into SSN_DATA */
export function yearToSSNIndex(year: number): number {
  return Math.max(0, Math.min(SSN_DATA.length - 1, Math.floor((year - SSN_START_YEAR) * 12)))
}

/** Get SSN for a fractional year, interpolated */
export function getSSN(year: number): number {
  const idx = (year - SSN_START_YEAR) * 12
  const i0 = Math.max(0, Math.min(SSN_DATA.length - 1, Math.floor(idx)))
  const i1 = Math.min(SSN_DATA.length - 1, i0 + 1)
  const t = idx - i0
  return SSN_DATA[i0] * (1 - t) + SSN_DATA[i1] * t
}

/** Convert fractional year to readable date string */
export function yearToDateStr(year: number): string {
  const y = Math.floor(year)
  const monthFrac = (year - y) * 12
  const m = Math.floor(monthFrac)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[m]} ${y}`
}

/** Simple seeded pseudo-random number generator */
export function seededRandom(seed: number): () => number {
  let s = Math.abs(seed) + 1
  return () => {
    s = (s * 16807 % 2147483647)
    return s / 2147483647
  }
}

/** Get event year as fractional year */
export function eventYear(event: SolarEvent): number {
  const d = new Date(event.date)
  return d.getFullYear() + (d.getMonth() + d.getDate() / 30) / 12
}

// Timeline range
export const TIMELINE_START = 2010
export const TIMELINE_END = 2026.25
