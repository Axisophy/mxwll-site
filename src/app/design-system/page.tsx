'use client'

import { useState } from 'react'
import Logo from '@/components/Logo'

export default function DesignSystemPage() {
  const [copiedClass, setCopiedClass] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedClass(text)
    setTimeout(() => setCopiedClass(null), 2000)
  }

  const ColorSwatch = ({ name, value, cssVar }: { name: string; value: string; cssVar: string }) => (
    <div className="space-y-2">
      <div
        className="h-24 rounded-lg border border-[var(--border)] cursor-pointer transition-transform hover:scale-105"
        style={{ backgroundColor: value }}
        onClick={() => copyToClipboard(cssVar)}
      />
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)]">{value}</p>
        <code
          className="font-input text-[var(--text-xs)] text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)]"
          onClick={() => copyToClipboard(cssVar)}
        >
          {cssVar}
        </code>
      </div>
    </div>
  )

  const TypographyExample = ({ level, className, sample }: { level: string; className: string; sample: string }) => (
    <div className="py-6 border-b border-[var(--border-light)] space-y-2">
      <code
        className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] cursor-pointer hover:text-[var(--text-primary)]"
        onClick={() => copyToClipboard(className)}
      >
        {className}
      </code>
      <p className={className}>{sample}</p>
    </div>
  )

  const ComponentExample = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-4 py-8 border-b border-[var(--border-light)]">
      <h3 className="font-input text-[var(--text-sm)] text-[var(--text-tertiary)]">{title}</h3>
      <div className="flex flex-wrap gap-4 items-center">{children}</div>
    </div>
  )

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 lg:px-12">
        {/* Header Elements */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-8">Header</h2>

          <div className="mb-12">
            <h3 className="text-xl font-medium mb-6">Logo</h3>
            <div className="space-y-8 p-8 border border-[var(--border-light)] rounded-lg bg-white">
              <div className="space-y-2">
                <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)]">HEADER SIZE (H-10)</p>
                <Logo className="h-10 w-auto text-[var(--text-primary)]" />
              </div>
              <div className="space-y-2">
                <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)]">MOBILE SIZE (H-6)</p>
                <Logo className="h-6 w-auto text-[var(--text-primary)]" />
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-medium mb-6">Studio Description</h3>
            <div className="p-8 border border-[var(--border-light)] rounded-lg bg-white">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                MXWLL is an explanation design studio for science, data, and the complex. We build work that is rigorous, elegant, and alive - through visualisation, illustration, and systematic design.
                <br />
                We don't simplify. We clarify.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-6">Navigation Structure</h3>
            <div className="p-8 border border-[var(--border-light)] rounded-lg bg-white">
              <div className="flex flex-wrap gap-6 text-sm">
                <span className="text-[var(--text-primary)]">Work</span>
                <span className="text-[var(--text-secondary)]">Lab</span>
                <span className="text-[var(--text-secondary)]">Method</span>
                <span className="text-[var(--text-secondary)]">About</span>
                <span className="text-[var(--text-secondary)]">Contact</span>
              </div>
              <p className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)] mt-4">
                ACTIVE STATE: PRIMARY · INACTIVE: SECONDARY
              </p>
            </div>
          </div>
        </section>

        {/* Header */}
        <div className="mb-16 pb-8 border-b border-[var(--border)]">
          <h1 className="text-4xl md:text-5xl font-medium mb-4">Design System</h1>
          <p className="text-lg text-[var(--text-secondary)] mb-2">
            Living reference for MXWLL visual language. Click any value to copy.
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

        {/* Colours */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-8">Colours</h2>

          <div className="mb-12">
            <h3 className="text-xl font-medium mb-6">Light Mode (Primary)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ColorSwatch name="BG Primary" value="#FAFAF8" cssVar="var(--bg-primary)" />
              <ColorSwatch name="BG Secondary" value="#F0EFED" cssVar="var(--bg-secondary)" />
              <ColorSwatch name="BG Tertiary" value="#E5E4E1" cssVar="var(--bg-tertiary)" />
              <ColorSwatch name="Text Primary" value="#1A1A18" cssVar="var(--text-primary)" />
              <ColorSwatch name="Text Secondary" value="#6B6B66" cssVar="var(--text-secondary)" />
              <ColorSwatch name="Text Tertiary" value="#9B9B95" cssVar="var(--text-tertiary)" />
              <ColorSwatch name="Accent" value="#1A1A18" cssVar="var(--accent)" />
              <ColorSwatch name="Border" value="#D8D7D4" cssVar="var(--border)" />
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-medium mb-6">Status Colours</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <ColorSwatch name="Nominal" value="#22C55E" cssVar="var(--status-nominal)" />
              <ColorSwatch name="Elevated" value="#EAB308" cssVar="var(--status-elevated)" />
              <ColorSwatch name="Warning" value="#F97316" cssVar="var(--status-warning)" />
              <ColorSwatch name="Critical" value="#EF4444" cssVar="var(--status-critical)" />
              <ColorSwatch name="Offline" value="#6B7280" cssVar="var(--status-offline)" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-6">Dark Mode (Prepared)</h3>
            <p className="text-base text-[var(--text-secondary)] mb-4">
              Dark mode tokens defined in globals.css under <code className="font-input text-[var(--text-xs)]">[data-theme="dark"]</code>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ColorSwatch name="BG Primary" value="#0A0A0A" cssVar="var(--bg-primary)" />
              <ColorSwatch name="BG Secondary" value="#141414" cssVar="var(--bg-secondary)" />
              <ColorSwatch name="Text Primary" value="#EAEAE8" cssVar="var(--text-primary)" />
              <ColorSwatch name="Border" value="#2A2A28" cssVar="var(--border)" />
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-8">Typography</h2>

          <div className="mb-12">
            <h3 className="text-xl font-medium mb-6">Font Families</h3>
            <div className="space-y-4">
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
                <p className="text-sm text-[var(--text-secondary)] mt-1">Weight: 400 only, always uppercase + letter-spacing 0.08em</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-6">Type Scale</h3>
            <div className="space-y-1">
              <TypographyExample
                level="5xl"
                className="text-5xl font-medium"
                sample="Display Large 72px"
              />
              <TypographyExample
                level="4xl"
                className="text-4xl font-medium"
                sample="Hero Display 56px"
              />
              <TypographyExample
                level="3xl"
                className="text-3xl font-medium"
                sample="Page Titles 40px"
              />
              <TypographyExample
                level="2xl"
                className="text-2xl font-medium"
                sample="Section Heads 28px"
              />
              <TypographyExample
                level="xl"
                className="text-xl font-medium"
                sample="Subheadings 20px"
              />
              <TypographyExample
                level="lg"
                className="text-lg"
                sample="Article Body 18px"
              />
              <TypographyExample
                level="base"
                className="text-base"
                sample="Body Text 16px"
              />
              <TypographyExample
                level="sm"
                className="font-input text-sm"
                sample="LABELS 13PX"
              />
              <TypographyExample
                level="xs"
                className="font-input text-xs"
                sample="METADATA 11PX"
              />
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-8">Spacing</h2>
          <p className="text-base text-[var(--text-secondary)] mb-8">8px base grid</p>
          <div className="space-y-4">
            {[
              { name: '1', value: '4px', cssVar: 'var(--space-1)' },
              { name: '2', value: '8px', cssVar: 'var(--space-2)' },
              { name: '3', value: '12px', cssVar: 'var(--space-3)' },
              { name: '4', value: '16px', cssVar: 'var(--space-4)' },
              { name: '6', value: '24px', cssVar: 'var(--space-6)' },
              { name: '8', value: '32px', cssVar: 'var(--space-8)' },
              { name: '12', value: '48px', cssVar: 'var(--space-12)' },
              { name: '16', value: '64px', cssVar: 'var(--space-16)' },
              { name: '24', value: '96px', cssVar: 'var(--space-24)' },
              { name: '32', value: '128px', cssVar: 'var(--space-32)' },
            ].map((space) => (
              <div
                key={space.name}
                className="flex items-center gap-6 cursor-pointer hover:bg-[var(--bg-secondary)] p-2 rounded transition-colors"
                onClick={() => copyToClipboard(space.cssVar)}
              >
                <div className="w-32">
                  <code className="font-input text-[var(--text-xs)] text-[var(--text-tertiary)]">
                    {space.cssVar}
                  </code>
                </div>
                <div className="w-24">
                  <span className="text-sm text-[var(--text-secondary)]">{space.value}</span>
                </div>
                <div
                  className="h-8 bg-[var(--accent)] rounded"
                  style={{ width: space.value }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Components */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-8">Components</h2>

          <ComponentExample title="BUTTONS">
            <button className="btn">Default Button</button>
            <button className="btn" disabled>
              Disabled State
            </button>
          </ComponentExample>

          <ComponentExample title="WORK CARD">
            <div className="work-card max-w-sm">
              <div className="w-full aspect-video bg-[var(--bg-tertiary)]" />
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">Work Title</h3>
                <p className="text-base text-[var(--text-secondary)] mb-3">
                  Brief description of the work
                </p>
                <p className="font-input text-xs text-[var(--text-tertiary)]">
                  CATEGORY · 2026
                </p>
              </div>
            </div>
          </ComponentExample>

          <ComponentExample title="CONTROL PANEL (ALWAYS DARK)">
            <div className="control-panel max-w-xs w-full space-y-4">
              <div>
                <label>PARAMETER NAME</label>
                <input type="range" min="0" max="100" defaultValue="50" className="mt-2" />
              </div>
              <div className="flex justify-between tabular-nums">
                <span>FPS: 60</span>
                <span>PARTICLES: 1000</span>
              </div>
            </div>
          </ComponentExample>

          <ComponentExample title="TYPOGRAPHY CLASSES">
            <div className="space-y-2">
              <p className="font-nhg">Neue Haas Grotesk (.font-nhg)</p>
              <p className="font-sabon">Sabon serif accent (.font-sabon)</p>
              <p className="font-input">INPUT MONO UPPERCASE (.font-input)</p>
            </div>
          </ComponentExample>
        </section>

        {/* Rules */}
        <section className="mb-24">
          <h2 className="text-3xl font-medium mb-8">Visual Guardrails</h2>
          <div className="space-y-4">
            <div className="p-6 border border-[var(--status-critical)] rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-[var(--status-critical)]">
                Never Do
              </h3>
              <ul className="space-y-2 text-base text-[var(--text-secondary)]">
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

            <div className="p-6 border border-[var(--status-nominal)] rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-[var(--status-nominal)]">
                Always Do
              </h3>
              <ul className="space-y-2 text-base text-[var(--text-secondary)]">
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
        </section>

        {/* Terminology */}
        <section>
          <h2 className="text-3xl font-medium mb-8">Brand Voice & Terminology</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-input text-[var(--text-sm)] text-[var(--text-tertiary)] mb-4">
                USE
              </h3>
              <ul className="space-y-2 text-base">
                <li>• MXWLL (always uppercase)</li>
                <li>• the observatory (not dashboard/platform)</li>
                <li>• widget (not module/component/tile)</li>
                <li>• explanation design</li>
                <li>• visualisation (British)</li>
                <li>• colour (British)</li>
                <li>• data visualisation</li>
                <li>• hyphens for breaks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-input text-[var(--text-sm)] text-[var(--text-tertiary)] mb-4">
                NEVER USE
              </h3>
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
    </div>
  )
}
