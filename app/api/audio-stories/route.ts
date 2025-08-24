import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const villageId = searchParams.get('villageId')

    if (!villageId) {
      return NextResponse.json({ error: 'Village ID is required' }, { status: 400 })
    }

    // Mock audio stories data
    const audioStories = [
      {
        id: '1',
        title: 'The Legend of Pushkar Lake',
        description: 'Discover the ancient story behind the sacred Pushkar Lake and its spiritual significance.',
        audioUrl: 'https://example.com/audio/pushkar-lake.mp3',
        duration: '3:45',
        narrator: 'Rajesh Kumar',
        language: 'English',
        transcript: 'In the heart of Rajasthan lies the sacred Pushkar Lake...',
        tags: ['history', 'spirituality', 'culture'],
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Traditional Rajasthani Folk Tales',
        description: 'Listen to enchanting folk tales passed down through generations in rural Rajasthan.',
        audioUrl: 'https://example.com/audio/folk-tales.mp3',
        duration: '5:20',
        narrator: 'Priya Sharma',
        language: 'Hindi',
        transcript: 'Once upon a time in a small village...',
        tags: ['folklore', 'tradition', 'stories'],
        createdAt: '2024-01-10T14:30:00Z'
      },
      {
        id: '3',
        title: 'Crafting Traditions of Rajasthan',
        description: 'Learn about the traditional crafts and artisans of rural Rajasthan.',
        audioUrl: 'https://example.com/audio/crafts.mp3',
        duration: '4:15',
        narrator: 'Amit Patel',
        language: 'English',
        transcript: 'The art of traditional crafting in Rajasthan...',
        tags: ['crafts', 'artisans', 'tradition'],
        createdAt: '2024-01-08T09:15:00Z'
      }
    ]

    return NextResponse.json(audioStories)
  } catch (error) {
    console.error('Error fetching audio stories:', error)
    return NextResponse.json({ error: 'Failed to fetch audio stories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock response for audio story upload
    const newStory = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      audioUrl: body.audioUrl,
      duration: body.duration,
      narrator: body.narrator,
      language: body.language,
      transcript: body.transcript,
      tags: body.tags || [],
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(newStory, { status: 201 })
  } catch (error) {
    console.error('Error creating audio story:', error)
    return NextResponse.json({ error: 'Failed to create audio story' }, { status: 500 })
  }
} 
