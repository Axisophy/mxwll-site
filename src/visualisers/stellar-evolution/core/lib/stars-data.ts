export type StarCategory = 'main_sequence' | 'giant' | 'supergiant' | 'white_dwarf';

export interface Star {
  name: string;
  // HR diagram coordinates (using temperature and luminosity for calculations)
  temperature: number; // Kelvin
  luminosity: number; // Solar luminosities
  type: StarCategory;
  spectralType: string;
  facts: string;
  constellation?: string;
  distance?: string; // Light years
}

export const CATEGORY_CONFIG: Record<StarCategory, { color: string; label: string; radius: number }> = {
  'main_sequence': { color: '#0055FF', label: 'Main Sequence', radius: 4 },
  'giant': { color: '#FF0055', label: 'Giants', radius: 5 },
  'supergiant': { color: '#000000', label: 'Supergiants', radius: 7 },
  'white_dwarf': { color: 'rgba(0,0,0,0.35)', label: 'White Dwarfs', radius: 3 },
};

export const FAMOUS_STARS: Star[] = [
  // Main Sequence Stars
  {
    name: 'Sun',
    temperature: 5778,
    luminosity: 1,
    type: 'main_sequence',
    spectralType: 'G2V',
    facts: 'Our star. A yellow dwarf halfway through its 10-billion-year main-sequence lifetime.',
    distance: '8 light-minutes',
  },
  {
    name: 'Sirius A',
    temperature: 9940,
    luminosity: 25.4,
    type: 'main_sequence',
    spectralType: 'A1V',
    facts: 'The brightest star in the night sky. A hot white star twice the mass of the Sun.',
    constellation: 'Canis Major',
    distance: '8.6 ly',
  },
  {
    name: 'Alpha Centauri A',
    temperature: 5790,
    luminosity: 1.519,
    type: 'main_sequence',
    spectralType: 'G2V',
    facts: 'The nearest Sun-like star. Part of a triple system including Proxima Centauri.',
    constellation: 'Centaurus',
    distance: '4.37 ly',
  },
  {
    name: 'Alpha Centauri B',
    temperature: 5260,
    luminosity: 0.5,
    type: 'main_sequence',
    spectralType: 'K1V',
    facts: 'The smaller companion to Alpha Centauri A. An orange dwarf slightly cooler than the Sun.',
    constellation: 'Centaurus',
    distance: '4.37 ly',
  },
  {
    name: 'Vega',
    temperature: 9602,
    luminosity: 40.12,
    type: 'main_sequence',
    spectralType: 'A0V',
    facts: 'One of the most studied stars. Was the North Star 14,000 years ago, will be again in 12,000 years.',
    constellation: 'Lyra',
    distance: '25 ly',
  },
  {
    name: 'Altair',
    temperature: 7550,
    luminosity: 10.6,
    type: 'main_sequence',
    spectralType: 'A7V',
    facts: 'Rotates so fast it bulges at the equator. Completes a rotation in about 9 hours.',
    constellation: 'Aquila',
    distance: '17 ly',
  },
  {
    name: 'Procyon A',
    temperature: 6530,
    luminosity: 6.93,
    type: 'main_sequence',
    spectralType: 'F5IV-V',
    facts: 'A bright nearby star beginning to evolve off the main sequence.',
    constellation: 'Canis Minor',
    distance: '11.5 ly',
  },
  {
    name: 'Fomalhaut',
    temperature: 8590,
    luminosity: 16.63,
    type: 'main_sequence',
    spectralType: 'A3V',
    facts: 'Surrounded by a dramatic debris disk. One of the first stars with a directly imaged exoplanet candidate.',
    constellation: 'Piscis Austrinus',
    distance: '25 ly',
  },
  {
    name: 'Proxima Centauri',
    temperature: 3042,
    luminosity: 0.0017,
    type: 'main_sequence',
    spectralType: 'M5.5Ve',
    facts: 'The nearest star to the Sun. A faint red dwarf with at least two confirmed exoplanets.',
    constellation: 'Centaurus',
    distance: '4.24 ly',
  },
  {
    name: "Barnard's Star",
    temperature: 3134,
    luminosity: 0.0035,
    type: 'main_sequence',
    spectralType: 'M4Ve',
    facts: "The fastest-moving star in Earth's sky. A red dwarf with possible planetary companions.",
    constellation: 'Ophiuchus',
    distance: '6 ly',
  },

  // Giants
  {
    name: 'Arcturus',
    temperature: 4286,
    luminosity: 170,
    type: 'giant',
    spectralType: 'K1.5III',
    facts: 'The brightest star in the northern hemisphere. A red giant 37 light-years away.',
    constellation: 'Bootes',
    distance: '37 ly',
  },
  {
    name: 'Aldebaran',
    temperature: 3910,
    luminosity: 518,
    type: 'giant',
    spectralType: 'K5III',
    facts: 'The eye of Taurus. A red giant that has exhausted its core hydrogen.',
    constellation: 'Taurus',
    distance: '65 ly',
  },
  {
    name: 'Pollux',
    temperature: 4666,
    luminosity: 32.7,
    type: 'giant',
    spectralType: 'K0III',
    facts: 'The brightest star in Gemini. A giant with a confirmed Jupiter-mass exoplanet.',
    constellation: 'Gemini',
    distance: '34 ly',
  },
  {
    name: 'Capella',
    temperature: 4970,
    luminosity: 78.7,
    type: 'giant',
    spectralType: 'G8III',
    facts: 'Actually a system of four stars. The primary is a yellow giant similar to what our Sun will become.',
    constellation: 'Auriga',
    distance: '43 ly',
  },

  // Supergiants
  {
    name: 'Betelgeuse',
    temperature: 3500,
    luminosity: 126000,
    type: 'supergiant',
    spectralType: 'M1-2Ia',
    facts: 'A red supergiant nearing the end of its life. Could explode as a supernova any time in the next 100,000 years.',
    constellation: 'Orion',
    distance: '700 ly',
  },
  {
    name: 'Rigel',
    temperature: 12100,
    luminosity: 120000,
    type: 'supergiant',
    spectralType: 'B8Ia',
    facts: 'A blue supergiant in Orion. One of the most luminous stars visible to the naked eye.',
    constellation: 'Orion',
    distance: '860 ly',
  },
  {
    name: 'Deneb',
    temperature: 8525,
    luminosity: 196000,
    type: 'supergiant',
    spectralType: 'A2Ia',
    facts: 'One of the most luminous stars known. Around 2,600 light-years away yet still among the brightest.',
    constellation: 'Cygnus',
    distance: '2,600 ly',
  },
  {
    name: 'Antares',
    temperature: 3660,
    luminosity: 75900,
    type: 'supergiant',
    spectralType: 'M1Iab',
    facts: 'The heart of Scorpius. A red supergiant so large it would engulf the orbit of Mars.',
    constellation: 'Scorpius',
    distance: '550 ly',
  },
  {
    name: 'Polaris',
    temperature: 6015,
    luminosity: 1260,
    type: 'supergiant',
    spectralType: 'F7Ib',
    facts: 'The current North Star. A Cepheid variable that pulsates over a 4-day cycle.',
    constellation: 'Ursa Minor',
    distance: '430 ly',
  },
  {
    name: 'Canopus',
    temperature: 7350,
    luminosity: 10700,
    type: 'supergiant',
    spectralType: 'A9II',
    facts: 'The second-brightest star in the night sky. A bright giant 310 light-years away.',
    constellation: 'Carina',
    distance: '310 ly',
  },

  // White Dwarfs
  {
    name: 'Sirius B',
    temperature: 25200,
    luminosity: 0.056,
    type: 'white_dwarf',
    spectralType: 'DA2',
    facts: 'The companion of Sirius A. A white dwarf with the mass of the Sun compressed to the size of Earth.',
    constellation: 'Canis Major',
    distance: '8.6 ly',
  },
  {
    name: 'Procyon B',
    temperature: 7740,
    luminosity: 0.00049,
    type: 'white_dwarf',
    spectralType: 'DQZ',
    facts: 'One of the nearest white dwarfs. The faint companion of Procyon A.',
    constellation: 'Canis Minor',
    distance: '11.5 ly',
  },
  {
    name: '40 Eridani B',
    temperature: 16500,
    luminosity: 0.013,
    type: 'white_dwarf',
    spectralType: 'DA4',
    facts: 'The first white dwarf discovered. Part of a triple star system 16.3 light-years away.',
    constellation: 'Eridanus',
    distance: '16.3 ly',
  },
];

// HR diagram axis configuration
export const HR_CONFIG = {
  // Temperature axis (log scale, reversed - hot on left)
  tempMin: 2500,
  tempMax: 50000,
  // Luminosity axis (log scale)
  lumMin: 0.0001,
  lumMax: 500000,
  // Margins
  margin: { top: 40, right: 20, bottom: 50, left: 65 },
};

// Wider config for evolution diagrams (needs to show hot white dwarfs at ~100,000K
// and neutron stars at very low luminosity)
export const HR_EVOLUTION_CONFIG = {
  tempMin: 2500,
  tempMax: 150000,
  lumMin: 0.0000001, // 10^-7 — low enough for neutron stars
  lumMax: 500000,
  margin: { top: 40, right: 20, bottom: 50, left: 65 },
};

// Spectral class labels for the temperature axis
export const SPECTRAL_CLASSES = [
  { label: 'O', temp: 42000 },
  { label: 'B', temp: 18000 },
  { label: 'A', temp: 8700 },
  { label: 'F', temp: 6700 },
  { label: 'G', temp: 5600 },
  { label: 'K', temp: 4400 },
  { label: 'M', temp: 3000 },
];
