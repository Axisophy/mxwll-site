'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')

  const [newsletterState, setNewsletterState] = useState<'idle' | 'submitting' | 'success' | 'subscribed' | 'error'>('idle')
  const [newsletterMessage, setNewsletterMessage] = useState('')

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('submitting')
    setFormError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      organisation: formData.get('organisation') as string,
      projectType: formData.get('projectType') as string,
      message: formData.get('message') as string,
      howFound: formData.get('howFound') as string,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setFormState('success')
      } else {
        const errorData = await response.json()
        setFormError(errorData.error || 'Something went wrong')
        setFormState('error')
      }
    } catch (error) {
      setFormError('Something went wrong. Please try hello@mxwll.io directly.')
      setFormState('error')
    }
  }

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setNewsletterState('submitting')
    setNewsletterMessage('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('newsletter-email') as string

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.message.includes('Already subscribed')) {
          setNewsletterState('subscribed')
          setNewsletterMessage('Already subscribed - thanks.')
        } else {
          setNewsletterState('success')
          setNewsletterMessage("You're subscribed.")
        }
      } else {
        setNewsletterState('error')
        setNewsletterMessage('Something went wrong. Try again.')
      }
    } catch (error) {
      setNewsletterState('error')
      setNewsletterMessage('Something went wrong. Try again.')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Page Title */}
      <section className="px-4 md:px-8 lg:px-12 pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact</h1>
        </div>
      </section>

      <div className="px-4 md:px-8 lg:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-12">
          {/* Column 1 - Row 1: Email */}
          <div className="bg-[var(--bg-secondary)] hover:bg-blue-600 p-8 rounded-xl transition-colors group">
            <h3 className="font-nhg text-base font-normal text-[var(--text-primary)] group-hover:text-white mb-3 transition-colors">
              E-mail
            </h3>
            <a
              href="mailto:hello@mxwll.io"
              className="font-nhg text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-white transition-colors"
            >
              hello@mxwll.io
            </a>
          </div>

          {/* Column 2 - Row 1: Get a quote */}
          <div className="bg-[var(--bg-secondary)] p-8 rounded-xl">
            <h3 className="font-nhg text-base font-normal text-[var(--text-primary)] mb-3">
              Get a quote
            </h3>
            <p className="font-nhg text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1]">
              For a faster response with an instant estimate, use our quote tool - no call required.
            </p>
          </div>

          {/* Column 1 - Row 2: Get in touch */}
          <div className="bg-[var(--bg-secondary)] p-8 rounded-xl">
            <h3 className="font-nhg text-base font-normal text-[var(--text-primary)] mb-6">
              Get in touch
            </h3>

            {formState === 'success' ? (
              <div className="space-y-4">
                <p className="font-sabon text-base text-[var(--text-primary)] leading-relaxed">
                  Message sent. We'll be in touch within 2-3 working days.
                </p>
                <Link
                  href="/quote"
                  className="inline-block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Get an instant estimate →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block font-nhg text-xs text-[var(--text-secondary)] mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    maxLength={100}
                    className="w-full px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-nhg text-xs text-[var(--text-secondary)] mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                  />
                </div>

                {/* Organisation */}
                <div>
                  <label htmlFor="organisation" className="block font-nhg text-xs text-[var(--text-secondary)] mb-2">
                    Organisation *
                  </label>
                  <input
                    type="text"
                    id="organisation"
                    name="organisation"
                    required
                    maxLength={100}
                    className="w-full px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label htmlFor="projectType" className="block font-nhg text-xs text-[var(--text-secondary)] mb-2">
                    Project type *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    required
                    className="w-full px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                  >
                    <option value="">Select a project type</option>
                    <option value="Interactive visualisation">Interactive visualisation</option>
                    <option value="Explanation design & illustration">Explanation design & illustration</option>
                    <option value="Design system or pictogram set">Design system or pictogram set</option>
                    <option value="Research or impact visualisation">Research or impact visualisation</option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block font-nhg text-xs text-[var(--text-secondary)] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    maxLength={2000}
                    rows={6}
                    className="w-full px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white focus:outline-none focus:border-[var(--text-primary)] transition-colors resize-y"
                  />
                </div>

                {/* How Found */}
                <div>
                  <label htmlFor="howFound" className="block font-nhg text-xs text-[var(--text-secondary)] mb-2">
                    How did you find us? (optional)
                  </label>
                  <input
                    type="text"
                    id="howFound"
                    name="howFound"
                    className="w-full px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-nhg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formState === 'submitting' ? 'Sending...' : 'Send message'}
                  </button>
                </div>

                {/* Error Message */}
                {formState === 'error' && formError && (
                  <p className="text-sm text-red-600">
                    {formError}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Column 2 - Row 2: Newsletter */}
          <div className="bg-[var(--bg-secondary)] p-8 rounded-xl">
            <h3 className="font-nhg text-base font-normal text-[var(--text-primary)] mb-3">Newsletter</h3>
            <p className="font-nhg text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1] mb-6">
              Sign up to our newsletter The Lab for occasional writing on explanation design, science visualisation, and the work. No noise.
            </p>

            {newsletterState === 'success' || newsletterState === 'subscribed' ? (
              <p className="font-sabon text-sm text-[var(--text-primary)]">
                {newsletterMessage}
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  name="newsletter-email"
                  placeholder="Your email"
                  required
                  disabled={newsletterState === 'submitting'}
                  className="w-full px-3 py-2 border border-[var(--border)] font-nhg text-sm text-[var(--text-primary)] bg-white placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={newsletterState === 'submitting'}
                  className="w-full px-6 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] font-nhg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {newsletterState === 'submitting' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}

            {newsletterState === 'error' && newsletterMessage && (
              <p className="text-sm text-red-600 mt-2">
                {newsletterMessage}
              </p>
            )}
          </div>

          {/* Column 1 - Row 3: Socials */}
          <div className="bg-[var(--bg-secondary)] p-8 rounded-xl">
            <h3 className="font-nhg text-base font-normal text-[var(--text-primary)] mb-3">
              Socials
            </h3>
            <a
              href="https://instagram.com/mxwll.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-nhg text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] hover:opacity-70 transition-opacity"
            >
              Instagram ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
