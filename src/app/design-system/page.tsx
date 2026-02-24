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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Design System</h1>
          <p className="text-lg text-[var(--text-secondary)] mb-2">
            Living reference for MXWLL visual language.
          </p>
          <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)]">
            VERSION 1.0 · UPDATED FEBRUARY 2026
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
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">01</span>
            Identity
          </h2>

          {/* Logo */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Logo</h3>
              <div className="space-y-8 p-8 border border-[var(--border-light)] rounded-lg bg-white">
                <div className="space-y-4">
                  <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)]">HEADER SIZE</p>
                  <Logo className="h-10 w-auto text-[var(--text-primary)]" />
                </div>
                <div className="space-y-4">
                  <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)]">MOBILE SIZE</p>
                  <Logo className="h-6 w-auto text-[var(--text-primary)]" />
                </div>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
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
              <div className="p-8 border border-[var(--border-light)] rounded-lg bg-white">
                <p className="text-sm text-[var(--text-primary)] leading-relaxed max-w-2xl">
                  MXWLL is an explanation design studio for science, data, and the complex. We build work that is rigorous, elegant, and alive - through visualisation, illustration, and systematic design.
                  <br />
                  We don't simplify. We clarify.
                </p>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`<p className="text-sm text-[var(--text-primary)] leading-relaxed">
  Studio description text
</p>

// Black text (text-primary), not grey
// Hidden below lg breakpoint in header
// Max-width: 28rem`}
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Navigation */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">02</span>
            Navigation
          </h2>

          {/* Desktop Navigation */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Desktop Navigation</h3>
              <div className="p-8 border border-[var(--border-light)] rounded-lg bg-white">
                <div className="flex flex-wrap gap-6 text-sm">
                  <span className="text-[var(--text-primary)] underline">Work</span>
                  <span className="text-[var(--text-primary)]">Lab</span>
                  <span className="text-[var(--text-primary)]">Method</span>
                  <span className="text-[var(--text-primary)]">Services</span>
                  <span className="text-[var(--text-primary)]">About</span>
                  <span className="text-[var(--text-primary)]">Contact</span>
                  <span className="px-3 py-1 border border-[var(--text-primary)] text-[var(--text-primary)] text-sm">Get a Quote</span>
                </div>
                <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mt-4">
                  ACTIVE: UNDERLINE · HOVER: UNDERLINE · ALL BLACK
                </p>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`<nav className="hidden md:flex items-center gap-8">
  {navLinks.map(link => (
    <Link className={\`
      text-sm font-text text-[var(--text-primary)] whitespace-nowrap
      \${pathname === link.href ? 'underline' : 'hover:underline'}
    \`}>
      {link.label}
    </Link>
  ))}
</nav>

// All links are black (text-primary)
// Active page: underline
// Hover: underline`}
              </pre>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Mobile Hamburger</h3>
              <div className="p-8 border border-[var(--border-light)] rounded-lg bg-white space-y-8">
                <div>
                  <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-4">CLOSED STATE</p>
                  <div className="flex flex-col gap-[6px] w-6 h-6 justify-center">
                    <span className="w-6 h-[2px] bg-[var(--text-primary)]" />
                    <span className="w-6 h-[2px] bg-[var(--text-primary)]" />
                    <span className="w-6 h-[2px] bg-[var(--text-primary)]" />
                  </div>
                </div>
                <div>
                  <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-4">OPEN STATE (×)</p>
                  <div className="flex flex-col gap-[6px] w-6 h-6 justify-center items-center relative">
                    <span className="absolute w-6 h-[2px] bg-[var(--text-primary)] rotate-45" />
                    <span className="absolute w-6 h-[2px] bg-[var(--text-primary)] -rotate-45" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`<button className="md:hidden flex flex-col gap-[6px] w-6 h-6">
  <span className={\`
    w-6 h-[2px] bg-[var(--text-primary)]
    transition-all duration-300
    \${open ? 'rotate-45 translate-y-[8px]' : ''}
  \`} />
  <span className={\`
    w-6 h-[2px] bg-[var(--text-primary)]
    \${open ? 'opacity-0' : 'opacity-100'}
  \`} />
  <span className={\`
    w-6 h-[2px] bg-[var(--text-primary)]
    \${open ? '-rotate-45 -translate-y-[8px]' : ''}
  \`} />
</button>

// State: useState(false)
// Absolute positioned top-6 right-4`}
              </pre>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Mobile Menu Overlay</h3>
              <div className="p-8 border border-[var(--border-light)] rounded-lg bg-black">
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
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`<div className={\`
  fixed inset-0 z-50 bg-black md:hidden
  transition-opacity duration-300
  \${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
\`}>
  <nav className="flex flex-col items-start justify-center h-full gap-4 px-4">
    {navLinks.map(link => (
      <Link className={\`
        font-display text-4xl text-white
        \${pathname === link.href ? 'underline' : 'hover:underline'}
      \`}>
        {link.label}
      </Link>
    ))}
  </nav>
</div>

// Black background, white text
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
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">03</span>
            Colours
          </h2>

          {/* Light Mode */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Light Mode</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'BG Primary', value: '#FFFFFF', var: 'var(--bg-primary)' },
                  { name: 'BG Secondary', value: '#F5F5F5', var: 'var(--bg-secondary)' },
                  { name: 'Text Primary', value: '#000000', var: 'var(--text-primary)' },
                  { name: 'Text Secondary', value: '#666666', var: 'var(--text-secondary)' },
                  { name: 'Accent', value: '#000000', var: 'var(--accent)' },
                  { name: 'Border', value: '#D4D4D4', var: 'var(--border)' },
                ].map(color => (
                  <div key={color.name} className="space-y-2">
                    <div
                      className="h-16 rounded border border-[var(--border)] cursor-pointer"
                      style={{ backgroundColor: color.value }}
                      onClick={() => copyToClipboard(color.var)}
                    />
                    <p className="font-medium text-sm">{color.name}</p>
                    <code className="font-input text-[10px] text-[var(--text-tertiary)]">{color.value}</code>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --bg-tertiary: #E5E5E5;
  --text-primary: #000000;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --accent: #000000;
  --border: #D4D4D4;
}

// Never hardcode hex values
// Always use CSS custom properties
// Status colours are Tailwind equivalents (green-500, etc.)`}
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
                      className="h-12 rounded border border-[var(--border)] cursor-pointer"
                      style={{ backgroundColor: color.value }}
                      onClick={() => copyToClipboard(color.var)}
                    />
                    <p className="font-medium text-xs">{color.name}</p>
                  </div>
                ))}
              </div>
              <p className="font-input text-[10px] text-[var(--text-tertiary)] mt-4">
                FOR VISUALISER UI ONLY - NOT BRAND COLOURS
                <br />
                TAILWIND EQUIVALENTS: green-500, yellow-500, orange-500, red-500, gray-500
              </p>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`--status-nominal: #22C55E;   /* Tailwind green-500 */
--status-elevated: #EAB308;  /* Tailwind yellow-500 */
--status-warning: #F97316;   /* Tailwind orange-500 */
--status-critical: #EF4444;  /* Tailwind red-500 */
--status-offline: #6B7280;   /* Tailwind gray-500 */

// Use for lab/visualiser UI indicators
// Not for brand/marketing contexts`}
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Typography */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">04</span>
            Typography
          </h2>

          {/* Font Families */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Font Families</h3>
              <div className="space-y-6">
                <div>
                  <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">NEUE HAAS GROTESK</p>
                  <p className="text-2xl">Headlines, navigation, body text, UI</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Weights: 400, 500, 700</p>
                </div>
                <div>
                  <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">SABON</p>
                  <p className="font-sabon text-2xl">Longer prose, articles, quotes</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Weights: 400, 400 italic</p>
                </div>
                <div>
                  <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">INPUT MONO</p>
                  <p className="font-input text-base">DATA LABELS, METADATA, CODE</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Weight: 400 only</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`// Via Adobe Typekit
<link rel="stylesheet" href="https://use.typekit.net/qka5zju.css" />

// CSS Variables
--font-display: "neue-haas-grotesk-display", sans-serif;
--font-text: "neue-haas-grotesk-text", sans-serif;
--font-serif: "sabon-next", Georgia, serif;
--font-mono: "input-mono", monospace;

// Utility Classes
.font-nhg → var(--font-display)
.font-sabon → var(--font-serif)
.font-input → var(--font-mono) + uppercase + tracking

// Input Mono ALWAYS uppercase with letter-spacing: 0.08em`}
              </pre>
            </div>
          </div>

          {/* Type Scale */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Type Scale</h3>
              <div className="space-y-4">
                <div className="py-3 border-b border-[var(--border-light)]">
                  <p className="text-5xl font-medium">Display Large</p>
                  <p className="font-input text-[10px] text-[var(--text-tertiary)] mt-1">72PX</p>
                </div>
                <div className="py-3 border-b border-[var(--border-light)]">
                  <p className="text-3xl font-bold tracking-tight">Page Titles</p>
                  <p className="font-input text-[10px] text-[var(--text-tertiary)] mt-1">40PX</p>
                </div>
                <div className="py-3 border-b border-[var(--border-light)]">
                  <p className="text-xl font-medium">Subheadings</p>
                  <p className="font-input text-[10px] text-[var(--text-tertiary)] mt-1">20PX</p>
                </div>
                <div className="py-3 border-b border-[var(--border-light)]">
                  <p className="text-base">Body Text</p>
                  <p className="font-input text-[10px] text-[var(--text-tertiary)] mt-1">16PX</p>
                </div>
                <div className="py-3">
                  <p className="font-input text-xs">METADATA</p>
                  <p className="font-input text-[10px] text-[var(--text-tertiary)] mt-1">11PX</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`// Tailwind classes
text-5xl font-medium → Display Large (72px)
text-4xl font-bold tracking-tight → Page Titles (56px)
text-3xl font-bold tracking-tight → Page Titles (40px)
text-2xl font-medium → Section Heads (28px)
text-xl font-medium → Subheadings (20px)
text-lg → Article Body (18px)
text-base → Body Text (16px)
font-input text-sm → LABELS (13px)
font-input text-xs → METADATA (11px)

// Mobile adjustments in globals.css
// Type scale: xs 11px → 5xl 72px
// Page titles: font-bold tracking-tight`}
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Spacing */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">05</span>
            Spacing
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">8px Base Grid</h3>
              <div className="space-y-3">
                {[
                  { name: 'space-1', value: '4px' },
                  { name: 'space-2', value: '8px' },
                  { name: 'space-3', value: '12px' },
                  { name: 'space-4', value: '16px' },
                  { name: 'space-6', value: '24px' },
                  { name: 'space-8', value: '32px' },
                  { name: 'space-12', value: '48px' },
                  { name: 'space-16', value: '64px' },
                  { name: 'space-24', value: '96px' },
                  { name: 'space-32', value: '128px' },
                ].map(space => (
                  <div key={space.name} className="flex items-center gap-4">
                    <code className="font-input text-xs text-[var(--text-tertiary)] w-20">
                      var(--{space.name})
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
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 2rem;      /* 32px */
  --space-xl: 4rem;      /* 64px */
  --space-2xl: 8rem;     /* 128px */
}

// Or use Tailwind spacing: p-4, mb-8, gap-6 etc.
// 8px base grid - never invent intermediate values`}
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Components */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">06</span>
            Components
          </h2>

          {/* Buttons */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Buttons</h3>
              <div className="space-y-4">
                <button className="btn">Default Button</button>
                <button className="btn" disabled>Disabled State</button>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
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
  border-color: var(--text-primary);
}`}
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
              <p className="font-input text-[10px] text-[var(--text-tertiary)] mt-4">
                ALWAYS DARK - EVEN IN LIGHT MODE
              </p>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`.control-panel {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1rem;
  font-family: var(--font-mono);
  color: rgba(255, 255, 255, 0.7);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

// Always dark regardless of page theme
// For visualiser controls and lab UI`}
              </pre>
            </div>
          </div>
        </section>

        {/* 7. Guardrails */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">07</span>
            Visual Guardrails
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="p-6 border border-[var(--status-critical)] rounded-lg mb-4">
                <h3 className="text-lg font-medium mb-4 text-[var(--status-critical)]">Never Do</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>• Use colours outside the defined palette</li>
                  <li>• Add drop shadows to widgets or components</li>
                  <li>• Use decorative gradients</li>
                  <li>• Place text over complex visualisations without background</li>
                  <li>• Use pie charts (bar charts are clearer)</li>
                  <li>• Add animations that serve no informational purpose</li>
                  <li>• Rotate, stretch, outline, or add effects to the logo</li>
                  <li>• Use em dashes (use hyphens instead)</li>
                </ul>
              </div>
            </div>
            <div>
              <div className="p-6 border border-[var(--status-nominal)] rounded-lg">
                <h3 className="text-lg font-medium mb-4 text-[var(--status-nominal)]">Always Do</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>• Use British English (colour, visualisation, etc.)</li>
                  <li>• Every widget must have: header (title + status), body (visualisation), footer (source + timestamp)</li>
                  <li>• Typography roles: NHG for UI, Input Mono for data, Sabon for reading</li>
                  <li>• Credit data sources in every widget</li>
                  <li>• Last-updated timestamp must be visible</li>
                  <li>• Maintain 8px spacing grid</li>
                  <li>• Respect the mathematics - show equations, don&apos;t hide them</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Brand Voice */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">08</span>
            Brand Voice & Terminology
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-input text-[var(--text-sm)] text-[var(--text-tertiary)] mb-4">USE</h3>
              <ul className="space-y-2 text-base">
                <li>• MXWLL (always uppercase)</li>
                <li>• explanation design</li>
                <li>• visualisation (British spelling)</li>
                <li>• data visualisation</li>
                <li>• colour (British)</li>
                <li>• hyphens for breaks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-input text-[var(--text-sm)] text-[var(--text-tertiary)] mb-4">NEVER USE</h3>
              <ul className="space-y-2 text-base text-[var(--text-secondary)]">
                <li>• innovative, cutting-edge</li>
                <li>• leverage, synergy</li>
                <li>• disrupt, stakeholder</li>
                <li>• solution (unless chemical)</li>
                <li>• utilize (use &quot;use&quot;)</li>
                <li>• amazing, game-changing</li>
                <li>• best-in-class, deliverable</li>
                <li>• em dashes, en dashes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 9. Layout & Structure */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">09</span>
            Layout & Structure
          </h2>

          {/* Breakpoints */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Breakpoints</h3>
              <div className="space-y-4">
                <div className="p-4 border border-[var(--border-light)] rounded">
                  <p className="font-input text-xs text-[var(--text-tertiary)] mb-2">MOBILE (DEFAULT)</p>
                  <p className="text-sm text-[var(--text-secondary)]">0px - 767px</p>
                </div>
                <div className="p-4 border border-[var(--border-light)] rounded">
                  <p className="font-input text-xs text-[var(--text-tertiary)] mb-2">TABLET (MD)</p>
                  <p className="text-sm text-[var(--text-secondary)]">768px - 1023px</p>
                </div>
                <div className="p-4 border border-[var(--border-light)] rounded">
                  <p className="font-input text-xs text-[var(--text-tertiary)] mb-2">DESKTOP (LG)</p>
                  <p className="text-sm text-[var(--text-secondary)]">1024px+</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`// Tailwind default breakpoints
Mobile: default (no prefix)
Tablet: md: (min-width: 768px)
Desktop: lg: (min-width: 1024px)

// Usage examples
className="px-4 md:px-8 lg:px-12"
className="text-sm md:text-base lg:text-lg"
className="hidden md:block"

// Always mobile-first approach`}
              </pre>
            </div>
          </div>

          {/* Container Padding */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Container Padding</h3>
              <div className="p-8 border border-[var(--border-light)] rounded-lg bg-white">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)]">Mobile:</span>
                    <span className="font-mono">16px (px-4)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)]">Tablet:</span>
                    <span className="font-mono">32px (md:px-8)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)]">Desktop:</span>
                    <span className="font-mono">48px (lg:px-12)</span>
                  </div>
                </div>
                <p className="font-input text-[10px] text-[var(--text-tertiary)] mt-6">
                  HEADER, FOOTER, AND ALL PAGES USE THIS PADDING
                </p>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`// Standard container padding
className="px-4 md:px-8 lg:px-12"

// Applied to:
- Header
- Footer
- All page content
- Design system page

// Vertical spacing
py-6       → Header (24px top/bottom)
py-12/16/20 → Footer responsive
pt-24/28/32 → Page hero sections`}
              </pre>
            </div>
          </div>

          {/* Body Styles */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Body & Document</h3>
              <div className="p-8 border border-[var(--border-light)] rounded-lg bg-white">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-input text-xs text-[var(--text-tertiary)] mb-1">BACKGROUND</p>
                    <p className="font-mono">#FFFFFF (white)</p>
                  </div>
                  <div>
                    <p className="font-input text-xs text-[var(--text-tertiary)] mb-1">BASE FONT</p>
                    <p>Neue Haas Grotesk Text, 16px, -0.01em tracking</p>
                  </div>
                  <div>
                    <p className="font-input text-xs text-[var(--text-tertiary)] mb-1">LINE HEIGHT</p>
                    <p>1.5 (body), 1.6 (prose)</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`body {
  background: #FFFFFF;
  color: var(--text-primary);
  font-family: var(--font-text);
  font-weight: 400;
  font-size: 16px;
  letter-spacing: -0.01em;
  line-height: 1.5;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* 10. Footer */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">10</span>
            Footer
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Footer Layout</h3>
              <div className="p-8 bg-black rounded-lg">
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
                    <span className="text-white">Get a Quote</span>
                    <span className="text-white mt-2">Instagram</span>
                    <span className="text-white">hello@mxwll.io</span>
                    <span className="text-white/50 text-[10px] mt-1">© 2026 MXWLL</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CURRENT STYLING</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`<footer className="w-full bg-black mt-24">
  <div className="px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
      {/* Logo - spans 2 columns */}
      <div className="col-span-2">
        <Logo className="h-20 md:h-24 lg:h-32 w-auto text-white" />
      </div>

      {/* Gap column on desktop */}
      <div className="hidden md:block md:col-span-1"></div>

      {/* Navigation links */}
      <nav className="col-span-1 flex flex-col gap-3">
        <Link className="text-sm text-white hover:underline w-fit">
          Work
        </Link>
        {/* ... more nav links */}
      </nav>

      {/* Instagram + Email */}
      <div className="col-span-1 flex flex-col gap-3">
        <a className="text-sm text-white hover:underline">Instagram</a>
        <a className="text-sm text-white hover:underline">hello@mxwll.io</a>
      </div>
    </div>
  </div>
</footer>

// All links: white with underline on hover
// Copyright: white/50
// No colour changes, underline only`}
              </pre>
            </div>
          </div>
        </section>

        {/* 11. Forms & Contact */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">11</span>
            Forms & Contact
          </h2>

          {/* Form Inputs */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Form Inputs</h3>
              <div className="p-8 border border-[var(--border-light)] rounded-lg bg-white space-y-6">
                {/* Text Input - Default */}
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

                {/* Select Dropdown */}
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

                {/* Textarea */}
                <div>
                  <label className="block font-nhg text-xs text-[var(--text-secondary)] mb-2">
                    Textarea
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter longer text"
                    className="w-full px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors resize-y"
                  />
                </div>

                {/* Error State */}
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
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">FORM INPUT CLASSES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`// Base Input Classes
className="w-full px-3 py-2
  border border-[var(--border)]
  font-nhg text-sm
  text-[var(--text-primary)]
  bg-white
  focus:outline-none
  focus:border-[var(--text-primary)]
  transition-colors"

// Label Classes (NHG, not Input Mono)
className="block font-nhg text-xs
  text-[var(--text-secondary)] mb-2"

// Normal case, not uppercase
// Use NHG for all form text (labels, inputs, buttons)

// Error State
border-red-600 (instead of border-[var(--border)])
<p className="text-sm text-red-600 mt-1">Error message</p>

// Textarea: add resize-y
// Select: same classes as input`}
              </pre>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-[var(--border-light)]">
            <div>
              <h3 className="text-xl font-medium mb-6">Newsletter Signup</h3>
              <div className="p-8 border border-[var(--border-light)] rounded-lg bg-white space-y-6">
                {/* Desktop: Inline */}
                <div>
                  <p className="font-input text-xs text-[var(--text-secondary)] mb-3 uppercase tracking-wider">
                    Desktop (Inline)
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                    />
                    <button className="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] font-nhg text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                      Subscribe
                    </button>
                  </div>
                </div>

                {/* Mobile: Stacked */}
                <div>
                  <p className="font-input text-xs text-[var(--text-secondary)] mb-3 uppercase tracking-wider">
                    Mobile (Stacked)
                  </p>
                  <div className="flex flex-col gap-3">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                    />
                    <button className="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] font-nhg text-sm hover:opacity-90 transition-opacity">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">NEWSLETTER CLASSES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`// Desktop (inline)
<div className="flex flex-col md:flex-row gap-3">
  <input className="flex-1 px-3 py-2 ..." />
  <button className="px-6 py-2 ... whitespace-nowrap">
    Subscribe
  </button>
</div>

// Mobile (stacked)
<div className="flex flex-col gap-3">
  <input className="px-3 py-2 ..." />
  <button className="px-6 py-2 ...">
    Subscribe
  </button>
</div>

// Button styling
bg-[var(--text-primary)]
text-[var(--bg-primary)]
font-nhg text-sm
hover:opacity-90
transition-opacity`}
              </pre>
            </div>
          </div>

          {/* Callout Block */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-medium mb-6">Callout Block</h3>
              <div className="p-8 border border-[var(--border-light)] rounded-lg bg-white">
                <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
                  <p className="font-sabon text-base text-[var(--text-primary)] leading-relaxed mb-4">
                    For a faster response with an instant estimate, use our quote tool - no call required.
                  </p>
                  <a
                    href="/quote"
                    className="inline-block px-4 py-2 text-sm font-nhg text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors border border-[var(--text-primary)]"
                  >
                    Get an instant estimate →
                  </a>
                </div>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">CALLOUT CLASSES</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`<div className="border border-[var(--border)]
  bg-[var(--bg-secondary)] p-8">
  <p className="font-sabon text-base
    text-[var(--text-primary)]
    leading-relaxed mb-4">
    Callout text
  </p>
  <a className="inline-block px-4 py-2
    text-sm font-nhg
    text-[var(--text-primary)]
    hover:bg-[var(--text-primary)]
    hover:text-[var(--bg-primary)]
    transition-colors
    border border-[var(--text-primary)]">
    Button text →
  </a>
</div>`}
              </pre>
            </div>
          </div>
        </section>

        {/* 12. Explanation Modal */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-12">
            <span className="font-input text-[var(--text-tertiary)] text-sm mr-3">12</span>
            Explanation Modal
          </h2>

          {/* Component */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-medium mb-6">Four-Tier Explanation System</h3>
              <div className="p-8 border border-[var(--border-light)] rounded-lg bg-white">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  Different audiences need different explanations. This component presents content at four expertise levels based on the cognitive science principle of expertise reversal.
                </p>
                <button
                  onClick={() => setIsExplanationModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-display hover:bg-[var(--text-primary)] transition-colors rounded"
                >
                  Open Example Modal
                </button>
              </div>
            </div>
            <div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mb-2">USAGE EXAMPLE</p>
              <pre className="p-4 bg-[var(--bg-secondary)] rounded text-xs font-mono overflow-x-auto">
{`import { ExplanationModal } from '@/components/ExplanationModal'

<ExplanationModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Black Holes"
  subtitle="Objects so dense that nothing can escape"
  tiers={[
    {
      level: 'child',
      label: 'Simple',
      description: 'Anyone can understand',
      content: '...'
    },
    {
      level: 'student',
      label: 'Intuitive',
      description: 'High school level',
      content: '...'
    },
    // ... undergraduate and expert tiers
  ]}
  defaultTier="student"
/>

// Four levels:
// - child: Concrete analogies, no jargon
// - student: First principles, minimal math
// - undergraduate: Equations, technical terms
// - expert: Full formalism, current research`}
              </pre>
            </div>
          </div>
        </section>

        <ExplanationModal
          isOpen={isExplanationModalOpen}
          onClose={() => setIsExplanationModalOpen(false)}
          title="Black Holes"
          subtitle="Objects so dense that nothing can escape"
          tiers={[
            {
              level: 'child',
              label: 'Simple',
              description: 'Anyone can understand',
              content: 'A black hole is like a cosmic vacuum cleaner - it sucks in everything nearby and nothing can escape, not even light! If you got too close, you would be stretched like spaghetti and pulled in forever.'
            },
            {
              level: 'student',
              label: 'Intuitive',
              description: 'High school level',
              content: 'When a massive star collapses, it creates a region where gravity is so strong that the escape velocity exceeds the speed of light. Nothing can move faster than light, so nothing can escape. The boundary where this happens is called the event horizon.'
            },
            {
              level: 'undergraduate',
              label: 'Technical',
              description: 'University level',
              content: "The Schwarzschild radius R_s = 2GM/c² defines the event horizon for a non-rotating black hole. For a solar mass black hole, R_s ≈ 3 km. Time dilation approaches infinity at the horizon from an external observer's perspective. The singularity at r=0 represents a breakdown of general relativity."
            },
            {
              level: 'expert',
              label: 'Advanced',
              description: 'Graduate/research level',
              content: 'Kerr metric describes rotating black holes with angular momentum parameter a. Frame-dragging in the ergosphere allows Penrose process for energy extraction. Hawking radiation implies black holes have entropy S = A/4 in Planck units, suggesting information paradox. Recent EHT observations confirm photon ring structure predicted by GR.'
            }
          ]}
          defaultTier="student"
        />
      </div>
      </div>
    </div>
  )
}
