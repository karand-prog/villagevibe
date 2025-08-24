import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock data for cultural experiences
    const experiences = [
      {
        id: '1',
        title: 'Traditional Pottery Making',
        description: 'Learn the ancient art of pottery making from local artisans',
        village: 'Kumbharwada',
        state: 'Rajasthan',
        price: 800,
        duration: '3 hours',
        rating: 4.8,
        reviews: 45,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        category: 'Crafts',
        difficulty: 'Beginner',
        maxParticipants: 8,
        included: ['Materials', 'Expert guidance', 'Take-home creation'],
        schedule: ['Morning: 9 AM - 12 PM', 'Afternoon: 2 PM - 5 PM']
      },
      {
        id: '2',
        title: 'Folk Music & Dance Workshop',
        description: 'Experience the vibrant folk music and dance traditions of Rajasthan',
        village: 'Pushkar',
        state: 'Rajasthan',
        price: 1200,
        duration: '4 hours',
        rating: 4.9,
        reviews: 67,
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
        category: 'Performance',
        difficulty: 'All levels',
        maxParticipants: 12,
        included: ['Musical instruments', 'Traditional costumes', 'Performance opportunity'],
        schedule: ['Evening: 6 PM - 10 PM']
      },
      {
        id: '3',
        title: 'Traditional Cooking Class',
        description: 'Learn to cook authentic Rajasthani dishes from local home chefs',
        village: 'Jaisalmer',
        state: 'Rajasthan',
        price: 1500,
        duration: '5 hours',
        rating: 4.7,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        category: 'Culinary',
        difficulty: 'Intermediate',
        maxParticipants: 6,
        included: ['Fresh ingredients', 'Recipe booklet', 'Lunch included'],
        schedule: ['Morning: 10 AM - 3 PM']
      },
      {
        id: '4',
        title: 'Textile Weaving Workshop',
        description: 'Discover the art of traditional textile weaving and dyeing',
        village: 'Bagru',
        state: 'Rajasthan',
        price: 1000,
        duration: '6 hours',
        rating: 4.6,
        reviews: 34,
        image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
        category: 'Crafts',
        difficulty: 'Beginner',
        maxParticipants: 10,
        included: ['Raw materials', 'Traditional tools', 'Finished product'],
        schedule: ['Full day: 9 AM - 4 PM']
      }
    ]

    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    )
  }
} 
