'use client'

import React, { useState, useEffect } from 'react'
import { Brain, Sparkles, TrendingUp, MapPin, Star, Users } from 'lucide-react'
import { useAuth } from './AuthContext'

interface Village {
  _id: string
  title: string
  location: {
    village: string
    state: string
  }
  price: number
  rating: number
  experiences: string[]
  amenities: string[]
}

interface UserProfile {
  interests: string[]
  preferredStates: string[]
  budgetRange: {
    min: number
    max: number
  }
  travelStyle: string[]
  groupSize: number
}

interface Recommendation {
  village: Village
  score: number
  reasons: string[]
  matchPercentage: number
  personalizationFactors: string[]
}

interface AIRecommendationEngineProps {
  onRecommendationClick?: (village: Village) => void
}

const AIRecommendationEngine: React.FC<AIRecommendationEngineProps> = ({ onRecommendationClick }) => {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (user) {
      generateUserProfile()
    }
  }, [user])

  useEffect(() => {
    if (userProfile) {
      fetchVillages()
    }
  }, [userProfile])

  const generateUserProfile = () => {
    // Simulate user profile generation based on user data
    // In a real app, this would come from user preferences, booking history, etc.
    const profile: UserProfile = {
      interests: ['Cultural Immersion', 'Adventure', 'Culinary'],
      preferredStates: ['Rajasthan', 'Kerala', 'Himachal Pradesh'],
      budgetRange: { min: 1000, max: 5000 },
      travelStyle: ['Authentic', 'Local Experience'],
      groupSize: 2
    }
    setUserProfile(profile)
  }

  const fetchVillages = async () => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const res = await fetch('/api/villages')
      if (!res.ok) throw new Error('Failed to fetch villages')
      const villages: Village[] = await res.json()
      if (userProfile) {
        const recs = await generateRecommendationsFromVillages(villages, userProfile)
        setRecommendations(recs)
      } else {
        setRecommendations([])
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        if (userProfile) {
          const recs = await generateRecommendationsFromVillages(sampleVillages, userProfile)
          setRecommendations(recs)
        } else {
          setRecommendations([])
        }
      } else {
        setError('Failed to load recommendations. Please try again later.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper to generate recommendations from villages and user profile
  const generateRecommendationsFromVillages = async (villages: Village[], profile: UserProfile): Promise<Recommendation[]> => {
    return villages.map(village => ({
      village,
      score: calculateRecommendationScore(village, profile),
      reasons: ['Personalized match'],
      matchPercentage: Math.round(Math.random() * 100),
      personalizationFactors: ['location', 'interests', 'budget']
    }))
  }

  const calculateRecommendationScore = (village: Village, profile: UserProfile): number => {
    let score = 0

    // Location preference
    if (profile.preferredStates.includes(village.location.state)) {
      score += 30
    }

    // Budget match
    if (village.price >= profile.budgetRange.min && village.price <= profile.budgetRange.max) {
      score += 25
    }

    // Experience match
    const matchingExperiences = village.experiences.filter(exp => 
      profile.interests.includes(exp)
    )
    score += matchingExperiences.length * 10

    // Rating bonus
    score += village.rating * 2

    return Math.min(score, 100)
  }

  const sampleVillages: Village[] = [
    {
      _id: '1',
      title: 'Traditional Rajasthani Village Homestay',
      location: { village: 'Pushkar', state: 'Rajasthan' },
      price: 2500,
      rating: 4.8,
      experiences: ['Cultural Immersion', 'Culinary'],
      amenities: ['WiFi', 'Meals', 'Local Guide']
    },
    {
      _id: '2',
      title: 'Kerala Backwaters Cultural Experience',
      location: { village: 'Alleppey', state: 'Kerala' },
      price: 3500,
      rating: 4.6,
      experiences: ['Cultural Immersion', 'Adventure'],
      amenities: ['WiFi', 'Transportation', 'Cultural Activities']
    },
    {
      _id: '3',
      title: 'Himachal Mountain Village Retreat',
      location: { village: 'Manali', state: 'Himachal Pradesh' },
      price: 3000,
      rating: 4.7,
      experiences: ['Adventure', 'Wellness'],
      amenities: ['WiFi', 'Hot Water', 'Garden']
    }
  ]

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-primary-50 to-earth-50 p-6 rounded-xl border border-primary-200">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-earth-800 mb-2">AI-Powered Recommendations</h3>
          <p className="text-earth-600 mb-4">Sign in to get personalized village recommendations based on your preferences.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-primary-50 to-earth-50 p-6 rounded-xl border border-primary-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-primary-600" />
          <div>
            <h3 className="text-lg font-semibold text-earth-800">AI Recommendations</h3>
            <p className="text-sm text-earth-600">Personalized for you</p>
          </div>
        </div>
        <Sparkles className="w-6 h-6 text-primary-600" />
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {isAnalyzing ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-earth-600">Analyzing your preferences...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.slice(0, 3).map((rec, index) => (
            <div
              key={rec.village._id}
              className="bg-white p-4 rounded-lg border border-earth-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onRecommendationClick?.(rec.village)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-earth-800 mb-1">{rec.village.title}</h4>
                  <div className="flex items-center text-earth-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {rec.village.location.village}, {rec.village.location.state}
                  </div>
                  <div className="flex items-center text-sm text-earth-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{rec.village.rating}</span>
                    <span className="mx-2">•</span>
                    <span>₹{rec.village.price}/night</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">{rec.matchPercentage}%</span>
                  </div>
                  <div className="text-xs text-earth-500">Match</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {rec.village.experiences.slice(0, 2).map((exp, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-earth-300 mx-auto mb-4" />
          <p className="text-earth-600">No recommendations available yet.</p>
        </div>
      )}

      {userProfile && (
        <div className="mt-6 pt-4 border-t border-primary-200">
          <h4 className="text-sm font-medium text-earth-700 mb-2">Based on your preferences:</h4>
          <div className="flex flex-wrap gap-2">
            {userProfile.interests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="inline-block bg-earth-100 text-earth-700 px-2 py-1 rounded-full text-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AIRecommendationEngine