import { MissionPhase } from './types';

export const ARTEMIS_PHASES: MissionPhase[] = [
  {
    id: 'launch',
    name: 'Launch & Earth Departure',
    duration: '~2 hours',
    deltaV: 3.1,
    description: 'SLS launches Orion into a parking orbit, then performs trans-lunar injection.',
    details: 'The Space Launch System\'s powerful upper stage fires for about 18 minutes, accelerating Orion from 28,000 km/h to over 39,000 km/h \u2014 fast enough to escape Earth\'s gravitational grip and coast toward the Moon.',
  },
  {
    id: 'tli',
    name: 'Trans-Lunar Injection',
    duration: '18 minutes',
    deltaV: 3.1,
    description: 'The critical burn that sends Orion toward the Moon.',
    details: 'This is the Hohmann transfer\'s first burn. By firing at the lowest point of the orbit (periapsis), we get maximum efficiency \u2014 the Oberth effect means each unit of fuel provides more velocity change when you\'re already moving fast.',
  },
  {
    id: 'coast',
    name: 'Outbound Coast',
    duration: '~4 days',
    description: 'Orion falls upward toward the Moon, engines off.',
    details: 'No fuel is burned during coast. The spacecraft trades kinetic energy for potential energy as it climbs out of Earth\'s gravity well. Speed drops from 39,000 km/h to about 3,200 km/h at the Moon.',
  },
  {
    id: 'loi',
    name: 'Lunar Orbit Insertion',
    duration: '~6 minutes',
    deltaV: 0.9,
    description: 'Orion fires its engine to slow down and be captured by the Moon.',
    details: 'The Hohmann transfer\'s second burn. Firing retrograde at the Moon\'s closest approach bleeds off velocity, dropping Orion into lunar orbit. Miss this burn, and you swing past the Moon and back toward Earth.',
  },
  {
    id: 'nrho',
    name: 'Near-Rectilinear Halo Orbit',
    duration: '6-12 days',
    description: 'Orion enters a distant retrograde orbit around the Moon.',
    details: 'Artemis uses a special orbit that balances stability, fuel efficiency, and communication with Earth. The orbit is highly elliptical, ranging from 1,500 km to 70,000 km from the lunar surface.',
  },
  {
    id: 'return',
    name: 'Return & Entry',
    duration: '~4 days',
    deltaV: 0.3,
    description: 'Orion departs lunar orbit and returns to Earth.',
    details: 'A small burn sends Orion back toward Earth. Re-entry occurs at 40,000 km/h \u2014 the fastest any human-rated spacecraft will travel. The heat shield experiences temperatures of 2,760\u00B0C.',
  },
];

export const APOLLO_PHASES: MissionPhase[] = [
  {
    id: 'launch',
    name: 'Launch to Parking Orbit',
    duration: '12 minutes',
    deltaV: 9.5,
    description: 'Saturn V places Apollo into Earth orbit.',
    details: 'Three stages lift the spacecraft to a 185 km circular orbit. The crew has about 2.5 hours to check systems before committing to the Moon.',
  },
  {
    id: 'tli',
    name: 'Trans-Lunar Injection',
    duration: '6 minutes',
    deltaV: 3.1,
    description: 'S-IVB third stage fires to send Apollo moonward.',
    details: 'The single J-2 engine fires, accelerating Apollo to 10.8 km/s. After this burn, the S-IVB is jettisoned and the CSM extracts the LM from its housing.',
  },
  {
    id: 'coast',
    name: 'Translunar Coast',
    duration: '~3 days',
    description: 'Free-fall trajectory to the Moon.',
    details: 'Midcourse corrections are performed if needed, but typically the trajectory is precise enough to require minimal adjustment. Crew performs systems checks and rest.',
  },
  {
    id: 'loi',
    name: 'Lunar Orbit Insertion',
    duration: '6 minutes',
    deltaV: 0.9,
    description: 'Service Module engine fires to enter lunar orbit.',
    details: 'The SPS engine fires behind the Moon, out of contact with Earth. When Apollo emerges, Mission Control knows the burn succeeded. Initial orbit is 110 \u00D7 315 km.',
  },
  {
    id: 'descent',
    name: 'Powered Descent',
    duration: '12 minutes',
    deltaV: 1.9,
    description: 'LM descends from lunar orbit to the surface.',
    details: 'The descent engine fires continuously, using throttle control and guidance to navigate to the landing site. The final 100 meters are flown manually by the commander.',
  },
];
