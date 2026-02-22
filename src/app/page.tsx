import WorkCard from '@/components/WorkCard'

// Sample work data - will be replaced with CMS/database later
const featuredWork = [
  {
    title: 'Lorenz Attractor Visualisation',
    description: 'An interactive exploration of chaotic systems through the classic Lorenz attractor, rendered in real-time with WebGL.',
    category: 'VISUALISER',
    year: '2026',
    slug: 'lorenz-attractor',
    thumbnail: '/work/lorenz-preview.jpg',
  },
  {
    title: 'Quantum Mechanics Visual Guide',
    description: 'Making quantum mechanics comprehensible through systematic illustration and interactive visualisation.',
    category: 'ILLUSTRATION',
    year: '2025',
    slug: 'quantum-guide',
    thumbnail: '/work/quantum-preview.jpg',
  },
]

const recentWork = [
  {
    title: 'Reaction-Diffusion Systems',
    description: 'Exploring pattern formation in nature through simulation.',
    category: 'VISUALISER',
    year: '2026',
    slug: 'reaction-diffusion',
  },
  {
    title: 'Cosmic Microwave Background',
    description: 'Visualising the oldest light in the universe.',
    category: 'ILLUSTRATION',
    year: '2025',
    slug: 'cmb',
  },
  {
    title: 'HR Diagram Interactive',
    description: 'Exploring stellar evolution through data visualisation.',
    category: 'VISUALISER',
    year: '2025',
    slug: 'hr-diagram',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          A digital laboratory for science, maths, and explanation design
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl">
          We make complex things visible - through interactive visualisation, illustration, and systematic design.
        </p>
      </section>

      {/* Featured Work */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 gap-px">
          {featuredWork.map((work) => (
            <WorkCard key={work.slug} {...work} featured />
          ))}
        </div>
      </section>

      {/* Recent Work */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
          Recent Work
        </h2>

        <div className="grid grid-cols-1 gap-px">
          {recentWork.map((work) => (
            <WorkCard key={work.slug} {...work} />
          ))}
        </div>

        <div className="mt-12">
          <a href="/work" className="btn">
            View All Work
          </a>
        </div>
      </section>

      {/* Methodology Teaser */}
      <section className="px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12">
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Explanation Design
          </h2>
          <div className="space-y-4">
            <p className="font-serif text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
              Making complex things comprehensible requires more than simplification.
              It requires building the right mental models, in the right sequence,
              with the right level of detail.
            </p>
            <p className="font-serif text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
              Through systematic design, interactive visualisation, and precise
              illustration, we create experiences that help people genuinely understand
              difficult concepts.
            </p>
            <div className="pt-4">
              <a href="/method" className="btn">
                Our Method
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
