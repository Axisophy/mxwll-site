/**
 * Cosmic Objects Database - The Permissible Universe
 * 
 * ~200 cosmic objects from quarks to supermassive black holes, positioned
 * on a mass-radius diagram according to physical limits (Schwarzschild radius,
 * electron degeneracy, etc.)
 * 
 * Source: Extracted from Maxwell archive (src/app/data/fabric/permissible-universe/)
 * Files: lib/objects.ts, lib/objects-part2.ts, lib/types.ts
 * Record count: ~200 objects
 * Last updated: 2026-02-23
 * 
 * Each object includes:
 * - Physical properties (mass, radius, log values)
 * - Four-tier explanations (accessible → intuitive → technical → advanced)
 * - Discovery information
 * - Related objects, boundaries, and epochs
 */

// Type definitions
export type ObjectCategory =
  | 'fundamental-particles'
  | 'composite-particles'
  | 'atoms-molecules'
  | 'viruses-cells'
  | 'macroscopic-life'
  | 'solar-system'
  | 'stars'
  | 'stellar-remnants'
  | 'black-holes'
  | 'stellar-structures'
  | 'galaxies'
  | 'large-scale-structure'
  | 'exotic-theoretical'

export interface CosmicObject {
  id: string
  name: string
  category: ObjectCategory
  logRadius: number
  logMass: number
  radius: { value: number; unit: string; formatted: string }
  mass: { value: number; unit: string; formatted: string }
  tagline: string
  description: string
  whyThisSize: string
  explanations: {
    accessible: string
    intuitive: string
    technical: string
    advanced?: string
  }
  nearbyObjects: string[]
  relatedBoundaries: string[]
  relatedEpochs: string[]
  discovered?: { year: number; by: string; how?: string }
  notable?: boolean
  labelOffset?: { x: number; y: number }
}

export interface CategoryMeta {
  id: ObjectCategory
  name: string
  shortName: string
  description: string
  color: string
  icon: string
  order: number
}

// ===== OBJECT ARRAYS (imported from Maxwell archive) =====

const FUNDAMENTAL_PARTICLES: CosmicObject[] = [
  {
    id: 'electron',
    name: 'Electron',
    category: 'fundamental-particles',
    logRadius: -10.4,
    logMass: -27.04,
    radius: { value: 3.86, unit: '×10⁻¹¹ cm', formatted: '3.86×10⁻¹¹ cm (Compton wavelength)' },
    mass: { value: 0.511, unit: 'MeV/c²', formatted: '0.511 MeV/c² (9.1×10⁻²⁸ g)' },
    tagline: 'The lightest charged particle – the workhorse of chemistry and electricity',
    description: 'The electron is a fundamental particle with no known substructure. It carries one unit of negative electric charge and is responsible for chemical bonds, electricity, and the stability of atoms.',
    whyThisSize: 'The electron is point-like – experiments find no internal structure. Its Compton wavelength (3.86×10⁻¹¹ cm) defines its quantum "fuzziness" and sets its position on this diagram.',
    explanations: {
      accessible: 'Electrons are tiny particles that orbit atomic nuclei and carry negative charge. Every atom contains electrons. When electrons flow through wires, we get electricity.',
      intuitive: 'The electron is point-like (no measured radius), but its Compton wavelength ℏ/mₑc ≈ 3.86×10⁻¹¹ cm sets its quantum size. Electric charge e = 1.6×10⁻¹⁹ C.',
      technical: 'Electron: lepton with spin ½, charge -e. QED describes its interactions. Anomalous magnetic moment g-2 measured to 12 decimal places, matching theory.',
      advanced: 'The electron mass arises from Yukawa coupling to the Higgs field. Its point-like nature is assumed in QED; any compositeness scale is >10 TeV.',
    },
    nearbyObjects: ['proton', 'muon', 'hydrogen'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['electroweak', 'now'],
    discovered: { year: 1897, by: 'J.J. Thomson' },
    notable: false,
  },
  {
    id: 'proton',
    name: 'Proton',
    category: 'composite-particles',
    logRadius: -13.1,
    logMass: -23.78,
    radius: { value: 0.87, unit: 'fm', formatted: '0.87 fm (8.7×10⁻¹⁴ cm)' },
    mass: { value: 938, unit: 'MeV/c²', formatted: '938 MeV/c² (1.67×10⁻²⁴ g)' },
    tagline: 'The hydrogen nucleus – a bound state of three quarks',
    description: 'The proton is a composite particle made of two up quarks and one down quark, bound by gluons. It forms hydrogen nuclei and gives atoms their identity.',
    whyThisSize: 'The proton radius (~0.87 fm) is set by the strong force. At distances below ~1 fm, asymptotic freedom means quarks behave almost freely.',
    explanations: {
      accessible: 'Protons are found in every atomic nucleus. Each proton contains three quarks held together by the strong force. The number of protons defines the element.',
      intuitive: 'Proton = uud (two up quarks, one down). Mass mostly from QCD binding energy, not quark masses. Stable (τ > 10³⁴ years).',
      technical: 'Charge radius from electron scattering: 0.841 fm. The "proton radius puzzle" was resolved in 2019. Spin structure from DIS shows gluon contribution.',
      advanced: 'Proton structure described by parton distribution functions. Lattice QCD calculates hadron spectrum from first principles.',
    },
    nearbyObjects: ['neutron', 'electron', 'hydrogen'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['nuclear', 'now'],
    notable: true,
  },
  {
    id: 'neutron',
    name: 'Neutron',
    category: 'composite-particles',
    logRadius: -13.1,
    logMass: -23.78,
    radius: { value: 0.87, unit: 'fm', formatted: '~0.87 fm' },
    mass: { value: 939.6, unit: 'MeV/c²', formatted: '939.6 MeV/c²' },
    tagline: 'The neutral partner of the proton – essential for heavy nuclei',
    description: 'The neutron is a composite particle made of one up quark and two down quarks. It is electrically neutral and essential for stabilizing heavy nuclei.',
    whyThisSize: 'Like the proton, the neutron size is set by QCD confinement. It is slightly heavier than the proton by 1.3 MeV.',
    explanations: {
      accessible: 'Neutrons are found in atomic nuclei alongside protons. They have no electric charge and help hold the nucleus together.',
      intuitive: 'Neutron = udd. Free neutron lifetime ~15 minutes (β decay: n → p + e⁻ + ν̄). In nuclei, neutrons can be stable.',
      technical: 'Neutron magnetic moment -1.91 μN despite zero charge, revealing quark substructure. Key for nuclear stability and fission.',
      advanced: 'Neutron-antineutron oscillations constrain baryon number violation. Ultracold neutrons probe fundamental symmetries.',
    },
    nearbyObjects: ['proton', 'hydrogen', 'helium'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['nuclear', 'now'],
    notable: true,
  },
  {
    id: 'muon',
    name: 'Muon',
    category: 'fundamental-particles',
    logRadius: -12.73,
    logMass: -24.73,
    radius: { value: 1.87, unit: '×10⁻¹³ cm', formatted: '1.87×10⁻¹³ cm (Compton wavelength)' },
    mass: { value: 105.7, unit: 'MeV/c²', formatted: '105.7 MeV/c²' },
    tagline: "The electron's heavier cousin – 207× more massive",
    description: 'The muon is identical to the electron except 207 times heavier. It decays in 2.2 microseconds. "Who ordered that?" asked I.I. Rabi.',
    whyThisSize: 'Like the electron, the muon is point-like. Its Compton wavelength (1.87×10⁻¹³ cm) is smaller than the electron\'s because it is heavier.',
    explanations: {
      accessible: 'Muons are like heavy electrons. They rain down on us from cosmic rays – about 10,000 hit you every minute.',
      intuitive: 'Lifetime 2.2 μs. Decays μ → e + νμ + ν̄e. Time dilation lets cosmic ray muons reach ground.',
      technical: 'Muon g-2 anomaly: measured value differs from SM prediction. Possible new physics signal under investigation.',
      advanced: 'Muon collider proposals could reach 10+ TeV with clean leptonic collisions.',
    },
    nearbyObjects: ['electron', 'proton'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['electroweak'],
    discovered: { year: 1936, by: 'Anderson & Neddermeyer' },
    notable: false,
  },
  {
    id: 'alpha-particle',
    name: 'Alpha Particle',
    category: 'composite-particles',
    logRadius: -12.7,
    logMass: -23.18,
    radius: { value: 1.67, unit: 'fm', formatted: '~1.67 fm' },
    mass: { value: 3727, unit: 'MeV/c²', formatted: '4 atomic mass units' },
    tagline: 'A helium nucleus – two protons, two neutrons, tightly bound',
    description: 'Alpha particles are helium-4 nuclei emitted in radioactive decay. Rutherford used them to discover the atomic nucleus.',
    whyThisSize: 'Slightly larger than a single proton due to containing 4 nucleons. Very tightly bound (28 MeV binding energy).',
    explanations: {
      accessible: 'Alpha particles are helium nuclei shot out by radioactive atoms. They discovered the atomic nucleus.',
      intuitive: 'Binding energy 28.3 MeV (7.07 MeV/nucleon). Doubly magic: Z=2, N=2.',
      technical: 'Rutherford scattering: α + Au revealed nucleus. Cross-section → Coulomb potential → point-like nucleus.',
    },
    nearbyObjects: ['proton', 'neutron', 'hydrogen'],
    relatedBoundaries: [],
    relatedEpochs: ['nuclear'],
    discovered: { year: 1899, by: 'Ernest Rutherford' },
    notable: false,
  },
]

const ATOMS_MOLECULES: CosmicObject[] = [
  {
    id: 'hydrogen',
    name: 'Hydrogen Atom',
    category: 'atoms-molecules',
    logRadius: -8.3,
    logMass: -23.78,
    radius: { value: 53, unit: 'pm', formatted: '53 pm (Bohr radius)' },
    mass: { value: 1.008, unit: 'u', formatted: '1.008 atomic mass units' },
    tagline: 'The simplest atom – one proton, one electron, infinite applications',
    description: 'Hydrogen is the simplest and most abundant element in the universe. One proton, one electron. It powers the Sun and most stars.',
    whyThisSize: 'The Bohr radius a₀ = ℏ²/(m_e·e²) ≈ 53 pm emerges from quantum mechanics and sets the scale of all atoms.',
    explanations: {
      accessible: 'Hydrogen is the simplest atom – just one proton and one electron. Most of the universe is hydrogen. Stars fuse it into heavier elements.',
      intuitive: 'Bohr radius a₀ = 53 pm sets atomic scale. Energy levels E_n = -13.6 eV/n². 21 cm line from hyperfine splitting used in radio astronomy.',
      technical: 'Hydrogen spectroscopy tests QED to extreme precision. Lamb shift (2S-2P splitting) proved vacuum fluctuations are real.',
      advanced: 'Antihydrogen created at CERN tests CPT symmetry. Hydrogen masers provide the most stable frequency standards.',
    },
    nearbyObjects: ['helium', 'water', 'proton'],
    relatedBoundaries: ['compton'],
    relatedEpochs: ['recombination', 'now'],
    notable: true,
  },
  {
    id: 'water',
    name: 'Water Molecule',
    category: 'atoms-molecules',
    logRadius: -7.7,
    logMass: -22.5,
    radius: { value: 275, unit: 'pm', formatted: '~275 pm' },
    mass: { value: 18, unit: 'u', formatted: '18 atomic mass units' },
    tagline: 'The molecule of life – bent geometry creates unique properties',
    description: 'Water (H₂O) has a bent molecular geometry that creates a dipole moment, giving it unique properties: high surface tension, excellent solvent, expands when frozen.',
    whyThisSize: 'Water molecular size is set by O-H bond length (96 pm) and bond angle (104.5°). The bent shape creates polarity.',
    explanations: {
      accessible: 'Water is two hydrogen atoms bonded to one oxygen. Its bent shape makes it polar, which is why it dissolves so many things and is essential for life.',
      intuitive: 'H-O-H angle = 104.5°. Dipole moment 1.85 D. Hydrogen bonding causes high boiling point (100°C vs -60°C expected).',
      technical: 'Water anomalies: density maximum at 4°C, high heat capacity (4.18 J/g·K), high surface tension. All from hydrogen bonding network.',
    },
    nearbyObjects: ['hydrogen', 'dna-base-pair', 'protein'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
  },
]

const VIRUSES_CELLS: CosmicObject[] = [
  {
    id: 'sars-cov-2',
    name: 'SARS-CoV-2 Virus',
    category: 'viruses-cells',
    logRadius: -5.1,
    logMass: -12,
    radius: { value: 100, unit: 'nm', formatted: '~100 nm diameter' },
    mass: { value: 1, unit: 'fg', formatted: '~1 femtogram' },
    tagline: 'The virus that changed the world – 2019 onwards',
    description: 'SARS-CoV-2 is the coronavirus causing COVID-19. About 100 nm in diameter, it contains ~30,000 nucleotides of RNA.',
    whyThisSize: 'Coronavirus size is set by the lipid envelope encasing the nucleocapsid. Must be large enough for RNA genome but small enough to enter cells.',
    explanations: {
      accessible: 'This is the COVID-19 virus. Its famous spike proteins let it enter human cells. It spreads through respiratory droplets.',
      intuitive: 'RNA genome ~30 kb. Spike protein binds ACE2 receptor. Replication cycle ~8 hours. Highly contagious due to pre-symptomatic spread.',
      technical: 'Cryo-EM revealed spike structure. mRNA vaccines target prefusion spike conformation. Variants arise from RNA replication errors.',
    },
    nearbyObjects: ['virus-bacteriophage', 'bacterium-ecoli'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    discovered: { year: 2020, by: 'Chinese researchers', how: 'Genome sequencing' },
    notable: true,
  },
  {
    id: 'bacterium-ecoli',
    name: 'E. coli Bacterium',
    category: 'viruses-cells',
    logRadius: -4,
    logMass: -12,
    radius: { value: 1, unit: 'μm', formatted: '~1-2 μm' },
    mass: { value: 1, unit: 'pg', formatted: '~1 pg' },
    tagline: 'The workhorse of molecular biology, living in your gut right now',
    description: 'E. coli is a rod-shaped bacterium that lives in intestines. Most strains are harmless. It is the most studied organism in biology.',
    whyThisSize: 'Bacterial size is constrained by diffusion: nutrients and waste must reach all parts of the cell. At ~1 μm, E. coli optimizes surface area to volume.',
    explanations: {
      accessible: 'E. coli bacteria live in your intestines and help digest food. Scientists use them to study how life works.',
      intuitive: 'Genome: 4.6 million base pairs, ~4,300 genes. Generation time ~20 minutes. Trillions in your gut right now.',
      technical: 'E. coli K-12 is the reference genome. Transcription: ~50-90 nucleotides/s. Proteome: ~4,000 proteins per cell.',
    },
    nearbyObjects: ['sars-cov-2', 'human-red-blood-cell'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    discovered: { year: 1885, by: 'Theodor Escherich' },
    notable: true,
  },
  {
    id: 'red-blood-cell',
    name: 'Red Blood Cell',
    category: 'viruses-cells',
    logRadius: -3.1,
    logMass: -10.5,
    radius: { value: 8, unit: 'μm', formatted: '~8 μm diameter' },
    mass: { value: 27, unit: 'pg', formatted: '~27 picograms' },
    tagline: 'Oxygen courier – 25 trillion in your body right now',
    description: 'Red blood cells are biconcave discs optimized for gas exchange. They have no nucleus, maximizing space for hemoglobin.',
    whyThisSize: 'Size optimized for capillary passage and surface area. Must deform to squeeze through 3 μm capillaries.',
    explanations: {
      accessible: 'Red blood cells carry oxygen from your lungs to every part of your body. You have about 25 trillion of them.',
      intuitive: 'Contains ~270 million hemoglobin molecules. Lifespan ~120 days. Production: 2 million/second.',
      technical: 'Biconcave shape maximizes surface area/volume for O₂ diffusion. No mitochondria – relies on glycolysis.',
    },
    nearbyObjects: ['bacterium-ecoli', 'human'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: false,
  },
]

const MACROSCOPIC_LIFE: CosmicObject[] = [
  {
    id: 'human',
    name: 'Human',
    category: 'macroscopic-life',
    logRadius: 2.2,
    logMass: 4.85,
    radius: { value: 1.7, unit: 'm', formatted: '~1.7 m' },
    mass: { value: 70, unit: 'kg', formatted: '~70 kg' },
    tagline: 'The observer, roughly in the middle of the cosmic scale',
    description: 'Humans occupy a remarkable position on the mass-radius diagram: roughly in the middle of the permissible zone. With ~37 trillion cells and 86 billion neurons, we are complex enough to ask questions about the diagram itself.',
    whyThisSize: 'Land animal size is limited by bones (∝ r²) vs weight (∝ r³). Above ~10 tons, legs would be impractically thick.',
    explanations: {
      accessible: 'You are made of about 37 trillion cells, containing roughly 7 octillion atoms forged in stars billions of years ago.',
      intuitive: 'Human body: 60% water by mass. ~7×10²⁷ atoms. Most abundant: oxygen (65%), carbon (18%), hydrogen (10%).',
      technical: 'Metabolic rate ~80W. Neural computation: ~20W, ~10¹⁵ synapses.',
      advanced: 'Humans exist in a narrow habitable zone of the diagram: large enough for complex neural networks, small enough for planetary gravity.',
    },
    nearbyObjects: ['blue-whale', 'flea'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
    labelOffset: { x: 10, y: -10 },
  },
  {
    id: 'blue-whale',
    name: 'Blue Whale',
    category: 'macroscopic-life',
    logRadius: 3.4,
    logMass: 8.2,
    radius: { value: 30, unit: 'm', formatted: '~30 m' },
    mass: { value: 150, unit: 'tonnes', formatted: '~150 tonnes' },
    tagline: 'The largest animal ever to exist on Earth',
    description: 'The blue whale is the largest animal known to have ever lived – larger than any dinosaur. Its heart is the size of a small car.',
    whyThisSize: 'Aquatic animals can be larger than terrestrial ones because water supports their weight. Limited by metabolism: needs 4 tonnes of krill daily.',
    explanations: {
      accessible: 'Blue whales are so big their heart is the size of a car. A small child could crawl through their arteries.',
      intuitive: 'Metabolic rate ∝ mass^0.75 (Kleiber law). Efficiency increases with size.',
      technical: 'Diving physiology: bradycardia to 2 bpm during dives. Maximum depth ~500m, duration ~30 min.',
    },
    nearbyObjects: ['human', 'sequoia'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
  },
  {
    id: 'tardigrade',
    name: 'Tardigrade',
    category: 'macroscopic-life',
    logRadius: -1.5,
    logMass: -5,
    radius: { value: 0.3, unit: 'mm', formatted: '0.1-0.5 mm' },
    mass: { value: 10, unit: 'μg', formatted: '~1-10 μg' },
    tagline: 'The toughest animal – survives space vacuum, radiation, and boiling',
    description: 'Tardigrades (water bears) can survive extreme conditions by entering cryptobiosis – nearly stopping metabolism.',
    whyThisSize: 'Small enough for cryptobiosis to protect all cells, large enough for complex body plan (8 legs, brain).',
    explanations: {
      accessible: 'Tardigrades are microscopic animals that can survive being frozen, boiled, irradiated, and even exposed to space.',
      intuitive: 'Cryptobiosis: replace water with trehalose, metabolism drops to 0.01%. Revive with water.',
      technical: 'Survived 10 days in space vacuum (TARDIS experiment). Withstand 1000× lethal human radiation dose.',
    },
    nearbyObjects: ['ant', 'bacterium-ecoli'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: false,
  },
  {
    id: 'ant',
    name: 'Ant',
    category: 'macroscopic-life',
    logRadius: -0.5,
    logMass: -3,
    radius: { value: 2, unit: 'mm', formatted: '1-5 mm' },
    mass: { value: 1, unit: 'mg', formatted: '1-2 mg' },
    tagline: 'Tiny but mighty – can lift 50× their body weight',
    description: 'Ants are among the most successful organisms on Earth. Their collective biomass roughly equals that of all humans.',
    whyThisSize: 'Small size enables: carrying proportionally heavy loads, living in tiny spaces, huge populations.',
    explanations: {
      accessible: 'Ants can lift 50 times their own weight. All the ants on Earth weigh about as much as all the humans.',
      intuitive: 'Strength scales with cross-section (∝ r²), weight with volume (∝ r³). Small animals are proportionally stronger.',
      technical: 'Eusocial: sterile workers, single reproductive queen. Colony as superorganism.',
    },
    nearbyObjects: ['tardigrade', 'human'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: false,
  },
]

const SOLAR_SYSTEM: CosmicObject[] = [
  {
    id: 'earth',
    name: 'Earth',
    category: 'solar-system',
    logRadius: 8.8,
    logMass: 27.8,
    radius: { value: 6371, unit: 'km', formatted: '6,371 km' },
    mass: { value: 5.97, unit: '×10²⁴ kg', formatted: '5.97 × 10²⁴ kg' },
    tagline: 'The only known harbor for life in the cosmos',
    description: 'Earth is the largest rocky planet in our solar system and the only place where life is confirmed to exist.',
    whyThisSize: 'Earth mass is set by accretion in its orbital zone. Large enough for geological activity and atmosphere retention, small enough to remain rocky.',
    explanations: {
      accessible: 'Earth is the perfect size: big enough to hold an atmosphere but small enough to have a solid surface.',
      intuitive: 'Mean density 5.5 g/cm³ implies iron core + rocky mantle. Escape velocity 11.2 km/s.',
      technical: 'Heat budget: ~47 TW total, ~50% radioactive decay, ~50% primordial. Drives plate tectonics.',
    },
    nearbyObjects: ['moon', 'mars', 'jupiter'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    discovered: { year: 1543, by: 'Copernicus (as a planet)', how: 'Heliocentric model' },
    notable: true,
  },
  {
    id: 'moon',
    name: 'The Moon',
    category: 'solar-system',
    logRadius: 8.24,
    logMass: 25.87,
    radius: { value: 1737, unit: 'km', formatted: '1,737 km' },
    mass: { value: 7.35, unit: '×10²² kg', formatted: '7.35 × 10²² kg' },
    tagline: 'Earth companion, the only world humans have walked on beyond Earth',
    description: 'The Moon likely formed from debris after a Mars-sized body collided with early Earth. Twelve humans have walked on its surface.',
    whyThisSize: 'Unusually large relative to its planet (~1/81 Earth mass). Giant impact origin explains size and low density.',
    explanations: {
      accessible: 'The Moon formed when a Mars-sized planet crashed into Earth billions of years ago.',
      intuitive: 'Tidal locking: same face always points to Earth. Moving away 3.8 cm/year.',
      technical: 'Giant impact hypothesis: Moon formed within ~100 Myr of impact ~4.5 Gya.',
    },
    nearbyObjects: ['earth', 'mars'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    category: 'solar-system',
    logRadius: 9.85,
    logMass: 30.28,
    radius: { value: 69911, unit: 'km', formatted: '69,911 km' },
    mass: { value: 1.9, unit: '×10²⁷ kg', formatted: '1.9 × 10²⁷ kg (318 M⊕)' },
    tagline: 'The king of planets, failed star, solar system guardian',
    description: 'Jupiter is so massive it contains more matter than all other planets combined. Yet it is only 1/1000 the mass of the Sun.',
    whyThisSize: 'Jupiter accumulated most of the gas in the outer solar system. At 10-20× its current mass, it would have become a brown dwarf.',
    explanations: {
      accessible: 'Jupiter is so big that 1,300 Earths could fit inside it. Its Great Red Spot is a storm bigger than Earth.',
      intuitive: 'Core: ~10-20 Earth masses. Metallic hydrogen generates magnetic field 20,000× Earth.',
      technical: 'Radiates 1.7× energy received from Sun – gravitational contraction heating.',
    },
    nearbyObjects: ['saturn', 'sun', 'earth'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
  },
  {
    id: 'mars',
    name: 'Mars',
    category: 'solar-system',
    logRadius: 8.53,
    logMass: 26.81,
    radius: { value: 3390, unit: 'km', formatted: '3,390 km' },
    mass: { value: 6.4, unit: '×10²³ kg', formatted: '6.4 × 10²³ kg (0.107 M⊕)' },
    tagline: 'The red planet – our best candidate for a second home',
    description: "Mars once had liquid water and may have harbored life. It's the most explored planet after Earth.",
    whyThisSize: "Mars formed in a region with less material than Earth's zone. Jupiter's gravity may have stunted its growth.",
    explanations: {
      accessible: 'Mars is called the Red Planet because iron oxide (rust) covers its surface. It has the largest volcano in the solar system.',
      intuitive: 'Olympus Mons: 22 km high, 3× Everest. Valles Marineris: 4000 km long. Day length: 24h 37m.',
      technical: 'Thin CO₂ atmosphere (6 mbar). Evidence of ancient rivers, lakes, possibly ocean. Perseverance seeking biosignatures.',
    },
    nearbyObjects: ['earth', 'moon', 'jupiter'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
    labelOffset: { x: 10, y: 0 },
  },
  {
    id: 'saturn',
    name: 'Saturn',
    category: 'solar-system',
    logRadius: 9.76,
    logMass: 29.75,
    radius: { value: 58232, unit: 'km', formatted: '58,232 km' },
    mass: { value: 5.7, unit: '×10²⁶ kg', formatted: '5.7 × 10²⁶ kg (95 M⊕)' },
    tagline: 'The ringed wonder – less dense than water',
    description: "Saturn's rings are mostly water ice, spanning 280,000 km but only 10 meters thick. The planet would float in water (if you had a big enough ocean).",
    whyThisSize: "Similar formation to Jupiter but less massive. Lower mass means lower gravity compression, so it's nearly as large despite being 1/3 the mass.",
    explanations: {
      accessible: "Saturn is famous for its rings, made of billions of ice chunks. It's so light it would float in a giant bathtub.",
      intuitive: 'Density 0.69 g/cm³ (less than water). Rings are young: ~100 million years old, may disappear in ~300 million years.',
      technical: 'Ring system: 99.9% water ice. Cassini revealed ring "rain" depleting them. Titan: only moon with thick atmosphere.',
    },
    nearbyObjects: ['jupiter', 'sun'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
    labelOffset: { x: 10, y: 5 },
  },
  {
    id: 'ceres',
    name: 'Ceres',
    category: 'solar-system',
    logRadius: 7.67,
    logMass: 23.97,
    radius: { value: 469, unit: 'km', formatted: '469 km' },
    mass: { value: 9.4, unit: '×10²⁰ kg', formatted: '9.4 × 10²⁰ kg' },
    tagline: 'The largest asteroid, now classified as a dwarf planet',
    description: "Ceres contains about a third of the asteroid belt's total mass. It has a subsurface ocean and mysterious bright spots.",
    whyThisSize: "Largest object in asteroid belt – Jupiter's gravity prevented a planet from forming here.",
    explanations: {
      accessible: 'Ceres is the largest object in the asteroid belt between Mars and Jupiter. It might have more fresh water than Earth.',
      intuitive: 'Bright spots: sodium carbonate deposits from subsurface brine. Dawn mission orbited 2015-2018.',
      technical: 'Differentiated body: rocky core, ice mantle, thin dusty crust. Signs of recent geological activity.',
    },
    nearbyObjects: ['moon', 'mars'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: false,
  },
  {
    id: 'titan',
    name: 'Titan',
    category: 'solar-system',
    logRadius: 8.41,
    logMass: 26.13,
    radius: { value: 2575, unit: 'km', formatted: '2,575 km' },
    mass: { value: 1.35, unit: '×10²³ kg', formatted: '1.35 × 10²³ kg' },
    tagline: "Saturn's largest moon – the only moon with a thick atmosphere",
    description: "Titan has lakes of liquid methane, a nitrogen atmosphere denser than Earth's, and complex organic chemistry.",
    whyThisSize: 'Large enough to retain atmosphere (unlike most moons). Cold enough (-179°C) for methane to be liquid.',
    explanations: {
      accessible: 'Titan is the only moon with clouds and rain – but the rain is liquid methane, not water.',
      intuitive: "Surface pressure 1.5 bar (50% higher than Earth). Methane cycle like Earth's water cycle.",
      technical: 'Huygens landed 2005. Dragonfly mission (2034) will fly through atmosphere studying prebiotic chemistry.',
    },
    nearbyObjects: ['saturn', 'moon', 'mars'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: false,
  },
]

const STARS: CosmicObject[] = [
  {
    id: 'sun',
    name: 'The Sun',
    category: 'stars',
    logRadius: 10.84,
    logMass: 33.3,
    radius: { value: 696000, unit: 'km', formatted: '696,000 km' },
    mass: { value: 1, unit: 'M☉', formatted: '1 M☉ (Solar mass)' },
    tagline: 'Our star, a typical G-type main sequence star',
    description: 'The Sun is a middle-aged, medium-sized star fusing 600 million tonnes of hydrogen into helium every second.',
    whyThisSize: 'A star size balances gravity (compression) against radiation pressure (expansion). The Sun sits on the main sequence.',
    explanations: {
      accessible: 'The Sun is a giant ball of hot gas, mostly hydrogen. In its core, hydrogen atoms smash together to form helium, releasing the energy we see as sunlight.',
      intuitive: 'Core conditions: 15 million K, 250 billion atm. Luminosity L☉ = 3.83 × 10²⁶ W.',
      technical: 'Solar model from hydrostatic equilibrium, energy transport, and nuclear burning. Matches helioseismology within 0.1%.',
      advanced: 'Solar neutrino problem resolved by neutrino oscillations. Confirmed by SNO (2001).',
    },
    nearbyObjects: ['red-giant', 'jupiter'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
    labelOffset: { x: 0, y: -15 },
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    category: 'stars',
    logRadius: 13.8,
    logMass: 34.1,
    radius: { value: 900, unit: 'R☉', formatted: '~900 R☉' },
    mass: { value: 15, unit: 'M☉', formatted: '~15-20 M☉' },
    tagline: 'The red supergiant that will explode "soon" (in astronomical terms)',
    description: 'Betelgeuse is a red supergiant in Orion, so large that if placed at the Sun position, it would engulf Jupiter.',
    whyThisSize: 'Red supergiants are massive stars (>8 M☉) in late evolution. Inflated by vigorous shell burning. Doomed to explode.',
    explanations: {
      accessible: 'Betelgeuse is one of the largest stars we can see. It could explode any time in the next 100,000 years.',
      intuitive: 'Age ~10 Myr. Current phase: core carbon burning, ~1000 years left before supernova.',
      technical: 'Dimming (2019-2020) was dust ejection, not imminent supernova. Expected supernova magnitude ~ -12 from Earth.',
    },
    nearbyObjects: ['sun', 'neutron-star'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    discovered: { year: 1836, by: 'John Herschel', how: 'First observed variability' },
    notable: true,
  },
  {
    id: 'proxima-centauri',
    name: 'Proxima Centauri',
    category: 'stars',
    logRadius: 9.9,
    logMass: 32.4,
    radius: { value: 0.15, unit: 'R☉', formatted: '0.15 R☉' },
    mass: { value: 0.12, unit: 'M☉', formatted: '0.12 M☉' },
    tagline: 'The nearest star to the Sun – just 4.2 light-years away',
    description: 'Proxima Centauri is a red dwarf, the most common type of star. It hosts at least one potentially habitable planet.',
    whyThisSize: 'Red dwarfs are the smallest stars that can sustain hydrogen fusion. Proxima is near the minimum mass.',
    explanations: {
      accessible: 'Proxima Centauri is our nearest stellar neighbor. Even so, our fastest spacecraft would take 70,000 years to reach it.',
      intuitive: 'Proxima b: Earth-mass planet in habitable zone, but frequent flares may strip atmosphere.',
      technical: 'M5.5V spectral type. Fully convective interior. Lifetime: trillions of years (longer than current universe age).',
    },
    nearbyObjects: ['sun', 'white-dwarf'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    discovered: { year: 1915, by: 'Robert Innes' },
    notable: true,
    labelOffset: { x: 10, y: 0 },
  },
  {
    id: 'sirius',
    name: 'Sirius A',
    category: 'stars',
    logRadius: 10.9,
    logMass: 33.6,
    radius: { value: 1.7, unit: 'R☉', formatted: '1.7 R☉' },
    mass: { value: 2, unit: 'M☉', formatted: '2 M☉' },
    tagline: 'The brightest star in the night sky',
    description: 'Sirius is a binary system: Sirius A is a hot white star, Sirius B is a white dwarf. At 8.6 light-years, it dominates our night sky.',
    whyThisSize: "A-type main sequence star, about twice the Sun's mass. Brightness due to proximity and intrinsic luminosity.",
    explanations: {
      accessible: 'Sirius is the brightest star you can see at night. Ancient Egyptians used its rising to predict the Nile flood.',
      intuitive: 'Apparent magnitude -1.46. Binary companion (Sirius B) is a white dwarf, first to be discovered.',
      technical: 'Sirius B: 0.98 M☉ packed into Earth-size, proving extreme density of white dwarfs.',
    },
    nearbyObjects: ['sun', 'white-dwarf'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: false,
  },
]

const STELLAR_REMNANTS: CosmicObject[] = [
  {
    id: 'white-dwarf',
    name: 'White Dwarf',
    category: 'stellar-remnants',
    logRadius: 8.8,
    logMass: 33.1,
    radius: { value: 6000, unit: 'km', formatted: '~Earth radius' },
    mass: { value: 0.6, unit: 'M☉', formatted: '~0.6 M☉' },
    tagline: 'A dead star the size of Earth but the mass of the Sun',
    description: 'White dwarfs are dead star cores, supported by electron degeneracy pressure. A teaspoon would weigh 5 tonnes.',
    whyThisSize: 'Electron degeneracy halts collapse. Maximum mass (Chandrasekhar limit, 1.4 M☉) fixes the size near Earth.',
    explanations: {
      accessible: 'White dwarfs are dead star cores – so dense a spoonful weighs as much as an elephant.',
      intuitive: 'Electron degeneracy: Pauli exclusion prevents electrons from same state. Mass-radius: R ∝ M⁻¹/³.',
      technical: 'Chandrasekhar limit: at M > 1.4 M☉, electrons become relativistic → collapse.',
      advanced: 'WD seismology: g-mode pulsations probe interior. Crystallization causes cooling delay.',
    },
    nearbyObjects: ['neutron-star', 'earth'],
    relatedBoundaries: ['schwarzschild'],
    relatedEpochs: ['now'],
    notable: true,
  },
  {
    id: 'neutron-star',
    name: 'Neutron Star',
    category: 'stellar-remnants',
    logRadius: 6,
    logMass: 33.45,
    radius: { value: 10, unit: 'km', formatted: '~10-15 km' },
    mass: { value: 1.4, unit: 'M☉', formatted: '~1.4-2 M☉' },
    tagline: 'A city-sized star with density beyond imagination',
    description: 'Neutron stars are collapsed cores of massive stars. A sugar cube would weigh a billion tonnes.',
    whyThisSize: 'Core collapse overcomes electron degeneracy. Neutron degeneracy supports the star. Maximum mass ~2 M☉.',
    explanations: {
      accessible: 'Neutron stars pack the Sun mass into a city-sized ball. A teaspoon weighs billions of tonnes.',
      intuitive: 'Formation: core collapse supernova. Central density ~10¹⁵ g/cm³ (nuclear density).',
      technical: 'Equation of state uncertain. Mass-radius observations constrain EOS. TOV limit ~2.2 M☉.',
      advanced: 'Interior may contain hyperons or deconfined quarks. Color superconductivity possible.',
    },
    nearbyObjects: ['white-dwarf', 'stellar-bh'],
    relatedBoundaries: ['schwarzschild', 'compton'],
    relatedEpochs: ['now'],
    discovered: { year: 1967, by: 'Jocelyn Bell Burnell', how: 'Radio pulsar discovery' },
    notable: true,
  },
]

const BLACK_HOLES: CosmicObject[] = [
  {
    id: 'stellar-bh',
    name: 'Stellar Mass Black Hole',
    category: 'black-holes',
    logRadius: 6.4,
    logMass: 34.3,
    radius: { value: 30, unit: 'km', formatted: '~30 km (horizon)' },
    mass: { value: 10, unit: 'M☉', formatted: '~5-50 M☉' },
    tagline: 'Dead massive stars collapsed beyond the point of no return',
    description: 'Stellar black holes form when massive stars (>~25 M☉) die. A 10 M☉ black hole has a horizon just 30 km across.',
    whyThisSize: 'Event horizon R_s = 2GM/c² scales linearly with mass: 3 km per solar mass.',
    explanations: {
      accessible: 'When the biggest stars die, gravity wins completely. The core collapses into a point from which nothing can escape.',
      intuitive: 'Event horizon: surface where escape velocity = c. Hawking radiation: BHs slowly evaporate, but would take 10⁶⁷ years.',
      technical: 'LIGO detects BH-BH mergers. First detection (GW150914): 36 + 29 → 62 M☉ BH.',
      advanced: 'No-hair theorem: Kerr-Newman family characterized by M, J, Q only. Information paradox unresolved.',
    },
    nearbyObjects: ['neutron-star', 'sagittarius-a'],
    relatedBoundaries: ['schwarzschild'],
    relatedEpochs: ['now'],
    notable: true,
  },
  {
    id: 'sagittarius-a',
    name: 'Sagittarius A*',
    category: 'black-holes',
    logRadius: 12.1,
    logMass: 39.8,
    radius: { value: 12, unit: 'million km', formatted: '~12 million km' },
    mass: { value: 4, unit: 'million M☉', formatted: '4 × 10⁶ M☉' },
    tagline: 'The supermassive black hole at the heart of our galaxy',
    description: 'Sgr A* is 4 million times the Sun mass. In 2022, the Event Horizon Telescope imaged its shadow.',
    whyThisSize: 'SMBHs grow by accreting gas and merging with other black holes over billions of years.',
    explanations: {
      accessible: 'At the center of our galaxy sits a black hole 4 million times heavier than the Sun.',
      intuitive: 'S2 star orbit: period 16 yr, closest approach at 7,650 km/s (2.5% c). Nobel Prize 2020.',
      technical: 'EHT image (2022): ring diameter ~52 μas matches predicted shadow size for 4 million M☉.',
      advanced: 'Relatively low accretion: L ~ 10⁻⁸ L_Edd. GRAVITY instrument tests GR to unprecedented precision.',
    },
    nearbyObjects: ['stellar-bh', 'm87-bh', 'milky-way'],
    relatedBoundaries: ['schwarzschild'],
    relatedEpochs: ['now'],
    discovered: { year: 1974, by: 'Balick & Brown', how: 'Radio observations' },
    notable: true,
  },
  {
    id: 'm87-bh',
    name: 'M87* (First Imaged Black Hole)',
    category: 'black-holes',
    logRadius: 14.8,
    logMass: 42.8,
    radius: { value: 400, unit: 'AU', formatted: '~400 AU (larger than our solar system)' },
    mass: { value: 6.5, unit: 'billion M☉', formatted: '6.5 × 10⁹ M☉' },
    tagline: 'The first black hole ever directly imaged, in galaxy M87',
    description: 'M87* was the first black hole directly imaged (2019). Its event horizon is larger than our entire solar system.',
    whyThisSize: 'M87* is ~1,500× more massive than Sgr A*. Huge size and bright accretion disk made it ideal for EHT.',
    explanations: {
      accessible: 'In 2019, astronomers released the first picture of a black hole – M87*. Our solar system would fit inside it.',
      intuitive: 'EHT: Earth-sized virtual telescope. Resolution 20 μas – could read a newspaper in New York from Paris.',
      technical: 'M87 jet powered by Blandford-Znajek mechanism: frame dragging extracts rotational energy.',
    },
    nearbyObjects: ['sagittarius-a'],
    relatedBoundaries: ['schwarzschild'],
    relatedEpochs: ['now'],
    discovered: { year: 2019, by: 'Event Horizon Telescope', how: 'Radio interferometry imaging' },
    notable: true,
  },
]

const GALAXIES: CosmicObject[] = [
  {
    id: 'milky-way',
    name: 'Milky Way Galaxy',
    category: 'galaxies',
    logRadius: 22.7,
    logMass: 45,
    radius: { value: 100000, unit: 'light-years', formatted: '~100,000 ly' },
    mass: { value: 1.5, unit: 'trillion M☉', formatted: '~1.5 × 10¹² M☉' },
    tagline: 'Our home galaxy, a spiral of 200 billion stars',
    description: 'The Milky Way contains 200-400 billion stars. Our solar system is 26,000 light-years from the center.',
    whyThisSize: 'Galaxy sizes result from gravity, angular momentum, and feedback from star formation and black holes.',
    explanations: {
      accessible: 'The Milky Way is our galaxy – a vast pinwheel of stars appearing as a glowing band across the night sky.',
      intuitive: 'Flat rotation curve v ~ 220 km/s implies dark matter halo. Disk scale length ~3 kpc.',
      technical: 'Gaia mission: precise positions for ~2 billion stars. Phase-space reveals merger history.',
      advanced: 'Mass M_200 ~ 1-2 × 10¹² M☉. Baryon fraction ~5% (rest is dark matter).',
    },
    nearbyObjects: ['andromeda', 'sagittarius-a'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy (M31)',
    category: 'galaxies',
    logRadius: 23,
    logMass: 45.2,
    radius: { value: 220000, unit: 'light-years', formatted: '~220,000 ly' },
    mass: { value: 1, unit: 'trillion M☉', formatted: '~10¹² M☉' },
    tagline: 'Our nearest large galactic neighbor, approaching at 110 km/s',
    description: 'Andromeda is 2.5 million light-years away, visible to the naked eye. In 4 billion years, it will merge with the Milky Way.',
    whyThisSize: 'Slightly larger than the Milky Way – perhaps from earlier mergers.',
    explanations: {
      accessible: 'Andromeda is the most distant object visible to the naked eye. It is heading toward us.',
      intuitive: 'Blueshift: one of few galaxies moving toward us (local gravity overcomes cosmic expansion).',
      technical: 'M31* (central SMBH): ~10⁸ M☉, 25× larger than Sgr A*.',
    },
    nearbyObjects: ['milky-way'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: true,
  },
]

const LARGE_SCALE: CosmicObject[] = [
  {
    id: 'observable-universe',
    name: 'Observable Universe',
    category: 'large-scale-structure',
    logRadius: 28.1,
    logMass: 56,
    radius: { value: 46.5, unit: 'billion ly', formatted: '46.5 billion ly radius' },
    mass: { value: 10, unit: '⁵³ kg', formatted: '~10⁵³ kg visible matter' },
    tagline: 'Everything we can ever see – and it is not everything there is',
    description: 'The observable universe is a sphere containing everything light has had time to reach us since the Big Bang – about 93 billion light-years across.',
    whyThisSize: 'The 46.5 billion light-year radius reflects cosmic expansion: space stretched while light traveled toward us.',
    explanations: {
      accessible: 'The observable universe is everything we can see – but it is not everything that exists. Light from farther has not had time to reach us.',
      intuitive: 'Particle horizon: 46.5 Gly comoving radius. Why >13.8 Gly? Space expanded while light traveled.',
      technical: 'Comoving volume: 4 × 10⁸⁰ m³. Contains ~10⁵³ kg baryons, ~10⁸⁰ atoms.',
      advanced: 'Eternal inflation → multiverse: other bubble universes may exist beyond any observational possibility.',
    },
    nearbyObjects: ['hubble-radius', 'supercluster-laniakea'],
    relatedBoundaries: ['hubble'],
    relatedEpochs: ['recombination', 'now'],
    notable: true,
    labelOffset: { x: 0, y: 15 },
  },
  {
    id: 'hubble-radius',
    name: 'Hubble Radius',
    category: 'large-scale-structure',
    logRadius: 28,
    logMass: 55,
    radius: { value: 14.4, unit: 'billion ly', formatted: '14.4 billion ly' },
    mass: { value: 10, unit: '⁵² kg', formatted: '~10⁵² kg within' },
    tagline: 'The distance beyond which space expands faster than light',
    description: 'At the Hubble radius, recession velocity due to cosmic expansion equals the speed of light.',
    whyThisSize: 'R_H = c/H₀ ≈ 14.4 billion light-years. This is where cosmic expansion velocity equals c.',
    explanations: {
      accessible: 'Beyond the Hubble radius, galaxies are receding faster than light – but they have not broken any speed limit; space itself is stretching.',
      intuitive: 'Hubble law: v = H₀d. At d = c/H₀, v = c. This is today Hubble radius.',
      technical: 'Hubble radius is time-dependent: R_H(t) = c/H(t). In dark-energy era, R_H → constant.',
    },
    nearbyObjects: ['observable-universe'],
    relatedBoundaries: ['hubble'],
    relatedEpochs: ['now'],
    notable: true,
  },
  {
    id: 'virgo-cluster',
    name: 'Virgo Cluster',
    category: 'large-scale-structure',
    logRadius: 23.8,
    logMass: 47.2,
    radius: { value: 5, unit: 'million ly', formatted: '~5 million ly' },
    mass: { value: 1.2, unit: '×10¹⁵ M☉', formatted: '~1.2 × 10¹⁵ M☉' },
    tagline: 'The nearest large galaxy cluster – 1,300 galaxies strong',
    description: 'The Virgo Cluster is the heart of our local supercluster. The Milky Way is falling toward it at 200 km/s.',
    whyThisSize: 'Galaxy clusters form at density peaks in early universe. Virgo is relatively nearby (54 Mly).',
    explanations: {
      accessible: 'The Virgo Cluster contains over 1,000 galaxies. Our Milky Way is slowly falling toward it.',
      intuitive: 'M87 at center hosts 6.5 billion M☉ black hole (first imaged). Hot intracluster gas: 10-100 million K.',
      technical: 'Virial mass from galaxy velocities and X-ray gas temperature. Dark matter dominates.',
    },
    nearbyObjects: ['milky-way', 'andromeda', 'observable-universe'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    notable: false,
  },
  {
    id: 'laniakea',
    name: 'Laniakea Supercluster',
    category: 'large-scale-structure',
    logRadius: 24.7,
    logMass: 48,
    radius: { value: 250, unit: 'million ly', formatted: '~250 million ly' },
    mass: { value: 10, unit: '¹⁷ M☉', formatted: '~10¹⁷ M☉' },
    tagline: 'Our cosmic address – "immeasurable heaven" in Hawaiian',
    description: 'Laniakea is the supercluster containing the Milky Way. It includes 100,000 galaxies flowing toward the Great Attractor.',
    whyThisSize: 'Superclusters defined by gravitational flow patterns. Laniakea identified in 2014.',
    explanations: {
      accessible: 'Laniakea is our cosmic neighborhood – 100,000 galaxies all moving together through space.',
      intuitive: 'Great Attractor: gravitational anomaly our region flows toward. Hidden behind Milky Way plane.',
      technical: 'Defined by Tully et al. (2014) using peculiar velocity field. Boundary where flow diverges.',
    },
    nearbyObjects: ['virgo-cluster', 'observable-universe'],
    relatedBoundaries: [],
    relatedEpochs: ['now'],
    discovered: { year: 2014, by: 'Tully, Courtois et al.' },
    notable: true,
    labelOffset: { x: 0, y: 15 },
  },
]

const EXOTIC: CosmicObject[] = [
  {
    id: 'planck-mass',
    name: 'Planck Mass',
    category: 'exotic-theoretical',
    logRadius: -33,
    logMass: -5,
    radius: { value: 1.6, unit: '× 10⁻³⁵ m', formatted: '1.6 × 10⁻³⁵ m' },
    mass: { value: 22, unit: 'μg', formatted: '~22 μg' },
    tagline: 'Where quantum mechanics and gravity meet – the intersection point',
    description: 'The Planck mass is where the Compton wavelength equals the Schwarzschild radius – where QM and GR become equally important.',
    whyThisSize: 'Setting λ_Compton = R_Schwarzschild gives m_P = √(ℏc/G) ≈ 2.2 × 10⁻⁵ g.',
    explanations: {
      accessible: 'The Planck mass is about the mass of a grain of sand – big enough to almost see!',
      intuitive: 'Planck mass = √(ℏc/G) ≈ 22 μg ≈ 1.22 × 10¹⁹ GeV/c².',
      technical: 'Why is Planck mass big? Gravity is weak: G is small in natural units.',
      advanced: 'Black hole remnants at Planck mass could be dark matter. String theory natural scale.',
    },
    nearbyObjects: ['electron', 'proton'],
    relatedBoundaries: ['planck', 'schwarzschild', 'compton'],
    relatedEpochs: ['planck'],
    notable: true,
  },
]

// ===== COMBINED EXPORTS =====

export const COSMIC_OBJECTS: CosmicObject[] = [
  ...FUNDAMENTAL_PARTICLES,
  ...ATOMS_MOLECULES,
  ...VIRUSES_CELLS,
  ...MACROSCOPIC_LIFE,
  ...SOLAR_SYSTEM,
  ...STARS,
  ...STELLAR_REMNANTS,
  ...BLACK_HOLES,
  ...GALAXIES,
  ...LARGE_SCALE,
  ...EXOTIC,
]

// Lookup map for fast access
export const OBJECTS_MAP = new Map<string, CosmicObject>(
  COSMIC_OBJECTS.map(obj => [obj.id, obj])
)

// Helper functions
export function getObject(id: string): CosmicObject | undefined {
  return OBJECTS_MAP.get(id)
}

export function searchObjects(query: string): CosmicObject[] {
  const q = query.toLowerCase()
  return COSMIC_OBJECTS.filter(obj =>
    obj.name.toLowerCase().includes(q) ||
    obj.tagline.toLowerCase().includes(q) ||
    obj.description.toLowerCase().includes(q)
  )
}

// Category metadata
export const CATEGORIES: Record<ObjectCategory, CategoryMeta> = {
  'fundamental-particles': {
    id: 'fundamental-particles',
    name: 'Fundamental Particles',
    shortName: 'Fundamental',
    description: 'Quarks, leptons, gauge bosons',
    color: '#ff6b6b',
    icon: '⚛️',
    order: 1,
  },
  'composite-particles': {
    id: 'composite-particles',
    name: 'Composite Particles',
    shortName: 'Composite',
    description: 'Hadrons, mesons, baryons',
    color: '#f06595',
    icon: '🔴',
    order: 2,
  },
  'atoms-molecules': {
    id: 'atoms-molecules',
    name: 'Atoms & Molecules',
    shortName: 'Atoms',
    description: 'Elements and simple molecules',
    color: '#cc5de8',
    icon: '⚗️',
    order: 3,
  },
  'viruses-cells': {
    id: 'viruses-cells',
    name: 'Viruses & Cells',
    shortName: 'Cells',
    description: 'Biological structures',
    color: '#845ef7',
    icon: '🦠',
    order: 4,
  },
  'macroscopic-life': {
    id: 'macroscopic-life',
    name: 'Macroscopic Life',
    shortName: 'Life',
    description: 'Organisms',
    color: '#5c7cfa',
    icon: '🌱',
    order: 5,
  },
  'solar-system': {
    id: 'solar-system',
    name: 'Solar System',
    shortName: 'Solar',
    description: 'Planets, moons, asteroids',
    color: '#339af0',
    icon: '🪐',
    order: 6,
  },
  'stars': {
    id: 'stars',
    name: 'Stars',
    shortName: 'Stars',
    description: 'Main sequence and giant stars',
    color: '#22b8cf',
    icon: '⭐',
    order: 7,
  },
  'stellar-remnants': {
    id: 'stellar-remnants',
    name: 'Stellar Remnants',
    shortName: 'Remnants',
    description: 'White dwarfs, neutron stars',
    color: '#20c997',
    icon: '💫',
    order: 8,
  },
  'black-holes': {
    id: 'black-holes',
    name: 'Black Holes',
    shortName: 'Black Holes',
    description: 'Schwarzschild and Kerr black holes',
    color: '#51cf66',
    icon: '🌀',
    order: 9,
  },
  'stellar-structures': {
    id: 'stellar-structures',
    name: 'Stellar Structures',
    shortName: 'Structures',
    description: 'Star clusters, nebulae',
    color: '#94d82d',
    icon: '🌌',
    order: 10,
  },
  'galaxies': {
    id: 'galaxies',
    name: 'Galaxies',
    shortName: 'Galaxies',
    description: 'Spiral, elliptical, irregular',
    color: '#ffd43b',
    icon: '🌠',
    order: 11,
  },
  'large-scale-structure': {
    id: 'large-scale-structure',
    name: 'Large-Scale Structure',
    shortName: 'Cosmic',
    description: 'Filaments, voids, observable universe',
    color: '#ff922b',
    icon: '🔭',
    order: 12,
  },
  'exotic-theoretical': {
    id: 'exotic-theoretical',
    name: 'Exotic & Theoretical',
    shortName: 'Exotic',
    description: 'Hypothetical objects and limits',
    color: '#ff6b6b',
    icon: '❓',
    order: 13,
  },
}
