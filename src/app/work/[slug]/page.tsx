import { notFound } from 'next/navigation'
import Link from 'next/link'

// Sample work data - will be replaced with CMS/database later
const workData: Record<string, any> = {
  'lorenz-attractor': {
    title: 'Lorenz Attractor Visualisation',
    subtitle: 'An interactive exploration of chaotic systems',
    description:
      'The Lorenz attractor is one of the most iconic examples of chaos theory. This interactive visualisation renders the system in real-time using WebGL, allowing you to explore how tiny changes in initial conditions lead to dramatically different trajectories.',
    category: 'VISUALISER',
    audience: 'Mathematics educators, students, curious minds',
    approach: 'Real-time 3D visualisation with interactive controls',
    technology: 'WebGL2, TypeScript, Custom shader pipeline',
    year: '2026',
    sections: [
      {
        title: 'Background',
        content:
          "Edward Lorenz discovered this system in 1963 while studying atmospheric convection. The equations are simple, but their behaviour is anything but. The attractor's distinctive butterfly shape emerges from just three coupled differential equations.",
      },
      {
        title: 'Technical Approach',
        content:
          'The visualisation uses a custom WebGL2 pipeline to render thousands of trajectory points in real-time. The Runge-Kutta method integrates the differential equations at 60fps, with GPU-based particle rendering for smooth animation.',
      },
    ],
    relatedWork: ['reaction-diffusion', 'hr-diagram'],
  },
  'quantum-guide': {
    title: 'Quantum Mechanics Visual Guide',
    subtitle: 'Making quantum mechanics comprehensible',
    description:
      'A systematic approach to explaining quantum mechanics through interactive visualisation and precise illustration. Built for students and educators who want to genuinely understand the mathematics and physics.',
    category: 'ILLUSTRATION',
    audience: 'Physics students, educators',
    approach: 'Systematic illustration with interactive components',
    technology: 'Canvas2D, Three.js, Custom visualisations',
    year: '2025',
    sections: [
      {
        title: 'Approach',
        content:
          'Rather than simplifying quantum mechanics into metaphors, this guide builds proper mental models through careful sequencing and precise visualisation. Each concept is illustrated with mathematical rigour while remaining visually clear.',
      },
    ],
    relatedWork: ['lorenz-attractor', 'cmb'],
  },
}

interface WorkPageProps {
  params: Promise<{ slug: string }>
}

export default async function WorkDetailPage({ params }: WorkPageProps) {
  const { slug } = await params
  const work = workData[slug]

  if (!work) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container py-16">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-medium mb-4">{work.title}</h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-8">
            {work.subtitle}
          </p>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            {work.description}
          </p>
        </div>
      </section>

      {/* Metadata Sidebar + Content Grid */}
      <section className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Metadata Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-24">
              <div>
                <h3 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">
                  CATEGORY
                </h3>
                <p className="text-base text-[var(--text-primary)]">{work.category}</p>
              </div>

              <div>
                <h3 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">
                  AUDIENCE
                </h3>
                <p className="text-base text-[var(--text-primary)]">{work.audience}</p>
              </div>

              <div>
                <h3 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">
                  APPROACH
                </h3>
                <p className="text-base text-[var(--text-primary)]">{work.approach}</p>
              </div>

              <div>
                <h3 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">
                  TECHNOLOGY
                </h3>
                <p className="text-base text-[var(--text-primary)]">{work.technology}</p>
              </div>

              <div>
                <h3 className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">
                  YEAR
                </h3>
                <p className="text-base text-[var(--text-primary)]">{work.year}</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Visualiser/Media Area Placeholder */}
            <div className="w-full aspect-video bg-[var(--bg-secondary)] rounded-lg mb-12 flex items-center justify-center">
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)]">
                [VISUALISER / MEDIA AREA]
              </p>
            </div>

            {/* Content Sections */}
            <div className="prose-custom space-y-12">
              {work.sections.map((section: any, index: number) => (
                <div key={index}>
                  <h2 className="text-2xl font-medium mb-4">{section.title}</h2>
                  <p className="font-sabon text-lg text-[var(--text-secondary)] leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Work */}
      {work.relatedWork && work.relatedWork.length > 0 && (
        <section className="container py-16 mt-12 border-t border-[var(--border)]">
          <h2 className="text-2xl font-medium mb-8">Related Work</h2>
          <div className="flex gap-6">
            {work.relatedWork.map((relatedSlug: string) => (
              <Link
                key={relatedSlug}
                href={`/work/${relatedSlug}`}
                className="text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {relatedSlug
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to Work */}
      <section className="container py-8">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          ← Back to all work
        </Link>
      </section>
    </div>
  )
}
