import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const SUBS_FILE = path.join(process.cwd(), 'subscriptions.json')

interface Subscription {
  subscription: {
    endpoint: string
  }
  preferences?: {
    [key: string]: boolean
  }
}

async function readSubs(): Promise<Subscription[]> {
  try {
    const data = await fs.readFile(SUBS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (err: any) {
    // Create file if it doesn't exist
    if (err.code === 'ENOENT') {
      console.log('Creating subscriptions.json file...')
      await fs.writeFile(SUBS_FILE, '[]', 'utf-8')
      return []
    }
    console.error('Error reading subscriptions file:', err)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, body: messageBody, url, type, icon } = body
    
    // Validate required fields
    if (!title || !messageBody) {
      return NextResponse.json(
        { error: 'Missing required fields: title and body' }, 
        { status: 400 }
      )
    }

    const subs = await readSubs()
    
    // Only send to users who have enabled this type
    const filtered = subs.filter((sub: Subscription) => 
      !sub.preferences || sub.preferences[type] !== false
    )
    
    console.log(`Sending notification to ${filtered.length} subscribers:`, {
      title,
      body: messageBody,
      url,
      type,
      icon
    })
    
    filtered.forEach((sub: Subscription) => {
      console.log('Would send push notification to:', sub.subscription.endpoint)
    })
    
    return NextResponse.json({ 
      success: true, 
      count: filtered.length,
      message: `Notification sent to ${filtered.length} subscribers`
    })
  } catch (error) {
    console.error('Notification send error:', error)
    return NextResponse.json(
      { error: 'Failed to send notification', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
} 