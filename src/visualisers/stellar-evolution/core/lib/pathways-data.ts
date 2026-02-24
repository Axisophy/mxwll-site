export interface EvolutionPoint {
  temperature: number; // Kelvin
  luminosity: number; // Solar luminosities
  label: string;
  age: string;
  description?: string;
}

export interface EvolutionPath {
  id: string;
  name: string;
  mass: string; // e.g., "1 M☉"
  massValue: number; // Solar masses
  lifetime: string;
  endpoint: 'white_dwarf' | 'neutron_star' | 'black_hole';
  endpointLabel: string;
  color: string;
  points: EvolutionPoint[];
}

// Solar evolution pathway (1 solar mass)
export const SOLAR_EVOLUTION: EvolutionPoint[] = [
  {
    temperature: 5600,
    luminosity: 0.7,
    label: 'Zero-age main sequence',
    age: '0 Gyr',
    description: 'The Sun begins its life as a main sequence star, fusing hydrogen into helium.',
  },
  {
    temperature: 5700,
    luminosity: 0.85,
    label: 'Early main sequence',
    age: '2 Gyr',
    description: 'Slowly brightening as helium accumulates in the core.',
  },
  {
    temperature: 5778,
    luminosity: 1.0,
    label: 'Present Sun',
    age: '4.6 Gyr',
    description: 'Today. The Sun is about halfway through its main sequence lifetime.',
  },
  {
    temperature: 5800,
    luminosity: 1.4,
    label: 'Mid main sequence',
    age: '7 Gyr',
    description: 'Continuing to brighten. Earth may become too hot for liquid water.',
  },
  {
    temperature: 5800,
    luminosity: 1.8,
    label: 'Late main sequence',
    age: '9 Gyr',
    description: 'Core hydrogen nearly exhausted.',
  },
  {
    temperature: 5400,
    luminosity: 2.5,
    label: 'Subgiant',
    age: '10.5 Gyr',
    description: 'Core hydrogen exhausted. Shell burning begins. The Sun starts to expand.',
  },
  {
    temperature: 4800,
    luminosity: 10,
    label: 'Early red giant',
    age: '11 Gyr',
    description: 'Expanding and cooling as it ascends the red giant branch.',
  },
  {
    temperature: 4200,
    luminosity: 100,
    label: 'Red giant branch',
    age: '11.5 Gyr',
    description: 'Now large enough to swallow Mercury.',
  },
  {
    temperature: 3500,
    luminosity: 2000,
    label: 'RGB tip',
    age: '12 Gyr',
    description: 'Maximum size on the first ascent. Helium flash ignites core helium burning.',
  },
  {
    temperature: 4700,
    luminosity: 50,
    label: 'Horizontal branch',
    age: '12.1 Gyr',
    description: 'Core helium burning. The Sun shrinks and heats up briefly.',
  },
  {
    temperature: 3800,
    luminosity: 500,
    label: 'Early AGB',
    age: '12.2 Gyr',
    description: 'Ascending the asymptotic giant branch. Shell burning of both H and He.',
  },
  {
    temperature: 3200,
    luminosity: 5000,
    label: 'AGB tip',
    age: '12.3 Gyr',
    description: 'Maximum luminosity. Thermal pulses eject outer layers.',
  },
  {
    temperature: 30000,
    luminosity: 3000,
    label: 'Planetary nebula',
    age: '12.3 Gyr',
    description: 'The exposed hot core ionizes the ejected shell, creating a glowing nebula.',
  },
  {
    temperature: 100000,
    luminosity: 100,
    label: 'Hot white dwarf',
    age: '12.35 Gyr',
    description: 'The core, now exposed, is extremely hot but tiny.',
  },
  {
    temperature: 30000,
    luminosity: 0.01,
    label: 'Cooling white dwarf',
    age: '13 Gyr',
    description: 'Slowly cooling. No fusion, just radiating stored heat.',
  },
  {
    temperature: 5000,
    luminosity: 0.0001,
    label: 'Cold white dwarf',
    age: '>15 Gyr',
    description: 'Eventually cooling to a black dwarf, but this takes longer than the current age of the universe.',
  },
];

// Low mass star (0.5 solar masses) - red dwarf
export const LOW_MASS_PATH: EvolutionPath = {
  id: 'low_mass',
  name: 'Red Dwarf',
  mass: '0.5 M☉',
  massValue: 0.5,
  lifetime: '~100 billion years',
  endpoint: 'white_dwarf',
  endpointLabel: 'White Dwarf (eventually)',
  color: '#FF6B6B',
  points: [
    { temperature: 3800, luminosity: 0.03, label: 'Zero-age main sequence', age: '0 Gyr' },
    { temperature: 3900, luminosity: 0.04, label: 'Main sequence', age: '50 Gyr' },
    { temperature: 4000, luminosity: 0.05, label: 'Late main sequence', age: '100 Gyr' },
    { temperature: 4200, luminosity: 0.08, label: 'End of hydrogen burning', age: '~150 Gyr' },
    { temperature: 10000, luminosity: 0.001, label: 'Helium white dwarf', age: '~150+ Gyr' },
  ],
};

// Sun-like star (1 solar mass)
export const SUN_LIKE_PATH: EvolutionPath = {
  id: 'sun_like',
  name: 'Sun-like Star',
  mass: '1 M☉',
  massValue: 1,
  lifetime: '~10 billion years',
  endpoint: 'white_dwarf',
  endpointLabel: 'White Dwarf',
  color: '#0055FF',
  points: SOLAR_EVOLUTION,
};

// High mass star (8 solar masses)
export const HIGH_MASS_PATH: EvolutionPath = {
  id: 'high_mass',
  name: 'Massive Star',
  mass: '8 M☉',
  massValue: 8,
  lifetime: '~40 million years',
  endpoint: 'neutron_star',
  endpointLabel: 'Neutron Star',
  color: '#9B59B6',
  points: [
    { temperature: 22000, luminosity: 1500, label: 'Zero-age main sequence', age: '0 Myr' },
    { temperature: 20000, luminosity: 3000, label: 'Main sequence', age: '20 Myr' },
    { temperature: 15000, luminosity: 8000, label: 'Late main sequence', age: '35 Myr' },
    { temperature: 10000, luminosity: 15000, label: 'Blue supergiant', age: '38 Myr' },
    { temperature: 4500, luminosity: 30000, label: 'Red supergiant', age: '40 Myr' },
    { temperature: 4000, luminosity: 50000, label: 'Pre-supernova', age: '40 Myr', description: 'Core collapse imminent' },
    // Supernova! (represented as a sudden drop)
    { temperature: 5000, luminosity: 0.00001, label: 'Neutron star', age: '40 Myr', description: 'After supernova explosion' },
  ],
};

// Very high mass star (25 solar masses)
export const VERY_HIGH_MASS_PATH: EvolutionPath = {
  id: 'very_high_mass',
  name: 'Very Massive Star',
  mass: '25 M☉',
  massValue: 25,
  lifetime: '~7 million years',
  endpoint: 'black_hole',
  endpointLabel: 'Black Hole',
  color: '#000000',
  points: [
    { temperature: 35000, luminosity: 80000, label: 'Zero-age main sequence', age: '0 Myr' },
    { temperature: 30000, luminosity: 150000, label: 'Main sequence', age: '3 Myr' },
    { temperature: 25000, luminosity: 200000, label: 'Late main sequence', age: '5 Myr' },
    { temperature: 15000, luminosity: 300000, label: 'Blue supergiant', age: '6 Myr' },
    { temperature: 4000, luminosity: 250000, label: 'Red supergiant', age: '7 Myr' },
    { temperature: 3500, luminosity: 300000, label: 'Pre-supernova', age: '7 Myr', description: 'Moments before core collapse' },
    // Black hole formation (no visible remnant on HR diagram)
    { temperature: 10000, luminosity: 0.000001, label: 'Black hole', age: '7 Myr', description: 'After supernova - stellar mass black hole' },
  ],
};

export const ALL_PATHS: EvolutionPath[] = [
  LOW_MASS_PATH,
  SUN_LIKE_PATH,
  HIGH_MASS_PATH,
  VERY_HIGH_MASS_PATH,
];

// Helper to find the "now" point in solar evolution
export const SOLAR_NOW_INDEX = SOLAR_EVOLUTION.findIndex(p => p.label === 'Present Sun');
