'use client';

import { useState, useEffect, useRef } from 'react';
import ParallaxVisualization from './ParallaxVisualization';
import CepheidVisualization from './CepheidVisualization';
import SupernovaVisualization from './SupernovaVisualization';
import HubbleVisualization from './HubbleVisualization';
import {
  ParallaxStar,
  Cepheid,
  PLRelation,
  Supernova,
  HubbleDiagram,
  RedshiftSpectrum,
  RUNG_COLORS,
} from '../lib/types';

// Define the content for each rung
const RUNGS = [
  {
    id: 'parallax',
    number: 1,
    title: 'Parallax',
    subtitle: 'The Foundation (0 - 1,000 light years)',
    color: RUNG_COLORS.parallax,
    steps: [
      {
        id: 'parallax-intro',
        title: 'The Simplest Measurement',
        content: `Hold your thumb at arm's length. Close one eye, then the other. Your thumb appears to shift against the background. This is parallax — and it's the only way we can directly measure distance to the stars.`,
      },
      {
        id: 'parallax-concept',
        title: 'Earth as a Baseline',
        content: `As Earth orbits the Sun, nearby stars appear to shift against distant background stars. The closer the star, the larger the shift. A star with a parallax of 1 arcsecond is exactly 1 parsec (3.26 light years) away.`,
      },
      {
        id: 'parallax-measure',
        title: 'Watching Stars Wobble',
        content: `For six months, we watch. A star's apparent position traces out a tiny ellipse — the mirror of Earth's orbit around the Sun. The angular size of that ellipse tells us the star's distance with geometry alone.`,
      },
      {
        id: 'parallax-stars',
        title: 'Our Nearest Neighbors',
        content: `Proxima Centauri shows a parallax of 0.77 arcseconds — making it 4.24 light years away. Even with the Gaia spacecraft measuring parallaxes to 10 micro-arcseconds, this method fails beyond about 10,000 light years. We need another rung.`,
      },
    ],
  },
  {
    id: 'cepheid',
    number: 2,
    title: 'Cepheid Variables',
    subtitle: 'The First Standard Candle (1,000 - 100 million light years)',
    color: RUNG_COLORS.cepheid,
    steps: [
      {
        id: 'cepheid-intro',
        title: 'Stars That Breathe',
        content: `In 1908, Henrietta Swan Leavitt noticed something remarkable: certain pulsating stars in the Magellanic Clouds had a pattern. The brighter ones pulsed more slowly.`,
      },
      {
        id: 'cepheid-pulsate',
        title: 'Cepheid Pulsation',
        content: `Cepheid variables are stellar giants that literally pulse — expanding and contracting over days to weeks. Their atmospheres heat and cool, and their brightness rises and falls like cosmic heartbeats.`,
      },
      {
        id: 'cepheid-pl',
        title: 'The Period-Luminosity Relation',
        content: `Measure a Cepheid's period, and you know its true brightness. Compare that to how bright it appears, and you get distance. This "standard candle" principle extends our reach to tens of millions of light years.`,
      },
      {
        id: 'cepheid-calibrate',
        title: 'Calibrating the Candles',
        content: `But how do we know Cepheids' true brightness? By measuring parallaxes to the nearest Cepheids in our galaxy. The first rung of the ladder supports the second. Each measurement depends on what came before.`,
      },
    ],
  },
  {
    id: 'supernova',
    number: 3,
    title: 'Type Ia Supernovae',
    subtitle: 'Cosmic Explosions (100 million - 10 billion light years)',
    color: RUNG_COLORS.supernova,
    steps: [
      {
        id: 'sn-intro',
        title: 'The Brightest Explosions',
        content: `When a white dwarf accretes enough matter from a companion star to exceed 1.4 solar masses, it explodes in a thermonuclear detonation visible across cosmological distances. For a few weeks, a single star outshines its entire galaxy.`,
      },
      {
        id: 'sn-explode',
        title: 'A Standard Explosion',
        content: `Because all Type Ia supernovae explode at nearly the same mass, they reach nearly the same peak brightness — about 5 billion times the Sun. They are "standardizable candles" that we can calibrate using galaxies where we've already found Cepheids.`,
      },
      {
        id: 'sn-lightcurve',
        title: 'Light Curve Shape',
        content: `Not all Type Ia supernovae are identical. Brighter ones decline more slowly. By measuring the shape of the light curve, we can correct for this variation and standardize the peak brightness.`,
      },
      {
        id: 'sn-hubble',
        title: 'Reaching Across the Universe',
        content: `With Type Ia supernovae, we can measure distances to galaxies billions of light years away. In 1998, this method revealed that the universe's expansion is accelerating — earning the Nobel Prize and discovering dark energy.`,
      },
    ],
  },
  {
    id: 'hubble',
    number: 4,
    title: 'The Hubble Flow',
    subtitle: 'Redshift and Expansion (Billions of light years)',
    color: RUNG_COLORS.hubble,
    steps: [
      {
        id: 'hubble-intro',
        title: 'The Expanding Universe',
        content: `At the largest scales, the universe itself is expanding. Galaxies aren't moving through space — space itself is stretching, carrying galaxies apart. Farther galaxies recede faster.`,
      },
      {
        id: 'hubble-redshift',
        title: 'Light Stretched by Expansion',
        content: `As light travels through expanding space, its wavelength stretches. Blue light shifts toward red. The farther light has traveled, the more it's stretched — the higher the "redshift."`,
      },
      {
        id: 'hubble-spectrum',
        title: 'Reading the Redshift',
        content: `We recognize spectral lines — hydrogen, calcium, oxygen — shifted to longer wavelengths. A galaxy with z = 1 has had its light stretched by a factor of 2 — it was emitted when the universe was half its current size.`,
      },
      {
        id: 'hubble-law',
        title: 'Hubble\'s Law',
        content: `Velocity = H₀ × Distance. Edwin Hubble discovered this linear relationship in 1929. The Hubble constant H₀ tells us the expansion rate of the universe — currently about 70 km/s per megaparsec.`,
      },
      {
        id: 'hubble-tension',
        title: 'The Hubble Tension',
        content: `Here's the puzzle: measuring H₀ from the distance ladder gives ~73 km/s/Mpc. But calculating it from the cosmic microwave background gives ~67 km/s/Mpc. This 4.4σ discrepancy — the "Hubble tension" — hints that something about our understanding of the universe may be incomplete.`,
      },
    ],
  },
];

export default function DistanceLadderExplorer() {
  // Data state
  const [parallaxStars, setParallaxStars] = useState<ParallaxStar[]>([]);
  const [cepheids, setCepheids] = useState<Cepheid[]>([]);
  const [plRelation, setPLRelation] = useState<PLRelation | null>(null);
  const [supernovae, setSupernovae] = useState<Supernova[]>([]);
  const [hubbleData, setHubbleData] = useState<HubbleDiagram | null>(null);
  const [spectrumData, setSpectrumData] = useState<RedshiftSpectrum | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll state
  const [activeRung, setActiveRung] = useState(1);
  const [activeStep, setActiveStep] = useState('parallax-intro');
  const stepRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const [parallaxRes, cepheidsRes, plRes, snRes, hubbleRes, spectrumRes] = await Promise.all([
          fetch('/data/distance-ladder/parallax_stars.json'),
          fetch('/data/distance-ladder/cepheids.json'),
          fetch('/data/distance-ladder/pl_relation.json'),
          fetch('/data/distance-ladder/supernovae.json'),
          fetch('/data/distance-ladder/hubble_diagram.json'),
          fetch('/data/distance-ladder/redshift_spectrum.json'),
        ]);

        setParallaxStars(await parallaxRes.json());
        setCepheids(await cepheidsRes.json());
        setPLRelation(await plRes.json());
        setSupernovae(await snRes.json());
        setHubbleData(await hubbleRes.json());
        setSpectrumData(await spectrumRes.json());
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading distance ladder data:', error);
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Intersection observer for scroll tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const stepId = entry.target.id;
            setActiveStep(stepId);

            // Determine rung from step
            if (stepId.startsWith('parallax')) setActiveRung(1);
            else if (stepId.startsWith('cepheid')) setActiveRung(2);
            else if (stepId.startsWith('sn')) setActiveRung(3);
            else if (stepId.startsWith('hubble')) setActiveRung(4);
          }
        }
      },
      {
        threshold: [0.5],
        rootMargin: '-20% 0px -20% 0px',
      }
    );

    // Observe all step elements
    stepRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='text-white/50'>Loading cosmic data...</div>
      </div>
    );
  }

  return (
    <div className='relative'>
      {/* Progress indicator */}
      <div className='fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block'>
        <div className='flex flex-col gap-4'>
          {RUNGS.map((rung) => (
            <button
              key={rung.id}
              onClick={() => {
                const firstStep = rung.steps[0].id;
                const element = stepRefs.current.get(firstStep);
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className='group flex items-center gap-3'
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  activeRung === rung.number
                    ? 'scale-125'
                    : 'scale-100 opacity-50 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeRung === rung.number ? rung.color : 'transparent',
                  border: `2px solid ${rung.color}`,
                }}
              >
                {rung.number}
              </div>
              <span
                className={`text-xs font-mono uppercase tracking-wider transition-opacity ${
                  activeRung === rung.number ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                }`}
                style={{ color: rung.color }}
              >
                {rung.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      {RUNGS.map((rung) => (
        <section key={rung.id} className='relative'>
          {/* Rung header */}
          <div
            className='sticky top-0 z-40 py-4 px-4 md:px-8 lg:px-12 border-b'
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              borderColor: rung.color + '30',
            }}
          >
            <div className='flex items-center gap-4'>
              <div
                className='w-10 h-10 rounded-full flex items-center justify-center font-bold'
                style={{
                  backgroundColor: rung.color,
                }}
              >
                {rung.number}
              </div>
              <div>
                <h2 className='text-xl md:text-2xl font-bold tracking-tight'>
                  Rung {rung.number}: {rung.title}
                </h2>
                <p className='text-sm text-white/50'>{rung.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Scrollytelling section */}
          <div className='grid grid-cols-1 lg:grid-cols-2 min-h-screen'>
            {/* Sticky visualization panel */}
            <div className='order-2 lg:order-1 lg:sticky lg:top-20 h-[50vh] lg:h-[calc(100vh-80px)] bg-[#0A0A0F]'>
              <div className='w-full h-full p-4'>
                {rung.id === 'parallax' && (
                  <ParallaxVisualization
                    stars={parallaxStars}
                    activeStep={activeStep}
                  />
                )}
                {rung.id === 'cepheid' && plRelation && (
                  <CepheidVisualization
                    cepheids={cepheids}
                    plRelation={plRelation}
                    activeStep={activeStep}
                  />
                )}
                {rung.id === 'supernova' && (
                  <SupernovaVisualization
                    supernovae={supernovae}
                    activeStep={activeStep}
                  />
                )}
                {rung.id === 'hubble' && hubbleData && spectrumData && (
                  <HubbleVisualization
                    hubbleData={hubbleData}
                    spectrumData={spectrumData}
                    activeStep={activeStep}
                  />
                )}
              </div>
            </div>

            {/* Scrolling text content */}
            <div className='order-1 lg:order-2 px-4 md:px-8 lg:px-12 py-16'>
              {rung.steps.map((step, index) => (
                <div
                  key={step.id}
                  id={step.id}
                  ref={(el) => {
                    if (el) stepRefs.current.set(step.id, el);
                  }}
                  className='min-h-[60vh] flex flex-col justify-center py-12'
                >
                  <div
                    className={`transition-opacity duration-500 ${
                      activeStep === step.id ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <span
                      className='text-xs font-mono uppercase tracking-wider mb-2 block'
                      style={{ color: rung.color }}
                    >
                      {index + 1} / {rung.steps.length}
                    </span>
                    <h3 className='text-2xl md:text-3xl font-bold tracking-tight mb-4'>
                      {step.title}
                    </h3>
                    <p className='text-white/70 leading-relaxed text-lg'>
                      {step.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connection to next rung */}
          {rung.number < 4 && (
            <div className='py-16 px-4 md:px-8 lg:px-12 text-center'>
              <div className='inline-flex flex-col items-center gap-4'>
                <div className='w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent' />
                <p className='text-white/50 text-sm max-w-md'>
                  {rung.number === 1 &&
                    'But parallax only reaches ~10,000 light years. To go further, we need a new method...'}
                  {rung.number === 2 &&
                    'Cepheids can reach 100 million light years. But the universe is vast — we need something brighter...'}
                  {rung.number === 3 &&
                    'Supernovae reach billions of light years. At these scales, the universe itself reveals its expansion...'}
                </p>
                <div className='w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent' />
              </div>
            </div>
          )}
        </section>
      ))}

      {/* Distance scale summary */}
      <section className='py-16 px-4 md:px-8 lg:px-12 bg-[#0A0A0F]'>
        <h2 className='text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center'>
          The Complete Ladder
        </h2>
        <div className='flex flex-col md:flex-row items-stretch justify-center gap-4 max-w-4xl mx-auto'>
          {RUNGS.map((rung, index) => (
            <div
              key={rung.id}
              className='flex-1 p-4 rounded-lg border text-center'
              style={{
                borderColor: rung.color + '50',
                backgroundColor: rung.color + '10',
              }}
            >
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto mb-2'
                style={{ backgroundColor: rung.color }}
              >
                {rung.number}
              </div>
              <h3 className='font-bold mb-1'>{rung.title}</h3>
              <p className='text-xs text-white/50'>
                {index === 0 && '< 1,000 ly'}
                {index === 1 && '< 100 Mly'}
                {index === 2 && '< 10 Gly'}
                {index === 3 && '> 10 Gly'}
              </p>
            </div>
          ))}
        </div>

        <p className='text-center text-white/50 text-sm mt-8 max-w-2xl mx-auto'>
          Each rung depends on the one below it. Error in any measurement propagates upward.
          This is why the Hubble tension matters — if there&apos;s a systematic error anywhere
          in the ladder, it affects our entire understanding of cosmic distances.
        </p>
      </section>
    </div>
  );
}
