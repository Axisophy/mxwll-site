export interface PlanetData {
  id: string
  name: string
  diameter: number // km
  distanceFromSun: number // million km
  fact: string
  description: string
  funComparison: string
}

export const SOLAR_SYSTEM: PlanetData[] = [
  {
    id: 'sun',
    name: 'The Sun',
    diameter: 1392700,
    distanceFromSun: 0,
    fact: 'The Sun contains 99.86% of all mass in the solar system.',
    description: 'A medium-sized star, 4.6 billion years old. Will burn for another 5 billion.',
    funComparison: '1.3 million Earths would fit inside',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    diameter: 4879,
    distanceFromSun: 57.9,
    fact: 'A day on Mercury (sunrise to sunrise) lasts 176 Earth days.',
    description: 'The smallest planet. Barely larger than our Moon.',
    funComparison: 'Only slightly larger than Earth\'s Moon',
  },
  {
    id: 'venus',
    name: 'Venus',
    diameter: 12104,
    distanceFromSun: 108.2,
    fact: 'Venus spins backwards. The Sun rises in the west.',
    description: 'Earth\'s twin in size. An inferno in every other way.',
    funComparison: 'Almost identical to Earth in size',
  },
  {
    id: 'earth',
    name: 'Earth',
    diameter: 12756,
    distanceFromSun: 149.6,
    fact: 'The only known place in the universe with life.',
    description: 'Our home. The reference point for everything else here.',
    funComparison: 'You are here',
  },
  {
    id: 'moon',
    name: 'The Moon',
    diameter: 3475,
    distanceFromSun: 149.6,
    fact: 'The Moon is slowly drifting away from Earth - 3.8 cm per year.',
    description: 'Earth\'s companion. The only other world humans have visited.',
    funComparison: '49 Moons would fit inside Earth',
  },
  {
    id: 'mars',
    name: 'Mars',
    diameter: 6792,
    distanceFromSun: 228.0,
    fact: 'Mars has the tallest volcano in the solar system - Olympus Mons, 21 km high.',
    description: 'The Red Planet. Half the size of Earth.',
    funComparison: 'About half Earth\'s diameter',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    diameter: 142984,
    distanceFromSun: 778.5,
    fact: 'Jupiter\'s Great Red Spot is a storm wider than Earth.',
    description: 'The king. More massive than all other planets combined.',
    funComparison: '1,321 Earths would fit inside',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    diameter: 120536,
    distanceFromSun: 1432.0,
    fact: 'Saturn\'s rings span 282,000 km but are only about 10 metres thick.',
    description: 'The ringed planet. Less dense than water.',
    funComparison: '764 Earths would fit inside',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    diameter: 51118,
    distanceFromSun: 2867.0,
    fact: 'Uranus is tilted 98 degrees - it essentially rolls around the Sun on its side.',
    description: 'The ice giant. Knocked sideways by an ancient collision.',
    funComparison: '63 Earths would fit inside',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    diameter: 49528,
    distanceFromSun: 4515.0,
    fact: 'Neptune has the strongest winds in the solar system - up to 2,100 km/h.',
    description: 'The most distant planet. Cold, blue, and windswept.',
    funComparison: '58 Earths would fit inside',
  },
]

// Jupiter fills this fraction of viewport height - everything else scales from that
export const REFERENCE_DIAMETER = 142984 // Jupiter
export const REFERENCE_FILL = 0.55
