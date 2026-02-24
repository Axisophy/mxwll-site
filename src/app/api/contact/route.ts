// Requires RESEND_API_KEY and STUDIO_EMAIL in .env.local
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  organisation: string
  projectType: string
  message: string
  howFound?: string
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured. Please contact hello@mxwll.io directly.' },
        { status: 500 }
      )
    }

    // Initialize Resend client with API key (lazy initialization to avoid build-time errors)
    const resend = new Resend(process.env.RESEND_API_KEY)

    const body: ContactFormData = await request.json()

    // Validation
    const { name, email, organisation, projectType, message, howFound } = body

    if (!name || !email || !organisation || !projectType || !message) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be 100 characters or less' },
        { status: 400 }
      )
    }

    if (organisation.length > 100) {
      return NextResponse.json(
        { error: 'Organisation must be 100 characters or less' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be 2000 characters or less' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString()
    const studioEmail = process.env.STUDIO_EMAIL || 'simon@mxwll.io'

    // Email 1: Notification to studio
    const notificationEmail = {
      from: 'hello@mxwll.io',
      to: studioEmail,
      subject: `New enquiry from ${name} - ${organisation}`,
      text: `New enquiry via mxwll.io

Name: ${name}
Email: ${email}
Organisation: ${organisation}
Project type: ${projectType}
How they found us: ${howFound || 'Not specified'}

Message:
${message}

---
Received: ${timestamp}`,
    }

    // Email 2: Auto-reply to enquirer
    const autoReplyEmail = {
      from: 'hello@mxwll.io',
      to: email,
      subject: 'Thanks for getting in touch - MXWLL',
      text: `Thanks for reaching out.

We have received your message and will be in touch within 2-3 working days.

If you haven't already, you can get an instant project estimate at mxwll.io/quote - no call required.

MXWLL
mxwll.io`,
    }

    // Send both emails
    try {
      await Promise.all([
        resend.emails.send(notificationEmail),
        resend.emails.send(autoReplyEmail),
      ])

      return NextResponse.json(
        { message: 'Message sent successfully' },
        { status: 200 }
      )
    } catch (emailError) {
      console.error('Email send error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email. Please try again or contact hello@mxwll.io directly.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}
