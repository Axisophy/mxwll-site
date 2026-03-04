'use client'

import { useState } from 'react'
import Logo from '@/components/Logo'
import { ExplanationModal } from '@/components/ExplanationModal'

export default function DesignSystemPage() {
  const [copiedClass, setCopiedClass] = useState<string | null>(null)
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedClass(text)
    setTimeout(() => setCopiedClass(null), 2000)
  }

  return (
    <div className="min-h-screen py-16">
      <div className="px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-24 pb-8 border-b border-[var(--border)]">
          <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">Design System</h1>
          <p className="text-lg text-[var(--text-secondary)] mb-2">
            Living reference for MXWLL visual language.
          </p>
          <p className="font-label text-xs text-[var(--text-tertiary)]">
            VERSION 2.0 · UPDATED MARCH 2026
          </p>
          {copiedClass && (
            <p className="mt-4 text-sm text-[var(--status-nominal)]">
              Copied: {copiedClass}
            </p>
          )}
        </div>

        {/* 1. Identity */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-label text-[var(--text-tertiary)] text-sm mr-3">01</span>
            Identity
          </h2>

          {/* Logo */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Logo</h3>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-8 space-y-8">
                <div className="space-y-4">
                  <p className="font-label text-xs text-[var(--text-tertiary)]">HEADER SIZE</p>
                  <Logo className="h-10 w-auto text-[var(--text-primary)]" />
                </div>
                <div className="space-y-4">
                  <p className="font-label text-xs text-[var(--text-tertiary)]">MOBILE SIZE</p>
                  <Logo className="h-6 w-auto text-[var(--text-primary)]" />
                </div>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">USAGE</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`<Logo className="h-10 w-auto text-[var(--text-primary)]" />

// Uses currentColor - inherits from parent text colour
// SVG paths with .logo-fill class
// Never rotate, stretch, or add effects`}
              </pre>
            </div>
          </div>

          {/* Studio Description */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Studio Description</h3>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-8">
                <p className="text-sm text-[var(--text-primary)] leading-relaxed max-w-2xl">
                  MXWLL is an explanation design studio for science, data, and the complex. We build work that is rigorous, elegant, and alive - through visualisation, illustration, and systematic design.
                  <br />
                  We don&apos;t simplify. We clarify.
                </p>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">NOTES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Black text (text-primary), not grey
// Hidden below lg breakpoint in header
// Max-width: 28rem`}
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Navigation */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-label text-[var(--text-tertiary)] text-sm mr-3">02</span>
            Navigation
          </h2>

          {/* Desktop Navigation */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Desktop Navigation</h3>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-8">
                <div className="flex flex-wrap gap-6 text-sm">
                  <span className="text-[var(--text-primary)] underline">Work</span>
                  <span className="text-[var(--text-primary)]">Lab</span>
                  <span className="text-[var(--text-primary)]">Method</span>
                  <span className="text-[var(--text-primary)]">Services</span>
                  <span className="text-[var(--text-primary)]">About</span>
                  <span className="text-[var(--text-primary)]">Contact</span>
                  <span className="px-3 py-1 border border-[var(--text-primary)] text-[var(--text-primary)] text-sm">Get a Quote</span>
                </div>
                <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-4">
                  ACTIVE: UNDERLINE · HOVER: UNDERLINE · ALL BLACK
                </p>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">CLASSES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`<nav className="hidden md:flex items-center gap-8">
  {navLinks.map(link => (
    <Link className="text-sm font-text
      text-[var(--text-primary)]
      \${pathname === link.href
        ? 'underline'
        : 'hover:underline'
      }">
      {link.label}
    </Link>
  ))}
</nav>`}
              </pre>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Mobile Menu Overlay</h3>
              <div className="bg-black rounded-xl p-8">
                <div className="space-y-4 text-left text-4xl">
                  <div className="text-white underline">Work</div>
                  <div className="text-white">Lab</div>
                  <div className="text-white">Method</div>
                  <div className="text-white">Services</div>
                  <div className="text-white">About</div>
                  <div className="text-white">Contact</div>
                  <div className="text-white">Get a Quote</div>
                </div>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">NOTES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Black background, white text
// Active page: underline
// Hover: underline
// Closes on route change
// Locks body scroll when open`}
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Colours */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-label text-[var(--text-tertiary)] text-sm mr-3">03</span>
            Colours
          </h2>

          {/* Brand Colours */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">MXWLL Brand Colours</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Electric Blue', value: '#0055FF', var: '--color-blue' },
                  { name: 'Hot Pink', value: '#FF0055', var: '--color-pink' },
                  { name: 'Acid Lime', value: '#CCFF00', var: '--color-lime' },
                ].map(color => (
                  <div key={color.name} className="space-y-2">
                    <div
                      className="h-20 rounded-xl cursor-pointer"
                      style={{ backgroundColor: color.value }}
                      onClick={() => copyToClipboard(color.var)}
                    />
                    <p className="font-medium text-sm">{color.name}</p>
                    <code className="font-label text-[10px] text-[var(--text-tertiary)]">{color.value}</code>
                  </div>
                ))}
              </div>
              <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-4">
                CLICK TO COPY CSS VARIABLE
              </p>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">USAGE</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// MXWLL brand triad
--color-blue: #0055FF;  // Primary accent
--color-pink: #FF0055;  // Secondary accent
--color-lime: #CCFF00;  // Tertiary accent

// Usage in Tailwind
bg-[var(--color-blue)]
text-[var(--color-pink)]

// Active states, buttons, highlights
// Use sparingly - most UI is black/white`}
              </pre>
            </div>
          </div>

          {/* Light Mode */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Light Mode Palette</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'BG Primary', value: '#FFFFFF', var: 'var(--bg-primary)' },
                  { name: 'BG Secondary', value: '#F5F5F5', var: 'var(--bg-secondary)' },
                  { name: 'BG Tertiary', value: '#E5E5E5', var: 'var(--bg-tertiary)' },
                  { name: 'BG Diagram', value: '#EDEDEC', var: 'var(--bg-diagram)' },
                  { name: 'Text Primary', value: '#000000', var: 'var(--text-primary)' },
                  { name: 'Text Secondary', value: '#999999', var: 'var(--text-secondary)' },
                  { name: 'Text Tertiary', value: '#666666', var: 'var(--text-tertiary)' },
                  { name: 'Border', value: '#D4D4D4', var: 'var(--border)' },
                  { name: 'Border Light', value: '#E5E5E5', var: 'var(--border-light)' },
                ].map(color => (
                  <div key={color.name} className="space-y-2">
                    <div
                      className="h-16 rounded-xl border border-[var(--border)] cursor-pointer"
                      style={{ backgroundColor: color.value }}
                      onClick={() => copyToClipboard(color.var)}
                    />
                    <p className="font-medium text-sm">{color.name}</p>
                    <code className="font-label text-[10px] text-[var(--text-tertiary)]">{color.value}</code>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">CSS CUSTOM PROPERTIES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --bg-tertiary: #E5E5E5;
  --bg-diagram: #EDEDEC;

  --text-primary: #000000;
  --text-secondary: #999999;
  --text-tertiary: #666666;

  --border: #D4D4D4;
  --border-light: #E5E5E5;
}

// Text hierarchy:
//   primary (#000) - headings, emphasis
//   secondary (#999) - body text, descriptions
//   tertiary (#666) - labels, metadata, captions
// bg-diagram - light content areas (diagrams, charts)
// Never hardcode hex values for main palette`}
              </pre>
            </div>
          </div>

          {/* Visualiser Background */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Visualiser Background</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div
                    className="h-20 rounded-xl cursor-pointer"
                    style={{ backgroundColor: '#03060f' }}
                    onClick={() => copyToClipboard('#03060f')}
                  />
                  <p className="font-medium text-sm">Vis Background</p>
                  <code className="font-label text-[10px] text-[var(--text-tertiary)]">#03060f</code>
                </div>
              </div>
              <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-4">
                STANDARD DARK BACKGROUND FOR ALL VISUALISERS
              </p>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">USAGE</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Visualiser canvas background
bg-[#03060f]

// Used for all WebGL, Canvas, and
// Three.js visualiser backgrounds
// Near-black with slight blue cast`}
              </pre>
            </div>
          </div>

          {/* Diagram Background */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Diagram Background</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div
                    className="h-20 rounded-xl border border-[var(--border)] cursor-pointer"
                    style={{ backgroundColor: '#EDEDEC' }}
                    onClick={() => copyToClipboard('var(--bg-diagram)')}
                  />
                  <p className="font-medium text-sm">BG Diagram</p>
                  <code className="font-label text-[10px] text-[var(--text-tertiary)]">#EDEDEC</code>
                </div>
              </div>
              <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-4">
                LIGHT CONTENT AREAS FOR DIAGRAMS AND CHARTS
              </p>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">USAGE</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Diagram/chart container background
bg-[var(--bg-diagram)]

// Subtle off-white for light-themed
// diagrams and charts that sit inside
// bg-secondary containers. Prevents
// white content blending into containers.
// Used by: Stellar Evolution HR diagrams`}
              </pre>
            </div>
          </div>

          {/* Status Colours */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Status Colours</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Nominal', value: '#22C55E', var: 'var(--status-nominal)' },
                  { name: 'Elevated', value: '#EAB308', var: 'var(--status-elevated)' },
                  { name: 'Warning', value: '#F97316', var: 'var(--status-warning)' },
                  { name: 'Critical', value: '#EF4444', var: 'var(--status-critical)' },
                  { name: 'Offline', value: '#6B7280', var: 'var(--status-offline)' },
                ].map(color => (
                  <div key={color.name} className="space-y-2">
                    <div
                      className="h-12 rounded-xl cursor-pointer"
                      style={{ backgroundColor: color.value }}
                      onClick={() => copyToClipboard(color.var)}
                    />
                    <p className="font-medium text-xs">{color.name}</p>
                  </div>
                ))}
              </div>
              <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-4">
                FOR VISUALISER UI ONLY - NOT BRAND COLOURS
              </p>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">CSS VARIABLES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`--status-nominal: #22C55E;
--status-elevated: #EAB308;
--status-warning: #F97316;
--status-critical: #EF4444;
--status-offline: #6B7280;

// Tailwind equivalents:
// green-500, yellow-500, orange-500,
// red-500, gray-500`}
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Typography */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-label text-[var(--text-tertiary)] text-sm mr-3">04</span>
            Typography
          </h2>

          {/* NHG-Only System */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">NHG-Only System</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                The entire site uses Neue Haas Grotesk in two weights. No other typefaces. This simplification creates visual coherence while reducing load times.
              </p>
              <div className="space-y-6">
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">NHG DISPLAY 700 (BOLD)</p>
                  <p className="font-display text-3xl font-bold tracking-[-0.03em]">Headlines & Headings</p>
                  <p className="text-sm text-[var(--text-tertiary)] mt-2">Always with letter-spacing: -0.03em</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">NHG TEXT 400 (REGULAR)</p>
                  <p className="text-lg">Body text, prose, descriptions. The default weight for all readable content across the site.</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">NHG TEXT 500 (MEDIUM) - LABEL SYSTEM</p>
                  <p className="font-label text-sm">CATEGORY LABELS · METADATA · STATUS BADGES · DATA READOUTS</p>
                  <p className="text-sm text-[var(--text-tertiary)] mt-2">Uppercase, 0.05em tracking. Replaces Input Mono.</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">CSS CLASSES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Via Adobe Typekit
<link rel="stylesheet"
  href="https://use.typekit.net/qka5zju.css" />

// CSS Variables
--font-display: "neue-haas-grotesk-display";
--font-text: "neue-haas-grotesk-text";

// Utility Classes
.font-display  → NHG Display, 700, -0.03em
.font-nhg      → NHG Display (alias)
.font-label    → NHG Text, 500, uppercase, 0.05em

// Bold NHG rule (automatic)
.font-nhg.font-bold { letter-spacing: -0.03em; }

// Legacy aliases (all redirect to NHG)
.font-sabon → NHG Text 400
.font-input → NHG Text 500 + uppercase
.font-mono  → NHG Text 500 + uppercase`}
              </pre>
            </div>
          </div>

          {/* Label System */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Label/Data Typography</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                A consistent system for metadata, labels, and data readouts. Uses NHG Text 500 (medium weight), uppercase, with 0.05em letter-spacing.
              </p>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-6 space-y-4">
                <div>
                  <p className="font-label text-xs text-[var(--text-tertiary)]">CATEGORY LABEL</p>
                </div>
                <div>
                  <p className="font-label text-[10px] text-[var(--text-tertiary)]">STATUS BADGE · IN DEVELOPMENT</p>
                </div>
                <div>
                  <p className="font-label text-xs text-[var(--text-primary)]">SECTION HEADER</p>
                </div>
                <div>
                  <p className="font-label text-[10px] text-[var(--text-tertiary)]">VERSION 2.0 · UPDATED MARCH 2026</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">PATTERN</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// The .font-label class provides:
.font-label {
  font-family: var(--font-text);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

// Usage pattern:
// .font-label + text size + colour
<p className="font-label text-xs
  text-[var(--text-tertiary)]">
  CATEGORY LABEL
</p>

// Size and colour are set per-instance
// The class handles weight, case, tracking`}
              </pre>
            </div>
          </div>

          {/* Type Scale */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Type Scale</h3>
              <div className="space-y-4">
                <div className="py-3 border-b border-[var(--border-light)]">
                  <p className="font-display text-5xl font-bold tracking-[-0.03em]">Display</p>
                  <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-1">TEXT-5XL · FONT-BOLD · TRACKING-[-0.03EM]</p>
                </div>
                <div className="py-3 border-b border-[var(--border-light)]">
                  <p className="font-display text-3xl font-bold tracking-[-0.03em]">Page Titles</p>
                  <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-1">TEXT-3XL/4XL/5XL · RESPONSIVE</p>
                </div>
                <div className="py-3 border-b border-[var(--border-light)]">
                  <p className="text-xl font-medium">Subheadings</p>
                  <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-1">TEXT-XL · FONT-MEDIUM</p>
                </div>
                <div className="py-3 border-b border-[var(--border-light)]">
                  <p className="text-base">Body text for readable content</p>
                  <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-1">TEXT-BASE · NHG TEXT 400</p>
                </div>
                <div className="py-3">
                  <p className="font-label text-xs text-[var(--text-tertiary)]">METADATA LABEL</p>
                  <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-1">TEXT-XS · .FONT-LABEL</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">TAILWIND CLASSES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Display / Page titles
font-display text-4xl md:text-5xl
  font-bold tracking-[-0.03em]

// Subheadings
text-xl md:text-2xl font-medium

// Body text
text-base leading-relaxed
  text-[var(--text-secondary)]

// Labels / Metadata
font-label text-xs
  text-[var(--text-tertiary)]

// CRITICAL: All bold NHG must have
// tracking-[-0.03em] (-0.03em)
// The CSS rule handles this automatically
// for .font-nhg.font-bold combinations`}
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Container System */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-label text-[var(--text-tertiary)] text-sm mr-3">05</span>
            Container System
          </h2>

          {/* Container Examples */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Content Containers</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                All content containers use rounded-xl corners with bg-secondary fill. No borders. Nested containers use bg-tertiary.
              </p>
              <div className="space-y-4">
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">DEFAULT CONTAINER</p>
                  <p className="text-sm text-[var(--text-secondary)]">bg-secondary with rounded-xl corners and p-6 or p-8 padding.</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6">
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">WITH NESTED CONTAINER</p>
                  <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 mt-3">
                    <p className="text-sm text-[var(--text-secondary)]">Nested content uses bg-tertiary for contrast.</p>
                  </div>
                </div>
                <div className="bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] rounded-xl p-6 transition-colors cursor-pointer">
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">INTERACTIVE CONTAINER</p>
                  <p className="text-sm text-[var(--text-secondary)]">Hover to see bg-tertiary state.</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">PATTERN</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Default container
<div className="bg-[var(--bg-secondary)]
  rounded-xl p-6 md:p-8">
  Content here
</div>

// Nested container (inside bg-secondary)
<div className="bg-[var(--bg-tertiary)]
  rounded-xl p-4">
  Nested content
</div>

// Interactive container
<div className="bg-[var(--bg-secondary)]
  hover:bg-[var(--bg-tertiary)]
  rounded-xl p-6 transition-colors">
  Hoverable content
</div>

// IMPORTANT: No border-radius on buttons
// Rounded corners are for containers only`}
              </pre>
            </div>
          </div>

          {/* Container Rules */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Container Rules</h3>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-[var(--status-nominal)] text-sm mt-0.5">&#10003;</span>
                  <p className="text-sm text-[var(--text-secondary)]">Content containers: rounded-xl, bg-secondary</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--status-nominal)] text-sm mt-0.5">&#10003;</span>
                  <p className="text-sm text-[var(--text-secondary)]">Nested containers: rounded-xl, bg-tertiary</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--status-nominal)] text-sm mt-0.5">&#10003;</span>
                  <p className="text-sm text-[var(--text-secondary)]">Interactive hover: bg-secondary to bg-tertiary</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--status-critical)] text-sm mt-0.5">&#10007;</span>
                  <p className="text-sm text-[var(--text-secondary)]">No border-radius on buttons</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--status-critical)] text-sm mt-0.5">&#10007;</span>
                  <p className="text-sm text-[var(--text-secondary)]">No border-based containers (removed in v2)</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">WHERE USED</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Applied consistently across:
- Contact page (reference implementation)
- Method page (cells, accordions, CTA)
- Services page (service cards, steps)
- Lab page (experiment cards)
- Work page (work cards)

// The pattern replaces the previous
// bordered container system`}
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Spacing */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-label text-[var(--text-tertiary)] text-sm mr-3">06</span>
            Spacing
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">8px Base Grid</h3>
              <div className="space-y-3">
                {[
                  { name: 'space-xs', value: '4px', tw: 'p-1' },
                  { name: 'space-sm', value: '8px', tw: 'p-2' },
                  { name: 'space-md', value: '16px', tw: 'p-4' },
                  { name: 'space-lg', value: '32px', tw: 'p-8' },
                  { name: 'space-xl', value: '64px', tw: 'p-16' },
                  { name: 'space-2xl', value: '128px', tw: 'p-32' },
                ].map(space => (
                  <div key={space.name} className="flex items-center gap-4">
                    <code className="font-label text-xs text-[var(--text-tertiary)] w-20">
                      {space.tw}
                    </code>
                    <span className="text-sm text-[var(--text-secondary)] w-16">{space.value}</span>
                    <div
                      className="h-6 bg-[var(--accent)] rounded"
                      style={{ width: space.value }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">CONTAINER PADDING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Standard page padding
className="px-4 md:px-8 lg:px-12"

// Applied to: Header, Footer, all pages

// Vertical spacing
py-6       → Header
py-12/16/20 → Footer (responsive)
pt-24/28/32 → Page hero sections

// Container internal padding
p-6 md:p-8 → Standard container
p-8 md:p-10 → Large container (CTA)`}
              </pre>
            </div>
          </div>
        </section>

        {/* 7. Components */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-label text-[var(--text-tertiary)] text-sm mr-3">07</span>
            Components
          </h2>

          {/* Buttons */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Buttons</h3>
              <div className="space-y-4">
                <button className="btn">Default Button</button>
                <button className="btn" disabled>Disabled State</button>
                <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-2">
                  NO BORDER-RADIUS ON BUTTONS - SQUARE CORNERS ONLY
                </p>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">CLASSES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`.btn {
  display: inline-flex;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.15s ease;
}

.btn:hover {
  background: var(--text-primary);
  color: var(--bg-primary);
}

// No border-radius - buttons are always
// square-cornered per design system rules`}
              </pre>
            </div>
          </div>

          {/* Control Panel */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Control Panel</h3>
              <div className="control-panel max-w-xs space-y-4">
                <div>
                  <label>PARAMETER NAME</label>
                  <input type="range" min="0" max="100" defaultValue="50" className="mt-2" />
                </div>
                <div className="flex justify-between tabular-nums">
                  <span>FPS: 60</span>
                  <span>PARTICLES: 1000</span>
                </div>
              </div>
              <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-4">
                ALWAYS DARK - EVEN IN LIGHT MODE
              </p>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">CLASSES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`.control-panel {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1rem;
  font-family: var(--font-text);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

// Uses NHG Text 500 (same as .font-label)
// Always dark regardless of page theme`}
              </pre>
            </div>
          </div>

          {/* Visualiser Controls */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Visualiser Controls</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                View buttons, sliders, and toggles for interactive visualisers. These sit outside the visualiser canvas, below or beside it, and feel like page UI rather than part of the visualiser itself.
              </p>

              {/* View buttons example */}
              <div className="space-y-6">
                <div>
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">VIEW BUTTONS</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="font-label text-xs px-4 py-2 rounded-xl bg-[#0055FF] text-white">Sky</span>
                    <span className="font-label text-xs px-4 py-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)]">HR Diagram</span>
                    <span className="font-label text-xs px-4 py-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)]">Galactic</span>
                    <span className="font-label text-xs px-4 py-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)]">Observer</span>
                  </div>
                </div>

                {/* States */}
                <div>
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">STATES</p>
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="font-label text-xs px-4 py-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)]">Default</span>
                    <span className="font-label text-xs px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)]">Hover</span>
                    <span className="font-label text-xs px-4 py-2 rounded-xl bg-[#0055FF] text-white">Active</span>
                  </div>
                </div>

                {/* Slider example */}
                <div>
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-3">SLIDER CONTROL</p>
                  <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="font-label text-xs text-[var(--text-secondary)]">Speed</span>
                      <span className="font-label text-xs text-[var(--text-secondary)] tabular-nums">1.0x</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      defaultValue={50}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <p className="font-label text-[10px] text-[var(--text-tertiary)] mt-4">
                REFERENCE: STELLAR CARTOGRAPHY WORK PAGE
              </p>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">PATTERN</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// View buttons (outside visualiser container)
<button className="font-label text-xs
  px-4 py-2 rounded-xl transition-colors
  bg-[var(--bg-secondary)]
  text-[var(--text-primary)]
  hover:bg-[var(--bg-tertiary)]">
  Label
</button>

// Active state
className="bg-[#0055FF] text-white"

// Slider container
<div className="bg-[var(--bg-secondary)]
  rounded-xl p-4">
  <span className="font-label text-xs">
    Label
  </span>
  <input type="range" />
</div>

// Layout: controls sit BELOW the
// visualiser container, not inside it
<div className="rounded-xl overflow-hidden">
  <VisualiserComponent />
</div>
<div className="flex gap-2 mt-6">
  {/* view buttons here */}
</div>

// KEY RULES:
// - rounded-xl on control elements
// - bg-secondary default, bg-tertiary hover
// - Electric blue #0055FF for active state
// - font-label (NHG 500, uppercase, 0.05em)
// - Controls outside visualiser canvas`}
              </pre>
            </div>
          </div>

          {/* Forms */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Form Inputs</h3>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-8 space-y-6">
                <div>
                  <label className="block font-nhg text-xs text-[var(--text-secondary)] mb-2">
                    Text input
                  </label>
                  <input
                    type="text"
                    placeholder="Enter text"
                    className="w-full px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-nhg text-xs text-[var(--text-secondary)] mb-2">
                    Select
                  </label>
                  <select className="w-full px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white focus:outline-none focus:border-[var(--text-primary)] transition-colors">
                    <option>Select an option</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                </div>
                <div>
                  <label className="block font-nhg text-xs text-[var(--text-secondary)] mb-2">
                    Error state
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-red-600 font-nhg text-sm text-[var(--text-primary)] bg-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                  <p className="text-sm text-red-600 mt-1">This field is required</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">FORM CLASSES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Base Input
className="w-full px-3 py-2
  border border-[var(--border)]
  font-nhg text-sm
  text-[var(--text-primary)]
  bg-white
  focus:outline-none
  focus:border-[var(--text-primary)]
  transition-colors"

// Labels (NHG, normal case)
className="block font-nhg text-xs
  text-[var(--text-secondary)] mb-2"

// Error state
border-red-600
<p className="text-sm text-red-600">
  Error message
</p>`}
              </pre>
            </div>
          </div>
        </section>

        {/* 8. Visual Guardrails */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-label text-[var(--text-tertiary)] text-sm mr-3">08</span>
            Visual Guardrails
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border-l-4 border-[var(--status-critical)] mb-4">
                <h3 className="text-lg font-medium mb-4 text-[var(--status-critical)]">Never Do</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>Use colours outside the defined palette</li>
                  <li>Add drop shadows to widgets or components</li>
                  <li>Use decorative gradients</li>
                  <li>Place text over visualisations without background</li>
                  <li>Use pie charts (bar charts are clearer)</li>
                  <li>Add animations that serve no informational purpose</li>
                  <li>Rotate, stretch, or add effects to the logo</li>
                  <li>Use em dashes (use hyphens instead)</li>
                  <li>Add border-radius to buttons</li>
                  <li>Use fonts other than Neue Haas Grotesk</li>
                </ul>
              </div>
            </div>
            <div>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border-l-4 border-[var(--status-nominal)]">
                <h3 className="text-lg font-medium mb-4 text-[var(--status-nominal)]">Always Do</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>Use British English (colour, visualisation, etc.)</li>
                  <li>Typography: NHG 700 for headings, NHG 400 for body, NHG 500 for labels</li>
                  <li>Bold NHG must always have -0.03em letter-spacing</li>
                  <li>Content containers: rounded-xl, bg-secondary fill</li>
                  <li>Credit data sources in every visualiser</li>
                  <li>Maintain 8px spacing grid</li>
                  <li>Respect the mathematics - show equations, don&apos;t hide them</li>
                  <li>Use .font-label for metadata and status text</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Brand Voice */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-label text-[var(--text-tertiary)] text-sm mr-3">09</span>
            Brand Voice & Terminology
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-label text-sm text-[var(--text-tertiary)] mb-4">USE</h3>
              <ul className="space-y-2 text-base">
                <li>MXWLL (always uppercase)</li>
                <li>explanation design</li>
                <li>visualisation (British spelling)</li>
                <li>data visualisation</li>
                <li>colour (British)</li>
                <li>hyphens for breaks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-label text-sm text-[var(--text-tertiary)] mb-4">NEVER USE</h3>
              <ul className="space-y-2 text-base text-[var(--text-secondary)]">
                <li>innovative, cutting-edge</li>
                <li>leverage, synergy</li>
                <li>disrupt, stakeholder</li>
                <li>solution (unless chemical)</li>
                <li>utilize (use &quot;use&quot;)</li>
                <li>amazing, game-changing</li>
                <li>best-in-class, deliverable</li>
                <li>em dashes, en dashes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 10. Layout */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-label text-[var(--text-tertiary)] text-sm mr-3">10</span>
            Layout & Structure
          </h2>

          {/* Breakpoints */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Breakpoints</h3>
              <div className="space-y-4">
                <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">MOBILE (DEFAULT)</p>
                  <p className="text-sm text-[var(--text-secondary)]">0px - 767px</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">TABLET (MD)</p>
                  <p className="text-sm text-[var(--text-secondary)]">768px - 1023px</p>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-xl p-4">
                  <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">DESKTOP (LG)</p>
                  <p className="text-sm text-[var(--text-secondary)]">1024px+</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">NOTES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Tailwind default breakpoints
Mobile: default (no prefix)
Tablet: md: (min-width: 768px)
Desktop: lg: (min-width: 1024px)

// Always mobile-first approach
className="px-4 md:px-8 lg:px-12"
className="text-sm md:text-base lg:text-lg"
className="hidden md:block"`}
              </pre>
            </div>
          </div>

          {/* Footer */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Footer</h3>
              <div className="bg-black rounded-xl p-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <Logo className="h-10 w-auto text-white" />
                  </div>
                  <div className="flex flex-col gap-2 text-xs">
                    <span className="text-white underline">Work</span>
                    <span className="text-white">Lab</span>
                    <span className="text-white">Method</span>
                    <span className="text-white">Services</span>
                    <span className="text-white">About</span>
                    <span className="text-white">Contact</span>
                    <span className="text-white mt-2">Instagram</span>
                    <span className="text-white">hello@mxwll.io</span>
                    <span className="text-white/50 text-[10px] mt-1">&copy; 2026 MXWLL</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">NOTES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`// Black background, white text
// Logo 50% width on left
// Nav menu on right
// All links: white, underline on hover
// Copyright: white/50

className="w-full bg-black"
className="px-4 md:px-8 lg:px-12
  py-12 md:py-16 lg:py-20"`}
              </pre>
            </div>
          </div>
        </section>

        {/* 11. Explanation Modal */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-label text-[var(--text-tertiary)] text-sm mr-3">11</span>
            Explanation Modal
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-medium mb-6">Four-Tier Explanation System</h3>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-8">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  Different audiences need different explanations. This component presents content at four expertise levels based on the cognitive science principle of expertise reversal.
                </p>
                <button
                  onClick={() => setIsExplanationModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-display hover:bg-[var(--text-primary)] transition-colors"
                >
                  Open Example Modal
                </button>
              </div>
            </div>
            <div>
              <p className="font-label text-xs text-[var(--text-tertiary)] mb-2">USAGE</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded-xl text-xs overflow-x-auto">
{`import { ExplanationModal }
  from '@/components/ExplanationModal'

<ExplanationModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Black Holes"
  subtitle="Objects so dense that
    nothing can escape"
  tiers={[
    { level: 'child',
      label: 'Simple', content: '...' },
    { level: 'student',
      label: 'Intuitive', content: '...' },
    { level: 'undergraduate',
      label: 'Technical', content: '...' },
    { level: 'expert',
      label: 'Advanced', content: '...' },
  ]}
  defaultTier="student"
/>`}
              </pre>
            </div>
          </div>
        </section>

      </div>
      </div>

      {/* Explanation Modal */}
      <ExplanationModal
        isOpen={isExplanationModalOpen}
        onClose={() => setIsExplanationModalOpen(false)}
        title="Black Holes"
        subtitle="Objects so dense that nothing - not even light - can escape their gravitational pull"
        tiers={[
          {
            level: 'child' as const,
            label: 'Simple',
            description: 'Anyone can understand',
            content: 'Imagine something so heavy that even light gets stuck. A black hole is like a cosmic drain - everything that gets too close falls in and can never come back out. Not even the fastest thing in the universe (light!) can escape.',
          },
          {
            level: 'student' as const,
            label: 'Intuitive',
            description: 'High school level',
            content: 'When a massive star dies, its core can collapse under its own gravity until it becomes infinitely dense - a singularity. The boundary around it where escape velocity exceeds the speed of light is called the event horizon. Cross it, and there is no return. Black holes warp space and time so severely that time itself slows down near them.',
          },
          {
            level: 'undergraduate' as const,
            label: 'Technical',
            description: 'University physics',
            content: 'A black hole is described by the Schwarzschild metric (non-rotating) or Kerr metric (rotating). The event horizon radius rs = 2GM/c\u00b2 defines the causal boundary. Inside, all worldlines terminate at the singularity. Hawking radiation provides a quantum mechanical mechanism for black hole evaporation, with temperature T = \u0127c\u00b3/(8\u03c0GMkB).',
          },
          {
            level: 'expert' as const,
            label: 'Advanced',
            description: 'Research level',
            content: 'The information paradox remains unresolved: unitarity of quantum mechanics conflicts with the thermal nature of Hawking radiation. Recent developments in AdS/CFT suggest information is preserved in subtle correlations. The firewall paradox (AMPS) challenges the equivalence principle at the horizon. Loop quantum gravity approaches suggest the singularity is replaced by a Planck-density bounce.',
          },
        ]}
        defaultTier="student"
      />
    </div>
  )
}
