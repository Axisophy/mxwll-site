import { Metadata } from 'next';
import GravitationalWaveExplorer from './components/GravitationalWaveExplorer';

export const metadata: Metadata = {
  title: 'The Chirp \u2014 Bang Industries',
  description: 'How LIGO found a whisper from 1.3 billion years ago. An interactive recreation of the discovery of gravitational waves.',
  alternates: {
    canonical: 'https://bangindustries.co/work/gravitational-wave',
  },
};

export default function GravitationalWavePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero section */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]">
          The Chirp
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-4">
          How LIGO found a whisper from 1.3 billion years ago
        </p>
        <p className="text-base text-white/50 max-w-3xl mt-8 leading-relaxed">
          On 14 September 2015, two black holes collided 1.3 billion light-years away.
          The collision was so violent it radiated more energy in 0.2 seconds than all
          the stars in the observable universe combined. LIGO caught it &mdash; barely. This
          interactive recreates the moment of discovery.
        </p>
        <div className="flex flex-wrap gap-2 mt-8">
          {['Interactive Visualisation', 'Scientific Data', 'WebAudio', 'Astronomy'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs bg-white/5 text-white/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Interactive visualisation */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="border border-white/10 bg-[#050508] overflow-hidden">
          <div className="aspect-[16/10]">
            <GravitationalWaveExplorer className="w-full h-full" />
          </div>
        </div>
        <p className="text-xs md:text-sm text-white/30 mt-4">
          Progress through the four stages to discover how LIGO detected GW150914. Drag the timeline to explore the signal.
        </p>
      </section>

      {/* Content section */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-[3fr_7fr] gap-12 lg:gap-16">
          {/* Metadata sidebar */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/30 mb-2">
                Category
              </h3>
              <p className="text-sm text-white/70">Scientific Data Visualisation</p>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/30 mb-2">
                Audience
              </h3>
              <p className="text-sm text-white/70">General / Science-curious</p>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/30 mb-2">
                Approach
              </h3>
              <p className="text-sm text-white/70">Progressive revelation, multi-representation</p>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/30 mb-2">
                Technology
              </h3>
              <p className="text-sm text-white/70">Canvas2D, WebAudio API, GWOSC Data</p>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/30 mb-2">
                Data Source
              </h3>
              <p className="text-sm text-white/70">
                <a href="https://gwosc.org" className="hover:text-white transition-colors">
                  Gravitational Wave Open Science Center
                </a>
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                The Challenge
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  Gravitational waves stretch and squeeze space itself, but by impossibly small amounts.
                  When GW150914 reached Earth, it changed the length of LIGO&apos;s 4-kilometre laser arms
                  by less than one-thousandth the diameter of a proton.
                </p>
                <p>
                  The raw detector data looks like random noise. You genuinely cannot see the signal
                  by eye. So how did LIGO find it?
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                Matched Filtering
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  LIGO uses a technique called matched filtering. Einstein&apos;s equations predict exactly
                  what a gravitational wave should look like for any given pair of merging black holes.
                  The characteristic &ldquo;chirp&rdquo; &mdash; a signal that sweeps up in frequency and amplitude &mdash;
                  has a precise mathematical form.
                </p>
                <p>
                  By sliding this predicted template across the noisy data and looking for correlations,
                  LIGO can extract signals buried deep in the noise. The match for GW150914 was so strong
                  that the probability of it happening by chance was less than 1 in 200,000 years of data.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                The Event
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  Two black holes, 36 and 29 times the mass of our Sun, had been spiralling toward
                  each other for millions of years. In the final fraction of a second, they were
                  orbiting each other at nearly half the speed of light, completing dozens of orbits
                  per second before merging into a single black hole of 62 solar masses.
                </p>
                <p>
                  Three solar masses of energy &mdash; more than 10<sup>47</sup> joules &mdash; was radiated away as
                  gravitational waves. For a brief moment, this event released more power than all the
                  stars in the observable universe combined.
                </p>
                <p>
                  The wave then travelled for 1.3 billion years, stretching with the expansion of
                  the universe, before finally reaching Earth on 14 September 2015.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
                Further Exploration
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://gwosc.org/GW150914data/"
                      className="text-[var(--color-blue)] hover:text-white transition-colors"
                    >
                      GW150914 Data Release
                    </a>
                    <span className="text-white/40"> &mdash; Original strain data and analysis notebooks</span>
                  </li>
                  <li>
                    <a
                      href="https://arxiv.org/abs/1602.03837"
                      className="text-[var(--color-blue)] hover:text-white transition-colors"
                    >
                      Discovery Paper (arXiv)
                    </a>
                    <span className="text-white/40"> &mdash; &ldquo;Observation of Gravitational Waves from a Binary Black Hole Merger&rdquo;</span>
                  </li>
                  <li>
                    <a
                      href="https://www.ligo.org/science/GW-Sensitivity.php"
                      className="text-[var(--color-blue)] hover:text-white transition-colors"
                    >
                      LIGO Sensitivity
                    </a>
                    <span className="text-white/40"> &mdash; How LIGO achieves sub-atomic precision</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
