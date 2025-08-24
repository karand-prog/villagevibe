'use client'

import React, { useState, useEffect } from 'react'
import { Trophy, MapPin, Globe, Leaf, Heart, Star, Award, Target, Users, Camera, BookOpen, Music } from 'lucide-react'
import { useAuth } from './AuthContext'
import { useTranslation } from './LanguageDetector'

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  category: 'travel' | 'sustainability' | 'culture' | 'community'
  requirement: string
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedDate?: string
  color: string
}

const Gamification = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [badges, setBadges] = useState<Badge[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)

  useEffect(() => {
    // Initialize badges with sample data
    const initializeBadges = () => {
      const sampleBadges: Badge[] = [
        {
          id: 'first-trip',
          name: 'First Village Visit',
          description: 'Complete your first village stay',
          icon: MapPin,
          category: 'travel',
          requirement: '1 village visited',
          progress: 1,
          maxProgress: 1,
          unlocked: true,
          unlockedDate: '2024-01-15',
          color: 'bg-blue-500'
        },
        {
          id: 'multi-state',
          name: 'State Explorer',
          description: 'Visit villages in 3 different states',
          icon: Globe,
          category: 'travel',
          requirement: '3 states visited',
          progress: 2,
          maxProgress: 3,
          unlocked: false,
          color: 'bg-green-500'
        },
        {
          id: 'local-language',
          name: 'Local Language Learner',
          description: 'Use local language during your stay',
          icon: BookOpen,
          category: 'culture',
          requirement: 'Learn 5 local phrases',
          progress: 3,
          maxProgress: 5,
          unlocked: false,
          color: 'bg-purple-500'
        },
        {
          id: 'plastic-free',
          name: 'Plastic-Free Traveler',
          description: 'Complete a trip without using single-use plastic',
          icon: Leaf,
          category: 'sustainability',
          requirement: '1 plastic-free trip',
          progress: 1,
          maxProgress: 1,
          unlocked: true,
          unlockedDate: '2024-02-10',
          color: 'bg-green-600'
        },
        {
          id: 'cultural-immersion',
          name: 'Cultural Immersion',
          description: 'Participate in 3 cultural activities',
          icon: Music,
          category: 'culture',
          requirement: '3 cultural activities',
          progress: 2,
          maxProgress: 3,
          unlocked: false,
          color: 'bg-orange-500'
        },
        {
          id: 'community-helper',
          name: 'Community Helper',
          description: 'Volunteer or help local community during your stay',
          icon: Heart,
          category: 'community',
          requirement: '1 community service activity',
          progress: 1,
          maxProgress: 1,
          unlocked: true,
          unlockedDate: '2024-01-20',
          color: 'bg-red-500'
        },
        {
          id: 'photographer',
          name: 'Village Photographer',
          description: 'Share 10 photos from your village experiences',
          icon: Camera,
          category: 'travel',
          requirement: '10 photos shared',
          progress: 7,
          maxProgress: 10,
          unlocked: false,
          color: 'bg-pink-500'
        },
        {
          id: 'reviewer',
          name: 'Helpful Reviewer',
          description: 'Write 5 detailed reviews of your experiences',
          icon: Star,
          category: 'community',
          requirement: '5 reviews written',
          progress: 3,
          maxProgress: 5,
          unlocked: false,
          color: 'bg-yellow-500'
        },
        {
          id: 'sustainable-traveler',
          name: 'Sustainable Traveler',
          description: 'Complete 5 eco-friendly trips',
          icon: Leaf,
          category: 'sustainability',
          requirement: '5 sustainable trips',
          progress: 2,
          maxProgress: 5,
          unlocked: false,
          color: 'bg-emerald-500'
        },
        {
          id: 'local-friend',
          name: 'Local Friend',
          description: 'Make friends with 3 local families',
          icon: Users,
          category: 'community',
          requirement: '3 local families befriended',
          progress: 1,
          maxProgress: 3,
          unlocked: false,
          color: 'bg-indigo-500'
        }
      ]
      setBadges(sampleBadges)
    }

    initializeBadges()
  }, [])

  const categories = [
    { id: 'all', name: 'All Badges', icon: Trophy },
    { id: 'travel', name: 'Travel', icon: MapPin },
    { id: 'culture', name: 'Culture', icon: Music },
    { id: 'sustainability', name: 'Sustainability', icon: Leaf },
    { id: 'community', name: 'Community', icon: Heart }
  ]

  const filteredBadges = badges.filter(badge => {
    const categoryMatch = selectedCategory === 'all' || badge.category === selectedCategory
    const unlockedMatch = !showUnlockedOnly || badge.unlocked
    return categoryMatch && unlockedMatch
  })

  const unlockedCount = badges.filter(badge => badge.unlocked).length
  const totalBadges = badges.length
  const progressPercentage = (unlockedCount / totalBadges) * 100

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.icon : Trophy
  }

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-12">
        <div className="container-custom">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">Your Achievements</h1>
            <p className="text-xl opacity-90 mb-6">Track your progress and unlock badges for sustainable travel</p>
            
            {/* Progress Overview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold">Progress</span>
                <span className="text-lg font-bold">{unlockedCount}/{totalBadges}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm opacity-90">{Math.round(progressPercentage)}% Complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-earth-200 py-6">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                )
              })}
            </div>

            {/* Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnlockedOnly}
                onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-earth-700">Show unlocked only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="py-12">
        <div className="container-custom">
          {filteredBadges.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-earth-400" />
              <h3 className="text-xl font-semibold mb-2">No badges found</h3>
              <p className="text-earth-600">Try adjusting your filters or complete more activities to unlock badges.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBadges.map(badge => {
                const Icon = badge.icon
                const progressPercentage = (badge.progress / badge.maxProgress) * 100
                
                return (
                  <div
                    key={badge.id}
                    className={`bg-white rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg ${
                      badge.unlocked 
                        ? 'border-green-200 shadow-md' 
                        : 'border-earth-200 hover:border-earth-300'
                    }`}
                  >
                    {/* Badge Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      {badge.unlocked && (
                        <div className="text-green-600">
                          <Award className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Badge Info */}
                    <h3 className="text-lg font-semibold text-earth-800 mb-2">{badge.name}</h3>
                    <p className="text-earth-600 text-sm mb-4">{badge.description}</p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-earth-600">Progress</span>
                        <span className="font-semibold">{badge.progress}/{badge.maxProgress}</span>
                      </div>
                      <div className="w-full bg-earth-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            badge.unlocked ? 'bg-green-500' : 'bg-primary-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Requirement */}
                    <p className="text-xs text-earth-500 mb-3">{badge.requirement}</p>

                    {/* Unlock Date */}
                    {badge.unlocked && badge.unlockedDate && (
                      <div className="text-xs text-green-600 font-medium">
                        Unlocked on {new Date(badge.unlockedDate).toLocaleDateString()}
                      </div>
                    )}

                    {/* Category */}
                    <div className="mt-4 pt-4 border-t border-earth-100">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const CategoryIcon = getCategoryIcon(badge.category)
                          return <CategoryIcon className="w-4 h-4 text-earth-500" />
                        })()}
                        <span className="text-xs text-earth-500 capitalize">{badge.category}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Gamification 