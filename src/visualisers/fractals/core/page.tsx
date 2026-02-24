'use client';

import { useRef, useState } from 'react';
import { KochSnowflake } from './components/KochSnowflake';
import { MandelbrotExplorer } from './components/MandelbrotExplorer';
import { JuliaExplorer } from './components/JuliaExplorer';
import { NaturalFractalsGallery } from './components/NaturalFractalsGallery';

function MetadataDropdown({ title, children }: { title?: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center ${title ? 'justify-between w-full' : ''} text-left`}
      >
        {title && <span className='text-sm'>{title}</span>}
        <svg
          className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='square' strokeLinejoin='miter' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>
      {isOpen && (
        <div className='text-xs text-white/60 mt-2 leading-relaxed space-y-2'>
          {children}
        </div>
      )}
    </div>
  );
}

export default function FractalsPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleCanPlayThrough = () => {
    setIsVideoReady(true);
    videoRef.current?.play();
    // Show overlay text after 2.5 seconds
    setTimeout(() => {
      setShowOverlay(true);
    }, 2500);
  };

  return (
    <main className='min-h-screen'>
      {/* Header with Metadata Sidebar */}
      <section className='px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Left column - Title and description */}
          <div className='lg:col-span-2'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]'>
              What are Fractals?
            </h1>
            <p className='text-lg md:text-xl lg:text-2xl font-normal text-white/70 mt-2'>
              A Beginner&apos;s Guide
            </p>
            <p className='text-base text-white/70 max-w-3xl mt-6 md:mt-8 lg:mt-12'>
              An accessible introduction to fractal geometry  - from simple self-similarity to the infinite complexity of the Mandelbrot set. Designed to spark curiosity without requiring any mathematical background.
            </p>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-4 md:mt-6 lg:mt-8'>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Explanation Design</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Interactive</span>
              <span className='px-3 py-1 text-xs bg-white/10 text-white/60'>Mathematics</span>
            </div>
          </div>

          {/* Right column - Portfolio Metadata */}
          <div className='space-y-6'>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Category
              </span>
              <span className='text-sm'>Explanation Design</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Audience
              </span>
              <MetadataDropdown title='Generally interested adults'>
                <p>Curious people with no assumed mathematics background. They&apos;ve seen fractal images before - screensavers, posters, album covers - and have surface familiarity, but don&apos;t understand what they&apos;re actually looking at. They want to genuinely understand, not just admire. The reward is the feeling of &quot;now I actually get this.&quot;</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Approach
              </span>
              <MetadataDropdown>
                <p>Fractals have a surface familiarity problem - most people have seen the images but have no idea what they&apos;re actually looking at. We start by acknowledging that recognition, then reframe it as a gap worth closing.</p>
                <p>The Koch snowflake does the heavy lifting. It&apos;s the simplest possible fractal: one rule, obvious self-similarity, no mathematics required. Once that clicks, everything else - coastlines, nature, the Mandelbrot set - becomes variations on the same theme.</p>
                <p>The Mandelbrot explorer comes late, after the conceptual work is done. By then, zooming isn&apos;t just pretty - they understand why the detail never runs out.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Adaptability
              </span>
              <MetadataDropdown>
                <p>This approach - concrete example first, progressive complexity, interactive exploration - works for any subject where the core concept is genuinely simple but obscured by intimidating presentation. Chaos theory, network effects, probability distributions, the electromagnetic spectrum.</p>
                <p>It wouldn&apos;t suit subjects that genuinely require mathematical prerequisites to make sense - quantum mechanics, general relativity, Fourier transforms. For those, either the audience needs to be narrower (people with calculus), or the explanation needs to be more metaphorical and less precise.</p>
              </MetadataDropdown>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Technology
              </span>
              <span className='text-sm'>React, Canvas/WebGL, D3.js</span>
            </div>
            <div>
              <span className='text-xs font-mono uppercase tracking-wider text-white/40 block mb-2'>
                Data
              </span>
              <span className='text-sm text-white/70'>Mathematical generation (no external datasets)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 1: HOOK - Video */}
      <section className='relative h-[70vh] min-h-[500px] bg-black overflow-hidden'>
        <video
          ref={videoRef}
          preload='auto'
          muted
          playsInline
          onCanPlayThrough={handleCanPlayThrough}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src='/video/mandelbrot-zoom-web.mp4' type='video/mp4' />
        </video>
        <div className='absolute inset-0 bg-black/40' />
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}>
          <div className='text-center text-white px-4'>
            <h2 className='font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-4'>
              What are Fractals?
            </h2>
            <p className='font-display text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white/80'>
              Infinite complexity. Simple rules.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 2: ANCHOR - "You've Seen These Before" */}
      <section className='px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            You&apos;ve Seen These Before
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              You&apos;ve seen fractal images  - on posters, screensavers, album covers. The Mandelbrot set, with its seahorses and spirals, has become one of the most recognisable images in mathematics.
            </p>
            <p>
              But here&apos;s the thing: most people who recognise a fractal couldn&apos;t tell you what actually makes it a fractal. What&apos;s special about these shapes? Why can you zoom in forever? And how does such complexity come from such simple rules?
            </p>
            <p>
              That&apos;s what we&apos;re going to explore.
            </p>
          </div>
        </div>

        {/* Familiarity grid - full width */}
        <div className='mt-12 grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            { name: 'Mandelbrot set', file: 'mandelbrot-thumbnail.jpg' },
            { name: 'Julia set', file: 'julia-thumbnail.jpg' },
            { name: 'Fern', file: 'fern-thumbnail.jpg' },
            { name: 'Koch snowflake', file: 'snowflake-thumbnail.jpg' },
          ].map((item) => (
            <div key={item.file} className='aspect-square bg-white/10 flex items-center justify-center border border-white/10'>
              <span className='text-black/30 text-xs font-mono text-center px-2'>{item.file}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stage 3: FOUNDATION - "Patterns Within Patterns" */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Patterns Within Patterns
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The defining feature of fractals is <strong>self-similarity</strong>  - zoom in, and you find smaller copies of the same shapes you just saw. Zoom in on those copies, and you find even smaller copies. This continues forever.
            </p>
            <p>
              The remarkable thing is that this infinite complexity usually emerges from very simple rules. Let&apos;s see how.
            </p>
          </div>
        </div>
      </section>

      {/* Koch Snowflake Interactive */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            The Koch Snowflake
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The Koch snowflake is one of the simplest fractals to understand. Start with an equilateral triangle. Take each straight edge and replace it with a kinked version: remove the middle third and add two sides of a smaller triangle pointing outward.
            </p>
            <p>
              Now repeat. Every straight edge gets the same treatment. After just a few iterations, the simple triangle transforms into an intricate snowflake. Continue forever, and you get a shape with infinite perimeter but finite area.
            </p>
          </div>
        </div>
        <KochSnowflake />
      </section>

      {/* Stage 4: BUILD - Beat 4a: Coastline */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            How Long is Britain&apos;s Coastline?
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              In 1967, mathematician Benoit Mandelbrot asked a deceptively simple question: how long is the coast of Britain?
            </p>
            <p>
              The surprising answer: it depends on your ruler.
            </p>
            <p>
              Measure with a 100km ruler, skipping over bays and peninsulas, and you get one number. Measure with a 10km ruler, following more detail, and the coastline is longer. Use a 1km ruler, and longer still. Use a metre stick, tracing around every rock...
            </p>
            <p>
              There is no &quot;true&quot; length. The closer you look, the more detail you find  - just like the Koch snowflake edges. Coastlines are fractal.
            </p>
          </div>
        </div>

        {/* Coastline diagram placeholder - full width */}
        <div className='border border-white/10 aspect-[2/1] flex items-center justify-center bg-white/10'>
          <span className='text-black/30 text-sm font-mono'>coastline-measurement.svg</span>
        </div>
        <p className='text-xs md:text-sm text-white/50 mt-4'>
          The same coastline measured at different scales yields different lengths.
        </p>
      </section>

      {/* Beat 4b: Fractal Dimension */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            More Than a Line, Less Than a Plane
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              A straight line is one-dimensional. A filled square is two-dimensional. But what about a coastline? Or the Koch snowflake?
            </p>
            <p>
              These shapes are too wiggly and complex to be one-dimensional  - they&apos;re trying to fill more space than a simple line. But they don&apos;t fill a whole plane either.
            </p>
            <p>
              Mathematicians measure this in-between quality with something called fractal dimension. The Koch snowflake has a dimension of about 1.26  - more than a line, less than a plane. It&apos;s a measure of how thoroughly a shape fills the space around it.
            </p>
            <p>
              Britain&apos;s coastline? About 1.25. The more crinkled and space-filling, the higher the dimension.
            </p>
          </div>
        </div>

        {/* Dimension comparison - full width */}
        <div className='grid grid-cols-3 gap-4'>
          <div className='border border-white/10 p-4 flex flex-col items-center'>
            <div className='h-24 flex items-center justify-center'>
              <svg width='100' height='4' viewBox='0 0 100 4'>
                <line x1='0' y1='2' x2='100' y2='2' stroke='black' strokeWidth='2' />
              </svg>
            </div>
            <span className='text-sm font-bold mt-2'>D = 1</span>
            <span className='text-xs text-white/50'>Line</span>
          </div>
          <div className='border border-white/10 p-4 flex flex-col items-center bg-[var(--color-blue)]/5'>
            <div className='h-24 flex items-center justify-center'>
              <svg width='80' height='80' viewBox='0 0 80 80'>
                <path
                  d='M40 5 L60 35 L55 35 L65 50 L55 50 L75 75 L5 75 L25 50 L15 50 L25 35 L20 35 Z'
                  fill='none'
                  stroke='#0055FF'
                  strokeWidth='1.5'
                />
              </svg>
            </div>
            <span className='text-sm font-bold mt-2'>D = 1.26</span>
            <span className='text-xs text-white/50'>Koch snowflake</span>
          </div>
          <div className='border border-white/10 p-4 flex flex-col items-center'>
            <div className='h-24 flex items-center justify-center'>
              <div className='w-16 h-16 bg-black' />
            </div>
            <span className='text-sm font-bold mt-2'>D = 2</span>
            <span className='text-xs text-white/50'>Square</span>
          </div>
        </div>
      </section>

      {/* Beat 4c: Nature */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Nature&apos;s Favourite Pattern
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Fractals aren&apos;t just mathematical curiosities  - they&apos;re everywhere in the natural world.
            </p>
            <p>
              Look at a fern frond: each branch looks like a smaller copy of the whole. River deltas branch and rebranch in patterns that echo at every scale. Lightning bolts, blood vessels, tree branches, broccoli florets  - all fractal.
            </p>
            <p>
              Why? Because fractal branching is efficient. It&apos;s how nature solves the problem of reaching lots of places from one source, or fitting lots of surface area into limited space. Your lungs contain about 300 million air sacs, reached through a fractal tree of branching airways  - all packed into your chest.
            </p>
          </div>
        </div>
        <NaturalFractalsGallery />
      </section>

      {/* Beat 4d: Mandelbrot */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            The Icon
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The Mandelbrot set is the most famous image in mathematics. It&apos;s what was zooming in the video you saw at the top of this page.
            </p>
            <p>
              It&apos;s generated by an absurdly simple formula: take a number, square it, add a constant, repeat. Colour each point based on how quickly (or whether) it escapes to infinity.
            </p>
            <p>
              The magic is at the boundary  - that&apos;s where all the complexity lives. Zoom in on the edge, and you find spirals, seahorses, and intricate filigree. Zoom deeper, and the detail never ends. And scattered throughout, you&apos;ll find tiny copies of the whole set  - self-similarity again.
            </p>
            <p>
              Try it yourself.
            </p>
          </div>
        </div>
        <MandelbrotExplorer />
      </section>

      {/* Stage 5: REWARD - "Now You See It" */}
      <section className='px-4 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-black text-white'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Now You See It
          </h2>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              Look at a fractal image now, and you see something different than you did ten minutes ago.
            </p>
            <p>
              You see self-similarity  - the pattern containing copies of itself at every scale. You understand why zooming works: the detail never runs out because the same structures repeat infinitely.
            </p>
            <p>
              You know that this infinite complexity comes from simple rules  - a few lines of mathematics generating boundless intricacy. And you know that nature discovered fractals long before we did.
            </p>
            <p className='text-white'>
              That&apos;s what a fractal is. Not just a pretty picture, but a window into how complexity emerges from simplicity.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 6: EXTEND - Clearly marked optional */}
      <section className='px-4 md:px-8 lg:px-12 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Going Deeper
          </h2>
          <p className='text-white/50 text-sm'>
            For the curious  - you&apos;ve got the main idea, this is extra.
          </p>
        </div>
      </section>

      {/* 6a: Julia Sets */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Julia Sets
          </h3>
          <div className='space-y-4 text-white/70 leading-relaxed'>
            <p>
              The Mandelbrot set has a secret twin  - actually, infinitely many twins.
            </p>
            <p>
              Every point on the Mandelbrot set corresponds to a different Julia set. Choose a point inside the Mandelbrot set, and the Julia set is connected (one continuous shape). Choose a point outside, and the Julia set shatters into disconnected dust.
            </p>
            <p>
              The Mandelbrot set is, in a sense, a map of all possible Julia sets.
            </p>
          </div>
        </div>

        {/* 3D Julia gallery placeholder - full width */}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
          {['julia-dendrite.jpg', 'julia-rabbit.jpg', 'julia-spiral.jpg'].map((img) => (
            <div key={img} className='aspect-square bg-white/10 flex items-center justify-center border border-white/10'>
              <span className='text-black/30 text-xs font-mono'>{img}</span>
            </div>
          ))}
        </div>

        <JuliaExplorer />
      </section>

      {/* 6b: Beyond 2D */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12 mb-8'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            Beyond Two Dimensions
          </h3>
          <p className='text-white/70 leading-relaxed'>
            Fractals extend into three dimensions and beyond. The Mandelbulb (discovered 2009) is a 3D analog of the Mandelbrot set  - infinitely detailed surfaces you could explore forever.
          </p>
        </div>

        {/* 3D renders placeholder - full width */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='aspect-square bg-white/10 flex items-center justify-center border border-white/10'>
            <span className='text-black/30 text-sm font-mono'>mandelbulb.jpg</span>
          </div>
          <div className='aspect-square bg-white/10 flex items-center justify-center border border-white/10'>
            <span className='text-black/30 text-sm font-mono'>mandelbox.jpg</span>
          </div>
        </div>
      </section>

      {/* 6c: Applications */}
      <section className='px-4 md:px-8 lg:px-12 pb-12 md:pb-16 lg:pb-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h3 className='text-2xl md:text-3xl font-bold tracking-tight'>
            More Than Pretty Pictures
          </h3>
          <div>
            <p className='text-white/70 leading-relaxed mb-8'>
              Fractals aren&apos;t just beautiful  - they&apos;re useful.
            </p>

            <div className='space-y-6'>
              <div>
                <h4 className='font-bold mb-1'>Antennas</h4>
                <p className='text-sm text-white/60'>
                  Fractal designs pack more electrical length into small spaces  - that&apos;s why your phone can receive multiple frequencies.
                </p>
              </div>
              <div>
                <h4 className='font-bold mb-1'>Computer graphics</h4>
                <p className='text-sm text-white/60'>
                  Games and films use fractal algorithms to generate realistic terrain, clouds, and vegetation.
                </p>
              </div>
              <div>
                <h4 className='font-bold mb-1'>Medicine</h4>
                <p className='text-sm text-white/60'>
                  The fractal patterns of blood vessels and airways help doctors spot abnormalities.
                </p>
              </div>
              <div>
                <h4 className='font-bold mb-1'>Finance</h4>
                <p className='text-sm text-white/60'>
                  Mandelbrot&apos;s later work revealed fractal patterns in market price movements  - something traditional models miss.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stage 7: LAUNCH - Further Exploration */}
      <section className='px-4 md:px-8 lg:px-12 pb-16 md:pb-20 lg:pb-24 pt-16 md:pt-20'>
        <div className='grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 lg:gap-12'>
          <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Further Exploration
          </h2>
          <div>
            <div className='space-y-8'>
              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Recommended Reading
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='https://www.amazon.co.uk/Fractal-Geometry-Nature-Benoit-Mandelbrot/dp/0716711869'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      The Fractal Geometry of Nature  - Benoit Mandelbrot
                    </a>
                    <span className='text-white/40 ml-2'>The foundational text</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Watch
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='https://www.youtube.com/watch?v=FFftmWSzgmk'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      3Blue1Brown: Fractals are typically not self-similar
                    </a>
                    <span className='text-white/40 ml-2'>A deeper dive into what fractals really are</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className='text-xs font-mono uppercase tracking-wider text-white/40 mb-4'>
                  Reference
                </h3>
                <ul className='space-y-2 text-sm'>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Mandelbrot_set'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Mandelbrot set (Wikipedia)
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Julia_set'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Julia set (Wikipedia)
                    </a>
                  </li>
                  <li>
                    <a
                      href='https://en.wikipedia.org/wiki/Fractal_dimension'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[var(--color-blue)] hover:text-black transition-colors'
                    >
                      Fractal dimension (Wikipedia)
                    </a>
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
