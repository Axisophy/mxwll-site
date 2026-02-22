import dynamic from 'next/dynamic'

const GaiaExplorer = dynamic(() => import('./work/stellar-cartography/GaiaExplorer'), { ssr: false })

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

      {/* Stellar Cartography Visualiser */}
      <section className="px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20">
        <div className="aspect-[16/10] md:aspect-[21/9] bg-[#050508] overflow-hidden border border-[var(--border-light)]">
          <GaiaExplorer className="w-full h-full" demoMode={true} showControls={false} />
        </div>
        <p className="font-mono text-[var(--text-xs)] text-[var(--text-tertiary)] mt-4 uppercase tracking-wider">
          STELLAR CARTOGRAPHY - 50,000 STARS FROM THE GAIA CATALOGUE
        </p>
      </section>
    </>
  )
}
