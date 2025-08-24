import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, rating, message, email, timestamp } = body

    // Validate required fields
    if (!type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In a real app, you would save this to a database
    // For now, we'll just log it and return success
    console.log('Feedback received:', {
      type,
      rating,
      message,
      email,
      timestamp,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.ip
    })

    // You could also send this to an analytics service or email service
    // await sendFeedbackEmail({ type, rating, message, email })

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    })
  } catch (error) {
    console.error('Error processing feedback:', error)
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    )
  }
} 
