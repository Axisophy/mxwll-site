import { notFound } from 'next/navigation'
import Link from 'next/link'

// Sample work data - will be replaced with CMS/database later
const workData: Record<string, any> = {
  'whats-inside-your-console': {
    title: "What's Inside Your Console?",
    subtitle: 'A guide for gamers aged 8-12',
    description:
      'You use it every day to play games. But what is actually happening inside that box? An explanation designed to make computing hardware genuinely interesting to kids.',
    category: 'EXPLANATION DESIGN',
    audience: 'Kids aged 8-12, parents, educators',
    approach: 'Illustrated explanation with interactive components',
    technology: 'Canvas 2D, SVG, Custom illustrations',
    year: '2025',
    sections: [
      {
        title: 'Approach',
        content:
          'Rather than simplifying computing into vague metaphors, this guide builds accurate mental models through careful sequencing and precise illustration. Each component is explained in terms kids already understand.',
      },
    ],
    relatedWork: [],
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
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] mb-4">{work.title}</h1>
          <p className="font-nhg text-xl md:text-2xl text-[var(--text-secondary)] mb-8">
            {work.subtitle}
          </p>
          <p className="font-nhg text-lg text-[var(--text-secondary)] leading-relaxed">
            {work.description}
          </p>
        </div>
      </section>

      {/* Metadata Sidebar + Content Grid */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Metadata Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-24">
              <div>
                <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">
                  CATEGORY
                </p>
                <p className="font-nhg text-base text-[var(--text-primary)]">{work.category}</p>
              </div>

              <div>
                <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">
                  AUDIENCE
                </p>
                <p className="font-nhg text-base text-[var(--text-primary)]">{work.audience}</p>
              </div>

              <div>
                <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">
                  APPROACH
                </p>
                <p className="font-nhg text-base text-[var(--text-primary)]">{work.approach}</p>
              </div>

              <div>
                <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">
                  TECHNOLOGY
                </p>
                <p className="font-nhg text-base text-[var(--text-primary)]">{work.technology}</p>
              </div>

              <div>
                <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">
                  YEAR
                </p>
                <p className="font-nhg text-base text-[var(--text-primary)]">{work.year}</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Visualiser/Media Area Placeholder */}
            <div className="w-full aspect-video bg-[var(--bg-secondary)] rounded-xl mb-12 flex items-center justify-center">
              <p className="font-label text-xs text-[var(--text-tertiary)]">
                VISUALISER / MEDIA AREA
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
              {work.sections.map((section: any, index: number) => (
                <div key={index}>
                  <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em] mb-4">{section.title}</h2>
                  <p className="font-nhg text-lg text-[var(--text-secondary)] leading-relaxed">
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
        <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20 border-t border-[var(--border)]">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em] mb-8 pt-12">Related Work</h2>
          <div className="flex gap-6">
            {work.relatedWork.map((relatedSlug: string) => (
              <Link
                key={relatedSlug}
                href={`/work/${relatedSlug}`}
                className="font-nhg text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {relatedSlug
                  .split('-')
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to Work */}
      <section className="px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-nhg text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          ← Back to all work
        </Link>
      </section>
    </div>
  )
}
