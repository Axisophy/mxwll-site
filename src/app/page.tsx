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
    <div className="min-h-screen">
      {/* Featured Work Section */}
      <section className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredWork.map((work) => (
            <WorkCard key={work.slug} {...work} featured />
          ))}
        </div>
      </section>

      {/* Recent Work Grid */}
      <section className="container py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-medium mb-3">Recent Work</h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
            A selection of visualisers, illustrations, and systematic design projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentWork.map((work) => (
            <WorkCard key={work.slug} {...work} />
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <a
            href="/work"
            className="inline-block btn text-base px-8 py-3"
          >
            View All Work
          </a>
        </div>
      </section>

      {/* Methodology Teaser */}
      <section className="container py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-medium mb-6">Explanation Design</h2>
          <div className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed space-y-4">
            <p>
              Making complex things comprehensible requires more than simplification.
              It requires building the right mental models, in the right sequence,
              with the right level of detail.
            </p>
            <p>
              Through systematic design, interactive visualisation, and precise
              illustration, we create experiences that help people genuinely understand
              difficult concepts.
            </p>
          </div>
          <div className="mt-8">
            <a href="/method" className="btn text-base px-8 py-3">
              Our Method
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
