// Requires BUTTONDOWN_API_KEY in .env.local
import { NextRequest, NextResponse } from 'next/server'

interface NewsletterData {
  email: string
}

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterData = await request.json()
    const { email } = body

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const apiKey = process.env.BUTTONDOWN_API_KEY

    if (!apiKey) {
      console.error('BUTTONDOWN_API_KEY not configured')
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      )
    }

    // Post to Buttondown API
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        tags: ['mxwll'],
      }),
    })

    // Handle Buttondown responses
    if (response.status === 201) {
      return NextResponse.json(
        { message: 'Successfully subscribed' },
        { status: 200 }
      )
    }

    if (response.status === 400 || response.status === 409) {
      // Already subscribed or validation error
      const data = await response.json()
      return NextResponse.json(
        { message: 'Already subscribed - thanks.' },
        { status: 200 }
      )
    }

    // Other errors
    const errorData = await response.json().catch(() => ({}))
    console.error('Buttondown error:', response.status, errorData)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
